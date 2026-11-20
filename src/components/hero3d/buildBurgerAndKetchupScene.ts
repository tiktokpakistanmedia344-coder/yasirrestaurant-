import * as THREE from 'three';
import {
  computeBurgerLayerStack,
  evaluateRuffledRadius,
  generateKetchupSwirlPoints,
  generateSesameSeedTransforms,
} from '../../utils/heroBurgerMath';
import { BurgerTextureSet } from './proceduralTextures';

export interface BurgerShowcaseRig {
  rootGroup: THREE.Group;
  burgerGroup: THREE.Group;
  ketchupBottleGroup: THREE.Group;
  ketchupBowlGroup: THREE.Group;
  layerGroups: Record<string, THREE.Object3D>;
  dispose: () => void;
}

function createRuffledPattyGeometry(
  radius: number,
  height: number,
  radialSegments = 48
): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(radius, radius * 0.98, height, radialSegments, 4, false);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r > 0.05) {
      const angle = Math.atan2(z, x);
      const wave = evaluateRuffledRadius(angle, 1.0, 0.028, 7);
      const midBulge = 1.0 + (1.0 - Math.min(1, Math.abs(y) / (height * 0.5))) * 0.035;
      const factor = wave * midBulge;
      pos.setX(i, x * factor);
      pos.setZ(i, z * factor);
      // Slight organic top/bottom surface undulation
      const bumpY = Math.sin(x * 4.5 + z * 3.8) * 0.012;
      pos.setY(i, y + bumpY);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createRuffledLettuceGeometry(
  innerR: number,
  outerR: number,
  radialSegments = 72,
  rings = 5
): THREE.BufferGeometry {
  const geo = new THREE.RingGeometry(innerR, outerR, radialSegments, rings);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    const t = THREE.MathUtils.clamp((r - innerR) / (outerR - innerR), 0, 1);
    const angle = Math.atan2(z, x);

    const radialStretch = evaluateRuffledRadius(angle, 1.0, 0.08 * t, 10);
    const frillY =
      Math.sin(angle * 11) * 0.068 * Math.pow(t, 1.35) +
      Math.cos(angle * 23 + 0.5) * 0.032 * Math.pow(t, 1.7) +
      Math.sin(t * Math.PI) * 0.03;

    pos.setX(i, x * radialStretch);
    pos.setZ(i, z * radialStretch);
    pos.setY(i, frillY);
  }
  geo.computeVertexNormals();
  return geo;
}

function createMeltedCheeseGeometry(halfSize: number, thickness: number): THREE.ExtrudeGeometry {
  const r = 0.16;
  const shape = new THREE.Shape();
  shape.moveTo(-halfSize + r, -halfSize);
  shape.lineTo(halfSize - r, -halfSize);
  shape.quadraticCurveTo(halfSize, -halfSize, halfSize, -halfSize + r);
  shape.lineTo(halfSize, halfSize - r);
  shape.quadraticCurveTo(halfSize, halfSize, halfSize - r, halfSize);
  shape.lineTo(-halfSize + r, halfSize);
  shape.quadraticCurveTo(-halfSize, halfSize, -halfSize, halfSize - r);
  shape.lineTo(-halfSize, -halfSize + r);
  shape.quadraticCurveTo(-halfSize, -halfSize, -halfSize + r, -halfSize);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 2,
    curveSegments: 8,
  });
  geo.rotateX(Math.PI / 2);

  // Subdivide isn't needed if we drape vertices proportionally by radial distance to corners
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const cornerDist = Math.max(0, Math.hypot(x, z) - halfSize * 0.86);
    const droop = Math.pow(cornerDist / (halfSize * 0.65), 1.45) * 0.24;
    pos.setY(i, y - droop);
  }
  geo.computeVertexNormals();
  return geo;
}

