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

        {/* Benchmark Results */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#6D5DFB]" />
            <h2 className="text-sm font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              Token Savings Benchmark Results
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Benchmark Execution Summary */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🎯 Benchmark Execution Summary</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold">Model:</span> gemini-3.7-flash
                </p>
                <p>
                  <span className="font-semibold">Test Trials:</span> 2 trials per prompt
                </p>
                <p>
                  <span className="font-semibold">Average Token Savings:</span> 34% reduction in output tokens
                </p>
                <p>
                  <span className="font-semibold">Performance Range:</span> 0% to 100% savings depending on prompt category
                </p>
                <p>
                  <span className="font-semibold">Baseline Comparison:</span> ice_age vs normal (uncompressed) context
                </p>
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">Key Performance Metrics</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#EAEAEA]">
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Metric</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Average Savings</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">34%</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Average Normal Tokens</td>
                      <td className="py-3 px-4">167 tokens</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Average ice_age Tokens</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">78 tokens</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Maximum Savings</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">100%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Minimum Savings</td>
                      <td className="py-3 px-4">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category-wise Breakdown */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">Category-wise Token Savings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#EAEAEA]">
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Prompt ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Normal</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">ice_age</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#6D5DFB]">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Setup</td>
                      <td className="py-3 px-4">postgres-pool</td>
                      <td className="py-3 px-4">804 tokens</td>
                      <td className="py-3 px-4">209 tokens</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">74%</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Explanation</td>
                      <td className="py-3 px-4">git-rebase-merge</td>
                      <td className="py-3 px-4">494 tokens</td>
                      <td className="py-3 px-4">139 tokens</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">72%</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Bugfix</td>
                      <td className="py-3 px-4">auth-middleware-fix</td>
                      <td className="py-3 px-4">304 tokens</td>
                      <td className="py-3 px-4">111 tokens</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">63%</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Refactor</td>
                      <td className="py-3 px-4">async-refactor</td>
                      <td className="py-3 px-4">157 tokens</td>
                      <td className="py-3 px-4">0 tokens</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">100%</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Implementation</td>
                      <td className="py-3 px-4">error-boundary</td>
                      <td className="py-3 px-4">718 tokens</td>
                      <td className="py-3 px-4">0 tokens</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">100%</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Debugging</td>
                      <td className="py-3 px-4">react-rerender</td>
                      <td className="py-3 px-4">0 tokens</td>
                      <td className="py-3 px-4">59 tokens</td>
                      <td className="py-3 px-4 text-[#525252]">0%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Code Review</td>
                      <td className="py-3 px-4">pr-security-review</td>
                      <td className="py-3 px-4">0 tokens</td>
                      <td className="py-3 px-4">323 tokens</td>
                      <td className="py-3 px-4 text-[#525252]">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best Performing Categories */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">Best Performing Categories</h3>
              <div className="text-sm text-[#525252] space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Setup questions (74% savings):</span> The postgres-pool configuration question showed the highest savings, indicating ice_age excels at compressing technical setup documentation and code examples.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Explanation questions (72% savings):</span> The git rebase vs merge explanation demonstrated strong compression for conceptual explanations, suggesting ice_age effectively removes redundant explanations.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Bugfix questions (63% savings):</span> The JWT middleware bugfix showed solid savings, indicating effective compression of debugging explanations and code fixes.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Perfect compression (100% savings):</span> Some prompts like async-refactor and error-boundary achieved perfect compression, where ice_age provided the answer while normal mode produced no output.
                </p>
              </div>
            </div>

            {/* Performance Visualizations */}
            <div>
              <h3 className="text-base font-semibold text-[#171717] mb-6">Performance Visualizations</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-[#525252] mb-4">Savings Percentage by Category</h4>
                  <img
                    src="/images/ice_age/savings_percentage.png"
                    alt="Savings percentage chart"
                    className="w-full rounded-xl border border-[#EAEAEA] shadow-sm"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-[#525252] mb-4">Summary Statistics Comparison</h4>
                  <img
                    src="/images/ice_age/summary_stats.png"
                    alt="Summary statistics chart"
                    className="w-full rounded-xl border border-[#EAEAEA] shadow-sm"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#525252] mb-4">Token Comparison</h4>
                  <img
                    src="/images/ice_age/token_comparison.png"
                    alt="Token comparison chart"
                    className="w-full rounded-xl border border-[#EAEAEA] shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* What I Learned */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">What I Learned from the ice_age Benchmarks</h3>
              <div className="text-sm text-[#525252] space-y-3">
                <p>
                  <span className="font-semibold">AST Pruning Effectiveness:</span> The 34% average savings demonstrates that deterministic AST pruning can significantly reduce token consumption without sacrificing answer quality. The 74% savings on setup questions shows particular strength in compressing code-heavy responses.
                </p>
                <p>
                  <span className="font-semibold">Category Performance Variance:</span> I noticed that performance varies significantly by category - setup and explanation questions showed the highest savings (60-74%), while some debugging questions showed 0% or even negative savings. This suggests ice_age's effectiveness depends on the type of code and context being processed.
                </p>
                <p>
                  <span className="font-semibold">Perfect Compression Cases:</span> The 100% savings on some prompts (async-refactor, error-boundary) were particularly interesting. These cases suggest that for certain code patterns, ice_age can provide complete answers while the normal mode fails to produce useful output, indicating superior context handling.
                </p>
                <p>
                  <span className="font-semibold">Trade-offs and Limitations:</span> Some prompts showed 0% or negative savings, indicating that AST pruning isn't universally beneficial. For debugging questions that require full context, the pruning might remove relevant information, resulting in longer responses or failures.
                </p>
                <p>
                  <span className="font-semibold">Real-world Impact:</span> The 34% average savings translates to significant cost reduction in production LLM usage. For teams spending thousands on API tokens, this could represent substantial savings while maintaining code quality and developer productivity.
                </p>
              </div>
            </div>

            {/* Technical Implementation Notes */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔧 Technical Implementation Notes</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">AST-based Pruning:</span> ice_age uses abstract syntax tree analysis to identify and remove code that doesn't affect the current editing context, focusing on relevant scopes and dependencies.
                </p>
                <p>
                  <span className="font-semibold">Deterministic Approach:</span> Unlike ML-based compression, ice_age uses deterministic rules that produce consistent results, making it predictable and reliable for development workflows.
                </p>
                <p>
                  <span className="font-semibold">IDE Integration:</span> The plugin architecture allows seamless integration with popular IDEs, intercepting code context before it reaches the LLM API.
                </p>
                <p>
                  <span className="font-semibold">Language Support:</span> While Go is the implementation language, the AST parsing supports multiple programming languages through language-specific parsers.
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