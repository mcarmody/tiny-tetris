import { useState, useCallback } from 'react';
import { Board as BoardType, GameStatus, ActivePiece } from '../game/types';
import { createEmptyBoard, lockPiece, clearLines } from '../game/board';
import { getRandomPiece } from '../game/pieces';
import { canMove } from '../game/collision';
import Board from './Board';
import Controls from './Controls';
import useGameLoop from '../hooks/useGameLoop';
import useKeyboard from '../hooks/useKeyboard';

function Game() {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);

  const spawnPiece = () => {
    const piece = getRandomPiece();
    const spawnPosition = { x: 0, y: 0 };

    // Check if spawn position is blocked
    if (!canMove(board, piece, spawnPosition)) {
      // Game over - cannot spawn
      setStatus('gameover');
      setActivePiece(null);
      return;
    }

    setActivePiece({
      piece,
      position: spawnPosition,
    });
  };

  const movePiece = (dx: number, dy: number) => {
    if (!activePiece) return;

    const newPosition = {
      x: activePiece.position.x + dx,
      y: activePiece.position.y + dy,
    };

    if (canMove(board, activePiece.piece, newPosition)) {
      setActivePiece({
        ...activePiece,
        position: newPosition,
      });
    }
  };

  const tick = useCallback(() => {
    if (!activePiece) return;

    // Try to move piece down by 1
    const newPosition = {
      x: activePiece.position.x,
      y: activePiece.position.y + 1,
    };

    if (canMove(board, activePiece.piece, newPosition)) {
      // Move successful
      setActivePiece({
        ...activePiece,
        position: newPosition,
      });
    } else {
      // Collision detected - lock piece and spawn new one
      let newBoard = lockPiece(board, activePiece);
      newBoard = clearLines(newBoard);
      setBoard(newBoard);
      spawnPiece();
    }
  }, [activePiece, board]);

  const handleKeyPress = useCallback((key: string) => {
    switch (key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
    }
  }, [movePiece]);

  useGameLoop(tick, status === 'playing');
  useKeyboard(handleKeyPress, status === 'playing');

  const handleStart = () => {
    setBoard(createEmptyBoard());
    setStatus('playing');
    spawnPiece();
  };

  const handleRestart = () => {
    setBoard(createEmptyBoard());
    setActivePiece(null);
    setStatus('idle');
  };

  const handleMove = (direction: 'left' | 'right' | 'down') => {
    switch (direction) {
      case 'left':
        movePiece(-1, 0);
        break;
      case 'right':
        movePiece(1, 0);
        break;
      case 'down':
        movePiece(0, 1);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4 py-8">
      <div className="text-white text-3xl font-bold">
        Tetris
      </div>
      <Board board={board} activePiece={activePiece} />
      <Controls
        status={status}
        onStart={handleStart}
        onRestart={handleRestart}
        onMove={handleMove}
      />
    </div>
  );
}

export default Game;
