// src/rag/indexer.js
import fs from "fs";
import path from "path";
import { getEmbedding } from "../gemini.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Very small chunker: splits text into paragraphs (~by double newline)
 * For production use you should implement smarter chunking (overlap, tokens).
 */
function chunkText(text) {
  const parts = text
    .split(/\n\s*\n/)        // split by blank lines
    .map(p => p.trim())
    .filter(Boolean);
  // if too few chunks, fallback to sentence chunks
  if (parts.length === 0) {
    return text.match(/(.|[\r\n]){1,1000}/g) || [text];
  }
  return parts;
}

async function indexFile(filePath = path.join("..", "data", "notes.txt")) {
  const abs = path.join(__dirname, filePath);
  const text = fs.readFileSync(abs, "utf-8");
  const chunks = chunkText(text);

  const store = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Embedding chunk ${i+1}/${chunks.length}...`);
    const embedding = await getEmbedding(chunk);
    store.push({
      id: `${Date.now()}-${i}`,
      text: chunk,
      embedding
    });
  }

  // Save vector store to project root (vectorStore.json)
  fs.writeFileSync(path.join(process.cwd(), "vectorStore.json"), JSON.stringify(store, null, 2));
  console.log("✅ vectorStore.json created with", store.length, "chunks");
}

// Run indexer if called directly: node src/rag/indexer.js
if (import.meta.url === `file://${process.cwd()}/src/rag/indexer.js` || process.argv[1].endsWith("indexer.js")) {
  // Use relative path to data/notes.txt
  indexFile("../../data/notes.txt").catch(err => console.error(err));
}

export { indexFile };
