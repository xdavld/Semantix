"use client";

import React from "react";
import {
  Table,
  TableBody,
  /*TableCaption,*/
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardItem {
  playerName: string;
  target_word_id: string;
  difficulty: string;
  sum_guesses: number;
  sum_hint: number;
  is_surrender: boolean;
}

interface LeaderboardTableProps {
  hideSurrender: boolean;
  targetWordId: string;
  difficultyQuery: string;
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
    // Falls ein Parameter fehlt, kein Fetch
    if (!targetWordId || !difficultyQuery) {
      setLeaderboardData([]);
      return;
    }

    // Dynamische Base-URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    async function fetchLeaderboardData() {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/leaderboard?target_word_id=${targetWordId}&difficulty=${difficultyQuery}`
        );
        const json = await response.json();
        setLeaderboardData(json.data || []);
      } catch (error) {
        console.error("Fehler beim Laden der Leaderboard-Daten:", error);
      }
    }

    fetchLeaderboardData();
  }, [targetWordId, difficultyQuery]);

  // Surrender ggf. ausfiltern
  const filteredData = hideSurrender
    ? leaderboardData.filter((item) => !item.is_surrender)
    : leaderboardData;

  // Wenn keine Daten vorhanden sind, zeige Text statt Tabelle
  if (!filteredData.length) {
    return (
      <p className='text-sm text-muted-foreground'>
        Keine Daten vorhanden, bitte ändere deine Auswahl.
      </p>
    );
  }

  // Ansonsten Tabelle darstellen
  return (
    <Table>
      {/*<TableCaption>Leaderboard Daten</TableCaption>*/}
      <TableHeader>
        <TableRow>
          <TableHead>Spieler Name</TableHead>
          <TableHead className='text-right'>Anzahl Versuche</TableHead>
          <TableHead className='text-right'>Anzahl Tipps</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item, index) => (
          <TableRow key={index} className={item.is_surrender ? "bg-muted" : ""}>
            <TableCell>{item.playerName}</TableCell>
            <TableCell className='text-right'>{item.sum_guesses}</TableCell>
            <TableCell className='text-right'>{item.sum_hint}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
