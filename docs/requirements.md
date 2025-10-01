# Requirements - Shadows in the Static

## Technical Requirements

### Technology Stack

**Framework & Core**
- Next.js 14+ (App Router)
- TypeScript (strict mode enabled)
- React 18+
- Node.js 18+

**State Management**
- Zustand for global game state
- React Query (@tanstack/react-query) for async operations
- NO useState/useEffect for async data fetching

**Styling**
- Tailwind CSS for UI components
- Native Canvas API for game rendering
- CSS Modules or Tailwind only (no styled-components)

**Libraries**
- WebGazer.js for eye tracking
- Howler.js for audio management
- clsx for conditional classNames

---

## Code Practices & Standards

### TypeScript Requirements

**Strict Type Safety**
```typescript
// ✅ REQUIRED: Always define explicit types
interface EntityConfig {
  speed: number;
  opacity: number;
  type: EntityType;
}

// ❌ AVOID: Implicit any types
const config = {}; // Bad

// ✅ USE: Proper typing
const config: EntityConfig = {
  speed: 1,
  opacity: 0.3,
  type: 'shadow'
};
```

**Type Definitions**
- Create dedicated type files in `/types` directory
- Use `interface` for object shapes
- Use `type` for unions, intersections, and primitives
- Export all shared types
- Use `enum` for game states and constants

**Example Structure**
```typescript
// types/game.ts
export enum GamePhase {
  MENU = 'MENU',
  CALIBRATION = 'CALIBRATION',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export interface GazeData {
  x: number;
  y: number;
  timestamp: number;
}

export interface EntityState {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  isFrozen: boolean;
  opacity: number;
}
```

---

### React Best Practices

**Component Structure**
- Functional components only (no class components)
- Use TypeScript for all props
- Keep components small and focused (< 200 lines)
- Extract complex logic into custom hooks
- Use composition over inheritance

**Hook Usage Rules**

**✅ USE React Query for:**
- Eye tracking initialization
- Webcam permission requests
- Any async operations
- Data that needs caching

```typescript
// ✅ CORRECT: Using React Query
export function useEyeTracking() {
  return useQuery({
    queryKey: ['eyeTracking'],
    queryFn: async () => {
      const gazer = await initializeWebGazer();
      return gazer;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });
}
```

**❌ AVOID useEffect for:**
- Data fetching
- Subscriptions that can be handled by React Query
- Complex initialization logic

**✅ USE useEffect ONLY for:**
- Canvas rendering loops
- Event listener attachment/cleanup
- Refs and DOM manipulation
- Animation frame requests

```typescript
// ✅ ACCEPTABLE: Canvas rendering
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId: number;

  const render = () => {
    // Rendering logic
    animationId = requestAnimationFrame(render);
  };

  render();

  return () => {
    cancelAnimationFrame(animationId);
  };
}, []);
```

**Custom Hooks**
- Prefix with `use`
- Return stable objects/functions (use useMemo/useCallback)
- Document parameters and return values
- Keep focused on single responsibility

---

### State Management

**Zustand Store Structure**
```typescript
// lib/store/gameStore.ts
interface GameStore {
  // State
  phase: GamePhase;
  score: number;
  entities: Entity[];
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  
  // Computed values
  dangerLevel: () => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: GamePhase.MENU,
  score: 0,
  entities: [],
  
  setPhase: (phase) => set({ phase }),
  addEntity: (entity) => set((state) => ({
    entities: [...state.entities, entity]
  })),
  
  dangerLevel: () => {
    const entities = get().entities;
    return entities.length / 10; // Example calculation
  }
}));
```

**State Management Rules**
- Use Zustand for global game state
- Use React Query for server/async state
- Use local useState for component-specific UI state only
- Avoid prop drilling (use Zustand selectors)
- Keep state minimal and derived values computed

---

### Performance Requirements

**Canvas Rendering**
- Maintain 60 FPS minimum
- Use requestAnimationFrame for game loop
- Implement delta time for frame-independent movement
- Clear canvas efficiently (clearRect vs fillRect)
- Use canvas layers for different z-indexes

**Memory Management**
```typescript
// ✅ USE: Object pooling for entities
class EntityPool {
  private pool: Entity[] = [];
  private active: Entity[] = [];
  
  acquire(): Entity {
    return this.pool.pop() || new Entity();
  }
  
  release(entity: Entity): void {
    entity.reset();
    this.pool.push(entity);
  }
}

// ❌ AVOID: Creating new objects every frame
gameLoop() {
  const entity = new Entity(); // Bad - creates garbage
}
```

**Optimization Rules**
- Debounce eye tracking updates (16-33ms)
- Throttle expensive calculations
- Use memoization for pure computations
- Lazy load audio files
- Preload critical assets
- Implement asset cleanup on unmount

---

### File Organization

```
/app
  /page.tsx                 # Main entry point
  /layout.tsx               # Root layout
  
/components
  /game
    /GameCanvas.tsx         # Main game canvas
    /EntityRenderer.tsx     # Entity rendering logic
    /EffectsLayer.tsx       # Visual effects
  /ui
    /Menu.tsx               # Main menu
    /HUD.tsx                # Heads-up display
    /CalibrationScreen.tsx  # Eye tracking calibration
    /GameOverScreen.tsx     # End game screen
  /shared
    /Button.tsx             # Reusable button
    /Modal.tsx              # Modal wrapper
    
/lib
  /game
    /Entity.ts              # Entity class
    /GameLoop.ts            # Main game loop
    /CollisionSystem.ts     # Collision detection
    /DifficultyManager.ts   # Difficulty scaling
  /audio
    /AudioManager.ts        # Audio system
    /SoundEffects.ts        # SFX definitions
  /tracking
    /eyeTracking.ts         # WebGazer integration
    /mouseTracking.ts       # Mouse fallback
  /utils
    /math.ts                # Math utilities
    /canvas.ts              # Canvas helpers
    /storage.ts             # LocalStorage wrapper
    
/hooks
  /useEyeTracking.ts        # Eye tracking hook
  /useGameLoop.ts           # Game loop hook
  /useAudio.ts              # Audio hook
  
/store
  /gameStore.ts             # Zustand game state
  /settingsStore.ts         # User settings
  
/types
  /game.ts                  # Game-related types
  /tracking.ts              # Tracking types
  /audio.ts                 # Audio types
  
/public
  /audio
    /ambient                # Ambient sounds
    /sfx                    # Sound effects
  /images                   # Static images
```

