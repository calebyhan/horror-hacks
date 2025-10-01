# Design Document - Shadows in the Static

## Executive Summary

**Shadows in the Static** is a browser-based horror survival game that uses webcam-based eye tracking to create a unique gameplay experience. Shadow entities move toward the player when not being directly observed, inspired by the "Weeping Angels" concept. The game creates tension through atmospheric audiovisual design and the player's natural fear of what they cannot see.

---

## MVP Scope

### Core Features (Must Have)
1. **Eye tracking with WebGazer.js** - Track where the player is looking
2. **Mouse tracking fallback** - Seamless alternative if webcam unavailable
3. **Shadow entity system** - 3-5 entities that move when not observed
4. **Survival timer** - Track how long the player survives
5. **Basic UI** - Menu, HUD, game over screen
6. **Atmospheric audio** - Ambient sounds, heartbeat, warnings
7. **Visual effects** - Static, vignette, darkness creep
8. **Difficulty progression** - Entities spawn faster and move quicker over time

### Nice to Have (Post-MVP)
- Multiple entity types with unique behaviors
- Blink detection for added difficulty
- Power-ups and abilities
- Achievement system
- Multiple game modes
- Leaderboard integration

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   UI Layer   │  │  Game Layer  │  │ Audio Layer  │ │
│  │              │  │              │  │              │ │
│  │  - Menu      │  │  - Canvas    │  │  - Howler.js │ │
│  │  - HUD       │  │  - Entities  │  │  - SFX       │ │
│  │  - Modals    │  │  - Effects   │  │  - Ambient   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           State Management (Zustand)             │  │
│  │                                                  │  │
│  │  - Game State  - Settings  - Player Stats       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Tracking   │  │  Game Logic  │  │   Storage    │ │
│  │              │  │              │  │              │ │
│  │  - WebGazer  │  │  - Collision │  │  - Settings  │ │
│  │  - Mouse     │  │  - Scoring   │  │  - High Score│ │
│  │  - Calibrate │  │  - Difficulty│  │  - Progress  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Game Flow

### State Machine

```
        START
          │
          ▼
      ┌───────┐
      │ MENU  │◄─────────────┐
      └───┬───┘              │
          │                  │
          ▼                  │
   ┌─────────────┐           │
   │ CALIBRATION │           │
   └──────┬──────┘           │
          │                  │
          ▼                  │
     ┌─────────┐             │
     │ PLAYING │◄──┐         │
     └────┬────┘   │         │
          │        │         │
          │    ┌───────┐     │
          ├───►│PAUSED │─────┤
          │    └───────┘     │
          │                  │
          ▼                  │
    ┌──────────┐             │
    │GAME OVER │─────────────┘
    └──────────┘
```

### Player Journey

1. **Landing** → Main menu with "Start Game" button
2. **Permission** → Request webcam access (with skip option)
3. **Calibration** → 9-point eye tracking calibration
4. **Tutorial** → Brief overlay explaining mechanics (optional)
5. **Gameplay** → Survive as long as possible
6. **Game Over** → Show stats, high score, retry option

---

## Component Architecture

### Component Hierarchy

```
App (page.tsx)
│
├── ErrorBoundary
│   └── GameProvider (Zustand + React Query)
│       │
│       ├── MainMenu
│       │   ├── Logo
│       │   ├── StartButton
│       │   ├── SettingsButton
│       │   └── HowToPlayButton
│       │
│       ├── CalibrationScreen
│       │   ├── CalibrationPoint (x9)
│       │   ├── ProgressBar
│       │   └── SkipButton
│       │
│       ├── Game
│       │   ├── GameCanvas
│       │   │   ├── BackgroundRenderer
│       │   │   ├── EntityRenderer
│       │   │   ├── EffectsRenderer
│       │   │   └── DebugOverlay (dev only)
│       │   │
│       │   ├── HUD
│       │   │   ├── Timer
│       │   │   ├── DangerIndicator
│       │   │   └── TrackingIndicator
│       │   │
│       │   └── PauseMenu
│       │       ├── ResumeButton
│       │       ├── SettingsButton
│       │       └── QuitButton
│       │
│       ├── GameOverScreen
│       │   ├── FinalScore
│       │   ├── Statistics
│       │   ├── RetryButton
│       │   └── MenuButton
│       │
│       ├── SettingsModal
│       │   ├── AudioControls
│       │   ├── TrackingModeToggle
│       │   ├── DifficultySelector
│       │   └── AccessibilityOptions
│       │
│       └── HowToPlayModal
│           ├── Instructions
│           ├── Tips
│           └── KeyboardShortcuts
```

