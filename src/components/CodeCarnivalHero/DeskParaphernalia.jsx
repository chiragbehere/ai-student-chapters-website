// DeskParaphernalia.jsx
// Authentic 1980s Hawkins Lab Investigation Desk Props
// Surrounds the central classified dossier with physical artifacts from Reference 2
import React from 'react';
import { Radio, AlertTriangle } from 'lucide-react';

export const DeskParaphernalia = () => {
  return (
    <>
      {/* ── 1. Top-Left: Vintage Surveillance Polaroid of IMRD Shirpur ── */}
      <div 
        className="hidden lg:block absolute -top-4 -left-6 z-10 w-48 bg-[#f4ecd8] p-2.5 pb-6 shadow-[0_15px_30px_rgba(0,0,0,0.85)] border border-[#c4b394] -rotate-6 transition-transform hover:rotate-0 duration-300 pointer-events-none"
      >
        {/* Top Masking Tape */}
        <div className="masking-tape -top-3 left-1/2 -translate-x-1/2 w-16 h-5 -rotate-2" />
        
        {/* Vintage B&W Photograph */}
        <div className="relative w-full h-32 bg-[#1a1410] overflow-hidden border border-neutral-700/60 filter contrast-125 sepia-[0.35]">
          <img
            src="/CodeCarnival_3D_Assets/graphics/event_warnings_poster.jpg"
            alt="IMRD Shirpur Facility"
            className="w-full h-full object-cover grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 bg-black/80 text-[8px] font-mono tracking-widest text-[#e8d5b5] uppercase border border-red-950">
            IMRD SHIRPUR
          </div>
        </div>

        {/* Polaroid Handwritten Caption */}
        <p className="mt-2 text-center font-['Caveat'] text-[#3b2e22] text-sm tracking-wider font-bold">
          Hawkins Lab Unit // Sector 4
        </p>
      </div>

      {/* ── 2. Bottom-Left: Audio Cassette Tape "EVIDENCE A-27" ── */}
      <div 
        className="hidden xl:block absolute -bottom-8 -left-12 z-10 w-56 p-3 bg-[#1e1a17] rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.9)] border border-neutral-800 rotate-6 transition-transform hover:rotate-2 duration-300 pointer-events-none"
      >
        {/* Cassette Body */}
        <div className="relative w-full h-32 bg-[#2b2520] rounded border-2 border-[#15120f] p-2 flex flex-col justify-between">
          {/* Cassette Label */}
          <div className="w-full bg-[#e9dec6] p-2 rounded-sm border border-[#a89574] text-center shadow-inner">
            <div className="flex items-center justify-between border-b border-[#a89574]/60 pb-1 mb-1 text-[8px] font-mono text-[#514536]">
              <span>SIDE A</span>
              <span className="font-bold text-red-800">RECORDED 104.7 MHz</span>
            </div>
            <div className="font-['Caveat'] text-lg font-black text-[#a52a24] tracking-wider leading-none">
              EVIDENCE A-27
            </div>
          </div>

          {/* Tape Spool Windows */}
          <div className="my-auto py-1 px-4 bg-[#14100d] rounded flex items-center justify-between border border-neutral-700">
            <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#a89574] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#a89574]" />
            </div>
            <div className="w-16 h-3 bg-[#3d2417] rounded-full mx-2" />
            <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#a89574] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#a89574]" />
            </div>
          </div>

          <div className="text-[7px] font-mono text-neutral-400 text-center tracking-widest uppercase">
            ANOMALOUS TRANSMISSION CAPTURE
          </div>
        </div>

        {/* Faded Research Notes Slip under cassette */}
        <div className="absolute -top-6 -right-6 -z-10 w-40 p-2 bg-[#f0e6cf] border border-[#b9a582] shadow-md -rotate-12">
          <div className="text-[8px] font-['Special_Elite'] font-bold text-[#a52a24] tracking-widest uppercase mb-1">
            RESEARCH NOTES
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-[#211c18] w-full" />
            <div className="h-1.5 bg-[#211c18] w-4/5" />
            <div className="h-1.5 bg-[#211c18] w-3/5" />
          </div>
        </div>
      </div>

      {/* ── 3. Top-Right: Top Secret Tag with Metallic Paperclip ── */}
      <div 
        className="hidden lg:block absolute -top-8 -right-8 z-10 w-44 p-3 bg-[#ebdcc0] border border-[#a89574] shadow-[0_15px_30px_rgba(0,0,0,0.8)] rotate-12 transition-transform hover:rotate-6 duration-300 pointer-events-none"
      >
        {/* Silver Paperclip */}
        <div className="absolute -top-3 left-4 w-3.5 h-8 border-2 border-slate-300 rounded-full shadow-sm -rotate-6" />
        
        {/* Property Stamp */}
        <div className="text-[8px] font-['Special_Elite'] text-[#514536] tracking-widest uppercase border-b border-[#a89574] pb-1 mb-2">
          PROPERTY OF INVESTIGATION UNIT
        </div>

        {/* Rubber Stamp */}
        <div className="stamp-top-secret-angled text-center my-1">
          TOP SECRET
        </div>

        <div className="mt-2 text-right text-[7px] font-mono text-[#a52a24] tracking-wider font-bold">
          IMRD SHIRPUR
        </div>
      </div>

      {/* ── 4. Bottom-Right: Handwritten Notes Slip & Hazmat Seal ── */}
      <div 
        className="hidden xl:block absolute -bottom-6 -right-10 z-10 w-48 p-4 bg-[#f2e7d0] border border-[#b9a582] shadow-[0_20px_45px_rgba(0,0,0,0.85)] -rotate-6 transition-transform hover:rotate-0 duration-300 pointer-events-none"
      >
        {/* Coffee Ring Stain on scrap */}
        <div className="absolute -top-2 -left-2 w-16 h-16 rounded-full border-2 border-[#87452e]/30 pointer-events-none" />

        <div className="text-[8px] font-mono text-[#75664f] uppercase tracking-wider mb-2 border-b border-[#b9a582]/50 pb-1">
          MEMORANDUM // FIELD LOG
        </div>

        {/* Handwritten Question */}
        <div className="font-['Caveat'] text-lg text-[#211c18] font-bold leading-snug">
          Algorithms?
          <br />
          Transmission?
          <br />
          <span className="text-[#a52a24]">Other side?</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[8px] font-mono text-[#514536]">
          <span>SECTOR 04</span>
          <span>REF: A-27</span>
        </div>
      </div>
    </>
  );
};

export default DeskParaphernalia;
