import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Supabase Client

export async function handleGet(request: NextRequest) {
  try {
    // Extract query parameters: target_word_id and difficulty
    const { searchParams } = new URL(request.url);
    const targetWordId = searchParams.get("target_word_id");
    const difficulty = searchParams.get("difficulty");

    // Check if both parameters are provided
    if (!targetWordId || !difficulty) {
      return NextResponse.json(
        { error: "Both target_word_id and difficulty are required." },
        { status: 400 }
      );
    }

    // Fetch leaderboard data from the 'leaderboard' table
    const { data, error } = await supabase
      .from("leaderboard")
      .select(
        "player_id, target_word_id, difficulty, sum_guesses, sum_hint, is_surrender"
      )
      .eq("target_word_id", targetWordId)
      .eq("difficulty", difficulty)
      .order("sum_guesses", { ascending: false }); // Sort by sum_guesses in descending order

    // Handle any errors during the fetch operation
    if (error) {
      console.error("Error fetching leaderboard data:", error);
      return NextResponse.json(
        { error: "Error fetching leaderboard data" },
        { status: 500 }
      );
    }

    // Return the fetched leaderboard data
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/data/leaderboard] Caught error:", err);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
