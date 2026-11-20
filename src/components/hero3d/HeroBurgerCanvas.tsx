import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, RotateCcw } from 'lucide-react';
import { computeBurgerLayerStack, isSoftwareRendererName } from '../../utils/heroBurgerMath';
import { createProceduralBurgerTextures } from './proceduralTextures';
import { buildBurgerAndKetchupScene } from './buildBurgerAndKetchupScene';

export const HeroBurgerCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [isExploded, setIsExploded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const explodeTargetRef = useRef(0);
  const resetTriggerRef = useRef(0);

  useEffect(() => {
    explodeTargetRef.current = isExploded ? 0.16 : 0;
  }, [isExploded]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    const wrapper = containerRef.current;
    if (!mount || !wrapper) return;

    // Probe software WebGL renderer once and immediately free context
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return isSoftwareRendererName(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = Math.max(mount.clientWidth, 320);
    const height = Math.max(mount.clientHeight, 320);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'pan-y';

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Procedural studio environment reflection on every device
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    const initialCameraPos = new THREE.Vector3(0.45, 2.75, 6.25);
    const initialTarget = new THREE.Vector3(0.24, 1.05, 0.08);
    camera.position.copy(initialCameraPos);

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xd4e4ff, 0x3b2214, 1.05);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff0d8, 2.55);
    keyLight.position.set(4.5, 6.8, 5.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.camera.left = -4.2;
      keyLight.shadow.camera.right = 4.2;
      keyLight.shadow.camera.top = 4.2;
      keyLight.shadow.camera.bottom = -4.2;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Warm restaurant-orange rim light to accentuate sesame bun, melted cheese & ketchup gloss
    const rimLight = new THREE.DirectionalLight(0xff842b, 1.9);
    rimLight.position.set(-4.8, 4.0, -4.5);
    scene.add(rimLight);

    // Soft front fill so ketchup label and lower burger layers remain rich and legible
    const fillLight = new THREE.DirectionalLight(0xffe6cc, 0.85);
    fillLight.position.set(-3.2, 2.1, 4.6);
    scene.add(fillLight);

    // Procedural Textures + Composite 3D Burger & Ketchup Showcase
    const textures = createProceduralBurgerTextures(renderer.capabilities.getMaxAnisotropy());
    const rig = buildBurgerAndKetchupScene(textures, !isSoftwareGl);
    scene.add(rig.rootGroup);

    // Subtle initial showcase angle so ketchup bottle, bowl, and burger stack read clearly
    rig.rootGroup.rotation.y = -0.22;

    // Interactive OrbitControls (zoom disabled so page scrolling works seamlessly)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(initialTarget);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.rotateSpeed = 0.7;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.update();

    let isUserDragging = false;
    let lastInteractionTime = -10;
    const onControlStart = () => {
      isUserDragging = true;
    };
    const onControlEnd = () => {
      isUserDragging = false;
      lastInteractionTime = clock.getElapsedTime();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ResizeObserver for crisp responsive framing
    const handleResize = () => {
      if (!mount) return;
      const w = Math.max(mount.clientWidth, 280);
      const h = Math.max(mount.clientHeight, 280);
      camera.aspect = w / h;
      // Slightly pull back on narrow portrait viewports so platter & bottle stay inside frame
      if (w < 460) {
        camera.fov = 38;
      } else {
        camera.fov = 34;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // Pre-computed baseline stack positions for zero-allocation exploded animation
    const baseStack = computeBurgerLayerStack(0).layers;
    const expandedStack = computeBurgerLayerStack(0.18).layers;
    const layerOrder = Object.keys(baseStack);

    let currentExplode = 0;
    let lastResetSignal = resetTriggerRef.current;
    let swayPhase = 0;
    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();

    const afterDraw = (cb: () => void) => {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (isDisposed) return;

      const dt = Math.min(clock.getDelta(), 0.08);
      const elapsed = clock.getElapsedTime();

      // Handle camera & angle reset trigger
      if (resetTriggerRef.current !== lastResetSignal) {
        lastResetSignal = resetTriggerRef.current;
        camera.position.copy(initialCameraPos);
        controls.target.copy(initialTarget);
        rig.rootGroup.rotation.y = -0.22;
        swayPhase = 0;
        controls.update();
      }

      // Smoothly damp exploded burger layers
      const targetExplode = explodeTargetRef.current;
      if (Math.abs(currentExplode - targetExplode) > 0.0005) {
        currentExplode = THREE.MathUtils.damp(currentExplode, targetExplode, 7.5, dt);
        const factor = currentExplode / 0.16;
        for (let i = 0; i < layerOrder.length; i++) {
          const key = layerOrder[i];
          const obj = rig.layerGroups[key];
          if (!obj) continue;
          const baseY = key === 'topBun' ? baseStack[key].y - 0.14 : baseStack[key].y;
          const expY = key === 'topBun' ? expandedStack[key].y - 0.14 : expandedStack[key].y;
          obj.position.y = THREE.MathUtils.lerp(baseY, expY, factor);
        }
      }

      // Gentle turntable sway when user is not actively orbiting
      if (!isUserDragging && elapsed - lastInteractionTime > 1.2) {
        swayPhase += dt * 0.45;
        const targetYaw = -0.22 + Math.sin(swayPhase) * 0.24;
        rig.rootGroup.rotation.y = THREE.MathUtils.damp(
          rig.rootGroup.rotation.y,
          targetYaw,
          3.2,
          dt
        );
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    // Draw initial frame immediately and mark ready
    renderer.render(scene, camera);
    setSceneReady(true);

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();
      rig.dispose();
      textures.dispose();
      envTarget.dispose();
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, []);

  const handleResetView = () => {
    setIsExploded(false);
    resetTriggerRef.current += 1;
  };

  return (
    <div
      ref={containerRef}
      data-testid="hero-3d-showcase"
      data-scene-ready={sceneReady ? 'true' : 'false'}
      data-exploded={isExploded ? 'true' : 'false'}
      className="relative w-full h-[380px] sm:h-[440px] lg:h-[560px] flex items-center justify-center select-none"
    >
      {/* Subtle warm radial spotlight halo behind 3D burger & ketchup */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle_at_54%_52%,rgba(244,120,18,0.22)_0%,rgba(200,20,20,0.10)_38%,rgba(9,9,9,0)_72%)]"
      />

      {/* Isolated WebGL mount container */}
      <div
        ref={canvasMountRef}
        data-testid="hero-3d-canvas"
        aria-label="Interactive 3D Double Gourmet Burger and Yasir Tomato Ketchup Showcase"
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {webglUnavailable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Interactive 3D Preview Unavailable
          </p>
        </div>
      )}

      {/* Minimal, non-occluding bottom dock control bar (solid dark rgba surface, no backdrop-blur over WebGL) */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#121212]/90 border border-white/15 rounded-xl px-3 py-1.5 shadow-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300 px-1.5 hidden sm:inline">
          Drag 3D
        </span>
        <span className="w-px h-3.5 bg-white/15 hidden sm:inline-block" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setIsExploded((prev) => !prev)}
          aria-pressed={isExploded}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            isExploded
              ? 'bg-[#F47812] text-white'
              : 'bg-white/10 hover:bg-white/20 text-neutral-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isExploded ? 'Stack Burger' : 'Inspect Layers'}</span>
        </button>
        <button
          type="button"
          onClick={handleResetView}
          aria-label="Reset 3D view"
          title="Reset 3D view"
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
