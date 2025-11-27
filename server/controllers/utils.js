const {baseGameObject} = require('../validators/schemas');

const evaluateGuess = (guess, answer, wordLength) => {
    const result = Array(wordLength).fill("miss");
    const answerLetters = answer.split("");
    const guessLetters = guess.split("");

    for (let i = 0; i < wordLength; i++) {
        if (guessLetters[i] === answerLetters[i]) {
        result[i] = "hit";
        answerLetters[i] = null;
        }
    }

    // Second pass → mark presents
    for (let i = 0; i < wordLength; i++) {
        if (result[i] === "hit") continue;

        const idx = answerLetters.indexOf(guessLetters[i]);
        if (idx !== -1) {
        result[i] = "present";
        answerLetters[idx] = null;
        }
    }
    return result;
}

const evaluateGameStatus = (game) => {
    try {
        baseGameObject.parse(game);
    }
    catch (err){
        return -1;
    }

    const pastGuesses = game.pastGuesses || [];
    const maxAttempts = game.maxAttempts;
    const latestGuessEvaluation = pastGuesses[pastGuesses.length - 1].result;

    if(latestGuessEvaluation.every(val => val === "hit")){
        return "WIN";
    }
    else if(pastGuesses.length < maxAttempts){
        return "IN_PROGRESS";
    }
    else if(pastGuesses.length === maxAttempts){
        return "LOSS";
    }

}

function patternScore(pattern) {
  let hits = 0;
  let presents = 0;
  for (const p of pattern) {
    if (p === "hit") hits++;
    else if (p === "present") presents++;
  }
  return hits * 10 + presents;
}


function cheatEvaluate(guess, candidates, wordLength) {
  const buckets = {};

  for (const candidate of candidates) {
    const pattern = evaluateGuess(guess, candidate, wordLength);
    const key = pattern.join(",");

    if (!buckets[key]) {
      buckets[key] = { pattern, words: [] };
    }
    buckets[key].words.push(candidate);
  }

  let bestPattern = null;
  let bestWords = null;
  let bestScore = Infinity;

  for (const { pattern, words } of Object.values(buckets)) {
    const score = patternScore(pattern);
    if (score < bestScore) {
      bestScore = score;
      bestPattern = pattern;
      bestWords = words;
    }
  }

  return { pattern: bestPattern, newCandidates: bestWords };
}

// todo - isolate into middleware directory
const validateSchemaMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            req.data = schema.parse(req.body);
            console.log(req.data);
            next();
        } catch (err){
            if (err.message) {
                return res.status(400).json({
                        message: err.issues.map(issue => issue.message),
                    });
                }
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = { evaluateGuess, validateSchemaMiddleware, evaluateGameStatus, cheatEvaluate }