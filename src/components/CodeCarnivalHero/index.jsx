// index.jsx
// Master Code Carnival 2.0 Opening Gate — Classified Government Dossier Experience
// Replaces the generic red portal with an authentic, weathered 1980s Hawkins Lab Investigation File (Reference 2)
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FastForward, ShieldAlert } from 'lucide-react';
import DossierDocument from './DossierDocument';
import DeskParaphernalia from './DeskParaphernalia';
import soundEngine from '../code-carnival/SoundEngine';
import './ClassifiedDossier.css';

export const CodeCarnivalHero = ({
  onEnterComplete,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Initialize audio preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('codecarnival_sound');
      if (stored === 'true') {
        soundEngine.init();
        soundEngine.startAtmosphericDrone();
        setIsPlayingAudio(true);
      }
    } catch {}
  }, []);

  // Handle Sound Toggle (Vintage Archival Control)
  const handleToggleSound = useCallback(() => {
    soundEngine.init();
    const active = soundEngine.toggleMute();
    setIsPlayingAudio(active);
    try {
      localStorage.setItem('codecarnival_sound', active ? 'true' : 'false');
    } catch {}
    if (active) {
      soundEngine.startAtmosphericDrone();
    }
  }, []);

  // Handle Opening the Dossier (Primary Action)
  const handleOpenClassifiedFile = useCallback(() => {
    setIsOpening(true);

    // Play unseal / impact audio cue
    try {
      soundEngine.playVaultUnseal();
    } catch {}

    // Subtle paper opening delay for physical feedback
    setTimeout(() => {
      try {
        sessionStorage.setItem('codecarnival_intro_seen', 'true');
      } catch {}
      if (onEnterComplete) {
        onEnterComplete();
      }
    }, 650);
  }, [onEnterComplete]);

  // Handle Skip to Event Directly
  const handleSkipIntro = useCallback(() => {
    try {
      sessionStorage.setItem('codecarnival_intro_seen', 'true');
    } catch {}
    if (onEnterComplete) {
      onEnterComplete();
    }
  }, [onEnterComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
        transition={{ duration: 0.6 }}
        className="dossier-desk-env select-none"
      >
        {/* ── Vintage Archival Controls Header (Top Bar) ── */}
        <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-auto">
          {/* Top-Left Hawkins Lab Archival Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xs border border-[#87452e]/50 bg-[#1e1713]/90 backdrop-blur-md text-[10px] sm:text-xs font-mono text-[#d6c29f] shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#a52a24] animate-pulse" />
            <ShieldAlert size={12} className="text-[#a52a24]" />
            <span className="font-bold tracking-wider">HAWKINS LAB ARCHIVE</span>
            <span className="hidden sm:inline text-neutral-500">//</span>
            <span className="hidden sm:inline text-[#a89574]">DISPATCH FILE #CC20-0127</span>
          </div>

          {/* Top-Right Sound & Skip Controls */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            {/* Vintage Audio Toggle Button */}
            <button
              onClick={handleToggleSound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs border text-[11px] tracking-wider transition-all duration-300 cursor-pointer shadow-md ${
                isPlayingAudio
                  ? 'border-[#a52a24] text-[#f2e7d0] bg-[#a52a24]/30 shadow-[0_0_12px_rgba(165,42,36,0.4)]'
                  : 'border-[#75664f]/50 text-[#d6c29f]/70 bg-[#1e1713]/80 hover:text-white hover:border-[#b9a582]'
              }`}
              title={isPlayingAudio ? 'Mute Ambience' : 'Enable Archival Sound'}
              aria-label="Toggle Sound"
            >
              {isPlayingAudio ? (
                <Volume2 size={13} className="text-[#a52a24]" />
              ) : (
                <VolumeX size={13} />
              )}
              <span className="hidden sm:inline">
                {isPlayingAudio ? 'SOUND: ON' : 'SOUND: OFF'}
              </span>
            </button>

            {/* Skip Option */}
            <button
              onClick={handleSkipIntro}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs border border-[#75664f]/50 bg-[#1e1713]/80 text-[#d6c29f]/80 hover:text-white hover:border-[#b9a582] text-[11px] font-mono tracking-wider transition-all cursor-pointer shadow-md"
              title="Skip Dossier and View Event Details"
              aria-label="Skip to Event"
            >
              <span>SKIP</span>
              <FastForward size={12} className="text-[#a52a24]" />
            </button>
          </div>
        </header>

        {/* ── Central Dossier & Desk Composition ── */}
        <div className="relative my-auto w-full max-w-4xl py-12 px-2 sm:px-4 flex items-center justify-center">
          {/* Authentic Desk Artifacts (Polaroid, Audio Cassette, Paperclips, Notes) */}
          <DeskParaphernalia />

          {/* The Physical Classified Dossier Paper (Reference 2) */}
          <DossierDocument
            onOpenClassifiedFile={handleOpenClassifiedFile}
            isOpening={isOpening}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CodeCarnivalHero;