### Key Components Detail

#### GameCanvas Component
```typescript
interface GameCanvasProps {
  width: number;
  height: number;
  gazePosition: GazeData | null;
}

// Responsibilities:
// - Manage canvas context
// - Run game loop (requestAnimationFrame)
// - Render all visual layers
// - Handle resize events
// - Coordinate with entity system
```

#### EntityRenderer Component
```typescript
interface EntityRendererProps {
  entities: Entity[];
  gazePosition: GazeData | null;
  dangerLevel: number;
}

// Responsibilities:
// - Render shadow entities
// - Apply visual effects based on state
// - Handle entity animations
// - Draw frozen/unfrozen states
```

---

## Data Models

### Game State (Zustand Store)

```typescript
interface GameState {
  // Phase Management
  phase: GamePhase;
  isPaused: boolean;
  
  // Gameplay
  startTime: number | null;
  survivalTime: number;
  score: number;
  highScore: number;
  
  // Entities
  entities: Entity[];
  maxEntities: number;
  spawnRate: number;
  
  // Difficulty
  difficulty: DifficultyLevel;
  difficultyMultiplier: number;
  
  // Tracking
  trackingMode: 'eye' | 'mouse';
  isCalibrated: boolean;
  gazePosition: GazeData | null;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  togglePause: () => void;
  startGame: () => void;
  endGame: () => void;
  updateSurvivalTime: (time: number) => void;
  addEntity: (entity: Entity) => void;
  removeEntity: (id: string) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  setGazePosition: (position: GazeData) => void;
  reset: () => void;
}
```

### Entity Model

```typescript
interface Entity {
  id: string;
  type: EntityType;
  
  // Position & Movement
  position: Vector2D;
  velocity: Vector2D;
  targetPosition: Vector2D;
  speed: number;
  
  // State
  isFrozen: boolean;
  opacity: number;
  scale: number;
  
  // Behavior
  freezeRadius: number;
  spawnTime: number;
  lastMoveTime: number;
  
  // Metadata
  createdAt: number;
}

type EntityType = 'shadow' | 'phantom' | 'wraith';

interface Vector2D {
  x: number;
  y: number;
}
```

### Tracking Data

```typescript
interface GazeData {
  x: number;
  y: number;
  timestamp: number;
  confidence?: number; // 0-1, optional accuracy metric
}

interface CalibrationData {
  points: CalibrationPoint[];
  isComplete: boolean;
  accuracy: number;
}

interface CalibrationPoint {
  x: number;
  y: number;
  completed: boolean;
}
```

### Settings

```typescript
interface GameSettings {
  audio: {
    masterVolume: number;
    sfxVolume: number;
    ambientVolume: number;
    isMuted: boolean;
  };
  
  gameplay: {
    difficulty: DifficultyLevel;
    showTutorial: boolean;
    trackingMode: 'eye' | 'mouse' | 'auto';
  };
  
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    uiScale: number;
  };
  
  advanced: {
    showFPS: boolean;
    showDebugInfo: boolean;
  };
}

type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'nightmare';
```

---

## Game Mechanics

### Entity Behavior System

#### Movement Logic

