const { z } = require("zod");

const guessBodySchema = z.object({
  guess: z.string().regex(/^[A-Z]+$/)
});

module.exports = {guessBodySchema}