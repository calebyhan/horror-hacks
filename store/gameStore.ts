import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GamePhase,
  Entity,
  DifficultyLevel,
  GameStats,
  GAME_CONSTANTS,
  DifficultyConfig,
} from '@/types/game';
import { GazeData, TrackingMode } from '@/types/tracking';

/**
 * Difficulty configurations
 */
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    baseEntitySpeed: 0.5,
    maxEntities: 3,
    spawnInterval: 6000,
    freezeRadius: 200,
  },
  normal: {
    baseEntitySpeed: 1.0,
    maxEntities: 5,
    spawnInterval: 5000,
    freezeRadius: 150,
  },
  hard: {
    baseEntitySpeed: 1.5,
    maxEntities: 7,
    spawnInterval: 4000,
    freezeRadius: 120,
  },
  nightmare: {
    baseEntitySpeed: 2.0,
    maxEntities: 10,
    spawnInterval: 3000,
    freezeRadius: 100,
  },
};

interface GameState {
  // Phase Management
  phase: GamePhase;
  isPaused: boolean;

  // Gameplay
  startTime: number | null;
  survivalTime: number;
  score: number;
  highScore: number;
  entitiesFrozen: number;

  // Entities
  entities: Entity[];
  maxEntities: number;
  spawnRate: number;

  // Difficulty
  difficulty: DifficultyLevel;
  difficultyMultiplier: number;

  // Tracking
  trackingMode: TrackingMode;
  isCalibrated: boolean;
  gazePosition: GazeData | null;

  // Actions
  setPhase: (phase: GamePhase) => void;
  togglePause: () => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  updateSurvivalTime: (time: number) => void;
  incrementEntitiesFrozen: () => void;

  addEntity: (entity: Entity) => void;
  removeEntity: (id: string) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  clearEntities: () => void;

  setGazePosition: (position: GazeData | null) => void;
  setTrackingMode: (mode: TrackingMode) => void;
  setCalibrated: (calibrated: boolean) => void;

  setDifficulty: (difficulty: DifficultyLevel) => void;
  updateDifficultyMultiplier: (survivalTime: number) => void;

  // Computed
  getDangerLevel: () => number;
  getGameStats: () => GameStats;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      phase: GamePhase.MENU,
      isPaused: false,

      startTime: null,
      survivalTime: 0,
      score: 0,
      highScore: 0,
      entitiesFrozen: 0,

      entities: [],
      maxEntities: DIFFICULTY_CONFIGS.normal.maxEntities,
      spawnRate: DIFFICULTY_CONFIGS.normal.spawnInterval,

      difficulty: 'normal',
      difficultyMultiplier: 1.0,

      trackingMode: 'auto',
      isCalibrated: false,
      gazePosition: null,

      // Phase Actions
      setPhase: (phase) => set({ phase }),

      togglePause: () => set((state) => ({
        isPaused: !state.isPaused,
        phase: !state.isPaused ? GamePhase.PAUSED : GamePhase.PLAYING,
      })),

      startGame: () => {
        const config = DIFFICULTY_CONFIGS[get().difficulty];
        set({
          phase: GamePhase.PLAYING,
          startTime: Date.now(),
          survivalTime: 0,
          score: 0,
          entitiesFrozen: 0,
          entities: [],
          maxEntities: config.maxEntities,
          spawnRate: config.spawnInterval,
          difficultyMultiplier: 1.0,
          isPaused: false,
        });
      },

      endGame: () => {
        const state = get();
        const newHighScore = Math.max(state.score, state.highScore);
        set({
          phase: GamePhase.GAME_OVER,
          highScore: newHighScore,
          startTime: null,
        });
      },

      resetGame: () => {
        const config = DIFFICULTY_CONFIGS[get().difficulty];
        set({
          phase: GamePhase.MENU,
          isPaused: false,
          startTime: null,
          survivalTime: 0,
          score: 0,
          entitiesFrozen: 0,
          entities: [],
          maxEntities: config.maxEntities,
          spawnRate: config.spawnInterval,
          difficultyMultiplier: 1.0,
          gazePosition: null,
        });
      },

      // Time and Score
      updateSurvivalTime: (time) => {
        const score = Math.floor(time / 100); // 1 point per 100ms
        set({ survivalTime: time, score });
      },

      incrementEntitiesFrozen: () => set((state) => ({
        entitiesFrozen: state.entitiesFrozen + 1,
      })),

      // Entity Management
      addEntity: (entity) => set((state) => ({
        entities: [...state.entities, entity],
      })),

      removeEntity: (id) => set((state) => ({
        entities: state.entities.filter((e) => e.id !== id),
      })),

      updateEntity: (id, updates) => set((state) => ({
        entities: state.entities.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      })),

      clearEntities: () => set({ entities: [] }),

      // Tracking
      setGazePosition: (position) => set({ gazePosition: position }),
      setTrackingMode: (mode) => set({ trackingMode: mode }),
      setCalibrated: (calibrated) => set({ isCalibrated: calibrated }),

      // Difficulty
      setDifficulty: (difficulty) => {
        const config = DIFFICULTY_CONFIGS[difficulty];
        set({
          difficulty,
          maxEntities: config.maxEntities,
          spawnRate: config.spawnInterval,
        });
      },

      updateDifficultyMultiplier: (survivalTime) => {
        // Increases by 10% every 30 seconds, capped at 2.5x
        const multiplier = Math.min(
          1 + Math.floor(survivalTime / 30000) * 0.1,
          2.5
        );
        set({ difficultyMultiplier: multiplier });
      },

      // Computed Values
      getDangerLevel: () => {
        const state = get();
        const screenCenter = {
          x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
          y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        };

        if (state.entities.length === 0) return 0;

        // Find closest entity distance
        const minDistance = Math.min(
          ...state.entities.map((entity) => {
            const dx = entity.position.x - screenCenter.x;
            const dy = entity.position.y - screenCenter.y;
            return Math.sqrt(dx * dx + dy * dy);
          })
        );

        // Normalize to 0-1 (closer = higher danger)
        const maxDangerDistance = GAME_CONSTANTS.DANGER_RADIUS * 3;
        return Math.max(0, 1 - minDistance / maxDangerDistance);
      },

      getGameStats: () => {
        const state = get();
        return {
          survivalTime: state.survivalTime,
          entitiesFrozen: state.entitiesFrozen,
          score: state.score,
          highScore: state.highScore,
          maxEntitiesSimultaneous: state.entities.length,
        };
      },
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        highScore: state.highScore,
        difficulty: state.difficulty,
      }),
    }
  )
);