'use client';

import { useGameStore } from '@/store/gameStore';

export function PauseMenu() {
  const togglePause = useGameStore((state) => state.togglePause);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleResume = () => {
    togglePause();
  };

  const handleQuit = () => {
    resetGame();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-mono text-ui-primary">PAUSED</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleResume}
            className="px-8 py-4 bg-entity-shadow hover:bg-entity-frozen text-ui-primary font-mono text-xl border border-ui-secondary transition-colors"
          >
            RESUME
          </button>

          <button
            onClick={handleQuit}
            className="px-8 py-4 text-ui-secondary hover:text-ui-primary font-mono text-lg border border-ui-secondary transition-colors"
          >
            QUIT TO MENU
          </button>
        </div>

        <p className="text-sm text-ui-secondary font-mono mt-8">
          Press ESC to resume
        </p>
      </div>
    </div>
  );
}