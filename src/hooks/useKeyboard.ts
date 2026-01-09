import { useEffect } from 'react';

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

export default useKeyboard;
