import './App.css'
import MainMenu from './components/MainMenu/MainMenu.jsx';
import Game from './components/Game/Game.jsx';
import { useGame } from './GameContext.jsx';
import { GAME_CONFIG } from './config.js';
import evaluateGuessSubmission from './utils/evaluateGuess.js';

export const CONFIG = {
  MAX_GUESSES: 6,
  WORD_LENGTH: 5,
  WORDS: ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HEART', 'IDEAL', 'JELLY', 'KNIFE', 'LEMON', 'MANGO', 'NIGHT', 'OCEAN', 'PLANT', 'QUEEN', 'RIVER', 'STONE', 'TIGER', 'URBAN', 'VIVID', 'WATCH', 'XENON', 'YOUTH', 'ZEBRA', 'ANGRY', 'BRICK', 'CABLE', 'DRIVE', 'EXTRA', 'FAITH', 'GIANT', 'HAPPY', 'INDEX', 'JOINT', 'KARMA', 'LIGHT', 'MARCH', 'NOVEL', 'OASIS', 'PEARL', 'QUICK', 'RALLY', 'SUGAR', 'TABLE', 'UNION', 'VOTER', 'WATER', 'YIELD', 'ACTOR', 'BAKER', 'CANDY', 'DREAM', 'EAGER', 'FANCY', 'GLOBE', 'HOUSE', 'IMAGE', 'JUICE', 'KARMA', 'LABEL', 'MUSIC', 'NOBLE', 'OTHER', 'PRIDE', 'QUIET', 'ROAST', 'SMILE', 'TREND', 'ALERT', 'BLESS', 'CLIMB', 'DRILL', 'EARTH', 'FROST', 'GRILL', 'HOVER', 'IDEAL', 'JEWEL', 'KNEEL', 'LAUGH', 'MODEL', 'NERVE', 'OFFER', 'PARTY', 'QUAKE', 'ROUGH', 'SHINE', 'TOUGH', 'AWAKE', 'BRAVE', 'CRANE', 'DOUGH', 'EVERY', 'FRAME', 'GREAT', 'HAPPY', 'INNER', 'JOINT']
};


const initializeAnswer = (wordList = GAME_CONFIG.WORDS) => {
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  return word
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
  const {gameState, setGameState, startGame, online} = useGame();

  const resetGameState = () => {
    setGameState(null);
  }

  return (
    <div className='container'>
      {!gameState ?
        <MainMenu onStartGame={() => startGame(online ? "online" : "offline")}/> : <Game gameState={gameState} setGameState={setGameState} evaluateGuessSubmission={evaluateGuessSubmission} isOnline={online}/>
      }

    </div>
  );
}

export default App;
