"use client";

import Header from "@/components/semantix/header";
import WordInput from "@/components/semantix/wordinput";
import GuessesList from "@/components/semantix/guesseslist";
import { Guess } from "@/components/semantix/types";
import { useState } from "react";

export default function ContextoGame() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGuess = async (word: string) => {
    try {
      const response = await fetch("/api/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ein Fehler ist aufgetreten.");
      }

      const { word: targetWord, score } = await response.json();
      setGuesses((prev) => [...prev, { word: targetWord, score }]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Ein Fehler ist aufgetreten.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-4">
      <Header gameNumber={857} guessCount={guesses.length} />
      <WordInput onGuess={handleGuess} />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <GuessesList guesses={guesses} />
    </div>
  );
}
