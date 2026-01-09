# Encord Tetris: Project Plan

## Overview

A browser-based Tetris game built to demonstrate frontend skills for Encord's hiring process.

### Scope

**In scope:**
- 10-column × 20-row game grid
- 7 standard tetrominos (no rotation)
- Piece spawns at top-left, falls 1 row per second
- Collision detection (floor, walls, landed pieces)
- Line clearing (supports multiple simultaneous rows)
- Game states: idle, playing, game over
- Keyboard controls: ← → ↓
- On-screen control buttons (accessibility, touch devices)
- Start/restart functionality

**Out of scope:**
- Piece rotation
- Scoring system
- Levels/speed increase
- Hard drop
- Hold piece
- Next piece preview
- Sound effects
- Pause functionality

---

## Implementation Phases

### Phase 1: Project Setup

**Actions:**
- Initialize Vite + React + TypeScript project: `npm create vite@latest . -- --template react-ts`
- Install Tailwind CSS v4: `npm install -D tailwindcss@latest @tailwindcss/vite`
- Add `@tailwindcss/vite` plugin to `vite.config.ts`
- Add `@import "tailwindcss";` to `src/index.css`
- Create folder structure per technical architecture
- Verify dev server runs

**Acceptance criteria:**
- `npm run dev` shows blank React app with Tailwind working
- No `tailwind.config.js` file needed (v4 uses Vite plugin)

---

### Phase 2: Types, Pieces, and Board Utilities

**Actions:**
- Create `types.ts` with all type definitions
- Create `pieces.ts` with 7 tetromino definitions
- Export helper: `getRandomPiece(): Piece`
- Create `board.ts` with:
  - `createEmptyBoard(): Board`
  - `lockPiece(board, activePiece): Board` (stub for now)
  - `clearLines(board): Board` (stub for now)

**Acceptance criteria:**
- Types compile without errors
- Can import and log a random piece
- Can create an empty 20×10 board
- All pieces fit within board bounds when spawned at (0,0) (especially 4-wide I-piece)

---

### Phase 3: Board Rendering

**Actions:**
- Create `Cell.tsx`: renders single cell with color or empty state
- Create `Board.tsx`: renders 10×20 CSS Grid of cells
- Create `Game.tsx`: holds board state (using `createEmptyBoard()`), renders Board
- Update `App.tsx`: render Game component
- Style grid with visible borders/gaps

**Acceptance criteria:**
- 10×20 grid visible on screen
- Can manually set cells to colors and see them render
- App.tsx properly imports and renders Game

---

### Phase 4: Basic UI Controls

**Actions:**
- Create `Controls.tsx` with Start button
- Wire Start button to begin game (sets status to 'playing')
- Add basic styling for controls

**Acceptance criteria:**
- Start button visible on screen
- Clicking Start changes game status to 'playing'
- Can trigger state changes from UI

---

### Phase 5: Game Loop and Falling

**Actions:**
- Create `useGameLoop.ts`: setInterval hook that calls tick function
- Implement spawn logic in Game.tsx
- Render active piece overlaid on board
- Each tick: move piece down by 1

**Acceptance criteria:**
- Clicking Start spawns a piece at top-left
- Piece visually falls one row per second
- Piece falls through bottom (collision not yet implemented)

---

### Phase 6: Collision Detection

**Actions:**
- Create `collision.ts` with `canMove()` function
- Integrate collision check into tick: stop at floor
- Integrate collision check into tick: stop on landed pieces
- Add wall collision checks (will be fully tested when keyboard controls added)

**Acceptance criteria:**
- Piece stops at row 19 (floor)
- Piece stops when it would overlap a locked piece
- `canMove()` returns false for out-of-bounds positions (left past 0, right past 9)

---

### Phase 7: Lock and Line Clear

**Actions:**
- Implement `lockPiece()` and `clearLines()` in `board.ts` (created in Phase 2)
- When piece cannot fall further: lock it to board state
- After locking: check and clear full rows
- Rows above cleared rows drop down

**Acceptance criteria:**
- Locked pieces persist on board
- Completing a row removes it
- Multiple simultaneous rows clear correctly
- Board maintains 20 rows after clearing

---

### Phase 8: Keyboard Controls

**Actions:**
- Create `useKeyboard.ts`: listens for keydown events
- Left arrow: move piece left (if valid)
- Right arrow: move piece right (if valid)
- Down arrow: move piece down (if valid)
- Prevent default scroll behavior on arrow keys

**Acceptance criteria:**
- Arrow keys move piece in correct directions
- Movement respects collision (walls, floor, pieces)
- Page does not scroll when pressing arrows

---

### Phase 9: Complete UI Controls

**Actions:**
- Add Restart button to `Controls.tsx`
- Add on-screen arrow buttons for touch/accessibility
- Style controls appropriately

**Acceptance criteria:**
- Restart button resets game from any state
- On-screen arrows function identically to keyboard
- All controls are clearly labeled

---

### Phase 10: Game Over

**Actions:**
- Detect game over: new piece cannot spawn without collision
- Set status to 'gameover'
- Display game over message
- Restart button resets to idle state with empty board

**Acceptance criteria:**
- Game ends when pieces stack to top
- Clear "Game Over" message displayed
- Restart clears board and allows new game

---

### Phase 11: Polish

**Actions:**
- Review all edge cases
- Clean up any console warnings
- Verify responsive layout
- Write README with setup/run instructions
- Test full game flow multiple times

**Acceptance criteria:**
- No console errors or warnings
- Game plays smoothly
- README documents: install, run, controls
- Code is clean and well-organized

---

## README Template

```markdown
# Tetris - Encord Frontend Assignment

A browser-based Tetris game built with React, TypeScript, and Tailwind CSS.

## Setup

npm install
npm run dev

Open http://localhost:5173 in your browser.

## How to Play

1. Click "Start" to begin
2. Use arrow keys or on-screen buttons:
   - ← Move left
   - → Move right
   - ↓ Move down
3. Clear rows by filling them completely
4. Game ends when pieces reach the top

## Controls

| Key | Action |
|-----|--------|
| ← | Move piece left |
| → | Move piece right |
| ↓ | Move piece down |

On-screen buttons are also available for touch devices.

## Tech Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS v4
```