---

### Naming Conventions

**Files**
- Components: PascalCase (e.g., `GameCanvas.tsx`)
- Utilities: camelCase (e.g., `mathUtils.ts`)
- Types: camelCase (e.g., `gameTypes.ts`)
- Hooks: camelCase with 'use' prefix (e.g., `useGameLoop.ts`)

**Variables & Functions**
```typescript
// Components
const GameCanvas: React.FC = () => {};

// Functions
function calculateDistance(x1: number, y1: number): number {}

// Constants
const MAX_ENTITIES = 5;
const FREEZE_RADIUS = 150;

// Enums
enum EntityType {
  SHADOW = 'SHADOW',
  PHANTOM = 'PHANTOM'
}

// Interfaces
interface EntityConfig {}

// Types
type Vector2D = { x: number; y: number };
```

---

### Error Handling

**Required Error Boundaries**
```typescript
// components/ErrorBoundary.tsx
class GameErrorBoundary extends React.Component {
  // Catch rendering errors
  // Log to console
  // Show fallback UI
  // Provide recovery options
}
```

**Error Handling Patterns**
```typescript
// ✅ REQUIRED: Proper error handling
try {
  await initializeWebGazer();
} catch (error) {
  console.error('WebGazer initialization failed:', error);
  // Fallback to mouse tracking
  setTrackingMode('mouse');
}

// ✅ REQUIRED: Type-safe error handling
if (error instanceof WebGazerError) {
  // Handle specific error
} else {
  // Handle generic error
}

// ❌ AVOID: Silent failures
try {
  await someOperation();
} catch {} // Bad - no handling
```

---

### Accessibility Requirements

**Keyboard Support**
- Spacebar: Pause/Resume
- Escape: Return to menu
- R: Restart game
- M: Mute/Unmute audio

**Visual Accessibility**
- High contrast mode option
- Reduce motion option
- Adjustable UI scale
- Color-blind friendly palette options

**Audio Accessibility**
- Volume controls for all audio categories
- Visual indicators for audio cues
- Subtitle option for any voice lines

---

### Testing Requirements

**Unit Tests Required For**
- Game logic functions (collision, scoring, difficulty)
- Math utilities
- State management logic
- Audio management
- Entity behavior algorithms

**Testing Framework**
- Jest for unit tests
- React Testing Library for component tests
- Use `@testing-library/react-hooks` for custom hooks

**Test Coverage Goals**
- Minimum 70% coverage for game logic
- 100% coverage for utility functions
- Critical path testing for game flow

---

### Security & Privacy

**Webcam Handling**
- Request permission explicitly with clear messaging
- Never record or store webcam footage
- Disable webcam access when game not active
- Clear webcam permissions on game exit
- Provide visual indicator when webcam is active

**Data Storage**
- Only store game settings and high scores locally
- No external data transmission
- No analytics without explicit consent
- Clear data option in settings

---

### Browser Compatibility

**Minimum Requirements**
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Feature Detection**
```typescript
function checkBrowserSupport() {
  const hasWebGL = !!document.createElement('canvas').getContext('webgl');
  const hasWebcam = !!(navigator.mediaDevices?.getUserMedia);
  const hasCanvas = !!document.createElement('canvas').getContext('2d');
  
  return hasWebGL && hasWebcam && hasCanvas;
}
```

---

### Documentation Requirements

**Code Documentation**
- JSDoc comments for all exported functions
- Inline comments for complex logic
- README.md with setup instructions
- CONTRIBUTING.md for developers
- Architecture documentation

**Comment Style**
```typescript
/**
 * Calculates the distance between two points
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns The Euclidean distance between the points
 */
function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
```

---

### Git Workflow

**Commit Message Format**
```
type(scope): subject

body

footer
```

**Types**
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- perf: Performance improvement
- docs: Documentation
- test: Tests
- chore: Maintenance

**Example**
```
feat(tracking): add blink detection to eye tracking system

Implemented blink detection using eyelid distance calculation.
Blinks trigger a brief vulnerability window in the game.

Closes #42
```

---

### Code Review Checklist

Before submitting code, ensure:
- [ ] TypeScript compiles with no errors
- [ ] All ESLint warnings addressed
- [ ] Code formatted with Prettier
- [ ] No console.logs in production code
- [ ] All functions have type definitions
- [ ] Complex logic has comments
- [ ] No unused imports or variables
- [ ] Performance tested (60 FPS maintained)
- [ ] Error handling implemented
- [ ] Tests written for new features
- [ ] Documentation updated

---

## Performance Benchmarks

**Required Performance Metrics**
- Initial load time: < 3 seconds
- Time to interactive: < 5 seconds
- FPS: Consistent 60 FPS
- Memory usage: < 200MB
- Eye tracking latency: < 50ms
- Audio latency: < 20ms

**Monitoring**
```typescript
// Add performance monitoring
const perfMonitor = {
  fps: 0,
  frameTime: 0,
  memoryUsage: 0,
  
  update() {
    // Calculate metrics
    // Log to console in dev mode
    // Alert if thresholds exceeded
  }
};
```