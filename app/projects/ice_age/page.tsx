import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Code2,
  FolderGit2,
  Package,
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

// ice_age-specific project data
const iceAgeProject = {
  title: "ice_age",
  repo: "pomagrenate/ice_age",
  github: "https://github.com/pomagrenate/ice_age",
  description: "Universal IDE plugin & proxy that cuts LLM token consumption by up to 70% using deterministic AST pruning & context compression. Written in Go.",
  tags: ["Go", "AST Pruning", "IDE Plugin"],
  category: "Side Projects",
};

export default function IceAgePage() {
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
              {iceAgeProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-2xl">
              {iceAgeProject.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {iceAgeProject.title}
              </h1>
              <p className="text-base font-mono text-[#6D5DFB] mt-2">{iceAgeProject.repo}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
              Overview
            </h2>
          </div>
          <p className="text-lg text-[#525252] leading-relaxed">
            {iceAgeProject.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
              Technologies & Concepts
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {iceAgeProject.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-lg bg-[#F4F4F6] border border-[#EAEAEA] text-sm font-mono font-semibold text-[#525252]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Problem → Baseline → Change → Measurement → Result → Lesson */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#6D5DFB]" />
            <h2 className="text-sm font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              Project Analysis
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Problem */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h3 className="text-base font-semibold text-red-700 mb-4">🔴 Problem</h3>
              <div className="text-sm text-red-800 space-y-3">
                <p>
                  <span className="font-semibold">AI agent token inefficiency:</span> Modern AI coding agents spend excessive tokens on pleasantries, repeated explanations, filler words, hedging, and redundant context rather than delivering direct technical answers.
                </p>
                <p>
                  <span className="font-semibold">Cost impact:</span> For developers using AI agents throughout the day, verbose responses lead to significant API token costs, especially for teams spending thousands on LLM usage.
                </p>
                <p>
                  <span className="font-semibold">Communication overhead:</span> AI responses optimized for general conversation rather than high-frequency software engineering create unnecessary cognitive load and slower scanning for developers.
                </p>
                <p>
                  <span className="font-semibold">No optimization layer:</span> Existing AI coding tools lack a compression layer to reduce token consumption while maintaining technical accuracy and information density.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Starting point:</span> Normal AI agent responses with full conversational style
                </p>
                <p>
                  <span className="font-semibold">Baseline characteristics:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Pleasantries and greetings ("Sure! I'd be happy to help...")</li>
                  <li>Long-form explanations for simple technical answers</li>
                  <li>Filler words and hedging ("just", "really", "basically")</li>
                  <li>Redundant context and repeated information</li>
                  <li>Articles and unnecessary words</li>
                </ul>
                <p>
                  <span className="font-semibold">Example baseline response:</span> "Sure! I'd be happy to help you understand this issue. The reason this happens is that you're creating a new object reference on every render. React sees that the reference has changed, even if the actual values inside the object remain the same. To fix this issue, you can use the useMemo hook to memoize the object and prevent a new reference from being created on every render."
                </p>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Built ice_age:</span> Universal IDE plugin & proxy that makes AI coding agents communicate in compressed, technical, high-signal prose
                </p>
                <p>
                  <span className="font-semibold">Key architectural changes:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Prompt optimization system that removes filler, pleasantries, and unnecessary articles</li>
                  <li>Deterministic AST pruning to remove irrelevant code context</li>
                  <li>Multiple intensity levels (lite, full, ultra, wenyan)</li>
                  <li>Auto-clarity fallback for security warnings and ambiguous situations</li>
                  <li>Multi-agent support (Claude Code, Cursor, Windsurf, Cline, Copilot, Gemini CLI)</li>
                  <li>Session persistence and mode tracking</li>
                </ul>
                <p>
                  <span className="font-semibold">Implementation approach:</span> Go-based plugin architecture with hooks, skills, and rule files for different AI coding agents
                </p>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Test environment:</span> gemini-3.7-flash model with 2 trials per prompt
                </p>
                <p>
                  <span className="font-semibold">Benchmark methodology:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>10 diverse prompts across categories (debugging, bugfix, setup, explanation, refactor, architecture, code-review, devops)</li>
                  <li>Comparison: ice_age vs normal (uncompressed) context</li>
                  <li>Token count measurement for both input and output</li>
                  <li>Category-wise performance analysis</li>
                </ul>
                <p>
                  <span className="font-semibold">Metrics collected:</span> Average token savings, category-specific performance, perfect compression cases, failure modes
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Overall token savings:</span> 34% average reduction in output tokens (167 tokens → 78 tokens average)
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Best performing categories:</span> Setup questions (74% savings), explanation questions (72% savings), bugfix questions (63% savings)
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Perfect compression cases:</span> 100% savings for refactor and implementation prompts where ice_age provided answers while normal mode failed
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Performance range:</span> 0% to 100% savings depending on prompt category and complexity
                </p>
                <p>
                  <span className="font-semibold">Real-world impact:</span> For teams spending thousands on API tokens, 34% average savings represents substantial cost reduction while maintaining code quality and developer productivity
                </p>
              </div>
              
              {/* Performance Visualizations */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-emerald-900 mb-4">Performance Visualizations</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Savings Percentage by Category</h5>
                    <img
                      src="/images/ice_age/savings_percentage.png"
                      alt="Savings percentage chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Summary Statistics Comparison</h5>
                    <img
                      src="/images/ice_age/summary_stats.png"
                      alt="Summary statistics chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Token Comparison</h5>
                    <img
                      src="/images/ice_age/token_comparison.png"
                      alt="Token comparison chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-base font-semibold text-amber-700 mb-4">🟡 Lesson</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p>
                  <span className="font-semibold">Prompt optimization effectiveness:</span> The 34% average savings demonstrates that removing conversational overhead from AI responses can significantly reduce token consumption without sacrificing technical accuracy or information density.
                </p>
                <p>
                  <span className="font-semibold">Category performance variance:</span> I learned that effectiveness varies significantly by category - setup and explanation questions showed the highest savings (60-74%), while some debugging questions showed 0% or negative savings. This suggests the approach works best for well-structured technical content.
                </p>
                <p>
                  <span className="font-semibold">Deterministic vs ML-based approaches:</span> The deterministic rule-based approach provides consistent, predictable results unlike ML-based compression. This reliability is crucial for development workflows where consistency matters.
                </p>
                <p>
                  <span className="font-semibold">Trade-offs and limitations:</span> Some prompts showed 0% or negative savings, indicating that compression isn't universally beneficial. For debugging questions requiring full context, aggressive pruning might remove relevant information, requiring auto-clarity fallbacks.
                </p>
                <p>
                  <span className="font-semibold">Perfect compression insights:</span> The 100% savings cases (async-refactor, error-boundary) were particularly interesting - ice_age provided complete answers while normal mode failed, suggesting that compression can sometimes improve context handling by removing noise.
                </p>
                <p>
                  <span className="font-semibold">Communication design matters:</span> The project taught me that AI responses should be optimized for engineering workflows (precise → technical → scannable → minimal) rather than general conversation (greeting → disclaimer → repetition → explanation → conclusion → actual answer).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#6D5DFB]" />
            <h2 className="text-sm font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              Explore This Project
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={iceAgeProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#171717] hover:bg-black text-white text-base font-semibold transition-all"
            >
              <GithubIcon className="w-5 h-5 text-white" />
              <span>View on GitHub</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}