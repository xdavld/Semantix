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

export function LeaderboardTable() {
  const [leaderboardData, setLeaderboardData] = React.useState<
    Array<{
      player_id: string;
      target_word_id: string;
      difficulty: string;
      sum_guesses: number;
      sum_hint: number;
      is_surrender: boolean;
    }>
  >([]);

  React.useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/data/leaderboard?target_word_id=1&difficulty=de_easy"
        );
        const json = await response.json();
        // Falls das JSON-Format so aussieht: { "data": [...] },
        // kannst du hier direkt json.data in den State setzen
        setLeaderboardData(json.data);
      } catch (error) {
        console.error("Fehler beim Laden der Leaderboard-Daten:", error);
      }
    }

    fetchLeaderboardData();
  }, []);

  return (
    <Table>
      <TableCaption>Leaderboard Daten</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player ID</TableHead>
          <TableHead>Target Word ID</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className='text-right'>Sum Guesses</TableHead>
          <TableHead className='text-right'>Sum Hints</TableHead>
          <TableHead className='text-right'>Surrender?</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboardData.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.player_id}</TableCell>
            <TableCell>{item.target_word_id}</TableCell>
            <TableCell>{item.difficulty}</TableCell>
            <TableCell className='text-right'>{item.sum_guesses}</TableCell>
            <TableCell className='text-right'>{item.sum_hint}</TableCell>
            <TableCell className='text-right'>
              {item.is_surrender ? "Ja" : "Nein"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
