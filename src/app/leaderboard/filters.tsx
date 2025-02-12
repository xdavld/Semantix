import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Filters() {
  return (
    <div className='flex space-x-4'>
      {/* Spiel Nummer */}
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

      {/* Schwierigkeitsgrad */}
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

      {/* Sprache */}
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
  );
}
