import { Entity } from './Entity';
import { GAME_CONSTANTS } from '@/types/game';
import { calculateDistance } from '@/lib/utils/math';

/**
 * System for handling collision detection and game over conditions
 */
export class CollisionSystem {
  /**
   * Checks if any entity has reached the center (game over condition)
   * @param entities - Array of active entities
   * @returns True if game over
   */
  checkGameOver(entities: Entity[]): boolean {
    if (typeof window === 'undefined') return false;

    const screenCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    return entities.some((entity) => {
      const distance = calculateDistance(
        entity.position.x,
        entity.position.y,
        screenCenter.x,
        screenCenter.y
      );
      return distance < GAME_CONSTANTS.DANGER_RADIUS;
    });
  }

  /**
   * Gets the entity closest to the center
   * @param entities - Array of active entities
   * @returns Closest entity or null
   */
  getClosestEntity(entities: Entity[]): Entity | null {
    if (entities.length === 0 || typeof window === 'undefined') return null;

    const screenCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    let closestEntity: Entity | null = null;
    let minDistance = Infinity;

    for (const entity of entities) {
      const distance = calculateDistance(
        entity.position.x,
        entity.position.y,
        screenCenter.x,
        screenCenter.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestEntity = entity;
      }
    }

    return closestEntity;
  }

  /**
   * Gets distance of closest entity from center (for danger calculation)
   * @param entities - Array of active entities
   * @returns Distance in pixels, or Infinity if no entities
   */
  getMinDistanceFromCenter(entities: Entity[]): number {
    if (entities.length === 0 || typeof window === 'undefined') {
      return Infinity;
    }

    const screenCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    return Math.min(
      ...entities.map((entity) =>
        calculateDistance(
          entity.position.x,
          entity.position.y,
          screenCenter.x,
          screenCenter.y
        )
      )
    );
  }

  /**
   * Checks if an entity is outside viewport bounds (for cleanup)
   * @param entity - Entity to check
   * @param margin - Margin beyond viewport to allow
   * @returns True if entity is out of bounds
   */
  isOutOfBounds(entity: Entity, margin: number = 200): boolean {
    if (typeof window === 'undefined') return false;

    const { innerWidth: width, innerHeight: height } = window;

    return (
      entity.position.x < -margin ||
      entity.position.x > width + margin ||
      entity.position.y < -margin ||
      entity.position.y > height + margin
    );
  }
}