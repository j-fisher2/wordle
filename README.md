## Task 1: Normal Wordle

The game will select a **5-letter word** (the "answer") from a predefined, configurable word list. All words are expected to consist of English letters only and are case-insensitive.

### Scoring Rules

For each guessed letter:

- **Hit:** the letter is in the correct position in the answer.  
- **Present:** the letter is in the answer but in the wrong position.  
- **Miss:** the letter is not in the answer.  

Follow the reference game's logic for exact behavior.

### Solution Expectations

1. The Wordle implementation should support at least **two configurations**:
    - Maximum number of rounds before game over
    - The list of 5-letter words
2. A player **wins** if they guess the answer within the maximum allowed rounds.
3. A player **loses** if they fail to guess the answer after the maximum allowed rounds.

### Approach

- The client app selects a word from the preconfigured word list at random.
- For each user guess:
    1. Compare each letter to the answer to determine if it is a Hit, Present, or Miss.
    2. Return the result as an array to update the client state and UI.
- If the number of guesses exceeds the configured limit **or** the user guesses correctly, navigate to the game end state/component.

---

## Task 2: Client-Server Wordle

Based on Task 1, modify the solution to support a **client-server model**. Scoring rules remain the same.

### Solution Expectations

1. Inherits all expectations from Task 1.
2. The client **does not know the answer** before either guessing correctly or the game ending.
3. The server must handle **input validation** and manage game state.

### Approach

- Client sends guesses to the server via API calls.
- Server evaluates each guess and returns scoring results after performing request body input validation.
- Server maintains game state, including the number of guesses and whether the game is over.
- Client updates the UI and its internal state based on server responses and handles game over or win states.


## Task 3: Host cheating wordle

Based on task 1, modify the solution to support the “host cheating” feature.
The game flow will be similar to task 1, but the host will not select the answer at the beginning
of the game. Instead it will keep a list of candidates based on the received input.
The scoring rule will be the same as task 1. 

But there are new rules when comparing to other guess:  
    1. More Hit will have higher scores.
    2. If the number of Hit is the same, more Present will have higher score.

The list of candidates after each round should meet the criteria:
    - They should have lowest score in the finished round
    - They should match the result of previous rounds.
The solution is expected:
    1. To have expectation of task 1
    2. The external observer cannot tell if the host is cheating based on the guesses.


### Approach

