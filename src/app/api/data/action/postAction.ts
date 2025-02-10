import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body POST:", JSON.stringify(body, null, 2));
    const {
      playerId = null,
      playerInput = null,
      playerScore = null,
      targetWordId = null,
      isHint = null,
      isWin = null,
      isSurrender = null,
      difficulty = null,
    } = body;

    const { data, error } = await supabase
      .from("action")
      .insert([
        {
          player_id: playerId,
          playerInput,
          player_score: playerScore,
          target_word_id: targetWordId,
          isHint,
          isWin,
          isSurrender,
          difficulty,
        },
      ])
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/data/action] Caught error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
