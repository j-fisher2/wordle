const express = require("express");
const router = express.Router();
const {
  createGame,
  getGame,
  guessWord,
  joinGame
} = require("../controllers/gameController");
const { validateSchemaMiddleware, validateGameIdMiddleware } = require("../controllers/utils");
const { guessBodySchema, createGameSchema } = require("../validators/schemas");

router.post("/game", validateSchemaMiddleware(createGameSchema), createGame);

router.post(
  "/game/:gameId/guess",
  validateSchemaMiddleware(guessBodySchema),
  validateGameIdMiddleware,
  guessWord,
);

router.get("/game/:gameId", validateGameIdMiddleware, getGame);

router.post("/game/:gameId/join", validateGameIdMiddleware, joinGame)

module.exports = router;
