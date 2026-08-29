"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProjectGroup } from "@/app/projects/projects";

export function ProjectsClient({ projectGroups }: { projectGroups: ProjectGroup[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...projectGroups.map((g) => g.category)];
  }, [projectGroups]);

  const filteredGroups = useMemo(() => {
    return projectGroups
      .map((group) => {
        // Filter by category selection
        if (selectedCategory !== "All" && group.category !== selectedCategory) {
          return null;
        }

        // Filter projects by search query
        const filteredProjects = group.projects.filter((p) => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchRepo = p.repo?.toLowerCase().includes(q) || false;
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchRepo || matchTags;
        });

        if (filteredProjects.length === 0) return null;

        return {
          ...group,
          projects: filteredProjects,
        };
      })
      .filter(Boolean) as ProjectGroup[];
  }, [projectGroups, selectedCategory, searchQuery]);

  const totalDisplayedProjects = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.projects.length, 0);
  }, [filteredGroups]);

  return (
    <div className="space-y-12">
      {/* ─── Search & Category Filter Controls ─── */}
      <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Live Search Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by tech, title, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAFAF8] border border-[#EAEAEA] text-sm text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#6D5DFB] focus:ring-1 focus:ring-[#6D5DFB] transition-all font-mono"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Quick Stats Pill */}
          <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-3 text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-widest font-bold">Showing:</span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#6D5DFB] border border-indigo-100 font-extrabold">
              {totalDisplayedProjects} Projects
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#EAEAEA]">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mr-2">
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#171717] text-white shadow-sm"
                    : "bg-[#FAFAF8] text-[#525252] border border-[#EAEAEA] hover:border-slate-400 hover:text-[#171717]"
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Render Project Groups ─── */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#EAEAEA] rounded-3xl p-8">
          <p className="text-sm font-mono text-slate-500 mb-2">No projects matched your criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-xs font-bold text-[#6D5DFB] hover:underline"
          >
            Reset search filters
          </button>
        </div>
      ) : (
        filteredGroups.map((group) => (
          <section key={group.category} className="space-y-6">
            {/* Group Header */}
            <div className="border-b border-[#EAEAEA] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
                  <span>{group.category}</span>
                </div>
                <p className="text-[#737373] text-xs font-normal max-w-2xl">{group.description}</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {group.projects.length} repository items
              </span>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.projects.map((project) => (
                <article
                  key={project.title}
                  className="group bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Bar: Tech Tag Badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-[#6D5DFB] font-extrabold text-xs font-mono shadow-sm">
                        {project.title.substring(0, 2).toUpperCase()}
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

                    <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors mb-1">
                      {project.title}
                    </h3>

                    {project.repo && (
                      <span className="text-[11px] font-mono text-slate-400 mb-3 block">
                        {project.repo}
                      </span>
                    )}

                    <p className="text-[#525252] text-xs leading-relaxed mb-6 flex-1">
                      {project.description}
                    </p>
                  </div>

                  {/* Links Row */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#EAEAEA] text-xs font-semibold">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#737373] hover:text-[#171717] transition-colors flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>GitHub ↗</span>
                      </a>
                    )}

                    {project.details && (
                      <Link
                        href={project.details}
                        className="text-[#6D5DFB] hover:underline transition-colors flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Case Study ↗</span>
                      </Link>
                    )}

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#10B981] hover:underline transition-colors flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Live App ↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
