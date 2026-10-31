// DossierDocument.jsx
// Authentic 1980s Hawkins Lab Classified Government Document
// Replicates Reference 2 with 100% fidelity, vintage typography, rubber stamps, and physical paper details
import React from 'react';
import { motion } from 'framer-motion';
import { Folder, ChevronRight, AlertOctagon } from 'lucide-react';

export const DossierDocument = ({
  onOpenClassifiedFile,
  isOpening = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`dossier-sheet relative w-full max-w-4xl mx-auto rounded-xs p-6 sm:p-10 md:p-12 select-none ${
        isOpening ? 'pointer-events-none' : ''
      }`}
    >
      {/* ── Visual Paper Details: Creases & Coffee Ring Stains ── */}
      <div className="dossier-crease-h top-1/3" />
      <div className="dossier-crease-h top-2/3" />
      <div className="dossier-crease-v left-1/2" />
      
      {/* Realistic Coffee Mug Ring Stain (Matching Reference 2 upper left-center) */}
      <div 
        className="coffee-ring w-28 h-28 sm:w-36 sm:h-36 -top-4 left-1/4 opacity-75"
        style={{ transform: 'rotate(25deg)' }}
      />
      <div 
        className="coffee-ring w-20 h-20 -bottom-6 right-1/4 opacity-40" 
      />

      {/* ── Document Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#b9a582]/70 pb-4 mb-4 text-[10px] sm:text-xs font-mono text-[#514536]">
        {/* Top-Left Unit Marker */}
        <div>
          <div className="font-['Special_Elite'] font-bold tracking-widest text-[#211c18] uppercase">
            HAWKINS LAB
          </div>
          <div className="text-[10px] text-[#75664f] uppercase tracking-wider">
            RESEARCH FACILITY
          </div>
          <div className="text-[10px] text-[#75664f] uppercase tracking-wider">
            SHIRPUR UNIT
          </div>
          {/* Black Redacted Bars */}
          <div className="mt-1 space-y-1">
            <div className="redacted-bar w-24 sm:w-28 h-2" />
            <br />
            <div className="redacted-bar w-16 h-2" />
          </div>
        </div>

        {/* Top-Right File Identification */}
        <div className="sm:text-right">
          <div className="text-[10px] text-[#75664f] uppercase tracking-widest">
            FILE NO.
          </div>
          <div className="font-['Special_Elite'] font-bold text-sm text-[#211c18] tracking-widest">
            TS-CC20-0127
          </div>
          <div className="mt-1">
            <div className="redacted-bar w-20 sm:w-24 h-2" />
          </div>
        </div>
      </div>

      {/* ── Organization Credit ── */}
      <div className="text-center my-2">
        <span className="font-['Special_Elite'] text-xs sm:text-sm tracking-[0.22em] text-[#a52a24] uppercase font-black">
          AI STUDENT CHAPTERS • IMRD SHIRPUR
        </span>
      </div>

      {/* ── Main Document Title ── */}
      <div className="text-center my-3 sm:my-4">
        <h1 className="typewriter-title text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
          CLASSIFIED
          <br />
          EVENT DOSSIER
        </h1>
      </div>

      {/* ── Subtitle with Dual Ornamental Rules ── */}
      <div className="flex items-center justify-center gap-3 my-4">
        <div className="h-[1.5px] bg-[#b9a582] flex-1 max-w-[120px]" />
        <span className="font-['Courier_Prime'] text-xs sm:text-sm font-bold tracking-[0.2em] text-[#514536] uppercase text-center">
          PROJECT CODE RED / THE SILENT SIGNAL
        </span>
        <div className="h-[1.5px] bg-[#b9a582] flex-1 max-w-[120px]" />
      </div>

      {/* ── Government File Identification Table ── */}
      <div className="my-5 overflow-x-auto">
        <table className="dossier-id-table">
          <tbody>
            <tr>
              <td className="w-1/3">
                <span className="block text-[9px] sm:text-[10px] text-[#75664f] uppercase tracking-widest font-bold">
                  FILE NO.
                </span>
                <span className="font-bold text-[#211c18] text-xs sm:text-sm tracking-wider">
                  TS-CC20-0127
                </span>
              </td>
              <td className="w-1/3">
                <span className="block text-[9px] sm:text-[10px] text-[#75664f] uppercase tracking-widest font-bold">
                  PROJECT
                </span>
                <span className="font-bold text-[#211c18] text-xs sm:text-sm tracking-wider">
                  CODE CARNIVAL 2.0
                </span>
              </td>
              <td className="w-1/3">
                <span className="block text-[9px] sm:text-[10px] text-[#75664f] uppercase tracking-widest font-bold">
                  STATUS
                </span>
                <span className="font-['Special_Elite'] font-bold text-[#a52a24] text-xs sm:text-sm tracking-widest">
                  ACTIVE — PLANNING
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="block text-[9px] sm:text-[10px] text-[#75664f] uppercase tracking-widest font-bold">
                  DATE
                </span>
                <span className="font-bold text-[#211c18] text-xs sm:text-sm tracking-wider">
                  12 JANUARY 2027
                </span>
              </td>
              <td>
                <span className="block text-[9px] sm:text-[10px] text-[#75664f] uppercase tracking-widest font-bold">
                  LOCATION
                </span>
                <span className="font-bold text-[#211c18] text-xs sm:text-sm tracking-wider">
                  IMRD, SHIRPUR
                </span>
              </td>
              <td>
                <span className="block text-[9px] sm:text-[10px] text-[#75664f] uppercase tracking-widest font-bold">
                  CLASSIFICATION
                </span>
                <span className="font-['Special_Elite'] font-bold text-[#a52a24] text-xs sm:text-sm tracking-widest">
                  EVENT CONFIDENTIAL
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Rubber Stamp: TOP SECRET (Physical Stamping Animation) ── */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
        className="text-center my-5"
      >
        <div className="stamp-top-secret text-lg sm:text-2xl font-black">
          TOP SECRET
        </div>
      </motion.div>

      {/* ── Main Investigation Headline ── */}
      <div className="text-center mb-4">
        <h2 className="font-['Special_Elite'] text-base sm:text-xl md:text-2xl font-black tracking-wider text-[#211c18] uppercase inline-block border-b-2 border-[#211c18] pb-0.5">
          THE SIGNAL HAS BEEN DETECTED.
        </h2>
      </div>

      {/* ── Investigation Narrative with Marginal Handwritten Notes ── */}
      <div className="relative my-4 px-2 sm:px-6">
        {/* Left Handwritten Annotation: "Enter the unknown ↘" */}
        <div className="hidden sm:block absolute -left-4 sm:-left-6 top-0 font-['Caveat'] text-lg sm:text-xl text-[#3d2e20] font-bold -rotate-12 pointer-events-none">
          <span>Enter the unknown</span>
          <svg className="w-6 h-6 text-[#3d2e20] ml-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4c4 8 10 12 16 14m0 0l-5-1m5 1l-1-5" />
          </svg>
        </div>

        {/* Right Handwritten Annotation in Red Pen (Matching Reference 2) */}
        <div className="hidden md:block absolute -right-4 sm:-right-6 -top-3 w-48 font-['Caveat'] text-base sm:text-lg text-[#a52a24] font-bold rotate-6 pointer-events-none leading-snug">
          Same ideas, different realities. Will your squad conquer the breach?
        </div>

        {/* Main Body Paragraph */}
        <p className="font-['Courier_Prime'] text-xs sm:text-sm md:text-base text-[#211c18] text-center max-w-2xl mx-auto leading-relaxed">
          A live campus experience where participants investigate transmissions, discover{' '}
          <span className="pen-underline font-bold">hidden clues</span>, solve timed challenges and compete to unlock the{' '}
          <span className="pen-underline font-bold">final advantage</span>.
        </p>
      </div>

      {/* ── Bottom Section: Investigation Metadata & Primary Release Button ── */}
      <div className="mt-8 pt-4 border-t border-[#b9a582]/70 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Subject Metadata (Left) */}
        <div className="font-['Courier_Prime'] text-[11px] sm:text-xs text-[#211c18] space-y-1 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[#75664f] font-bold w-28 uppercase">SUBJECT</span>
            <span>: CODE CARNIVAL 2.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#75664f] font-bold w-28 uppercase">LOCATION</span>
            <span>: IMRD SHIRPUR</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#75664f] font-bold w-28 uppercase">OPERATION</span>
            <span>: SILENT SIGNAL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#75664f] font-bold w-28 uppercase">SIGNAL STATUS</span>
            <span className="text-[#a52a24] font-bold">: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#75664f] font-bold w-28 uppercase">CLEARANCE</span>
            <span className="text-[#a52a24] font-bold">: RESTRICTED</span>
          </div>
        </div>

        {/* Primary Action Button (The Red Stamped Authorization Label) */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <button
            onClick={onOpenClassifiedFile}
            className="dossier-action-btn w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-4 rounded-xs flex items-center justify-center gap-3 text-sm sm:text-base font-bold shadow-xl"
            aria-label="Open Classified File"
          >
            <Folder size={18} className="text-[#f2e7d0]" />
            <span>OPEN CLASSIFIED FILE</span>
            <ChevronRight size={18} className="text-[#f2e7d0]" />
          </button>

          <span className="mt-2 text-[10px] font-mono tracking-widest text-[#75664f] uppercase text-center">
            ── CLICK TO ACCESS THE INVESTIGATION ──
          </span>
        </div>

        {/* Official Hazmat Circular Seal Stamp (Right corner) */}
        <div className="circular-seal hidden sm:flex shrink-0">
          <AlertOctagon size={22} className="text-[#514536] mb-1 opacity-80" />
          <span className="font-bold leading-tight">IMRD • SHIRPUR</span>
          <span className="text-[7px] text-[#75664f]">RESEARCH DIVISION</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DossierDocument;
