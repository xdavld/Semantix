import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Replace with your actual Supabase import

interface Action {
  action_id: number;
  created_at: string;
  player_id: string;
  player_input: string | null;
  player_score: string | null;
  target_word_id: string;
  isHint: boolean | null;
  isSurrender: boolean | null;
  difficulty: string;
  isWin: boolean | null;
}

export async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, targetWordId, difficulty } = body;

    console.log("Prüfung auf bestehenden Eintrag für:");
    console.log(`player_id: ${playerId}, target_word_id: ${targetWordId}, difficulty: ${difficulty}`);

    // Check if an entry already exists
    const { data: existingEntry, error: checkError } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("player_id", playerId)
      .eq("target_word_id", targetWordId)
      .eq("difficulty", difficulty)
      .single();

    if (checkError) {
      console.error("Fehler bei der Prüfung des bestehenden Eintrags:", checkError);
    } else {
      console.log("Gefundener bestehender Eintrag:", existingEntry);
    }

    if (checkError && checkError.code !== "PGRST116") { // PGRST116 means, nothing found
      return NextResponse.json(
        { error: "Fehler bei der Prüfung des Leaderboard-Eintrags" },
        { status: 500 }
      );
    }

    if (existingEntry) {
      console.log("Eintrag existiert bereits!");
      return NextResponse.json(
        { error: "Eintrag existiert bereits für diesen Spieler, Schwierigkeit und Zielwort." },
        { status: 400 }
      );
    }

    console.log("Kein bestehender Eintrag gefunden. Weiter mit dem Einfügen...");

    // Get actions from the action endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const response = await fetch(
      `${baseUrl}/api/data/action?player_id=${playerId}&target_word_id=${targetWordId}&difficulty=${difficulty}`
    );

    if (!response.ok) {
      console.error("Fehler beim Abrufen der Aktionen:", response.statusText);
      return NextResponse.json(
        { error: "Fehler beim Abrufen der Aktionsdaten" },
        { status: 500 }
      );
    }

    const { data: actions }: { data: Action[] } = await response.json();
    console.log("Erhaltene Aktionen:", actions);

    const sumGuesses = actions.filter(action => action.player_input !== null).length;
    const sumHint = actions.filter(action => action.isHint === true).length;
    const isSurrender = actions.some(action => action.isSurrender === true);

    console.log(`Berechnete Werte - sum_guesses: ${sumGuesses}, sum_hint: ${sumHint}, is_surrender: ${isSurrender}`);

    // Insert the new leaderboard entry
    const { data: leaderboardData, error } = await supabase
      .from("leaderboard")
      .insert([
        {
          player_id: playerId,
          target_word_id: targetWordId,
          difficulty,
          sum_guesses: sumGuesses,
          sum_hint: sumHint,
          is_surrender: isSurrender,
        },
      ])
      .select("*");

    if (error) {
      console.error("Fehler beim Einfügen in das Leaderboard:", error);
      return NextResponse.json(
        { error: "Fehler beim Einfügen in das Leaderboard" },
        { status: 500 }
      );
    }

    console.log("Neuer Eintrag erfolgreich erstellt:", leaderboardData);

    return NextResponse.json({ data: leaderboardData }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/data/leaderboard] Fehler aufgefangen:", err);
    return NextResponse.json(
      { error: "Fehler bei der Verarbeitung der Anfrage" },
      { status: 500 }
    );
  }
}
