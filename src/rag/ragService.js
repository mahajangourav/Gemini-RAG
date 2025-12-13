// vectorStore.js
import { getEmbedding, getGeminiAnswer } from "../gemini.js";
import { initPinecone } from "./pineconeClient.js";
import { readDocument, chunkText } from "./indexer.js";

let index;

export async function setupIndex() {
  index = await initPinecone();
}

// Index a document into Pinecone
export async function indexDocument(filePath) {
  const text = readDocument(filePath);
  const chunks = chunkText(text, filePath, 800, 150);
  const vectors = [];

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk.text);

    vectors.push({
      id: `${chunk.docId}-${chunk.chunkIndex}`,
      values: embedding,
      metadata: {
        text: chunk.text,
        source: chunk.docId,   // filename
        chunkIndex: chunk.chunkIndex,
        page: chunk.page,
        type: "text"
      }
    });
  }

  // Batch upsert (MUCH faster)
  await index.upsert(vectors);

  return {
    message: `Indexed ${chunks.length} chunks from ${filePath}`
  };
}

// Query Pinecone + RAG pipeline
export async function queryRAG(query, topK = 4) {
  const queryEmbedding = await getEmbedding(query);

  const result = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  });

  if (!result.matches || result.matches.length === 0) {
    return {
      answer: "I couldn't find relevant information in the uploaded documents.",
      sources: []
    };
  }

  // Structured context for LLM
  const context = result.matches
    .map((m, i) => {
      return `Source ${i + 1} (${m.metadata.source}, page ${m.metadata.page}):
${m.metadata.text}`;
    })
    .join("\n\n");

  const answer = await getGeminiAnswer(query, context);

  // Clean sources for UI
  const sources = result.matches.map(m => ({
    source: m.metadata.source,
    page: m.metadata.page,
    text: m.metadata.text
  }));

  return {
    answer,
    sources
  };
}

// List indexed docs metadata
export async function listDocs() {
  const res = await index.fetch({ ids: [] }); // fetch all
  return res.vectors.map(v => v.metadata);
}