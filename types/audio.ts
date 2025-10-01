/**
 * Audio category types
 */
export type AudioCategory = 'master' | 'sfx' | 'ambient';

/**
 * Audio configuration
 */
export interface AudioConfig {
  file: string;
  volume: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
  spatial?: boolean;
}

/**
 * Sound effect names
 */
export enum SoundEffect {
  ENTITY_SPAWN = 'ENTITY_SPAWN',
  ENTITY_FREEZE = 'ENTITY_FREEZE',
  WARNING_PING = 'WARNING_PING',
  GAME_OVER = 'GAME_OVER',
  UI_CLICK = 'UI_CLICK',
  CALIBRATION_COMPLETE = 'CALIBRATION_COMPLETE',
}

/**
 * Ambient sound names
 */
export enum AmbientSound {
  WHITE_NOISE = 'WHITE_NOISE',
  BACKGROUND_DRONE = 'BACKGROUND_DRONE',
  DISTANT_WHISPERS = 'DISTANT_WHISPERS',
  HEARTBEAT = 'HEARTBEAT',
}

/**
 * Volume settings
 */
export interface VolumeSettings {
  master: number;
  sfx: number;
  ambient: number;
}

/**
 * Spatial audio position
 */
export interface SpatialAudioPosition {
  x: number;
  y: number;
  pan: number; // -1 (left) to 1 (right)
  distance: number; // 0 (close) to 1 (far)
}