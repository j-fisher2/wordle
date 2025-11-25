import './App.css'
import MainMenu from './components/MainMenu/MainMenu.jsx';
import Game from './components/Game/Game.jsx';
import { useGame } from './GameContext.jsx';
import { GAME_CONFIG } from './config.js';
import evaluateGuessSubmission from './utils/evaluateGuess.js';
import { useState } from "react";

function App() {
  const {gameState, setGameState, startGame } = useGame();
  const [online, setOnline] = useState(true);

  return (
    <div className='container'>
      {!gameState ?
        <MainMenu onStartGame={() => startGame(online ? "online" : "offline")} online={online} setOnline={setOnline} /> : <Game gameState={gameState} setGameState={setGameState} evaluateGuessSubmission={evaluateGuessSubmission} isOnline={online}/>
      }

    </div>
  );
}

export default App;
