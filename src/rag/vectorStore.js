// src/rag/vectorStore.js
import fs from "fs";

/** dot product */
function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/** cosine similarity */
function cosineSim(a, b) {
  const denom = Math.sqrt(dot(a, a) * dot(b, b));
  if (!denom) return 0;
  return dot(a, b) / denom;
}

/**
 * loadStore() -> array of {id, text, embedding}
 */
export function loadStore() {
  const path = "vectorStore.json";
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

/**
 * similaritySearch(queryEmbedding, topK)
 * returns array of {id, text, score}
 */
export function similaritySearch(queryEmbedding, topK = 3) {
  const store = loadStore();
  const scored = store.map(item => {
    const score = cosineSim(queryEmbedding, item.embedding);
    return { id: item.id, text: item.text, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
