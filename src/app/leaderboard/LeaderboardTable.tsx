"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Beispiel-Interface für Leaderboard-Einträge
interface LeaderboardItem {
  player_id: string;
  target_word_id: string;
  difficulty: string;
  sum_guesses: number;
  sum_hint: number;
  is_surrender: boolean;
}

// Props für das Leaderboard
interface LeaderboardTableProps {
  hideSurrender: boolean; // Ob Surrender ausgeblendet werden soll
  targetWordId: string; // Ausgewählte Spielnummer
  difficultyQuery: string; // Zusammengesetzte Difficulty (z.B. "de_easy")
}

export function LeaderboardTable({
  hideSurrender,
  targetWordId,
  difficultyQuery,
}: LeaderboardTableProps) {
  const [leaderboardData, setLeaderboardData] = React.useState<
    LeaderboardItem[]
  >([]);

  React.useEffect(() => {
    // Falls nichts ausgewählt ist, keine Abfrage
    if (!targetWordId || !difficultyQuery) {
      setLeaderboardData([]);
      return;
    }

    async function fetchLeaderboardData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/data/leaderboard?target_word_id=${targetWordId}&difficulty=${difficultyQuery}`
        );
        const json = await response.json();
        // json.data sollte ein Array enthalten
        setLeaderboardData(json.data || []);
      } catch (error) {
        console.error("Fehler beim Laden der Leaderboard-Daten:", error);
      }
    }

    fetchLeaderboardData();
  }, [targetWordId, difficultyQuery]);

  // Wenn hideSurrender = true, filtern wir alle is_surrender heraus
  const filteredData = hideSurrender
    ? leaderboardData.filter((item) => !item.is_surrender)
    : leaderboardData;

  return (
    <Table>
      <TableCaption>Leaderboard Daten</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Spieler Name</TableHead>
          <TableHead className='text-right'>Anzahl Versuche</TableHead>
          <TableHead className='text-right'>Anzahl Hints</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.player_id}</TableCell>
            <TableCell className='text-right'>{item.sum_guesses}</TableCell>
            <TableCell className='text-right'>{item.sum_hint}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
