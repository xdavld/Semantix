"use client";

import Header from "@/components/semantix/header";
import WordInput from "@/components/semantix/wordinput";
import GuessesList from "@/components/semantix/guesseslist";
import { GuessWithPending } from "@/types/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WinDialog } from "@/components/semantix/winningscreen";
import { sendActionData } from "@/utils/action";

export default function SemantixGame() {
  //These 3 fields are defining who the player is and which game mode he is playing
  const [playerId, setplayerId] = useState("6");
  const [difficulty, setdifficulty] = useState("de_easy");
  const [targetWordId, setTargetWordId] = useState("1");

  const [guesses, setGuesses] = useState<GuessWithPending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [targetWord, setTargetWord] = useState("");
  const [hasWon, setHasWon] = useState(false);
  const [isSurrendered, setIsSurrendered] = useState(false);
  const router = useRouter();

  const resetGame = () => {
    setGuesses([]);
    setHintCount(0);
    setTargetWord("");
    setHasWon(false);
    setIsSurrendered(false);
  };

  const getGameNumber = () => {
    const startDate = new Date("2025-01-23");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleGuess = async (word: string) => {
    const tempId = new Date().getTime().toString();
    setGuesses((prev) => [
      ...prev,
      { id: tempId, word, score: 0, isPending: true },
    ]);

    try {
      const response = await fetch("/api/handleAction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Typedinword: word,
          playerId: playerId,
          difficulty: difficulty,
          targetWordId: targetWordId,
        }),
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

      const apiTargetWord = data.matches?.[0]?.metadata?.word;
      if (apiTargetWord && !targetWord) {
        setTargetWord(apiTargetWord.toUpperCase());
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

      if (word.toUpperCase() === targetWord) {
        setHasWon(true);
        sendActionData({
          playerId: playerId,
          difficulty: difficulty,
          targetWordId: targetWordId,
          isWin: true,
        }).catch((error) =>
          console.error("Error sending winning data:", error)
        );
      }

      setError(null);
    } catch (err: any) {
      setGuesses((prev) => prev.filter((g) => g.id !== tempId));
      setError(err.message || "Ein Fehler ist aufgetreten.");
      toast.error(err.message || "Ein Fehler ist aufgetreten.");
    }
  };

  const handleSurrender = () => {
    if (!targetWord) {
      toast.error("Bitte machen Sie zuerst einen Versuch");
      return false;
    }
    setIsSurrendered(true);
    setHasWon(true);
    sendActionData({
      playerId: playerId,
      difficulty: difficulty,
      targetWordId: targetWordId,
      isSurrender: true,
    }).catch((error) => console.error("Error sending surrender data:", error));
    return true;
  };

  return (
    <>
      <div className='max-w-md mx-auto w-full px-4 py-8'>
        <Header
          gameNumber={getGameNumber()}
          guessCount={guesses.length}
          targetWord={targetWord}
          hintCount={hintCount}
          onHint={() => setHintCount((prev) => prev + 1)}
          onSurrender={handleSurrender}
          playerId={playerId}
          difficulty={difficulty}
          targetWordId={targetWordId}
        />
        <WordInput onGuess={handleGuess} />
        {error && <div className='text-red-500 mt-2'>{error}</div>}
        <GuessesList guesses={guesses} />
      </div>

      {hasWon && (
        <WinDialog
          guessCount={guesses.length}
          hintCount={hintCount}
          targetWord={targetWord}
          onReset={resetGame}
          isSurrendered={isSurrendered}
        />
      )}
    </>
  );
}
