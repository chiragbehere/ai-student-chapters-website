// ChallengeProps.tsx
// 3D Visual Artifacts for the 4 Challenge Zones in Chapter 03
// AI Neural Matrix, IoT Gyro Ring, Cybersecurity Firewall Shield, and Open Innovation Fractal
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChallengePropsComponentProps {
  scrollProgress: number; // 0 to 1
  activeZoneIndex: number;
}

export const ChallengeProps: React.FC<ChallengePropsComponentProps> = ({ activeZoneIndex }) => {
  const aiMeshRef = useRef<THREE.Mesh>(null);
  const iotMeshRef = useRef<THREE.Group>(null);
  const securityMeshRef = useRef<THREE.Mesh>(null);
  const openMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. AI Neural Core Rotation & Breathing
    if (aiMeshRef.current) {
      aiMeshRef.current.rotation.x = t * 0.4;
      aiMeshRef.current.rotation.y = t * 0.6;
      const s = 1.0 + Math.sin(t * 3.0) * 0.08;
      aiMeshRef.current.scale.set(s, s, s);
    }

    // 2. IoT Cybernetic Gyro Rings
    if (iotMeshRef.current) {
      iotMeshRef.current.rotation.y = t * 0.8;
      iotMeshRef.current.rotation.z = Math.sin(t * 0.6) * 0.4;
    }

    // 3. Cybersecurity Firewall Shield
    if (securityMeshRef.current) {
      securityMeshRef.current.rotation.y = -t * 0.5;
      securityMeshRef.current.rotation.x = Math.cos(t * 0.4) * 0.3;
    }

    // 4. Open Innovation Torus Knot
    if (openMeshRef.current) {
      openMeshRef.current.rotation.x = t * 0.5;
      openMeshRef.current.rotation.y = t * 0.7;
    }
  });

  return (
    <group position={[0, 0.4, 0]}>
      {/* ── ZONE 1: AI / Machine Learning (z: -9) ── */}
      <group position={[activeZoneIndex === 0 ? 0 : -3.2, 0, -9]}>
        <mesh ref={aiMeshRef}>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial
            color="#00e5ff"
            wireframe
            emissive="#004466"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#00e5ff" intensity={activeZoneIndex === 0 ? 3.0 : 0.8} distance={8} />
      </group>

      {/* ── ZONE 2: IoT & Hardware (z: -13.5) ── */}
      <group position={[activeZoneIndex === 1 ? 0 : 3.2, 0, -13.5]} ref={iotMeshRef}>
        <mesh>
          <torusGeometry args={[1.0, 0.08, 12, 36]} />
          <meshStandardMaterial color="#00ff66" emissive="#005511" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.75, 0.06, 12, 32]} />
          <meshStandardMaterial color="#00ffaa" wireframe />
        </mesh>
        <pointLight color="#00ff66" intensity={activeZoneIndex === 1 ? 3.0 : 0.8} distance={8} />
      </group>

      {/* ── ZONE 3: Cybersecurity (z: -18) ── */}
      <group position={[activeZoneIndex === 2 ? 0 : -3.2, 0, -18]}>
        <mesh ref={securityMeshRef}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#ff0044"
            wireframe
            emissive="#770011"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#ff0044" intensity={activeZoneIndex === 2 ? 3.5 : 0.8} distance={8} />
      </group>

      {/* ── ZONE 4: Open Innovation (z: -22.5) ── */}
      <group position={[activeZoneIndex === 3 ? 0 : 3.2, 0, -22.5]}>
        <mesh ref={openMeshRef}>
          <torusKnotGeometry args={[0.85, 0.22, 64, 12]} />
          <meshStandardMaterial
            color="#ffaa00"
            wireframe
            emissive="#884400"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#ffaa00" intensity={activeZoneIndex === 3 ? 3.5 : 0.8} distance={8} />
      </group>
    </group>
  );
};

export default ChallengeProps;
