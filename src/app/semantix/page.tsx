"use client";

import Header from "@/components/semantix/header";
import WordInput from "@/components/semantix/wordinput";
import GuessesList from "@/components/semantix/guesseslist";
import { GuessWithPending } from "@/types/types";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WinDialog } from "@/components/semantix/winningscreen";
import { sendActionData } from "@/utils/action";
import SettingsForm from "@/components/semantix/settingsform";

export default function SemantixGame() {
  const [difficulty, setDifficulty] = useState("de_easy");
  const [playerId, setPlayerId] = useState("6");
  const [targetWordId, setTargetWordId] = useState("1");

  const [settingsConfirmed, setSettingsConfirmed] = useState(false);
  const [guesses, setGuesses] = useState<GuessWithPending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [targetWord, setTargetWord] = useState("");
  const [hasWon, setHasWon] = useState(false);
  const [isSurrendered, setIsSurrendered] = useState(false);
  const router = useRouter();

  const handleLanguageChange = (newLanguage: string) => {
    const parts = difficulty.split("_");
    setDifficulty(newLanguage + "_" + parts[1]);
  };

  const handleDifficultyTypeChange = (newType: string) => {
    const parts = difficulty.split("_");
    setDifficulty(parts[0] + "_" + newType);
  };

  const resetGame = () => {
    setGuesses([]);
    setHintCount(0);
    setTargetWord("");
    setHasWon(false);
    setIsSurrendered(false);
    setSettingsConfirmed(false); 
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
          difficulty, 
          playerId,
          targetWordId,
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
          difficulty,
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
      difficulty,
      isSurrender: true,
    }).catch((error) => console.error("Error sending surrender data:", error));
    return true;
  };

  if (!settingsConfirmed) {
    return (
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <SettingsForm
          difficulty={difficulty}
          onLanguageChange={handleLanguageChange}
          onDifficultyTypeChange={handleDifficultyTypeChange}
          onConfirm={() => setSettingsConfirmed(true)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-md mx-auto w-full px-4 py-8">
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
        {error && <div className="text-red-500 mt-2">{error}</div>}
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
