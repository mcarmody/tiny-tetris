# Encord Tetris: Technical Architecture

## Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Build | Vite | Fast dev server, simple config |
| UI | React 18 | Component model fits grid-based rendering |
| Language | TypeScript | Type safety for game state |
| Styling | Tailwind CSS | Rapid styling, easy grid layout |
| Rendering | CSS Grid + DOM | No continuous animation needed; cells snap to grid positions |

---

## Project Structure

```
encord-tetris/
├── src/
│   ├── components/
│   │   ├── Game.tsx           # Main game container, orchestrates state
│   │   ├── Board.tsx          # Renders 10×20 grid
│   │   ├── Cell.tsx           # Individual cell (empty or filled)
│   │   └── Controls.tsx       # Start/restart buttons, on-screen arrows
│   ├── hooks/
│   │   ├── useGameLoop.ts     # Interval-based tick (1 second)
│   │   └── useKeyboard.ts     # Keyboard event handling
│   ├── game/
│   │   ├── types.ts           # Type definitions
│   │   ├── pieces.ts          # 7 tetromino definitions
│   │   ├── board.ts           # Board manipulation functions
│   │   └── collision.ts       # Collision detection logic
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind imports
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Type Definitions

```typescript
// types.ts

export type GameStatus = 'idle' | 'playing' | 'gameover';

export type Position = {
  x: number;  // column (0-9)
  y: number;  // row (0-19, 0 = top)
};

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Piece = {
  type: PieceType;
  shape: Position[];  // Relative positions of blocks
  color: string;      // Tailwind color class
};

export type ActivePiece = {
  piece: Piece;
  position: Position;  // Top-left anchor position on board
};

// Board cell: null = empty, string = color class of locked piece
export type Cell = string | null;
export type Board = Cell[][];  // [row][column], 20 rows × 10 columns

export type GameState = {
  status: GameStatus;
  board: Board;
  activePiece: ActivePiece | null;
};
```

---

## Piece Definitions

Each tetromino defined with shape relative to anchor point (0,0):

```
I-piece:  ████      shape: [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:3,y:0}]

O-piece:  ██        shape: [{x:0,y:0}, {x:1,y:0}, {x:0,y:1}, {x:1,y:1}]
          ██

T-piece:  ███       shape: [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:1,y:1}]
           █

S-piece:   ██       shape: [{x:1,y:0}, {x:2,y:0}, {x:0,y:1}, {x:1,y:1}]
          ██

Z-piece:  ██        shape: [{x:0,y:0}, {x:1,y:0}, {x:1,y:1}, {x:2,y:1}]
           ██

J-piece:  █         shape: [{x:0,y:0}, {x:0,y:1}, {x:1,y:1}, {x:2,y:1}]
          ███

L-piece:    █       shape: [{x:2,y:0}, {x:0,y:1}, {x:1,y:1}, {x:2,y:1}]
          ███
```

**Colors (Tailwind classes):**
- I: `bg-cyan-500`
- O: `bg-yellow-500`
- T: `bg-purple-500`
- S: `bg-green-500`
- Z: `bg-red-500`
- J: `bg-blue-500`
- L: `bg-orange-500`

---

## Core Logic

### Game Loop

1. Every 1000ms (while status === 'playing'):
   - Attempt to move active piece down by 1
   - If collision detected:
     - Lock piece to board
     - Clear any full rows
     - Spawn new piece
     - If spawn blocked → game over

### Collision Detection

`canMove(board, piece, position) → boolean`

For each block in piece.shape:
1. Calculate absolute position: `{ x: position.x + block.x, y: position.y + block.y }`
2. Check bounds: x must be 0-9, y must be 0-19
3. Check board: `board[y][x]` must be null

Return true only if all blocks pass all checks.

### Line Clearing

1. After locking piece, scan all rows (bottom to top)
2. Row is full when every cell is non-null
3. Remove full rows from array
4. Prepend empty rows at top to maintain 20-row height

```typescript
function clearLines(board: Board): Board {
  const clearedBoard = board.filter(row => row.some(cell => cell === null));
  const clearedCount = 20 - clearedBoard.length;
  const emptyRows = Array(clearedCount).fill(null).map(() => Array(10).fill(null));
  return [...emptyRows, ...clearedBoard];
}
```

### Spawn Logic

- Spawn position: `{ x: 0, y: 0 }` (top-left corner)
- Random piece selection from 7 types
- If any block of new piece collides immediately → game over

---

## Board Coordinate System

- Origin (0,0) is top-left
- X increases rightward (columns 0-9)
- Y increases downward (rows 0-19)
- Board array indexed as `board[y][x]` (row-major)

```
     0 1 2 3 4 5 6 7 8 9  ← x (columns)
   ┌─────────────────────┐
 0 │                     │
 1 │                     │
 2 │                     │
 . │                     │
 . │                     │
