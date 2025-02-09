// src/utils/action.ts

/**
 * Interface for the action parameters.
 */
export interface ActionParams {
  playerId?: string | null;
  playerInput?: string | null;
  playerScore?: number | null;
  targetWordId?: string | null;
  isHint?: boolean | null;
  isSurrender?: boolean | null;
  difficulty?: string | null;
}

/**
 * Interface for an action record returned by the API.
 * Adjust the fields as needed to match your database schema.
 */
export interface ActionRecord {
  id?: number | string;
  player_id: string | null;
  playerInput: string | null;
  player_score: number | null;
  target_word_id: string | null;
  isHint: boolean | null;
  isSurrender: boolean | null;
  difficulty: string | null;
}

/**
 * Interface for the API response.
 * It either contains a 'data' array or an 'error' message.
 */
export interface ActionResponse {
  data?: ActionRecord[];
  error?: string;
}

/**
 * Sends the provided parameters to the /api/data/action endpoint.
 *
 * @param params - The action parameters to be sent to the API.
 * @returns A promise resolving to the server's JSON response of type ActionResponse.
 * @throws An error if the request fails or the server returns an error.
 */
export async function sendActionData(
  params: ActionParams
): Promise<ActionResponse> {
  const response = await fetch("/api/data/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId: params.playerId ?? null,
      playerInput: params.playerInput ?? null,
      playerScore: params.playerScore ?? null,
      targetWordId: params.targetWordId ?? null,
      isHint: params.isHint ?? null,
      isSurrender: params.isSurrender ?? null,
      difficulty: params.difficulty ?? null,
    }),
  });

  if (!response.ok) {
    // Attempt to extract the error message from the response.
    const errorData = (await response.json()) as ActionResponse;
    throw new Error(errorData.error || "Failed to send data");
  }

  // Return the server response as JSON, explicitly typed as ActionResponse.
  return response.json() as Promise<ActionResponse>;
}
