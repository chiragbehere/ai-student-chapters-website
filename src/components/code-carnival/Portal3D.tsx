// Portal3D.tsx
// Procedural, organic 3D rift inspired by the visual language of the Upside Down
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Portal3DProps {
  intensity?: number;
  entering?: boolean;
  mousePos?: { x: number; y: number };
}

// Custom shader for the swirling dimensional rift core
const PortalShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 1.0 },
    uEntering: { value: 0.0 },
    uColorCore: { value: new THREE.Color('#ff0a1a') },
    uColorMid: { value: new THREE.Color('#8b0000') },
    uColorDark: { value: new THREE.Color('#030105') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uIntensity;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      vec3 pos = position;
      
      // Organic undulating distortion on portal border
      float distFromCenter = length(uv - vec2(0.5));
      float noise = snoise(uv * 4.0 + vec2(uTime * 0.4, uTime * 0.3));
      
      // Deform outward at edges, deep inward at center
      pos.z += sin(distFromCenter * 6.28 - uTime * 2.0) * 0.2 * uIntensity;
      pos.z += noise * 0.3 * smoothstep(0.1, 0.5, distFromCenter);

      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uIntensity;
    uniform float uEntering;
    uniform vec3 uColorCore;
    uniform vec3 uColorMid;
    uniform vec3 uColorDark;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

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
      
      // Organic jagged rift boundary
      float angle = atan(center.y, center.x);
      float organicWobble = noise(vec2(angle * 2.5 + uTime * 0.6, dist * 3.0)) * 0.14
                          + noise(vec2(angle * 5.0 - uTime * 0.8, dist * 6.0)) * 0.06;
      float adjustedDist = dist + organicWobble;

      // Unstable portal pulse
      float pulse = sin(uTime * 2.5) * 0.08 + cos(uTime * 4.0) * 0.04;
      float radius = 0.46 + pulse * uIntensity;

      // Fade out outside the rift
      if (adjustedDist > radius) {
        discard;
      }

      // Deep vortex gradient
      float vortexSpeed = uTime * (1.2 + uEntering * 3.0);
      float swirl = sin(dist * 18.0 - vortexSpeed + angle * 3.0);
      
      // Layered color blending: Red hot center -> dark crimson -> void abyss edge
      float coreFactor = smoothstep(0.4, 0.0, adjustedDist);
      float edgeFactor = smoothstep(radius - 0.08, radius, adjustedDist);
      
      vec3 col = mix(uColorMid, uColorCore, coreFactor + swirl * 0.15 * uIntensity);
      col = mix(col, uColorDark, edgeFactor);

      // Energy lightning threads
      float energyNoise = abs(noise(vec2(angle * 8.0, adjustedDist * 20.0 - uTime * 4.0)) - 0.5);
      float lightning = smoothstep(0.08, 0.0, energyNoise) * (1.0 - adjustedDist);
      col += vec3(1.0, 0.3, 0.2) * lightning * 1.5 * uIntensity;

      // Entering bloom burst
      col += vec3(0.8, 0.1, 0.05) * (uEntering * 2.0);

      // Transparency at the outermost rim for smooth organic integration
      float alpha = smoothstep(radius, radius - 0.04, adjustedDist);

      gl_FragColor = vec4(col, alpha);
    }
  `,
};

export const Portal3D: React.FC<Portal3DProps> = ({ intensity = 1.0, entering = false, mousePos = { x: 0, y: 0 } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Memoize shader uniforms
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uEntering: { value: 0 },
      uColorCore: { value: new THREE.Color('#ff2222') },
      uColorMid: { value: new THREE.Color('#8b0000') },
      uColorDark: { value: new THREE.Color('#050005') },
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uIntensity.value = intensity;
      materialRef.current.uniforms.uEntering.value = THREE.MathUtils.damp(
        materialRef.current.uniforms.uEntering.value,
        entering ? 1.0 : 0.0,
        4,
        delta
      );
    }

    if (meshRef.current) {
      // Subtle organic sway + mouse parallax reaction
      meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      meshRef.current.rotation.x = mousePos.y * 0.12;
      meshRef.current.rotation.y = mousePos.x * 0.15;

      // Pulsing scale
      const scaleBase = entering ? 3.5 : 1.0 + Math.sin(time * 1.5) * 0.03 * intensity;
      meshRef.current.scale.lerp(new THREE.Vector3(scaleBase, scaleBase, scaleBase), delta * 3);
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -time * 0.2;
      const ringScale = entering ? 3.6 : 1.08 + Math.sin(time * 1.2) * 0.04;
      outerRingRef.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), delta * 3);
    }

    if (pointLightRef.current) {
      // Flickering red/crimson light
      pointLightRef.current.intensity = (2.5 + Math.sin(time * 8.0) * 0.8 + (entering ? 8.0 : 0.0)) * intensity;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Outer organic dark perimeter rift */}
      <mesh ref={outerRingRef} position={[0, 0, -0.05]}>
        <ringGeometry args={[1.8, 2.6, 48]} />
        <meshBasicMaterial
          color="#040106"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Rift with organic displacement shader */}
      <mesh ref={meshRef}>
        <planeGeometry args={[4.2, 4.2, 48, 48]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={PortalShader.vertexShader}
          fragmentShader={PortalShader.fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volumetric Crimson Light cast into environment */}
      <pointLight
        ref={pointLightRef}
        color="#ff1a26"
        distance={14}
        decay={2}
        position={[0, 0, 0.8]}
      />
      {/* Back ambient blue/purple shadow light */}
      <pointLight
        color="#150a2e"
        intensity={1.2}
        distance={10}
        position={[0, 0, -1]}
      />
    </group>
  );
};
export default Portal3D;