```typescript
class Entity {
  update(deltaTime: number, gazePosition: GazeData | null) {
    // Calculate distance from gaze
    const distanceFromGaze = this.calculateDistanceFromGaze(gazePosition);
    
    // Freeze logic
    if (distanceFromGaze < this.freezeRadius) {
      this.freeze();
    } else {
      this.unfreeze();
      this.moveTowardTarget(deltaTime);
    }
    
    // Update visual properties
    this.updateOpacity(distanceFromGaze);
  }
  
  freeze() {
    this.isFrozen = true;
    this.opacity = 0.7; // More visible when frozen
    this.velocity = { x: 0, y: 0 };
  }
  
  unfreeze() {
    this.isFrozen = false;
    this.opacity = 0.3; // Faint when moving
  }
  
  moveTowardTarget(deltaTime: number) {
    // Calculate direction to target (screen center)
    const direction = this.getDirectionToTarget();
    
    // Apply velocity
    this.velocity = {
      x: direction.x * this.speed * deltaTime,
      y: direction.y * this.speed * deltaTime
    };
    
    // Update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
```

#### Spawn System

```typescript
class EntitySpawnSystem {
  private spawnTimer: number = 0;
  private baseSpawnInterval: number = 5000; // 5 seconds
  
  update(deltaTime: number, survivalTime: number) {
    this.spawnTimer += deltaTime;
    
    // Calculate dynamic spawn interval based on survival time
    const spawnInterval = this.calculateSpawnInterval(survivalTime);
    
    if (this.spawnTimer >= spawnInterval) {
      this.spawnEntity();
      this.spawnTimer = 0;
    }
  }
  
  calculateSpawnInterval(survivalTime: number): number {
    // Spawn faster as time progresses
    const minInterval = 2000; // 2 seconds minimum
    const reduction = Math.floor(survivalTime / 10000) * 500; // -0.5s every 10s
    return Math.max(minInterval, this.baseSpawnInterval - reduction);
  }
  
  spawnEntity() {
    // Spawn from random edge
    const edge = this.getRandomEdge();
    const position = this.getSpawnPosition(edge);
    
    const entity = new Entity({
      position,
      type: this.selectEntityType(),
      speed: this.calculateSpeed()
    });
    
    gameStore.getState().addEntity(entity);
  }
  
  getRandomEdge(): 'top' | 'right' | 'bottom' | 'left' {
    const edges = ['top', 'right', 'bottom', 'left'] as const;
    return edges[Math.floor(Math.random() * edges.length)];
  }
}
```

### Difficulty Progression

```typescript
interface DifficultyConfig {
  baseEntitySpeed: number;
  maxEntities: number;
  spawnInterval: number;
  freezeRadius: number;
}

const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    baseEntitySpeed: 0.5,
    maxEntities: 3,
    spawnInterval: 6000,
    freezeRadius: 200
  },
  normal: {
    baseEntitySpeed: 1.0,
    maxEntities: 5,
    spawnInterval: 5000,
    freezeRadius: 150
  },
  hard: {
    baseEntitySpeed: 1.5,
    maxEntities: 7,
    spawnInterval: 4000,
    freezeRadius: 120
  },
  nightmare: {
    baseEntitySpeed: 2.0,
    maxEntities: 10,
    spawnInterval: 3000,
    freezeRadius: 100
  }
};

// Dynamic difficulty scaling during gameplay
function calculateDifficultyMultiplier(survivalTime: number): number {
  // Increases by 10% every 30 seconds
  const multiplier = 1 + (Math.floor(survivalTime / 30000) * 0.1);
  return Math.min(multiplier, 2.5); // Cap at 2.5x
}
```

### Collision & Game Over

```typescript
function checkGameOver(entities: Entity[]): boolean {
  const screenCenter = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
  
  const DANGER_RADIUS = 100; // pixels from center
  
  return entities.some(entity => {
    const distance = calculateDistance(
      entity.position.x,
      entity.position.y,
      screenCenter.x,
      screenCenter.y
    );
    return distance < DANGER_RADIUS;
  });
}
```

