interface HeaderProps {
  gameNumber: number;
  guessCount: number;
}

export default function Header({ gameNumber, guessCount }: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold">SEMANTIX</h1>
      <p className="text-gray-600">
        Spiel: #{gameNumber} | Versuche: {guessCount}
      </p>
    </header>
  );
}
