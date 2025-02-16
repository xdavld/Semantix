export interface PineconeMatch {
  id: string;
  score: number;
  values: unknown[];
  metadata: any;
}

export interface PineconeResponse {
  matches: PineconeMatch[];
}

export async function callPinecone(
  typedInWord: string,
  difficulty: string,
  targetWordId?: string
): Promise<PineconeResponse> {
  const payload = { Typedinword: typedInWord, targetWordId };
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  let endpoint: string;
  switch (difficulty) {
    case "de_easy":
      endpoint = "/api/pinecone_easymode_de";
      break;
    case "de_hard":
      endpoint = "/api/pinecone_hardmode_de";
      break;
    case "en_easy":
      endpoint = "/api/pinecone_easymode_en";
      break;
    case "en_hard":
      endpoint = "/api/pinecone_hardmode_en";
      break;
    default:
      throw new Error(`Invalid difficulty: ${difficulty}`);
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error calling the Pinecone endpoint");
  }

  return response.json() as Promise<PineconeResponse>;
}
