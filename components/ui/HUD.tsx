'use client';

import { useGameStore } from '@/store/gameStore';
import { useFPS } from '@/hooks/useGameLoop';
import { useSettingsStore } from '@/store/settingsStore';

export function HUD() {
  const survivalTime = useGameStore((state) => state.survivalTime);
  const trackingMode = useGameStore((state) => state.trackingMode);
  const dangerLevel = useGameStore((state) => state.getDangerLevel());
  const showFPS = useSettingsStore((state) => state.advanced.showFPS);
  const fps = useFPS();

  // Format time as MM:SS
  const minutes = Math.floor(survivalTime / 60000);
  const seconds = Math.floor((survivalTime % 60000) / 1000);
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        {/* Tracking Mode Indicator */}
        <div className="flex items-center gap-2 text-ui-secondary font-mono text-sm">
          <div
            className={`w-3 h-3 rounded-full ${
              trackingMode === 'eye' ? 'bg-ui-success' : 'bg-ui-secondary'
            }`}
          />
          <span>{trackingMode === 'eye' ? 'EYE TRACKING' : 'MOUSE'}</span>
        </div>

        {/* Timer */}
        <div className="text-ui-primary font-mono text-3xl">{timeString}</div>

        {/* FPS Counter (if enabled) */}
        {showFPS && (
          <div className="text-ui-secondary font-mono text-sm">
            FPS: {fps}
          </div>
        )}
      </div>

      {/* Danger Indicator (bottom center) */}
      {dangerLevel > 0.3 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div
            className={`w-16 h-16 rounded-full border-4 ${
              dangerLevel > 0.7 ? 'border-ui-accent' : 'border-ui-secondary'
            } animate-pulse`}
            style={{
              opacity: dangerLevel,
              animationDuration: `${1 - dangerLevel * 0.5}s`,
            }}
          />
        </div>
      )}
    </div>
  );
}