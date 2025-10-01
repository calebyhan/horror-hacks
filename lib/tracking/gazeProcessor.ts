import { GazeData } from '@/types/tracking';

/**
 * Processes and smooths gaze data
 */
export class GazeProcessor {
  private buffer: GazeData[] = [];
  private readonly bufferSize: number;

  constructor(bufferSize: number = 5) {
    this.bufferSize = bufferSize;
  }

  /**
   * Adds a gaze point to the buffer
   * @param point - Gaze data point
   */
  addGazePoint(point: GazeData): void {
    this.buffer.push(point);
    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
    }
  }

  /**
   * Gets smoothed gaze position by averaging buffer
   * @returns Smoothed gaze data or null if buffer empty
   */
  getSmoothedGaze(): GazeData | null {
    if (this.buffer.length === 0) return null;

    // Average the buffer for smoother tracking
    const avgX =
      this.buffer.reduce((sum, p) => sum + p.x, 0) / this.buffer.length;
    const avgY =
      this.buffer.reduce((sum, p) => sum + p.y, 0) / this.buffer.length;

    // Use most recent timestamp
    const latestTimestamp = this.buffer[this.buffer.length - 1].timestamp;

    // Average confidence if available
    const confidences = this.buffer
      .filter((p) => p.confidence !== undefined)
      .map((p) => p.confidence!);
    const avgConfidence =
      confidences.length > 0
        ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length
        : undefined;

    return {
      x: avgX,
      y: avgY,
      timestamp: latestTimestamp,
      confidence: avgConfidence,
    };
  }

  /**
   * Clears the buffer
   */
  clear(): void {
    this.buffer = [];
  }

  /**
   * Gets current buffer size
   * @returns Number of points in buffer
   */
  getBufferLength(): number {
    return this.buffer.length;
  }
}