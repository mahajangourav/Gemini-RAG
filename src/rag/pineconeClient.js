import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  maxRetries: 5,
});

export async function initPinecone() {
  return pinecone.Index(process.env.PINECONE_INDEX_NAME); // index name
}
