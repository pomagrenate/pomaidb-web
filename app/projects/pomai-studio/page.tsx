import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Code2,
  FolderGit2,
  Package,
  Zap,
  Cpu,
  ShieldCheck,
  Flame,
  Layers,
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

// pomai-studio (rust-studio) project data
const pomaiStudioProject = {
  title: "pomai-studio",
  subtitle: "pomagrenate/rust-studio",
  repo: "pomagrenate/rust-studio",
  github: "https://github.com/pomagrenate/rust-studio",
  description:
    "A fast, lightweight, and hackable desktop IDE built from Rust for Rust developers using Tauri v2, Tree-sitter AST, and rust-analyzer. Replaces memory-heavy Electron wrappers and hallucinating statistical AI with deterministic compiler intelligence, sub-15µs typing latency, 30x Tree-sitter incremental re-parsing, and a sub-10MB OS resident memory footprint.",
  tags: [
    "Rust",
    "Tauri v2",
    "Tree-sitter AST",
    "rust-analyzer",
    "B-Tree Rope (Ropey)",
    "Sub-15µs Latency",
    "Prefix-Sum Virtualization",
    "Zero-AI Determinism",
    "Low Memory (Sub-10MB RSS)",
  ],
  category: "Side Projects",
};

const BENCHMARK_METRICS = [
  {
    label: "Typing Latency (100k lines)",
    value: "3.14 µs",
    target: "< 50.00 µs",
    status: "PASS",
  },
  {
    label: "Massive File Typing (500k lines)",
    value: "3.20 µs",
    target: "< 50.00 µs",
    status: "PASS",
  },
  {
    label: "Tree-sitter Incremental Parse",
    value: "307.7 µs (30.1x speedup)",
    target: "< 350.0 µs",
    status: "PASS",
  },
  {
    label: "Rope Memory Overhead Ratio",
    value: "1.13x (3.59MB / 3.16MB)",
    target: "< 1.45x raw",
    status: "PASS",
  },
  {
    label: "100k-Line Document Heap",
    value: "3.59 MB",
    target: "< 5.50 MB",
    status: "PASS",
  },
  {
    label: "Peak OS Working Set (RSS)",
    value: "8.80 MB",
    target: "< 250.00 MB",
    status: "PASS",
  },
  {
    label: "Concurrent Hammer Throughput",
    value: "93,835 ops/s",
    target: "0 deadlocks",
    status: "PASS",
  },
  {
    label: "Document Memory Reclaim",
    value: "0.00 KB residual",
    target: "100% released",
    status: "PASS",
  },
];

