const { z } = require("zod");

const guessBodySchema = z.object({
  guess: z.string().regex(/^[A-Z]+$/)
});

const baseGameObject = z.object({
  gameWord: z.string().regex(/^[A-Z]+$/),
  wordLength: z.number().int().positive(),
  maxAttempts: z.number().int().positive(),
  status: z.enum(["IN_PROGRESS", "WIN", "LOSS"])
});

module.exports = {guessBodySchema, baseGameObject}