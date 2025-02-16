import { NextRequest } from "next/server";
import { handleGet } from "./getAction";
import { handlePost } from "./postAction";

export async function GET(request: NextRequest) {
  return handleGet(request);
}

export async function POST(request: NextRequest) {
  return handlePost(request);
}


