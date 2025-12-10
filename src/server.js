// src/server.js
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { indexFile } from "./rag/indexer.js";
import { ragChat } from "./rag/ragChat.js";

const app = express();
app.use(cors());
app.use(express.json());

// Serve a simple health route
app.get("/", (req, res) => res.send("Gemini RAG server running"));

// Endpoint to (re)index documents into vectorStore.json
// Call: POST /index  (body optional: { path: "data/notes.txt" })
app.post("/index", async (req, res) => {
  try {
    // you can accept a path in body; default to data/notes.txt
    const filePath = req.body?.path || "data/notes.txt";
    // IMPORTANT: indexer expects to be called from project root. run it accordingly.
    await indexFile(filePath);
    return res.json({ success: true, message: "Indexing completed." });
  } catch (err) {
    console.error("Index error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Chat endpoint that uses RAG
app.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;
    if (!message) return res.status(400).json({ success: false, error: "Message required" });

    const reply = await ragChat(message);
    return res.json({ success: true, reply });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Serve static UI if you have one in ../../public (optional)
const staticPath = path.join(process.cwd(), "public");
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Gemini RAG server listening on ${PORT}`));
