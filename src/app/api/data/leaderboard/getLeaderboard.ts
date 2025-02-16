import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Supabase Client

export async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetWordId = searchParams.get("target_word_id");
    const difficulty = searchParams.get("difficulty");

    if (!targetWordId || !difficulty) {
      return NextResponse.json(
        { error: "Both target_word_id and difficulty are required." },
        { status: 400 }
      );
    }

    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from("leaderboard")
      .select(
        "player_id, target_word_id, difficulty, sum_guesses, sum_hint, is_surrender"
      )
      .eq("target_word_id", targetWordId)
      .eq("difficulty", difficulty)
      .order("sum_guesses", { ascending: false });

    console.log("leaderboardData:", leaderboardData);

    if (leaderboardError) {
      console.error("Error fetching leaderboard data:", leaderboardError);
      return NextResponse.json(
        { error: "Error fetching leaderboard data" },
        { status: 500 }
      );
    }

    if (!leaderboardData || leaderboardData.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const playerIds = leaderboardData.map((entry) => entry.player_id);
    const uniquePlayerIds = Array.from(new Set(playerIds));

    const { data: usersData, error: usersError } = await supabase
      .from("user")
      .select("player_id, playerName")
      .in("player_id", uniquePlayerIds);

    console.log("usersData:", usersData);

    if (usersError) {
      console.error("Error fetching users data:", usersError);
      return NextResponse.json(
        { error: "Error fetching users data" },
        { status: 500 }
      );
    }

    const userMap = new Map<number, string>();
    if (usersData && usersData.length > 0) {
      for (const user of usersData) {
        userMap.set(user.player_id, user.playerName);
      }
    }

    const enrichedData = leaderboardData.map(({ player_id, ...rest }) => ({
      ...rest,
      playerName: userMap.get(Number(player_id)) || "anonymous",
    }));

    console.log(enrichedData)
    return NextResponse.json({ data: enrichedData }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/data/leaderboard] Caught error:", err);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
