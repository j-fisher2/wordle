**Author:** Justin Fisher - justinfisher340@gmail.com

## Task 1: Normal wordle
    Reference: https://www.nytimes.com/games/wordle/index.html
    The game will select a 5-letter word (aka. answer) from a predefined list (configurable), all
    5-letter words are expected to consist of English alphabet only and case-insensitive.
    In the assignment, the scoring rule will be the same as the reference game:

        - Hit: the letter is in the correct spot of answer.
        - Present: the letter is in the answer but wrong spot.
        - Miss: the letter is not in the answer.

    The exact logic should refer to the game of reference.

    The solution is expected:

        1. The wordle must have at least 2 configurations:
            - The maximum number of rounds before game over
            - The list of 5-letter words.
        2. The player can be identified as win if they guess the answer within the max allowed
            rounds
        3. The player can be identified as lose if they failed to guess the answer after the max
            allowed rounds

## Task 2: Client-server wordle

    Based on task 1, modify the solution to support the server / client model.
    The scoring rule will be the same as task 1.
    The solution is expected:
        1. To have expectation of task 1
        2. Client side will not know the answer before the client guessed correctly or game over.
        3. Server side will have input validation.