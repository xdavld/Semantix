import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layouts/site-header";
import { ThemeProvider } from "@/components/layouts/providers";
import { TailwindIndicator } from "@/components/layouts/tailwind-indicator";
import { HeaderConditional } from "@/components/layouts/header";
import { PlayerProvider } from "@/context/PlayerContext";


import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "contexto",
    "word-game",
    "puzzle-game",
    "semantic-game",
    "word-puzzle",
    "guessing-game",
    "language-game",
    "brain-teaser",
  ],
  authors: [
    {
      name: "David Kreismann, Leonard Eckert",
      url: "https://semantix-green.vercel.app/",
    },
  ],
  creator: "David Kreismann",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@sadmann17",
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="de_DE" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PlayerProvider> {/* Handeling Player */}
            <div className="relative flex min-h-screen flex-col">
              <HeaderConditional />
              <main className="flex-1">
                <div className="justify-center items-center md:py-12">
                  {children}
                </div>
              </main>
            </div>
          </PlayerProvider>
          <TailwindIndicator />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}