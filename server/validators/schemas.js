const { z } = require("zod");

const guessBodySchema = z.object({
  guess: z.string().regex(/^[A-Z]+$/),
  playerId: z.uuid()
});

const baseGameObject = z.object({
  gameWord: z.string().regex(/^[A-Z]+$/),
  wordLength: z.number().int().positive(),
  maxAttempts: z.number().int().positive(),
  status: z.enum(["IN_PROGRESS", "WIN", "LOSS"]),
  players: z.array(z.uuid())
});

const createGameSchema = z.object({
  difficulty: z.enum(["NORMAL", "HARD"]),
});

module.exports = { guessBodySchema, baseGameObject, createGameSchema };
