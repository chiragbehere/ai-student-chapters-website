// ForestTerrain.tsx
// Corrupted forest floor, crawling surface tendrils, and dynamic drifting ground fog plane
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ForestTerrainProps {
  isMobile?: boolean;
}

// Custom shader for dynamic volumetric drifting ground mist
const GroundMistShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorNear: { value: new THREE.Color('#38080d') },
    uColorFar: { value: new THREE.Color('#03050d') },
    uOpacity: { value: 0.45 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorNear;
    uniform vec3 uColorFar;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    // Fast 2D simplex noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
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
      // Layered drifting noise for supernatural creeping fog
      vec2 uv1 = vUv * 6.0 + vec2(uTime * 0.06, uTime * 0.02);
      vec2 uv2 = vUv * 12.0 - vec2(uTime * 0.04, uTime * 0.07);
      float n1 = snoise(uv1);
      float n2 = snoise(uv2);
      float fogDensity = clamp(n1 * 0.6 + n2 * 0.4 + 0.5, 0.0, 1.0);

      // Edge fade
      float edgeX = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
      float edgeY = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
      float alpha = fogDensity * edgeX * edgeY * uOpacity;

      // Color shift: reddish near portal (y near center), midnight dark at bounds
      float distToCenter = length(vWorldPosition.xz - vec2(0.0, -2.0));
      vec3 col = mix(uColorNear, uColorFar, clamp(distToCenter / 15.0, 0.0, 1.0));

      gl_FragColor = vec4(col, alpha);
    }
  `,
};

export const ForestTerrain: React.FC<ForestTerrainProps> = ({ isMobile = false }) => {
  const mistMatRef = useRef<THREE.ShaderMaterial>(null);

  // Uneven forest ground geometry
  const groundGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(36, 48, isMobile ? 24 : 48, isMobile ? 32 : 64);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Subtle bumps and ruts in forest path
      const pathMask = 1.0 - Math.exp(-Math.pow(x / 3.0, 2)); // flatter in middle path
      const bump = Math.sin(x * 0.4) * Math.cos(z * 0.3) * 0.35 * pathMask;
      pos.setY(i, bump - 1.85);
    }
    geo.computeVertexNormals();
    return geo;
  }, [isMobile]);

  // Creeping ground tendrils crawling toward portal
  const tendrilCurves = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    const count = isMobile ? 6 : 12;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const startDist = 8 + (i % 3) * 2;
      const p1 = new THREE.Vector3(Math.cos(angle) * startDist, -1.82, Math.sin(angle) * startDist - 2);
      const p2 = new THREE.Vector3(
        Math.cos(angle + 0.3) * (startDist * 0.6),
        -1.83 + Math.sin(i) * 0.05,
        Math.sin(angle + 0.3) * (startDist * 0.6) - 2
      );
      const p3 = new THREE.Vector3(
        Math.cos(angle + 0.1) * (startDist * 0.25),
        -1.84,
        Math.sin(angle + 0.1) * (startDist * 0.25) - 2
      );
      const p4 = new THREE.Vector3(0, -1.85, -2.0);
      curves.push(new THREE.CatmullRomCurve3([p1, p2, p3, p4]));
    }
    return curves;
  }, [isMobile]);

  // Ground material with dark muddy/charred tone and red specular reflection
  const groundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#060810'),
      roughness: 0.92,
      metalness: 0.15,
      flatShading: true,
    });
  }, []);

  const tendrilMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#140407'),
      roughness: 0.75,
      metalness: 0.3,
    });
  }, []);

  const mistShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(GroundMistShader.uniforms),
      vertexShader: GroundMistShader.vertexShader,
      fragmentShader: GroundMistShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  useFrame((state) => {
    if (mistMatRef.current) {
      mistMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group>
      {/* 1. Main Uneven Forest Floor */}
      <mesh geometry={groundGeometry} material={groundMaterial} receiveShadow={false} />

      {/* 2. Crawling Dimensional Tendrils */}
      {tendrilCurves.map((curve, idx) => {
        const geo = new THREE.TubeGeometry(curve, 16, 0.08 * (1 - (idx % 2) * 0.3), 5, false);
        return <mesh key={idx} geometry={geo} material={tendrilMaterial} />;
      })}

      {/* 3. Floating Drifting Volumetric Ground Mist */}
      <mesh
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[32, 40, 1, 1]} />
        <primitive object={mistShaderMaterial} ref={mistMatRef} attach="material" />
      </mesh>
    </group>
  );
};

export default ForestTerrain;
