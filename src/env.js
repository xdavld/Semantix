import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    PINECONE_API_KEY: z.string(),
    PINECONE_INDEX_NAME_DE_EASY: z.string(),
    PINECONE_INDEX_HOST_DE_EASY: z.string().url(),
    PINECONE_INDEX_NAME_DE_HARD: z.string(),
    PINECONE_INDEX_HOST_DE_HARD: z.string().url(),
    PINECONE_INDEX_NAME_EN_EASY: z.string(),
    PINECONE_INDEX_HOST_EN_EASY: z.string().url(),
    PINECONE_INDEX_NAME_EN_HARD: z.string(),
    PINECONE_INDEX_HOST_EN_HARD: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_INDEX_NAME_DE_EASY: process.env.PINECONE_INDEX_NAME_DE_EASY,
    PINECONE_INDEX_HOST_DE_EASY: process.env.PINECONE_INDEX_HOST_DE_EASY,
    PINECONE_INDEX_NAME_DE_HARD: process.env.PINECONE_INDEX_NAME_DE_HARD,
    PINECONE_INDEX_HOST_DE_HARD: process.env.PINECONE_INDEX_HOST_DE_HARD,
    PINECONE_INDEX_NAME_EN_EASY: process.env.PINECONE_INDEX_NAME_EN_EASY,
    PINECONE_INDEX_HOST_EN_EASY: process.env.PINECONE_INDEX_HOST_EN_EASY,
    PINECONE_INDEX_NAME_EN_HARD: process.env.PINECONE_INDEX_NAME_EN_HARD,
    PINECONE_INDEX_HOST_EN_HARD: process.env.PINECONE_INDEX_HOST_EN_HARD,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
