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

// cheesepath-specific project data
const cheesepathProject = {
  title: "cheesepath",
  repo: "pomagrenate/cheesepath",
  github: "https://github.com/pomagrenate/cheesepath",
  description:
    "An ultra-fast, lightweight, all-in-one AI agent framework written in pure Go. Combines linear pipelines, cyclic state graphs, ReAct agent loops, parallel super-steps, time-travel checkpointing, and callbacks into a single compiled runtime with minimal memory footprint.",
  tags: [
    "Go",
    "AI Agent Framework",
    "StateGraph",
    "ReAct Engine",
    "Goroutine Concurrency",
    "Callbacks & Retries",
    "Time-Travel Checkpointing",
    "Zero Dependencies",
  ],
  category: "Side Projects",
};

export default function CheesepathPage() {
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
              {cheesepathProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-2xl">
              {cheesepathProject.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {cheesepathProject.title}
              </h1>
              <p className="text-base font-mono text-[#6D5DFB] mt-2">
                {cheesepathProject.repo}
              </p>
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
            {cheesepathProject.description}
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
            {cheesepathProject.tags.map((tag) => (
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
                  <span className="font-semibold">Multi-package fragmentation:</span> When building local agent workflows, I found that popular Python ecosystems frequently require installing multiple separate, heavyweight libraries—one for linear prompt/chain composition and another separate framework for cyclic state graphs. Managing disparate abstractions, overlapping dependencies, and bloated virtual environments created friction and made small deployments unwieldy.
                </p>
                <p>
                  <span className="font-semibold">Severe memory footprint (RAM bloat):</span> Python-based agent runtimes often require dozens to hundreds of megabytes of resident memory just to import dependencies and initialize the runtime. In high-concurrency production deployments (e.g. running 1,000 to 10,000 concurrent agent workflows) or resource-constrained edge containers, memory usage escalates rapidly into gigabytes (2–4 GB+), creating severe Out-Of-Memory (OOM) risks.
                </p>
                <p>
                  <span className="font-semibold">Framework-level scheduling overhead:</span> Interpreted dynamic typing, deep call stacks, and runtime JSON serialization impose non-trivial overhead on every node transition (often 600 µs to 1 ms per node). In multi-agent DAGs or multi-turn ReAct loops with 20+ tool iterations, pure framework tax can add 30 to 100 ms of latency per request—even before accounting for LLM inference time.
                </p>
                <p>
                  <span className="font-semibold">Weak compile-time safety:</span> Untyped state dictionaries mean schema mismatches, type errors, or typos in state channel keys only surface at runtime, often deep into a multi-turn agent conversation.
                </p>
                <p>
                  <span className="font-semibold">Cold start latency:</span> In containerized serverless or CLI environments, importing heavy multi-package agent libraries requires 200–500 ms just for initialization, making snappy CLI or on-demand execution difficult.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Starting point:</span> Mainstream Python-based agent framework stack (LangGraph 1.2+ alongside LangChain running on Python 3.11 with <code className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">asyncio</code>), evaluated on the exact same physical machine (Intel Core i5-4310U @ 2.00GHz, Windows 11 AMD64) using Zero-Network Mock Isolation (stubbed 0ms LLM calls to measure pure framework tax).
                </p>
                <p>
                  <span className="font-semibold">Baseline characteristics:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">Node transition latency:</span> 666.49 µs per step transition</li>
                  <li><span className="font-semibold">50-Node deep pipeline:</span> 33.32 ms mean traversal, with a p99 tail latency of 118.60 ms, sustaining ~30.0 traversals/sec</li>
                  <li><span className="font-semibold">20-Turn ReAct loop:</span> 27.23 ms mean completion, with a p99 tail of 113.20 ms, sustaining ~36.7 runs/sec</li>
                  <li><span className="font-semibold">Concurrency ceiling:</span> Single-process asyncio event loop saturates at ~205 requests/sec, with 5,000+ concurrent workflows consuming an estimated 2.5–5 GB+ RAM</li>
                  <li><span className="font-semibold">Deployment size:</span> &gt;850 MB virtual environment on disk, ~250 ms cold start import latency</li>
                </ul>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Built Cheesepath in pure Go:</span> Created a lightweight, all-in-one AI agent framework using Go 1.23 standard library only (zero CGO, zero external dependencies).
                </p>
                <p>
                  <span className="font-semibold">Key architectural changes:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-semibold">All-In-One Unified Primitives:</span> Consolidated linear chains (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">chain.LLMChain</code>, <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">chain.Sequential</code>), cyclical state graphs (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">graph.StateGraph[S any]</code>), prebuilt ReAct agents, and memory buffers into a single cohesive library. No need to install multiple disjoint frameworks.
                  </li>
                  <li>
                    <span className="font-semibold">Type-Safe StateGraph via Go Generics:</span> Used Go generics to enforce compile-time type safety across all graph channels, nodes, and reducers. State schema mismatches are caught at build time rather than failing at runtime.
                  </li>
                  <li>
                    <span className="font-semibold">Parallel Goroutine Super-Steps:</span> Replaced heavy thread pools and dynamic event loops with lightweight Go goroutines (~2 KB initial stack). Branching nodes execute concurrently with microsecond-level scheduling overhead (~5 µs per transition).
                  </li>
                  <li>
                    <span className="font-semibold">State Channels & Reducers:</span> Implemented channel-based state propagation with composable reducers (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">Overwrite</code>, <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">Append</code>, or custom user functions) to safely merge concurrent branch updates.
                  </li>
                  <li>
                    <span className="font-semibold">Time-Travel Checkpointing & HITL:</span> Built thread-scoped snapshot interfaces (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">MemorySaver</code>, <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">FileSaver</code>) supporting time-travel state replay and human-in-the-loop (HITL) node interrupts for approval workflows.
                  </li>
                  <li>
                    <span className="font-semibold">Built-In Reliability & Callbacks:</span> Integrated OpenInference-compliant tracing spans, exponential backoff retries with jitter, and fallbacks directly into runnable abstractions.
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Test environment:</span> Intel Core i5-4310U @ 2.00GHz (2 cores / 4 threads), 8 GB RAM, Windows 11 AMD64, under Zero-Network Mock Isolation (mock LLM & tool stubs returning 0ms synthetic outputs) to measure pure framework execution overhead.
                </p>
                <p>
                  <span className="font-semibold">Benchmark suite:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">Scenario A (Deep Pipeline):</span> 50 sequential nodes evaluating pure step transition latency and DAG execution overhead.</li>
                  <li><span className="font-semibold">Scenario B (Cyclic ReAct Loop):</span> 20 consecutive tool-calling cycles with JSON schema parsing and channel reducer merges.</li>
                  <li><span className="font-semibold">Scenario C (Concurrency Saturation):</span> Multi-agent triage workflows scaling from 100 to 1,000, 5,000, and 10,000 simultaneous concurrent executions.</li>
                  <li><span className="font-semibold">Scenario D (Nested Subgraphs):</span> 3 nested state graphs with conditional routing and dynamic state propagation.</li>
                </ul>
                <p>
                  <span className="font-semibold">Metrics collected:</span> Step transition latency (µs), mean execution duration (ms), p50/p99 tail latencies, throughput (workflows/sec), peak resident set size (RSS in MB), and cold start / binary size.
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Microsecond node transitions:</span> Step transition latency dropped from 666.49 µs in Python down to <span className="font-semibold text-[#6D5DFB]">2.33–5.48 µs</span> in Cheesepath (~120x–286x faster).
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">122x faster 50-node pipeline traversal:</span> Completed the 50-node sequential pipeline in <span className="font-semibold text-[#6D5DFB]">0.27 ms</span> (vs 33.32 ms), with a p99 tail latency of 1.52 ms (vs 118.60 ms), achieving 3,648 to 8,571 traversals/sec (vs 30.0 ops/s).
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">48x faster ReAct tool loops:</span> A 20-turn cyclical ReAct loop completed in <span className="font-semibold text-[#6D5DFB]">0.56 ms</span> (vs 27.23 ms), sustaining 1,259 to 1,775 runs/sec (vs 36.7 runs/sec).
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Extreme concurrency scalability (10k flows in 72 MB):</span> At 10,000 simultaneous concurrent workflows, Cheesepath sustained <span className="font-semibold text-[#6D5DFB]">55,580 req/s</span> (completing all 10k workflows in 179.9 ms total wall time) while consuming only <span className="font-semibold text-[#6D5DFB]">72.2 MB peak RAM</span>. In contrast, the Python baseline saturated at ~205 req/s and was unviable at 5,000+ flows due to severe OOM risks (&gt;2–4 GB).
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">47x smaller deployment footprint:</span> Self-contained compiled binary of <span className="font-semibold text-[#6D5DFB]">18 MB</span> with an instant cold start of <span className="font-semibold text-[#6D5DFB]">&lt;1 ms</span> (vs 850 MB virtual environment and 250 ms import latency in Python).
                </p>
              </div>

              {/* Performance Visualizations */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-emerald-900 mb-6">
                  Performance Visualizations & Empirical Charts
                </h4>

                <div className="space-y-8">
                  {/* Chart 1: Overview Dashboard */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      1. Architectural Advantage Overview Dashboard
                    </h5>
                    <img
                      src="/images/cheesepath/cheesepath_vs_langgraph_overview.png"
                      alt="Cheesepath Architectural Advantage Overview Dashboard"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Four-panel summary comparing Cheesepath (Go) and Python-based frameworks: execution latency reduction across nodes and pipelines, workflow throughput scaling (up to 285x higher), memory consumption under high concurrency (72 MB vs 6 GB+), and deployment artifact footprint (18 MB vs 850 MB with sub-millisecond cold start).
                    </p>
                  </div>

                  {/* Chart 2: Latency Comparison */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      2. Execution Latency Comparison (Logarithmic Scale)
                    </h5>
                    <img
                      src="/images/cheesepath/latency_comparison.png"
                      alt="Cheesepath Latency Comparison Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Pure framework overhead across four workload scenarios under zero-network mock isolation. Single node step transitions take only 2.33 µs (vs 666.5 µs), 50-node deep pipelines complete in 0.12 ms (vs 33.3 ms), and 20-turn ReAct loops finish in 0.79 ms (vs 27.2 ms).
                    </p>
                  </div>

                  {/* Chart 3: Throughput Comparison */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      3. Throughput Scalability (Workflows / Second)
                    </h5>
                    <img
                      src="/images/cheesepath/throughput_comparison.png"
                      alt="Cheesepath Throughput Comparison Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Throughput comparison across 50-node pipelines (8,571 ops/s vs 30 ops/s), 20-turn ReAct loops (1,259 runs/s vs 36.7 runs/s), nested subgraphs (20,405 runs/s vs 169 runs/s), and concurrent triage (47,699 req/s vs 205 req/s).
                    </p>
                  </div>

                  {/* Chart 4: Concurrency & RAM Scalability */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      4. High-Concurrency Stress Test & Resident Memory Scaling
                    </h5>
                    <img
                      src="/images/cheesepath/concurrency_scalability.png"
                      alt="Cheesepath Concurrency Scalability Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Saturation curve and RAM footprint scaling from 100 to 10,000 simultaneous workflows. Lightweight Go goroutines maintain a flat, predictable memory profile (44.2 MB at 1,000 flows, 72.2 MB at 10,000 flows), whereas Python asyncio workflows encounter severe OOM risks above 5,000 flows.
                    </p>
                  </div>

                  {/* Chart 5: Production Reliability Scorecard */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      5. Enterprise Production Reliability Scorecard
                    </h5>
                    <img
                      src="/images/cheesepath/reliability_scorecard.png"
                      alt="Cheesepath Reliability Scorecard Radar Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Radar comparison evaluating key production multi-agent criteria: transactional idempotency, self-healing workflows with jitter retries and fallbacks, active reflection guardrails, OpenInference telemetry, concurrency memory efficiency, and microsecond transition latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-base font-semibold text-amber-700 mb-4">🟡 Lesson</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p>
                  <span className="font-semibold">All-in-one cohesion beats fragmented multi-library setups:</span> I initially thought separating chains from graphs was a clean modular approach. In practice, needing to install and coordinate two large, separate frameworks added mental overhead and dependency bloat. Unifying chains, cyclical state graphs, and ReAct loops into one library made building agents much simpler and more enjoyable.
                </p>
                <p>
                  <span className="font-semibold">Go generics are a natural fit for stateful graphs:</span> In dynamically typed Python runtimes, state channel schemas are validated at runtime or not at all, which led to silent bugs midway through multi-turn agent conversations. Using Go generics (<code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">StateGraph[S any]</code>) caught state mismatches at compile time while preserving full flexibility for custom reducers.
                </p>
                <p>
                  <span className="font-semibold">Goroutines completely changed concurrency scaling:</span> I was astonished to see 10,000 simultaneous workflows finish in 180 ms while consuming only 72 MB of RAM. Because Go goroutines start with just 2 KB of stack space, I could run thousands of parallel agent super-steps without worrying about process memory limits or event loop starvation.
                </p>
                <p>
                  <span className="font-semibold">Framework overhead matters even when LLMs are slow:</span> People often assume that because LLM network requests take 500 ms, framework overhead doesn't matter. But in high-throughput multi-agent triage, local edge LLM setups, or multi-turn agent loops with 20+ tool iterations, saving 25–30 ms per turn and hundreds of megabytes of RAM makes a massive difference in operational reliability and hosting cost.
                </p>
                <p>
                  <span className="font-semibold">Reliability requires first-class retry and callback primitives:</span> An agent framework is only as good as its failure handling. Adding exponential backoff retries with jitter and OpenInference-compatible callback tracing directly into the runnable core made real-world agent behavior predictable instead of flaky.
                </p>
                <p>
                  <span className="font-semibold">What I want to explore next:</span> I want to explore compiling Cheesepath to WebAssembly (WASM) so stateful agent graphs can run directly inside browser runtimes, investigate integrating local embedded C++ engines (like PomaiDB) directly via CGO-free IPC, and implement distributed checkpoint backends for long-lived agent sessions.
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
              href={cheesepathProject.github}
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
