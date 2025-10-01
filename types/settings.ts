import { DifficultyLevel } from './game';
import { TrackingMode } from './tracking';

/**
 * Complete game settings
 */
export interface GameSettings {
  audio: AudioSettings;
  gameplay: GameplaySettings;
  accessibility: AccessibilitySettings;
  advanced: AdvancedSettings;
}

/**
 * Audio settings
 */
export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  isMuted: boolean;
}

/**
 * Gameplay settings
 */
export interface GameplaySettings {
  difficulty: DifficultyLevel;
  showTutorial: boolean;
  trackingMode: TrackingMode;
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  uiScale: number;
}

/**
 * Advanced/debug settings
 */
export interface AdvancedSettings {
  showFPS: boolean;
  showDebugInfo: boolean;
}

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: GameSettings = {
  audio: {
    masterVolume: 0.7,
    sfxVolume: 0.8,
    ambientVolume: 0.6,
    isMuted: false,
  },
  gameplay: {
    difficulty: 'normal',
    showTutorial: true,
    trackingMode: 'auto',
  },
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    uiScale: 1.0,
  },
  advanced: {
    showFPS: false,
    showDebugInfo: false,
  },
};