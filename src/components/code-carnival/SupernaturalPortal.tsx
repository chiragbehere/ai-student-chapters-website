// SupernaturalPortal.tsx
// AAA Procedural Upside-Down Dimensional Rift
// Includes: Swirling GLSL vortex event horizon, 3D animated cracks, electric arcs, and inward gathering energy spirals
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SupernaturalPortalProps {
  awakenProgress: number; // 0 = dormant, 0.2 = faint glow, 0.6 = cracks/electricity, 1.0 = fully expanded
  warpProgress: number;   // 0 to 1 when transitioning through the gate
  isHovered?: boolean;
}

// 1. Swirling GLSL Vortex Event Horizon Shader
const VortexCoreShader = {
  uniforms: {
    uTime: { value: 0 },
    uAwakenProgress: { value: 0.0 },
    uWarp: { value: 0.0 },
    uColorCore: { value: new THREE.Color('#ff2233') },
    uColorMid: { value: new THREE.Color('#99000a') },
    uColorDark: { value: new THREE.Color('#050106') },
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
      float wave = sin(dist * 12.0 - uTime * (3.0 + uWarp * 8.0)) * 0.15 * uAwakenProgress;
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
      float speed = uTime * (1.2 + uWarp * 4.0);
      float spiral = angle * 2.0 - dist * 8.0 + speed;
      vec2 spiralUv = vec2(cos(spiral), sin(spiral)) * dist;

      float n1 = noise(spiralUv * 8.0 + vec2(speed * 0.5));
      float n2 = noise(spiralUv * 16.0 - vec2(speed * 0.8));
      float turbulence = n1 * 0.6 + n2 * 0.4;

      // Color ramps based on distance from core & awaken progress
      vec3 col = mix(uColorDark, uColorMid, smoothstep(0.48, 0.15, dist));
      col = mix(col, uColorCore, smoothstep(0.25, 0.0, dist) * (0.8 + turbulence * 0.4));

      // Electrical micro-filaments in accretion disk
      float filaments = pow(turbulence, 3.5) * 2.5 * uAwakenProgress;
      col += vec3(1.0, 0.3, 0.2) * filaments;

      // Alpha edge feather
      float alpha = smoothstep(0.5, 0.38, dist) * clamp(uAwakenProgress * 1.4, 0.0, 1.0);

      // Blinding white-hot core during warp dive
      if (uWarp > 0.1) {
        col = mix(col, vec3(1.0, 0.9, 0.95), uWarp * smoothstep(0.4, 0.0, dist));
        alpha = mix(alpha, 1.0, uWarp);
      }

      gl_FragColor = vec4(col, alpha);
    }
  `,
};

// 2. Procedural Inward-Gathering Energy Particles
function GatheringEnergyParticles({ awakenProgress, warpProgress }: { awakenProgress: number; warpProgress: number }) {
  const count = 160;
  const pointsRef = useRef<THREE.Points>(null);

  const { initialPositions, speeds, angles, radii } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const ang = new Float32Array(count);
    const rad = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      rad[i] = 1.0 + Math.random() * 3.5;
      spd[i] = 0.8 + Math.random() * 1.5;

      pos[i * 3 + 0] = Math.cos(ang[i]) * rad[i];
      pos[i * 3 + 1] = Math.sin(ang[i]) * rad[i] * 1.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
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

    const speedMultiplier = (0.5 + awakenProgress * 2.0 + warpProgress * 6.0) * delta;

    for (let i = 0; i < count; i++) {
      radii[i] -= speeds[i] * speedMultiplier;
      angles[i] += speeds[i] * 2.5 * speedMultiplier;

      // Reset when particle enters rift core
      if (radii[i] < 0.15) {
        radii[i] = 2.5 + Math.random() * 2.0;
        angles[i] = Math.random() * Math.PI * 2;
      }

      array[i * 3 + 0] = Math.cos(angles[i]) * radii[i];
      array[i * 3 + 1] = Math.sin(angles[i]) * radii[i] * 1.35;
      array[i * 3 + 2] = Math.sin(angles[i] * 2.0) * 0.3 - (1.0 - radii[i] / 4.0) * 0.6;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={pGeom}>
      <pointsMaterial
        size={0.065}
        color="#ff3344"
        transparent
        opacity={Math.min(awakenProgress * 1.2, 0.95)}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3. Procedural 3D Dimensional Cracks (Radiating fractured spacetime)
function DimensionalCracks3D({ awakenProgress }: { awakenProgress: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const crackGeometry = useMemo(() => {
    const points: number[] = [];
    const crackBranches = 14;

    for (let b = 0; b < crackBranches; b++) {
      const baseAngle = (b / crackBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      let curr = new THREE.Vector3(
        Math.cos(baseAngle) * 1.35,
        Math.sin(baseAngle) * 1.9,
        (Math.random() - 0.5) * 0.2
      );

      const segments = 4 + Math.floor(Math.random() * 3);
      for (let s = 0; s < segments; s++) {
        const next = curr.clone().add(
          new THREE.Vector3(
            (Math.cos(baseAngle) + (Math.random() - 0.5) * 0.8) * 0.35,
            (Math.sin(baseAngle) + (Math.random() - 0.5) * 0.8) * 0.45,
            (Math.random() - 0.5) * 0.25
          )
        );
        points.push(curr.x, curr.y, curr.z);
        points.push(next.x, next.y, next.z);
        curr = next;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      // Pulse crack illumination
      const pulse = 0.5 + 0.5 * Math.sin(state.clock.getElapsedTime() * 8.0);
      mat.opacity = Math.max(0, (awakenProgress - 0.25) * 1.4) * (0.6 + pulse * 0.4);
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={crackGeometry}>
      <lineBasicMaterial
        color="#ff2233"
        transparent
        opacity={0}
        linewidth={2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// 4. Procedural Electric Arcs across the Portal Rim
function ElectricArcs({ awakenProgress }: { awakenProgress: number }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const arcGeo = useMemo(() => {
    const pts = new Float32Array(48 * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!lineRef.current || awakenProgress < 0.4) {
      if (lineRef.current) {
        (lineRef.current.material as THREE.LineBasicMaterial).opacity = 0;
      }
      return;
    }

    const posAttr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;

    // Trigger intermittent electric sparks
    const isSparking = Math.sin(state.clock.getElapsedTime() * 18.0) > 0.2;
    mat.opacity = isSparking ? 0.95 : 0.15;

    for (let i = 0; i < 24; i += 2) {
      const a1 = Math.random() * Math.PI * 2;
      const a2 = a1 + (Math.random() - 0.5) * 1.2;
      const r1 = 1.35 + (Math.random() - 0.5) * 0.3;
      const r2 = 1.35 + (Math.random() - 0.5) * 0.3;

      // Start point
      array[i * 3 + 0] = Math.cos(a1) * r1;
      array[i * 3 + 1] = Math.sin(a1) * r1 * 1.4;
      array[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      // End point
      array[(i + 1) * 3 + 0] = Math.cos(a2) * r2;
      array[(i + 1) * 3 + 1] = Math.sin(a2) * r2 * 1.4;
      array[(i + 1) * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef} geometry={arcGeo}>
      <lineBasicMaterial
        color="#ff8899"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
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

  // Organic fleshy rim perimeter geometry
  const rimGeometry = useMemo(() => {
    const geo = new THREE.TorusGeometry(1.4, 0.16, 16, 48);
    geo.scale(1.0, 1.4, 0.4);
    return geo;
  }, []);

  const rimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1f0407'),
      roughness: 0.6,
      metalness: 0.2,
      emissive: new THREE.Color('#7a000d'),
      emissiveIntensity: 0.4,
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
      const scaleMultiplier = (0.8 + awakenProgress * 0.35 + warpProgress * 2.5) * (isHovered ? 1.06 : 1.0);
      const breath = 1.0 + Math.sin(t * 2.5) * 0.03;
      portalGroupRef.current.scale.set(
        scaleMultiplier * breath,
        scaleMultiplier * breath,
        scaleMultiplier
      );

      // Subtle roll tilt
      portalGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group ref={portalGroupRef} position={[0, 0.5, -2]}>
      {/* 1. Core Vortex Rift Disc */}
      <mesh>
        <circleGeometry args={[1.5, 48]} />
        <primitive object={vortexMaterial} ref={vortexMatRef} attach="material" />
      </mesh>

      {/* 2. Organic Perimeter Rim */}
      <mesh geometry={rimGeometry} material={rimMaterial} />

      {/* 3. Inward Gathering Energy Sparks */}
      <GatheringEnergyParticles awakenProgress={awakenProgress} warpProgress={warpProgress} />

      {/* 4. Spacetime Dimensional Cracks */}
      <DimensionalCracks3D awakenProgress={awakenProgress} />

      {/* 5. Crackling Electric Arcs */}
      <ElectricArcs awakenProgress={awakenProgress} />

      {/* 6. Central Pulsating Dimensional Light */}
      <pointLight
        color="#ff1a26"
        intensity={(0.8 + awakenProgress * 2.2 + warpProgress * 8.0) * (isHovered ? 1.3 : 1.0)}
        distance={14}
        decay={2}
      />
    </group>
  );
};

export default SupernaturalPortal;