export default function PomaiStudioPage() {
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
              {pomaiStudioProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#EA580C] to-[#F97316] flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              🦀
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {pomaiStudioProject.title}
              </h1>
              <p className="text-base font-mono text-[#EA580C] mt-2">
                {pomaiStudioProject.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
              Overview
            </h2>
          </div>
          <p className="text-lg text-[#525252] leading-relaxed">
            {pomaiStudioProject.description}
          </p>
        </div>

        {/* Highlight Scorecard */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-[#EA580C]" />
            <h2 className="text-sm font-mono font-bold text-[#EA580C] uppercase tracking-wider">
              Benchmark SLA Scorecard (100% Pass Rate across 20 Suites)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENCHMARK_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA]"
              >
                <div className="text-xs font-mono text-slate-500">{metric.label}</div>
                <div className="text-lg font-bold text-[#171717] mt-1">{metric.value}</div>
                <div className="flex items-center justify-between text-xs font-mono mt-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Target: {metric.target}</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                    {metric.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
            {pomaiStudioProject.tags.map((tag) => (
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
                  <span className="font-semibold">The memory &amp; latency tax of Electron editors:</span> Mainstream code editors routinely consume 1GB to 3GB+ of RAM even when idle. When opening large codebases or 100,000+ line files, naive text buffers (contiguous strings or flat arrays) freeze during keystrokes because inserting a single character triggers an $O(N)$ memory copy of several megabytes.
                </p>
                <p>
                  <span className="font-semibold">UI stutter from full-document AST re-parsing:</span> When syntax highlighters re-parse an entire document from scratch on each edit, parsing a 1,000-line file takes 9ms–15ms. In a 60 FPS animation loop (where each frame must complete within 16.6ms), dropping 10ms on syntax trees leaves almost zero headroom for layout and rendering, causing noticeable typing lag and frame drops.
                </p>
                <p>
                  <span className="font-semibold">The cost and unreliability of probabilistic AI assistants:</span> Cloud-based AI code assistants introduce latency (500ms–3,000ms per request), drain laptop battery, and require ongoing subscription fees. Worse, in a language with strict affine type systems and borrow checker rules like Rust, statistical models regularly hallucinate invalid lifetimes and non-existent crate methods.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Standard Electron IDE characteristics:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Idle memory usage between 1,200 MB and 2,500 MB RSS across browser render processes.</li>
                  <li>Keystroke latency ranging from 25ms to 80ms under background language server activity.</li>
                  <li>Full-document syntax re-parse times of ~9.27 ms on moderate source files.</li>
                  <li>Document closing often leaves memory fragments due to JavaScript garbage collection delays.</li>
                  <li>Heavy reliance on cloud LLMs with frequent type and borrow checker hallucinations.</li>
                </ul>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Engineered Pomai-Studio (Rust Studio) with Tauri v2 &amp; Native Rust:</span> Rather than bundling a full Chromium browser runtime, I combined a lightweight native Rust core with Tauri v2 and native OS WebViews to deliver a purpose-built Rust IDE.
                </p>
                <p>
                  <span className="font-semibold">Core architectural implementations:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <span className="font-semibold">Logarithmic $O(\log N)$ B-Tree Rope Buffer:</span> Integrated `ropey` to store document text as a balanced B-tree of small text chunks. Inserting or deleting characters at line 50,000 in a 100,000-line file touches only local tree nodes in microseconds, avoiding full-buffer memory reallocations.
                  </li>
                  <li>
                    <span className="font-semibold">Subtree Tree-sitter Incremental AST Parsing:</span> Configured Tree-sitter to record `InputEdit` byte deltas on each keystroke. Instead of discarding the syntax tree, the engine mutates only the damaged syntax subtree in under 350 µs—achieving a &gt;30x speedup over full re-parsing.
                  </li>
                  <li>
                    <span className="font-semibold">Prefix-Sum Viewport Virtualization:</span> Implemented uniform layout resolution executing in 535 nanoseconds, rendering only the 50 visible lines in the viewport for silky 60+ FPS scrolling across files with hundreds of thousands of lines.
                  </li>
                  <li>
                    <span className="font-semibold">Deterministic Zero-AI Compiler Intelligence:</span> Sits directly on top of `rustc`, `rust-analyzer`, and `cargo clippy --message-format=json`. Provides instantaneous (0ms–10ms) diagnostics, automated machine-applicable clippy fixes, and concrete AST quick-fixes with 100% compile-correctness and complete offline privacy.
                  </li>
                  <li>
                    <span className="font-semibold">Zero-Leak Document Cache Engine:</span> Built a document cache manager where closing files immediately reclaims 100% of buffer heap allocations with 0.00 KB residual leaks.
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Rigorous Automated Benchmark Suite:</span> Executed 20 benchmark tests spanning speed, memory allocation, and stability endurance on 2026-09-12 with precise Windows OS performance counters (`K32GetProcessMemoryInfo`).
                </p>
                <p>
                  <span className="font-semibold">Strict target SLAs and results:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">Keystroke typing latency (100k lines):</span> Target &lt; 50.00 µs → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">3.14 µs</code> (PASS)</li>
                  <li><span className="font-semibold">Massive file typing (500k lines / ~18MB):</span> Target &lt; 50.00 µs → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">3.20 µs</code> (PASS)</li>
                  <li><span className="font-semibold">Tree-sitter incremental re-parse:</span> Target &lt; 350.0 µs (&gt; 20x speedup) → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">307.7 µs vs 9.27 ms full (30.1x speedup)</code> (PASS)</li>
                  <li><span className="font-semibold">Rope buffer overhead ratio:</span> Target &lt; 1.45x raw bytes → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">1.13x (3.59MB Rope / 3.16MB Raw)</code> (PASS)</li>
                  <li><span className="font-semibold">50 open files cache scaling:</span> Target &lt; 6.00 MB → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">1.82 MB</code> (PASS)</li>
                  <li><span className="font-semibold">Memory reclaim on close:</span> Target &lt; 100.00 KB → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">0.00 KB residual</code> (PASS)</li>
                  <li><span className="font-semibold">Peak OS working set (RSS):</span> Target &lt; 250.00 MB → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">8.80 MB</code> (PASS)</li>
                  <li><span className="font-semibold">20,000-operation mutation fuzzer:</span> Target 0 panics → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">100.0% integrity (0.13s, 0 panics)</code> (PASS)</li>
                  <li><span className="font-semibold">8-thread concurrent hammer:</span> Target 0 deadlocks → Measured <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">93,835 ops/s (0 race conditions)</code> (PASS)</li>
                </ul>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Microsecond typing responsiveness:</span> Typing remains instantaneous at 3.14 µs regardless of file length, completely eliminating input lag even in massive 500,000-line codebases.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">30x faster syntax updates:</span> Incremental Tree-sitter re-parsing updates the concrete syntax tree in ~308 µs, offloading the main UI thread and preserving smooth 60 FPS rendering.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Minimal memory footprint:</span> With a peak OS RSS of under 9 MB and 50 open documents consuming less than 2 MB of heap, the editor operates with less than 1% of the RAM footprint of typical Electron IDEs.
                </p>
              </div>

              {/* Interface Visualizations */}
              <div className="mt-8 space-y-8">
                <h4 className="text-sm font-semibold text-emerald-900 mb-4">
                  Benchmark Evidence &amp; Visual Analytics
                </h4>

                {/* Image 1: Official Dashboard */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Official Performance, Low-Memory &amp; Stability Benchmark Dashboard
                  </h5>
                  <img
                    src="/images/rust-studio/rust_studio_benchmark_dashboard.png"
                    alt="Rust Studio Official Performance, Low-Memory and Stability Benchmark Dashboard"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    The comprehensive benchmark dashboard demonstrating a 100% SLA pass rate across 20 test suites, a total execution time of 1.65 seconds, and a peak OS working set of only 8.80 MB.
                  </p>
                </div>

                {/* Image 2: Latency Benchmark */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Microsecond Typing &amp; Viewport Latency Breakdown
                  </h5>
                  <img
                    src="/images/rust-studio/rust_studio_latency_benchmark.png"
                    alt="Rust Studio Microsecond Latency Benchmarks"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    Latency measurements confirming 3.14 µs typing latency on 100,000 lines, 3.20 µs on 500,000 lines, 43.31 µs 50-line viewport slice extraction (0.3% of a 60 FPS frame), and 535 ns prefix-sum layout calculation.
                  </p>
                </div>

                {/* Image 3: Tree-sitter Speedup */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Tree-sitter Incremental AST Reparse vs. Full Parse Speedup
                  </h5>
                  <img
                    src="/images/rust-studio/rust_studio_treesitter_speedup.png"
                    alt="Tree-sitter Incremental AST Reparse Speedup"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    Incremental subtree re-parsing completes in 307.7 µs compared to 9.27 ms for full document re-parsing—a 30.1x speedup that guarantees zero UI stutter during high-speed typing.
                  </p>
                </div>

                {/* Image 4: Memory Footprint */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Memory Allocation &amp; Document Heap Overhead Scaling
                  </h5>
                  <img
                    src="/images/rust-studio/rust_studio_memory_footprint.png"
                    alt="Rust Studio Memory Allocation and Heap Scaling"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    Memory scaling showing 1.13x Rope overhead (3.59 MB Rope / 3.16 MB raw), 3.59 MB heap for 100,000 lines, 1.82 MB for 50 open files, and 0.00 KB residual leaks upon closing documents.
                  </p>
                </div>

                {/* Image 5: Stability & Fuzzing */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Endurance, Mutation Fuzzing &amp; Concurrent Hammer Stress Testing
                  </h5>
                  <img
                    src="/images/rust-studio/rust_studio_stability_stress.png"
                    alt="Rust Studio Stability, Stress and Fuzzing Benchmarks"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    Stress testing validating 20,000-operation random mutation fuzzing with 100% integrity (0 panics), 8-thread concurrent hammer throughput of 93,835 ops/s, 2.59 µs degenerate 250KB line handling, and only 29 KB heap growth across 10,000 mutation cycles.
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-base font-semibold text-amber-700 mb-4">🟡 Lesson</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p>
                  <span className="font-semibold">Algorithmic complexity determines editor responsiveness:</span> In my earlier exploration with text editing, I initially used flat strings. On small snippets, everything felt instant, but once a file exceeded 50,000 lines, inserting a single character caused noticeable lag. Moving to a B-tree Rope showed me how $O(\log N)$ operations fundamentally isolate typing performance from document size.
                </p>
                <p>
                  <span className="font-semibold">Incremental parsing is mandatory for smooth UI:</span> When I first wired up syntax highlighting, running full-file AST parses caused frame drops whenever I typed quickly. Feeding byte-level edits into Tree-sitter&apos;s incremental parser reduced re-parse times from 9.27 ms down to 307 µs, making the editor feel butter-smooth.
                </p>
                <p>
                  <span className="font-semibold">Deterministic compiler tooling beats probabilistic guesses:</span> Relying directly on `rust-analyzer` and `clippy` for error checking and refactoring taught me that developers write code much faster when diagnostics are 100% syntax and lifetime correct, rather than sorting through AI suggestions that introduce borrow checker errors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-yellow-50/40 border border-orange-100 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#EA580C]" />
            <h2 className="text-sm font-mono font-bold text-[#EA580C] uppercase tracking-wider">
              Explore This Project
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={pomaiStudioProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#171717] hover:bg-black text-white text-base font-semibold transition-all"
            >
              <GithubIcon className="w-5 h-5 text-white" />
              <span>View Source on GitHub</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
