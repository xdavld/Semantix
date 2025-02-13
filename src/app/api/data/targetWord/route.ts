// app/api/targetWord/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Wenn eine ID als Query-Parameter übergeben wurde, nur den passenden Eintrag zurückliefern.
  // Ansonsten einfach alle Einträge ausgeben.
  let query = supabase.from('targetWord').select('*');

  if (id) {
    query = query.eq('id', id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
