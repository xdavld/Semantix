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

// Props-Interface für die Filter-Komponente
interface FiltersProps {
  // Switch: Surrender aus-/einblenden
  hideSurrender: boolean;
  onHideSurrenderChange: (value: boolean) => void;

  // Spielnummer (Target Word ID)
  gameNumber: string;
  onGameNumberChange: (value: string) => void;

  // Schwierigkeitsgrad (leicht, mittel, schwer)
  difficulty: string;
  onDifficultyChange: (value: string) => void;

  // Sprache (deutsch, englisch)
  language: string;
  onLanguageChange: (value: string) => void;
}

export function Filters({
  hideSurrender,
  onHideSurrenderChange,
  gameNumber,
  onGameNumberChange,
  difficulty,
  onDifficultyChange,
  language,
  onLanguageChange,
}: FiltersProps) {
  return (
    <div className='flex flex-col space-y-4'>
      {/* Zeile 1: Selektoren für Spielnummer, Schwierigkeit, Sprache */}
      <div className='flex space-x-4'>
        {/* Spielnummer */}
        <Select value={gameNumber} onValueChange={onGameNumberChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Spiel Nr.' />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => {
              const val = (i + 1).toString();
              return (
                <SelectItem key={val} value={val}>
                  Spiel {val}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Schwierigkeitsgrad */}
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Schwierigkeitsgrad' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='leicht'>Leicht</SelectItem>
            <SelectItem value='schwer'>Schwer</SelectItem>
          </SelectContent>
        </Select>

        {/* Sprache */}
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Sprache' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='deutsch'>Deutsch</SelectItem>
            <SelectItem value='englisch'>Englisch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Zeile 2: Switch für "Surrender" ausblenden */}
      <div className='flex items-center space-x-2'>
        <Switch
          checked={hideSurrender}
          onCheckedChange={onHideSurrenderChange}
          id='surrender-switch'
        />
        <label htmlFor='surrender-switch' className='text-sm font-medium'>
          &quot;Surrender&quot; ausblenden
        </label>
      </div>
    </div>
  );
}
