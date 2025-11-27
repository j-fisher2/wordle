const gameStore = require("../store/games");
const { WORDS, WORD_LENGTH, GUESSES_PER_GAME } = require("../config/config");
const { v4: uuidv4, validate: isUuid } = require("uuid");
const { evaluateGuess, evaluateGameStatus, cheatEvaluate } = require("./utils");

// abstract function - update to use centralized data/key-value store
const fetchGame = (gameId) => {
  return gameStore.get(gameId);
};

const createGame = (req, res) => {
  const gameId = uuidv4();
  const gameWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  const difficulty = req.body.difficulty;
  const hostPlayerId = uuidv4();

  const game = {
    gameWord: gameWord,
    wordLength: WORD_LENGTH,
    maxAttempts: GUESSES_PER_GAME,
    status: "IN_PROGRESS",
    pastGuesses: [],
    difficulty: difficulty,
    candidateWords: difficulty === "HARD" ? WORDS : [],
    players: [hostPlayerId], // host player id always first, players.length > 1 -> implicit multiplayer mode
  };
  gameStore.set(gameId, game);

  return res.json({
    gameId: gameId,
    wordLength: WORD_LENGTH,
    maxAttempts: GUESSES_PER_GAME,
    status: game.status,
    pastGuesses: game.pastGuesses,
    difficulty: game.difficulty,
    players: game.players,
    playerId: hostPlayerId
  });
};

const guessWord = (req, res) => {
  const guess = req.body.guess;
  const gameId = req.params.gameId;

  const game = fetchGame(gameId);
  if (!game || game == {}) {
    return res.status(404).json({ message: "Game not found." });
  }
  if (guess.length !== game.wordLength) {
    return res.status(400).json({
      message: `Guess must be ${game.wordLength} letters long.`,
    });
  }

  const remainingAttempts = game.maxAttempts - (game.pastGuesses?.length || 0);

  if (remainingAttempts <= 0) {
    return res.status(403).json({
      error: "No remaining attempts",
      remainingAttempts: 0,
    });
  }

  const { gameWord, difficulty, candidateWords } = game;
  var guessEvaluation;
  if (difficulty === "HARD") {
    const { pattern, newCandidates } = cheatEvaluate(
      guess,
      candidateWords,
      game.wordLength,
    );
    game.candidateWords = newCandidates;
    guessEvaluation = pattern;
  } else {
    guessEvaluation = evaluateGuess(guess, gameWord, WORD_LENGTH, difficulty);
  }

  game.pastGuesses = [
    ...(game.pastGuesses || []),
    { guess: guess, result: guessEvaluation },
  ];
  game.status = evaluateGameStatus(game);
  gameStore.set(game);
  res.json({
    guess: guess,
    gameId: gameId,
    result: guessEvaluation,
    remainingAttempts: remainingAttempts - 1,
    gameStatus: game.status,
  });
};

const getGame = (req, res) => {
  const gameId = req.params.gameId;
  const game = fetchGame(gameId);
  if (!game || game == {}) {
    return res.status(404).json({ message: "Game not found." });
  }
  return res.json({
    gameId: gameId,
    pastGuesses: game.pastGuesses,
    remainingAttempts: game.remainingAttempts,
    difficulty: game.difficulty,
  });
};

module.exports = { createGame, guessWord, getGame };
