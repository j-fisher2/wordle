import { useState } from 'react'
import './App.css'

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const ANSWER = "APPLE";

function App() {
  const [guesses, setGuesses] = useState([]);        // eg. [{ word: "GUESS", result: [ "miss", "present", "miss", "hit", "miss" ] }]
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [hasWon, setHasWon] = useState(false);

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
    const guess = currentGuess.toUpperCase();

    if (guess.length !== WORD_LENGTH) {
      setMessage(`Guess must be ${WORD_LENGTH} letters.`);
      return;
    }

    if (!/^[A-Z]+$/.test(guess)) {
      setMessage("Guess must contain letters only.");
      return;
    }

    const result = evaluateGuess(guess);
    const newGuesses = [...guesses, { word: guess, result }];
    setGuesses(newGuesses);
    setCurrentGuess("");
    setMessage("");

    if (guess === ANSWER) {
      setMessage("You win! 🎉");
      setHasWon(true);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setMessage(`Out of guesses! Answer was ${ANSWER}.`);
    }
  }

  return (
    <div className="container">
      {!hasWon &&
        <div className="in-progress">
          <h1>Wordle</h1>

          <div className="grid">
            {Array.from({ length: MAX_GUESSES }).map((_, row) => {
              const guessObj = guesses[row];
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
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && evaluateGuessSubmission()}
            placeholder="Enter guess"
          />

          <button onClick={evaluateGuessSubmission}>Submit</button>

          {message && <p className="message">{message}</p>}
        </div>
      }
      {hasWon && 
        <div>
          <h1>{message}</h1>
          <button>Play Again</button>
        </div>
      }
    </div>
  );
}

export default App;
