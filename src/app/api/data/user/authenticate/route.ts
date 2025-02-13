import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing "email" or "password" in request body' },
        { status: 400 }
      );
    }

    // Select player_id, playerName, and password to compare
    const { data, error } = await supabase
      .from('user')
      .select('player_id, playerName, password')
      .eq('email', email)
      .single();

    if (error) {
      // Typically means no user found or another DB error
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Compare the provided password with the one in the DB
    if (data.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Return player_id and playerName on success
    return NextResponse.json(
      {
        player_id: data.player_id,
        playerName: data.playerName,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[POST /api/user/authenticate] Caught error:', err);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
