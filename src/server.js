// src/server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const pdf = require("pdf-parse");
import { PDFParse } from "pdf-parse";
import { setupIndex, indexDocument, listDocs, queryRAG } from "./rag/ragService.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

 // The main function is the root of the imported module

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,"_")}`)
});
const upload = multer({ storage });

await setupIndex();

app.get("/", (_, res) => res.send("Gemini RAG server running"));

app.post("/index", async (req, res) => {
  try {
    const filePath = req.body.file || "data/notes.txt";
    const result = await indexDocument(filePath);
    return res.json(result);
  } catch (err) {
    console.error("Index error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

app.post("/index/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uploadedPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const tmpTextPath = path.join(UPLOAD_DIR, `${req.file.filename}.txt`);

    if (ext === ".txt") {
      fs.copyFileSync(uploadedPath, tmpTextPath);
    } else if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(uploadedPath);
      // const data = await pdf(dataBuffer);
      // fs.writeFileSync(tmpTextPath, data.text, "utf-8");\
      // ⭐️ FIX: Instantiate the PDFParse class
      const parser = new PDFParse({ data: dataBuffer });
      
      // ⭐️ FIX: Call the getText method
      const data = await parser.getText();
      console.log("pdf data...............", data)

      
      fs.writeFileSync(tmpTextPath, data.text, "utf-8");
      
      // ⭐️ Recommended: Clean up
      await parser.destroy();
    } else {
      return res.status(415).json({ error: "Unsupported file type. Supported: .txt, .pdf" });
    }

    const result = await indexDocument(tmpTextPath);
    res.json({ message: "File indexed successfully", detail: result });
  } catch (err) {
    console.error("Index-file error:", err);
    res.status(500).json({ error: String(err) });
  } finally {
    // Clean up
    fs.unlinkSync(uploadedPath);
    if (fs.existsSync(tmpTextPath)) fs.unlinkSync(tmpTextPath);
  }
});

app.get("/docs", async (req, res) => {
  try {
    const docs = await listDocs();
    res.json(docs);
  } catch (err) {
    console.error("List docs error:", err);
    res.status(500).json({ error: String(err) });
  }
});

app.post("/query", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        error: "Please provide a question."
      });
    }
    const { answer, sources } = await queryRAG(question);
    res.json({
      answer,
      sources
    });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({
      error: "Failed to process query"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
