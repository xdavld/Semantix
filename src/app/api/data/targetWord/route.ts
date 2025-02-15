import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getDailyWordId(): number {
  const startId = 2; // Start ID ab 2
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return startId + (dayOfYear % 500); 
}

export async function GET(request: NextRequest) {
  const wordId = getDailyWordId();

  const { data, error } = await supabase
    .from("targetWord")
    .select("*")
    .eq("target_word_id", wordId) 
    .single();

  if (error) {
    console.error("Error fetching daily word:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
