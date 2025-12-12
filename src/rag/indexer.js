// indexer.js
import fs from "fs";
import path from "path";

// Read document text
export function readDocument(filePath) {
  // If already absolute, use it directly; otherwise, resolve relative to project root
  const absPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  return fs.readFileSync(absPath, "utf-8");
}

// Correct chunking function
export function chunkText(text, filePath, chunkSize = 500) {
  const chunks = [];
  const docId = path.basename(filePath); // e.g. "notes.txt"

  let index = 0;
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({
      text: text.slice(i, i + chunkSize), // REAL text
      chunkIndex: index++,
      docId, // ONLY filename
      page: 0
    });
  }

  return chunks;
}
