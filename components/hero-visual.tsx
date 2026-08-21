"use client";

import React from "react";

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg aspect-square mx-auto flex items-center justify-center pointer-events-none select-none">
      {/* Background soft pastel radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#6D5DFB]/10 via-[#10B981]/5 to-[#3B82F6]/10 rounded-full blur-3xl" />

      {/* Abstract Perspective Technical Grid Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50 250 L 250 150 L 450 250 L 250 350 Z"
          stroke="#6D5DFB"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.4"
        />
        <path
          d="M 100 250 L 250 175 L 400 250 L 250 325 Z"
          stroke="#10B981"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.3"
        />
        <path
          d="M 250 50 L 250 450"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M 50 250 L 450 250"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* Floating node points */}
        <circle cx="250" cy="150" r="3" fill="#6D5DFB" />
        <circle cx="450" cy="250" r="3" fill="#10B981" />
        <circle cx="250" cy="350" r="3" fill="#3B82F6" />
        <circle cx="50" cy="250" r="3" fill="#F59E0B" />
      </svg>

      {/* Floating Graphic Elements Composite */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Top-Left Green Network Badge */}
        <div className="absolute top-12 left-10 z-20 animate-float bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3.5 shadow-lg shadow-emerald-500/5 backdrop-blur-md">
          <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m2-1l-2-1m2 1v2.5M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1m2 1l2-1m-2 1v-2.5" />
          </svg>
        </div>

        {/* Right Code Icon Pill Badge */}
        <div className="absolute top-28 right-8 z-30 animate-float-reverse bg-purple-50/90 border border-purple-200/80 rounded-2xl p-4 shadow-lg shadow-purple-500/5 backdrop-blur-md">
          <span className="text-[#6D5DFB] font-mono font-bold text-lg tracking-tight">&lt;/&gt;</span>
        </div>

        {/* Isometric Card Layer 3 (Back Window Layer) */}
        <div className="absolute transform translate-x-12 -translate-y-6 rotate-[-12deg] w-56 h-72 bg-gradient-to-tr from-white/90 to-purple-50/80 border border-purple-100 rounded-3xl shadow-xl backdrop-blur-xl opacity-70" />

        {/* Isometric Card Layer 2 (Middle Translucent Glass Layer) */}
        <div className="absolute transform translate-x-6 -translate-y-3 rotate-[-8deg] w-56 h-72 bg-gradient-to-tr from-white/95 to-indigo-50/90 border border-indigo-100 rounded-3xl shadow-2xl backdrop-blur-xl opacity-85 flex flex-col justify-end p-6">
          <div className="w-12 h-2 bg-indigo-200/60 rounded-full mb-2" />
          <div className="w-20 h-2 bg-indigo-100/80 rounded-full" />
        </div>

        {/* Isometric Card Layer 1 (Front Primary QV Card) */}
        <div className="absolute z-10 transform rotate-[-4deg] w-60 h-76 bg-white/95 border border-slate-200/80 rounded-3xl shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl p-7 flex flex-col justify-between">
          <div className="w-full flex items-center justify-between">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>

          <div className="my-auto flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-black text-2xl tracking-tight shadow-xl shadow-[#6D5DFB]/30 mb-3">
              QV
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">
              AI LAB ENGINE
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-[#6D5DFB] rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>SYSTEM Ready</span>
              <span>v2.6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
