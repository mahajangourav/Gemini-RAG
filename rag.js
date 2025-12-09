import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Read file
const filePath = path.join("data", "notes.txt");
const text = fs.readFileSync(filePath, "utf-8");

// Generate embedding
export async function createEmbedding() {
  const result = await embeddingModel.embedContent(text);
  const embedding = result.embedding.values;

  console.log("📦 Vector store started!");

  // Store vector
  fs.writeFileSync("vectorStore.json", JSON.stringify({
    embedding,
    content: text
  }, null, 2));

  console.log("📦 Vector store created!");
}

createEmbedding();