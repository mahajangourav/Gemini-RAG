# Gemini-RAG — Smart FAQ Bot (Retrieval-Augmented Generation)

## 🚀 Project Goal

Build a **Retrieval-Augmented Generation (RAG)** system using **Google Gemini + ChromaDB**, where users can upload documents and ask questions.
The answers are **grounded in actual uploaded content**, minimizing hallucinations.

This aligns with **real-world AI Engineer skills** required in SaaS/Support products.

---

## 🎯 Key Features

| Feature                          | Status |
| -------------------------------  | ------ |
| Load multipledocuments (PDF/Text)| ✔      |
| Chunk documents into segments    | ✔      |
| Generate Embeddings (Gemini)     | ✔      |
| Store vectors in ChromaDB        | ✔      |
| Similarity Search on User Query  | ✔      |
| Final grounded answer via LLM    | ✔      |

---

## 🧠 Why RAG?

Large Language Models alone hallucinate because they don’t know your private data.
Retrieval-Augmented Generation (RAG) solves this by:

* Provides **up-to-date information**
* Injecting **retrieved chunks into the LLM prompt**
* Reduces **hallucinations**
* Works with **private company data**
* Scales for **enterprise search + AI support tools**

---

## 🏗 High-Level Architecture

```text
┌───────────────┐
│    Frontend   │
│  (React/Vite) │
└───────┬───────┘
        │ REST API
        ▼
┌───────────────┐
│   Backend     │
│  (Express)    │
└───────┬───────┘
        │
        ▼
┌────────────────────┐
│  RAG Pipeline      │
│  - Chunking        │
│  - Embeddings      │
│  - Pinecone Search │
└───────┬────────────┘
        │
        ▼
┌────────────────────┐
│  Gemini LLM        │
│  Context-Aware     │
│  Answer Generation │
└────────────────────┘
```

---

## 📂 Folder Structure

```text
Gemini-RAG/
├── backend/
│   ├── rag/
│   │   ├── indexer.js        # Chunking + overlap strategy
│   │   ├── pineconeClient.js # Pinecone config
│   │   └── ragService.js     # Indexing & query logic
│   ├── gemini.js             # Gemini API config
│   ├── server.js             # Express server
│   ├── uploads/              # Uploaded files
│   ├── .env                  # Environment variables
│   ├── .env.sample           # Sample env file
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
└── README.md
```

---

## 🧩 Tech Stack

| Component       | Tool                     |
| --------------- | -------------------------|
| LLM             | Gemini                   |
| Vector Database | Pinecone                 |
| Backend         | Node.js + Express        |
| Embeddings      | Gemini Embeddings        |
| Frontend        | React + Vite             |
| Language        | JavaScript (ES Modules)  |
| Deployment      | Vercel (FE) + Render (BE)|

---

## 🧪 How It Works (RAG Flow)

1. **User uploads PDF/Text files**.
2. Files are **chunked** into small segments.
3. **Gemini embeddings** generated per chunk.
4. Chunks stored in **Pinecone vector database**.
5. User submits **query**.
6. Backend performs **similarity search** in vector DB.
7. Top-K chunks passed to **Gemini LLM**.
8. **Grounded answer** returned to user.

> If no context is found → Responds: “**Not available in document.**”

***Live demo is shared on request to manage LLM API usage.**

---

## ⚙️ Setup & Run

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Create .env files:

### Backend

```bash
GEMINI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_INDEX=your_index
```

### Frontend

```bash
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🔮 Future Improvements

* Add **multi-user authentication**
* Enhance **UI/UX** (loader, error handling)
* Add **analytics for queries**
* Extend to **AI Agents / Vision** integrations
* Deploy with **monitoring & logging**

---
