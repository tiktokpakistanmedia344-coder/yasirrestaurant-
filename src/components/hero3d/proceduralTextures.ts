import * as THREE from 'three';

export interface BurgerTextureSet {
  bunMap: THREE.CanvasTexture;
  bunBump: THREE.CanvasTexture;
  pattyMap: THREE.CanvasTexture;
  pattyBump: THREE.CanvasTexture;
  tomatoMap: THREE.CanvasTexture;
  ketchupLabelMap: THREE.CanvasTexture;
  platterMap: THREE.CanvasTexture;
  platterBump: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

function seededNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createProceduralBurgerTextures(maxAnisotropy: number): BurgerTextureSet {
  const anisotropy = Math.max(1, Math.min(maxAnisotropy, 8));
  const textures: THREE.CanvasTexture[] = [];

  const register = (
    canvas: HTMLCanvasElement,
    isColor: boolean,
    repeatX = 1,
    repeatY = 1
  ): THREE.CanvasTexture => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = anisotropy;
    tex.needsUpdate = true;
    textures.push(tex);
    return tex;
  };

  // 1. Toasted Brioche Bun (V is along Lathe profile: 0 = bottom cut edge, 1 = top apex)
  const [bunCanvas, bunCtx] = createCanvas(512, 512);
  const bunGrad = bunCtx.createLinearGradient(0, 512, 0, 0);
  bunGrad.addColorStop(0.0, '#F0D098'); // Pale baked crumb at cut rim
  bunGrad.addColorStop(0.22, '#DF9F52'); // Golden lower rim
  bunGrad.addColorStop(0.55, '#CC7828'); // Rich golden-amber side
  bunGrad.addColorStop(0.85, '#B65E18'); // Deep toasted brioche crown
  bunGrad.addColorStop(1.0, '#A54E12');
  bunCtx.fillStyle = bunGrad;
  bunCtx.fillRect(0, 0, 512, 512);

  // Subtle organic baked speckles
  for (let i = 0; i < 3200; i++) {
    const x = seededNoise(i, 1, 11) * 512;
    const y = seededNoise(i, 2, 11) * 512;
    const r = 0.8 + seededNoise(i, 3, 11) * 2.4;
    const warm = seededNoise(i, 4, 11) > 0.45;
    bunCtx.fillStyle = warm ? 'rgba(130, 55, 10, 0.14)' : 'rgba(255, 224, 168, 0.14)';
    bunCtx.beginPath();
    bunCtx.arc(x, y, r, 0, Math.PI * 2);
    bunCtx.fill();
  }
  const bunMap = register(bunCanvas, true);

