import { Board as BoardType, ActivePiece } from '../game/types';
import Cell from './Cell';

type BoardProps = {
  board: BoardType;
  activePiece?: ActivePiece | null;
  clearingRows?: number[];
};

function Board({ board, activePiece, clearingRows = [] }: BoardProps) {
  const getCellColor = (x: number, y: number): string | null => {
    // Check if active piece occupies this cell
    if (activePiece) {
      const isActivePieceCell = activePiece.piece.shape.some(
        block => activePiece.position.x + block.x === x && activePiece.position.y + block.y === y
      );
      if (isActivePieceCell) return activePiece.piece.color;
    }
    // Fall back to board
    return board[y][x];
  };

  return (
    <div className="inline-block bg-gray-900 p-2">
      <div
        className="grid gap-px bg-gray-700"
        style={{
          gridTemplateColumns: 'repeat(10, 1.5rem)',
          gridTemplateRows: 'repeat(20, 1.5rem)',
        }}
      >
        {board.map((row, y) =>
          row.map((_, x) => (
            <Cell
              key={`${x}-${y}`}
              color={getCellColor(x, y)}
              isClearing={clearingRows.includes(y)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Board;
