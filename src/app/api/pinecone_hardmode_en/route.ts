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
if (!apiKey) {
  throw new Error("PINECONE_API_KEY is not defined");
}
const indexName = process.env.PINECONE_INDEX_NAME_EN_HARD;
if (!indexName) {
  throw new Error("PINECONE_INDEX_NAME is not defined");
}
const indexHost = process.env.PINECONE_INDEX_HOST_EN_HARD;
if (!indexHost) {
  throw new Error("PINECONE_INDEX_HOST is not defined");
}

const pc = new Pinecone({ apiKey });
const index = pc.index(indexName, indexHost);
const difficulty = "en_hard";

// Hole das tägliche Zielwort (als Fallback)
const dailyWord = await getDailyTargetWord(difficulty);

export async function POST(request: NextRequest) {
  try {
    // Parse den Request-Body und erhalte sowohl das eingegebene Wort als auch die targetWordId
    const { Typedinword, targetWordId: providedTargetWordId } =
      await request.json();
    console.log("Empfangene targetWordId:", providedTargetWordId);

    // Setze das Zielwort basierend auf providedTargetWordId oder verwende das dailyWord
    let targetWord: string;
    if (providedTargetWordId) {
      targetWord = await getTargetWordById(
        Number(providedTargetWordId),
        difficulty
      );
    } else {
      targetWord = dailyWord;
    }
    console.log("Verwendetes Zielwort:", targetWord);

    // ----- 1) Erster Query: Finde den Eintrag, der dem eingegebenen Wort entspricht -----
    const firstQuery = await index.namespace("").query({
      vector: Array(1024).fill(0),
      topK: 1,
      includeMetadata: true,
      filter: {
        word: { $eq: Typedinword },
      },
    });

    if (!firstQuery.matches || firstQuery.matches.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "Eingegebenes Wort nicht gefunden",
      });
    }

    // Hole die ID des eingegebenen Wortes aus der ersten Query
    const typedInWordId = firstQuery.matches[0].id;

    // ----- 2) Zweiter Query: Vergleiche das eingegebene Wort mit dem Zielwort -----
    // Hier wird z.B. geprüft, ob der Eintrag mit der ID des eingegebenen Wortes auch das Zielwort enthält.
    const secondQuery = await index.namespace("").query({
      id: typedInWordId,
      topK: 1,
      includeMetadata: true,
      filter: {
        word: { $eq: targetWord },
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
