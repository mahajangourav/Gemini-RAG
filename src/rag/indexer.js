import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

// Read document text (for txt files)
export function readDocument(filePath) {
  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt") {
    return fs.readFileSync(absPath, "utf-8");
  }

  throw new Error("readDocument only supports .txt; use readPdfByPage for PDFs");
}

// PDF page-aware reader
export async function readPdfByPage(filePath) {
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();

  // split by page (\f = page break)
  const pages = data.text.split("\f").map(p => p.trim()).filter(p => p.length > 0);
  return pages;
}

// Chunking function for any text
export function chunkText(text, filePath, chunkSize = 800, overlap = 150, page = 0) {
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
      page,
      type: "text"
    });
    start += chunkSize - overlap;
  }

  return chunks;
}
