import './App.css'
import MainMenu from './components/MainMenu/MainMenu.jsx';
import Game from './components/Game/Game.jsx';
import { useGame } from './GameContext.jsx';
import { GAME_CONFIG } from './config.js';
import evaluateGuessSubmission from './utils/evaluateGuess.js';

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

  return (
    <div className='container'>
      {!gameState ?
        <MainMenu onStartGame={() => startGame(online ? "online" : "offline")}/> : <Game gameState={gameState} setGameState={setGameState} evaluateGuessSubmission={evaluateGuessSubmission} isOnline={online}/>
      }

    </div>
  );
}

export default App;
