// AlphabetLightsWall.tsx
// 100% Iconic Stranger Things Element: The Byers' Living Room 3D Alphabet Light Wall
// Features: Vintage wallpaper with hand-painted black stencil letters A-Z, hanging wires, and 26 individual incandescent bulbs that spell words
import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const ALPHABET_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
  ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
];

const LIGHT_COLORS = [
  '#e50914', '#ff8c00', '#ffd700', '#00e676', '#00b0ff', '#d500f9', '#ff4081', '#00e5ff',
];

const SPELL_SEQUENCES = ['CODECARNIVAL', 'RUN', 'UPSIDEDOWN'];

interface AlphabetLightsWallProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

// Procedural texture for the vintage striped wallpaper with hand-painted black letters A through Z
function createWallAlphabetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Vintage weathered cream/sepia wallpaper base
  ctx.fillStyle = '#221a18';
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle vertical wallpaper stripes
  ctx.fillStyle = '#1c1412';
  for (let x = 0; x < 1024; x += 32) {
    ctx.fillRect(x, 0, 16, 512);
  }

  // Weathering, grunge, and moisture stains
  const grad = ctx.createRadialGradient(512, 256, 100, 512, 256, 512);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Hand-painted black letters (Joyce Byers style)
  ctx.fillStyle = '#060405';
  ctx.font = 'bold 54px "Libre Baskerville", "Courier New", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ALPHABET_ROWS.forEach((row, rowIdx) => {
    const yNorm = 0.28 + rowIdx * 0.28;
    const canvasY = yNorm * 512;
    const rowStep = 1024 / (row.length + 1);

    row.forEach((char, colIdx) => {
      const canvasX = (colIdx + 1) * rowStep;
      // Rough hand-painted look
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8;
      ctx.fillText(char, canvasX, canvasY);
    });
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const AlphabetLightsWall: React.FC<AlphabetLightsWallProps> = ({
  position = [0, 0.6, 2.0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}) => {
  const [litChar, setLitChar] = useState<string | null>(null);
  const currentWordIdx = useRef(0);
  const charIdx = useRef(0);

  // Sequencer to spell words letter by letter
  useEffect(() => {
    const interval = setInterval(() => {
      const word = SPELL_SEQUENCES[currentWordIdx.current];
      if (charIdx.current < word.length) {
        setLitChar(word[charIdx.current]);
        charIdx.current++;
      } else {
        setLitChar(null);
        charIdx.current = 0;
        currentWordIdx.current = (currentWordIdx.current + 1) % SPELL_SEQUENCES.length;
      }
    }, 480);

    return () => clearInterval(interval);
  }, []);

  const wallTexture = useMemo(() => createWallAlphabetTexture(), []);

  // Compute 3D bulb positions corresponding to the painted letters
  const { letterData, wireCurves } = useMemo(() => {
    const letters: Array<{
      char: string;
      bulbPos: [number, number, number];
      color: string;
      colorIndex: number;
    }> = [];

    const curves: THREE.CatmullRomCurve3[] = [];
    let colorCounter = 0;

    ALPHABET_ROWS.forEach((row, rowIdx) => {
      const y = 0.95 - rowIdx * 0.92;
      const rowWidth = 6.8;
      const step = rowWidth / (row.length + 1);
      const wirePoints: THREE.Vector3[] = [];

      row.forEach((char, colIdx) => {
        const x = -rowWidth / 2 + (colIdx + 1) * step;
        const color = LIGHT_COLORS[colorCounter % LIGHT_COLORS.length];
        const sag = Math.sin(((colIdx + 1) / (row.length + 1)) * Math.PI) * 0.12;

        letters.push({
          char,
          bulbPos: [x, y + 0.14 - sag, 0.14],
          color,
          colorIndex: colorCounter,
        });

        wirePoints.push(new THREE.Vector3(x, y + 0.22 - sag, 0.1));
        colorCounter++;
      });

      curves.push(new THREE.CatmullRomCurve3(wirePoints));
    });

    return { letterData: letters, wireCurves: curves };
  }, []);

  const bulbGeom = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.085, 12, 12);
    geo.scale(1.0, 1.45, 1.0);
    return geo;
  }, []);

  const socketGeom = useMemo(() => {
    return new THREE.CylinderGeometry(0.038, 0.038, 0.07, 8);
  }, []);

  const socketMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#041608' }), []);
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#091209' }), []);

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.88,
      metalness: 0.08,
    });
  }, [wallTexture]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. Byers' Wallpaper Wall Board with painted letters */}
      <mesh material={wallMaterial} position={[0, 0.05, -0.02]}>
        <planeGeometry args={[7.2, 3.4]} />
      </mesh>

      {/* 2. Hanging Black Wire Cable per Row */}
      {wireCurves.map((curve, idx) => (
        <mesh key={idx} material={wireMat}>
          <tubeGeometry args={[curve, 32, 0.016, 6, false]} />
        </mesh>
      ))}

      {/* 3. The 26 Alphabet Bulbs & Letters */}
      {letterData.map((item) => {
        const isSpelled = litChar === item.char;

        return (
          <group key={item.char}>
            {/* Hanging Socket */}
            <mesh
              geometry={socketGeom}
              material={socketMat}
              position={[item.bulbPos[0], item.bulbPos[1] + 0.05, item.bulbPos[2]]}
            />

            {/* Glowing Teardrop Bulb */}
            <mesh geometry={bulbGeom} position={item.bulbPos}>
              <meshStandardMaterial
                color={item.color}
                emissive={item.color}
                emissiveIntensity={isSpelled ? 4.2 : 0.85}
                roughness={0.15}
              />
            </mesh>

            {/* Radiant point light flash when this letter is being communicated */}
            {isSpelled && (
              <pointLight
                position={[item.bulbPos[0], item.bulbPos[1], item.bulbPos[2] + 0.25]}
                color={item.color}
                intensity={3.8}
                distance={5.0}
                decay={2}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};

export default AlphabetLightsWall;
