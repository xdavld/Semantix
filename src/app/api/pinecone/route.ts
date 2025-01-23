import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
  throw new Error("PINECONE_API_KEY is not defined");
}
const pc = new Pinecone({ apiKey });

const index = pc.index(
  "Semantix",
  "https://semantix-0v5jd5i.svc.aped-4627-b74a.pinecone.io"
);

export async function POST(request: Request): Promise<Response> {
  try {
    // 1) Extract the words from the request body
    const { Typedinword, Targetword } = await request.json();

    // 2) First query: get the ID of the 'Typedinword'
    const firstQuery = await index.namespace("").query({
      // Using a dummy zero vector for the "vector" field just to run the filter.
      vector: Array(1024).fill(0),
      topK: 1,
      includeMetadata: true,
      filter: {
        word: { $eq: Typedinword },
      },
    });
    console.log("First query response:", firstQuery);

    if (!firstQuery.matches || firstQuery.matches.length === 0) {
      return new Response(
        JSON.stringify({
          error: `No vectors found for the word: ${Typedinword}`,
        }),
        { status: 404 }
      );
    }
    
    // Grab the ID from the first query match
    const typedInWordId = firstQuery.matches[0].id;

    // 3) Second query: use the found ID to measure similarity against 'Targetword'
    const secondQuery = await index.namespace("").query({
      id: typedInWordId,
      topK: 1,
      includeMetadata: true,
      filter: {
        word: { $eq: Targetword },
      },
    });
    console.log("Second query response:", secondQuery);

    return new Response(JSON.stringify(secondQuery), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ detail: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
