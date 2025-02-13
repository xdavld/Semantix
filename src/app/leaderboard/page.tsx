"use client";

import React, { useState, useMemo } from "react";
import { Filters } from "./filters";
import { LeaderboardTable } from "./LeaderboardTable";

// Importiere die Card-Komponenten
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  // State für das Ein-/Ausblenden von "Surrender"
  const [hideSurrender, setHideSurrender] = useState(false);

  // State für die ausgewählte Spielnummer (Target Word ID)
  // Default auf "1"
  const [gameNumber, setGameNumber] = useState("1");

  // State für Schwierigkeitsgrad (leicht, mittel, schwer)
  // Default auf "leicht"
  const [difficulty, setDifficulty] = useState("leicht");

  // State für Sprache (deutsch, englisch)
  // Default auf "deutsch"
  const [language, setLanguage] = useState("deutsch");

  // Kombinierter Difficulty‐String, z. B. "de_easy", "en_hard"
  const difficultyQuery = useMemo(() => {
    const langMap: Record<string, string> = {
      deutsch: "de",
      englisch: "en",
    };
    const diffMap: Record<string, string> = {
      leicht: "easy",
      mittel: "medium",
      schwer: "hard",
    };

    if (language && difficulty) {
      return `${langMap[language]}_${diffMap[difficulty]}`;
    }
    return "";
  }, [language, difficulty]);

  return (
    <main className='mx-auto max-w-2xl px-4 py-6 space-y-8'>
      {/* Card 1: Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>
            Passe hier Spiel, Schwierigkeit und Sprache an.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Filters
            hideSurrender={hideSurrender}
            onHideSurrenderChange={setHideSurrender}
            gameNumber={gameNumber}
            onGameNumberChange={setGameNumber}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            language={language}
            onLanguageChange={setLanguage}
          />
        </CardContent>
        <CardFooter>
          {/* Hier könntest Du z.B. Buttons anzeigen, wenn Du möchtest */}
          <p className='text-sm text-muted-foreground'>
            &rarr; Änderung der Filter aktualisiert automatisch das Leaderboard
          </p>
        </CardFooter>
      </Card>

      {/* Card 2: Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            Aktuelle Daten basierend auf deinen Filtern
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable
            hideSurrender={hideSurrender}
            targetWordId={gameNumber}
            difficultyQuery={difficultyQuery}
          />
        </CardContent>
      </Card>
    </main>
  );
}
