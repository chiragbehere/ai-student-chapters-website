// Overlays.jsx
// DOM overlays that sit above the canvas:
// - vignette.png / vignette.webp
// - film_grain.png (animated by shifting background-position, disabled if prefers-reduced-motion)
// - red_glow.png
// - lightning_flash_01..03.png (opacity driven by LightningController)
import React, { useEffect, useRef, useState } from 'react';

const BASE = '/CodeCarnival_3D_Assets/';

export function Overlays({ flashOpacity = 0, flashIndex = 1, reducedMotion = false }) {
  const grainRef = useRef(null);
  const [useWebp, setUseWebp] = useState(true);

  // Test webp support
  useEffect(() => {
    const img = new Image();
    img.onload = () => setUseWebp(true);
    img.onerror = () => setUseWebp(false);
    img.src = `${BASE}graphics/film_grain.webp`;
  }, []);

  // Animate film grain by shifting background position
  useEffect(() => {
    if (reducedMotion) return;
    let frameId;
    let step = 0;
    const animate = () => {
      step = (step + 1) % 10;
      if (grainRef.current) {
        const x = (step * 37) % 256;
        const y = (step * 53) % 256;
        grainRef.current.style.backgroundPosition = `${x}px ${y}px`;
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion]);

  const flashSrc = `${BASE}textures/overlays/lightning_flash_0${Math.min(3, Math.max(1, flashIndex))}.${useWebp ? 'webp' : 'png'}`;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Tiled Film Grain */}
      <div
        ref={grainRef}
        className="absolute inset-0 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage: `url(${BASE}graphics/film_grain.${useWebp ? 'webp' : 'png'})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* 2. Red Supernatural Radial Ambient Glow */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-60 mix-blend-color-dodge transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${BASE}graphics/red_glow.png)`,
        }}
      />

      {/* 3. Outer Edge Vignette */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-85 mix-blend-multiply"
        style={{
          backgroundImage: `url(${BASE}graphics/vignette.${useWebp ? 'webp' : 'png'})`,
        }}
      />

      {/* 4. Full-screen Lightning Flash (Driven by LightningController) */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover mix-blend-screen transition-opacity duration-75"
        style={{
          backgroundImage: `url(${flashSrc})`,
          opacity: reducedMotion ? 0 : flashOpacity,
        }}
      />
    </div>
  );
}

export default Overlays;
