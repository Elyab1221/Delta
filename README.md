# 🎮 DELTA Game Hub

**A tiny browser arcade with Snake, Tetris, Flappy Bird, Tic-Tac-Toe, and Connect 4 — inspired by the games on retro handhelds and my grandma's old button phone.**

Play on a computer or on your phone. No installs, no build tools, no frameworks — just pure HTML, CSS, and vanilla JavaScript.

👉 **Live Demo:** [https://elyab1221.github.io/Delta/](https://elyab1221.github.io/Delta/)

![The Game Hub landing page](screenshots/landing.png)

| 🐍 Snake | 🧩 Tetris | 🐦 Flappy Bird | ❌ Tic-Tac-Toe | 🔴 Connect 4 |
| :---: | :---: | :---: | :---: | :---: |

---

## 🌟 What is it?

A mini web arcade packed with classic games. You start at the landing page, pick any game from the hub, and each game gives you a clean menu with four options:
- **Level / Opponent:** Choose difficulty or play against a friend vs. bot
- **Play:** Jump straight into the action
- **Highscore:** View your best scores and records
- **Help:** Quick guide on rules, controls, and goals

---

## 💡 Why I made it

I got the idea on a Friday night while trying to decide what to build for [Terra](https://terra.hackclub.com). I remembered the simple, addictive games on my grandma's old button phone: a tiny screen, a few buttons, and instant fun with zero loading screens or downloads.

I wanted to recreate that feeling directly in the browser for both desktop and mobile. I originally started with Snake and Tetris, and have now expanded the arcade with Flappy Bird, Tic-Tac-Toe, and Connect 4!

---

## 🕹️ Games & Features

### 🐍 Snake
- **3 Difficulty Levels:** Easy, Medium, and Hard (snake moves faster on higher difficulties).
- **Retro Look:** Styled with classic monochrome grid graphics inspired by old button phones.
- **Controls:** Arrow keys or `W` `A` `S` `D` on desktop; on-screen direction pad for touchscreens.
- Pause (`P`) and restart (`R`) support anytime.

### 🧩 Tetris
- **Full Mechanics:** All 7 tetromino pieces, rotation system, line clearing, and next-piece preview box.
- **10 Levels:** Pick your starting level (1–10). Every 10 rows cleared levels you up, making pieces drop faster.
- **Controls:** Arrow keys to move/rotate/soft-drop, `Space` for instant hard drop; dedicated mobile pad with a center `DROP` button.
- Score multiplier based on level, pause, restart, and game over screens.

### 🐦 Flappy Bird
- **3 Difficulty Levels:** Easy, Medium, and Hard (harder levels feature faster scrolling and narrower pipe gaps).
- **Mechanics:** Gravity physics, smooth flapping, pipe generation, and collision detection.
- **Controls:** `Space`, `↑`, or `X` to flap on PC; tap anywhere on the screen on mobile.
- Instant restart on crash.

### ❌ Tic-Tac-Toe
- **2 Game Modes:** 
  - *Play with a Friend:* Pass-and-play turns on the same device.
  - *Play with a Bot:* Challenge an automated AI opponent.
- **Smart Tracker:** Keeps count of games won against the bot and matches finished with friends.
- Turn indicator and winning strike highlight.

### 🔴 Connect 4
- **2 Game Modes:** Play with a friend (Red vs. Yellow alternating) or challenge the bot.
- **Mechanics:** Realistic vertical piece-dropping physics into 7 columns and 6 rows.
- **Win Detection:** Instant detection for horizontal, vertical, and diagonal 4-in-a-row connections.
- **Winning Line:** Dynamic strike-through line connects the 4 winning discs so you can clearly see how the match was won.
- Board full / tie-game detection and one-click restart button.

---

## 🎮 How to Play

| Game | Desktop / Keyboard | Mobile / Touch | Objective |
| :--- | :--- | :--- | :--- |
| **Snake** | Arrow keys or `W` `A` `S` `D` | On-screen D-pad | Eat food to grow without crashing into walls or your tail |
| **Tetris** | `←` `→` move, `↑` rotate, `↓` soft drop, `Space` hard drop | Touchpad under the board | Clear complete horizontal lines to score points and level up |
| **Flappy Bird** | `Space`, `↑`, or `X` to flap | Tap the screen | Fly through the pipe gaps without touching the ground or pipes |
| **Tic-Tac-Toe** | Mouse click on empty cell | Tap empty cell | Connect 3 of your marks (`X` or `O`) in a row |
| **Connect 4** | Click column to drop disc | Tap column to drop disc | Connect 4 of your colored discs in a row |
| **Pause / Restart** | `P` (Pause), `R` (Restart) | On-screen buttons | Pause or reset your current run |

---

## 🏆 Highscores

- Highscores and match stats are stored per game and per level using the browser's `localStorage`.
- **Note:** Scores are saved locally in your browser cache. If you clear browsing data or use a Private / Incognito window, local scores will reset.

---

## 🚀 How to Run Locally

No dependencies, node modules, or build steps required!

1. Clone or download the repository:
   ```bash
   git clone https://github.com/elyab1221/Delta.git
   ```
   *(Or click the green **Code** button → **Download ZIP** and extract it).*
2. Double-click `index.html` to open it in any web browser.
3. To test mobile views on a computer, press `F12` (Developer Tools) → `Ctrl + Shift + M` (Device Toolbar) and select a mobile device.

---

## 📂 Project Structure

```text
Delta game hub/
├── index.html          # Main Hub landing page & game selector
├── Hub.css             # Main Hub styles & screen transitions
├── Hub.js              # Hub controller, screen switcher & menu handlers
├── shared.js           # Shared storage, levels config & highscore utilities
├── screenshots/        # Preview screenshots for README
├── snake/              # Snake game files (snake.html, snake.css, snake.js)
├── tetris/             # Tetris game files (tetris.html, tetris.css, tetris.js)
├── flappy bird/        # Flappy bird files (flappy.html, flappy.css, flappy.js, sprites)
├── tic tac toe/        # Tic-Tac-Toe files (tic.html, tic.css, tic.js)
└── connect4/           # Connect 4 files (conn.html, conn.css, conn.js)
```

---

## 🧠 How it Works

- **State-driven Navigation:** The hub uses a clean screen and panel switching architecture (`landing` → `games` → `menu` → game page) without full page reloads.
- **URL Parameter Passing:** The menu launches games with parameters (e.g. `conn.html?level=friend` or `tetris.html?level=5`). `shared.js` parses the query string and loads the appropriate settings.
- **Canvas & DOM Engines:** Fast canvas rendering for action loops (Snake, Tetris, Flappy Bird) and lightweight DOM grid manipulation for board games (Tic-Tac-Toe, Connect 4).
- **Responsive Controls:** Flexible layouts scale automatically from desktop monitors to mobile smartphone screens with touch listeners.

---

## 📚 What I Learned

- How real-time game loops work (tick, update, draw, repeat) and how `requestAnimationFrame` keeps gameplay smooth across different refresh rates.
- Managing game state machines (menus, active play, paused, game over) cleanly without spaghetti code.
- Math and coordinate geometry in games: grid matrices, bounding box collisions, and trigonometry (`Math.atan2`, `Math.hypot`) for drawing dynamic winning connection lines.
- Debugging silent errors: CSS selector typos, loop boundary edge-cases, and variable naming consistency.

---

## 🔮 What's Next

- [ ] Global online leaderboard with a lightweight backend
- [ ] Sound effects and 8-bit chiptune background music
- [ ] Ghost piece and hard-drop animation for Tetris
- [ ] Smarter AI minimax algorithm for Tic-Tac-Toe and Connect 4

---

## 📜 Credits

Created for **Terra by Hack Club** using HTML, CSS, and JavaScript. 
- Tetris was originally created by Alexey Pajitnov in 1984.
- Snake popularized by Nokia handheld phones in 1997.
- Flappy Bird inspired by Dong Nguyen's 2013 classic.
- All versions in this hub are custom-coded web implementations.
