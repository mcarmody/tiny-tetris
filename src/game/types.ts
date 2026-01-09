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
