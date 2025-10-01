'use client';

interface HowToPlayModalProps {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4">
      <div className="bg-background-primary border border-ui-secondary p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <h2 className="text-3xl font-mono text-ui-primary mb-6 text-center">
          HOW TO PLAY
        </h2>

        <div className="space-y-6 text-ui-primary font-mono text-sm leading-relaxed">
          {/* Objective */}
          <div>
            <h3 className="text-xl text-ui-secondary mb-2 border-b border-ui-secondary pb-2">
              OBJECTIVE
            </h3>
            <p className="leading-relaxed">
              Survive as long as possible by keeping shadow entities frozen with
              your gaze. Don't let them reach the center of your screen!
            </p>
          </div>

          {/* Controls */}
          <div>
            <h3 className="text-xl text-ui-secondary mb-2 border-b border-ui-secondary pb-2">
              CONTROLS
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-ui-accent w-32">👁️ EYE TRACKING:</span>
                <span>Look at entities to freeze them in place</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ui-accent w-32">🖱️ MOUSE:</span>
                <span>Move cursor over entities as fallback</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ui-accent w-32">ESC:</span>
                <span>Pause/Resume game</span>
              </div>
            </div>
          </div>

          {/* Mechanics */}
          <div>
            <h3 className="text-xl text-ui-secondary mb-2 border-b border-ui-secondary pb-2">
              GAME MECHANICS
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                Shadow entities spawn from the edges and move toward the center
              </li>
              <li>
                When you look at an entity (within ~150px), it freezes and
                becomes more visible
              </li>
              <li>
                When you look away, entities resume moving toward the center
              </li>
              <li>Game over when any entity reaches the center</li>
              <li>
                Difficulty increases over time - more entities spawn and they
                move faster
              </li>
              <li>Score is based on survival time</li>
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xl text-ui-secondary mb-2 border-b border-ui-secondary pb-2">
              SURVIVAL TIPS
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Keep your eyes moving - scan the entire screen constantly</li>
              <li>
                Prioritize entities closest to the center (watch the danger
                indicator)
              </li>
              <li>
                Complete calibration for better eye tracking accuracy
              </li>
              <li>Good lighting and head position improve tracking</li>
              <li>Take breaks to avoid eye strain!</li>
            </ul>
          </div>

          {/* Tracking Modes */}
          <div>
            <h3 className="text-xl text-ui-secondary mb-2 border-b border-ui-secondary pb-2">
              TRACKING MODES
            </h3>
            <div className="space-y-2">
              <p>
                <span className="text-ui-success">Eye Tracking:</span> Uses your
                webcam to track where you're looking. Requires calibration for
                best results.
              </p>
              <p>
                <span className="text-ui-secondary">Mouse Tracking:</span>{' '}
                Fallback mode that uses your mouse cursor position. Works on any
                device without a webcam.
              </p>
            </div>
          </div>

          {/* Browser Requirements */}
          <div>
            <h3 className="text-xl text-ui-secondary mb-2 border-b border-ui-secondary pb-2">
              REQUIREMENTS
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Modern browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Webcam (optional - for eye tracking)</li>
              <li>Well-lit environment (for eye tracking)</li>
              <li>Desktop or laptop (mobile not supported)</li>
            </ul>
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