19 │                     │
   └─────────────────────┘
 ↑
 y (rows)
```

---

## Rendering Strategy

### Active Piece vs Board

The active piece is **not** stored in the board array. Render separately:

1. Render the static board (locked pieces only)
2. Overlay active piece cells at their calculated absolute positions

This separation:
- Keeps board state clean (only locked pieces)
- Simplifies collision detection (check against board, not against self)
- Makes movement logic simpler (just update position, don't mutate board)

### Cell Rendering

```typescript
// For each cell position (x, y):
// 1. Check if active piece occupies this cell
// 2. If not, check board[y][x]
// 3. Render with appropriate color or empty state

function getCellColor(x: number, y: number, board: Board, activePiece: ActivePiece | null): string | null {
  // Check active piece first
  if (activePiece) {
    const isActivePieceCell = activePiece.piece.shape.some(
      block => activePiece.position.x + block.x === x && activePiece.position.y + block.y === y
    );
    if (isActivePieceCell) return activePiece.piece.color;
  }
  // Fall back to board
  return board[y][x];
}
```

---

## State Management

### Option A: useState (simpler)

```typescript
const [status, setStatus] = useState<GameStatus>('idle');
const [board, setBoard] = useState<Board>(createEmptyBoard());
const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
```

### Option B: useReducer (cleaner for complex transitions)

```typescript
type GameAction =
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'MOVE'; direction: 'left' | 'right' | 'down' }
  | { type: 'RESTART' };

const [state, dispatch] = useReducer(gameReducer, initialState);
```

**Recommendation:** Start with useState, refactor to useReducer if state updates become tangled.

---

## Game Loop Management

```typescript
// useGameLoop.ts
function useGameLoop(callback: () => void, isRunning: boolean) {
  useEffect(() => {
    if (!isRunning) return;
    
    const intervalId = setInterval(callback, 1000);
    
    return () => clearInterval(intervalId);
  }, [callback, isRunning]);
}
```

**Critical:** The interval must be:
- Started when status becomes 'playing'
- Cleared when status becomes 'idle' or 'gameover'
- Cleared on component unmount

---

## Keyboard Handling

```typescript
// useKeyboard.ts
function useKeyboard(onKey: (key: string) => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;
    
    const handler = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();  // Prevent page scroll
        onKey(e.key);
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, isActive]);
}
```

---

## CSS Grid Layout

```css
/* Board grid */
.board {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 1px;
}
```

Tailwind equivalent:
```jsx
<div className="grid grid-cols-10 grid-rows-[repeat(20,1fr)] gap-px">
  {/* 200 cells */}
</div>
```

---

## Helper Functions

### Create Empty Board

```typescript
function createEmptyBoard(): Board {
  return Array(20).fill(null).map(() => Array(10).fill(null));
}
```

### Get Random Piece

```typescript
function getRandomPiece(): Piece {
  const pieces = [I_PIECE, O_PIECE, T_PIECE, S_PIECE, Z_PIECE, J_PIECE, L_PIECE];
  return pieces[Math.floor(Math.random() * pieces.length)];
}
```

### Lock Piece to Board

```typescript
function lockPiece(board: Board, activePiece: ActivePiece): Board {
  const newBoard = board.map(row => [...row]);
  
  activePiece.piece.shape.forEach(block => {
    const x = activePiece.position.x + block.x;
    const y = activePiece.position.y + block.y;
    newBoard[y][x] = activePiece.piece.color;
  });
  
  return newBoard;
}
```

---

## Edge Cases to Handle

1. **Piece spawns partially off-screen:** I-piece is 4 wide, spawning at x=0 is fine but verify all pieces fit
2. **Rapid key presses:** Ensure collision checks happen on every move, not just ticks
3. **Multiple lines cleared:** Test with 2, 3, 4 simultaneous line clears
4. **Game over on spawn:** Must check collision immediately after spawn, before any tick
5. **Interval cleanup:** Verify no orphaned intervals on rapid start/restart
