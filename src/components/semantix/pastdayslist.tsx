"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type PastDay = { date: string };

type PastDaysListProps = {
  combinedKey: string;
  onSelect: (date: string) => void;
};

export default function PastDaysList({
  combinedKey,
  onSelect,
}: PastDaysListProps) {
  const [pastDays, setPastDays] = useState<PastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const startDate = new Date("2025-01-23");

  useEffect(() => {
    const days: PastDay[] = [];
    let date = new Date(startDate);
    while (date.toISOString().split("T")[0] < today) {
      days.push({ date: date.toISOString().split("T")[0] });
      date.setDate(date.getDate() + 1);
    }
    setPastDays(days.sort((a, b) => b.date.localeCompare(a.date))); // Sortiere absteigend
    setLoading(false);
  }, []);

  return (
    <div className="mt-4 max-h-40 overflow-y-auto">
      <h3 className="font-bold mb-2">Frühere Spielwörter</h3>
      {loading ? (
        <Loader2 className="animate-spin h-6 w-6 text-gray-500 mx-auto" />
      ) : (
        pastDays.map((day) => (
          <Button
            key={day.date}
            variant="outline"
            className="w-full text-left mb-1"
            onClick={() => onSelect(day.date)}
          >
            {day.date}
          </Button>
        ))
      )}
    </div>
  );
}
