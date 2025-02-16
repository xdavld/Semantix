// Basis-Typen
type GameStats = {
  targetWord: string;
  guessCount: number;
  hintCount: number;
};

type WithPending<T> = T & { isPending: boolean };
type WithTimestamps<T> = T & { timestamp: Date; playerId: string };

// Guess-Typen
type GuessBase = {
  id: string;
  word: string;
  score?: number; // Für Hard-Modus (optional, da im Easy-Modus nicht gesetzt)
  position?: number; // Für Easy-Modus (optional)
  totalMatches?: number; // Für Easy-Modus (optional)
};

export type GuessWithPending = WithPending<GuessBase>;
export type DetailedGuess = WithTimestamps<GuessBase>;

// Komponenten-Props
export type HeaderProps = GameStats & {
  gameNumber: number;
  onSurrender: () => boolean;
  onHint: () => void;
  playerId: string;
  difficulty: string;
  targetWordId: string;
};

export interface GuessesListProps {
  guesses: GuessWithPending[];
}

export type WordInputProps = {
  onGuess: (word: string) => void;
};

export type WinDialogProps = GameStats & {
  onReset: () => void;
  isSurrendered?: boolean;
};

// Dialog-Props
type DialogBaseProps = {
  icon: React.ReactNode;
  title: string;
  dialogTitle?: string;
  dialogDescription?: string;
};

export interface DialogMenuItemProps extends DialogBaseProps {
  children:
    | React.ReactNode
    | ((props: { closeDialog: () => void }) => React.ReactNode);
  onOpen?: () => void;
}
