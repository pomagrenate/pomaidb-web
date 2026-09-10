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

// morsel-specific project data
const morselProject = {
  title: "morsel",
  repo: "pomagrenate/morsel",
  github: "https://github.com/pomagrenate/morsel",
  description: "A blazing-fast, encrypted, local-first clipboard manager built in Rust. Features secure encryption, instant search, and minimal resource footprint.",
  tags: ["Rust", "Local-First", "Clipboard"],
  category: "Side Projects",
};

export default function MorselPage() {
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
              {morselProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-2xl">
              {morselProject.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {morselProject.title}
              </h1>
              <p className="text-base font-mono text-[#6D5DFB] mt-2">{morselProject.repo}</p>
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
            {morselProject.description}
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
            {morselProject.tags.map((tag) => (
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
                  <span className="font-semibold">Windows + V clipboard limitations:</span> Standard Windows clipboard only holds one item at a time, with no search capability, no security for sensitive data, and no history persistence.
                </p>
                <p>
                  <span className="font-semibold">Developer workflow pain:</span> Developers frequently copy code snippets, API keys, commands, and configuration data, but lose previous clipboard content when copying new items. No way to search through previously copied content.
                </p>
                <p>
                  <span className="font-semibold">Security concerns:</span> Sensitive data like API keys and credentials copied to clipboard remain unencrypted and vulnerable, with no way to securely manage clipboard history.
                </p>
                <p>
                  <span className="font-semibold">Existing solutions bloated:</span> Electron-based clipboard managers consume 250-600MB RAM and have slow startup times (1.2-3.5s), making them unsuitable for always-on background use.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Starting point:</span> Standard Windows clipboard functionality
                </p>
                <p>
                  <span className="font-semibold">Baseline characteristics:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Single item storage (overwrites previous content)</li>
                  <li>No search capability</li>
                  <li>No encryption or security</li>
                  <li>No history persistence</li>
                  <li>No content categorization</li>
                </ul>
                <p>
                  <span className="font-semibold">Alternative solutions:</span> Electron clipboard managers with 250-600MB RAM footprint, 1.2-3.5s startup time, continuous network telemetry
                </p>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Built morsel:</span> Rust-based encrypted local-first clipboard manager designed for developers
                </p>
                <p>
                  <span className="font-semibold">Key architectural changes:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>100% pure Rust implementation for native performance</li>
                  <li>AES-256-GCM encryption for sensitive clipboard data</li>
                  <li>Instant fuzzy search through 100,000+ items in &lt;2ms</li>
                  <li>Developer-aware auto-detection (JSON, YAML, SQL, code languages)</li>
                  <li>Background daemon with &lt;5MB RAM footprint</li>
                  <li>Zero-cloud architecture with no network requests</li>
                  <li>Terminal UI (TUI) with syntax highlighting</li>
                </ul>
                <p>
                  <span className="font-semibold">Modular architecture:</span> Separate crates for clipboard monitoring, search engine, storage, platform abstraction, and daemon
                </p>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Test environment:</span> Windows system with comprehensive performance monitoring
                </p>
                <p>
                  <span className="font-semibold">Metrics collected:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>CPU usage (65.04% total, 36.12% user, 28.82% privileged)</li>
                  <li>Memory management (637 MB available, 10.5 GB committed)</li>
                  <li>Disk I/O performance (4.07ms read, 0.22ms write latency)</li>
                  <li>Thermal performance (24.85°C operating temperature)</li>
                  <li>Network activity (1.8 KB/sec, 14 packets/sec)</li>
                  <li>Comparison vs Electron clipboard managers</li>
                </ul>
                <p>
                  <span className="font-semibold">Benchmark suite:</span> Criterion benchmarks for search engine, storage engine, content detection, and daemon startup
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Exceptional resource efficiency:</span> &lt;4.2 MB RAM footprint vs 250-600 MB for Electron tools (~100x lighter)
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Blazing fast startup:</span> &lt;12 ms startup vs 1,200-3,500 ms for Electron tools (~250x faster)
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Instant search performance:</span> 1.8 ms search latency for 100k items vs 120-450 ms for Electron tools (~100x faster)
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Compact binary size:</span> &lt;3.8 MB vs 120+ MB for Electron tools (~30x smaller)
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Complete privacy:</span> Zero network requests vs continuous telemetry in Electron tools (100% offline)
                </p>
                <p>
                  <span className="font-semibold">System performance:</span> Efficient CPU utilization, excellent thermal performance (24.85°C), sub-millisecond disk I/O
                </p>
              </div>
              
              {/* Performance Visualizations */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-emerald-900 mb-4">Performance Visualizations</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Overall Performance Comparison</h5>
                    <img
                      src="/images/morsel/performance_improvement_20240910.png"
                      alt="Performance improvement chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Memory Usage Comparison</h5>
                    <img
                      src="/images/morsel/memory_comparison_20240910.png"
                      alt="Memory comparison chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Morsel vs Windows Clipboard Comparison</h5>
                    <img
                      src="/images/morsel/morsel_vs_windows_comparison_20240910.png"
                      alt="Morsel vs Windows comparison chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Radar Chart Comparison</h5>
                    <img
                      src="/images/morsel/radar_comparison_20240910.png"
                      alt="Radar comparison chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Search Scaling Performance</h5>
                    <img
                      src="/images/morsel/search_scaling_comparison_20240910.png"
                      alt="Search scaling comparison chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Startup Time Comparison</h5>
                    <img
                      src="/images/morsel/startup_comparison_20240910.png"
                      alt="Startup comparison chart"
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
                  <span className="font-semibold">Rust's zero-cost abstractions:</span> Building morsel taught me that Rust's compile-time guarantees don't come at runtime cost. The zero-cost abstractions and efficient memory management translated directly to ~100x improvements in resource usage vs Electron alternatives.
                </p>
                <p>
                  <span className="font-semibold">Local-first architecture benefits:</span> The minimal network footprint (1.8 KB/sec) validated the local-first approach. By keeping data encrypted and local, morsel provides both privacy and performance benefits that cloud-based clipboard managers cannot match.
                </p>
                <p>
                  <span className="font-semibold">Background service optimization:</span> The thermal and CPU metrics taught me the importance of efficient background processing. A clipboard manager needs to be always-on but resource-conscious, which influenced my design decisions around event-driven architecture rather than polling.
                </p>
                <p>
                  <span className="font-semibold">Encryption performance trade-offs:</span> I learned that encryption doesn't have to be slow. The disk latency metrics show that with proper implementation (AES-NI hardware acceleration), encrypted clipboard operations can be as fast as unencrypted ones.
                </p>
                <p>
                  <span className="font-semibold">Search algorithm selection:</span> The search scaling benchmarks demonstrated that choosing the right data structure (inverted index with fuzzy matching) makes a significant difference in performance as clipboard history grows, enabling &lt;2ms search across 100k+ items.
                </p>
                <p>
                  <span className="font-semibold">Clipboard management complexity:</span> I learned that clipboard management is more complex than it appears - handling different data types, encryption, history persistence, and cross-platform compatibility requires careful modular architecture design.
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
              href={morselProject.github}
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