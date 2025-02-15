"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  difficulty: string;
  onLanguageChange: (newLanguage: string) => void;
  onDifficultyTypeChange: (newType: string) => void;
  onConfirm: () => void;
}

export default function SettingsForm({
  difficulty,
  onLanguageChange,
  onDifficultyTypeChange,
  onConfirm,
}: SettingsFormProps) {
  const [currentLanguage, currentType] = difficulty.split("_");

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <p className="text-lg text-center">
        <span className="font-bold">Wähle aus</span>, in welcher{" "}
        <span className="font-bold">Sprache</span> dein gesuchtes{" "}
        <span className="font-bold">Wort</span> sein soll und wie{" "}
        <span className="font-bold">kompliziert</span> das Wort sein soll.
      </p>
      <div>
        <label className="block mb-2 font-semibold">Sprache</label>
        <Select value={currentLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Wähle die Sprache aus:" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="en">Englisch</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-2 font-semibold">Schwierigkeit</label>
        <Select value={currentType} onValueChange={onDifficultyTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Wähle die Schwierigkeit aus:" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onConfirm} className="w-full">
        Spiel starten
      </Button>
    </div>
  );
}
