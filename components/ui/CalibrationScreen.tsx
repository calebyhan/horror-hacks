'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GamePhase } from '@/types/game';
import { CalibrationPoint as CalibrationPointType } from '@/types/tracking';

/**
 * Generates 9-point calibration grid
 */
function generateCalibrationPoints(): CalibrationPointType[] {
  if (typeof window === 'undefined') return [];

  const margin = 100;
  const width = window.innerWidth - margin * 2;
  const height = window.innerHeight - margin * 2;

  return [
    // Top row
    { x: margin, y: margin, order: 0, completed: false },
    { x: margin + width / 2, y: margin, order: 1, completed: false },
    { x: margin + width, y: margin, order: 2, completed: false },

    // Middle row
    { x: margin, y: margin + height / 2, order: 3, completed: false },
    {
      x: margin + width / 2,
      y: margin + height / 2,
      order: 4,
      completed: false,
    },
    { x: margin + width, y: margin + height / 2, order: 5, completed: false },

    // Bottom row
    { x: margin, y: margin + height, order: 6, completed: false },
    { x: margin + width / 2, y: margin + height, order: 7, completed: false },
    { x: margin + width, y: margin + height, order: 8, completed: false },
  ];
}

export function CalibrationScreen() {
  const [points, setPoints] = useState<CalibrationPointType[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const setPhase = useGameStore((state) => state.setPhase);
  const setCalibrated = useGameStore((state) => state.setCalibrated);
  const setTrackingMode = useGameStore((state) => state.setTrackingMode);

  useEffect(() => {
    setPoints(generateCalibrationPoints());
  }, []);

  const handlePointClick = (index: number) => {
    if (index !== currentPoint || isCalibrating) return;

    setIsCalibrating(true);

    // Add a small delay to let WebGazer process the click
    setTimeout(() => {
      const newPoints = [...points];
      newPoints[index].completed = true;
      setPoints(newPoints);

      if (index < points.length - 1) {
        setCurrentPoint(index + 1);
        setIsCalibrating(false);
      } else {
        // Calibration complete
        setCalibrated(true);
        setTrackingMode('eye');
        setTimeout(() => {
          setPhase(GamePhase.PLAYING);
        }, 1000);
      }
    }, 500); // Give WebGazer time to register the click
  };

  const handleSkip = () => {
    setCalibrated(false);
    setTrackingMode('mouse');
    setPhase(GamePhase.PLAYING);
  };

  const progress =
    ((currentPoint + (isCalibrating ? 1 : 0)) / points.length) * 100;

  return (
    <div className="fixed inset-0 bg-background-primary">
      {/* Instructions */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-2xl font-mono text-ui-primary mb-4">
          EYE TRACKING CALIBRATION
        </h2>
        <p className="text-ui-secondary font-mono">
          Look at each point and click when ready
        </p>
        <p className="text-ui-secondary font-mono text-sm mt-2">
          Point {currentPoint + 1} of {points.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-64 h-3 bg-entity-shadow border border-ui-secondary">
        <div
          className="h-full bg-ui-success transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Calibration Points */}
      {points.map((point, index) => (
        <button
          key={point.order}
          onClick={() => handlePointClick(index)}
          disabled={index !== currentPoint}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            index === currentPoint
              ? 'scale-100 opacity-100'
              : point.completed
                ? 'scale-50 opacity-30'
                : 'scale-75 opacity-50'
          }`}
          style={{
            left: point.x,
            top: point.y,
          }}
        >
          <div
            className={`w-12 h-12 rounded-full border-4 ${
              index === currentPoint
                ? 'border-ui-accent bg-ui-accent/20 animate-pulse'
                : point.completed
                  ? 'border-ui-success bg-ui-success/20'
                  : 'border-ui-secondary bg-entity-shadow'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center text-ui-primary font-mono text-sm">
              {index + 1}
            </div>
          </div>
        </button>
      ))}

      {/* Skip Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center space-y-2">
        <button
          onClick={handleSkip}
          className="px-6 py-3 text-ui-secondary hover:text-ui-primary font-mono border border-ui-secondary transition-colors"
        >
          SKIP - USE MOUSE TRACKING
        </button>
        <p className="text-xs text-ui-secondary font-mono">
          (Eye tracking will be disabled)
        </p>
      </div>
    </div>
  );
}