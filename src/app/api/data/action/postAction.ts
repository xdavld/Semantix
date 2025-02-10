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

    // Insert the action data into Supabase
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

    // Check if the action insertion was successful
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If the player won or surrendered, trigger the leaderboard update asynchronously
    if (isWin === true || isSurrender === true) {
      // Trigger the async post request to update the leaderboard
      triggerLeaderboardUpdate(playerId, targetWordId, difficulty);
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

// Function to asynchronously trigger the leaderboard update
async function triggerLeaderboardUpdate(
  playerId: string,
  targetWordId: string,
  difficulty: string
) {
  const leaderboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/data/leaderboard`;

  const response = await fetch(leaderboardUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId,
      targetWordId,
      difficulty,
    }),
  });

  if (!response.ok) {
    console.error("Failed to update leaderboard");
  }
}