---

## Visual Design

### Art Style
- **Minimalist horror aesthetic**
- **Dark color palette**: Deep blacks, dark grays, subtle blues
- **High contrast**: Bright whites for UI, deep shadows for entities
- **Retro CRT effects**: Scanlines, chromatic aberration, grain
- **Atmospheric particles**: Subtle floating dust/static

### Color Palette

```typescript
const COLORS = {
  background: {
    primary: '#0a0a0f',      // Deep black-blue
    secondary: '#121218',    // Slightly lighter
    danger: '#1a0a0a'        // Red-tinted dark
  },
  
  entity: {
    shadow: '#1a1a2e',       // Dark blue-gray
    frozen: '#2a2a3e',       // Lighter when observed
    highlight: '#3a3a5e'     // Subtle glow
  },
  
  ui: {
    primary: '#ffffff',      // White text
    secondary: '#8e8e93',    // Gray text
    accent: '#ff3b30',       // Red for danger
    success: '#34c759'       // Green for success
  },
  
  effects: {
    vignette: 'rgba(0, 0, 0, 0.7)',
    static: 'rgba(255, 255, 255, 0.02)',
    glow: 'rgba(100, 100, 150, 0.3)'
  }
};
```

### Visual Effects

#### Background Layers
1. **Base gradient** - Subtle radial gradient from center
2. **Noise layer** - Animated static/grain texture
3. **Vignette** - Darkness creeping from edges
4. **Scanlines** - Horizontal CRT-style lines

#### Entity Rendering

```typescript
function renderEntity(ctx: CanvasRenderingContext2D, entity: Entity) {
  const { x, y } = entity.position;
  const { opacity, scale, isFrozen } = entity;
  
  ctx.save();
  
  // Apply opacity
  ctx.globalAlpha = opacity;
  
  // Add glow effect when frozen
  if (isFrozen) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = COLORS.entity.highlight;
  }
  
  // Draw shadow shape (circle or custom)
  ctx.fillStyle = isFrozen ? COLORS.entity.frozen : COLORS.entity.shadow;
  ctx.beginPath();
  ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  // Add subtle inner shadow/texture
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30 * scale);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.restore();
}
```

#### Screen Effects

```typescript
function applyScreenEffects(ctx: CanvasRenderingContext2D, dangerLevel: number) {
  // Vignette (intensifies with danger)
  const vignetteStrength = 0.3 + (dangerLevel * 0.5);
  applyVignette(ctx, vignetteStrength);
  
  // Scanlines
  applyScanlines(ctx, 2); // 2px line spacing
  
  // Chromatic aberration (when danger is high)
  if (dangerLevel > 0.7) {
    applyChromaticAberration(ctx, dangerLevel);
  }
  
  // Static noise
  applyStaticNoise(ctx, 0.02);
}
```

### UI Design

#### HUD Layout
```
┌─────────────────────────────────────────────────┐
│  [Eye Icon]              00:45              [?] │  Top bar
│                                                 │
│                                                 │
│                   [Game Area]                   │  Canvas
│                                                 │
│                                                 │
│                  [Danger Pulse]                 │  Bottom center
└─────────────────────────────────────────────────┘
```

#### Typography
- **Primary font**: Monospace (e.g., 'Courier New', 'Monaco')
- **UI font**: Sans-serif (e.g., 'Inter', 'SF Pro')
- **Sizes**: 
  - Title: 48px
  - Subtitle: 24px
  - Body: 16px
  - Caption: 12px

---

## Audio Design

### Sound Categories

