'use client';

import { useSettingsStore } from '@/store/settingsStore';
import { useGameStore } from '@/store/gameStore';
import { DifficultyLevel } from '@/types/game';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const settings = useSettingsStore();
  const setDifficulty = useGameStore((state) => state.setDifficulty);

  const difficulties: DifficultyLevel[] = ['easy', 'normal', 'hard', 'nightmare'];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4">
      <div className="bg-background-primary border border-ui-secondary p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <h2 className="text-3xl font-mono text-ui-primary mb-6 text-center">
          SETTINGS
        </h2>

        <div className="space-y-8">
          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-mono text-ui-secondary border-b border-ui-secondary pb-2">
              AUDIO
            </h3>

            <div className="space-y-2">
              <label className="block">
                <span className="text-ui-primary font-mono text-sm">
                  Master Volume: {Math.round(settings.audio.masterVolume * 100)}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audio.masterVolume * 100}
                  onChange={(e) =>
                    settings.setMasterVolume(Number(e.target.value) / 100)
                  }
                  className="w-full mt-2"
                />
              </label>

              <label className="block">
                <span className="text-ui-primary font-mono text-sm">
                  SFX Volume: {Math.round(settings.audio.sfxVolume * 100)}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audio.sfxVolume * 100}
                  onChange={(e) =>
                    settings.setSfxVolume(Number(e.target.value) / 100)
                  }
                  className="w-full mt-2"
                />
              </label>

              <label className="block">
                <span className="text-ui-primary font-mono text-sm">
                  Ambient Volume: {Math.round(settings.audio.ambientVolume * 100)}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audio.ambientVolume * 100}
                  onChange={(e) =>
                    settings.setAmbientVolume(Number(e.target.value) / 100)
                  }
                  className="w-full mt-2"
                />
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.audio.isMuted}
                  onChange={settings.toggleMute}
                  className="w-4 h-4"
                />
                <span className="text-ui-primary font-mono text-sm">Mute All</span>
              </label>
            </div>
          </div>

          {/* Gameplay Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-mono text-ui-secondary border-b border-ui-secondary pb-2">
              GAMEPLAY
            </h3>

            <div className="space-y-2">
              <label className="block">
                <span className="text-ui-primary font-mono text-sm">Difficulty</span>
                <select
                  value={settings.gameplay.difficulty}
                  onChange={(e) => {
                    const diff = e.target.value as DifficultyLevel;
                    settings.setDifficulty(diff);
                    setDifficulty(diff);
                  }}
                  className="w-full mt-2 bg-background-secondary text-ui-primary font-mono p-2 border border-ui-secondary"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.gameplay.showTutorial}
                  onChange={(e) => settings.setShowTutorial(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-ui-primary font-mono text-sm">
                  Show Tutorial
                </span>
              </label>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-mono text-ui-secondary border-b border-ui-secondary pb-2">
              ACCESSIBILITY
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.accessibility.highContrast}
                  onChange={(e) => settings.setHighContrast(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-ui-primary font-mono text-sm">
                  High Contrast
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.accessibility.reduceMotion}
                  onChange={(e) => settings.setReduceMotion(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-ui-primary font-mono text-sm">
                  Reduce Motion
                </span>
              </label>

              <label className="block">
                <span className="text-ui-primary font-mono text-sm">
                  UI Scale: {Math.round(settings.accessibility.uiScale * 100)}%
                </span>
                <input
                  type="range"
                  min="80"
                  max="150"
                  value={settings.accessibility.uiScale * 100}
                  onChange={(e) =>
                    settings.setUiScale(Number(e.target.value) / 100)
                  }
                  className="w-full mt-2"
                />
              </label>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-mono text-ui-secondary border-b border-ui-secondary pb-2">
              ADVANCED
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.advanced.showFPS}
                  onChange={(e) => settings.setShowFPS(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-ui-primary font-mono text-sm">
                  Show FPS Counter
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.advanced.showDebugInfo}
                  onChange={(e) => settings.setShowDebugInfo(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-ui-primary font-mono text-sm">
                  Show Debug Info
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-entity-shadow hover:bg-entity-frozen text-ui-primary font-mono text-lg border border-ui-secondary transition-colors rounded"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}