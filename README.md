Gemini-RAG — Smart FAQ Bot (Retrieval-Augmented Generation)
🚀 Project Goal

Build a Retrieval-Augmented Generation (RAG) system using Google Gemini + ChromaDB, where users can upload documents and ask questions.
The answer must come from the actual stored content, not hallucination.

This aligns with real-world AI Engineer skills required in SaaS/Support products.

🎯 Key Features
Feature	Status
Load documents (PDF/Text)	✔
Chunk documents into small segments	✔
Generate Embeddings (Gemini)	✔
Store vectors in ChromaDB	✔
Similarity Search on User Query	✔
Final grounded answer via LLM	✔
🧠 Why RAG?

RAG allows LLMs to retrieve real knowledge instead of guessing.

✔ Up-to-date information
✔ More accurate, fewer hallucinations
✔ Works with private company data (secure)
✔ Scales for enterprise search + AI support tools

🏗 Architecture Diagram
        ┌────────────────┐
        │   User Query   │
        └───────┬────────┘
                │ (Embedding)
                ▼
        ┌──────────────────┐
        │    Vector DB     │  ← Stored Embeddings
        │    (Chroma)      │
        └───────┬──────────┘
        │ Top-K Chunks Retrieved
                ▼
        ┌──────────────────┐
        │   Gemini Model   │  ← Combines context + knowledge
        └───────┬──────────┘
                │ Final Answer
                ▼
        ┌──────────────────┐
        │   User Output    │
        └──────────────────┘

📂 Folder Structure
Gemini-RAG/
 ├── data/              # PDF/Text files to index for search
 ├── docs/              # Design docs, architecture, planning
 ├── src/
 │   ├── rag/
 │   │   ├── indexer.js   # Chunking + embedding + store in DB
 │   │   ├── querier.js   # Query + vector search
 │   │   ├── chunker.js   # Modular text chunking logic
 │   ├── server.js        # API server (Express)
 │   ├── gemini.js        # Gemini API Helper
 ├── tests/              # Unit tests for RAG flows
 ├── request-log.txt     # Logs user queries (Future analytics)
 ├── package.json
 ├── README.md

🧩 Tech Stack
Component	Tool
LLM	Gemini
Vector Database	ChromaDB
Backend	Node.js + Express
Embeddings	Gemini Embeddings
Language	JavaScript (ES Modules)
🧪 Test Plan

✔ Ask known questions from uploaded docs
✔ Check similarity score + retrieved chunks
✔ AI should never answer outside provided data

If no context found → Respond: “Not available in document.”
(Interviewers love this detail ✔)

🛠 Setup & Run
npm install
npm start


To Index Documents:

node src/rag/indexer.js


To Test Query:

node src/rag/querier.js