#### Ambient Sounds
```typescript
const AMBIENT_SOUNDS = {
  whiteNoise: {
    file: '/audio/ambient/white-noise.mp3',
    volume: 0.3,
    loop: true,
    fadeIn: 2000
  },
  
  backgroundDrone: {
    file: '/audio/ambient/drone.mp3',
    volume: 0.2,
    loop: true,
    fadeIn: 3000
  },
  
  distantWhispers: {
    file: '/audio/ambient/whispers.mp3',
    volume: 0.15,
    loop: true,
    spatial: true // Position based on entities
  }
};
```

#### Dynamic Audio
```typescript
class DynamicAudioSystem {
  private heartbeatSound: Howl;
  private baseHeartbeatBPM: number = 60;
  
  updateHeartbeat(dangerLevel: number) {
    // Increase BPM based on danger (60 to 140 BPM)
    const targetBPM = this.baseHeartbeatBPM + (dangerLevel * 80);
    const playbackRate = targetBPM / this.baseHeartbeatBPM;
    
    this.heartbeatSound.rate(playbackRate);
    this.heartbeatSound.volume(0.3 + (dangerLevel * 0.5));
  }
  
  playSpatialWhisper(entityPosition: Vector2D) {
    // Calculate stereo panning based on entity position
    const screenCenter = window.innerWidth / 2;
    const pan = (entityPosition.x - screenCenter) / screenCenter;
    
    const whisper = new Howl({
      src: ['/audio/sfx/whisper.mp3'],
      volume: 0.2,
      stereo: pan // -1 (left) to 1 (right)
    });
    
    whisper.play();
  }
}
```

#### Sound Effects
```typescript
const SFX = {
  entitySpawn: '/audio/sfx/spawn.mp3',
  entityFreeze: '/audio/sfx/freeze.mp3',
  warningPing: '/audio/sfx/warning.mp3',
  gameOver: '/audio/sfx/game-over.mp3',
  uiClick: '/audio/sfx/click.mp3',
  calibrationComplete: '/audio/sfx/complete.mp3'
};
```

---

## Eye Tracking System

### WebGazer Integration

```typescript
// hooks/useEyeTracking.ts
import { useQuery } from '@tanstack/react-query';

export function useEyeTracking(enabled: boolean) {
  return useQuery({
    queryKey: ['eyeTracking', enabled],
    queryFn: async () => {
      if (!enabled) return null;
      
      // Initialize WebGazer
      const webgazer = (await import('webgazer')).default;
      
      await webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .begin();
      
      // Hide video preview
      webgazer.showVideoPreview(false);
      webgazer.showPredictionPoints(false);
      
      return webgazer;
    },
    staleTime: Infinity,
    enabled,
    retry: 1
  });
}
```

### Calibration Flow

```typescript
interface CalibrationPoint {
  x: number;
  y: number;
  order: number;
}

// 9-point calibration grid
function generateCalibrationPoints(): CalibrationPoint[] {
  const margin = 100; // px from edges
  const width = window.innerWidth - (margin * 2);
  const height = window.innerHeight - (margin * 2);
  
  return [
    // Top row
    { x: margin, y: margin, order: 0 },
    { x: margin + width / 2, y: margin, order: 1 },
    { x: margin + width, y: margin, order: 2 },
    
    // Middle row
    { x: margin, y: margin + height / 2, order: 3 },
    { x: margin + width / 2, y: margin + height / 2, order: 4 },
    { x: margin + width, y: margin + height / 2, order: 5 },
    
    // Bottom row
    { x: margin, y: margin + height, order: 6 },
    { x: margin + width / 2, y: margin + height, order: 7 },
    { x: margin + width, y: margin + height, order: 8 }
  ];
}
```

### Gaze Data Processing

