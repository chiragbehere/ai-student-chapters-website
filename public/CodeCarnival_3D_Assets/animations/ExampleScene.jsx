// ExampleScene.jsx - React Three Fiber integration sketch for the Code Carnival hero scene.
// Requires: three, @react-three/fiber, @react-three/drei  (optionally @react-three/postprocessing for Bloom).
// NOTE: this file was written offline and has NOT been compiled or run - treat it as a starting point.
import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { playClips, FloatingProps, PortalPulse, LightningController, makeParticleMaterial, setPointScale } from './codecarnival-animations.js';

const BASE = '/CodeCarnival_3D_Assets/';           // copy the folder into your /public directory
const layout = await (await fetch(BASE + 'models/scene_layout.json')).json();

function Placed({ file, position, yaw, scale, onReady }) {
  const gltf = useGLTF(BASE + file);               // textures resolve relative to the .glb (../../textures/...)
  const root = useMemo(() => gltf.scene.clone(true), [gltf]);
  const mixer = useRef();
  useEffect(() => {
    if (gltf.animations.length) mixer.current = playClips(THREE, gltf, root);
    onReady && onReady(root, gltf);
  }, []);
  useFrame((_, dt) => mixer.current && mixer.current.update(dt));
  return <primitive object={root} position={position} rotation={[0, yaw, 0]} scale={scale} />;
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: layout.camera.position, fov: layout.camera.fov_y_degrees, near: 0.1, far: 300 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
      <color attach="background" args={['#0a0510']} />
      <fogExp2 attach="fog" args={['#120610', 0.018]} />
      <ambientLight intensity={0.45} color="#1a1530" />
      <directionalLight position={[-14, 28, 18]} intensity={0.9} color="#6f86d6" />
      <pointLight position={[0, 4.9, -8]} intensity={40} distance={40} color="#ff2a14" />
      {layout.placements.map((p, i) => (
        <Placed key={i} file={p.file} position={p.position} yaw={p.yaw_radians} scale={p.scale} />
      ))}
    </Canvas>
  );
}
