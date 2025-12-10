// src/gemini.js
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Embedding model config (adjust model name if needed)
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
// Chat/generation model config
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * getEmbedding(text)
 * returns Array<number>
 */
export async function getEmbedding(text) {
  const res = await embeddingModel.embedContent(text);
  // depending on SDK response shape:
  // res.embedding.values or res.response[...]
  // this assumes res.embedding.values
  return res?.embedding?.values ?? res?.response?.embedding ?? null;
}

/**
 * generateAIResponse(prompt)
 * returns string answer
 */
export async function generateAIResponse(prompt) {
  const res = await chatModel.generateContent(prompt);
  // response text is usually here:
  return res?.response?.text?.() ?? res?.response?.text ?? res?.response ?? JSON.stringify(res);
}