```typescript
class GazeProcessor {
  private buffer: GazeData[] = [];
  private bufferSize: number = 5; // Smooth over 5 frames
  
  addGazePoint(point: GazeData) {
    this.buffer.push(point);
    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
    }
  }
  
  getSmoothedGaze(): GazeData | null {
    if (this.buffer.length === 0) return null;
    
    // Average the buffer for smoother tracking
    const avgX = this.buffer.reduce((sum, p) => sum + p.x, 0) / this.buffer.length;
    const avgY = this.buffer.reduce((sum, p) => sum + p.y, 0) / this.buffer.length;
    
    return {
      x: avgX,
      y: avgY,
      timestamp: Date.now()
    };
  }
}
```

---

## Performance Optimization

### Canvas Optimization

```typescript
class OptimizedRenderer {
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  
  constructor() {
    // Create offscreen canvas for background layers
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')!;
  }
  
  render(mainCtx: CanvasRenderingContext2D) {
    // Render static elements to offscreen canvas once
    this.renderBackground(this.offscreenCtx);
    
    // Copy offscreen canvas to main canvas (very fast)
    mainCtx.drawImage(this.offscreenCanvas, 0, 0);
    
    // Render dynamic elements directly
    this.renderEntities(mainCtx);
    this.renderEffects(mainCtx);
  }
}
```

### Entity Pooling

```typescript
class EntityPool {
  private pool: Entity[] = [];
  private active: Set<Entity> = new Set();
  private readonly maxPoolSize = 20;
  
  acquire(config: EntityConfig): Entity {
    let entity = this.pool.pop();
    
    if (!entity) {
      entity = new Entity(config);
    } else {
      entity.reset(config);
    }
    
    this.active.add(entity);
    return entity;
  }
  
  release(entity: Entity) {
    this.active.delete(entity);
    
    if (this.pool.length < this.maxPoolSize) {
      entity.reset();
      this.pool.push(entity);
    }
  }
}
```

---

## Technical Constraints

### Browser Requirements
- **WebGL support** - For advanced effects (optional)
- **getUserMedia API** - For webcam access
- **Canvas API** - Core rendering
- **Web Audio API** - For Howler.js
- **LocalStorage** - For saving progress

### Performance Targets
- **60 FPS** gameplay on mid-range hardware (2018+)
- **< 3 second** initial load time
- **< 200MB** memory footprint
- **< 50ms** eye tracking latency

### Accessibility
- **Keyboard navigation** for all menus
- **Screen reader** support for UI
- **High contrast mode** option
- **Reduce motion** option to disable effects
- **Adjustable UI scale**

---

## Development Milestones

### Milestone 1: Core Engine (Week 1)
- ✅ Project setup with Next.js + TypeScript
- ✅ Basic canvas rendering
- ✅ Game loop implementation
- ✅ Entity system foundation
- ✅ State management with Zustand

### Milestone 2: Tracking System (Week 1-2)
- ✅ WebGazer.js integration
- ✅ Calibration flow
- ✅ Mouse tracking fallback
- ✅ Gaze smoothing algorithm

### Milestone 3: Core Gameplay (Week 2)
- ✅ Entity spawn system
- ✅ Freeze/unfreeze mechanics
- ✅ Collision detection
- ✅ Game over condition
- ✅ Score tracking

### Milestone 4: Audio & Polish (Week 3)
- ✅ Audio system integration
- ✅ Visual effects (vignette, static, etc.)
- ✅ UI implementation
- ✅ Settings management

### Milestone 5: Testing & Deployment (Week 3-4)
- ✅ Bug fixes
- ✅ Performance optimization
- ✅ Cross-browser testing
- ✅ Documentation
- ✅ Deployment

---

## Success Metrics

### Technical Metrics
- Maintains 60 FPS with 5 entities
- Eye tracking accuracy > 80% after calibration
- Load time < 3 seconds
- Zero critical bugs

### User Experience Metrics
- Players understand mechanics without tutorial
- Average survival time increases with practice
- Players find experience genuinely suspenseful
- High rate of replay/sharing

### Code Quality Metrics
- TypeScript strict mode compliance
- 70%+ test coverage
- Zero ESLint errors
- Comprehensive documentation