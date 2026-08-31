"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WorldRoomNode {
  id: string;
  roomNum: string;
  name: string;
  subtitle: string;
  path: string;
  icon: string;
  badge: string;
  color: string;
}

const WORLD_ROOMS: WorldRoomNode[] = [
  {
    id: "home",
    roomNum: "ROOM 01",
    name: "QUAN'S ROOM",
    subtitle: "Opening room, intro & core persona",
    path: "/",
    icon: "🏠",
    badge: "START NODE",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "projects",
    roomNum: "ROOM 02",
    name: "THE LAB",
    subtitle: "My Stupid Stuff & Artifact Inspector",
    path: "/projects",
    icon: "🧪",
    badge: "OBJECT WALL",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "case-studies",
    roomNum: "ROOM 03",
    name: "THE INVESTIGATION ROOM",
    subtitle: "Forensics evidence boards & lessons",
    path: "/case-studies",
    icon: "🔬",
    badge: "EVIDENCE BOARDS",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "blog",
    roomNum: "ROOM 04",
    name: "THE LIBRARY",
    subtitle: "Thought Stream & Rabbit Hole Filters",
    path: "/blog",
    icon: "📖",
    badge: "THOUGHT STREAM",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "hire-me-career",
    roomNum: "ROOM 05",
    name: "WORKSHOP & HALLWAY",
    subtitle: "Character Level Save, Skill Tree & Career Doors",
    path: "/hire-me",
    icon: "🛠",
    badge: "CHARACTER SAVE",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "hire-me-contact",
    roomNum: "ROOM 06",
    name: "THE EXIT",
    subtitle: "Open invitation & direct connect",
    path: "/hire-me#contact-form",
    icon: "🚪",
    badge: "HIRE ME CTA",
    color: "from-rose-500 to-red-600",
  },
];

export function WorldMapModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Listen for 'M' key to toggle World Map modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTeleport = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Persistent Bottom-Right Fast Travel Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group px-4 py-3 bg-[#171717] hover:bg-[#6D5DFB] text-white rounded-2xl shadow-2xl border border-slate-700 hover:border-[#6D5DFB] transition-all duration-300 flex items-center gap-3 cursor-pointer"
          title="Open World Map (Press M)"
        >
          <span className="text-base group-hover:scale-110 transition-transform">🗺</span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            WORLD MAP
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono font-bold text-white">
            M
          </span>
        </button>
      </div>

      {/* World Map Fast Travel Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#171717] text-white border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6D5DFB]/20 border border-[#6D5DFB]/40 flex items-center justify-center text-[#6D5DFB] text-lg font-bold">
                  🗺
                </div>
                <div>
                  <h3 className="text-lg font-mono font-extrabold text-white">
                    THE QUAN VAN WORLD
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    FAST TRAVEL SYSTEM &bull; Click any node to teleport instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Room Nodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORLD_ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleTeleport(room.path)}
                  className="group bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-[#6D5DFB] p-5 rounded-2xl transition-all duration-200 text-left flex flex-col justify-between space-y-4 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
                        {room.roomNum}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-300">
                        {room.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {room.icon}
                      </span>
                      <h4 className="text-sm font-bold font-mono text-white group-hover:text-[#6D5DFB] transition-colors">
                        {room.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {room.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-[#6D5DFB]">
                    <span>TELEPORT</span>
                    <span>&rarr;</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Modal Footer Note */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">M</kbd> anytime to toggle map</span>
              <span className="text-emerald-400 font-semibold">0ms LATENCY TELEPORT</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
