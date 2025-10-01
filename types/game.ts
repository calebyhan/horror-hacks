/**
 * Game phase enum defining all possible game states
 */
export enum GamePhase {
  MENU = 'MENU',
  CALIBRATION = 'CALIBRATION',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

/**
 * Difficulty levels
 */
export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'nightmare';

/**
 * Entity types with different behaviors
 */
export type EntityType = 'shadow' | 'phantom' | 'wraith';

/**
 * 2D vector for position and velocity
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Complete entity state
 */
export interface Entity {
  id: string;
  type: EntityType;

  // Position & Movement
  position: Vector2D;
  velocity: Vector2D;
  targetPosition: Vector2D;
  speed: number;

  // State
  isFrozen: boolean;
  opacity: number;
  scale: number;

  // Behavior
  freezeRadius: number;
  spawnTime: number;
  lastMoveTime: number;

  // Metadata
  createdAt: number;
}

/**
 * Configuration for entity spawning
 */
export interface EntityConfig {
  type: EntityType;
  position: Vector2D;
  speed: number;
  freezeRadius?: number;
}

/**
 * Difficulty configuration
 */
export interface DifficultyConfig {
  baseEntitySpeed: number;
  maxEntities: number;
  spawnInterval: number;
  freezeRadius: number;
}

/**
 * Game statistics
 */
export interface GameStats {
  survivalTime: number;
  entitiesFrozen: number;
  score: number;
  highScore: number;
  maxEntitiesSimultaneous: number;
}

/**
 * Player progress and achievements
 */
export interface PlayerProgress {
  gamesPlayed: number;
  totalSurvivalTime: number;
  longestSurvival: number;
  achievements: string[];
}

/**
 * Game constants
 */
export const GAME_CONSTANTS = {
  FREEZE_RADIUS: 150,
  DANGER_RADIUS: 100,
  BASE_SPAWN_INTERVAL: 5000,
  MIN_SPAWN_INTERVAL: 2000,
  ENTITY_SCALE: 1,
  ENTITY_OPACITY_MOVING: 0.3,
  ENTITY_OPACITY_FROZEN: 0.7,
} as const;