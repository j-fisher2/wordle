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

const validateSchema = (schema) => {
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

module.exports = { evaluateGuess, validateSchema }