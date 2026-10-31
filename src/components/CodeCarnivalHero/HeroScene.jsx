// HeroScene.jsx
// React Three Fiber 3D scene loading every placement from scene_layout.json
// Supports glTF animation clips, procedural particles, dynamic lightning, floating props, and lighting presets
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import sceneLayout from './sceneLayout';
import { PRESET_FOREST, PRESET_PORTAL, PRESET_RED_ALERT } from './lightingPresets';
import {
  playClips,
  makeParticleMaterial,
  setPointScale,
  PortalPulse,
  FloatingProps,
  flicker,
} from './codecarnival-animations';
import Effects from './Effects';

const BASE = '/CodeCarnival_3D_Assets/';

// Helper to ensure _size and _phase exist on points geometry
function ensureParticleAttributes(geometry) {
  if (!geometry.attributes.position) return;
  const count = geometry.attributes.position.count;

  if (!geometry.attributes._size) {
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = 0.5 + Math.random() * 0.8;
    }
    geometry.setAttribute('_size', new THREE.BufferAttribute(sizes, 1));
  }

  if (!geometry.attributes._phase) {
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      phases[i] = Math.random() * Math.PI * 2;
    }
    geometry.setAttribute('_phase', new THREE.BufferAttribute(phases, 1));
  }
}

// Single Placed glTF Model
function PlacedModel({ placement, onRegisterNode, particleTextures }) {
  const gltf = useGLTF(BASE + placement.file);
  const root = useMemo(() => gltf.scene.clone(true), [gltf]);
  const mixerRef = useRef(null);
  const particleMatsRef = useRef([]);

  useEffect(() => {
    // 1. Play baked glTF animation clips
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = playClips(THREE, gltf, root);
    }

    // 2. Hide initial preview nodes
    if (placement.preview_hide_nodes) {
      placement.preview_hide_nodes.forEach((nodeName) => {
        const found = root.getObjectByName(nodeName);
        if (found) found.visible = false;
      });
    }

    // 3. Setup particle point clouds
    if (placement.file.includes('portal_particles')) {
      root.traverse((obj) => {
        if (obj.isPoints) {
          ensureParticleAttributes(obj.geometry);
          const mat = makeParticleMaterial(THREE, {
            map: particleTextures.redParticle,
            mode: 'swirl',
            size: 1.1,
            color: 0xff3322,
            additive: true,
          });
          obj.material = mat;
          particleMatsRef.current.push(mat);
        }
      });
    } else if (placement.file.includes('environment_fog_particles')) {
      root.traverse((obj) => {
        if (obj.isPoints) {
          ensureParticleAttributes(obj.geometry);
          const isEmber = obj.name.toLowerCase().includes('ember');
          const mat = makeParticleMaterial(THREE, {
            map: isEmber ? particleTextures.ember : particleTextures.fog,
            mode: isEmber ? 'rise' : 'drift',
            size: isEmber ? 1.0 : 1.6,
            color: isEmber ? 0xff4422 : 0x8899aa,
            opacity: isEmber ? 0.9 : 0.65,
            additive: isEmber,
          });
          obj.material = mat;
          particleMatsRef.current.push(mat);
        }
      });
    }

    // 4. Register nodes for animation controllers
    if (onRegisterNode) {
      onRegisterNode({ file: placement.file, root, particleMats: particleMatsRef.current, mixer: mixerRef });
    }
  }, [gltf, root, placement, onRegisterNode, particleTextures]);

  useFrame((_, dt) => {
    if (mixerRef.current) mixerRef.current.update(dt);
  });

  return (
    <primitive
      object={root}
      position={placement.position}
      rotation={[0, placement.yaw_radians, 0]}
      scale={placement.scale}
    />
  );
}

