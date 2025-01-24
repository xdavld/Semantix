import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";

interface HeaderProps {
  gameNumber: number;
  guessCount: number;
}

export default function Header({ gameNumber, guessCount }: HeaderProps) {
  return (
    <header className="py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">SEMANTIX</h1>
          <p className="text-gray-600">
            GAME: #{gameNumber} | GUESSES: {guessCount}
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </div>
    </header>
  );
}
