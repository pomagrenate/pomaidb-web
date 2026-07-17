import React from "react";
import Link from "next/link";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";
import { PROJECT_GROUPS } from "./projects";

export default function ProjectsIndexPage() {
  return (
    <ForestPageShell
      eyebrow="Engineering Work"
      title="Projects & Systems"
      description="A comprehensive gallery of systems-programming libraries, data-mining engines, local-first RAG components, and operational applications — all designed for predictability and low latency."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="space-y-20">
          {PROJECT_GROUPS.map((group) => (
            <section key={group.category}>
              {/* Group header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="fp-section-dot" aria-hidden="true" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white/90">
                    {group.category}
                  </h2>
                  <p className="text-zinc-500 text-sm mt-0.5">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.projects.map((project, i) => (
                  <article
                    key={project.title}
                    className="fp-card fp-card--hover group flex flex-col h-full"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Card top */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="h-10 w-10 rounded-lg bg-emerald-900/50 border border-emerald-700/30 flex items-center justify-center text-emerald-300 font-bold text-xs font-mono">
                        {project.title.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="fp-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-white/90 group-hover:text-emerald-300 transition-colors mb-1">
                      {project.title}
                    </h3>

                    {project.repo && (
                      <span className="fp-mono-label mb-4 block">{project.repo}</span>
                    )}

                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
                      {project.description}
                    </p>

                    {/* Links */}
                    <div className="flex flex-wrap gap-4 pt-5 border-t border-emerald-900/30 text-xs font-bold mt-auto">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-emerald-400 transition-colors"
                        >
                          GitHub ↗
                        </a>
                      )}

                      {project.details && (
                        <Link href={project.details} className="text-emerald-400/80 hover:text-emerald-300 hover:underline transition-colors">
                          Read Manual
                        </Link>
                      )}

                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400/80 hover:text-emerald-300 hover:underline transition-colors"
                        >
                          Demo Video
                        </a>
                      )}

                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400/80 hover:text-emerald-300 hover:underline transition-colors"
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
    </ForestPageShell>
  );
}