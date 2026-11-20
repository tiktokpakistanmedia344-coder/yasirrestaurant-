export interface BurgerLayerPlacement {
  id: string;
  y: number;
  height: number;
  radius: number;
}

export interface SesameSeedTransform {
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  twist: number;
}

const SOFTWARE_GL_PATTERN = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i;

export function isSoftwareRendererName(rendererName: string): boolean {
  return SOFTWARE_GL_PATTERN.test(rendererName);
}

/**
 * Computes strictly monotonic bottom-up Y placements for the gourmet double burger
 * so adjacent layers stack tightly with zero Z-fighting.
 */
export function computeBurgerLayerStack(explodeOffset = 0): {
  layers: Record<string, BurgerLayerPlacement>;
  totalHeight: number;
} {
  const gap = Math.max(0, explodeOffset);
  let cursorY = 0;

  const pushLayer = (id: string, height: number, radius: number, embed = 0): BurgerLayerPlacement => {
    const centerY = cursorY + height * 0.5 - embed;
    const placement: BurgerLayerPlacement = { id, y: centerY, height, radius };
    cursorY += height - embed + gap;
    return placement;
  };

  const bottomBun = pushLayer('bottomBun', 0.34, 1.38, 0);
  const herbMayo = pushLayer('herbMayo', 0.08, 1.34, 0.02);
  const lettuce = pushLayer('lettuce', 0.14, 1.54, 0.02);
  const patty1 = pushLayer('patty1', 0.32, 1.37, 0.03);
  const cheese1 = pushLayer('cheese1', 0.09, 1.44, 0.03);
  const patty2 = pushLayer('patty2', 0.31, 1.35, 0.03);
  const cheese2 = pushLayer('cheese2', 0.09, 1.42, 0.03);
  const ketchupSwirl = pushLayer('ketchupSwirl', 0.09, 1.32, 0.02);
  const tomato = pushLayer('tomato', 0.14, 1.32, 0.02);
  const onion = pushLayer('onion', 0.11, 1.30, 0.02);
  const topBun = pushLayer('topBun', 0.68, 1.40, 0.04);

  return {
    layers: {
      bottomBun,
      herbMayo,
      lettuce,
      patty1,
      cheese1,
      patty2,
      cheese2,
      ketchupSwirl,
      tomato,
      onion,
      topBun,
    },
    totalHeight: cursorY,
  };
}

/**
 * Deterministic Fibonacci phyllotaxis distribution of sesame seeds over the upper
 * brioche bun dome (theta in [0.14, 1.02] rad from pole).
 */
export function generateSesameSeedTransforms(
  count: number,
  domeRadius: number,
  domeHeight: number,
  domeBaseY: number
): SesameSeedTransform[] {
  const seeds: SesameSeedTransform[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    // Polar angle from apex downward across the glazed upper dome
    const phi = 0.15 + Math.sqrt(t) * 0.88;
    const theta = i * goldenAngle;

    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const x = domeRadius * sinPhi * cosTheta;
    const z = domeRadius * sinPhi * sinTheta;
    const y = domeBaseY + domeHeight * cosPhi;

    // Outward normal of ellipsoid (x/R, y/H, z/R)
    const rawNx = (sinPhi * cosTheta) / domeRadius;
    const rawNy = cosPhi / domeHeight;
    const rawNz = (sinPhi * sinTheta) / domeRadius;
    const nLen = Math.hypot(rawNx, rawNy, rawNz) || 1;

    // Deterministic size variation
    const hash = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const frac = hash - Math.floor(hash);
    const sizeJitter = 0.88 + frac * 0.28;

    seeds.push({
      x,
      y,
      z,
      nx: rawNx / nLen,
      ny: rawNy / nLen,
      nz: rawNz / nLen,
      scaleX: 0.048 * sizeJitter,
      scaleY: 0.022 * sizeJitter,
      scaleZ: 0.078 * sizeJitter,
      twist: (frac - 0.5) * Math.PI,
    });
  }

  return seeds;
}

/**
 * Evaluates a ruffled organic edge displacement for lettuce and hand-formed burger patties.
 */
export function evaluateRuffledRadius(
  angle: number,
  baseRadius: number,
  primaryAmp: number,
  lobes: number
): number {
  const primary = Math.sin(angle * lobes) * primaryAmp;
  const secondary = Math.cos(angle * (lobes * 2 + 1) + 0.8) * (primaryAmp * 0.45);
  return baseRadius + primary + secondary;
}

/**
 * Generates spiral curve points for the rich crimson ketchup swirl & squeeze ribbon.
 */
export function generateKetchupSwirlPoints(
  turns: number,
  maxRadius: number,
  yCenter: number,
  pointsCount = 48
): Array<{ x: number; y: number; z: number }> {
  const pts: Array<{ x: number; y: number; z: number }> = [];
  for (let i = 0; i <= pointsCount; i++) {
    const t = i / pointsCount;
    const angle = t * turns * Math.PI * 2;
    const r = (0.22 + 0.78 * t) * maxRadius;
    const waveY = Math.sin(angle * 3) * 0.018;
    pts.push({
      x: Math.cos(angle) * r,
      y: yCenter + waveY,
      z: Math.sin(angle) * r,
    });
  }
  return pts;
}
