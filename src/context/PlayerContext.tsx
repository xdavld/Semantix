"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PlayerContextType = {
  playerId: string | null;
  setPlayerId: (id: string) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function PlayerProviderContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const playerIdFromUrl = searchParams.get("playerId");

  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (playerIdFromUrl) {
      setPlayerId(playerIdFromUrl);
    }
  }, [playerIdFromUrl]);

  return (
    <PlayerContext.Provider value={{ playerId, setPlayerId }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading player...</div>}>
      <PlayerProviderContent>{children}</PlayerProviderContent>
    </Suspense>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
