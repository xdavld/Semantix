"use client";

import React, { useState, useMemo } from "react";
import { Filters } from "./filters";
import { LeaderboardTable } from "./LeaderboardTable";

export default function Page() {
  // State für das Ein-/Ausblenden von "Surrender"
  const [hideSurrender, setHideSurrender] = useState(false);

  // State für die ausgewählte Spielnummer (Target Word ID)
  const [gameNumber, setGameNumber] = useState("1");

  // State für den Schwierigkeitsgrad („leicht“, „mittel“, „schwer“)
  const [difficulty, setDifficulty] = useState("leicht");

  // State für die Sprache („deutsch“, „englisch“)
  const [language, setLanguage] = useState("deutsch");

  // Kombinierter Difficulty‐String: z. B. "de_easy", "en_hard", usw.
  const difficultyQuery = useMemo(() => {
    // Kleine Hilfsfunktionen, um die Selektor‐Werte nach dem gewünschten Schema zu mappen
    const langMap: Record<string, string> = {
      deutsch: "de",
      englisch: "en",
    };
    const diffMap: Record<string, string> = {
      leicht: "easy",
      mittel: "medium",
      schwer: "hard",
    };

    // Nur wenn beide Werte tatsächlich ausgewählt wurden, geben wir einen String zurück
    if (language && difficulty) {
      return `${langMap[language]}_${diffMap[difficulty]}`;
    }
    // Sonst entweder einen leeren String oder undefined
    return "";
  }, [language, difficulty]);

  return (
    <section className='mx-auto max-w-2xl px-4 py-6 space-y-8'>
      {/* Filter-Komponente mit allen nötigen "controlled" Props */}
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

      {/* Leaderboard-Tabelle, die mit den Werten aus dem Filter arbeitet */}
      <LeaderboardTable
        hideSurrender={hideSurrender}
        targetWordId={gameNumber}
        difficultyQuery={difficultyQuery}
      />
    </section>
  );
}
