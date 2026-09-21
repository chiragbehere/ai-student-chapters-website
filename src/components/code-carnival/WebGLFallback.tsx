// WebGLFallback.tsx
// Seamless high-fidelity CSS and 2D Canvas fallback when WebGL is unavailable or reduced motion is enabled
import React, { useEffect, useRef } from 'react';

interface WebGLFallbackProps {
  intensity?: number;
  entering?: boolean;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ intensity = 1.0, entering = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Spore particles
    const particleCount = entering ? 120 : 50;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      isRed: Math.random() > 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY * (entering ? 4 : 1);
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isRed
          ? `rgba(229, 9, 20, ${p.opacity})`
          : `rgba(200, 210, 230, ${p.opacity * 0.7})`;
        ctx.shadowBlur = p.isRed ? 8 : 4;
        ctx.shadowColor = p.isRed ? '#e50914' : '#60a5fa';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [entering]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#04060f]">
      {/* Volumetric background gradients */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: entering
            ? 'radial-gradient(circle at 50% 50%, rgba(180, 10, 20, 0.4) 0%, rgba(5, 2, 8, 0.95) 75%)'
            : 'radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.25) 0%, rgba(8, 12, 28, 0.8) 50%, #03040a 100%)',
        }}
      />

      {/* SVG Organic Dimensional Rift */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[460px] sm:w-[480px] sm:h-[620px] transition-transform duration-1000 ${
          entering ? 'scale-150 opacity-90' : 'scale-100 opacity-70'
        }`}
      >
        <svg viewBox="0 0 400 500" className="w-full h-full filter drop-shadow-[0_0_50px_rgba(229,9,20,0.8)]">
          <defs>
            <radialGradient id="portalGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff2a3b" stopOpacity="1" />
              <stop offset="45%" stopColor="#8b0000" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#150205" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <filter id="riftNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="24" />
            </filter>
          </defs>

          {/* Core glow */}
          <ellipse
            cx="200"
            cy="250"
            rx="140"
            ry="200"
            fill="url(#portalGrad)"
            filter="url(#riftNoise)"
            className="animate-pulse"
            style={{ animationDuration: `${2.5 / intensity}s` }}
          />
        </svg>
      </div>

      {/* 2D Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default WebGLFallback;
