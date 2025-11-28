import React, { createContext, useContext, useState } from "react";
import { GAME_CONFIG } from "./config";
import { toast } from "sonner";

const GameContext = createContext(null);

const defaultOfflineState = {
  gameWord: "",
  wordLength: 5,
  maxAttempts: 6,
  pastGuesses: [],
  status: "IN_PROGRESS",
  message: "",
  difficulty: "NORMAL",
  scores: {}
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [online, setOnline] = useState(true);
  const GAME_API_ENDPOINT = `${import.meta.env.VITE_API_URL}/game`

    const startGame = async (mode, difficultyLevel) => {
        if (mode === "online") {
            try {
                const res = await fetch(GAME_API_ENDPOINT, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({difficulty: difficultyLevel})});
                  if (!res.ok) {
                    const errorData = await res.json().catch(() => null);
                    toast.error(errorData?.message || "Unknown error");
                    return;
                  }
                const data = await res.json();
                localStorage.setItem("playerId", data.playerId)
                setGameState(data);
            } catch (err) {
                console.error("Failed to fetch game:", err);
            }
        } else {
            if(difficultyLevel === "HARD"){
              toast.error("Oops.. hard mode is available online only");
              return;
            }
            const offlineState = { ...defaultOfflineState, gameWord: GAME_CONFIG.WORDS[Math.floor(Math.random() * GAME_CONFIG.WORDS.length)]};
            setGameState(offlineState);
        }
  };

  return (
    <GameContext.Provider value={{ gameState, setGameState, startGame, online, setOnline }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
