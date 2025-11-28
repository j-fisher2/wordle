import { toast } from "sonner";

async function evaluateGuess(guess, answer, wordLength, online, APIEndpoint) {

    if(answer || !online){
        const result = Array(wordLength || answer.length).fill("miss");
        const answerLetters = answer.split("");
        const guessLetters = guess.split("");

        for (let i = 0; i < answer.length; i++) {
            if (guessLetters[i] === answerLetters[i]) {
                result[i] = "hit";
                answerLetters[i] = null;
            }
        }

        // Second pass → mark presents
        for (let i = 0; i < answer.length; i++) {
            if (result[i] === "hit") continue;

            const idx = answerLetters.indexOf(guessLetters[i]);
            if (idx !== -1) {
                result[i] = "present";
                answerLetters[idx] = null;
            }
        }
        const hasWon = result.every(el => el === "hit");
        return {result: result, gameStatus: hasWon ? "WIN" : "IN_PROGRESS", scores: {}};
    }
    else {
        try {
            const res = await fetch(APIEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ guess: guess, playerId: localStorage.getItem("playerId") })
                });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => null);
                    toast.error(errorData?.message || "Unknown error");
                    return null;
                  }
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch game:", err);
        }
    }
}

export default async function evaluateGuessSubmission(guess, answer, wordLength, online, setGameState, gameState) {

    if (guess.length !== gameState.wordLength) {
        const message = `Guess must be ${gameState.wordLength} letters.`;
        setGameState({...gameState,message:message})
        return;
    }

    if (!/^[A-Z]+$/.test(guess)) {
        setGameState({...gameState,message:"Guess must contain letters only."})
        return;
    }

    const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/game/${gameState.gameId}/guess`

    const result = await evaluateGuess(guess,answer,wordLength,online, API_ENDPOINT);
    if(result){
        const newGuesses = [...gameState.pastGuesses, { guess: guess, result: result.result }];
        const gameStatus = online ? result.status : (newGuesses.length >= gameState.maxAttempts ? "LOSS" : result.status == "WIN" ? "WIN" : "IN_PROGRESS")
        setGameState({...gameState, pastGuesses: newGuesses, message: gameStatus === "WIN" ? "You win! 🎉" : gameStatus === "LOSS" ? "Out of guesses!" : "",currentGuess: "", status: gameStatus, scores: result.scores })
    }

}