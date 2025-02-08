import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await request.json();

    // Extract fields from the request; default to null if undefined
    const {
      playerID = null,
      playerInput = null,
      playerScore = null,
      targetWordId = null,
      isHint = null,
      isSurrender = null,
      difficulty = null,
    } = body;

    const { data, error } = await supabase
      .from('action')
      .insert([
        {
          player_id: playerID,
          playerInput,
          player_score: playerScore,
          target_word_id: targetWordId,
          isHint,
          isSurrender,
          difficulty,
        },
      ])
      .select('*'); // Returns the newly created record(s)

    // Handle any Supabase error
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the new row(s)
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    // Log the error so "err" is not unused
    console.error('[POST /api/data/action] Caught error:', err);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
