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

module.exports = { evaluateGuess }