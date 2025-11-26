const express = require('express');
const router = express.Router();
const { createGame, getGame, guessWord } = require('../controllers/gameController');
const {validateSchemaMiddleware} = require('../controllers/utils');
const {guessBodySchema, createGameSchema} = require('../validators/schemas');

router.post('/game', validateSchemaMiddleware(createGameSchema),createGame);

router.post('/game/:gameId/guess', validateSchemaMiddleware(guessBodySchema), guessWord);

module.exports = router;