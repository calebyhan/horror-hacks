'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { Entity } from '@/lib/game/Entity';
import { EntitySpawnSystem } from '@/lib/game/EntitySpawnSystem';
import { CollisionSystem } from '@/lib/game/CollisionSystem';
import { EntityPool } from '@/lib/game/EntityPool';
import { GamePhase, Entity as EntityInterface } from '@/types/game';
import { DIFFICULTY_CONFIGS } from '@/store/gameStore';
import {
  setupCanvasSize,
  clearCanvas,
  fillCanvas,
  applyVignette,
  applyScanlines,
  applyStaticNoise,
  drawGlowingCircle,
} from '@/lib/utils/canvas';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spawnSystemRef = useRef<EntitySpawnSystem | null>(null);
  const collisionSystemRef = useRef<CollisionSystem>(new CollisionSystem());
  const entityPoolRef = useRef<EntityPool>(new EntityPool());

  // Store state
  const phase = useGameStore((state) => state.phase);
  const difficulty = useGameStore((state) => state.difficulty);
  const difficultyMultiplier = useGameStore((state) => state.difficultyMultiplier);
  const survivalTime = useGameStore((state) => state.survivalTime);
  const startTime = useGameStore((state) => state.startTime);
  const gazePosition = useGameStore((state) => state.gazePosition);
  const entities = useGameStore((state) => state.entities);

  // Store actions
  const addEntity = useGameStore((state) => state.addEntity);
  const updateEntity = useGameStore((state) => state.updateEntity);
  const removeEntity = useGameStore((state) => state.removeEntity);
  const updateSurvivalTime = useGameStore((state) => state.updateSurvivalTime);
  const updateDifficultyMultiplier = useGameStore((state) => state.updateDifficultyMultiplier);
  const endGame = useGameStore((state) => state.endGame);
  const incrementEntitiesFrozen = useGameStore((state) => state.incrementEntitiesFrozen);
  const clearEntities = useGameStore((state) => state.clearEntities);

  // Initialize spawn system
  useEffect(() => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    spawnSystemRef.current = new EntitySpawnSystem(config.spawnInterval);
  }, [difficulty]);

  // Clear entities when leaving playing phase
  useEffect(() => {
    if (phase !== GamePhase.PLAYING) {
      clearEntities();
    }
  }, [phase, clearEntities]);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    clearCanvas(ctx);

    // Draw background
    fillCanvas(ctx, '#0a0a0f');

    // Draw entities
    entities.forEach((entity) => {
      renderEntity(ctx, entity);
    });

    // Apply visual effects
    const dangerLevel = useGameStore.getState().getDangerLevel();
    applyVignette(ctx, 0.3 + dangerLevel * 0.5);
    applyScanlines(ctx, 2, 0.1);
    applyStaticNoise(ctx, 0.02);

    // Draw gaze indicator (debug)
    if (gazePosition) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gazePosition.x, gazePosition.y, 150, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, [entities, gazePosition]);

  // Render entity helper
  const renderEntity = (ctx: CanvasRenderingContext2D, entity: EntityInterface) => {
    const { x, y } = entity.position;
    const { opacity, scale, isFrozen } = entity;

    ctx.save();
    ctx.globalAlpha = opacity;

    // Draw entity
    if (isFrozen) {
      drawGlowingCircle(
        ctx,
        x,
        y,
        30 * scale,
        '#2a2a3e',
        '#3a3a5e',
        20
      );
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Game update loop
  const handleUpdate = useCallback(
    (deltaTime: number) => {
      if (phase !== GamePhase.PLAYING || !startTime) return;

      // Update survival time
      const currentTime = Date.now();
      const newSurvivalTime = currentTime - startTime;
      updateSurvivalTime(newSurvivalTime);
      updateDifficultyMultiplier(newSurvivalTime);

      // Spawn entities
      if (spawnSystemRef.current) {
        const config = DIFFICULTY_CONFIGS[difficulty];
        spawnSystemRef.current.update(
          deltaTime,
          newSurvivalTime,
          entities.length,
          config.maxEntities,
          (entity) => {
            addEntity({
              id: entity.id,
              type: entity.type,
              position: entity.position,
              velocity: entity.velocity,
              targetPosition: entity.targetPosition,
              speed: entity.speed,
              isFrozen: entity.isFrozen,
              opacity: entity.opacity,
              scale: entity.scale,
              freezeRadius: entity.freezeRadius,
              spawnTime: entity.spawnTime,
              lastMoveTime: entity.lastMoveTime,
              createdAt: entity.createdAt,
            });
          }
        );
      }

      // Update entities
      entities.forEach((entityData) => {
        const entity = new Entity({
          type: entityData.type,
          position: entityData.position,
          speed: entityData.speed,
          freezeRadius: entityData.freezeRadius,
        });

        // Copy state
        Object.assign(entity, entityData);

        // Track frozen state before update
        const wasFrozen = entity.isFrozen;

        // Update entity
        entity.update(deltaTime, gazePosition, difficultyMultiplier);

        // Track if newly frozen
        if (!wasFrozen && entity.isFrozen) {
          incrementEntitiesFrozen();
        }

        // Update in store
        updateEntity(entity.id, {
          position: entity.position,
          velocity: entity.velocity,
          isFrozen: entity.isFrozen,
          opacity: entity.opacity,
          lastMoveTime: entity.lastMoveTime,
        });
      });

      // Check game over
      const gameOver = collisionSystemRef.current.checkGameOver(
        entities.map((e) => {
          const entity = new Entity({
            type: e.type,
            position: e.position,
            speed: e.speed,
          });
          Object.assign(entity, e);
          return entity;
        })
      );

      if (gameOver) {
        endGame();
      }

      // Render
      render();
    },
    [
      phase,
      startTime,
      difficulty,
      entities,
      gazePosition,
      difficultyMultiplier,
      updateSurvivalTime,
      updateDifficultyMultiplier,
      addEntity,
      updateEntity,
      incrementEntitiesFrozen,
      endGame,
      render,
    ]
  );

  // Set up game loop
  useGameLoop(handleUpdate);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setupCanvasSize(canvas);

    const handleResize = () => {
      setupCanvasSize(canvas);
      render();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}