// Master Runtime Controller inside Canvas
function SceneRuntime({
  activePresetName = 'forest',
  lightningControllerRef,
  onFlashTriggered,
  reducedMotion = false,
  isMobile = false,
  mousePos = { x: 0, y: 0 },
}) {
  const { scene, camera, size } = useThree();
  const particleMats = useRef([]);
  const floatingPropsRef = useRef(null);
  const portalPulseRef = useRef(null);
  const flickerNodesRef = useRef([]);
  const flickerLightsRef = useRef([]);
  const lightningBoltsRef = useRef([]);
  const lightningPointLightRef = useRef(null);

  // Lighting rigs references
  const ambientLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const dirLightRef = useRef(null);
  const portalPointLightRef = useRef(null);

  // Target lighting state for smooth cross-fading
  const targetLighting = useRef({
    ambientColor: new THREE.Color(PRESET_FOREST.ambient?.color || '#1a1530'),
    ambientIntensity: PRESET_FOREST.ambient?.intensity ?? 0.45,
    dirColor: new THREE.Color(PRESET_FOREST.directional?.[0]?.color || '#6f86d6'),
    dirIntensity: PRESET_FOREST.directional?.[0]?.intensity ?? 0.9,
    portalColor: new THREE.Color(PRESET_FOREST.points?.[0]?.color || '#ff2a14'),
    portalIntensity: PRESET_FOREST.points?.[0]?.intensity ?? 40,
    fogColor: new THREE.Color(PRESET_FOREST.fog?.color || '#120610'),
    fogDensity: PRESET_FOREST.fog?.density ?? 0.018,
    bgColor: new THREE.Color(PRESET_FOREST.background || '#0a0510'),
  });

  // Load particle sprites safely without suspending React
  const particleTextures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return {
      redParticle: loader.load(`${BASE}textures/particles/red_particle.png`),
      ember: loader.load(`${BASE}textures/particles/particle_ember.png`),
      fog: loader.load(`${BASE}textures/particles/fog_puff.png`),
    };
  }, []);

  // Handle register node from placements
  const handleRegisterNode = useMemo(
    () =>
      ({ file, root, particleMats: mats }) => {
        if (mats && mats.length) {
          particleMats.current.push(...mats);
        }

        // Collect floating debris & rocks
        if (file.includes('debris') || file.includes('floating_rocks')) {
          if (!floatingPropsRef.current) {
            floatingPropsRef.current = new FloatingProps(root);
          } else {
            root.traverse((n) => {
              if (n.userData?.floatAmp !== undefined || n.userData?.spin) {
                floatingPropsRef.current.items.push({
                  n,
                  y0: n.position.y,
                  amp: n.userData.floatAmp ?? 0.2,
                  sp: n.userData.floatSpeed ?? 0.35,
                  spin: n.userData.spin || [0, 0, 0],
                  ph: Math.random() * 6.28,
                });
              }
            });
          }
        }

        // Collect portal pulse references
        if (file.includes('portal_main')) {
          const halo = root.getObjectByName('portal_halo');
          let surfaceMat = null;
          root.traverse((n) => {
            if (n.isMesh && n.material?.name === 'portal_surface') {
              surfaceMat = n.material;
            }
          });
          portalPulseRef.current = new PortalPulse({
            halo,
            surfaceMaterial: surfaceMat,
            light: portalPointLightRef.current,
          });
        }

        // Collect lightning bolts
        if (file.includes('red_lightning_effect')) {
          root.traverse((n) => {
            if (n.name?.startsWith('lightning_bolt')) {
              n.visible = false;
              lightningBoltsRef.current.push(n);
            }
          });
          if (lightningControllerRef && lightningControllerRef.current) {
            lightningControllerRef.current.bolts = lightningBoltsRef.current;
            lightningControllerRef.current.light = lightningPointLightRef.current;
            lightningControllerRef.current.onFlash = (bolt, index) => {
              if (onFlashTriggered) onFlashTriggered(index);
            };
          }
        }

        // Collect flicker nodes
        if (file.includes('old_lamp') || file.includes('broken_electric_pole')) {
          root.traverse((n) => {
            if (n.userData?.flicker || n.name?.includes('bulb') || n.name?.includes('spark')) {
              flickerNodesRef.current.push(n);
            }
          });
        }
      },
    [lightningControllerRef, onFlashTriggered]
  );

  // Update target lighting on preset change
  useEffect(() => {
    const preset =
      activePresetName === 'portal'
        ? PRESET_PORTAL
        : activePresetName === 'red_alert'
        ? PRESET_RED_ALERT
        : PRESET_FOREST;

    if (preset.background) targetLighting.current.bgColor.set(preset.background);
    if (preset.fog) {
      targetLighting.current.fogColor.set(preset.fog.color);
      targetLighting.current.fogDensity = isMobile ? preset.fog.density * 0.8 : preset.fog.density;
    }

    if (preset.ambient) {
      targetLighting.current.ambientColor.set(preset.ambient.color);
      targetLighting.current.ambientIntensity = preset.ambient.intensity;
    }

    if (preset.directional && preset.directional.length > 0) {
      targetLighting.current.dirColor.set(preset.directional[0].color);
      targetLighting.current.dirIntensity = preset.directional[0].intensity;
    } else {
      targetLighting.current.dirIntensity = 0;
    }

    if (preset.points && preset.points.length > 0) {
      targetLighting.current.portalColor.set(preset.points[0].color);
      targetLighting.current.portalIntensity = preset.points[0].intensity;
    } else {
      targetLighting.current.portalIntensity = 0;
    }
  }, [activePresetName, isMobile]);

  // Adjust point scale on resize
  useEffect(() => {
    particleMats.current.forEach((mat) => {
      setPointScale(mat, size.height, camera.fov);
    });
  }, [size, camera]);

  // Main frame loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Update procedural particles
    particleMats.current.forEach((mat) => {
      if (mat.uniforms?.uTime) mat.uniforms.uTime.value = t;
    });

    // 2. Update floating rocks / debris
    if (floatingPropsRef.current) {
      floatingPropsRef.current.update(delta);
    }

    // 3. Update portal halo pulse & swirl
    if (portalPulseRef.current) {
      portalPulseRef.current.update(delta);
    }

    // 4. Update lamp & spark flicker
    if (flickerNodesRef.current.length > 0) {
      flicker(flickerNodesRef.current, t, flickerLightsRef.current);
    }

    // 5. Update lightning controller
    if (lightningControllerRef && lightningControllerRef.current) {
      lightningControllerRef.current.update(delta);
    }

    // 6. Smoothly lerp lighting presets (1.5s crossfade)
    const lerpRate = Math.min(1.0, delta * 2.2);

    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(targetLighting.current.ambientColor, lerpRate);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetLighting.current.ambientIntensity,
        lerpRate
      );
    }

    if (dirLightRef.current) {
      dirLightRef.current.color.lerp(targetLighting.current.dirColor, lerpRate);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetLighting.current.dirIntensity,
        lerpRate
      );
    }

    if (portalPointLightRef.current) {
      portalPointLightRef.current.color.lerp(targetLighting.current.portalColor, lerpRate);
      portalPointLightRef.current.intensity = THREE.MathUtils.lerp(
        portalPointLightRef.current.intensity,
        targetLighting.current.portalIntensity,
        lerpRate
      );
    }

    if (scene.fog) {
      scene.fog.color.lerp(targetLighting.current.fogColor, lerpRate);
      scene.fog.density = THREE.MathUtils.lerp(
        scene.fog.density,
        targetLighting.current.fogDensity,
        lerpRate
      );
    }

    // 7. Camera Dolly & Mouse Parallax
    if (!reducedMotion) {
      // Slow dolly-in toward portal
      const targetZ = THREE.MathUtils.lerp(11.5, 7.8, Math.min(1.0, t * 0.04));
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 1.5, delta);

      // Subtle mouse parallax
      const targetX = mousePos.x * 0.45;
      const targetY = 1.7 - mousePos.y * 0.3;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.0, delta);

      camera.lookAt(0, 4.2, -10.0);
    }
  });

  return (
    <>
      {/* Dynamic Lighting Rig */}
      <ambientLight ref={ambientLightRef} intensity={0.35} color="#1a2040" />
      <hemisphereLight ref={hemiLightRef} skyColor="#1b2250" groundColor="#220608" intensity={0.4} />
      <directionalLight
        ref={dirLightRef}
        position={[-14, 34, 16]}
        intensity={0.7}
        color="#6f86d6"
        castShadow={!isMobile}
      />
      <pointLight
        ref={portalPointLightRef}
        position={[0, 4.9, -10]}
        intensity={45}
        distance={45}
        color="#ff1a0a"
      />

      {/* Lightning Point Light */}
      <pointLight
        ref={lightningPointLightRef}
        position={[4, 25, -6]}
        intensity={0}
        distance={70}
        color="#ff6677"
      />

      {/* All Placements from scene_layout.json */}
      {sceneLayout.placements.map((p, idx) => {
        // Drop distant forest on mobile to keep 60fps
        if (isMobile && p.file.includes('distant_forest')) return null;
        return (
          <PlacedModel
            key={idx}
            placement={p}
            onRegisterNode={handleRegisterNode}
            particleTextures={particleTextures}
          />
        );
      })}
    </>
  );
}

// Master Canvas Export
export function HeroScene({
  activePresetName = 'forest',
  lightningControllerRef,
  onFlashTriggered,
  reducedMotion = false,
  isMobile = false,
  enableBloom = true,
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reducedMotion]);

  return (
    <Canvas
      camera={{
        position: sceneLayout.camera.position,
        fov: sceneLayout.camera.fov_y_degrees,
        near: 0.1,
        far: 300,
      }}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: 'high-performance',
      }}
    >
      <color attach="background" args={['#050308']} />
      <fogExp2 attach="fog" args={['#12040a', 0.02]} />

      <React.Suspense fallback={null}>
        <SceneRuntime
          activePresetName={activePresetName}
          lightningControllerRef={lightningControllerRef}
          onFlashTriggered={onFlashTriggered}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          mousePos={mousePos}
        />

        <Effects enabled={enableBloom && !isMobile} bloomStrength={0.8} bloomThreshold={0.65} />
      </React.Suspense>
    </Canvas>
  );
}

export default HeroScene;