  // Bun Bump
  const [bunBumpCanvas, bunBumpCtx] = createCanvas(256, 256);
  bunBumpCtx.fillStyle = '#808080';
  bunBumpCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2400; i++) {
    const x = seededNoise(i, 1, 17) * 256;
    const y = seededNoise(i, 2, 17) * 256;
    const r = 0.8 + seededNoise(i, 3, 17) * 2.2;
    const v = Math.floor(95 + seededNoise(i, 4, 17) * 70);
    bunBumpCtx.fillStyle = `rgb(${v},${v},${v})`;
    bunBumpCtx.beginPath();
    bunBumpCtx.arc(x, y, r, 0, Math.PI * 2);
    bunBumpCtx.fill();
  }
  const bunBump = register(bunBumpCanvas, false);

  // 2. Flame-Grilled Burger Patty Map & Bump
  const [pattyCanvas, pattyCtx] = createCanvas(512, 512);
  pattyCtx.fillStyle = '#4B2818';
  pattyCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4500; i++) {
    const x = seededNoise(i, 1, 29) * 512;
    const y = seededNoise(i, 2, 29) * 512;
    const r = 1.5 + seededNoise(i, 3, 29) * 5.0;
    const pick = seededNoise(i, 4, 29);
    if (pick < 0.32) pattyCtx.fillStyle = 'rgba(34, 16, 9, 0.45)';
    else if (pick < 0.72) pattyCtx.fillStyle = 'rgba(98, 52, 28, 0.38)';
    else pattyCtx.fillStyle = 'rgba(138, 76, 40, 0.25)';
    pattyCtx.beginPath();
    pattyCtx.arc(x, y, r, 0, Math.PI * 2);
    pattyCtx.fill();
  }
  // Diagonal char grill marks
  pattyCtx.strokeStyle = 'rgba(20, 9, 5, 0.58)';
  pattyCtx.lineWidth = 18;
  pattyCtx.lineCap = 'round';
  for (let offset = -512; offset < 1024; offset += 74) {
    pattyCtx.beginPath();
    pattyCtx.moveTo(offset, 0);
    pattyCtx.lineTo(offset + 320, 512);
    pattyCtx.stroke();
  }
  const pattyMap = register(pattyCanvas, true);

  const [pattyBumpCanvas, pattyBumpCtx] = createCanvas(256, 256);
  pattyBumpCtx.fillStyle = '#7c7c7c';
  pattyBumpCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3600; i++) {
    const x = seededNoise(i, 1, 31) * 256;
    const y = seededNoise(i, 2, 31) * 256;
    const r = 1.0 + seededNoise(i, 3, 31) * 3.8;
    const v = Math.floor(45 + seededNoise(i, 4, 31) * 175);
    pattyBumpCtx.fillStyle = `rgb(${v},${v},${v})`;
    pattyBumpCtx.beginPath();
    pattyBumpCtx.arc(x, y, r, 0, Math.PI * 2);
    pattyBumpCtx.fill();
  }
  const pattyBump = register(pattyBumpCanvas, false);

  // 3. Juicy Radial Tomato Slice Texture
  const [tomatoCanvas, tomatoCtx] = createCanvas(256, 256);
  const cx = 128;
  const cy = 128;
  tomatoCtx.fillStyle = '#D9261C';
  tomatoCtx.fillRect(0, 0, 256, 256);

  // Inner juicy flesh gradient
  const tomGrad = tomatoCtx.createRadialGradient(cx, cy, 8, cx, cy, 122);
  tomGrad.addColorStop(0.0, '#F57A66');
  tomGrad.addColorStop(0.25, '#E23828');
  tomGrad.addColorStop(0.75, '#CF2117');
  tomGrad.addColorStop(0.92, '#B61A12');
  tomGrad.addColorStop(1.0, '#9B130D');
  tomatoCtx.fillStyle = tomGrad;
  tomatoCtx.beginPath();
  tomatoCtx.arc(cx, cy, 124, 0, Math.PI * 2);
  tomatoCtx.fill();

  // Locule seed cavities + pale seeds
  for (let lobe = 0; lobe < 6; lobe++) {
    const baseAngle = (lobe / 6) * Math.PI * 2;
    tomatoCtx.save();
    tomatoCtx.translate(cx, cy);
    tomatoCtx.rotate(baseAngle);
    tomatoCtx.fillStyle = 'rgba(155, 16, 12, 0.72)';
    tomatoCtx.beginPath();
    tomatoCtx.ellipse(58, 0, 32, 20, 0, 0, Math.PI * 2);
    tomatoCtx.fill();

    tomatoCtx.fillStyle = '#F7D26A';
    for (let s = 0; s < 5; s++) {
      const sx = 42 + (s % 3) * 14;
      const sy = (s - 2) * 5.5;
      tomatoCtx.beginPath();
      tomatoCtx.ellipse(sx, sy, 4.2, 2.4, 0.25, 0, Math.PI * 2);
      tomatoCtx.fill();
    }
    tomatoCtx.restore();
  }
  const tomatoMap = register(tomatoCanvas, true);

  // 4. Gourmet Ketchup ("Chachap") Bottle Label Texture
  const [labelCanvas, labelCtx] = createCanvas(512, 384);
  // Rich warm cream label background wrapping front half
  labelCtx.fillStyle = '#F7EFE0';
  labelCtx.fillRect(0, 0, 512, 384);

  // Outer crimson & gold double border
  labelCtx.strokeStyle = '#B81414';
  labelCtx.lineWidth = 14;
  labelCtx.strokeRect(18, 18, 476, 348);
  labelCtx.strokeStyle = '#C9963B';
  labelCtx.lineWidth = 4;
  labelCtx.strokeRect(32, 32, 448, 320);

  // Center banner
  labelCtx.fillStyle = '#B81414';
  labelCtx.fillRect(54, 72, 404, 62);
  labelCtx.fillStyle = '#FFFFFF';
  labelCtx.font = '900 34px Georgia, serif';
  labelCtx.textAlign = 'center';
  labelCtx.textBaseline = 'middle';
  labelCtx.fillText('YASIR SPECIAL', 256, 104);

  // Tomato badge illustration
  labelCtx.fillStyle = '#D61C1C';
  labelCtx.beginPath();
  labelCtx.arc(256, 204, 46, 0, Math.PI * 2);
  labelCtx.fill();
  labelCtx.fillStyle = '#F04E37';
  labelCtx.beginPath();
  labelCtx.arc(242, 190, 14, 0, Math.PI * 2);
  labelCtx.fill();
  // Green tomato calyx leaves
  labelCtx.fillStyle = '#2E7D32';
  for (let i = 0; i < 5; i++) {
    labelCtx.save();
    labelCtx.translate(256, 158);
    labelCtx.rotate((i - 2) * 0.45);
    labelCtx.beginPath();
    labelCtx.ellipse(0, -8, 4, 14, 0, 0, Math.PI * 2);
    labelCtx.fill();
    labelCtx.restore();
  }

  // Bold KETCHUP title
  labelCtx.fillStyle = '#1C1412';
  labelCtx.font = '900 44px Impact, Arial Black, sans-serif';
  labelCtx.fillText('TOMATO KETCHUP', 256, 286);
  labelCtx.fillStyle = '#B81414';
  labelCtx.font = '700 20px sans-serif';
  labelCtx.fillText('RICH & SPICY • GULBERG III', 256, 324);

  const ketchupLabelMap = register(labelCanvas, true);

  // 5. Dark Charred Oak / Slate Serving Platter
  const [platterCanvas, platterCtx] = createCanvas(512, 512);
  platterCtx.fillStyle = '#1B1715';
  platterCtx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 3) {
    const shade = 20 + Math.floor(seededNoise(1, y, 47) * 16);
    platterCtx.fillStyle = `rgb(${shade + 5}, ${shade}, ${shade - 2})`;
    platterCtx.fillRect(0, y, 512, 3);
  }
  for (let i = 0; i < 1600; i++) {
    const x = seededNoise(i, 1, 53) * 512;
    const y = seededNoise(i, 2, 53) * 512;
    const w = 16 + seededNoise(i, 3, 53) * 64;
    platterCtx.fillStyle = 'rgba(10, 8, 7, 0.25)';
    platterCtx.fillRect(x, y, w, 1.5);
  }
  const platterMap = register(platterCanvas, true);

  const [platterBumpCanvas, platterBumpCtx] = createCanvas(256, 256);
  platterBumpCtx.fillStyle = '#808080';
  platterBumpCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 2) {
    const v = Math.floor(110 + seededNoise(2, y, 59) * 40);
    platterBumpCtx.fillStyle = `rgb(${v},${v},${v})`;
    platterBumpCtx.fillRect(0, y, 256, 2);
  }
  const platterBump = register(platterBumpCanvas, false);

  // 6. Soft Radial Contact Shadow Disc
  const [shadowCanvas, shadowCtx] = createCanvas(256, 256);
  const sGrad = shadowCtx.createRadialGradient(128, 128, 12, 128, 128, 124);
  sGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0.72)');
  sGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.36)');
  sGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  shadowCtx.fillStyle = sGrad;
  shadowCtx.fillRect(0, 0, 256, 256);
  const contactShadowMap = register(shadowCanvas, true);

  return {
    bunMap,
    bunBump,
    pattyMap,
    pattyBump,
    tomatoMap,
    ketchupLabelMap,
    platterMap,
    platterBump,
    contactShadowMap,
    dispose: () => {
      textures.forEach((t) => t.dispose());
    },
  };
}
