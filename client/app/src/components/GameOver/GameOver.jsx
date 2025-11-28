const GameOver = ({message, setGameState, gameState}) => {
  return (
    <div>
      <h1>{message}</h1>
        {Object.entries(gameState.scores).map(([playerId, score]) =>
            playerId === localStorage.getItem("playerId") ? (
                <div key={playerId}>Your score: {score}</div>
            ) : (
                <div key={playerId}>Opponent score: {score}</div>
            )
        )}
      <button style={{ marginTop: "1rem" }} onClick={() => setGameState(null)}>Play Again</button>
    </div>
  )
}

export default GameOver