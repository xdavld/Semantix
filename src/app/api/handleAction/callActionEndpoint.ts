/**
 * Ruft den Action-Endpunkt mit einem minimalen Payload auf.
 * Es werden nur die für die Speicherung relevanten Felder übermittelt.
 * @param payload - Enthält playerID, playerInput, targetWord und difficulty.
 * @throws Error, falls der Action-Request fehlschlägt.
 */
export async function callActionEndpoint(payload: {
  playerId: string;
  playerInput: string;
  targetWordId: string;
  difficulty: string;
}): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  const response = await fetch(`${baseUrl}/api/data/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error calling the action endpoint");
  }
}
