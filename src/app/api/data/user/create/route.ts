// C:\Users\Power\src\Semantix\src\app\api\user\create\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password, email } = body;

    // Validate required fields
    if (!name || !password || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, password, email' },
        { status: 400 }
      );
    }

    // 1) Check if the email is already taken
    const { data: existingUser, error: existingUserError } = await supabase
      .from('user')
      .select('player_id')
      .eq('email', email)
      .single(); // returns one row or an error if none/multiple

    // If there's a DB error that is not "row not found"
    // "PGRST116" typically means no row found, which is fine (the email isn't used)
    if (existingUserError && existingUserError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: existingUserError.message },
        { status: 400 }
      );
    }

    // If we have a matching user already, email is in use
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already used by another account.' },
        { status: 400 }
      );
    }

    // 2) Insert the new user
    const { data, error } = await supabase
      .from('user')
      .insert([
        {
          playerName: name,
          password,
          email,
        },
      ])
      .select('player_id, playerName, email');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the newly created user record
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[POST /api/user/create] Caught error:', err);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
