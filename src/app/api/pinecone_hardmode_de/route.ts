import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { getDailyTargetWord } from "@/lib/dailyTargetWord";

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
  throw new Error("PINECONE_API_KEY is not defined");
}
const indexName = process.env.PINECONE_INDEX_NAME_DE_HARD;
if (!indexName) {
  throw new Error("PINECONE_INDEX_NAME is not defined");
}

const indexHost = process.env.PINECONE_INDEX_HOST_DE_HARD;
if (!indexHost) {
  throw new Error("PINECONE_INDEX_HOST is not defined");
}

const pc = new Pinecone({ apiKey });
const index = pc.index(indexName, indexHost);

const difficulty = "de_hard";
const dailyWord = await getDailyTargetWord(difficulty);

// ----- 2) Define the POST route -----
export async function POST(request: NextRequest) {
  try {
    // Parse body from request
    const { Typedinword } = await request.json();

    // First query: find typed word ID
    const firstQuery = await index.namespace("").query({
      vector: Array(1024).fill(0),
      topK: 1,
      includeMetadata: true,
      filter: {
        word: { $eq: Typedinword },
      },
    });

    if (!firstQuery.matches || firstQuery.matches.length === 0) {
      return NextResponse.json({ status: 404 });
    }

    // Grab ID from the first query match
    const typedInWordId = firstQuery.matches[0].id;

    // Second query: compare typed word to daily word
    const secondQuery = await index.namespace("").query({
      id: typedInWordId,
      topK: 1,
      includeMetadata: true,
      filter: {
        word: { $eq: dailyWord },
      },
    });

    return NextResponse.json(secondQuery);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { detail: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
