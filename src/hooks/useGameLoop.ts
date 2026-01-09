import { useEffect } from 'react';

function useGameLoop(callback: () => void, isRunning: boolean) {
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(callback, 1000);

    return () => clearInterval(intervalId);
  }, [callback, isRunning]);
}

export default useGameLoop;
