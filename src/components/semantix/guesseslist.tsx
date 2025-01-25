import { GuessWithPending, GuessesListProps } from "@/types/typescomponents";

export default function GuessesList({ guesses }: GuessesListProps) {
  if (!guesses.length) return null;

  const lastGuess = guesses[guesses.length - 1];
  const sortedGuesses = [...guesses].sort((a, b) => b.score - a.score);

  function getScoreDisplay(guess: GuessWithPending) {
    return guess.isPending
      ? "Berechnung..."
      : `${(guess.score * 100).toFixed(2)}%`; // Convert to percentage with 2 decimal places
  }

  function getBackground(guess: GuessWithPending) {
    const percentage = guess.score * 100;
    const hue = guess.score * 120;
    return `linear-gradient(
      to right,
      hsl(${hue}, 80%, 50%) ${percentage}%,
      #f5f5f5 ${percentage}%
    )`;
  }

  const lastGuessDisplayScore = getScoreDisplay(lastGuess);
  const lastGuessBackground = getBackground(lastGuess);

  return (
    <div className="w-full max-w-md">
      <div
        className="flex justify-between items-center p-3 mb-4 rounded-md text-gray-800 font-semibold border-4 border-gray-800 dark:border-white"
        style={{ background: lastGuessBackground }}
      >
        <span>{lastGuess.word}</span>
        <span>{lastGuessDisplayScore}</span>
      </div>

      {sortedGuesses.map((guess) => {
        const displayScore = getScoreDisplay(guess);
        const background = getBackground(guess);
        const isLastGuess = guess === lastGuess;

        return (
          <div
            key={guess.id}
            className={`flex justify-between items-center p-3 mb-2 rounded-md text-gray-800 font-semibold ${
              isLastGuess ? "border-4 border-gray-800 dark:border-white" : ""
            }`}
            style={{ background }}
          >
            <span>{guess.word}</span>
            <span>{displayScore}</span>
          </div>
        );
      })}
    </div>
  );
}
