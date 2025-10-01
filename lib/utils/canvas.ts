/**
 * Clears the canvas efficiently
 * @param ctx - Canvas rendering context
 */
export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Fills the canvas with a color
 * @param ctx - Canvas rendering context
 * @param color - Fill color
 */
export function fillCanvas(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Applies a vignette effect to the canvas
 * @param ctx - Canvas rendering context
 * @param strength - Vignette strength (0-1)
 */
export function applyVignette(
  ctx: CanvasRenderingContext2D,
  strength: number
): void {
  const { width, height } = ctx.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.sqrt(centerX * centerX + centerY * centerY);

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.3,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${strength})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Applies scanline effect
 * @param ctx - Canvas rendering context
 * @param lineSpacing - Space between scanlines
 * @param opacity - Scanline opacity
 */
export function applyScanlines(
  ctx: CanvasRenderingContext2D,
  lineSpacing: number = 2,
  opacity: number = 0.1
): void {
  const { width, height } = ctx.canvas;

  ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  for (let y = 0; y < height; y += lineSpacing) {
    ctx.fillRect(0, y, width, 1);
  }
}

/**
 * Applies static noise effect
 * @param ctx - Canvas rendering context
 * @param opacity - Noise opacity
 */
export function applyStaticNoise(
  ctx: CanvasRenderingContext2D,
  opacity: number = 0.02
): void {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    if (Math.random() < opacity) {
      const noise = Math.random() * 255;
      pixels[i] = noise; // R
      pixels[i + 1] = noise; // G
      pixels[i + 2] = noise; // B
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Applies chromatic aberration effect
 * @param ctx - Canvas rendering context
 * @param offset - Pixel offset for aberration
 */
export function applyChromaticAberration(
  ctx: CanvasRenderingContext2D,
  offset: number = 2
): void {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create temporary canvas for effect
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Clear main canvas
  ctx.clearRect(0, 0, width, height);

  // Draw red channel offset
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 1;
  ctx.drawImage(tempCanvas, -offset, 0);

  // Draw green channel normal
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(tempCanvas, 0, 0);

  // Draw blue channel offset
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(tempCanvas, offset, 0);

  // Reset
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

/**
 * Gets pixel-perfect canvas sizing for device pixel ratio
 * @param canvas - Canvas element
 */
export function setupCanvasSize(canvas: HTMLCanvasElement): void {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
  }

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}

/**
 * Draws a circle with glow effect
 * @param ctx - Canvas rendering context
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param radius - Circle radius
 * @param color - Fill color
 * @param glowColor - Glow color
 * @param glowStrength - Glow blur amount
 */
export function drawGlowingCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  glowColor: string,
  glowStrength: number = 20
): void {
  ctx.save();

  ctx.shadowBlur = glowStrength;
  ctx.shadowColor = glowColor;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}