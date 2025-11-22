import { useState } from 'react'
import './App.css'

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const ANSWER = "APPLE";

const INIT_GAME_STATE = {
  guesses: [], // eg. [{ word: "GUESS", result: [ "miss", "present", "miss", "hit", "miss" ] }]
  currentGuess: "",
  message: "",
  hasWon: false,
  hasLost: false
}

const GameOver = ({message, resetGameStateCallback}) => {
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={resetGameStateCallback}>Play Again</button>
    </div>
  )
}

function App() {
  const [gameState, setGameState] = useState(INIT_GAME_STATE)

  const resetGameState = () => {
    setGameState(INIT_GAME_STATE)
  }

  function evaluateGuess(guess, answer=ANSWER) {
    const result = Array(WORD_LENGTH).fill("miss");
    const answerLetters = answer.split("");
    const guessLetters = guess.split("");

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === answerLetters[i]) {
        result[i] = "hit";
        answerLetters[i] = null;
      }
    }

    // Second pass → mark presents
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === "hit") continue;

      const idx = answerLetters.indexOf(guessLetters[i]);
      if (idx !== -1) {
        result[i] = "present";
        answerLetters[idx] = null;
      }
    }
    return result;
  }

  function evaluateGuessSubmission() {
    const guess = gameState.currentGuess.toUpperCase();

    if (guess.length !== WORD_LENGTH) {
      setMessage(`Guess must be ${WORD_LENGTH} letters.`);
      return;
    }

    if (!/^[A-Z]+$/.test(guess)) {
      setMessage("Guess must contain letters only.");
      return;
    }

    const result = evaluateGuess(guess);
    const newGuesses = [...gameState.guesses, { word: guess, result }];
    setGameState({...gameState, guesses: newGuesses, message: "",currentGuess: ""})

    if (guess === ANSWER) {
      setGameState({...gameState, message: "You win! 🎉", hasWon: true})
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState({...gameState, message: `Out of guesses! Answer was ${ANSWER}.`, hasLost: true})
    }
  }

  return (
    <div className="container">
      {!gameState.hasWon && !gameState.hasLost &&
        <div className="in-progress">
          <h1>Wordle</h1>

          <div className="grid">
            {Array.from({ length: MAX_GUESSES }).map((_, row) => {
              const guessObj = gameState.guesses[row];
              const letters = guessObj ? guessObj.word.split("") : [];
              return (
                <div key={row} className="row">
                  {Array.from({ length: WORD_LENGTH }).map((_, col) => {
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
            maxLength={WORD_LENGTH}
            value={gameState.currentGuess}
            onChange={(e) => setGameState({...gameState, currentGuess: e.target.value.toUpperCase()})}
            onKeyDown={(e) => e.key === "Enter" && evaluateGuessSubmission()}
            placeholder="Enter guess"
          />

          <button onClick={evaluateGuessSubmission}>Submit</button>

          {gameState.message && <p className="message">{gameState.message}</p>}
        </div>
      }
      {(gameState.hasWon || gameState.hasLost) && 
        <GameOver message={gameState.message} resetGameStateCallback={resetGameState}/>
      }
    </div>
  );
}

export default App;
