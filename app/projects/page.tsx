import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PROJECT_GROUPS } from "./projects";

export default function ProjectsIndexPage() {
  return (
    <PageShell
      eyebrow="Engineering Work"
      title="Projects & Systems"
      description="A comprehensive gallery of systems-programming libraries, data-mining engines, local-first RAG components, and operational applications — all designed for predictability and low latency."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="space-y-16">
          {PROJECT_GROUPS.map((group) => (
            <section key={group.category} className="space-y-6">
              {/* Group header */}
              <div className="border-b border-[#EAEAEA] pb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
                  <span>{group.category}</span>
                </div>
                <p className="text-[#737373] text-sm font-normal">{group.description}</p>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.projects.map((project) => (
                  <article
                    key={project.title}
                    className="group bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Initials Badge & Tags */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-[#6D5DFB] font-extrabold text-xs font-mono shadow-sm">
                          {project.title.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {project.tags.slice(0, 2).map((tag) => (
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
                        <span className="text-xs font-mono text-slate-400 mb-3 block">{project.repo}</span>
                      )}

                      <p className="text-[#525252] text-sm leading-relaxed mb-6 flex-1">
                        {project.description}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-[#EAEAEA] text-xs font-semibold">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#737373] hover:text-[#171717] transition-colors flex items-center gap-1"
                        >
                          <span>GitHub ↗</span>
                        </a>
                      )}

                      {project.details && (
                        <Link href={project.details} className="text-[#6D5DFB] hover:underline transition-colors">
                          Read Manual
                        </Link>
                      )}

                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6D5DFB] hover:underline transition-colors"
                        >
                          Demo Video
                        </a>
                      )}

                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] hover:underline transition-colors"
                        >
                          Live App ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}