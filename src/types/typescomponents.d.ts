import { ReactNode } from "react";

// Base Guess Types
export interface Guess {
  id: string;
  word: string;
  score: number;
}

export interface GuessWithPending extends Guess {
  isPending: boolean;
}

export interface DetailedGuess extends Guess {
  timestamp: Date;
  playerId: string;
}

// Component Props
export interface GuessesListProps {
  guesses: GuessWithPending[];
}

export interface HeaderProps {
  gameNumber: number;
  guessCount: number;
  targetWord: string;
  hintCount: number;
  onHint: () => void;
}

export interface WordInputProps {
  onGuess: (word: string) => void;
}

export interface DialogMenuItemProps {
  icon: ReactNode;
  title: string;
  dialogTitle?: string;
  dialogDescription?: string;
  children: ReactNode;
  onOpen?: () => void;
}
