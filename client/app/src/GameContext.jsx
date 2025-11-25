import React, { createContext, useContext, useState } from "react";

const GameContext = createContext(null);

const defaultOfflineState = {
  gameWord: "",
  wordLength: 5,
  maxAttempts: 6,
  pastGuesses: [],
  status: "IN_PROGRESS",
  message: "",
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [online, setOnline] = useState(true);
  const GAME_API_ENDPOINT = `${import.meta.env.VITE_API_URL}/game`

    const startGame = async (mode) => {
        if (mode === "online") {
            try {
                const res = await fetch(GAME_API_ENDPOINT, {method: "POST"});
                const data = await res.json();
                setGameState(data);
            } catch (err) {
                console.error("Failed to fetch game:", err);
            }
        } else {
            const offlineState = { ...defaultOfflineState, gameWord: "APPLE" };
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
