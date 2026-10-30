// SupernaturalPortal.tsx
// AAA Procedural Upside-Down Dimensional Rift (The Gate)
// Features: Swirling GLSL vortex event horizon with feathered organic accretion edge, soft gathering energy motes, pulsating crimson light
// (All geometric torus rings and harsh spiky wireframe cracks removed)
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SupernaturalPortalProps {
  awakenProgress: number; // 0 = dormant, 0.4 = active, 1.0 = fully expanded
  warpProgress: number;   // 0 to 1 when transitioning through the gate
  isHovered?: boolean;
}

// Procedural circular soft radial gradient texture for portal energy motes
function createCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Swirling GLSL Vortex Event Horizon Shader
const VortexCoreShader = {
  uniforms: {
    uTime: { value: 0 },
    uAwakenProgress: { value: 0.0 },
    uWarp: { value: 0.0 },
    uColorCore: { value: new THREE.Color('#ff1a26') },
    uColorMid: { value: new THREE.Color('#88000a') },
    uColorDark: { value: new THREE.Color('#030104') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uAwakenProgress;
    uniform float uWarp;

    void main() {
      vUv = uv;
      vNormal = normal;
      vec3 pos = position;

      float dist = length(uv - vec2(0.5));
      // Undulate surface based on awakening
      float wave = sin(dist * 10.0 - uTime * (2.5 + uWarp * 6.0)) * 0.12 * uAwakenProgress;
      pos.z += wave;

      // Cone pull into depth at center
      pos.z -= smoothstep(0.5, 0.0, dist) * (0.8 + uWarp * 3.5);

      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uAwakenProgress;
    uniform float uWarp;
    uniform vec3 uColorCore;
    uniform vec3 uColorMid;
    uniform vec3 uColorDark;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Fast 2D noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    void main() {
      vec2 center = vUv - vec2(0.5);
      float dist = length(center);
      float angle = atan(center.y, center.x);

      // Vortex logarithmic rotation
      float speed = uTime * (1.1 + uWarp * 3.5);
      float spiral = angle * 2.0 - dist * 7.0 + speed;
      vec2 spiralUv = vec2(cos(spiral), sin(spiral)) * dist;

      float n1 = noise(spiralUv * 7.0 + vec2(speed * 0.4));
      float n2 = noise(spiralUv * 14.0 - vec2(speed * 0.7));
      float turbulence = n1 * 0.6 + n2 * 0.4;

      // Color ramps based on distance from core & awaken progress
      vec3 col = mix(uColorDark, uColorMid, smoothstep(0.48, 0.15, dist));
      col = mix(col, uColorCore, smoothstep(0.24, 0.0, dist) * (0.85 + turbulence * 0.35));

      // Organic energy filaments in accretion disk
      float filaments = pow(turbulence, 3.2) * 2.2 * uAwakenProgress;
      col += vec3(1.0, 0.3, 0.2) * filaments;

      // Soft feathered alpha edge (no sharp circular boundary)
      float alpha = smoothstep(0.5, 0.36, dist) * clamp(uAwakenProgress * 1.3, 0.0, 1.0);

      // Blinding white-hot core during warp dive
      if (uWarp > 0.1) {
        col = mix(col, vec3(1.0, 0.92, 0.95), uWarp * smoothstep(0.4, 0.0, dist));
        alpha = mix(alpha, 1.0, uWarp);
      }

      gl_FragColor = vec4(col, alpha);
    }
  `,
};

// Procedural Soft Inward-Gathering Energy Particles
function SoftGatheringEnergyParticles({
  awakenProgress,
  warpProgress,
}: {
  awakenProgress: number;
  warpProgress: number;
}) {
  const count = 120;
  const pointsRef = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const { initialPositions, speeds, angles, radii } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const ang = new Float32Array(count);
    const rad = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      rad[i] = 1.0 + Math.random() * 3.2;
      spd[i] = 0.7 + Math.random() * 1.4;

      pos[i * 3 + 0] = Math.cos(ang[i]) * rad[i];
      pos[i * 3 + 1] = Math.sin(ang[i]) * rad[i] * 1.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
    }
    return { initialPositions: pos, speeds: spd, angles: ang, radii: rad };
  }, [count]);

  const pGeom = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(initialPositions.slice(), 3));
    return geo;
  }, [initialPositions]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const speedMultiplier = (0.5 + awakenProgress * 1.8 + warpProgress * 5.0) * delta;

    for (let i = 0; i < count; i++) {
      radii[i] -= speeds[i] * speedMultiplier;
      angles[i] += speeds[i] * 2.2 * speedMultiplier;

      // Reset when particle enters rift core
      if (radii[i] < 0.15) {
        radii[i] = 2.4 + Math.random() * 1.8;
        angles[i] = Math.random() * Math.PI * 2;
      }

      array[i * 3 + 0] = Math.cos(angles[i]) * radii[i];
      array[i * 3 + 1] = Math.sin(angles[i]) * radii[i] * 1.3;
      array[i * 3 + 2] = Math.sin(angles[i] * 2.0) * 0.25 - (1.0 - radii[i] / 4.0) * 0.5;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={pGeom}>
      <pointsMaterial
        map={circleTexture}
        size={0.16}
        color="#ff2b38"
        transparent
        opacity={Math.min(awakenProgress * 0.9, 0.85)}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export const SupernaturalPortal: React.FC<SupernaturalPortalProps> = ({
  awakenProgress = 1.0,
  warpProgress = 0.0,
  isHovered = false,
}) => {
  const vortexMatRef = useRef<THREE.ShaderMaterial>(null);
  const portalGroupRef = useRef<THREE.Group>(null);

  const vortexMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(VortexCoreShader.uniforms),
      vertexShader: VortexCoreShader.vertexShader,
      fragmentShader: VortexCoreShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (vortexMatRef.current) {
      vortexMatRef.current.uniforms.uTime.value = t;
      vortexMatRef.current.uniforms.uAwakenProgress.value = THREE.MathUtils.damp(
        vortexMatRef.current.uniforms.uAwakenProgress.value,
        awakenProgress,
        3.0,
        delta
      );
      vortexMatRef.current.uniforms.uWarp.value = THREE.MathUtils.damp(
        vortexMatRef.current.uniforms.uWarp.value,
        warpProgress,
        5.0,
        delta
      );
    }

    if (portalGroupRef.current) {
      // Gentle dimensional breathing oscillation
      const scaleMultiplier = (0.85 + awakenProgress * 0.35 + warpProgress * 2.5) * (isHovered ? 1.06 : 1.0);
      const breath = 1.0 + Math.sin(t * 2.2) * 0.025;
      portalGroupRef.current.scale.set(
        scaleMultiplier * breath,
        scaleMultiplier * breath,
        scaleMultiplier
      );
      portalGroupRef.current.rotation.z = Math.sin(t * 0.4) * 0.03;
    }
  });

  return (
    <group ref={portalGroupRef} position={[0, 0.4, -2]}>
      {/* 1. Core Vortex Rift Disc */}
      <mesh>
        <circleGeometry args={[1.65, 48]} />
        <primitive object={vortexMaterial} ref={vortexMatRef} attach="material" />
      </mesh>

      {/* 2. Soft Inward Gathering Energy Sparks (round glowing particles) */}
      <SoftGatheringEnergyParticles awakenProgress={awakenProgress} warpProgress={warpProgress} />

      {/* 3. Central Pulsating Dimensional Light */}
      <pointLight
        color="#ff1a26"
        intensity={(0.9 + awakenProgress * 2.0 + warpProgress * 8.0) * (isHovered ? 1.3 : 1.0)}
        distance={14}
        decay={2}
      />
    </group>
  );
};

export default SupernaturalPortal;
