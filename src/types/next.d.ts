import "@total-typescript/ts-reset";

declare module "next/server" {
  interface RequestHeaders {
    get(name: "x-hidden-header"): string | null;
  }
}
