// CursorParticle.jsx
// Smooth mouse cursor follower with a short ethereal trail using graphics/cursor_particle.png
// Uses requestAnimationFrame and direct transforms to avoid layout thrashing
import React, { useEffect, useRef } from 'react';

const BASE = '/CodeCarnival_3D_Assets/';

export function CursorParticle({ enabled = true }) {
  const containerRef = useRef(null);
  const trailDots = useRef([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(
    Array.from({ length: 6 }, () => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    if (!enabled) return;

    // Detect touch-only device
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId;
    const updateTrail = () => {
      const { x: targetX, y: targetY } = mousePos.current;

      // Update trail positions with smooth easing
      for (let i = 0; i < trailPositions.current.length; i++) {
        const prev = i === 0 ? { x: targetX, y: targetY } : trailPositions.current[i - 1];
        const cur = trailPositions.current[i];
        const factor = 0.45 - i * 0.05;

        cur.x += (prev.x - cur.x) * factor;
        cur.y += (prev.y - cur.y) * factor;

        const dot = trailDots.current[i];
        if (dot) {
          const scale = 1.0 - i * 0.14;
          const opacity = (1.0 - i * 0.16) * 0.85;
          dot.style.transform = `translate3d(${cur.x - 16}px, ${cur.y - 16}px, 0) scale(${scale})`;
          dot.style.opacity = opacity;
        }
      }

      animId = requestAnimationFrame(updateTrail);
    };

    animId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailDots.current[i] = el)}
          className="absolute top-0 left-0 w-8 h-8 pointer-events-none will-change-transform mix-blend-screen"
          style={{
            backgroundImage: `url(${BASE}graphics/cursor_particle.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export default CursorParticle;
