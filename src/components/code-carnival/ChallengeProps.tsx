// ChallengeProps.tsx
// 100% Authentic Stranger Things / Hawkins Lab Props (Replacing generic geometric shapes)
// Zone 01: Hawkins Lab Sensory Deprivation EEG Reel-to-Reel Computer Console
// Zone 02: Dustin's Cerebro Radio & Walkie-Talkie Transceiver
// Zone 03: Hawkins National Lab Chain-Link Security Gate & Hazard Sign
// Zone 04: The Organic Dimensional Spacetime Rift Fissure
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChallengePropsComponentProps {
  scrollProgress: number;
  activeZoneIndex: number;
}

export const ChallengeProps: React.FC<ChallengePropsComponentProps> = ({ activeZoneIndex }) => {
  // Zone 1 Reel-to-Reel Spools
  const reel1Ref = useRef<THREE.Group>(null);
  const reel2Ref = useRef<THREE.Group>(null);
  const eegScreenRef = useRef<THREE.MeshBasicMaterial>(null);

  // Zone 2 Radio Antenna Coil
  const radioAntennaRef = useRef<THREE.Group>(null);

  // Zone 3 Security Floodlight
  const floodlightRef = useRef<THREE.PointLight>(null);

  // Zone 4 Rift Fissure
  const riftFissureRef = useRef<THREE.Group>(null);

  // Shared 80s Industrial Hardware Materials
  const metalMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#12151e'),
      roughness: 0.6,
      metalness: 0.8,
    });
  }, []);

  const hazardMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d4a017'), // Warning yellow
      roughness: 0.4,
      metalness: 0.2,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Zone 1: Turning Reel-to-Reel Tapes
    if (reel1Ref.current && reel2Ref.current) {
      reel1Ref.current.rotation.z = t * 1.8;
      reel2Ref.current.rotation.z = t * 1.8;
    }
    if (eegScreenRef.current) {
      // Oscilloscope flicker
      eegScreenRef.current.opacity = 0.8 + Math.sin(t * 15.0) * 0.15;
    }

    // Zone 2: Cerebro Radio Antenna Indicator Glow
    if (radioAntennaRef.current) {
      radioAntennaRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
    }

    // Zone 3: Flickering Security Floodlight
    if (floodlightRef.current) {
      const flicker = Math.sin(t * 12.0) > 0.8 ? 0.3 : 1.0;
      floodlightRef.current.intensity = (activeZoneIndex === 2 ? 3.8 : 1.2) * flicker;
    }

    // Zone 4: Pulsating Spacetime Fissure
    if (riftFissureRef.current) {
      const s = 1.0 + Math.sin(t * 2.5) * 0.08;
      riftFissureRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* ═══════════════════════════════════════════════════
          ZONE 01: HAWKINS LAB SENSORY DEPRIVATION EEG STATION (z: -9)
          ═══════════════════════════════════════════════════ */}
      <group position={[activeZoneIndex === 0 ? 0 : -3.4, 0, -9]}>
        {/* Mainframe Rack Cabinet */}
        <mesh position={[0, 0, 0]} material={metalMat}>
          <boxGeometry args={[2.0, 2.4, 1.0]} />
        </mesh>

        {/* Oscilloscope EEG Screen (Eleven's brainwave monitor) */}
        <mesh position={[0, 0.45, 0.52]}>
          <planeGeometry args={[1.2, 0.7]} />
          <meshBasicMaterial ref={eegScreenRef} color="#00e5ff" transparent opacity={0.85} />
        </mesh>

        {/* Left Reel Spool */}
        <group position={[-0.45, -0.4, 0.53]} ref={reel1Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={metalMat}>
            <cylinderGeometry args={[0.32, 0.32, 0.04, 16]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Right Reel Spool */}
        <group position={[0.45, -0.4, 0.53]} ref={reel2Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={metalMat}>
            <cylinderGeometry args={[0.32, 0.32, 0.04, 16]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <pointLight color="#00e5ff" intensity={activeZoneIndex === 0 ? 2.5 : 0.8} distance={7} />
      </group>

      {/* ═══════════════════════════════════════════════════
          ZONE 02: DUSTIN'S CEREBRO RADIO & MILITARY TRANSCEIVER (z: -13.5)
          ═══════════════════════════════════════════════════ */}
      <group position={[activeZoneIndex === 1 ? 0 : 3.4, 0, -13.5]} ref={radioAntennaRef}>
        {/* Vintage Ham Radio Transceiver Box */}
        <mesh position={[0, -0.2, 0]} material={metalMat}>
          <boxGeometry args={[1.8, 1.2, 1.1]} />
        </mesh>

        {/* Frequency Dial Panel with glowing green tuner needle */}
        <mesh position={[0, -0.15, 0.56]}>
          <planeGeometry args={[1.2, 0.45]} />
          <meshBasicMaterial color="#00ff66" transparent opacity={0.7} />
        </mesh>

        {/* Telescoping Radio Antenna Mast */}
        <mesh position={[0.65, 1.1, -0.2]} material={metalMat}>
          <cylinderGeometry args={[0.03, 0.05, 2.0, 8]} />
        </mesh>

        {/* Glowing Vacuum Tube Pair */}
        <mesh position={[-0.4, 0.55, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 10]} />
          <meshStandardMaterial color="#00ffaa" emissive="#00ff66" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[-0.15, 0.55, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 10]} />
          <meshStandardMaterial color="#00ffaa" emissive="#00ff66" emissiveIntensity={1.2} />
        </mesh>

        <pointLight color="#00ff66" intensity={activeZoneIndex === 1 ? 2.5 : 0.8} distance={7} />
      </group>

      {/* ═══════════════════════════════════════════════════
          ZONE 03: HAWKINS LAB CHAIN-LINK SECURITY GATE & WARNING SIGN (z: -18)
          ═══════════════════════════════════════════════════ */}
      <group position={[activeZoneIndex === 2 ? 0 : -3.4, 0, -18]}>
        {/* Metal Fence Posts */}
        <mesh position={[-1.2, 0.5, 0]} material={metalMat}>
          <cylinderGeometry args={[0.06, 0.06, 3.2, 8]} />
        </mesh>
        <mesh position={[1.2, 0.5, 0]} material={metalMat}>
          <cylinderGeometry args={[0.06, 0.06, 3.2, 8]} />
        </mesh>

        {/* Chain-Link Wireframe Mesh Panel */}
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[2.4, 2.6]} />
          <meshBasicMaterial color="#3a4050" wireframe transparent opacity={0.65} />
        </mesh>

        {/* Yellow "RESTRICTED AREA: U.S. DEPT OF ENERGY" Warning Sign */}
        <mesh position={[0, 0.6, 0.05]} material={hazardMat}>
          <planeGeometry args={[1.3, 0.75]} />
        </mesh>

        {/* Overhead Halogen Security Spotlight */}
        <mesh position={[0, 2.1, 0.2]} material={metalMat}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
        </mesh>
        <pointLight
          ref={floodlightRef}
          position={[0, 2.0, 0.5]}
          color="#ff2233"
          intensity={2.5}
          distance={8}
        />
      </group>

      {/* ═══════════════════════════════════════════════════
          ZONE 04: THE ORGANIC SPACETIME RIFT FISSURE (z: -22.5)
          ═══════════════════════════════════════════════════ */}
      <group position={[activeZoneIndex === 3 ? 0 : 3.4, 0, -22.5]} ref={riftFissureRef}>
        {/* Corrupted wall tear rim */}
        <mesh>
          <torusGeometry args={[1.2, 0.15, 12, 32]} />
          <meshStandardMaterial
            color="#220408"
            emissive="#ff5500"
            emissiveIntensity={0.8}
            roughness={0.4}
          />
        </mesh>

        {/* Glowing Accretion Core */}
        <mesh>
          <circleGeometry args={[1.1, 24]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>

        {/* Hanging biohazard tendrils */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.01, 1.2, 6]} />
          <meshBasicMaterial color="#330206" />
        </mesh>

        <pointLight color="#ffaa00" intensity={activeZoneIndex === 3 ? 3.0 : 0.8} distance={8} />
      </group>
    </group>
  );
};

export default ChallengeProps;
