import { Entity } from './Entity';
import { EntityConfig } from '@/types/game';

/**
 * Object pool for entity instances to minimize garbage collection
 */
export class EntityPool {
  private pool: Entity[] = [];
  private readonly maxPoolSize: number;

  constructor(maxPoolSize: number = 20) {
    this.maxPoolSize = maxPoolSize;
  }

  /**
   * Acquires an entity from the pool or creates new one
   * @param config - Entity configuration
   * @returns Entity instance
   */
  acquire(config: EntityConfig): Entity {
    let entity = this.pool.pop();

    if (!entity) {
      entity = new Entity(config);
    } else {
      entity.reset(config);
    }

    return entity;
  }

  /**
   * Releases an entity back to the pool
   * @param entity - Entity to release
   */
  release(entity: Entity): void {
    if (this.pool.length < this.maxPoolSize) {
      entity.reset();
      this.pool.push(entity);
    }
  }

  /**
   * Clears the entire pool
   */
  clear(): void {
    this.pool = [];
  }

  /**
   * Gets current pool size
   * @returns Number of pooled entities
   */
  getPoolSize(): number {
    return this.pool.length;
  }
}