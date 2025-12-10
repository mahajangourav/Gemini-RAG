// src/rag/ragChat.js
import { getEmbedding, generateAIResponse } from "../gemini.js";
import { similaritySearch } from "./vectorStore.js";

/**
 * ragChat(userQuery)
 * returns string reply (grounded)
 */
export async function ragChat(userQuery) {
  if (!userQuery || !userQuery.trim()) return "Please ask a valid question.";

  // 1) Embed the user query
  const qEmbedding = await getEmbedding(userQuery);

  // 2) Search for top-k chunks
  const results = similaritySearch(qEmbedding, 3); // top 3

  // If no relevant content or scores are low, return fallback
  if (!results.length || results[0].score < 0.2) {
    return "❌ Not available in the document.";
  }

  // Build context from retrieved chunks
  const context = results.map((r, i) => `Context ${i+1} (score: ${r.score.toFixed(3)}):\n${r.text}`).join("\n\n");

  // Prompt instructing model to use only the context
  const prompt = `You are a helpful assistant. Use ONLY the context below to answer the question. If answer cannot be found in the context, reply exactly: "Not available in the document."
CONTEXT: ${context}
QUESTION:${userQuery}`;

  // 3) Ask Gemini to generate a grounded answer
  const aiReply = await generateAIResponse(prompt);

  // You can post-process aiReply if needed
  return aiReply;
}
