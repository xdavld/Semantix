"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PastDaysList from "@/components/semantix/pastdayslist";
import { WinDialogProps } from "@/types/types";

export function WinDialog({
  guessCount,
  hintCount,
  targetWord,
  onReset,
  isSurrendered,
  difficulty,
  onPastDaySelect, // Neuer Prop für Past-Day-Selection
}: WinDialogProps & {
  isSurrendered?: boolean;
  difficulty: string;
  onPastDaySelect: (date: string) => void;
}) {
  const router = useRouter();
  const [displayedTargetWord, setDisplayedTargetWord] = useState(targetWord);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative flex flex-col">
        <h2 className="text-xl font-bold mb-2">
          {isSurrendered ? "Schade, versuch es nochmal!" : "Glückwunsch! 🎉"}
        </h2>
        <p className="mb-4">
          {isSurrendered ? (
            <>
              Das gesuchte Wort war: <strong>{displayedTargetWord}</strong>
            </>
          ) : (
            <>
              Du hast <strong>{guessCount}</strong> Versuche und{" "}
              <strong>{hintCount}</strong> Hinweise benötigt.
              <br />
              Das gesuchte Wort war: <strong>{displayedTargetWord}</strong>
            </>
          )}
        </p>
        <div className="flex gap-3 justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => onReset()}
            className="relative"
          >
            Nochmal spielen
          </Button>
          <Button
            onClick={() => router.push("/leaderboard")}
            className="relative"
          >
            Leaderboard
          </Button>
        </div>

        {/* Scrollbarer Bereich für frühere Zielwörter */}
        <div className="max-h-48 overflow-y-auto border-t border-gray-300 pt-2">
          <PastDaysList
            combinedKey={difficulty}
            onSelect={(date) => {
              // Hier wird direkt der Callback für Past-Day-Selection aufgerufen
              onPastDaySelect(date);
            }}
          />
        </div>
      </div>
    </div>
  );
}
