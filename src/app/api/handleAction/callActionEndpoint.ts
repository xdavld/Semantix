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
