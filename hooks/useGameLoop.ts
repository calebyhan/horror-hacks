import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GamePhase } from '@/types/game';

/**
 * Custom hook for managing the game loop
 * @param onUpdate - Callback function called every frame with delta time
 */
export function useGameLoop(onUpdate: (deltaTime: number) => void) {
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const phase = useGameStore((state) => state.phase);
  const isPaused = useGameStore((state) => state.isPaused);

  useEffect(() => {
    // Only run game loop during playing phase
    if (phase !== GamePhase.PLAYING || isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let isRunning = true;

    const gameLoop = (timestamp: number) => {
      if (!isRunning) return;

      // Calculate delta time
      const deltaTime = lastTimeRef.current
        ? timestamp - lastTimeRef.current
        : 16; // Default to 16ms (60 FPS) on first frame

      lastTimeRef.current = timestamp;

      // Call update callback
      onUpdate(deltaTime);

      // Continue loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, isPaused, onUpdate]);
}

/**
 * Hook for tracking FPS
 * @returns Current FPS
 */
export function useFPS(): number {
  const fpsRef = useRef<number>(60);
  const frameTimesRef = useRef<number[]>([]);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    let isRunning = true;
    let animationFrameId: number;
    let lastTime = performance.now();

    const measureFPS = () => {
      if (!isRunning) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Add to frame times buffer
      frameTimesRef.current.push(deltaTime);

      // Keep buffer at 60 frames
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Update FPS once per second
      if (currentTime - lastUpdateRef.current > 1000) {
        const averageFrameTime =
          frameTimesRef.current.reduce((sum, time) => sum + time, 0) /
          frameTimesRef.current.length;
        fpsRef.current = Math.round(1000 / averageFrameTime);
        lastUpdateRef.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      isRunning = false;
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return fpsRef.current;
}