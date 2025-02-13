import { NextRequest } from "next/server";
import { handleGet } from "./getAction"; // Import the handler for GET requests
import { handlePost } from "./postAction"; // Import the handler for POST requests

// Handle GET request
export async function GET(request: NextRequest) {
  return handleGet(request); // Forward the GET request to the handler
}

// Handle POST request
export async function POST(request: NextRequest) {
  return handlePost(request); // Forward the POST request to the handler
}

// If another HTTP method is used, Next.js expects methods to be directly exported,
// but you can add more methods if needed.
