"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface WorldRoomNode {
  id: string;
  roomNum: string;
  name: string;
  subtitle: string;
  path: string;
  icon: string;
  badge: string;
  badgeBg: string;
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
    badgeBg: "bg-indigo-50 text-[#6D5DFB] border-indigo-100",
  },
  {
    id: "projects",
    roomNum: "ROOM 02",
    name: "THE LAB",
    subtitle: "My Stupid Stuff & Artifact Inspector",
    path: "/projects",
    icon: "🧪",
    badge: "OBJECT WALL",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
  },
  {
    id: "case-studies",
    roomNum: "ROOM 03",
    name: "THE INVESTIGATION ROOM",
    subtitle: "Forensics evidence boards & lessons",
    path: "/case-studies",
    icon: "🔬",
    badge: "EVIDENCE BOARDS",
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  {
    id: "blog",
    roomNum: "ROOM 04",
    name: "THE LIBRARY",
    subtitle: "Thought Stream & Rabbit Hole Filters",
    path: "/blog",
    icon: "📖",
    badge: "THOUGHT STREAM",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "videos",
    roomNum: "ROOM 05",
    name: "THE SCREENING ROOM",
    subtitle: "Technical video walkthroughs & demos",
    path: "/videos",
    icon: "🎥",
    badge: "DEMO SCREEN",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    id: "research",
    roomNum: "ROOM 06",
    name: "THE RESEARCH PAPERS",
    subtitle: "Maximal High Occupancy Itemsets (MHOI)",
    path: "/research",
    icon: "📑",
    badge: "PUBLICATIONS",
    badgeBg: "bg-[#FAFAF8] text-slate-700 border-slate-200",
  },
  {
    id: "hire-me-career",
    roomNum: "ROOM 07",
    name: "WORKSHOP & HALLWAY",
    subtitle: "Character Level Save, Skill Tree & Career Doors",
    path: "/hire-me",
    icon: "🛠",
    badge: "CHARACTER SAVE",
    badgeBg: "bg-indigo-50 text-[#6D5DFB] border-indigo-100",
  },
  {
    id: "hire-me-contact",
    roomNum: "ROOM 08",
    name: "THE EXIT",
    subtitle: "Open invitation & direct connect",
    path: "/hire-me#contact-form",
    icon: "🚪",
    badge: "HIRE ME CTA",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
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
          className="group px-4 py-3 bg-white hover:bg-[#6D5DFB] text-[#171717] hover:text-white rounded-2xl shadow-xl border border-[#EAEAEA] hover:border-[#6D5DFB] transition-all duration-300 flex items-center gap-3 cursor-pointer"
          title="Open World Map (Press M)"
        >
          <span className="text-base group-hover:scale-110 transition-transform">🗺</span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            WORLD MAP
          </span>
          <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 group-hover:bg-white/20 group-hover:border-transparent text-[10px] font-mono font-bold text-[#6D5DFB] group-hover:text-white">
            M
          </span>
        </button>
      </div>

      {/* World Map Fast Travel Light Theme Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-[#171717] border border-[#EAEAEA] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6D5DFB] text-xl font-bold">
                  🗺
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-mono font-extrabold text-[#171717]">
                      THE QUAN VAN WORLD
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">
                      LIGHT MODE
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500">
                    FAST TRAVEL SYSTEM &bull; Click any room node to teleport instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAFAF8] hover:bg-slate-200 border border-[#EAEAEA] text-slate-500 hover:text-[#171717] flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Room Nodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WORLD_ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleTeleport(room.path)}
                  className="group bg-[#FAFAF8] hover:bg-white border border-[#EAEAEA] hover:border-[#6D5DFB] p-5 rounded-2xl transition-all duration-200 text-left flex flex-col justify-between space-y-4 hover:shadow-lg cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
                        {room.roomNum}
                      </span>
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold ${room.badgeBg}`}>
                        {room.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {room.icon}
                      </span>
                      <h4 className="text-sm font-bold font-mono text-[#171717] group-hover:text-[#6D5DFB] transition-colors leading-tight">
                        {room.name}
                      </h4>
                    </div>
                    <p className="text-xs text-[#525252] font-sans leading-relaxed">
                      {room.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 group-hover:text-[#6D5DFB]">
                    <span>TELEPORT</span>
                    <span>&rarr;</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Modal Footer Note */}
            <div className="pt-4 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500">
              <span>Press <kbd className="px-1.5 py-0.5 bg-[#FAFAF8] border border-[#EAEAEA] rounded text-[#171717] font-bold">M</kbd> anytime on any page to toggle map</span>
              <span className="text-[#6D5DFB] font-bold">0ms FAST TRAVEL</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
