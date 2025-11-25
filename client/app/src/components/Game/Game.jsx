import { useState } from "react";
import GameOver from "../GameOver/GameOver";

export default function Game({ evaluateGuessSubmission, gameState ,setGameState, isOnline}){ // these should be props as they will differ from client side game vs client server game
    const [currentGuess, setCurrentGuess] = useState("");
    const resetGameState = () => {
        setGameState(null);
    }

    return (
        <div className="container">
        {(gameState?.status === "IN_PROGRESS" || !gameState?.status ) &&
            <div className="in-progress">
            <h1>Wordle</h1>

            <div className="grid">
                {Array.from({ length: gameState?.maxAttempts }).map((_, row) => {
                const guessObj = gameState?.pastGuesses[row];
                const letters = guessObj ? guessObj.guess.split("") : [];
                return (
                    <div key={row} className="row">
                    {Array.from({ length: gameState?.wordLength }).map((_, col) => {
                        const letter = letters[col] || "";
                        const status = guessObj?.result[col];

                        return (
                        <div key={col} className={`cell ${status || ""}`}>
                            {letter}
                        </div>
                        );
                    })}
                    </div>
                );
                })}
            </div>

            <input
                type="text"
                maxLength={gameState?.wordLength}
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && evaluateGuessSubmission(isOnline)}
                placeholder="Enter guess"
            />

            <button onClick={async () => await evaluateGuessSubmission(currentGuess, gameState.gameWord || null, gameState.wordLength, isOnline, setGameState, gameState)}>Submit</button>

            {gameState?.message && <p className="message">{gameState?.message}</p>}
            </div>
        }
        {(gameState.status === "LOSS" || gameState.status === "WIN") && <GameOver message={gameState.message} setGameState={setGameState}/>}
        </div>
    );
}