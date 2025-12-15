import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { setupIndex, indexDocument, queryRAG } from "./rag/ragService.js";
import dotenv from "dotenv";
import resumeJDRoutes from "./routes/resumeJD.routes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = new URL('.', import.meta.url).pathname;
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,"_")}`)
});
const upload = multer({ storage });

await setupIndex();

app.get("/", (_, res) => res.send("Gemini RAG server running"));

app.use("/api", resumeJDRoutes);

// Index via body file path
app.post("/index", async (req, res) => {
  try {
    const filePath = req.body.file;
    const result = await indexDocument(filePath);
    res.json(result);
  } catch (err) {
    console.error("Index error:", err);
    res.status(500).json({ error: String(err) });
  }
});

// Upload & index file
app.post("/index/file", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const uploadedPath = req.file.path;

  try {
    const result = await indexDocument(uploadedPath);
    res.json({ message: "File indexed successfully", detail: result });
  } catch (err) {
    console.error("Index-file error:", err);
    res.status(500).json({ error: String(err) });
  } finally {
    // Optional: keep uploaded file or delete
    if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
  }
});

// Query endpoint
app.post("/query", async (req, res) => {
  try {
    const { question, allowedFiles } = req.body;
    if (!question) {
      return res.status(400).json({ 
        error: "Please provide a question."
      });
    }
    const result = await queryRAG(question, 4, allowedFiles || []);
    res.json(result);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({
      error: "Failed to process query"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
