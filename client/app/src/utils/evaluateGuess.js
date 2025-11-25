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
        return {result: result};
    }
    else {
        // fetch result from api endpoint here
        try {
            const res = await fetch(APIEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ guess })
                });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch game:", err);
        }
    }
}

export default async function evaluateGuessSubmission(guess, answer, wordLength, online, setGameState, gameState) {
    console.log("HELLO")
    console.log(guess);
    console.log(answer);
    console.log(wordLength);
    console.log(online);

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

    const newGuesses = [...gameState.pastGuesses, { guess: guess, result: result.result }];
    setGameState({...gameState, pastGuesses: newGuesses, message: "",currentGuess: "", status: result.gameStatus })

    if ((!online && guess === gameState.gameWord) || (online && result.gameStatus === "WIN")) {
        setGameState({...gameState, message: "You win! 🎉", hasWon: true, status: result.gameStatus})
    } else if ((!online && newGuesses.length >= gameState.maxAttempts) || (online && result.gameStatus === "LOSS")) {
        setGameState({...gameState, message: "Out of guesses!", status: result.gameStatus })
    }
}