import React from "react";
import Link from "next/link";
import { getProjectBySlug, getAllProjectSlugs } from "../projects";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ExternalLink,
  Code2,
  FolderGit2,
  Package,
  Star,
} from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
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

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const projectData = getProjectBySlug(slug);
  
  if (!projectData) {
    notFound();
  }

  const { project, category } = projectData;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717]">
      {/* Top Navigation Strip */}
      <div className="border-b border-[#EAEAEA] bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/projects"
            className="text-sm font-semibold text-[#525252] hover:text-[#6D5DFB] transition-colors flex items-center gap-2 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Projects</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F4F4F6] border border-[#EAEAEA] text-[#171717] text-xs font-semibold">
              {category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-lg">
              {project.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {project.title}
              </h1>
              {project.repo && (
                <p className="text-sm font-mono text-[#6D5DFB] mt-1">{project.repo}</p>
              )}
            </div>
          </div>

          {/* Stars Badge */}
          {project.stars !== undefined && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-semibold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{project.stars} stars</span>
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Overview
            </h2>
          </div>
          <p className="text-base text-[#525252] leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Technologies & Concepts
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-lg bg-[#F4F4F6] border border-[#EAEAEA] text-xs font-mono font-semibold text-[#525252]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full rounded-2xl border border-[#EAEAEA] shadow-xs"
            />
          </div>
        )}



        {/* Action Links */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-4 h-4 text-[#6D5DFB]" />
            <h2 className="text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              Explore This Project
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#171717] hover:bg-black text-white text-sm font-semibold transition-all"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>View on GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-sm font-semibold transition-all"
              >
                <span>View Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Back to Projects */}
        <div className="mt-12 pt-8 border-t border-[#EAEAEA] text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#525252] hover:text-[#6D5DFB] transition-colors"
          >
            <span>← Back to all projects</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
