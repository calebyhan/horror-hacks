import { Vector2D } from '@/types/game';

/**
 * Calculates the Euclidean distance between two points
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns The distance between the points
 */
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Calculates distance between two vectors
 * @param v1 - First vector
 * @param v2 - Second vector
 * @returns The distance between vectors
 */
export function vectorDistance(v1: Vector2D, v2: Vector2D): number {
  return calculateDistance(v1.x, v1.y, v2.x, v2.y);
}

/**
 * Normalizes a vector to unit length
 * @param v - Vector to normalize
 * @returns Normalized vector
 */
export function normalizeVector(v: Vector2D): Vector2D {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  if (length === 0) return { x: 0, y: 0 };
  return {
    x: v.x / length,
    y: v.y / length,
  };
}

/**
 * Calculates direction vector from one point to another
 * @param from - Starting point
 * @param to - Target point
 * @returns Normalized direction vector
 */
export function getDirectionVector(from: Vector2D, to: Vector2D): Vector2D {
  const direction = {
    x: to.x - from.x,
    y: to.y - from.y,
  };
  return normalizeVector(direction);
}

/**
 * Linearly interpolates between two values
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamps a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Maps a value from one range to another
 * @param value - Value to map
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Mapped value
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Generates a random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

/**
 * Returns a random item from an array
 * @param array - Array to choose from
 * @returns Random item
 */
export function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}