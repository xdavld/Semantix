import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
  throw new Error("PINECONE_API_KEY is not defined");
}
const indexName = process.env.PINECONE_INDEX_NAME;
if (!indexName) {
  throw new Error("PINECONE_INDEX_NAME is not defined");
}

const indexHost = process.env.PINECONE_INDEX_HOST;
if (!indexHost) {
  throw new Error("PINECONE_INDEX_HOST is not defined");
}

const pc = new Pinecone({ apiKey });
const index = pc.index(indexName, indexHost);

function loadWordsFromFile(): string[] {
  // Attempt reading 'openthesaurus_processed.txt' from project root
  const filePath = path.join(
    process.cwd(),
    "/backend/data/openthesaurus_processed.txt"
  );
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Error reading openthesaurus_processed.txt:", error);
    return [];
  }
}

// Keep these in global scope so they aren't re-initialized every call
const possibleWords = loadWordsFromFile();
let dailyTargetWord: string | null = null;
let lastDateUsed: string | null = null;

// Helper to get today's date (YYYY-MM-DD)
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

// Choose a new random word if the day changed or if none chosen yet
function getDailyTargetWord(): string {
  const today = getTodayDateString();
  if (!dailyTargetWord || lastDateUsed !== today) {
    if (possibleWords.length === 0) {
      console.warn("No words loaded from file. Falling back to default.");
      dailyTargetWord = "Fehler";
    } else {
      const randIndex = Math.floor(Math.random() * possibleWords.length);
      dailyTargetWord = possibleWords[randIndex];
    }
    lastDateUsed = today;
  }
  return dailyTargetWord;
}

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
      return NextResponse.json(
        { status: 404 }
      );
    }

    // Grab ID from the first query match
    const typedInWordId = firstQuery.matches[0].id;

    // Get the "daily" random word
    const dailyWord = getDailyTargetWord();

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