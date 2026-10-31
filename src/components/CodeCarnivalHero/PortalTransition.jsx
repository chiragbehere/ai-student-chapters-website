// PortalTransition.jsx
// Uses graphics/transition_portal.png (opaque outside, transparent hole) scaled from the center to wipe into the next section
import React from 'react';
import { motion } from 'framer-motion';

const BASE = '/CodeCarnival_3D_Assets/';

export function PortalTransition({ progress = 0, isTransitioning = false }) {
  if (!isTransitioning && progress <= 0) return null;

  // Zoom scale: from scale 1.0 up to 14.0 so the transparent center expands to reveal the underlying page
  const scale = 1.0 + progress * 13.0;
  const opacity = Math.min(1.0, progress * 2.5);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <motion.div
        className="w-[100vw] h-[100vh] bg-center bg-no-repeat bg-contain origin-center will-change-transform"
        style={{
          backgroundImage: `url(${BASE}graphics/transition_portal.png)`,
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      />
      {/* Red dimensional flash at the apex of the warp */}
      {progress > 0.6 && (
        <div
          className="fixed inset-0 bg-[#ff1a0a] mix-blend-screen pointer-events-none transition-opacity duration-150"
          style={{
            opacity: Math.sin((progress - 0.6) * Math.PI * 2.5) * 0.75,
          }}
        />
      )}
    </div>
  );
}

export default PortalTransition;
