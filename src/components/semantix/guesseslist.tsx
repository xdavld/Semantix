import { GuessWithPending, GuessesListProps } from "@/types/types";

export default function GuessesList({ guesses }: GuessesListProps) {
  if (!guesses.length) return null;

  // Den zuletzt eingegebenen Guess aus der Originalreihenfolge ermitteln:
  const lastEnteredGuess = guesses[guesses.length - 1];

  // Sortierung der Guesses:
  // - Falls Position vorhanden ist, sortiere aufsteigend (niedrigere Position = besser)
  // - Falls Score vorhanden ist, sortiere absteigend (höchster Score zuerst)
  const sortedGuesses = [...guesses].sort((a, b) => {
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    } else if (a.score !== undefined && b.score !== undefined) {
      return b.score - a.score;
    }
    return 0;
  });

  function getDisplay(guess: GuessWithPending) {
    if (guess.isPending) {
      return "Berechnung...";
    }
    if (guess.position !== undefined && guess.totalMatches !== undefined) {
      return `Position ${guess.position} von ${guess.totalMatches}`;
    }
    if (guess.score !== undefined) {
      return `${(guess.score * 100).toFixed(2)}%`;
    }
    return "";
  }

  function getBackground(guess: GuessWithPending) {
    if (guess.position !== undefined && guess.totalMatches !== undefined) {
      const closeness =
        guess.totalMatches > 1
          ? 1 - (guess.position - 1) / (guess.totalMatches - 1)
          : 1;
      const percentage = closeness * 100;
      const hue = Math.round(closeness * 120);
      return `linear-gradient(
        to right,
        hsl(${hue}, 80%, 50%) ${percentage}%,
        #f5f5f5 ${percentage}%
      )`;
    } else if (guess.score !== undefined) {
      const percentage = guess.score * 100;
      const hue = guess.score * 120;
      return `linear-gradient(
        to right,
        hsl(${hue}, 80%, 50%) ${percentage}%,
        #f5f5f5 ${percentage}%
      )`;
    }
    return "#f5f5f5";
  }

  const lastGuessDisplay = getDisplay(lastEnteredGuess);
  const lastGuessBackground = getBackground(lastEnteredGuess);

  return (
    <div className="w-full max-w-md">
      <div
        className="flex justify-between items-center p-3 mb-4 rounded-md text-gray-800 font-semibold border-4 border-gray-800 dark:border-white"
        style={{ background: lastGuessBackground }}
      >
        <span>{lastEnteredGuess.word}</span>
        <span>{lastGuessDisplay}</span>
      </div>

      {sortedGuesses.map((guess) => {
        const display = getDisplay(guess);
        const background = getBackground(guess);
        const isLastGuess = guess.id === lastEnteredGuess.id;
        return (
          <div
            key={guess.id}
            className={`flex justify-between items-center p-3 mb-2 rounded-md text-gray-800 font-semibold ${isLastGuess ? "border-4 border-gray-800 dark:border-white" : ""
              }`}
            style={{ background }}
          >
            <span>{guess.word}</span>
            <span>{display}</span>
          </div>
        );
      })}
    </div>
  );
}
