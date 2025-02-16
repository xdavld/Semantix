import { supabase } from "@/lib/supabase";

function getTodayDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export async function getDailyTargetWord(
  combinedKey: string,
  dateParam?: Date
): Promise<string> {
  const currentDate = dateParam || new Date();
  const dateString = getTodayDateString(currentDate);

  // Berechne die WordID basierend auf dem gewünschten Datum
  const startDate = new Date("2025-01-23");
  const startId = 45073; // Starting ID
  const diffTime = currentDate.getTime() - startDate.getTime();
  const dayDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const wordId = startId + (dayDiff % 500); // Cycle through 500 words

  console.log("Hole Zielwort mit wordId:", wordId, "für Datum:", dateString);

  const { data, error } = await supabase
    .from("targetWord")
    .select("*")
    .eq("target_word_id", wordId)
    .single();

  if (error || !data) {
    console.error("Fehler beim Abrufen des Zielworts:", error);
    return "Fehler";
  } else {
    const result = data[combinedKey];
    console.log("Gebe Wert für", combinedKey, "zurück:", result);
    return result || "Fehler";
  }
}
