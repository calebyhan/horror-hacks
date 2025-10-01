import {
  Entity as EntityInterface,
  EntityConfig,
  EntityType,
  Vector2D,
  GAME_CONSTANTS,
} from '@/types/game';
import { GazeData } from '@/types/tracking';
import {
  calculateDistance,
  getDirectionVector,
  normalizeVector,
} from '@/lib/utils/math';

/**
 * Shadow entity class that moves toward center when not observed
 */
export class Entity implements EntityInterface {
  id: string;
  type: EntityType;

  position: Vector2D;
  velocity: Vector2D;
  targetPosition: Vector2D;
  speed: number;

  isFrozen: boolean;
  opacity: number;
  scale: number;

  freezeRadius: number;
  spawnTime: number;
  lastMoveTime: number;

  createdAt: number;

  constructor(config: EntityConfig) {
    this.id = crypto.randomUUID();
    this.type = config.type;

    this.position = { ...config.position };
    this.velocity = { x: 0, y: 0 };
    this.targetPosition =
      typeof window !== 'undefined'
        ? {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          }
        : { x: 0, y: 0 };
    this.speed = config.speed;

    this.isFrozen = false;
    this.opacity = GAME_CONSTANTS.ENTITY_OPACITY_MOVING;
    this.scale = GAME_CONSTANTS.ENTITY_SCALE;

    this.freezeRadius = config.freezeRadius || GAME_CONSTANTS.FREEZE_RADIUS;
    this.spawnTime = Date.now();
    this.lastMoveTime = Date.now();

    this.createdAt = Date.now();
  }

  /**
   * Updates entity state based on gaze position and delta time
   * @param deltaTime - Time since last update in milliseconds
   * @param gazePosition - Current gaze position
   * @param difficultyMultiplier - Difficulty scaling factor
   */
  update(
    deltaTime: number,
    gazePosition: GazeData | null,
    difficultyMultiplier: number = 1.0
  ): void {
    // Calculate distance from gaze
    const distanceFromGaze = this.calculateDistanceFromGaze(gazePosition);

    // Freeze/unfreeze logic
    if (distanceFromGaze < this.freezeRadius) {
      this.freeze();
    } else {
      this.unfreeze();
      this.moveTowardTarget(deltaTime, difficultyMultiplier);
    }

    // Update visual properties
    this.updateOpacity(distanceFromGaze);
  }

  /**
   * Calculates distance from gaze position
   * @param gazePosition - Current gaze position
   * @returns Distance in pixels
   */
  private calculateDistanceFromGaze(gazePosition: GazeData | null): number {
    if (!gazePosition) return Infinity;
    return calculateDistance(
      this.position.x,
      this.position.y,
      gazePosition.x,
      gazePosition.y
    );
  }

  /**
   * Freezes the entity (when being observed)
   */
  freeze(): void {
    if (!this.isFrozen) {
      this.isFrozen = true;
      this.velocity = { x: 0, y: 0 };
    }
  }

  /**
   * Unfreezes the entity (when not being observed)
   */
  unfreeze(): void {
    if (this.isFrozen) {
      this.isFrozen = false;
      this.lastMoveTime = Date.now();
    }
  }

  /**
   * Moves entity toward target position
   * @param deltaTime - Time since last update in milliseconds
   * @param difficultyMultiplier - Difficulty scaling factor
   */
  private moveTowardTarget(
    deltaTime: number,
    difficultyMultiplier: number
  ): void {
    // Update target to current screen center
    if (typeof window !== 'undefined') {
      this.targetPosition = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    }

    // Calculate direction to target
    const direction = getDirectionVector(this.position, this.targetPosition);

    // Apply velocity with difficulty scaling
    const adjustedSpeed = this.speed * difficultyMultiplier;
    const deltaSeconds = deltaTime / 1000;

    this.velocity = {
      x: direction.x * adjustedSpeed * deltaSeconds * 60, // 60 for frame-independent movement
      y: direction.y * adjustedSpeed * deltaSeconds * 60,
    };

    // Update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /**
   * Updates opacity based on distance from gaze
   * @param distance - Distance from gaze
   */
  private updateOpacity(distance: number): void {
    if (this.isFrozen) {
      this.opacity = GAME_CONSTANTS.ENTITY_OPACITY_FROZEN;
    } else {
      // Fade out when far from gaze
      const maxDistance = this.freezeRadius * 2;
      const fadeStart = this.freezeRadius * 1.5;

      if (distance > fadeStart) {
        const fadeAmount = (distance - fadeStart) / (maxDistance - fadeStart);
        this.opacity = Math.max(
          GAME_CONSTANTS.ENTITY_OPACITY_MOVING,
          1 - fadeAmount
        );
      } else {
        this.opacity = GAME_CONSTANTS.ENTITY_OPACITY_MOVING;
      }
    }
  }

  /**
   * Checks if entity has reached the target (game over condition)
   * @returns True if entity is at target
   */
  hasReachedTarget(): boolean {
    const distance = calculateDistance(
      this.position.x,
      this.position.y,
      this.targetPosition.x,
      this.targetPosition.y
    );
    return distance < GAME_CONSTANTS.DANGER_RADIUS;
  }

  /**
   * Resets entity with new config (for object pooling)
   * @param config - New entity configuration
   */
  reset(config?: EntityConfig): void {
    if (config) {
      this.type = config.type;
      this.position = { ...config.position };
      this.speed = config.speed;
      this.freezeRadius = config.freezeRadius || GAME_CONSTANTS.FREEZE_RADIUS;
    }

    this.velocity = { x: 0, y: 0 };
    this.isFrozen = false;
    this.opacity = GAME_CONSTANTS.ENTITY_OPACITY_MOVING;
    this.scale = GAME_CONSTANTS.ENTITY_SCALE;
    this.spawnTime = Date.now();
    this.lastMoveTime = Date.now();
    this.createdAt = Date.now();
  }
}