"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Funktion, um eine Liste von Datumsoptionen zu generieren
function generateDateOptions() {
  const startDate = new Date("2025-01-23");
  const today = new Date();
  const options = [];
  let id = 45074;
  let defaultId = "";

  while (startDate <= today) {
    const formattedDate = startDate.toISOString().split("T")[0];
    options.push({ id: id.toString(), date: formattedDate });

    if (formattedDate === today.toISOString().split("T")[0]) {
      defaultId = id.toString();
    }

    startDate.setDate(startDate.getDate() + 1);
    id++;
  }
  return { options, defaultId };
}

const { options: dateOptions, defaultId: defaultGameNumber } = generateDateOptions();

// Props-Interface für die Filter-Komponente
interface FiltersProps {
  hideSurrender: boolean;
  onHideSurrenderChange: (value: boolean) => void;
  gameNumber: string;
  onGameNumberChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
}

export function Filters({
  hideSurrender,
  onHideSurrenderChange,
  gameNumber = defaultGameNumber,
  onGameNumberChange,
  difficulty,
  onDifficultyChange,
  language,
  onLanguageChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col space-y-4">
      {/* Zeile 1: Selektoren für Spielnummer, Schwierigkeit, Sprache */}
      <div className="flex space-x-4">
        {/* Spielnummer (Game ID basierend auf Datum) */}
        <Select value={gameNumber} onValueChange={onGameNumberChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Spiel Datum" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map(({ id, date }) => (
              <SelectItem key={id} value={id}>
                {date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Schwierigkeitsgrad */}
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Schwierigkeitsgrad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leicht">Leicht</SelectItem>
            <SelectItem value="schwer">Schwer</SelectItem>
          </SelectContent>
        </Select>

        {/* Sprache */}
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sprache" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deutsch">Deutsch</SelectItem>
            <SelectItem value="englisch">Englisch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Zeile 2: Switch für "Surrender" ausblenden */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={hideSurrender}
          onCheckedChange={onHideSurrenderChange}
          id="surrender-switch"
        />
        <label htmlFor="surrender-switch" className="text-sm font-medium">
          &quot;Surrender&quot; ausblenden
        </label>
      </div>
    </div>
  );
}