// src/app/api/callPinecone.ts

export interface PineconeMatch {
  id: string;
  score: number;
  values: unknown[];
  metadata: unknown;
}

export interface PineconeResponse {
  matches: PineconeMatch[];
}

/**
 * Ruft den existierenden Pinecone-Endpunkt mit dem übergebenen Wort (Typedinword) auf.
 * @param typedInWord - Das vom Benutzer eingegebene Wort.
 * @returns Die JSON-Antwort des Pinecone-Endpunkts als PineconeResponse.
 * @throws Error, falls der Pinecone-Request fehlschlägt.
 */
export async function callPinecone(
  typedInWord: string
): Promise<PineconeResponse> {
  const payload = { Typedinword: typedInWord };
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  const response = await fetch(`${baseUrl}/api/pinecone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error calling the Pinecone endpoint');
  }

  // Mit der Type Assertion stellen wir sicher, dass der Rückgabewert als PineconeResponse behandelt wird.
  return response.json() as Promise<PineconeResponse>;
}
