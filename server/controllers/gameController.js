const gameStore = require('../store/games');
const {WORDS, WORD_LENGTH, GUESSES_PER_GAME} = require('../config/config');
const { v4: uuidv4 } = require('uuid');

const createGame = (req, res) => {
  const gameId = uuidv4();
  const gameWord = WORDS[Math.floor(Math.random() * WORDS.length)]
  const game = {gameWord: gameWord, wordLength: WORD_LENGTH, maxAttempts: GUESSES_PER_GAME}

  gameStore.set(gameId, game);

  console.log(gameStore.keys())

  res.json({ gameId: gameId, wordLength: WORD_LENGTH, maxAttempts: GUESSES_PER_GAME });
};

module.exports = { createGame };


