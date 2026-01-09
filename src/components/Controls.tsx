import { GameStatus } from '../game/types';

type ControlsProps = {
  status: GameStatus;
  onStart: () => void;
  onRestart: () => void;
  onMove: (direction: 'left' | 'right' | 'down') => void;
};

function Controls({ status, onStart, onRestart, onMove }: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Start/Restart Button */}
      <div className="flex justify-center">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Start Game
          </button>
        )}
        {(status === 'playing' || status === 'gameover') && (
          <button
            onClick={onRestart}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Restart
          </button>
        )}
      </div>

      {/* Game Over Message */}
      {status === 'gameover' && (
        <div className="text-red-400 text-center font-semibold text-xl">
          Game Over!
        </div>
      )}

      {/* On-screen Arrow Buttons */}
      {status === 'playing' && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-gray-400 text-xs mb-1">On-screen Controls</div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onMove('down')}
              className="bg-gray-700 text-white w-12 h-12 rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
              aria-label="Move down"
            >
              ↓
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onMove('left')}
                className="bg-gray-700 text-white w-12 h-12 rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
                aria-label="Move left"
              >
                ←
              </button>
              <button
                onClick={() => onMove('right')}
                className="bg-gray-700 text-white w-12 h-12 rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
                aria-label="Move right"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Controls;
