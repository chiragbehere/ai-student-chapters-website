// EventCard3D.tsx
// 3D physical-looking dimensional card with smooth spring tilt and red edge illumination
import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface EventCard3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  depth?: number;
  highlightBorder?: boolean;
}

export const EventCard3D: React.FC<EventCard3DProps> = ({
  children,
  className = '',
  glowColor = '#e50914',
  highlightBorder = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for realistic physics
  const springConfig = { damping: 20, stiffness: 200 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Rotation max ±6 degrees
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  // Dynamic shine reflection position
  const shineX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const shineY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(relativeX);
      y.set(relativeY);
    },
    [x, y]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: '1200px' }}
      className="relative w-full group"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1.0,
          z: isHovered ? 20 : 0,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative overflow-hidden rounded-sm transition-shadow duration-500 ${className}`}
      >
        {/* Card backdrop - dark glassmorphism */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            background: 'linear-gradient(145deg, rgba(16, 18, 30, 0.85) 0%, rgba(8, 9, 18, 0.92) 100%)',
            backdropFilter: 'blur(16px)',
            border: highlightBorder
              ? '1px solid rgba(255, 215, 0, 0.35)'
              : isHovered
              ? `1px solid ${glowColor}`
              : '1px solid rgba(229, 9, 20, 0.2)',
            boxShadow: isHovered
              ? `0 12px 36px rgba(0, 0, 0, 0.8), 0 0 24px ${glowColor}33, inset 0 0 15px ${glowColor}15`
              : '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(229, 9, 20, 0.05)',
          }}
        />

        {/* Traveling edge light effect */}
        {isHovered && (
          <motion.div
            className="absolute -inset-[1px] pointer-events-none rounded-sm"
            style={{
              background: `radial-gradient(400px circle at ${shineX} ${shineY}, ${glowColor}55, transparent 60%)`,
            }}
          />
        )}

        {/* Content elevated in 3D space */}
        <div
          className="relative z-10 p-6"
          style={{ transform: 'translateZ(25px)' }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default EventCard3D;
