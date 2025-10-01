import { Entity } from './Entity';
import { EntityConfig, EntityType, Vector2D } from '@/types/game';
import { randomChoice, randomRange } from '@/lib/utils/math';

type Edge = 'top' | 'right' | 'bottom' | 'left';

/**
 * System for spawning entities from screen edges
 */
export class EntitySpawnSystem {
  private spawnTimer: number = 0;
  private baseSpawnInterval: number;

  constructor(baseSpawnInterval: number = 5000) {
    this.baseSpawnInterval = baseSpawnInterval;
  }

  /**
   * Updates spawn timer and spawns entities when ready
   * @param deltaTime - Time since last update
   * @param survivalTime - Total survival time
   * @param currentEntityCount - Current number of entities
   * @param maxEntities - Maximum allowed entities
   * @param onSpawn - Callback when entity spawns
   */
  update(
    deltaTime: number,
    survivalTime: number,
    currentEntityCount: number,
    maxEntities: number,
    onSpawn: (entity: Entity) => void
  ): void {
    // Don't spawn if at max capacity
    if (currentEntityCount >= maxEntities) return;

    this.spawnTimer += deltaTime;

    const spawnInterval = this.calculateSpawnInterval(survivalTime);

    if (this.spawnTimer >= spawnInterval) {
      const entity = this.spawnEntity(survivalTime);
      onSpawn(entity);
      this.spawnTimer = 0;
    }
  }

  /**
   * Calculates dynamic spawn interval based on survival time
   * @param survivalTime - Total survival time in milliseconds
   * @returns Spawn interval in milliseconds
   */
  private calculateSpawnInterval(survivalTime: number): number {
    const minInterval = 2000; // 2 seconds minimum
    const reduction = Math.floor(survivalTime / 10000) * 500; // -0.5s every 10s
    return Math.max(minInterval, this.baseSpawnInterval - reduction);
  }

  /**
   * Spawns a new entity from a random edge
   * @param survivalTime - Total survival time (affects difficulty)
   * @returns New entity instance
   */
  private spawnEntity(survivalTime: number): Entity {
    const edge = this.getRandomEdge();
    const position = this.getSpawnPosition(edge);
    const speed = this.calculateSpeed(survivalTime);
    const type = this.selectEntityType();

    const config: EntityConfig = {
      position,
      type,
      speed,
    };

    return new Entity(config);
  }

  /**
   * Selects a random edge to spawn from
   * @returns Random edge
   */
  private getRandomEdge(): Edge {
    const edges: Edge[] = ['top', 'right', 'bottom', 'left'];
    return randomChoice(edges);
  }

  /**
   * Gets spawn position coordinates for given edge
   * @param edge - Edge to spawn from
   * @returns Position vector
   */
  private getSpawnPosition(edge: Edge): Vector2D {
    if (typeof window === 'undefined') {
      return { x: 0, y: 0 };
    }

    const { innerWidth: width, innerHeight: height } = window;
    const margin = 50; // Spawn slightly off-screen

    switch (edge) {
      case 'top':
        return {
          x: randomRange(0, width),
          y: -margin,
        };
      case 'right':
        return {
          x: width + margin,
          y: randomRange(0, height),
        };
      case 'bottom':
        return {
          x: randomRange(0, width),
          y: height + margin,
        };
      case 'left':
        return {
          x: -margin,
          y: randomRange(0, height),
        };
    }
  }

  /**
   * Calculates entity speed based on survival time
   * @param survivalTime - Total survival time in milliseconds
   * @returns Entity speed
   */
  private calculateSpeed(survivalTime: number): number {
    const baseSpeed = 1.0;
    const speedIncrease = Math.floor(survivalTime / 30000) * 0.2; // +0.2 every 30s
    return baseSpeed + speedIncrease;
  }

  /**
   * Selects entity type (for now just shadow, can be extended)
   * @returns Entity type
   */
  private selectEntityType(): EntityType {
    // For MVP, always spawn shadow type
    // Can be extended to spawn different types based on difficulty/survival time
    return 'shadow';
  }

  /**
   * Resets spawn timer
   */
  reset(): void {
    this.spawnTimer = 0;
  }

  /**
   * Updates base spawn interval
   * @param interval - New base interval in milliseconds
   */
  setBaseSpawnInterval(interval: number): void {
    this.baseSpawnInterval = interval;
  }
}