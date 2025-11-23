import { useState } from 'react'
import './App.css'

export const CONFIG = {
  MAX_GUESSES: 6,
  WORD_LENGTH: 5,
  WORDS: ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HEART', 'IDEAL', 'JELLY', 'KNIFE', 'LEMON', 'MANGO', 'NIGHT', 'OCEAN', 'PLANT', 'QUEEN', 'RIVER', 'STONE', 'TIGER', 'URBAN', 'VIVID', 'WATCH', 'XENON', 'YOUTH', 'ZEBRA', 'ANGRY', 'BRICK', 'CABLE', 'DRIVE', 'EXTRA', 'FAITH', 'GIANT', 'HAPPY', 'INDEX', 'JOINT', 'KARMA', 'LIGHT', 'MARCH', 'NOVEL', 'OASIS', 'PEARL', 'QUICK', 'RALLY', 'SUGAR', 'TABLE', 'UNION', 'VOTER', 'WATER', 'YIELD', 'ACTOR', 'BAKER', 'CANDY', 'DREAM', 'EAGER', 'FANCY', 'GLOBE', 'HOUSE', 'IMAGE', 'JUICE', 'KARMA', 'LABEL', 'MUSIC', 'NOBLE', 'OTHER', 'PRIDE', 'QUIET', 'ROAST', 'SMILE', 'TREND', 'ALERT', 'BLESS', 'CLIMB', 'DRILL', 'EARTH', 'FROST', 'GRILL', 'HOVER', 'IDEAL', 'JEWEL', 'KNEEL', 'LAUGH', 'MODEL', 'NERVE', 'OFFER', 'PARTY', 'QUAKE', 'ROUGH', 'SHINE', 'TOUGH', 'AWAKE', 'BRAVE', 'CRANE', 'DOUGH', 'EVERY', 'FRAME', 'GREAT', 'HAPPY', 'INNER', 'JOINT']
};


const initializeAnswer = (wordList = CONFIG.WORDS) => {
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  console.log("ANSWER - ")
  console.log(word)
  return word
}

const INIT_GAME_STATE = {
  ANSWER: initializeAnswer(),
  guesses: [], // eg. [{ word: "GUESS", result: [ "miss", "present", "miss", "hit", "miss" ] }]
  currentGuess: "",
  message: "",
  hasWon: false,
  hasLost: false,
  offline: true, // with server integration - use this to load answer word locally and play game entirely client-sided
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
    const newGameState = INIT_GAME_STATE;
    newGameState.ANSWER = initializeAnswer();
    setGameState(newGameState);
  }

  function evaluateGuess(guess, answer=gameState.ANSWER) {
    const result = Array(CONFIG.WORD_LENGTH).fill("miss");
    const answerLetters = answer.split("");
    const guessLetters = guess.split("");

    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
      if (guessLetters[i] === answerLetters[i]) {
        result[i] = "hit";
        answerLetters[i] = null;
      }
    }

    // Second pass → mark presents
    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
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

    if (guess.length !== CONFIG.WORD_LENGTH) {
      setMessage(`Guess must be ${CONFIG.WORD_LENGTH} letters.`);
      return;
    }

    if (!/^[A-Z]+$/.test(guess)) {
      setMessage("Guess must contain letters only.");
      return;
    }

    const result = evaluateGuess(guess);
    const newGuesses = [...gameState.guesses, { word: guess, result }];
    setGameState({...gameState, guesses: newGuesses, message: "",currentGuess: ""})

    if (guess === gameState.ANSWER) {
      setGameState({...gameState, message: "You win! 🎉", hasWon: true})
    } else if (newGuesses.length >= CONFIG.MAX_GUESSES) {
      setGameState({...gameState, message: `Out of guesses! Answer was ${gameState.ANSWER}.`, hasLost: true})
    }
  }

  return (
    <div className="container">
      {!gameState.hasWon && !gameState.hasLost &&
        <div className="in-progress">
          <h1>Wordle</h1>

          <div className="grid">
            {Array.from({ length: CONFIG.MAX_GUESSES }).map((_, row) => {
              const guessObj = gameState.guesses[row];
              const letters = guessObj ? guessObj.word.split("") : [];
              return (
                <div key={row} className="row">
                  {Array.from({ length: CONFIG.WORD_LENGTH }).map((_, col) => {
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
            maxLength={CONFIG.WORD_LENGTH}
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
