"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CaseStudyData } from "@/lib/case-studies";

interface CaseStudiesClientProps {
  caseStudies: CaseStudyData[];
}

export function CaseStudiesClient({ caseStudies }: CaseStudiesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Extract unique categories and counts
  const categories = useMemo(() => {
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

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search, Category Filters, Sort */}
      <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies by architecture, microservices, RAG, databases..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-none focus:border-[#6D5DFB] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <label htmlFor="cs-sort-select" className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="cs-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
              className="px-3.5 py-2.5 bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl text-xs font-semibold text-[#171717] focus:outline-none focus:border-[#6D5DFB] transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#EAEAEA]/80">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-2">
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#6D5DFB] text-white shadow-sm"
                    : "bg-[#FAFAF8] text-[#525252] border border-[#EAEAEA] hover:border-[#6D5DFB]/40 hover:text-[#171717]"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#EAEAEA] text-[#737373]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header / Status Bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono font-bold text-[#525252] uppercase tracking-wider">
          SHOWING {filteredAndSortedCaseStudies.length} OF {caseStudies.length} CASE STUDIES
        </span>
        {(searchQuery || selectedCategory !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-xs font-semibold text-[#6D5DFB] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Case Studies Grid */}
      {filteredAndSortedCaseStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedCaseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#171717] text-[11px] font-semibold">
                    {cs.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{cs.date}</span>
                </div>

                {cs.series && (
                  <span className="text-[11px] font-mono text-[#6D5DFB] font-bold block mb-1">
                    {cs.series}
                  </span>
                )}

                <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors leading-snug mb-3">
                  {cs.title}
                </h3>

                <p className="text-[#525252] text-sm leading-relaxed mb-6 line-clamp-3">
                  {cs.excerpt}
                </p>
              </div>

              <div>
                {/* Tags preview */}
                {cs.tags && cs.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cs.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#FAFAF8] border border-[#EAEAEA] text-[10px] font-mono font-medium text-slate-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white text-[10px] font-bold">
                      QV
                    </div>
                    <span className="text-xs font-semibold text-[#171717]">{cs.author}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#6D5DFB] group-hover:underline flex items-center gap-1">
                    <span>Read case study</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#EAEAEA] rounded-3xl text-center py-16 px-6 max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6D5DFB] mx-auto text-xl font-bold">
            ?
          </div>
          <h3 className="text-lg font-bold text-[#171717]">No matching case studies found</h3>
          <p className="text-[#737373] text-sm leading-relaxed">
            No case studies match your search or filter. Try clearing your filters or using different keywords.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 bg-[#6D5DFB] text-white text-xs font-semibold rounded-xl hover:bg-[#5C4CE5] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
