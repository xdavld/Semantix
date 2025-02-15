import { supabase } from "@/lib/supabase";

function getDailyWordId(): number {
  const startId = 2; // Start-ID ab 2
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return startId + (dayOfYear % 500);
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// Globale Cache-Variablen für die gesamte Zeile und das Abrufdatum
let cachedDailyWordRow: Record<string, any> | null = null;
let cachedDate: string | null = null;

/**
 * Ruft das tägliche Zielwort für den gegebenen kombinierten Schlüssel (z. B. "de_easy")
 * aus Supabase ab. Die komplette Zeile wird gecached, sodass die Abfrage nur einmal pro Tag erfolgt.
 *
 * @param combinedKey - z. B. "de_easy", "de_hard", "en_easy", "en_hard"
 * @returns Das Zielwort als String, oder "Fehler" falls etwas nicht klappt.
 */
export async function getDailyTargetWord(combinedKey: string): Promise<string> {
  const today = getTodayDateString();

  // Falls bereits ein Cache für heute existiert, verwende diesen
  if (cachedDailyWordRow && cachedDate === today) {
    console.log("Cache verwendet:", cachedDailyWordRow);
    return cachedDailyWordRow[combinedKey] || "Fehler";
  }

  // Berechne die WordID und hole die Zeile aus Supabase
  const wordId = getDailyWordId();
  console.log("Hole tägliches Wort mit wordId:", wordId);

  const { data, error } = await supabase
    .from("targetWord")
    .select("*")
    .eq("target_word_id", wordId)
    .single();

  if (error || !data) {
    console.error("Fehler beim Abrufen des täglichen Wortes:", error);
    // Cache als leeres Objekt speichern und Rückgabewert auf "Fehler" setzen
    cachedDailyWordRow = {};
    cachedDate = today;
    return "Fehler";
  } else {
    console.log("Abgerufene Daten:", data);
    cachedDailyWordRow = data;
    cachedDate = today;
    const result = data[combinedKey];
    console.log("Gebe täglichen Wert für", combinedKey, "zurück:", result);
    return result || "Fehler";
  }
}
