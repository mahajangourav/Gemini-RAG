import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

export async function getEmbedding(text, dimension = 768) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Cannot create embedding: Input text must be a non-empty string.");
  }

  const result = await embeddingModel.embedContent({
    model: "models/gemini-embedding-001",
    content: {
      parts: [{ text }]
    },
    outputDimensionality: dimension
  });

  return result.embedding.values;
}


export async function getGeminiAnswer(prompt, context = "") {
  const fullPrompt = context ? `${context}\n\nQ: ${prompt}` : prompt;
  const result = await textModel.generateContent(fullPrompt);
  return result.response.text();
}

// ⭐️ Try running your test function again with the simplified call.