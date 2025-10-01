/**
 * Tracking mode
 */
export type TrackingMode = 'eye' | 'mouse' | 'auto';

/**
 * Gaze data from eye tracking
 */
export interface GazeData {
  x: number;
  y: number;
  timestamp: number;
  confidence?: number; // 0-1, optional accuracy metric
}

/**
 * Calibration point
 */
export interface CalibrationPoint {
  x: number;
  y: number;
  order: number;
  completed: boolean;
}

/**
 * Calibration state
 */
export interface CalibrationData {
  points: CalibrationPoint[];
  currentPoint: number;
  isComplete: boolean;
  accuracy: number;
}

/**
 * Tracking error types
 */
export enum TrackingError {
  NO_WEBCAM = 'NO_WEBCAM',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  TRACKING_LOST = 'TRACKING_LOST',
  LOW_ACCURACY = 'LOW_ACCURACY',
}

/**
 * Tracking status
 */
export interface TrackingStatus {
  isActive: boolean;
  mode: TrackingMode;
  isCalibrated: boolean;
  error: TrackingError | null;
  accuracy: number;
}