export function buildBurgerAndKetchupScene(
  textures: BurgerTextureSet,
  enableShadows: boolean
): BurgerShowcaseRig {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const setShadows = (obj: THREE.Object3D, cast = true, receive = true) => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = enableShadows && cast;
        child.receiveShadow = enableShadows && receive;
      }
    });
  };

  const rootGroup = new THREE.Group();

  // =========================================================================
  // 1. SERVING PLATTER (Charred Oak / Dark Slate Board, top surface at y = 0)
  // =========================================================================
  const platterProfile = [
    new THREE.Vector2(0.0, -0.14),
    new THREE.Vector2(2.68, -0.14),
    new THREE.Vector2(2.86, -0.06),
    new THREE.Vector2(2.88, -0.015),
    new THREE.Vector2(2.78, 0.0),
    new THREE.Vector2(0.0, 0.0),
  ];
  const platterGeo = trackGeo(new THREE.LatheGeometry(platterProfile, 64));
  const platterMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.platterMap,
      bumpMap: textures.platterBump,
      bumpScale: 0.015,
      roughness: 0.78,
      metalness: 0.06,
    })
  );
  const platterMesh = new THREE.Mesh(platterGeo, platterMat);
  setShadows(platterMesh, false, true);
  rootGroup.add(platterMesh);

  // Subtle brass accent ring around outer board bevel
  const rimRingGeo = trackGeo(new THREE.TorusGeometry(2.83, 0.018, 12, 72));
  rimRingGeo.rotateX(Math.PI / 2);
  const rimRingMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd9822b,
      roughness: 0.34,
      metalness: 0.72,
    })
  );
  const rimRingMesh = new THREE.Mesh(rimRingGeo, rimRingMat);
  rimRingMesh.position.y = -0.015;
  rootGroup.add(rimRingMesh);

  // Contact shadow disc utility
  const contactShadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: textures.contactShadowMap,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    })
  );
  const addContactShadow = (x: number, y: number, z: number, radius: number, opacityScale = 1) => {
    const discGeo = trackGeo(new THREE.CircleGeometry(radius, 36));
    discGeo.rotateX(-Math.PI / 2);
    const mat =
      opacityScale === 1
        ? contactShadowMat
        : trackMat(
            new THREE.MeshBasicMaterial({
              map: textures.contactShadowMap,
              transparent: true,
              opacity: 0.65 * opacityScale,
              depthWrite: false,
            })
          );
    const disc = new THREE.Mesh(discGeo, mat);
    disc.position.set(x, y, z);
    rootGroup.add(disc);
  };

  addContactShadow(0, -0.145, 0, 3.25, 0.85);

  // =========================================================================
  // 2. GIANT GOURMET DOUBLE CHEESEBURGER (Bottom-center pivoted at y = 0)
  // =========================================================================
  const burgerGroup = new THREE.Group();
  burgerGroup.position.set(-0.46, 0, -0.12);
  burgerGroup.scale.setScalar(1.06);
  rootGroup.add(burgerGroup);

  addContactShadow(-0.46, 0.015, -0.12, 1.78, 0.92);

  const stack = computeBurgerLayerStack(0);
  const layerGroups: Record<string, THREE.Object3D> = {};

  // Shared PBR Materials for Burger
  const bunMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: textures.bunMap,
      bumpMap: textures.bunBump,
      bumpScale: 0.018,
      roughness: 0.46,
      metalness: 0.0,
      clearcoat: 0.18,
      clearcoatRoughness: 0.55,
    })
  );
  const pattyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.pattyMap,
      bumpMap: textures.pattyBump,
      bumpScale: 0.036,
      roughness: 0.62,
      metalness: 0.04,
    })
  );
  const cheeseMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffa71a,
      roughness: 0.22,
      metalness: 0.0,
      clearcoat: 0.48,
      clearcoatRoughness: 0.24,
      emissive: 0x3b1800,
      emissiveIntensity: 0.14,
    })
  );
  const lettuceMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x4ca634,
      roughness: 0.42,
      metalness: 0.0,
      side: THREE.DoubleSide,
    })
  );
  const mayoMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xf6e6c2,
      roughness: 0.26,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
    })
  );
  const ketchupMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xc91212,
      roughness: 0.08,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: 0x2a0202,
      emissiveIntensity: 0.18,
    })
  );
  const tomatoSideMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xcd1d15,
      roughness: 0.18,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
    })
  );
  const tomatoFaceMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: textures.tomatoMap,
      roughness: 0.16,
      clearcoat: 0.65,
      clearcoatRoughness: 0.14,
    })
  );
  const onionMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x8a245c,
      roughness: 0.28,
      clearcoat: 0.3,
    })
  );
  const pickleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x3f6e22,
      roughness: 0.36,
    })
  );
  const sesameMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf7e3b5,
      roughness: 0.58,
      metalness: 0.0,
    })
  );

  // 2a. Bottom Brioche Bun
  const bottomBunProfile = [
    new THREE.Vector2(0.0, -0.17),
    new THREE.Vector2(1.18, -0.17),
    new THREE.Vector2(1.33, -0.12),
    new THREE.Vector2(1.38, -0.01),
    new THREE.Vector2(1.37, 0.14),
    new THREE.Vector2(1.28, 0.17),
    new THREE.Vector2(0.0, 0.17),
  ];
  const bottomBunGeo = trackGeo(new THREE.LatheGeometry(bottomBunProfile, 48));
  const bottomBunMesh = new THREE.Mesh(bottomBunGeo, bunMat);
  bottomBunMesh.position.y = stack.layers.bottomBun.y;
  burgerGroup.add(bottomBunMesh);
  layerGroups.bottomBun = bottomBunMesh;

  // 2b. Herb Mayo Sauce Layer
  const mayoGeo = trackGeo(new THREE.CylinderGeometry(1.34, 1.31, 0.08, 40));
  const mayoMesh = new THREE.Mesh(mayoGeo, mayoMat);
  mayoMesh.position.y = stack.layers.herbMayo.y;
  burgerGroup.add(mayoMesh);
  layerGroups.herbMayo = mayoMesh;

  // 2c. Crisp Ruffled Iceberg Lettuce Leaf
  const lettuceGroup = new THREE.Group();
  lettuceGroup.position.y = stack.layers.lettuce.y;
  const lettuceGeo = trackGeo(createRuffledLettuceGeometry(0.45, 1.56, 72, 5));
  const lettuceMesh1 = new THREE.Mesh(lettuceGeo, lettuceMat);
  const lettuceMesh2 = new THREE.Mesh(lettuceGeo, lettuceMat);
  lettuceMesh2.rotation.y = 0.52;
  lettuceMesh2.position.y = 0.025;
  lettuceMesh2.scale.set(0.95, 0.85, 0.95);
  lettuceGroup.add(lettuceMesh1, lettuceMesh2);
  burgerGroup.add(lettuceGroup);
  layerGroups.lettuce = lettuceGroup;

  // 2d. First Flame-Grilled Patty
  const pattyGeo = trackGeo(createRuffledPattyGeometry(1.36, 0.31, 48));
  const patty1Mesh = new THREE.Mesh(pattyGeo, pattyMat);
  patty1Mesh.position.y = stack.layers.patty1.y;
  burgerGroup.add(patty1Mesh);
  layerGroups.patty1 = patty1Mesh;

  // 2e. First Melted Aged Cheddar Cheese Slice
  const cheeseGeo = trackGeo(createMeltedCheeseGeometry(1.16, 0.055));
  const cheese1Mesh = new THREE.Mesh(cheeseGeo, cheeseMat);
  cheese1Mesh.position.y = stack.layers.cheese1.y + 0.03;
  cheese1Mesh.rotation.y = 0.25;
  burgerGroup.add(cheese1Mesh);
  layerGroups.cheese1 = cheese1Mesh;

  // 2f. Second Flame-Grilled Patty
  const patty2Mesh = new THREE.Mesh(pattyGeo, pattyMat);
  patty2Mesh.position.y = stack.layers.patty2.y;
  patty2Mesh.rotation.y = 0.72;
  patty2Mesh.scale.set(0.985, 0.97, 0.985);
  burgerGroup.add(patty2Mesh);
  layerGroups.patty2 = patty2Mesh;

  // 2g. Second Melted Cheddar Cheese Slice (offset 45deg)
  const cheese2Mesh = new THREE.Mesh(cheeseGeo, cheeseMat);
  cheese2Mesh.position.y = stack.layers.cheese2.y + 0.03;
  cheese2Mesh.rotation.y = 1.04;
  cheese2Mesh.scale.set(0.98, 1.0, 0.98);
  burgerGroup.add(cheese2Mesh);
  layerGroups.cheese2 = cheese2Mesh;

  // 2h. Rich Ketchup Swirl Inside the Burger (peeking visibly out at the sides!)
  const swirlGroup = new THREE.Group();
  const swirlPoints = generateKetchupSwirlPoints(2.2, 1.30, stack.layers.ketchupSwirl.y, 56).map(
    (p) => new THREE.Vector3(p.x, p.y, p.z)
  );
  const swirlCurve = new THREE.CatmullRomCurve3(swirlPoints);
  const swirlGeo = trackGeo(new THREE.TubeGeometry(swirlCurve, 64, 0.055, 10, false));
  const swirlMesh = new THREE.Mesh(swirlGeo, ketchupMat);
  swirlGroup.add(swirlMesh);

  // Add 3 luscious ketchup drips hanging gently over the upper cheese edge
  const dripGeo = trackGeo(new THREE.CapsuleGeometry(0.052, 0.14, 6, 12));
  const dripAngles = [0.22, 1.15, -0.68];
  dripAngles.forEach((ang, idx) => {
    const drip = new THREE.Mesh(dripGeo, ketchupMat);
    const r = 1.33;
    drip.position.set(
      Math.cos(ang) * r,
      stack.layers.ketchupSwirl.y - 0.08 - idx * 0.015,
      Math.sin(ang) * r
    );
    drip.scale.set(1, 1.1, 0.72);
    swirlGroup.add(drip);
  });
  burgerGroup.add(swirlGroup);
  layerGroups.ketchupSwirl = swirlGroup;

  // 2i. Juicy Tomato Slices + Dill Pickles
  const tomatoGroup = new THREE.Group();
  tomatoGroup.position.y = stack.layers.tomato.y;
  const tomatoSliceGeo = trackGeo(new THREE.CylinderGeometry(0.78, 0.78, 0.11, 32));
  const tomatoMats = [tomatoSideMat, tomatoFaceMat, tomatoFaceMat];

  const tomatoOffsets = [
    { x: 0.44, z: 0.36, ry: 0.3, dy: 0 },
    { x: -0.45, z: 0.28, ry: -0.4, dy: 0.018 },
    { x: 0.02, z: -0.48, ry: 1.1, dy: 0.009 },
  ];
  tomatoOffsets.forEach((t) => {
    const slice = new THREE.Mesh(tomatoSliceGeo, tomatoMats);
    slice.position.set(t.x, t.dy, t.z);
    slice.rotation.y = t.ry;
    tomatoGroup.add(slice);
  });

  // Crinkled dill pickles peeking out between tomato & onion
  const pickleGeo = trackGeo(new THREE.CylinderGeometry(0.36, 0.36, 0.05, 20));
  [
    { x: 0.92, z: -0.32, rz: -0.08 },
    { x: -0.25, z: 0.94, rx: 0.08 },
    { x: -0.88, z: -0.42, rz: 0.07 },
  ].forEach((p) => {
    const pickle = new THREE.Mesh(pickleGeo, pickleMat);
    pickle.position.set(p.x, 0.055, p.z);
    pickle.rotation.set(p.rx ?? 0, 0, p.rz ?? 0);
    tomatoGroup.add(pickle);
  });
  burgerGroup.add(tomatoGroup);
  layerGroups.tomato = tomatoGroup;

  // 2j. Crisp Red Onion Rings
  const onionGroup = new THREE.Group();
  onionGroup.position.y = stack.layers.onion.y;
  const onionRingGeo = trackGeo(new THREE.TorusGeometry(0.56, 0.048, 12, 36));
  onionRingGeo.rotateX(Math.PI / 2);
  [
    { x: 0.52, z: 0.24, y: 0 },
    { x: -0.46, z: 0.34, y: 0.02 },
    { x: 0.08, z: -0.44, y: 0.01 },
  ].forEach((o) => {
    const ring = new THREE.Mesh(onionRingGeo, onionMat);
    ring.position.set(o.x, o.y, o.z);
    onionGroup.add(ring);
  });
  burgerGroup.add(onionGroup);
  layerGroups.onion = onionGroup;

  // 2k. Domed Brioche Crown Bun + 54 Instanced Sesame Seeds
  const topBunGroup = new THREE.Group();
  topBunGroup.position.y = stack.layers.topBun.y - 0.14;

  const crownPts: THREE.Vector2[] = [new THREE.Vector2(0.0, 0.0), new THREE.Vector2(1.30, 0.0)];
  const domeSegs = 20;
  for (let i = 0; i <= domeSegs; i++) {
    const t = i / domeSegs;
    const phi = (1 - t) * (Math.PI * 0.5);
    const r = 1.40 * Math.sin(phi);
    const y = 0.10 + 0.66 * Math.cos(phi);
    // Smooth lip curve at base
    if (i === 0) {
      crownPts.push(new THREE.Vector2(1.38, 0.05));
    }
    crownPts.push(new THREE.Vector2(r, y));
  }
  const crownGeo = trackGeo(new THREE.LatheGeometry(crownPts, 52));
  const crownMesh = new THREE.Mesh(crownGeo, bunMat);
  topBunGroup.add(crownMesh);

  // Instanced Sesame Seeds oriented to surface normals
  const seedGeo = trackGeo(new THREE.SphereGeometry(1, 10, 8));
  const seedTransforms = generateSesameSeedTransforms(54, 1.40, 0.66, 0.10);
  const sesameInstanced = new THREE.InstancedMesh(seedGeo, sesameMat, seedTransforms.length);

  const dummy = new THREE.Object3D();
  const upVec = new THREE.Vector3(0, 1, 0);
  const normalVec = new THREE.Vector3();
  const qAlign = new THREE.Quaternion();
  const qTwist = new THREE.Quaternion();

  seedTransforms.forEach((s, idx) => {
    normalVec.set(s.nx, s.ny, s.nz).normalize();
    qAlign.setFromUnitVectors(upVec, normalVec);
    qTwist.setFromAxisAngle(normalVec, s.twist);
    dummy.quaternion.multiplyQuaternions(qTwist, qAlign);
    // Seat seed slightly embedded into the bun glaze surface
    dummy.position.set(
      s.x + normalVec.x * 0.008,
      s.y + normalVec.y * 0.008,
      s.z + normalVec.z * 0.008
    );
    dummy.scale.set(s.scaleX, s.scaleY, s.scaleZ);
    dummy.updateMatrix();
    sesameInstanced.setMatrixAt(idx, dummy.matrix);
  });
  sesameInstanced.instanceMatrix.needsUpdate = true;
  sesameInstanced.computeBoundingSphere();
  topBunGroup.add(sesameInstanced);

  burgerGroup.add(topBunGroup);
  layerGroups.topBun = topBunGroup;
  setShadows(burgerGroup, true, true);

  // =========================================================================
  // 3. KETCHUP ("CHACHAP") SQUEEZE BOTTLE (Standing proudly beside burger)
  // =========================================================================
  const ketchupBottleGroup = new THREE.Group();
  ketchupBottleGroup.position.set(1.56, 0, -0.58);
  ketchupBottleGroup.rotation.y = -0.35;
  rootGroup.add(ketchupBottleGroup);
  addContactShadow(1.56, 0.015, -0.58, 0.72, 0.85);

  // Classic gourmet squeeze bottle silhouette (bottom at y = 0)
  const bottleProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.46, 0.0),
    new THREE.Vector2(0.52, 0.08),
    new THREE.Vector2(0.54, 0.45),
    new THREE.Vector2(0.50, 1.15),
    new THREE.Vector2(0.53, 1.55),
    new THREE.Vector2(0.48, 1.78),
    new THREE.Vector2(0.24, 1.98),
    new THREE.Vector2(0.22, 2.15),
    new THREE.Vector2(0.0, 2.15),
  ];
  const bottleGeo = trackGeo(new THREE.LatheGeometry(bottleProfile, 40));
  const bottleMesh = new THREE.Mesh(bottleGeo, ketchupMat);
  ketchupBottleGroup.add(bottleMesh);

  // Gold & crimson collar ring at bottle neck
  const collarGeo = trackGeo(new THREE.CylinderGeometry(0.25, 0.26, 0.14, 32));
  const collarMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd99b38,
      roughness: 0.25,
      metalness: 0.78,
    })
  );
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.position.y = 2.18;
  ketchupBottleGroup.add(collarMesh);

  // Red squeeze nozzle cap
  const nozzleProfile = [
    new THREE.Vector2(0.0, 2.24),
    new THREE.Vector2(0.24, 2.24),
    new THREE.Vector2(0.22, 2.34),
    new THREE.Vector2(0.065, 2.66),
    new THREE.Vector2(0.042, 2.70),
    new THREE.Vector2(0.0, 2.70),
  ];
  const nozzleGeo = trackGeo(new THREE.LatheGeometry(nozzleProfile, 28));
  const nozzleMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xdf1b1b,
      roughness: 0.22,
      clearcoat: 0.6,
    })
  );
  const nozzleMesh = new THREE.Mesh(nozzleGeo, nozzleMat);
  ketchupBottleGroup.add(nozzleMesh);

  // Tiny glossy ketchup drop clinging to tip of nozzle
  const tipDropGeo = trackGeo(new THREE.SphereGeometry(0.044, 14, 12));
  const tipDropMesh = new THREE.Mesh(tipDropGeo, ketchupMat);
  tipDropMesh.position.y = 2.71;
  tipDropMesh.scale.set(1, 1.35, 1);
  ketchupBottleGroup.add(tipDropMesh);

  // Front Curved Ketchup Label ("YASIR SPECIAL - TOMATO KETCHUP")
  const labelGeo = trackGeo(
    new THREE.CylinderGeometry(0.532, 0.515, 0.96, 32, 1, true, -Math.PI * 0.44, Math.PI * 0.88)
  );
  const labelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.ketchupLabelMap,
      roughness: 0.5,
      metalness: 0.04,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.y = 1.02;
  ketchupBottleGroup.add(labelMesh);
  setShadows(ketchupBottleGroup, true, true);

  // =========================================================================
  // 4. OVERFLOWING KETCHUP ("CHACHAP") DIPPING BOWL + GLOSSY DRIZZLE
  // =========================================================================
  const ketchupBowlGroup = new THREE.Group();
  ketchupBowlGroup.position.set(1.44, 0, 0.96);
  rootGroup.add(ketchupBowlGroup);
  addContactShadow(1.44, 0.015, 0.96, 0.78, 0.9);

  // Matte dark stoneware dipping bowl (ramekin)
  const bowlProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.46, 0.0),
    new THREE.Vector2(0.62, 0.16),
    new THREE.Vector2(0.68, 0.40),
    new THREE.Vector2(0.70, 0.45),
    new THREE.Vector2(0.63, 0.46),
    new THREE.Vector2(0.58, 0.36),
    new THREE.Vector2(0.0, 0.24),
  ];
  const bowlGeo = trackGeo(new THREE.LatheGeometry(bowlProfile, 40));
  const bowlMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x242220,
      roughness: 0.72,
      metalness: 0.12,
    })
  );
  const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
  ketchupBowlGroup.add(bowlMesh);

  // Sculpted glossy ketchup pool inside the ramekin with swirl peak
  const ketchupPoolProfile = [
    new THREE.Vector2(0.0, 0.48),
    new THREE.Vector2(0.11, 0.44),
    new THREE.Vector2(0.24, 0.43),
    new THREE.Vector2(0.42, 0.415),
    new THREE.Vector2(0.58, 0.405),
    new THREE.Vector2(0.61, 0.36),
    new THREE.Vector2(0.0, 0.30),
  ];
  const ketchupPoolGeo = trackGeo(new THREE.LatheGeometry(ketchupPoolProfile, 36));
  const ketchupPoolMesh = new THREE.Mesh(ketchupPoolGeo, ketchupMat);
  ketchupBowlGroup.add(ketchupPoolMesh);

  // Sculpted ketchup swirl ribbon on top of the dipping bowl
  const bowlSwirlPts = generateKetchupSwirlPoints(1.6, 0.44, 0.43, 36).map(
    (p, idx, arr) =>
      new THREE.Vector3(
        p.x,
        p.y + (1 - idx / arr.length) * 0.075,
        p.z
      )
  );
  const bowlSwirlGeo = trackGeo(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bowlSwirlPts), 40, 0.045, 10, false)
  );
  const bowlSwirlMesh = new THREE.Mesh(bowlSwirlGeo, ketchupMat);
  ketchupBowlGroup.add(bowlSwirlMesh);

  // Glossy ketchup drizzle ribbon & droplets on the platter right beside the bowl & burger
  const platterDrizzleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, 0.032, 1.38),
    new THREE.Vector3(0.75, 0.035, 1.56),
    new THREE.Vector3(1.02, 0.032, 1.42),
    new THREE.Vector3(1.26, 0.032, 1.66),
  ]);
  const platterDrizzleGeo = trackGeo(new THREE.TubeGeometry(platterDrizzleCurve, 32, 0.036, 10, false));
  const platterDrizzleMesh = new THREE.Mesh(platterDrizzleGeo, ketchupMat);
  rootGroup.add(platterDrizzleMesh);

  const dropGeo = trackGeo(new THREE.SphereGeometry(0.065, 14, 10));
  [
    { x: 0.32, z: 1.52, s: 0.9 },
    { x: 0.88, z: 1.72, s: 1.15 },
    { x: 1.44, z: 1.78, s: 0.75 },
    { x: 2.08, z: 0.44, s: 0.85 },
  ].forEach((d) => {
    const drop = new THREE.Mesh(dropGeo, ketchupMat);
    drop.position.set(d.x, 0.02, d.z);
    drop.scale.set(d.s, 0.38 * d.s, d.s);
    rootGroup.add(drop);
  });

  setShadows(ketchupBowlGroup, true, true);

  return {
    rootGroup,
    burgerGroup,
    ketchupBottleGroup,
    ketchupBowlGroup,
    layerGroups,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
