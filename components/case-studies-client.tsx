"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Server,
  Code2,
  Wrench,
  Sparkles,
  Clock,
  Bookmark,
  ArrowRight,
  RotateCw,
  Layers,
} from "lucide-react";
import { CaseStudyData } from "@/lib/case-studies";

// Helper component to strictly handle image display:
// Only displays if image exists AND loads successfully without 404 or error.
function SafeCaseStudyImage({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) return null;

  return (
    <div className={`my-3 overflow-hidden rounded-xl border border-[#EAEAEA] bg-slate-50 transition-all duration-300 ${isLoaded ? "block opacity-100" : "hidden opacity-0"}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className="w-full h-36 object-cover object-top hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}

// Estimate read time based on excerpt/title length if not provided
function estimateReadTime(cs: CaseStudyData) {
  if (cs.readTime) return cs.readTime;
  const wordCount = (cs.title.length + (cs.excerpt?.length || 0)) * 6;
  const minutes = Math.max(8, Math.ceil(wordCount / 120));
  return `${minutes} min read`;
}

// Category badge color helper
function getCategoryBadgeColor(category?: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("business") || cat.includes("data")) {
    return "bg-[#6D5DFB]/10 text-[#6D5DFB] border-[#6D5DFB]/20";
  }
  if (cat.includes("ai") || cat.includes("intelligence")) {
    return "bg-purple-50 text-purple-600 border-purple-200";
  }
  if (cat.includes("system") || cat.includes("design")) {
    return "bg-blue-50 text-blue-600 border-blue-200";
  }
  if (cat.includes("infra") || cat.includes("platform")) {
    return "bg-cyan-50 text-cyan-600 border-cyan-200";
  }
  if (cat.includes("arch")) {
    return "bg-rose-50 text-rose-600 border-rose-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

interface ForensicsTarget {
  id: string;
  name: string;
  badge: string;
  steps: {
    thought: string;
    found: string;
    waitWhat: string;
    happened: string;
    differently: string;
  };
}

const FORENSICS_TARGETS: ForensicsTarget[] = [
  {
    id: "ecommerce",
    name: "E-Commerce 50k Session Churn",
    badge: "50,000 Customer Records",
    steps: {
      thought: "I initially assumed users abandoned their carts because prices were too high or coupon codes failed.",
      found: "Pricing had zero statistical correlation with churn. 78% of abandonments happened at step 3 (shipping selection).",
      waitWhat: "Night owl sessions (1 AM - 4 AM) had a 42% higher drop-off rate because express shipping options were hidden!",
      happened: "A simple UI friction in late-night logistics selection caused $120k/mo in estimated revenue leakage.",
      differently: "Segment session flows by local timezone and device state before running global price sensitivity models."
    }
  },
  {
    id: "filament",
    name: "Filament-HQ V2 Solar Segmentation",
    badge: "1536x1536 Native Imagery",
    steps: {
      thought: "Standard Canny edge detection or UNet binary masks will trace solar plasma filaments easily.",
      found: "Plasma filaments fragment continuously due to intense solar flare background noise and low contrast.",
      waitWhat: "16D pixel affinity embeddings connected elongated plasma strands far better than binary classification!",
      happened: "Multi-task learning with 2D affinity graphs resolved 85% of plasma filament fragmentation errors.",
      differently: "Train pixel affinity embeddings directly on native overlapping tiles from day one instead of upscaling."
    }
  },
  {
    id: "survey2025",
    name: "Stack Overflow 2025 Developer Trust",
    badge: "Developer Community Survey",
    steps: {
      thought: "Senior developers use AI coding tools more frequently and trust AI outputs more.",
      found: "The higher the developer seniority, the lower their confidence and trust in AI-generated code.",
      waitWhat: "45.7% of surveyed engineers reported distrust toward unverified AI code output!",
      happened: "Experienced devs use AI for fast boilerplate, but review every line like untrusted third-party code.",
      differently: "Separate tool adoption frequency from code trust rating in future statistical surveys."
    }
  }
];

function ForensicsBoard() {
  const [activeTarget, setActiveTarget] = useState<ForensicsTarget>(FORENSICS_TARGETS[0]);
  const [activeStep, setActiveStep] = useState<"thought" | "found" | "waitWhat" | "happened" | "differently">("thought");

  const stepLabels = [
    { key: "thought", label: "1. WHAT I THOUGHT" },
    { key: "found", label: "2. WHAT I FOUND" },
    { key: "waitWhat", label: "3. WAIT, WHAT?" },
    { key: "happened", label: "4. WHAT HAPPENED" },
    { key: "differently", label: "5. WHAT I'D DO DIFFERENTLY" },
  ] as const;

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAEAEA]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6D5DFB] animate-pulse" />
            <span>INTERACTIVE FORENSICS INVESTIGATION</span>
          </div>
          <h3 className="text-xl font-bold text-[#171717]">Pick something I probably shouldn&apos;t have built</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {FORENSICS_TARGETS.map((target) => (
            <button
              key={target.id}
              onClick={() => {
                setActiveTarget(target);
                setActiveStep("thought");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTarget.id === target.id
                  ? "bg-[#6D5DFB] text-white shadow-sm"
                  : "bg-white border border-[#EAEAEA] text-slate-600 hover:text-[#171717]"
              }`}
            >
              [{target.name.split(" ")[0].toUpperCase()}]
            </button>
          ))}
        </div>
      </div>

      {/* Investigation Pipeline Stepper */}
      <div className="flex flex-wrap gap-2">
        {stepLabels.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStep(s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeStep === s.key
                ? "bg-[#171717] text-white shadow-xs"
                : "bg-white text-slate-500 border border-slate-200 hover:text-[#171717]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active Stage Evidence Display */}
      <div className="p-6 rounded-2xl bg-white border border-indigo-100 shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#6D5DFB] uppercase">
            EVIDENCE &bull; {activeTarget.name}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-semibold">
            {activeTarget.badge}
          </span>
        </div>

        <p className="text-base text-[#171717] font-medium leading-relaxed">
          {activeTarget.steps[activeStep]}
        </p>

        <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Click any stage button to step through the investigation</span>
          <span className="text-[#6D5DFB] font-bold">STAGE: {activeStep.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

interface CaseStudiesClientProps {
  caseStudies: CaseStudyData[];
}

export function CaseStudiesClient({ caseStudies }: CaseStudiesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [visibleCount, setVisibleCount] = useState(12);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<Record<string, boolean>>({});

  // Toggle bookmark icon state
  const toggleBookmark = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Categories list with counts
  const categoryOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    caseStudies.forEach((cs) => {
      const cat = cs.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { name: "All", count: caseStudies.length },
      ...Object.keys(counts).map((cat) => ({ name: cat, count: counts[cat] })),
    ];
  }, [caseStudies]);

  // Filter and Sort logic
  const filteredAndSortedCaseStudies = useMemo(() => {
    return caseStudies
      .filter((cs) => {
        // Category filter
        if (selectedCategory !== "All" && cs.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchTitle = cs.title.toLowerCase().includes(q);
          const matchExcerpt = cs.excerpt?.toLowerCase().includes(q) || false;
          const matchCategory = cs.category?.toLowerCase().includes(q) || false;
          const matchSeries = cs.series?.toLowerCase().includes(q) || false;
          const matchTags = cs.tags?.some((t) => t.toLowerCase().includes(q)) || false;
          return matchTitle || matchExcerpt || matchCategory || matchSeries || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return a.date < b.date ? 1 : -1;
        }
        if (sortBy === "oldest") {
          return a.date > b.date ? 1 : -1;
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [caseStudies, searchQuery, selectedCategory, sortBy]);

  // Separate top 3 for featured cards if on "All" view
  const featuredCaseStudies = useMemo(() => {
    return filteredAndSortedCaseStudies.slice(0, 3);
  }, [filteredAndSortedCaseStudies]);

  const regularCaseStudies = useMemo(() => {
    if (selectedCategory === "All" && !searchQuery) {
      return filteredAndSortedCaseStudies.slice(3, visibleCount);
    }
    return filteredAndSortedCaseStudies.slice(0, visibleCount);
  }, [filteredAndSortedCaseStudies, selectedCategory, searchQuery, visibleCount]);

  const totalDisplayedCount = selectedCategory === "All" && !searchQuery
    ? featuredCaseStudies.length + regularCaseStudies.length
    : regularCaseStudies.length;

  const hasMore = visibleCount < filteredAndSortedCaseStudies.length;

  return (
    <div className="space-y-10">
      {/* ─── Hero Header & Highlight Cards ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 border border-[#EAEAEA] p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            {/* Spatial Room Branding Badge */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#6D5DFB] text-white">ROOM 03</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-[#171717]">THE INVESTIGATION ROOM (FORENSICS)</span>
            </div>

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-mono font-bold text-[#6D5DFB]">
              <span className="w-2 h-2 rounded-full bg-[#6D5DFB] animate-pulse" />
              <span>OBSERVATIONS &amp; ANALYSIS</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
              MY SEE,{" "}
              <span className="bg-gradient-to-r from-[#6D5DFB] via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WHAT I SEE
              </span>
            </h1>

            {/* Subtitle */}
            <div className="space-y-1.5 text-sm sm:text-base text-[#525252] leading-relaxed max-w-2xl font-normal">
              <p>Things I noticed and couldn&apos;t stop thinking about.</p>
              <p className="text-xs text-slate-500 font-mono">
                Sometimes it&apos;s data. Sometimes it&apos;s business. Sometimes it&apos;s technology.
              </p>
              <p className="pt-1 text-[#171717]">
                Sometimes it&apos;s just me asking: <strong className="text-[#6D5DFB] font-mono">&quot;Wait... why does this work like that?&quot;</strong>
              </p>
            </div>

            {/* 3 Highlight Cards */}
            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Server className="w-4 h-4 text-[#6D5DFB]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#171717]">
                    Real-world Systems
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Production deployments
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#171717]">
                    Engineering Insights
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Technical deep dives
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#171717]">
                    Lessons Learned
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    What worked & what didn't
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Illustration (Soft 3D Analytics/Architecture Window) */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <div className="relative w-full max-w-xs p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6D5DFB] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#6D5DFB]" />
                </div>
              </div>

              <div className="space-y-2 font-mono text-[10px] text-slate-500">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                  <span className="text-[#6D5DFB]">dataset.scale =</span>
                  <span>"110M events"</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                  <span className="text-emerald-600">model.markov =</span>
                  <span>"5x5 Transition"</span>
                </div>
                <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6D5DFB] to-purple-600 w-4/5 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FORENSICS INVESTIGATION BOARD ─── */}
      <ForensicsBoard />

      {/* ─── Search & Category Filter Controls ─── */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies by architecture, domain, technology, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#EAEAEA] text-xs text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#6D5DFB] focus:ring-1 focus:ring-[#6D5DFB] transition-all font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 w-full md:w-auto justify-end">
            <span>Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAFAF8] border border-[#EAEAEA] text-[#171717] font-semibold text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-[#6D5DFB] transition-all cursor-pointer appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#EAEAEA]">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mr-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Categories:</span>
          </div>
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setVisibleCount(12);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#6D5DFB] text-white shadow-xs font-bold"
                    : "bg-[#FAFAF8] text-[#525252] border border-[#EAEAEA] hover:border-slate-400 hover:text-[#171717]"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Featured Case Studies Section ─── */}
      {selectedCategory === "All" && !searchQuery && featuredCaseStudies.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
              <span>Featured Case Studies</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {caseStudies.length} case studies
            </span>
          </div>

          {/* Top 3 Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCaseStudies.map((cs) => {
              const badgeStyle = getCategoryBadgeColor(cs.category);
              const readTime = estimateReadTime(cs);
              const isBookmarked = bookmarkedSlugs[cs.slug];

              return (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="group bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-xs hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category & Date */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${badgeStyle}`}
                      >
                        {cs.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {cs.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors leading-snug mb-2 line-clamp-2">
                      {cs.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[#525252] text-xs leading-relaxed mb-3 line-clamp-3">
                      {cs.excerpt}
                    </p>

                    {/* Safe Image Component (Hides cleanly if missing or load error) */}
                    <SafeCaseStudyImage src={cs.image} alt={cs.title} />
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
                    <span className="text-[#6D5DFB] font-mono font-semibold text-[11px] inline-flex items-center gap-1 group-hover:underline">
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{readTime}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(e, cs.slug)}
                        className="p-1 rounded-md hover:bg-slate-100 transition-colors"
                        title="Bookmark case study"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 transition-colors ${
                            isBookmarked
                              ? "text-[#6D5DFB] fill-[#6D5DFB]"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Regular Case Studies Grid ─── */}
      {filteredAndSortedCaseStudies.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-3xl text-center py-16 px-6 max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6D5DFB] mx-auto">
            <Search className="w-5 h-5 text-[#6D5DFB]" />
          </div>
          <h3 className="text-lg font-bold text-[#171717]">
            No matching case studies found
          </h3>
          <p className="text-[#737373] text-xs leading-relaxed">
            No case studies match your current search query or category filter. Try resetting your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 bg-[#6D5DFB] text-white text-xs font-semibold rounded-xl hover:bg-[#5C4CE5] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {(selectedCategory !== "All" || searchQuery) && (
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
              <span>
                Showing {filteredAndSortedCaseStudies.length} matching case studies
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-[#6D5DFB] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid of Case Studies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularCaseStudies.map((cs) => {
              const badgeStyle = getCategoryBadgeColor(cs.category);
              const readTime = estimateReadTime(cs);
              const isBookmarked = bookmarkedSlugs[cs.slug];

              return (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="group bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Category & Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${badgeStyle}`}
                      >
                        {cs.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {cs.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors leading-snug mb-2 line-clamp-2">
                      {cs.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[#525252] text-xs leading-relaxed mb-3 line-clamp-3">
                      {cs.excerpt}
                    </p>

                    {/* Safe Image Display */}
                    <SafeCaseStudyImage src={cs.image} alt={cs.title} />
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 mt-2 border-t border-[#EAEAEA] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{readTime}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, cs.slug)}
                      className="p-1 rounded-md hover:bg-slate-100 transition-colors"
                      title="Bookmark case study"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 transition-colors ${
                          isBookmarked
                            ? "text-[#6D5DFB] fill-[#6D5DFB]"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#EAEAEA] text-xs font-mono font-bold text-[#525252] hover:text-[#171717] hover:border-slate-400 shadow-xs transition-all cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Load more case studies</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
