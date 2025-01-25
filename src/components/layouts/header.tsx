import { headers } from "next/headers";
import { SiteHeader } from "@/components/layouts/site-header";

export async function HeaderConditional() {
  const headerList = await headers();
  const hideHeader = headerList.get("x-hidden-header");

  if (hideHeader === "true") return null;

  return <SiteHeader />;
}
