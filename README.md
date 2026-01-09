# Tetris - Encord Frontend Assignment

A browser-based Tetris game built with React, TypeScript, and Tailwind CSS v4.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How to Play

1. Click "Start Game" to begin
2. Use arrow keys or on-screen buttons:
   - ← Move left
   - → Move right
   - ↓ Move down
3. Clear rows by filling them completely
4. Game ends when pieces reach the top
5. Click "Restart" to play again

## Controls

| Key | Action |
|-----|--------|
| ← | Move piece left |
| → | Move piece right |
| ↓ | Move piece down |

On-screen buttons are also available for touch devices and accessibility.

## Tech Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS v4

## Game Features

- 10×20 game grid
- 7 standard tetromino pieces (I, O, T, S, Z, J, L)
- Collision detection (floor, walls, landed pieces)
- Line clearing (supports multiple simultaneous rows)
- Game states: idle, playing, game over
- Keyboard and on-screen controls
- Responsive layout

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

