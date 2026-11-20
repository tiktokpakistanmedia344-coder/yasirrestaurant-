import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeBurgerLayerStack,
  evaluateRuffledRadius,
  generateKetchupSwirlPoints,
  generateSesameSeedTransforms,
  isSoftwareRendererName,
} from './heroBurgerMath';

test('burger layer stack orders monotonically from bottomBun to topBun', () => {
  const { layers, totalHeight } = computeBurgerLayerStack(0);
  const order = [
    'bottomBun',
    'herbMayo',
    'lettuce',
    'patty1',
    'cheese1',
    'patty2',
    'cheese2',
    'ketchupSwirl',
    'tomato',
    'onion',
    'topBun',
  ];

  for (let i = 1; i < order.length; i++) {
    const prev = layers[order[i - 1]];
    const curr = layers[order[i]];
    assert.ok(
      curr.y > prev.y,
      `Expected ${curr.id}.y (${curr.y}) to be strictly above ${prev.id}.y (${prev.y})`
    );
  }

  assert.ok(totalHeight > 1.8 && totalHeight < 2.6, `Unexpected totalHeight: ${totalHeight}`);
});

test('exploded stack increases total height cleanly', () => {
  const compact = computeBurgerLayerStack(0);
  const exploded = computeBurgerLayerStack(0.18);
  assert.ok(exploded.totalHeight > compact.totalHeight + 1.4);
});

test('sesame seeds sit on the dome surface with unit outward normals', () => {
  const domeR = 1.38;
  const domeH = 0.68;
  const baseY = 1.75;
  const seeds = generateSesameSeedTransforms(54, domeR, domeH, baseY);

  assert.equal(seeds.length, 54);
  for (const s of seeds) {
    const normMag = Math.hypot(s.nx, s.ny, s.nz);
    assert.ok(Math.abs(normMag - 1) < 1e-6, `Normal not normalized: ${normMag}`);
    assert.ok(s.ny > 0.35, `Seed normal should point mostly upward, got ${s.ny}`);
    assert.ok(s.y > baseY, `Seed should sit above baseY (${baseY}), got ${s.y}`);

    const radial = Math.hypot(s.x, s.z);
    assert.ok(radial < domeR, `Seed radial ${radial} exceeded dome radius ${domeR}`);
  }
});

test('ruffled edge radius oscillates smoothly within amplitude bounds', () => {
  const base = 1.5;
  const amp = 0.12;
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const r = evaluateRuffledRadius(angle, base, amp, 9);
    assert.ok(r >= base - amp * 1.5 && r <= base + amp * 1.5);
  }
});

test('ketchup swirl points form a continuous outward spiral', () => {
  const pts = generateKetchupSwirlPoints(2.2, 1.25, 1.42, 40);
  assert.equal(pts.length, 41);
  const firstR = Math.hypot(pts[0].x, pts[0].z);
  const lastR = Math.hypot(pts[40].x, pts[40].z);
  assert.ok(lastR > firstR, 'Swirl should expand outward');
});

test('isSoftwareRendererName detects software WebGL drivers and leaves GPUs fast', () => {
  assert.equal(isSoftwareRendererName('Google SwiftShader'), true);
  assert.equal(isSoftwareRendererName('llvmpipe (LLVM 15.0.7, 256 bits)'), true);
  assert.equal(isSoftwareRendererName('ANGLE (NVIDIA, NVIDIA GeForce RTX 4070)'), false);
  assert.equal(isSoftwareRendererName('Apple M3 Pro'), false);
});
