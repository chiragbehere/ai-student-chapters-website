// SoundToggle.jsx
// Controls AudioManager: OFF by default. Audio starts only after user clicks.
// Choice persisted in localStorage inside try/catch.
import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundToggle({ audioManager, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(() => audioManager?.enabled || false);

  useEffect(() => {
    if (!audioManager) return;
    setIsPlaying(audioManager.enabled);
    audioManager.onStateChange = (state) => {
      setIsPlaying(state);
    };
  }, [audioManager]);

  const handleToggle = useCallback(() => {
    if (!audioManager) return;
    const newState = audioManager.toggle();
    setIsPlaying(newState);
  }, [audioManager]);

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e50914] ${
        isPlaying
          ? 'border-red-600 bg-red-950/40 text-red-400 shadow-[0_0_15px_rgba(229,9,20,0.4)]'
          : 'border-[#e8d5b5]/30 bg-black/50 text-[#e8d5b5]/60 hover:text-white hover:border-[#e8d5b5]/60'
      } ${className}`}
      title={isPlaying ? 'Mute Supernatural Audio' : 'Enable Atmospheric Audio'}
      aria-label={isPlaying ? 'Mute Audio' : 'Enable Audio'}
    >
      {isPlaying ? <Volume2 size={14} className="text-[#e50914] animate-pulse" /> : <VolumeX size={14} />}
      <span className="hidden sm:inline">{isPlaying ? 'SOUND ON' : 'ENABLE SOUND'}</span>
    </button>
  );
}

export default SoundToggle;

