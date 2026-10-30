// FinalGatePortal.tsx
// Chapter 06: The Final Dimensional Singularity Portal (z: -52)
// Flares with intense energy, lightning arcs, and accretion rays as the user approaches the registration gateway
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FinalGatePortalProps {
  scrollProgress: number; // 0 to 1
}

export const FinalGatePortal: React.FC<FinalGatePortalProps> = ({ scrollProgress }) => {
  const portalMeshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);

  const activation = THREE.MathUtils.clamp((scrollProgress - 0.82) / 0.16, 0.0, 1.0);

  const portalMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uActivation: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uActivation;
        varying vec2 vUv;

        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center);
          float angle = atan(center.y, center.x);

          float spiral = angle * 3.0 - dist * 12.0 + uTime * 4.0;
          float intensity = sin(spiral) * 0.5 + 0.5;

          vec3 coreCol = mix(vec3(0.9, 0.05, 0.1), vec3(1.0, 0.8, 0.9), uActivation * 0.6);
          vec3 darkCol = vec3(0.04, 0.01, 0.06);

          vec3 col = mix(coreCol, darkCol, smoothstep(0.0, 0.48, dist));
          float alpha = smoothstep(0.5, 0.25, dist) * (0.4 + uActivation * 0.6);

          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    portalMat.uniforms.uTime.value = t;
    portalMat.uniforms.uActivation.value = activation;

    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.8;
      const s = 1.0 + activation * 0.8 + Math.sin(t * 3.0) * 0.05;
      ringRef.current.scale.set(s, s, s);
    }

    if (flashLightRef.current) {
      flashLightRef.current.intensity = (1.5 + activation * 10.0) * (0.85 + 0.15 * Math.sin(t * 12.0));
    }
  });

  return (
    <group position={[0, 0.5, -52]}>
      {/* 1. Vortex Event Horizon Disc */}
      <mesh ref={portalMeshRef} material={portalMat}>
        <circleGeometry args={[2.8, 48]} />
      </mesh>

      {/* 2. Rotating Organic Perimeter Accretion Ring */}
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[2.75, 0.18, 16, 48]} />
          <meshStandardMaterial
            color="#2a0409"
            emissive="#ff1122"
            emissiveIntensity={0.8 + activation * 1.5}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      </group>

      {/* 3. Blinding Flare Point Light */}
      <pointLight
        ref={flashLightRef}
        position={[0, 0, 1.2]}
        color="#ff2233"
        intensity={2.0}
        distance={25}
        decay={1.8}
      />
    </group>
  );
};

export default FinalGatePortal;
