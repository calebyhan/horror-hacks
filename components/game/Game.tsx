'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import { useMouseTracking } from '@/hooks/useMouseTracking';
import { GamePhase } from '@/types/game';

import { MainMenu } from '../ui/MainMenu';
import { CalibrationScreen } from '../ui/CalibrationScreen';
import { HUD } from '../ui/HUD';
import { GameOverScreen } from '../ui/GameOverScreen';
import { PauseMenu } from '../ui/PauseMenu';
import { GameCanvas } from './GameCanvas';

export function Game() {
  const phase = useGameStore((state) => state.phase);
  const isPaused = useGameStore((state) => state.isPaused);
  const trackingMode = useGameStore((state) => state.trackingMode);
  const setTrackingMode = useGameStore((state) => state.setTrackingMode);
  const startGame = useGameStore((state) => state.startGame);

  const settingsTrackingMode = useSettingsStore(
    (state) => state.gameplay.trackingMode
  );

  // Initialize tracking mode from settings
  useEffect(() => {
    if (settingsTrackingMode === 'auto') {
      // Auto mode will try eye tracking first
      setTrackingMode('auto');
    } else {
      setTrackingMode(settingsTrackingMode);
    }
  }, [settingsTrackingMode, setTrackingMode]);

  // Eye tracking (enabled as soon as we're not in menu phase for eye/auto modes)
  const shouldUseEyeTracking =
    (trackingMode === 'eye' || trackingMode === 'auto') &&
    phase !== GamePhase.MENU &&
    phase !== GamePhase.GAME_OVER;

  const eyeTrackingQuery = useEyeTracking(shouldUseEyeTracking);

  // Switch to mouse tracking if eye tracking fails in auto mode
  useEffect(() => {
    if (eyeTrackingQuery.error && trackingMode === 'auto') {
      setTrackingMode('mouse');
    }
  }, [eyeTrackingQuery.error, trackingMode, setTrackingMode]);

  // Mouse tracking (fallback or manual selection)
  const shouldUseMouseTracking =
    trackingMode === 'mouse' && phase === GamePhase.PLAYING;

  useMouseTracking(shouldUseMouseTracking);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (phase === GamePhase.PLAYING) {
          useGameStore.getState().togglePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  return (
    <div className="w-full h-screen overflow-hidden bg-background-primary">
      {/* Menu */}
      {phase === GamePhase.MENU && <MainMenu />}

      {/* Calibration */}
      {phase === GamePhase.CALIBRATION && <CalibrationScreen />}

      {/* Playing */}
      {phase === GamePhase.PLAYING && (
        <>
          <GameCanvas />
          <HUD />
          {isPaused && <PauseMenu />}
        </>
      )}

      {/* Paused */}
      {phase === GamePhase.PAUSED && (
        <>
          <GameCanvas />
          <HUD />
          <PauseMenu />
        </>
      )}

      {/* Game Over */}
      {phase === GamePhase.GAME_OVER && (
        <>
          <GameCanvas />
          <GameOverScreen />
        </>
      )}
    </div>
  );
}