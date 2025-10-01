import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  initializeWebGazer,
  cleanupWebGazer,
  WebGazerInstance,
} from '@/lib/tracking/eyeTracking';
import { GazeProcessor } from '@/lib/tracking/gazeProcessor';
import { GazeData } from '@/types/tracking';

/**
 * Custom hook for eye tracking with WebGazer.js using React Query
 * @param enabled - Whether eye tracking should be enabled
 * @returns Query result with WebGazer instance
 */
export function useEyeTracking(enabled: boolean) {
  const gazeProcessorRef = useRef<GazeProcessor>(new GazeProcessor(5));
  const setGazePosition = useGameStore((state) => state.setGazePosition);
  const lastUpdateRef = useRef<number>(0);
  const DEBOUNCE_MS = 16; // ~60 FPS

  const query = useQuery({
    queryKey: ['eyeTracking', enabled],
    queryFn: async (): Promise<WebGazerInstance> => {
      if (!enabled) {
        throw new Error('Eye tracking not enabled');
      }

      const webgazer = await initializeWebGazer();
      return webgazer;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled,
    retry: 1,
  });

  // Set up gaze listener when WebGazer is ready
  useEffect(() => {
    if (!query.data || !enabled) {
      setGazePosition(null);
      return;
    }

    const webgazer = query.data;

    // Set up gaze listener with debouncing
    const gazeListener = (
      data: { x: number; y: number } | null,
      timestamp: number
    ) => {
      if (!data) {
        setGazePosition(null);
        return;
      }

      // Debounce updates
      const now = Date.now();
      if (now - lastUpdateRef.current < DEBOUNCE_MS) return;
      lastUpdateRef.current = now;

      // Add to processor buffer
      const gazeData: GazeData = {
        x: data.x,
        y: data.y,
        timestamp,
      };

      gazeProcessorRef.current.addGazePoint(gazeData);

      // Get smoothed gaze and update store
      const smoothedGaze = gazeProcessorRef.current.getSmoothedGaze();
      if (smoothedGaze) {
        setGazePosition(smoothedGaze);
      }
    };

    webgazer.setGazeListener(gazeListener);

    // Cleanup
    return () => {
      webgazer.clearGazeListener();
      setGazePosition(null);
    };
  }, [query.data, enabled, setGazePosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWebGazer();
      gazeProcessorRef.current.clear();
    };
  }, []);

  return query;
}

/**
 * Hook for requesting webcam permission
 * @returns Query for permission request
 */
export function useWebcamPermission() {
  return useQuery({
    queryKey: ['webcamPermission'],
    queryFn: async (): Promise<boolean> => {
      if (typeof window === 'undefined' || !navigator.mediaDevices) {
        return false;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (error) {
        console.error('Webcam permission denied:', error);
        return false;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: false, // Manual trigger
    retry: false,
  });
}