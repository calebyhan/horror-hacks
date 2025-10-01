'use client';

import { useGameStore } from '@/store/gameStore';
import { GamePhase } from '@/types/game';

export function GameOverScreen() {
  const stats = useGameStore((state) => state.getGameStats());
  const setPhase = useGameStore((state) => state.setPhase);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleRetry = () => {
    resetGame();
    setPhase(GamePhase.PLAYING);
  };

  const handleMenu = () => {
    resetGame();
  };

  // Format survival time
  const minutes = Math.floor(stats.survivalTime / 60000);
  const seconds = Math.floor((stats.survivalTime % 60000) / 1000);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-danger/90 backdrop-blur-sm">
      <div className="text-center space-y-8 max-w-lg">
        {/* Game Over Title */}
        <h1 className="text-6xl font-mono text-ui-accent tracking-wider animate-pulse">
          GAME OVER
        </h1>

        {/* Stats */}
        <div className="bg-background-primary/50 border border-ui-secondary p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4 font-mono text-ui-primary">
            <div className="text-left">
              <p className="text-ui-secondary text-sm">SURVIVAL TIME</p>
              <p className="text-2xl">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
            </div>

            <div className="text-right">
              <p className="text-ui-secondary text-sm">SCORE</p>
              <p className="text-2xl">{stats.score}</p>
            </div>

            <div className="text-left">
              <p className="text-ui-secondary text-sm">ENTITIES FROZEN</p>
              <p className="text-2xl">{stats.entitiesFrozen}</p>
            </div>

            <div className="text-right">
              <p className="text-ui-secondary text-sm">HIGH SCORE</p>
              <p className="text-2xl text-ui-success">{stats.highScore}</p>
            </div>
          </div>

          {/* New High Score */}
          {stats.score === stats.highScore && stats.score > 0 && (
            <p className="text-ui-success font-mono animate-pulse">
              NEW HIGH SCORE!
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="px-8 py-4 bg-entity-shadow hover:bg-entity-frozen text-ui-primary font-mono text-lg border border-ui-secondary transition-colors"
          >
            RETRY
          </button>

          <button
            onClick={handleMenu}
            className="px-8 py-4 text-ui-secondary hover:text-ui-primary font-mono text-lg border border-ui-secondary transition-colors"
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}