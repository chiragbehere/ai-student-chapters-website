// TacticalCommandRoom.tsx
// Chapter 05: High-Tension Tactical Command Center & Holographic Radar Grid
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TacticalCommandRoomProps {
  scrollProgress: number;
}

export const TacticalCommandRoom: React.FC<TacticalCommandRoomProps> = ({ scrollProgress }) => {
  const radarMeshRef = useRef<THREE.Mesh>(null);
  const radarSweepRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.y = t * 1.5;
    }
  });

  const isActive = scrollProgress >= 0.68 && scrollProgress <= 0.88;

  return (
    <group position={[0, -1.2, -38]}>
      {/* 1. Tactical Radar Hologram Floor Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} ref={radarMeshRef}>
        <ringGeometry args={[0.5, 4.5, 32, 4]} />
        <meshBasicMaterial
          color="#e50914"
          wireframe
          transparent
          opacity={isActive ? 0.65 : 0.2}
        />
      </mesh>

      {/* 2. Rotating Radar Scanner Beam */}
      <group ref={radarSweepRef}>
        <mesh position={[2.0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.0, 0.15]} />
          <meshBasicMaterial color="#ff3344" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* 3. Holographic Column Lasers flanking the command space */}
      <mesh position={[-3.6, 2.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 6.0, 8]} />
        <meshBasicMaterial color="#e50914" transparent opacity={0.7} />
      </mesh>
      <mesh position={[3.6, 2.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 6.0, 8]} />
        <meshBasicMaterial color="#e50914" transparent opacity={0.7} />
      </mesh>

      {/* 4. Command Center Atmosphere Point Light */}
      <pointLight
        position={[0, 2.5, 0]}
        color="#e50914"
        intensity={isActive ? 3.5 : 0.8}
        distance={14}
        decay={2}
      />
    </group>
  );
};

export default TacticalCommandRoom;
