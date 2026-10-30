// VaultDoor.tsx
// Chapter 04: Heavy Reinforced Blast Vault Door
// Unlocks and swings open based on scroll progress (0.50 to 0.70) spilling golden volumetric light
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VaultDoorProps {
  scrollProgress: number; // 0 to 1
}

export const VaultDoor: React.FC<VaultDoorProps> = ({ scrollProgress }) => {
  const doorHingeRef = useRef<THREE.Group>(null);
  const lockWheelRef = useRef<THREE.Group>(null);
  const goldLightRef = useRef<THREE.PointLight>(null);
  const trophyRef = useRef<THREE.Mesh>(null);

  // Vault frame materials
  const frameMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0c0f16'),
      roughness: 0.7,
      metalness: 0.85,
    });
  }, []);

  const doorMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141824'),
      roughness: 0.55,
      metalness: 0.9,
    });
  }, []);

  const goldCrystalMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd700'),
      emissive: new THREE.Color('#997700'),
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.8,
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Opening calculation: begins at 0.50, fully open by 0.65
    const openFactor = THREE.MathUtils.clamp((scrollProgress - 0.51) / 0.13, 0.0, 1.0);

    // Lock wheel spins first
    if (lockWheelRef.current) {
      const targetWheelRot = openFactor * Math.PI * 2.5;
      lockWheelRef.current.rotation.z = THREE.MathUtils.damp(
        lockWheelRef.current.rotation.z,
        targetWheelRot,
        4.0,
        delta
      );
    }

    // Heavy vault door swings open on left hinge
    if (doorHingeRef.current) {
      const targetHingeRot = openFactor * -1.55; // Swing ~88 degrees outward
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetHingeRot,
        3.5,
        delta
      );
    }

    // Golden treasure light spills out as door cracks open
    if (goldLightRef.current) {
      goldLightRef.current.intensity = openFactor * 6.5;
    }

    // Floating prize crystal inside the vault
    if (trophyRef.current) {
      trophyRef.current.rotation.y = t * 0.7;
      trophyRef.current.position.y = 0.5 + Math.sin(t * 2.0) * 0.12;
    }
  });

  return (
    <group position={[0, 0, -28]}>
      {/* 1. Heavy Outer Circular Vault Frame */}
      <mesh material={frameMat}>
        <torusGeometry args={[3.2, 0.45, 16, 48]} />
      </mesh>

      {/* Surrounding reinforced bulkheads */}
      <mesh position={[-3.8, 0, 0]} material={frameMat}>
        <boxGeometry args={[1.6, 7.0, 0.8]} />
      </mesh>
      <mesh position={[3.8, 0, 0]} material={frameMat}>
        <boxGeometry args={[1.6, 7.0, 0.8]} />
      </mesh>

      {/* 2. Left-Hinged Vault Door */}
      <group position={[-2.8, 0, 0]} ref={doorHingeRef}>
        {/* Main circular door slab attached to hinge offset */}
        <mesh position={[2.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={doorMat}>
          <cylinderGeometry args={[2.9, 2.9, 0.45, 36]} />
        </mesh>

        {/* Central Locking Wheel on door face */}
        <group position={[2.8, 0, 0.28]} ref={lockWheelRef}>
          <mesh material={frameMat}>
            <torusGeometry args={[0.9, 0.08, 12, 28]} />
          </mesh>
          <mesh material={frameMat} rotation={[0, 0, 0]}>
            <boxGeometry args={[1.9, 0.12, 0.1]} />
          </mesh>
          <mesh material={frameMat} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[1.9, 0.12, 0.1]} />
          </mesh>
        </group>
      </group>

      {/* 3. Golden Light Beam spilling out from inner chamber */}
      <pointLight
        ref={goldLightRef}
        position={[0, 0.4, -2.5]}
        color="#ffd700"
        intensity={0}
        distance={18}
        decay={1.8}
      />

      {/* 4. Floating 3D Prize Trophy Crystal inside Vault */}
      <group position={[0, 0, -5]}>
        <mesh ref={trophyRef} material={goldCrystalMat}>
          <dodecahedronGeometry args={[1.0, 0]} />
        </mesh>
        <pointLight position={[0, 0.5, 0]} color="#ffd700" intensity={2.5} distance={6} />
      </group>
    </group>
  );
};

export default VaultDoor;
