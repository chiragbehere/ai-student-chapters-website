// Minimal React Three Fiber integration example (not executed in the build environment).
import React, { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { createAnimator, makeParticleMaterial } from './codeCarnivalAnimations';
import layout from './scene_layout.json';
import forest from '../lighting/lighting_forest.json';

const BASE = '/CodeCarnival_3D_Assets/';           // where you host the folder
function Model({ file }) {
  const { scene } = useGLTF(BASE + 'models/' + file);
  const place = layout.placement[file] || { position: [0, 0, 0] };
  const anim = useMemo(() => createAnimator(scene), [scene]);
  useFrame(({ clock }) => anim.update(clock.getElapsedTime()));
  return <primitive object={scene} position={place.position} rotation-y={place.rotationY || 0} />;
}
export default function PortalScene() {
  return (
    <Canvas camera={{ position: layout.camera.start, fov: layout.camera.fov }} dpr={[1, 1.75]}>
      <color attach="background" args={[forest.background]} />
      <fogExp2 attach="fog" args={[forest.fog.color, forest.fog.density]} />
      <ambientLight color={forest.lights[0].color} intensity={forest.lights[0].intensity} />
      <pointLight color="#ff1a0a" intensity={45} distance={40} position={[0, 4.8, -15]} />
      <Suspense fallback={null}>
        {['environment/environment_ground.glb', 'environment/environment_dark_forest.glb', 'environment/environment_distant_forest.glb',
          'environment/environment_vines.glb', 'environment/environment_floating_debris.glb', 'portal/portal_main.glb',
          'portal/portal_ring.glb', 'portal/portal_cracks.glb', 'effects/energy_ribbons.glb'].map((f) => <Model key={f} file={f} />)}
      </Suspense>
    </Canvas>
  );
}
