import { Board, ActivePiece } from './types';

export function createEmptyBoard(): Board {
  return Array(20).fill(null).map(() => Array(10).fill(null));
}

export function lockPiece(board: Board, activePiece: ActivePiece): Board {
  const newBoard = board.map(row => [...row]);

  activePiece.piece.shape.forEach(block => {
    const x = activePiece.position.x + block.x;
    const y = activePiece.position.y + block.y;
    newBoard[y][x] = activePiece.piece.color;
  });

  return newBoard;
}

export function getFullRows(board: Board): number[] {
  const fullRows: number[] = [];
  board.forEach((row, index) => {
    if (row.every(cell => cell !== null)) {
      fullRows.push(index);
    }
  });
  return fullRows;
}

export function clearLines(board: Board): Board {
  const clearedBoard = board.filter(row => row.some(cell => cell === null));
  const clearedCount = 20 - clearedBoard.length;
  const emptyRows = Array(clearedCount).fill(null).map(() => Array(10).fill(null));
  return [...emptyRows, ...clearedBoard];
}
