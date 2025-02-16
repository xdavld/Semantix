"use client";

import { useState, useMemo } from "react";
import { Filters } from "@/components/leaderboard/filters";
import { LeaderboardTable } from "@/components/leaderboard/leaderboardtable";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Funktion zur Berechnung der Game ID basierend auf dem aktuellen Datum
const calculateGameId = (): number => {
  const startDate = new Date(2025, 0, 23); // 23. Januar 2025
  const today = new Date();

  // Setze die Zeit auf Mitternacht, um Tagesunterschiede korrekt zu berechnen
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return 45074 + diffInDays;
};

export default function Page() {
  // State für das Ein-/Ausblenden von "Surrender"
  const [hideSurrender, setHideSurrender] = useState<boolean>(false);

  // State für die ausgewählte Spielnummer (Target Word ID) mit dynamischem Default-Wert
  const [gameNumber, setGameNumber] = useState<string>(calculateGameId().toString());

  // State für Schwierigkeitsgrad (leicht, mittel, schwer)
  const [difficulty, setDifficulty] = useState<string>("leicht");

  // State für Sprache (deutsch, englisch)
  const [language, setLanguage] = useState<string>("deutsch");

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

    return `${langMap[language]}_${diffMap[difficulty]}`;
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
          <p className='text-sm text-muted-foreground'>
            {/* Änderungen der Filter aktualisieren automatisch das Leaderboard */}
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
