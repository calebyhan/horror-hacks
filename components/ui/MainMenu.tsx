'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GamePhase } from '@/types/game';
import { SettingsModal } from './SettingsModal';
import { HowToPlayModal } from './HowToPlayModal';

export function MainMenu() {
  const setPhase = useGameStore((state) => state.setPhase);
  const highScore = useGameStore((state) => state.highScore);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleStartGame = () => {
    setPhase(GamePhase.CALIBRATION);
  };

  return (
    <>
      {/* Main Menu - hide when modals are open */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-background-primary ${
          showSettings || showHowToPlay ? 'hidden' : ''
        }`}
      >
        <div className="text-center space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-6xl font-mono text-ui-primary tracking-wider">
              SHADOWS
            </h1>
            <h2 className="text-4xl font-mono text-ui-secondary">
              IN THE STATIC
            </h2>
          </div>

          {/* High Score */}
          {highScore > 0 && (
            <div className="text-ui-secondary font-mono">
              <p>HIGH SCORE</p>
              <p className="text-2xl text-ui-primary">{highScore}</p>
            </div>
          )}

          {/* Menu Buttons */}
          <div className="flex flex-col gap-4 mt-12">
            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-entity-shadow hover:bg-entity-frozen text-ui-primary font-mono text-xl border border-ui-secondary transition-colors"
            >
              START GAME
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="px-8 py-4 text-ui-secondary hover:text-ui-primary font-mono text-lg border border-ui-secondary transition-colors"
            >
              SETTINGS
            </button>

            <button
              onClick={() => setShowHowToPlay(true)}
              className="px-8 py-4 text-ui-secondary hover:text-ui-primary font-mono text-lg border border-ui-secondary transition-colors"
            >
              HOW TO PLAY
            </button>
          </div>

          {/* Warning */}
          <p className="text-sm text-ui-secondary font-mono mt-8 max-w-md">
            This game uses webcam-based eye tracking.
            <br />
            Mouse tracking will be used as fallback.
          </p>
        </div>
      </div>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </>
  );
}