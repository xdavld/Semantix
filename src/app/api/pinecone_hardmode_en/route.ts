import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { getDailyTargetWord } from "@/lib/dailyTargetWord";
import { supabase } from "@/lib/supabase";

// Hilfsfunktion: Zielwort anhand der übergebenen targetWordId holen
async function getTargetWordById(
  targetWordId: number,
  combinedKey: string
): Promise<string> {
  console.log("getTargetWordById aufgerufen mit ID:", targetWordId);
  const { data, error } = await supabase
    .from("targetWord")
    .select("*")
    .eq("target_word_id", targetWordId)
    .single();
  if (error || !data) {
    console.error(
      "Fehler beim Abrufen des Zielworts mit ID",
      targetWordId,
      error
    );
    return "Fehler";
  }
  console.log("Daten für targetWordId", targetWordId, ":", data);
  return data[combinedKey] || "Fehler";
}

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) throw new Error("PINECONE_API_KEY is not defined");
const indexName = process.env.PINECONE_INDEX_NAME_EN_HARD;
if (!indexName) throw new Error("PINECONE_INDEX_NAME is not defined");
const indexHost = process.env.PINECONE_INDEX_HOST_EN_HARD;
if (!indexHost) throw new Error("PINECONE_INDEX_HOST is not defined");

const pc = new Pinecone({ apiKey });
const index = pc.index(indexName, indexHost);
const difficulty = "en_hard";

export async function POST(request: NextRequest) {
  try {
    // Logge den rohen Request-Body, um zu prüfen, was ankommt:
    const rawBody = await request.text();
    console.log("Roh-Body in handleAction:", rawBody);

    // Jetzt den Body als JSON parsen:
    const parsedBody = JSON.parse(rawBody);
    console.log("Parsed Body:", parsedBody);

    const { Typedinword, targetWordId: providedTargetWordId } = parsedBody;
    console.log("Empfangene providedTargetWordId:", providedTargetWordId);

    let targetWord: string;
    if (providedTargetWordId) {
      targetWord = await getTargetWordById(
        Number(providedTargetWordId),
        difficulty
      );
    } else {
      targetWord = await getDailyTargetWord(difficulty);
    }

    console.log("Final verwendetes Zielwort:", targetWord);

    // 1. Query: Finde in Pinecone den Eintrag, der dem Zielwort entspricht
    const firstQuery = await index.namespace("").query({
      vector: Array(1024).fill(0),
      topK: 1,
      includeMetadata: true,
      filter: { word: { $eq: targetWord } },
    });

    if (!firstQuery.matches || firstQuery.matches.length === 0) {
      console.error("Kein Eintrag in Pinecone für Zielwort:", targetWord);
      return NextResponse.json({
        status: 404,
        message: "Target word not found",
      });
    }

    const targetWordIdFromPinecone = firstQuery.matches[0].id;
    console.log("Pinecone targetWordId:", targetWordIdFromPinecone);

    const fetchVector = await index
      .namespace("")
      .fetch([targetWordIdFromPinecone]);
    const recordKey = Object.keys(fetchVector.records)[0];
    const vectorValues = fetchVector.records[recordKey].values;

    const secondQuery = await index.namespace("").query({
      vector: vectorValues,
      topK: 500,
      includeMetadata: true,
    });

    if (!secondQuery.matches || secondQuery.matches.length === 0) {
      console.error("Keine Matches in Pinecone gefunden.");
      return NextResponse.json({ status: 404, message: "No matches found" });
    }

    const typedWordMatch = secondQuery.matches.findIndex(
      (match) => match.metadata?.word === Typedinword
    );
    const position = typedWordMatch >= 0 ? typedWordMatch + 1 : null;
    console.log("Position des eingegebenen Wortes:", position);

    return NextResponse.json({
      typedWord: Typedinword,
      targetWord: targetWord,
      position: position,
      totalMatches: secondQuery.matches.length,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { detail: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
