import { Board, Piece, Position } from './types';

export function canMove(
  board: Board,
  piece: Piece,
  position: Position
): boolean {
  for (const block of piece.shape) {
    const x = position.x + block.x;
    const y = position.y + block.y;

    // Check bounds
    if (x < 0 || x >= 10 || y < 0 || y >= 20) {
      return false;
    }

    // Check board collision
    if (board[y][x] !== null) {
      return false;
    }
  }

  return true;
}
