const GameOver = ({message, setGameState}) => {
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => setGameState(null)}>Play Again</button>
    </div>
  )
}

export default GameOver