import express from "express";
import cors from "cors";
import { setupIndex, indexDocument, listDocs, queryRAG } from "./rag/ragService.js";

const app = express();
app.use(cors());
app.use(express.json());

await setupIndex();

// Serve a simple health route
app.get("/", (req, res) => res.send("Gemini RAG server running"));

// Trigger indexing
app.post("/index", async (req, res) => {
  const filePath = req.body.file || "data/notes.txt";
  const result = await indexDocument(filePath);
  res.json(result);
});

// List indexed docs
app.get("/docs", async (req, res) => {
  const docs = await listDocs();
  res.json(docs);
});

// Query RAG
app.post("/query", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ reply: "Please provide a question." });

  const answer = await queryRAG(question);
  res.json({ reply: answer });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
