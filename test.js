import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Load vector
const store = JSON.parse(fs.readFileSync("vectorStore.json", "utf-8"));

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function cosineSimilarity(a, b) {
  return dot(a, b) /
    (Math.sqrt(dot(a, a)) * Math.sqrt(dot(b, b)));
}

async function askRAG(query) {
  // Embed query
  const result = await genAI.getGenerativeModel({
    model: "text-embedding-004"
  }).embedContent(query);

  const queryEmbedding = result.embedding.values;

  // Compute similarity
  const similarity = cosineSimilarity(queryEmbedding, store.embedding);

  console.log("🔍 Similarity Score:", similarity.toFixed(3));

  const prompt = `Use ONLY the context below:${store.content} Question: ${query}`;

  const reply = await chatModel.generateContent(prompt);
  console.log("🤖 AI:", reply);
  console.log("🤖 AI:", reply.response.text());
}

askRAG("What is RAG?");
