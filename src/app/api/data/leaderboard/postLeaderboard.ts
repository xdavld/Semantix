import { NextRequest, NextResponse } from "next/server";

// Assuming you have supabase configured somewhere in your project
import { supabase } from "@/lib/supabase"; // Replace with your actual Supabase import

// Define the shape of an 'action' object
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
    // Parse the request body to get player_id, target_word_id, and difficulty
    const body = await request.json();
    const { playerId, targetWordId, difficulty } = body;

    // Get the base URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    // Construct the URL for the /api/data/action endpoint
    const response = await fetch(
      `${baseUrl}/api/data/action?player_id=${playerId}&target_word_id=${targetWordId}&difficulty=${difficulty}`
    );

    // Check if the response is successful
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from action endpoint" },
        { status: 500 }
      );
    }

    // Parse the JSON data from the response
    const { data: actions }: { data: Action[] } = await response.json();

    // Calculate the number of attempts by counting non-null player_input
    const sumGuesses = actions.filter(
      (action: Action) => action.player_input !== null
    ).length;

    // Calculate the sum of isHint (count how many are true)
    const sumHint = actions.filter(
      (action: Action) => action.isHint === true
    ).length;

    // Check if there's any isSurrender field (if found, set is_surrender to true)
    const isSurrender = actions.some(
      (action: Action) => action.isSurrender === true
    );

    // Now insert or update the leaderboard table
    const { data: leaderboardData, error } = await supabase
      .from("leaderboard")
      .upsert([
        {
          player_id: playerId,
          target_word_id: targetWordId,
          difficulty,
          sum_guesses: sumGuesses, // Insert the calculated sum (number of guesses)
          sum_hint: sumHint, // Insert the calculated sum (number of hints)
          is_surrender: isSurrender, // Set is_surrender to true if there's any surrender
        },
      ])
      .select("*");

    // Handle any error during the upsert operation
    if (error) {
      console.error("Error inserting into leaderboard:", error);
      return NextResponse.json(
        { error: "Error inserting into leaderboard" },
        { status: 500 }
      );
    }

    // Return the inserted leaderboard data
    return NextResponse.json({ data: leaderboardData }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/data/leaderboard] Caught error:", err);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
