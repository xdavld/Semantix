// src/app/api/handleAction/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { callPinecone, PineconeResponse } from './callPinecone';
import { callActionEndpoint } from './callActionEndpoint';

/**
 * Der handleAction-Endpunkt:
 * - Parst den eingehenden JSON-Body.
 * - Leitet "Typedinword" an den Pinecone-Endpunkt weiter und gibt dessen Antwort zurück.
 * - Ruft zusätzlich den Action-Endpunkt auf, dessen Ergebnis nicht an den Client weitergegeben wird.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { Typedinword, playerID, difficulty, targetWordId } = body;

    if (!Typedinword) {
      return NextResponse.json(
        { error: 'Missing field "Typedinword"' },
        { status: 400 }
      );
    }

    // Aufruf des Pinecone-Endpunkts; hier erhalten wir direkt einen PineconeResponse.
    const pineconeResult: PineconeResponse = await callPinecone(Typedinword);
    console.log('Pinecone response:', JSON.stringify(pineconeResult, null, 2));

    // Extrahiere den Score aus dem ersten Treffer (falls vorhanden)
    const playerScore = pineconeResult.matches?.[0]?.score ?? null;

    try {
      const actionPayload = {
        playerID: playerID,
        playerInput: Typedinword,
        targetWordId: targetWordId,
        difficulty: difficulty,
        playerScore: playerScore,
      };
      await callActionEndpoint(actionPayload);
    } catch (actionError) {
      console.error('Error calling action endpoint:', actionError);
      // Fehler beim Action-Call sollen das Pinecone-Ergebnis nicht beeinflussen.
    }

    // Es wird ausschließlich das Ergebnis des Pinecone-Endpunkts zurückgegeben.
    return NextResponse.json(pineconeResult);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
