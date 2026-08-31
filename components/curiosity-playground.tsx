"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, ExternalLink, Code2, Database, Zap, Cpu } from "lucide-react";

interface CuriosityItem {
  id: string;
  title: string;
  subtitle: string;
  type: "AI" | "Data" | "Software" | "Weird";
  badgeColor: string;
  question: string;
  answer: string;
  stat?: string;
  linkHref: string;
  linkLabel: string;
}

const CURIOSITY_ITEMS: CuriosityItem[] = [
  {
    id: "cheeserag",
    title: "cheeserag",
    subtitle: "Local AI RAG Workspace in C++20",
    type: "AI",
    badgeColor: "bg-indigo-50 text-[#6D5DFB] border-indigo-200",
    question: "Why did I build this?",
    answer: "Because sending all my personal PDFs and notes to external APIs felt slow, expensive, and unnecessary. So I wrote a local C++ vector engine and wrapped it in a lightweight UI.",
    stat: "100% Offline • Zero API Bills",
    linkHref: "/projects",
    linkLabel: "Inspect C++ Engine",
  },
  {
    id: "ecommerce-behavior",
    title: "E-Commerce 50k Behavioral Pipeline",
    subtitle: "Session Journey Mining & Markov Simulator",
    type: "Data",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    question: "Wait... why does customer churn spike at 3 AM?",
    answer: "I took 50,000 raw customer records, built a 5x5 Markov state matrix, and discovered that cart abandonment wasn't a price issue—it was a delivery friction bottleneck.",
    stat: "50,000 Records • Markov Matrix",
    linkHref: "/case-studies",
    linkLabel: "Read Forensics Investigation",
  },
  {
    id: "filament-hq",
    title: "Filament-HQ V2 Solar Segmentation",
    subtitle: "16D Pixel Embeddings & 2D Affinity Graphs",
    type: "Software",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    question: "Okay, this one is weird... solar filaments?",
    answer: "Solar filaments break into pieces under simple thresholding. I used 16D pixel embeddings to teach the neural net how to group elongated plasma structures across 1536x1536 native tiles.",
    stat: "1536x1536 Tiles • 16D Embeddings",
    linkHref: "/projects",
    linkLabel: "View Segmentation Code",
  },
  {
    id: "stack-overflow-2025",
    title: "Stack Overflow 2025 Developer Trust",
    subtitle: "IC vs PM Salary & Perception Analysis",
    type: "Weird",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    question: "Do senior devs actually trust AI code?",
    answer: "45.7% of survey respondents reported distrust toward AI-generated code. The deeper their experience level, the higher their skepticism toward unverified code output.",
    stat: "2025 Dataset • Trust Metrics",
    linkHref: "/case-studies",
    linkLabel: "Explore Survey Insights",
  },
];

export function CuriosityPlayground() {
  const [activeItem, setActiveItem] = useState<CuriosityItem | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EAEAEA]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6D5DFB] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#171717] uppercase tracking-wider">
            INTERACTIVE CURIOSITY WALL
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">Click any object to inspect</span>
      </div>

      {/* Curiosity Grid of Interactive Objects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CURIOSITY_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group text-left p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs hover:shadow-md hover:border-[#6D5DFB]/40 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${item.badgeColor}`}>
                {item.type}
              </span>
              <span className="text-[10px] font-mono text-[#6D5DFB] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold">
                Inspect artifact →
              </span>
            </div>

            <h3 className="text-base font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-[#525252] mb-3">{item.subtitle}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#6D5DFB] font-mono font-semibold">
              <span>&ldquo;{item.question}&rdquo;</span>
              <span className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[#6D5DFB] group-hover:scale-110 transition-transform">
                ?
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal Popup Inspector */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#EAEAEA] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative">
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="space-y-3">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${activeItem.badgeColor} inline-block`}>
                {activeItem.type} ARTIFACT
              </span>
              <h2 className="text-2xl font-bold text-[#171717]">{activeItem.title}</h2>
              <p className="text-xs font-mono text-[#6D5DFB]">{activeItem.subtitle}</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <span className="text-xs font-mono font-bold text-[#6D5DFB]">THE QUESTION:</span>
              <p className="text-sm font-semibold text-[#171717]">&ldquo;{activeItem.question}&rdquo;</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">WHAT I FOUND / WHY I BUILT IT:</span>
              <p className="text-sm text-[#525252] leading-relaxed">{activeItem.answer}</p>
            </div>

            {activeItem.stat && (
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 font-semibold">
                ⚡ {activeItem.stat}
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <Link
                href={activeItem.linkHref}
                onClick={() => setActiveItem(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-xs font-semibold text-center transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>{activeItem.linkLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setActiveItem(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171717] text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
