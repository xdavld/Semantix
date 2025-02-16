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

const calculateGameId = (): number => {
  const startDate = new Date(2025, 0, 23); // 23. Januar 2025
  const today = new Date();

  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return 45074 + diffInDays;
};

export default function Page() {
  const [hideSurrender, setHideSurrender] = useState<boolean>(false);

  const [gameNumber, setGameNumber] = useState<string>(calculateGameId().toString());

  const [difficulty, setDifficulty] = useState<string>("leicht");

  const [language, setLanguage] = useState<string>("deutsch");

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
          </p>
        </CardFooter>
      </Card>

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
