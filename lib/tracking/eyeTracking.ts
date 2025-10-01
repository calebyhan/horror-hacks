/**
 * WebGazer.js integration utilities
 */

declare global {
  interface Window {
    webgazer: any;
  }
}

export interface WebGazerInstance {
  setRegression: (type: string) => WebGazerInstance;
  setTracker: (type: string) => WebGazerInstance;
  begin: () => Promise<void>;
  pause: () => WebGazerInstance;
  resume: () => WebGazerInstance;
  end: () => void;
  showVideoPreview: (show: boolean) => WebGazerInstance;
  showPredictionPoints: (show: boolean) => WebGazerInstance;
  setGazeListener: (
    callback: (data: { x: number; y: number } | null, timestamp: number) => void
  ) => WebGazerInstance;
  clearGazeListener: () => WebGazerInstance;
}

/**
 * Initializes WebGazer.js
 * @returns WebGazer instance
 */
export async function initializeWebGazer(): Promise<WebGazerInstance> {
  // Dynamically import webgazer
  if (typeof window === 'undefined') {
    throw new Error('WebGazer can only be initialized in browser environment');
  }

  // Import webgazer dynamically
  const webgazer = (await import('webgazer')).default;

  // Initialize with settings
  await webgazer
    .setRegression('ridge') // Ridge regression
    .setTracker('TFFacemesh') // TensorFlow FaceMesh tracker
    .begin();

  // Hide UI elements
  webgazer.showVideoPreview(false);
  webgazer.showPredictionPoints(false);

  // Store reference globally
  window.webgazer = webgazer;

  return webgazer;
}

/**
 * Cleans up WebGazer instance
 */
export function cleanupWebGazer(): void {
  if (typeof window !== 'undefined' && window.webgazer) {
    try {
      window.webgazer.end();
      window.webgazer = undefined;
    } catch (error) {
      console.error('Error cleaning up WebGazer:', error);
    }
  }
}

/**
 * Pauses eye tracking
 */
export function pauseTracking(): void {
  if (typeof window !== 'undefined' && window.webgazer) {
    window.webgazer.pause();
  }
}

/**
 * Resumes eye tracking
 */
export function resumeTracking(): void {
  if (typeof window !== 'undefined' && window.webgazer) {
    window.webgazer.resume();
  }
}

/**
 * Checks if webcam is available
 * @returns Promise resolving to availability status
 */
export async function checkWebcamAvailability(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.mediaDevices) {
    return false;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === 'videoinput');
  } catch {
    return false;
  }
}

/**
 * Requests webcam permission
 * @returns Promise resolving to permission status
 */
export async function requestWebcamPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.mediaDevices) {
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop the stream immediately, we just needed permission
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error('Webcam permission denied:', error);
    return false;
  }
}