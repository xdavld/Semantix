import { NextRequest, NextResponse } from "next/server";
import { callPinecone, PineconeResponse } from "./callPinecone";
import { callActionEndpoint } from "./callActionEndpoint";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { Typedinword, playerId, difficulty, targetWordId } = body;

    if (!Typedinword) {
      return NextResponse.json(
        { error: 'Missing field "Typedinword"' },
        { status: 400 }
      );
    }

    // Call the Pinecone endpoint using the selected difficulty and targetWordId.
    const pineconeResult: PineconeResponse = await callPinecone(
      Typedinword,
      difficulty,
      targetWordId
    );

    // Extract the score from the first match (if available)
    const playerScore = pineconeResult.matches?.[0]?.score ?? null;

    try {
      const actionPayload = {
        playerId,
        playerInput: Typedinword,
        targetWordId,
        difficulty,
        playerScore,
      };
      await callActionEndpoint(actionPayload);
    } catch (actionError) {
      console.error("Error calling action endpoint:", actionError);
      // Any errors from the action call should not affect the Pinecone result.
    }

    // Return the Pinecone result to the client.
    return NextResponse.json(pineconeResult);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
