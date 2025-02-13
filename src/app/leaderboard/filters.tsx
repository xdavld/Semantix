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

interface FiltersProps {
  hideSurrender: boolean;
  onHideSurrenderChange: (value: boolean) => void;
}

export function Filters({
  hideSurrender,
  onHideSurrenderChange,
}: FiltersProps) {
  return (
    <div className='flex flex-col space-y-4'>
      {/* Zeile 1: Selektoren */}
      <div className='flex space-x-4'>
        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Spiel Nr.' />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem key={i} value={`${i + 1}`}>
                Spiel {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Schwierigkeitsgrad' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='leicht'>Leicht</SelectItem>
            <SelectItem value='mittel'>Mittel</SelectItem>
            <SelectItem value='schwer'>Schwer</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Sprache' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='deutsch'>Deutsch</SelectItem>
            <SelectItem value='englisch'>Englisch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Zeile 2: Switch (z. B. "Surrender" ausblenden) */}
      <div className='flex items-center space-x-2'>
        <Switch
          checked={hideSurrender}
          onCheckedChange={(checked) => onHideSurrenderChange(checked)}
          id='surrender-switch'
        />
        <label htmlFor='surrender-switch' className='text-sm font-medium'>
          &quot;Surrender&quot; ausblenden
        </label>
      </div>
    </div>
  );
}
