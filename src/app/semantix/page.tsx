"use client";

import Header from "@/components/semantix/header";
import WordInput from "@/components/semantix/wordinput";
import GuessesList from "@/components/semantix/guesseslist";
import { Guess } from "@/components/semantix/types";
import { useState } from "react";

export default function ContextoGame() {
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const handleGuess = (word: string) => {
    // Simulate a "score" for the guessed word
    const score = Math.floor(Math.random() * 10000);
    setGuesses((prev) => [...prev, { word, score }]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-4">
      <Header gameNumber={857} guessCount={guesses.length} />
      <WordInput onGuess={handleGuess} />
      <GuessesList guesses={guesses} />
    </div>
  );
}