- Begin game with full dictionary (word list) without selecting a target word
- Allow player to make a guess
- For each candidate word in the dictionary:
    - evaluate guess as if the candidate word was the target - ["hit", "miss", "miss", "present", "hit]
    - group candidate words by this evaluation pattern, ie words with the same evaluation pattern in the same word list subset
- For each pattern from the previous step:
    - score the pattern with the formula `score = hits * 10 + presents` to ensure the scoring rule
- Select the lowest scoring pattern (least revealing) pattern and the subset word list matching this pattern
- Set the new list of candidate words as this subset
- Repeat until single candidate remains and/or user guesses correctly such that the lowest scoring pattern is all "hit"

## Task 4: Multi-player wordle

Based on task 1, modify the solution to support multi-player feature.
There is no limitation on how a multi-play wordle should work. Here are some examples:
-
Each of Player A and Player B provide a 5-letter word, and let others guess.
-
2 players guessing the same word, while being able to monitor their opponents’
progress.
The solution is expected:
1. To design the game play, and state the reason / trade-off of the considerations
2. To have expectations of task 1, except how to determine the player wins.
3. There should be interaction between players.
4. If the answer is not provided by players, it will be the same across players.
5. Have clear rules on how players win, lose or tie.

### Approach

- **Create Game**
  - Update `createGame` endpoint on the server to return an **ephemeral game-player ID** (host-player ID) to the client.
- **Join Game**
  - Add a `join-game` server endpoint that accepts a **game ID** (shareable between players) and returns a **second game-player ID**.
  - Clients submit their game-player ID on requests to validate guesses and enforce **turn-based rules**.
- **Submitting Guesses**
  - Players submit guesses as normal, but the **server validates the correct player's turn** (host moves first).  
- **Polling for Updates**
  - Each client polls a `game` endpoint to receive updates on other players’ moves and past guesses.  
- **Scoring**
  - Each player’s score is determined by a formula such as:  
    ```text
    score = 2 * hits + presents
    ```
  - Winner is the player with the **highest score** after the game ends.  

### Notes / Considerations

- Ensure **turn-based enforcement** so players cannot guess out of turn.  
- Keep **game state centralized on the server** for consistency across clients.  
- Ephemeral player IDs prevent cheating and allow multiple players to join without sharing identifiers.  

### Design Trade-offs

#### 1. Turn-Based vs. Simultaneous Play
- **Turn-Based (current):**  
  - Pros: Simple to enforce fairness, easier to validate guesses and maintain server-side state.  
  - Cons: Slower gameplay, requires players to wait for their turn.  
- **Simultaneous Play:**  
  - Pros: Faster, more interactive gameplay.  
  - Cons: More complex server logic to handle concurrent guesses, race conditions, and score reconciliation.

#### 2. Polling vs. WebSockets
- **Polling (current approach):**  
  - Pros: Easy to implement with simple HTTP endpoints, compatible with most clients.  
  - Cons: Slight latency in receiving opponent moves, continuous requests add load on the server.  
- **WebSockets / Real-Time Push (update to this if given time):**  
  - Pros: Near-instant updates, efficient for real-time gameplay.  
  - Cons: More complex implementation, requires maintaining persistent connections, handling reconnections.

#### 3. Ephemeral Player IDs
- **Pros:**  
  - Prevents cheating by obscuring who is who (**update server side logic to avoid sending player list).  
  - Allows multiple players to join without exposing sensitive identifiers.  
  - Quick and easy no-sign-up process to begin playing game
- **Cons:**  
  - Requires careful handling of session lifecycle to avoid orphaned IDs.  

#### 4. Centralized Game State on Server
- **Pros:**  
  - Ensures consistency across all clients, simplifies validation and scoring.  
  - Easier to implement multiplayer interactions and enforce turn rules.  
- **Cons:**  
  - Increases server load, requires reliable server uptime.  
  - migrate to centralized storage server if given time

#### 5. Scoring Formula (e.g., 2 * Hits + Presents)
- **Pros:**  
  - Simple and encourages guessing letters in correct positions.  
- **Cons:**  
  - May not reflect strategic difficulty of guessing letters in certain positions; alternative formulas could be considered for balancing competitiveness.


## Design Choices / Bells & Whistles

- **Task 1 vs Task 2 Selection (Offline / Online Mode)**  
  - Users can choose between **offline (client-only)** and **online (client-server)** modes on the UI.  
  - Ensures players can still play even when **network connectivity is unavailable** or the server is down, improving availability.

- **Task 3: Multiplayer Mode with Difficulty Selection**  
  - Multiplayer is available alongside **Normal and Hard modes**.  
  - Hard mode is only available in the server-hosted game to prevent host-side cheating from being obvious.  
  - This design balances **fair gameplay** with a **good user experience**, keeping competitive play engaging.

- **Toast Notifications for UI/UX**  
  - Provides real-time, **non-intrusive feedback** for events such as invalid guesses, or turn notifications.  
  - Improves **user awareness** without cluttering the interface.

- **Task 4: Join a Friend’s Game**  
  - Users can share a **game ID** and join friends’ sessions using the “Join a Friend’s Game” button.  
  - Supports **multiplayer interaction** while keeping player identities ephemeral for privacy and fairness.


## Running the Application

Follow these steps to run the React (Vite) client and Express server using Docker Compose.

### 1. Start the backend and frontend

Ensure ports 5713 (client) and 5101 (server) are free on your machine.
Navigate to the Docker directory and start the application:

```bash
cd docker
docker compose up --build
```

### 2. Open the frontend

Once the containers are running, open your browser and navigate to http://localhost:5713 to start a game client

### 3. Test multiplayer

- Open multiple browser windows in incognito mode to simulate multiple players and isolated browser state.
- Start a new game on the first client, and use its game id to join on the second incognito client

### 4. Stop the containers

Stop the containers after testing
```bash
docker compose down
```

## Networking note

- The frontend (Vite) is served from a Docker container, but all fetch requests are executed in the browser, which runs on the host machine, not inside Docker, which is why `localhost` is used within the frontend container.
- Because the browser runs on the host, it can only reach the backend through localhost:<port>, not through Docker service names.
