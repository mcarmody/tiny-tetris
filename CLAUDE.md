# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based Tetris game built with React, TypeScript, and Tailwind CSS for Encord's hiring process. This is a simplified implementation with no piece rotation, focusing on core mechanics: falling pieces, collision detection, line clearing, and game states.

## Tech Stack

- **Vite**: Build tool and dev server
- **React 18**: UI framework
- **TypeScript**: Type safety for game state
- **Tailwind CSS v4**: Styling and grid layout

## Tailwind CSS v4 Setup

**IMPORTANT**: This project uses Tailwind CSS v4, which has a different setup than v3.

### Installation
```bash
npm create vite@latest . -- --template react-ts
npm install -D tailwindcss@latest @tailwindcss/vite
```

### Configuration
**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**src/index.css:**
```css
@import "tailwindcss";
```

### Key Differences from v3
- **NO** `tailwind.config.js` file needed (v4 uses Vite plugin)
- **NO** PostCSS config needed
- Use `@import "tailwindcss";` instead of `@tailwind` directives
- Configuration is optional; customization done through CSS or plugin options
- Utility classes like `bg-cyan-500`, `grid`, etc. work the same

## Project Structure

```
src/
├── components/
│   ├── Game.tsx          # Main game container, orchestrates state
│   ├── Board.tsx         # Renders 10×20 grid
│   ├── Cell.tsx          # Individual cell (empty or filled)
│   └── Controls.tsx      # Start/restart buttons, on-screen arrows
├── hooks/
│   ├── useGameLoop.ts    # Interval-based tick (1 second)
│   └── useKeyboard.ts    # Keyboard event handling
├── game/
│   ├── types.ts          # Type definitions
│   ├── pieces.ts         # 7 tetromino definitions
│   ├── board.ts          # Board manipulation functions
│   └── collision.ts      # Collision detection logic
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── index.css             # Tailwind v4 import: @import "tailwindcss";
vite.config.ts            # Includes @tailwindcss/vite plugin
```

## Development Commands

Once the project is set up (Phase 1), use:
- `npm install` - Install dependencies
- `npm run dev` - Start development server (opens at http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Core Architecture Concepts

### Coordinate System
- Origin (0,0) is **top-left**
- X increases rightward (columns 0-9)
- Y increases downward (rows 0-19)
- Board array indexed as `board[y][x]` (row-major)

### Active Piece vs Board Separation
**Critical design pattern**: The active (falling) piece is NOT stored in the board array.

- `board`: Only contains locked pieces (type: `Cell[][]` where `Cell = string | null`)
- `activePiece`: Separate state with `{ piece: Piece, position: Position }`
- Rendering: Overlay active piece cells on top of board during render

This separation:
- Keeps board state clean (only locked pieces)
- Simplifies collision detection (check against board, not against self)
- Makes movement logic simpler (just update position, don't mutate board)

### Game Loop Flow
Every 1000ms (while status === 'playing'):
1. Attempt to move active piece down by 1
2. If collision detected:
   - Lock piece to board (copy piece colors into board array)
   - Clear any full rows
   - Spawn new piece at (0,0)
   - If spawn blocked → set status to 'gameover'

### Collision Detection
`canMove(board, piece, position) → boolean`

For each block in piece.shape:
1. Calculate absolute position: `{ x: position.x + block.x, y: position.y + block.y }`
2. Check bounds: x ∈ [0,9], y ∈ [0,19]
3. Check board: `board[y][x]` must be null

Return true only if ALL blocks pass ALL checks.

### Line Clearing Algorithm
```typescript
// After locking piece:
const clearedBoard = board.filter(row => row.some(cell => cell === null));
const clearedCount = 20 - clearedBoard.length;
const emptyRows = Array(clearedCount).fill(null).map(() => Array(10).fill(null));
return [...emptyRows, ...clearedBoard];
```

### Piece Definitions
7 tetrominoes (I, O, T, S, Z, J, L) defined as arrays of relative positions from anchor (0,0):
- Example: `I_PIECE.shape = [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:3,y:0}]`
- Each has a Tailwind color class (I: cyan-500, O: yellow-500, T: purple-500, etc.)
- **No rotation** - pieces spawn in fixed orientation

### State Management
Start with `useState` for simplicity:
```typescript
const [status, setStatus] = useState<GameStatus>('idle');
const [board, setBoard] = useState<Board>(createEmptyBoard());
const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
```

Can refactor to `useReducer` if state transitions become complex.

## Critical Implementation Details

### Game Loop Hook
`useGameLoop` must:
- Start interval when status === 'playing'
- Clear interval when status becomes 'idle' or 'gameover'
- Clear interval on component unmount
- Use 1000ms interval

### Keyboard Hook
`useKeyboard` must:
- Call `e.preventDefault()` on arrow keys to prevent page scroll
- Only process ArrowLeft, ArrowRight, ArrowDown
- Only active when status === 'playing'
- Clean up event listener on unmount

### Cell Rendering Logic
For each cell (x, y):
1. Check if active piece occupies this position
2. If yes, render active piece color
3. If no, render `board[y][x]` (null = empty)

### Edge Cases to Handle
1. **Spawn collision**: Check immediately after spawn, before first tick
2. **Piece boundaries**: I-piece is 4-wide, ensure all pieces fit when spawned at x=0
3. **Rapid key presses**: Run collision check on every move attempt, not just ticks
4. **Multiple line clears**: Test 2, 3, 4 simultaneous clears
5. **Interval cleanup**: Prevent orphaned intervals on rapid start/restart

## Game Scope

**In scope:**
- 10×20 grid
- 7 tetrominoes (no rotation)
- Fall speed: 1 row/second
- Keyboard controls: ← → ↓
- On-screen control buttons
- Line clearing (including multiple simultaneous rows)
- Game states: idle, playing, gameover
- Start/restart functionality

**Out of scope:**
- Piece rotation
- Scoring
- Levels/speed increase
- Hard drop
- Hold piece
- Next piece preview
- Sound effects
- Pause

## Type Definitions Reference

Key types to use (defined in `src/game/types.ts`):
- `GameStatus = 'idle' | 'playing' | 'gameover'`
- `Position = { x: number, y: number }`
- `PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'`
- `Piece = { type: PieceType, shape: Position[], color: string }`
- `ActivePiece = { piece: Piece, position: Position }`
- `Cell = string | null` (color class or empty)
- `Board = Cell[][]` (20 rows × 10 columns)
- `GameState = { status: GameStatus, board: Board, activePiece: ActivePiece | null }`

## CSS Grid Layout

Use Tailwind for board:
```jsx
<div className="grid grid-cols-10 grid-rows-[repeat(20,1fr)] gap-px">
  {/* 200 cells */}
</div>
```

Each cell should have fixed aspect ratio and appropriate background color.
