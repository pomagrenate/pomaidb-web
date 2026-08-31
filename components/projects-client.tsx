"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Code2,
  Package,
  Search,
  LayoutGrid,
  List,
  Zap,
  ArrowUpRight,
  Star,
  RotateCw,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Layers,
  X,
} from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}
import { ProjectGroup, ProjectItem } from "@/app/projects/projects";

// Helper component to strictly handle image display:
// Only displays if image exists AND loads successfully without 404 or error.
function SafeProjectImage({ src, alt }: { src?: string; alt: string }) {
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

// Helper to generate distinct background colors for avatar initial badges
function getAvatarBadgeStyle(title: string) {
  const charCode = title.charCodeAt(0) || 0;
  const colors = [
    "bg-purple-100 text-[#6D5DFB] border-purple-200",
    "bg-blue-100 text-blue-600 border-blue-200",
    "bg-emerald-100 text-emerald-600 border-emerald-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-indigo-100 text-indigo-600 border-indigo-200",
    "bg-rose-100 text-rose-600 border-rose-200",
    "bg-teal-100 text-teal-600 border-teal-200",
  ];
  return colors[charCode % colors.length];
}

// Extract initials for the logo avatar
function getInitials(title: string) {
  const words = title.split(/[-_\s]+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.substring(0, 2).toUpperCase();
}

export function ProjectsClient({ projectGroups }: { projectGroups: ProjectGroup[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "alphabetical">("updated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedArtifact, setSelectedArtifact] = useState<ProjectItem | null>(null);

  // Compute total statistics
  const totalProjectsCount = useMemo(() => {
    return projectGroups.reduce((acc, g) => acc + g.projects.length, 0);
  }, [projectGroups]);

  const sideProjectsCount = useMemo(() => {
    const side = projectGroups.find((g) => g.category.toLowerCase().includes("side"));
    return side ? side.projects.length : 19;
  }, [projectGroups]);

  const productsCount = useMemo(() => {
    const prod = projectGroups.find((g) => g.category.toLowerCase().includes("product"));
    return prod ? prod.projects.length : 4;
  }, [projectGroups]);

  // Categories list with count
  const categoryOptions = useMemo(() => {
    const cats = [
      { name: "All Projects", count: totalProjectsCount },
      ...projectGroups.map((g) => ({
        name: g.category,
        count: g.projects.length,
      })),
    ];
    return cats;
  }, [projectGroups, totalProjectsCount]);

  // Technologies filter list
  const techOptions = [
    "Rust",
    "Python",
    "TypeScript",
    "Go",
    "React",
    "PyTorch",
    "ONNX",
    "SQL",
    "C++",
  ];

  // Flat project list for filtered view
  const filteredProjects = useMemo(() => {
    let result: { project: ProjectItem; category: string }[] = [];

    projectGroups.forEach((group) => {
      if (
        selectedCategory !== "All Projects" &&
        group.category !== selectedCategory
      ) {
        return;
      }

      group.projects.forEach((p) => {
        // Tech filter
        if (selectedTech) {
          const hasTech = p.tags.some(
            (t) => t.toLowerCase() === selectedTech.toLowerCase()
          );
          if (!hasTech) return;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchRepo = p.repo?.toLowerCase().includes(q) || false;
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchRepo && !matchTags) return;
        }

        result.push({ project: p, category: group.category });
      });
    });

    // Sorting
    if (sortBy === "alphabetical") {
      result.sort((a, b) => a.project.title.localeCompare(b.project.title));
    } else if (sortBy === "stars") {
      result.sort((a, b) => (b.project.stars || 0) - (a.project.stars || 0));
    }

    return result;
  }, [projectGroups, selectedCategory, selectedTech, searchQuery, sortBy]);

  // Separate commercial products for the bottom banner highlight section if viewing "All Projects"
  const commercialProducts = useMemo(() => {
    const prodGroup = projectGroups.find((g) =>
      g.category.toLowerCase().includes("product")
    );
    return prodGroup ? prodGroup.projects.slice(0, 3) : [];
  }, [projectGroups]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div className="space-y-10">
      {/* ─── Hero Header & Stats Row ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 border border-[#EAEAEA] p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-mono font-bold text-[#6D5DFB]">
              <span className="w-2 h-2 rounded-full bg-[#6D5DFB] animate-pulse" />
              <span>EXPERIMENTAL LAB &amp; CODEBASE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
              MY STUPID{" "}
              <span className="bg-gradient-to-r from-[#6D5DFB] via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                STUFF
              </span>
            </h1>

            {/* Subtitle */}
            <div className="space-y-1 text-sm sm:text-base text-[#525252] leading-relaxed max-w-2xl font-normal">
              <p>I had an idea.</p>
              <p>So I built it.</p>
              <p className="font-semibold text-[#171717]">This is where the consequences live.</p>
            </div>

            {/* 3 Counter Stat Cards */}
            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#6D5DFB] flex items-center justify-center font-bold">
                  <FolderGit2 className="w-4 h-4 text-[#6D5DFB]" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#171717] leading-none">
                    {totalProjectsCount}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Total Projects
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#171717] leading-none">
                    {sideProjectsCount}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Side Projects
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#171717] leading-none">
                    {productsCount}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Products
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Illustration (Soft 3D Code/Analytics Mock) */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <div className="relative w-full max-w-xs p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6D5DFB] flex items-center justify-center font-mono text-xs font-bold">
                  <Code2 className="w-4 h-4 text-[#6D5DFB]" />
                </div>
              </div>

              <div className="space-y-2 font-mono text-[10px] text-slate-500">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                  <span className="text-[#6D5DFB]">const stack =</span>
                  <span>["Go", "Rust", "C++", "Next.js"]</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                  <span className="text-emerald-600">const performance =</span>
                  <span>"Zero-OOM / Edge AI"</span>
                </div>
                <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6D5DFB] to-purple-600 w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Search & Controls Bar ─── */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by tech, title, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#EAEAEA] text-xs text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#6D5DFB] focus:ring-1 focus:ring-[#6D5DFB] transition-all font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Sort & View Mode Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAFAF8] border border-[#EAEAEA] text-[#171717] font-semibold text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-[#6D5DFB] transition-all cursor-pointer appearance-none"
              >
                <option value="updated">Recently Updated</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="stars">Most Starred</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Grid / List View Buttons */}
          <div className="flex items-center bg-[#FAFAF8] border border-[#EAEAEA] p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                viewMode === "grid"
                  ? "bg-white text-[#6D5DFB] shadow-xs border border-[#EAEAEA]"
                  : "text-slate-400 hover:text-[#171717]"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                viewMode === "list"
                  ? "bg-white text-[#6D5DFB] shadow-xs border border-[#EAEAEA]"
                  : "text-slate-400 hover:text-[#171717]"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Two-Column Layout (Sidebar + Projects Grid) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Categories Nav Menu */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Categories
              </h3>
            </div>
            <div className="space-y-1">
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
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-indigo-50 text-[#6D5DFB] border border-indigo-100 font-bold"
                        : "text-[#525252] hover:bg-[#FAFAF8] hover:text-[#171717]"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-mono ${
                        isSelected
                          ? "bg-[#6D5DFB] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technologies Filter Chips */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Technologies
                </h3>
              </div>
              {selectedTech && (
                <button
                  type="button"
                  onClick={() => setSelectedTech(null)}
                  className="text-[10px] font-mono text-[#6D5DFB] hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {techOptions.map((tech) => {
                const isSelected = selectedTech === tech;
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => {
                      setSelectedTech(isSelected ? null : tech);
                      setVisibleCount(12);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      isSelected
                        ? "bg-[#171717] text-white shadow-xs"
                        : "bg-[#FAFAF8] text-[#525252] border border-[#EAEAEA] hover:border-slate-400 hover:text-[#171717]"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Callout Card: "Something cool?" */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6D5DFB]">
              <Zap className="w-4 h-4 text-[#6D5DFB]" />
              <span>Something cool?</span>
            </div>
            <p className="text-xs text-[#525252] leading-relaxed font-normal">
              I'm always open to interesting collaborations, systems architecture discussions, and new projects!
            </p>
            <Link
              href="/hire-me"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#6D5DFB] hover:underline pt-1"
            >
              <span>Let's Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* Right Projects Workspace Grid */}
        <main className="lg:col-span-9 space-y-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#EAEAEA] rounded-3xl p-8">
              <p className="text-sm font-mono text-slate-500 mb-3">
                No projects matched your selected criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Projects");
                  setSelectedTech(null);
                }}
                className="text-xs font-bold text-[#6D5DFB] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              {/* Project Items Container (Grid vs List) */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {displayedProjects.map(({ project }) => {
                  const avatarColor = getAvatarBadgeStyle(project.title);
                  const initials = getInitials(project.title);

                  return (
                    <article
                      key={project.title}
                      onClick={() => setSelectedArtifact(project)}
                      className="group bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-xs hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* Card Header: Initial Avatar & Tech Pills */}
                        <div className="flex items-start justify-between mb-3.5 gap-2">
                          <div
                            className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center font-extrabold text-xs font-mono shadow-xs ${avatarColor}`}
                          >
                            {initials}
                          </div>

                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-[#F4F4F6] border border-[#EAEAEA] text-[10px] font-mono font-semibold text-[#525252]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors mb-1">
                          {project.title}
                        </h3>

                        {/* Repo / Subtitle */}
                        {project.repo && (
                          <span className="text-[11px] font-mono text-slate-400 mb-2.5 block truncate">
                            {project.repo}
                          </span>
                        )}

                        {/* Description */}
                        <p className="text-[#525252] text-xs leading-relaxed mb-3 line-clamp-3">
                          {project.description}
                        </p>

                        {/* ─── OPTIONAL IMAGE CONTAINER (CRITICAL RULE) ─── */}
                        {/* Only rendered if project.image exists AND loads without error! */}
                        <SafeProjectImage
                          src={project.image}
                          alt={project.title}
                        />
                      </div>

                      {/* Card Footer Links */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 mt-2 border-t border-[#EAEAEA] text-xs font-semibold">
                        {/* GitHub & Stars */}
                        <div className="flex items-center gap-2">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#737373] hover:text-[#171717] transition-colors flex items-center gap-1 font-mono text-[11px]"
                            >
                              <GithubIcon className="w-3.5 h-3.5 text-slate-600" />
                              <span>GitHub</span>
                            </a>
                          )}

                          {project.stars !== undefined && (
                            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span>{project.stars}</span>
                            </span>
                          )}
                        </div>

                        {/* Action Links */}
                        <div className="flex items-center gap-3">
                          {project.details && (
                            <Link
                              href={project.details}
                              className="text-[#6D5DFB] hover:underline transition-colors font-mono text-[11px] inline-flex items-center gap-1"
                            >
                              <span>Case Study</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          )}

                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#10B981] hover:underline transition-colors font-mono text-[11px] inline-flex items-center gap-1"
                            >
                              <span>Live App</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Commercial Products Showcase Section (Shown when on All Projects view) */}
              {selectedCategory === "All Projects" && commercialProducts.length > 0 && (
                <div className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#6D5DFB]" />
                    <span>Featured Commercial Platforms</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {commercialProducts.map((prod) => (
                      <div
                        key={prod.title}
                        className="p-5 rounded-2xl bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/10 border border-indigo-100/80 shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                            PRODUCT
                          </div>
                          <h4 className="text-sm font-bold text-[#171717]">
                            {prod.title}
                          </h4>
                          <p className="text-xs text-[#525252] leading-relaxed mt-1 line-clamp-3">
                            {prod.description}
                          </p>

                          <SafeProjectImage
                            src={prod.image}
                            alt={prod.title}
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          {prod.live && (
                            <a
                              href={prod.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono font-bold text-[#6D5DFB] hover:underline inline-flex items-center gap-1"
                            >
                              <span>Explore</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-6">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#EAEAEA] text-xs font-mono font-bold text-[#525252] hover:text-[#171717] hover:border-slate-400 shadow-xs transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Load more projects</span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {/* ─── ARTIFACT INSPECTOR MODAL ─── */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#EAEAEA] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedArtifact(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${getAvatarBadgeStyle(selectedArtifact.title)}`}>
                  ARTIFACT OBJECT
                </span>
                {selectedArtifact.stars !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{selectedArtifact.stars}</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-[#171717]">{selectedArtifact.title}</h2>
              {selectedArtifact.repo && (
                <p className="text-xs font-mono text-[#6D5DFB]">{selectedArtifact.repo}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                DESCRIPTION &amp; CONTEXT
              </span>
              <p className="text-sm text-[#525252] leading-relaxed">
                {selectedArtifact.description}
              </p>
            </div>

            {/* Optional Safe Image */}
            <SafeProjectImage src={selectedArtifact.image} alt={selectedArtifact.title} />

            {/* Tech Stack */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                TECHNOLOGIES &amp; CONCEPTS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedArtifact.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EAEAEA] flex flex-wrap items-center gap-3">
              {selectedArtifact.github && (
                <a
                  href={selectedArtifact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-white" />
                  <span>Inspect GitHub Repo</span>
                </a>
              )}
              {selectedArtifact.details && (
                <Link
                  href={selectedArtifact.details}
                  onClick={() => setSelectedArtifact(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Read Case Study</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
              {selectedArtifact.live && (
                <a
                  href={selectedArtifact.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setSelectedArtifact(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171717] text-xs font-mono font-bold transition-colors ml-auto cursor-pointer"
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
