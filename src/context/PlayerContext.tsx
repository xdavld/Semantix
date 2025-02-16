"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

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
            Cookies.set("player_id", playerIdFromUrl);
            console.log("Player ID set from URL:", playerIdFromUrl);
        } else {
            const storedPlayerId = Cookies.get("player_id");
            if (storedPlayerId) {
                setPlayerId(storedPlayerId);
                console.log("Player ID retrieved from cookie:", storedPlayerId);
            }
        }
    }, [playerIdFromUrl]);

    return (
        <PlayerContext.Provider value={{
            playerId,
            setPlayerId: (id: string) => {
                console.log("Setting Player ID:", id);
                setPlayerId(id);
                Cookies.set("player_id", id);
            }
        }}>
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
    console.log("Reading Player ID:", context.playerId);
    return context;
}
