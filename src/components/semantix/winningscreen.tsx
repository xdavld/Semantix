import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WinDialogProps } from "@/types/types";

export function WinDialog({
  guessCount,
  hintCount,
  targetWord,
  onReset,
  isSurrendered,
}: WinDialogProps & { isSurrendered?: boolean }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
        <h2 className="text-xl font-bold mb-2">
          {isSurrendered ? "Schade, versuch es nochmal!" : "Glückwunsch! 🎉"}
        </h2>
        <p className="mb-4">
          {isSurrendered ? (
            <>
              Das gesuchte Wort war: <strong>{targetWord}</strong>
            </>
          ) : (
            <>
              Du hast <strong>{guessCount}</strong> Versuche und{" "}
              <strong>{hintCount}</strong> Hinweise benötigt.
              <br />
              Das gesuchte Wort war: <strong>{targetWord}</strong>
            </>
          )}
        </p>
        <div className="flex gap-3 justify-end">
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
      </div>
    </div>
  );
}
