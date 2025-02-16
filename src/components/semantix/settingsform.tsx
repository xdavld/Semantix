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
  // Der difficulty-String enthält z.B. "de_easy" oder "en_hard".
  // Wenn ein Teil fehlt, wird ein leerer String zurückgegeben.
  const [currentLanguage, currentType] = difficulty.split("_");

  // Der Button wird aktiv, wenn beide Werte ausgewählt sind.
  const isReady = currentLanguage !== "" && currentType !== "";

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <p className="text-lg text-center">
        Wähle die <span className="font-bold">Sprache</span> deines gesuchten
        Wortes und bestimme den{" "}
        <span className="font-bold">Schwierigkeitsgrad</span>.
      </p>
      <div>
        <label className="block mb-2 font-semibold">Schwierigkeit</label>
        <Select value={currentType} onValueChange={onDifficultyTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Schwierigkeit auswählen:" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Einfach</SelectItem>
            <SelectItem value="hard">Hart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-2 font-semibold">Sprache</label>
        <Select value={currentLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sprache auswählen:" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="en">Englisch</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onConfirm} className="w-full" disabled={!isReady}>
        Spiel starten
      </Button>
    </div>
  );
}
