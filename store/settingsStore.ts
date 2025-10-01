import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameSettings, DEFAULT_SETTINGS } from '@/types/settings';
import { DifficultyLevel } from '@/types/game';
import { TrackingMode } from '@/types/tracking';

interface SettingsState extends GameSettings {
  // Audio Actions
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  toggleMute: () => void;

  // Gameplay Actions
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setTrackingMode: (mode: TrackingMode) => void;
  setShowTutorial: (show: boolean) => void;

  // Accessibility Actions
  setHighContrast: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  setUiScale: (scale: number) => void;

  // Advanced Actions
  setShowFPS: (show: boolean) => void;
  setShowDebugInfo: (show: boolean) => void;

  // Reset
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      // Audio Actions
      setMasterVolume: (volume) =>
        set((state) => ({
          audio: { ...state.audio, masterVolume: volume },
        })),

      setSfxVolume: (volume) =>
        set((state) => ({
          audio: { ...state.audio, sfxVolume: volume },
        })),

      setAmbientVolume: (volume) =>
        set((state) => ({
          audio: { ...state.audio, ambientVolume: volume },
        })),

      toggleMute: () =>
        set((state) => ({
          audio: { ...state.audio, isMuted: !state.audio.isMuted },
        })),

      // Gameplay Actions
      setDifficulty: (difficulty) =>
        set((state) => ({
          gameplay: { ...state.gameplay, difficulty },
        })),

      setTrackingMode: (mode) =>
        set((state) => ({
          gameplay: { ...state.gameplay, trackingMode: mode },
        })),

      setShowTutorial: (show) =>
        set((state) => ({
          gameplay: { ...state.gameplay, showTutorial: show },
        })),

      // Accessibility Actions
      setHighContrast: (enabled) =>
        set((state) => ({
          accessibility: { ...state.accessibility, highContrast: enabled },
        })),

      setReduceMotion: (enabled) =>
        set((state) => ({
          accessibility: { ...state.accessibility, reduceMotion: enabled },
        })),

      setUiScale: (scale) =>
        set((state) => ({
          accessibility: { ...state.accessibility, uiScale: scale },
        })),

      // Advanced Actions
      setShowFPS: (show) =>
        set((state) => ({
          advanced: { ...state.advanced, showFPS: show },
        })),

      setShowDebugInfo: (show) =>
        set((state) => ({
          advanced: { ...state.advanced, showDebugInfo: show },
        })),

      // Reset
      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'settings-storage',
    }
  )
);