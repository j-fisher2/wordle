const gameStore = require('../store/games');
const {WORDS, WORD_LENGTH, GUESSES_PER_GAME} = require('../config/config');
const { v4: uuidv4, validate: isUuid } = require('uuid');
const {evaluateGuess, evaluateGameStatus} = require('./utils');

const fetchGame = (gameId) => {
  // abstract function - update to use centralized data/key-value store
  return gameStore.get(gameId);
}

const createGame = (req, res) => {
  const gameId = uuidv4();
  const gameWord = WORDS[Math.floor(Math.random() * WORDS.length)]
  const game = {gameWord: gameWord, wordLength: WORD_LENGTH, maxAttempts: GUESSES_PER_GAME, status: "IN_PROGRESS"}

  gameStore.set(gameId, game);

  return res.json({ gameId: gameId, wordLength: WORD_LENGTH, maxAttempts: GUESSES_PER_GAME });
};

const guessWord = (req, res) => {
  const guess = req.body.guess;
  const gameId = req.params.gameId;

  if(! isUuid(gameId)){
    return res.status(400).json({
        message: "Invalid game id."
    });
  }

  const game = fetchGame(gameId);
  if(!game || game == {}){
    return res.json({undefined: "Game does not exist."});
  }
  if (guess.length !== game.wordLength) {
    return res.status(400).json({
      error: `Guess must be exactly ${game.wordLength} letters long.`
    });
  }

  const remainingAttempts = game.maxAttempts - (game.pastGuesses?.length || 0);

  if(remainingAttempts <= 0){
    return res.status(403).json({
      error: "No remaining attempts",
      remainingAttempts: 0
    });
  }

  const {gameWord} = game;
  const guessEvaluation = evaluateGuess(guess, gameWord, WORD_LENGTH);

  game.pastGuesses = [...(game.pastGuesses || []),{guess: guess, result: guessEvaluation}]
  game.status = evaluateGameStatus(game);
  gameStore.set(game);
  res.json({guess: guess, gameId: gameId, evaluation: guessEvaluation, remainingAttempts: remainingAttempts - 1, gameStatus: game.status})
}
 
module.exports = { createGame, guessWord };


