import { Guess } from "./types";

interface GuessesListProps {
  guesses: Guess[];
}

export default function GuessesList({ guesses }: GuessesListProps) {
  return (
    <div className="w-full max-w-md">
      {guesses.map((guess, index) => {
        // Normalize the score to a smoother scale
        const maxScore = 10000; // Define the maximum score
        const normalizedScore = Math.sqrt(guess.score / maxScore); // Apply square root for smoother scaling
        // Generate dynamic background color (red to green)
        const backgroundColor = `hsl(${normalizedScore * 120}, 60%, 85%)`;

        return (
          <div
            key={index}
            className="flex justify-between items-center p-3 mb-2 rounded-md text-gray-800 font-semibold"
            style={{
              background: `linear-gradient(to right, ${backgroundColor} ${
                normalizedScore * 100
              }%, #f5f5f5 ${normalizedScore * 100}%)`,
            }}
          >
            <span>{guess.word}</span>
            <span>{guess.score.toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
}
