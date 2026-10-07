import React from 'react';
import HeroCanvas3D from './HeroCanvas3D';

interface BgAtmosphereProps {
  showCanvas?: boolean;
}

export const BgAtmosphere: React.FC<BgAtmosphereProps> = ({ showCanvas = true }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070c]">
      {/* 3D Neural Nodes Layer */}
      {showCanvas && <HeroCanvas3D />}

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30" />

      {/* Atmospheric Top Glow - Electric Cyan */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-radial-gradient opacity-70 blur-[100px] animate-pulse-glow" />

      {/* Atmospheric Right Glow - AI Violet */}
      <div className="absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(157,78,221,0.18)_0%,rgba(5,7,12,0)_70%)] blur-[120px]" />

      {/* Atmospheric Bottom Glow - Soft Blue */}
      <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,rgba(5,7,12,0)_70%)] blur-[110px]" />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,12,0.7)_100%)]" />
    </div>
  );
};

export default BgAtmosphere;
