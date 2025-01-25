"use client";

import Header from "@/components/semantix/header";
import WordInput from "@/components/semantix/wordinput";
import GuessesList from "@/components/semantix/guesseslist";
import { Guess, GuessWithPending } from "@/types/typescomponents";
import { useState } from "react";
import { toast } from "sonner";


export default function SemantixGame() {
  const [guesses, setGuesses] = useState<GuessWithPending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [targetWord, setTargetWord] = useState("");

  const getGameNumber = () => {
    const startDate = new Date("2025-01-23");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleGuess = async (word: string) => {
    const tempId = new Date().getTime().toString();
    setGuesses((prev) => [
      ...prev,
      { id: tempId, word, score: 0, isPending: true },
    ]);

    try {
      const response = await fetch("/api/pinecone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Typedinword: word }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Dieses Wort existiert nicht in der Datenbank.");
        } else {
          toast.error("Ein Fehler ist aufgetreten.");
        }
        setGuesses((prev) => prev.filter((g) => g.id !== tempId));
        return;
      }

      const data = await response.json();
      if (!targetWord && data.matches?.[0]?.metadata?.word) {
        setTargetWord(data.matches[0].metadata.word.toUpperCase());
      }

      if (!data.matches || data.matches.length === 0) {
        toast.error("Dieses Wort existiert nicht in der Datenbank.");
        setGuesses((prev) => prev.filter((g) => g.id !== tempId));
        return;
      }

      const match = data.matches[0];
      const score = match.score;

      setGuesses((prev) =>
        prev.map((g) =>
          g.id === tempId ? { ...g, score, isPending: false } : g
        )
      );

      setError(null);
    } catch (err: any) {
      setGuesses((prev) => prev.filter((g) => g.id !== tempId));
      setError(err.message || "Ein Fehler ist aufgetreten.");
      toast.error(err.message || "Ein Fehler ist aufgetreten.");
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <Header
          gameNumber={getGameNumber()}
          guessCount={guesses.length}
          targetWord={targetWord}
          hintCount={hintCount}
          onHint={() => setHintCount((prev) => prev + 1)}
        />{" "}
        <WordInput onGuess={handleGuess} />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <GuessesList guesses={guesses} />
      </div>
    </>
  );
}
