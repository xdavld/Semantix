import { env } from "@/env";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Semantix",
  description: "Word guessing game about the meaning of words.",
  url:
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000",
  links: { github: "https://github.com/xdavld/Semantix" },
};
