import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Supabase Client

export async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("player_id");
    const targetWordId = searchParams.get("target_word_id");
    const difficulty = searchParams.get("difficulty");

    // Überprüfen der Parameter
    if (!playerId || !targetWordId || !difficulty) {
      return NextResponse.json(
        {
          error:
            "Alle Parameter (player_id, target_word_id, difficulty) müssen angegeben werden.",
        },
        { status: 400 }
      );
    }

    // Daten von Supabase abfragen
    const { data, error } = await supabase
      .from("action")
      .select("*")
      .eq("player_id", playerId)
      .eq("target_word_id", targetWordId)
      .eq("difficulty", difficulty);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json(
        { message: "Keine passenden Einträge gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/data/action] Caught error:", err);
    return NextResponse.json(
      { error: "Fehler bei der Abfrage" },
      { status: 500 }
    );
  }
}
