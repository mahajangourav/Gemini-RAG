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
  const chunks = chunkText(text, filePath);

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk.text);

    await index.upsert([
      {
        id: `${chunk.docId}-${chunk.chunkIndex}`,
        values: embedding,
        metadata: {
          text: chunk.text,       // CORRECT
          chunkIndex: chunk.chunkIndex,
          docId: chunk.docId
        }
      }
    ]);
  }

  return {
    message: `Indexed ${chunks.length} chunks from ${filePath}`
  };
}

// Query Pinecone + RAG pipeline
export async function queryRAG(query, topK = 3) {
  const queryEmbedding = await getEmbedding(query);

  const result = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  });

  const context = result.matches
    .map(m => m.metadata.text)
    .join("\n");

  const answer = await getGeminiAnswer(query, context);

  return {
    matches: result.matches,
    context,
    answer
  };
}

// List indexed docs metadata
export async function listDocs() {
  const res = await index.fetch({ ids: [] }); // fetch all
  return res.vectors.map(v => v.metadata);
}