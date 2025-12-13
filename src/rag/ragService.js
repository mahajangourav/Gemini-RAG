import { getEmbedding, getGeminiAnswer } from "../gemini.js";
import { initPinecone } from "./pineconeClient.js";
import { readDocument, readPdfByPage, chunkText } from "./indexer.js";
import fs from "fs";
import path from "path";

let index;

export async function setupIndex() {
  index = await initPinecone();
}

// Index a document into Pinecone (txt or pdf)
export async function indexDocument(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let chunks = [];

  if (ext === ".txt") {
    const text = readDocument(filePath);
    chunks = chunkText(text, filePath, 800, 150);
  } else if (ext === ".pdf") {
    const pages = await readPdfByPage(filePath);
    pages.forEach((pageText, pageIndex) => {
      const pageChunks = chunkText(pageText, filePath, 800, 150, pageIndex + 1);
      pageChunks.forEach(c => (c.type = "pdf"));
      chunks.push(...pageChunks);
    });
  } else {
    throw new Error("Unsupported file type. Supported: .txt, .pdf");
  }

  const vectors = [];

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk.text);

    vectors.push({
      id: `${chunk.docId}-${chunk.chunkIndex}`,
      values: embedding,
      metadata: {
        text: chunk.text,
        source: chunk.docId,
        chunkIndex: chunk.chunkIndex,
        page: chunk.page,
        type: chunk.type
      }
    });
  }

  // Batch upsert
  await index.upsert(vectors);

  return { message: `Indexed ${chunks.length} chunks from ${filePath}` };
}

// Query Pinecone + RAG pipeline
export async function queryRAG(query, topK = 4, allowedFiles = []) {
  const queryEmbedding = await getEmbedding(query);

  const result = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter: allowedFiles.length > 0 ? { source: { $in: allowedFiles } } : {}
  });

  if (!result.matches || result.matches.length === 0) {
    return {
      answer: "I couldn't find relevant information in the uploaded documents.",
      sources: []
    };
  }

  // Build context for LLM
  const context = result.matches
    .map((m, i) => `Source ${i + 1} (${m.metadata.source}, page ${m.metadata.page}):\n${m.metadata.text}`)
    .join("\n\n");

  const answer = await getGeminiAnswer(query, context);

  // Deduplicate sources
  const sourceMap = new Map();
  result.matches.forEach(m => {
    const key = m.metadata.source;
    if (!sourceMap.has(key)) {
      sourceMap.set(key, { source: m.metadata.source, pages: new Set(), chunks: [] });
    }
    const entry = sourceMap.get(key);
    entry.pages.add(m.metadata.page);
    entry.chunks.push(m.metadata.text);
  });

  const sources = Array.from(sourceMap.values()).map(s => ({
    source: s.source,
    pages: Array.from(s.pages).filter(p => p !== 0),
    preview: s.chunks[0]
  }));

  return { answer, sources };
}

// List indexed docs
export async function listDocs() {
  const res = await index.fetch({ ids: [] });
  return res.vectors.map(v => v.metadata);
}