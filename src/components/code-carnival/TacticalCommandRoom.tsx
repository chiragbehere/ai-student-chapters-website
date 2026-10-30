// TacticalCommandRoom.tsx
// Chapter 05: Hawkins Underground Tunnel War-Room (Replacing generic radar circles)
// Inspired by the iconic Byers' house / Hawkins Lab underground tunnel map covered with corrupted vines and red anomaly markers
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TacticalCommandRoomProps {
  scrollProgress: number;
}

export const TacticalCommandRoom: React.FC<TacticalCommandRoomProps> = ({ scrollProgress }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const lampRef = useRef<THREE.Mesh>(null);

  // Procedural underground tunnel branches mapped across the floor
  const tunnelMapLines = useMemo(() => {
    const points: number[] = [];

    // 8 branching organic tunnel paths radiating from Hawkins central lab
    const branches = [
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1.5, 0, -1.2), new THREE.Vector3(-3.2, 0, -1.8), new THREE.Vector3(-4.5, 0, -3.0)],
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.2, 0, -1.5), new THREE.Vector3(2.8, 0, -2.2), new THREE.Vector3(4.2, 0, -3.5)],
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.8, 0, 1.4), new THREE.Vector3(-2.2, 0, 2.8), new THREE.Vector3(-3.8, 0, 4.0)],
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.9, 0, 1.2), new THREE.Vector3(2.4, 0, 2.5), new THREE.Vector3(3.6, 0, 3.8)],
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2.0, 0, 0.2), new THREE.Vector3(-4.0, 0, 0.5)],
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.2, 0, -0.2), new THREE.Vector3(4.5, 0, -0.4)],
    ];

    branches.forEach((branch) => {
      for (let i = 0; i < branch.length - 1; i++) {
        points.push(branch[i].x, branch[i].y, branch[i].z);
        points.push(branch[i + 1].x, branch[i + 1].y, branch[i + 1].z);
      }
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  // Anomaly hotspot beacon pins
  const anomalyNodes = useMemo(() => {
    return [
      { pos: [-4.5, 0.1, -3.0] },
      { pos: [4.2, 0.1, -3.5] },
      { pos: [-3.8, 0.1, 4.0] },
      { pos: [3.6, 0.1, 3.8] },
      { pos: [0, 0.1, 0] }, // Epicenter
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) {
      // Hawkins fluorescent tube hum & intermittent flicker
      const flicker = Math.sin(t * 16.0) > 0.85 ? 0.3 : 1.0;
      lightRef.current.intensity = (scrollProgress >= 0.68 && scrollProgress <= 0.88 ? 3.5 : 0.8) * flicker;
    }
  });

  return (
    <group position={[0, -1.8, -38]}>
      {/* 1. Hawkins Underground Tunnel Network Map projected on floor */}
      <lineSegments geometry={tunnelMapLines}>
        <lineBasicMaterial color="#e50914" linewidth={2} transparent opacity={0.75} />
      </lineSegments>

      {/* 2. Red Anomaly Hotspot Markers */}
      {anomalyNodes.map((node, i) => (
        <group key={i} position={node.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#ff2233" emissive="#ff0022" emissiveIntensity={1.5} />
          </mesh>
          <pointLight color="#ff2233" intensity={0.8} distance={3} />
        </group>
      ))}

      {/* 3. Overhead Corroded Fluorescent Light Fixture */}
      <mesh position={[0, 4.2, 0]} ref={lampRef}>
        <boxGeometry args={[2.5, 0.12, 0.3]} />
        <meshStandardMaterial color="#222830" roughness={0.7} />
      </mesh>
      {/* Fluorescent Bulb Tube */}
      <mesh position={[0, 4.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.3, 8]} />
        <meshStandardMaterial color="#ff8899" emissive="#ff3344" emissiveIntensity={1.2} />
      </mesh>

      {/* 4. Flashing Emergency / Fluorescent Room Light */}
      <pointLight
        ref={lightRef}
        position={[0, 3.8, 0]}
        color="#ff3344"
        intensity={2.8}
        distance={16}
        decay={2}
      />
    </group>
  );
};

export default TacticalCommandRoom;
