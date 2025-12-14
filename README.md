Gemini-RAG — Smart Document Q&A System (Production-Ready RAG)
🚀 Project Goal

Build a production-ready Retrieval-Augmented Generation (RAG) system using Google Gemini + Vector Database, where users can upload documents and ask natural-language questions.

✅ Answers are strictly grounded in uploaded documents
❌ No hallucinated or out-of-context responses

This project mirrors real-world AI Engineer work in SaaS, support tools, and internal knowledge assistants.


🎯 Key Features

| Feature                             | Status |
| ----------------------------------- | ------ |
| Upload multiple PDF / TXT documents | ✅      |
| Automatic chunking with overlap     | ✅      |
| Generate embeddings using Gemini    | ✅      |
| Store vectors in Pinecone           | ✅      |
| Semantic similarity search          | ✅      |
| Context-aware answers with sources  | ✅      |
| Chat-style frontend UI              | ✅      |
| Environment-based config (prod/dev) | ✅      |
| Fully deployed (Frontend + Backend) | ✅      |


🧠 Why RAG?

Large Language Models alone hallucinate because they don’t know your private data.

Retrieval-Augmented Generation (RAG) solves this by:

✔ Fetching relevant document context first
✔ Injecting retrieved chunks into the LLM prompt
✔ Producing grounded, explainable answers
✔ Working with private & enterprise data
✔ Scaling for support bots, internal search & AI copilots

If no relevant context is found →
The system responds: “Not available in the document.”
(Interviewers love this 🔥)


🏗 High-Level Architecture

┌──────────────┐
│    User      │
│  (Frontend)  │
└──────┬───────┘
       │ Query
       ▼
┌────────────────────┐
│  Backend (Node.js) │
│  ───────────────── │
│  1. Embed Query    │
│  2. Vector Search  │
│  3. Build Context  │
└──────┬─────────────┘
       │ Top-K Chunks
       ▼
┌────────────────────┐
│   Pinecone Vector  │
│      Database      │
└──────┬─────────────┘
       │ Retrieved Context
       ▼
┌────────────────────┐
│   Gemini LLM       │
│ (Context + Prompt) │
└──────┬─────────────┘
       │ Answer + Sources
       ▼
┌────────────────────┐
│    User Output     │
└────────────────────┘


📂 Folder Structure

Gemini-RAG/
├── backend/
│   ├── rag/
│   │   ├── indexer.js
│   │   ├── pineconeClient.js
│   │   └── ragService.js
│   ├── gemini.js
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   ├── .env.sample
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── FileUploader.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.sample
│   └── package.json
│
├── README.md


🧩 Tech Stack

| Component  | Technology                |
| ---------- | ------------------------- |
| Frontend   | React + Vite              |
| Backend    | Node.js + Express         |
| LLM        | Google Gemini             |
| Embeddings | Gemini Embeddings         |
| Vector DB  | Pinecone                  |
| RAG        | Custom implementation     |
| Deployment | Vercel (FE) + Render (BE) |


🔐 Production Considerations

✔ Environment-based configs (.env)
✔ API keys never exposed to frontend
✔ Rate-limit ready architecture
✔ Modular RAG pipeline (easy to extend)

Live demo is shared on request to manage LLM API usage.


🧪 Testing Strategy

✔ Ask known questions from uploaded docs
✔ Verify retrieved chunks before generation
✔ Validate answer relevance
✔ Handle empty retrieval gracefully


🛠 Setup & Run (Local)
Backend
cd backend
npm install
npm start

Frontend
cd frontend
npm install
npm run dev

Create .env files:

backend

GEMINI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_INDEX=your_index


frontend

VITE_API_BASE_URL=http://localhost:5000


📌 Portfolio Note

This project is part of my transition from
Senior MERN Engineer → AI / GenAI Engineer

Future improvements:

Authentication & multi-user support
Metadata filtering
Retrieval evaluation metrics
Advanced chunking strategies
