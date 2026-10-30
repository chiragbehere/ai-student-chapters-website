// StrangerChristmasLights.tsx
// 100% Iconic Stranger Things Element: Hanging 3D Christmas lights
// Features: Catenary hanging wire cables, vertical hanging drops, multi-colored incandescent bulbs, organic supernatural flickering & surges
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Authentic 1980s C9 Christmas light bulb color palette
export const BULB_COLORS = [
  '#e50914', // Stranger Things Ruby Red
  '#ff8c00', // Deep Amber Orange
  '#ffd700', // Warm Golden Yellow
  '#00e676', // Emerald Green
  '#00b0ff', // Electric Sapphire Blue
  '#d500f9', // Ultraviolet / Magenta
  '#ff4081', // Hot Pink
  '#ffffff', // Warm White
];

interface HorizontalStringProps {
  position?: [number, number, number];
  width?: number;
  sag?: number;
  bulbCount?: number;
  flickerSpeed?: number;
}

interface VerticalDropProps {
  position: [number, number, number];
  length?: number;
  bulbCount?: number;
}

// 1. Horizontal Draped Christmas Light Garland
export const ChristmasLightGarland: React.FC<HorizontalStringProps> = ({
  position = [0, 1.6, 14.2],
  width = 8.0,
  sag = 0.6,
  bulbCount = 18,
  flickerSpeed = 1.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bulbsRef = useRef<THREE.Group>(null);

  // Generate catenary wire curve and bulb sample points
  const { curve, bulbPoints } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * 2 - 1; // -1 to 1
      const x = (t * width) / 2;
      const y = -sag * (1 - t * t); // Parabolic catenary sag
      const z = Math.sin(t * Math.PI) * 0.35;
      points.push(new THREE.Vector3(x, y, z));
    }
    const catCurve = new THREE.CatmullRomCurve3(points);

    // Sample bulb positions along curve
    const bPts: Array<{ pos: THREE.Vector3; color: string; phase: number; lightColor: THREE.Color }> = [];
    for (let b = 0; b < bulbCount; b++) {
      const u = (b + 0.5) / bulbCount;
      const pt = catCurve.getPoint(u);
      const col = BULB_COLORS[b % BULB_COLORS.length];
      bPts.push({
        pos: pt,
        color: col,
        phase: b * 0.6 + Math.random() * 0.4,
        lightColor: new THREE.Color(col),
      });
    }

    return { curve: catCurve, bulbPoints: bPts };
  }, [width, sag, bulbCount]);

  const wireGeom = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, 0.016, 6, false);
  }, [curve]);

  const wireMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#091209' }); // Deep dark green insulated wire
  }, []);

  // Shared bulb geometry: elongated teardrop bulb
  const bulbGeom = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.095, 12, 12);
    geo.scale(1.0, 1.45, 1.0);
    return geo;
  }, []);

  // Socket mount geometry
  const socketGeom = useMemo(() => {
    return new THREE.CylinderGeometry(0.045, 0.045, 0.08, 8);
  }, []);

  const socketMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#041608' });
  }, []);

  useFrame((state) => {
    if (!bulbsRef.current) return;
    const t = state.clock.getElapsedTime() * flickerSpeed;

    // Organic swaying of the string in the supernatural breeze
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.015;
    }

    // Dynamic bulb flicker: warm hum with organic surges
    bulbsRef.current.children.forEach((child, idx) => {
      const mesh = child.children[1] as THREE.Mesh;
      if (mesh && mesh.material instanceof THREE.MeshStandardMaterial) {
        const bp = bulbPoints[idx];
        if (bp) {
          const hum = Math.sin(t * 7.0 + bp.phase) * 0.2 + Math.sin(t * 18.0 + bp.phase * 2.0) * 0.15;
          const surge = Math.sin(t * 1.5 + bp.phase) > 0.85 ? 1.4 : 0.0;
          const intensity = Math.max(0.3, 1.1 + hum + surge);
          mesh.material.emissiveIntensity = intensity * 1.6;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Insulated Wire Cable */}
      <mesh geometry={wireGeom} material={wireMat} />

      {/* 2. Bulbs along the cable */}
      <group ref={bulbsRef}>
        {bulbPoints.map((b, i) => (
          <group key={i} position={b.pos}>
            {/* Green socket mount */}
            <mesh geometry={socketGeom} material={socketMat} position={[0, 0.06, 0]} />

            {/* Glowing Teardrop Bulb */}
            <mesh geometry={bulbGeom}>
              <meshStandardMaterial
                color={b.color}
                emissive={b.color}
                emissiveIntensity={1.6}
                roughness={0.15}
                metalness={0.1}
              />
            </mesh>

            {/* Radiant point light on select bulbs to illuminate mist & surroundings */}
            {i % 4 === 1 && (
              <pointLight
                color={b.color}
                intensity={0.8}
                distance={3.5}
                decay={2}
              />
            )}
          </group>
        ))}
      </group>
    </group>
  );
};

// 2. Vertical Cascading Christmas Light Drops (Framing the left and right sides)
export const ChristmasLightDrop: React.FC<VerticalDropProps> = ({
  position,
  length = 2.4,
  bulbCount = 7,
}) => {
  const bulbsRef = useRef<THREE.Group>(null);

  const { points, bulbData } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const bData: Array<{ pos: [number, number, number]; color: string; phase: number }> = [];

    const segments = 12;
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const y = -t * length;
      const x = Math.sin(t * Math.PI * 2.0) * 0.06;
      pts.push(new THREE.Vector3(x, y, 0));
    }

    for (let b = 0; b < bulbCount; b++) {
      const u = (b + 0.5) / bulbCount;
      const y = -u * length;
      const x = Math.sin(u * Math.PI * 2.0) * 0.06;
      const color = BULB_COLORS[(b * 2) % BULB_COLORS.length];
      bData.push({
        pos: [x, y, 0],
        color,
        phase: b * 0.8 + Math.random() * 0.5,
      });
    }

    return { points: pts, bulbData: bData };
  }, [length, bulbCount]);

  const wireGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 16, 0.014, 6, false);
  }, [points]);

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#091209' }), []);

  const bulbGeom = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.085, 10, 10);
    geo.scale(1.0, 1.4, 1.0);
    return geo;
  }, []);

  useFrame((state) => {
    if (!bulbsRef.current) return;
    const t = state.clock.getElapsedTime();

    bulbsRef.current.children.forEach((child, idx) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const bp = bulbData[idx];
        if (bp) {
          const flicker = Math.sin(t * 6.5 + bp.phase) * 0.25 + 1.0;
          child.material.emissiveIntensity = Math.max(0.3, flicker * 1.5);
        }
      }
    });
  });

  return (
    <group position={position}>
      {/* Insulated hanging wire */}
      <mesh geometry={wireGeom} material={wireMat} />

      {/* Bulbs along the drop */}
      <group ref={bulbsRef}>
        {bulbData.map((b, i) => (
          <mesh key={i} geometry={bulbGeom} position={b.pos}>
            <meshStandardMaterial
              color={b.color}
              emissive={b.color}
              emissiveIntensity={1.5}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Default export wrapper
export const StrangerChristmasLights: React.FC<HorizontalStringProps> = (props) => {
  return <ChristmasLightGarland {...props} />;
};

export default StrangerChristmasLights;
