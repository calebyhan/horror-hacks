import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

/**
 * Custom hook for mouse tracking as fallback for eye tracking
 * @param enabled - Whether mouse tracking should be enabled
 */
export function useMouseTracking(enabled: boolean) {
  const setGazePosition = useGameStore((state) => state.setGazePosition);

  useEffect(() => {
    if (!enabled) {
      setGazePosition(null);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setGazePosition({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        confidence: 1.0, // Mouse tracking is 100% accurate
      });
    };

    const handleMouseLeave = () => {
      // Set gaze to null when mouse leaves viewport
      setGazePosition(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, setGazePosition]);
}