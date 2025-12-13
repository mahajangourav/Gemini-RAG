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
export function chunkText(
  text,
  filePath,
  chunkSize = 800,
  overlap = 150
) {
  const chunks = [];
  const docId = path.basename(filePath);

  let index = 0;
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    chunks.push({
      text: text.slice(start, end),
      chunkIndex: index++,
      docId,
      page: 0, // keep for PDFs later
    });

    // move start forward with overlap
    start += chunkSize - overlap;
  }

  return chunks;
}
