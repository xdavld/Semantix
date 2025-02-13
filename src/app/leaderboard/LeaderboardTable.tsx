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

interface LeaderboardItem {
  player_id: string;
  target_word_id: string;
  difficulty: string;
  sum_guesses: number;
  sum_hint: number;
  is_surrender: boolean;
}

interface LeaderboardTableProps {
  hideSurrender: boolean;
}

export function LeaderboardTable({ hideSurrender }: LeaderboardTableProps) {
  const [leaderboardData, setLeaderboardData] = React.useState<
    LeaderboardItem[]
  >([]);

  React.useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/data/leaderboard?target_word_id=1&difficulty=de_easy"
        );
        const json = await response.json();
        setLeaderboardData(json.data || []);
      } catch (error) {
        console.error("Fehler beim Laden der Leaderboard-Daten:", error);
      }
    }

    fetchLeaderboardData();
  }, []);

  // Filter die surrender raus, falls hideSurrender == true
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
