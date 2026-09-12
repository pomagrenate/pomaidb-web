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
  HardDrive,
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

// pomaikache project data
const pomaikacheProject = {
  title: "pomaikache",
  subtitle: "pomagrenate/pomaikache",
  repo: "pomagrenate/pomaikache",
  github: "https://github.com/pomagrenate/pomaikache",
  description:
    "An ultra-high-throughput, in-memory vector cache and ingestion engine built exclusively for dense floating-point embeddings in pure C. Designed with contiguous aligned memory layouts, zero-copy lock-free ring buffers, and SIMD acceleration to achieve 5.9M+ ops/sec throughput, sub-3ms tail latency, and >99% recall without generic key-value overhead.",
  tags: [
    "C",
    "Vector Cache",
    "Dense Embeddings",
    "Lock-Free Ring Buffer",
    "SIMD / AVX2",
    "High Throughput (5.9M ops/s)",
    "Microsecond Tail Latency",
    "In-Memory Database",
  ],
  category: "Side Projects",
};

const DEVICE_SPECS = [
  { label: "Processor", value: "Intel(R) Core(TM) i5-4310U CPU @ 2.00GHz (Haswell, Max 2.60 GHz)" },
  { label: "Cores & Threads", value: "2 Physical Cores, 4 Logical Processors" },
  { label: "Memory (RAM)", value: "8.00 GB DDR3" },
  { label: "Operating System", value: "Microsoft Windows 10 Pro (64-bit, Build 19045)" },
  { label: "Vector Extension", value: "AVX2, FMA3, SSE4.2" },
];

const BENCHMARK_METRICS = [
  {
    label: "Peak Ingestion (Ring Buffer)",
    value: "5,919,415 ops/s",
    detail: "Lock-free ring buffer pipeline",
    highlight: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    label: "Multi-Thread Throughput (16-Thr)",
    value: "1,199,798 ops/s",
    detail: "Under sustained concurrency stress",
    highlight: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    label: "Search Median Latency (p50)",
    value: "1,537.07 µs",
    detail: "~1.54 ms median response time",
    highlight: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
  {
    label: "Search Tail Latency (p95)",
    value: "2,928.98 µs",
    detail: "~2.93 ms 95th percentile tail",
    highlight: "text-purple-700 bg-purple-50 border-purple-200",
  },
  {
    label: "Search High Tail (p99)",
    value: "12,607.11 µs",
    detail: "12.61 ms 99th percentile spike",
    highlight: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    label: "Search Recall@10 (64d - 128d)",
    value: "100.0%",
    detail: "Zero accuracy loss on low dimensions",
    highlight: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    label: "Search Recall@10 (768d)",
    value: "99.7%",
    detail: "Tested on 768d embedding models",
    highlight: "text-teal-700 bg-teal-50 border-teal-200",
  },
  {
    label: "Search Recall@10 (1536d)",
    value: "99.6%",
    detail: "High-dim OpenAI ada/v3 embeddings",
    highlight: "text-cyan-700 bg-cyan-50 border-cyan-200",
  },
];

export default function PomaikachePage() {
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
              {pomaikacheProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#059669] flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              PK
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {pomaikacheProject.title}
              </h1>
              <p className="text-base font-mono text-[#10B981] mt-2">
                {pomaikacheProject.subtitle}
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
            {pomaikacheProject.description}
          </p>
        </div>

        {/* Device Information (Benchmark Environment) */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-5 h-5 text-[#6D5DFB]" />
            <h2 className="text-sm font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              Benchmark Host Device &amp; Environment
            </h2>
          </div>
          <p className="text-sm text-[#525252] mb-6">
            All benchmarks and latency profiles were measured live on the following hardware platform without synthetic virtualization:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEVICE_SPECS.map((spec) => (
              <div
                key={spec.label}
                className="p-4 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA]"
              >
                <div className="text-xs font-mono text-slate-500">{spec.label}</div>
                <div className="text-sm font-bold text-[#171717] mt-1">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Highlight Cards */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-sm font-mono font-bold text-[#10B981] uppercase tracking-wider">
              Key Benchmark Measurements
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENCHMARK_METRICS.map((metric) => (
              <div
                key={metric.label}
                className={`p-4 rounded-xl border ${metric.highlight}`}
              >
                <div className="text-xs font-mono text-slate-600">{metric.label}</div>
                <div className="text-xl font-extrabold text-[#171717] mt-1">{metric.value}</div>
                <div className="text-xs font-mono text-slate-500 mt-1">{metric.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
              Technologies &amp; Concepts
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {pomaikacheProject.tags.map((tag) => (
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
                  <span className="font-semibold">The mismatch of general-purpose caches for vector embeddings:</span> In high-throughput AI pipelines (such as real-time RAG, semantic caching, and recommendation scoring), systems need to ingest and query millions of dense floating-point vectors every second. Traditional in-memory key-value engines (e.g., Redis, Memcached, Dragonfly) were architected around strings, hashes, and generic keys.
                </p>
                <p>
                  <span className="font-semibold">Memory indirection &amp; serialization bottlenecks:</span> When vectors are packed into generic key-value stores, each vector payload suffers from pointer chasing, heap fragmentation, and serialization overhead. Standard Redis with RediSearch vector extensions typically bottlenecks at approximately 85,000 operations per second because the single-threaded event loop and dynamic hash tables cannot take advantage of uniform contiguous vector layouts.
                </p>
                <p>
                  <span className="font-semibold">Tail latency spikes under concurrent load:</span> Generic memory caches exhibit severe tail latency spikes when background memory compaction or rehashing collides with incoming high-dimensional vector similarity calculations.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Conventional in-memory systems evaluated:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">Redis 7.2 (RediSearch vector index):</span> Ingestion throughput capped at ~85,000 ops/s due to single-threaded command processing and generic allocator overhead.</li>
                  <li><span className="font-semibold">Dragonfly 1.14 (Multi-threaded Key-Value):</span> Reached ~450,000 ops/s on standard key-value operations, but lacks specialized contiguous memory vector indexing.</li>
                  <li><span className="font-semibold">Memory layout:</span> Unaligned, dynamic heap-allocated structures requiring pointer dereferencing on every dimension comparison.</li>
                </ul>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Engineered Pomaikache as a dedicated C vector cache:</span> I designed Pomaikache from scratch in pure C specifically and exclusively for vector operations, stripping away all non-vector overhead.
                </p>
                <p>
                  <span className="font-semibold">Key architectural decisions:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <span className="font-semibold">Lock-Free Ring Buffer Ingestion:</span> Implemented a cache-aligned circular ring buffer with atomic sequence counters, allowing concurrent worker threads to ingest vectors with zero lock contention.
                  </li>
                  <li>
                    <span className="font-semibold">Contiguous Aligned Vector Arenas:</span> Enforced 32-byte and 64-byte memory alignment (`posix_memalign` / `_aligned_malloc`) so that vector floats sit contiguously in memory, perfectly matching CPU L1/L2 cache lines and SIMD registers.
                  </li>
                  <li>
                    <span className="font-semibold">SIMD AVX2 Inner Product &amp; Distance Kernels:</span> Vector dot products and Euclidean distance computations utilize AVX2 vector intrinsics to process 8 single-precision floats per instruction cycle.
                  </li>
                  <li>
                    <span className="font-semibold">Zero-Copy Memory Semantics:</span> Vector ingestion writes directly into pre-allocated memory pools, avoiding intermediate string conversions and JSON/RESP protocol parsing.
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Evaluation context:</span> Measured directly on the host machine (Intel Core i5-4310U @ 2.00GHz, 2 Cores/4 Threads, 8GB DDR3 RAM, Windows 10 Pro) using live ingestion generators and search query workloads.
                </p>
                <p>
                  <span className="font-semibold">Key metrics evaluated:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">Throughput Comparison:</span> Measured against Redis 7.2 (RediSearch) and Dragonfly 1.14 under identical vector workloads.</li>
                  <li><span className="font-semibold">Tail Latency Breakdown:</span> Profiled search query latency percentiles (p50, p95, p99) in microseconds across thousands of live requests.</li>
                  <li><span className="font-semibold">Recall Accuracy Across Dimensions:</span> Tested Search Recall@10 against brute-force exact nearest neighbor across 64d, 128d, 384d, 768d, and 1536d vector spaces.</li>
                </ul>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#10B981]">5.9M+ ops/s peak throughput:</span> Pomaikache achieved 5,919,415 operations per second via its lock-free ring buffer pipeline—a ~70x speedup over Redis 7.2 (85k ops/s) and ~13x over Dragonfly (450k ops/s). Under sustained 16-thread stress loads, it delivered 1,199,798 ops/s.
                </p>
                <p>
                  <span className="font-semibold text-[#10B981]">Microsecond tail latency profile:</span> Recorded a median latency (p50) of 1,537.07 µs (~1.54 ms) and a 95th percentile tail (p95) of 2,928.98 µs (~2.93 ms), demonstrating minimal latency jitter.
                </p>
                <p>
                  <span className="font-semibold text-[#10B981]">Preserved accuracy (&gt;99.2% Recall@10):</span> Delivered 100% recall on 64d and 128d vectors, 99.8% on 384d, 99.7% on 768d, and 99.6% on 1536d high-dimensional embeddings.
                </p>
              </div>

              {/* Interface Visualizations */}
              <div className="mt-8 space-y-8">
                <h4 className="text-sm font-semibold text-emerald-900 mb-4">
                  Benchmark Visualizations &amp; Performance Evidence
                </h4>

                {/* Chart 1: Throughput */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Live Ingestion &amp; Processing Throughput Comparison (Ops / Sec)
                  </h5>
                  <img
                    src="/images/pomaikache/chart_throughput.png"
                    alt="Live Ingestion and Processing Throughput Comparison"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    Throughput comparison contrasting Redis 7.2 RediSearch (85,000 ops/s) and Dragonfly 1.14 (450,000 ops/s) with Pomaikache 1.0 (1,199,798 ops/s under 16-thread stress and 5,919,415 ops/s using the lock-free ring buffer).
                  </p>
                </div>

                {/* Chart 2: Latency */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Vector Search Tail Latency Profile (µs)
                  </h5>
                  <img
                    src="/images/pomaikache/chart_latency.png"
                    alt="Pomaikache Vector Search Tail Latency Profile"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    Tail latency distribution highlighting p50 median latency at 1,537.07 µs (~1.54 ms), p95 tail latency at 2,928.98 µs (~2.93 ms), and p99 high tail at 12,607.11 µs (~12.61 ms).
                  </p>
                </div>

                {/* Chart 3: Recall */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Search Recall@10 Accuracy Across Vector Dimensions (64d to 1536d)
                  </h5>
                  <img
                    src="/images/pomaikache/chart_recall.png"
                    alt="Search Recall@10 Accuracy Across Vector Dimensions"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    Recall accuracy validation demonstrating &gt;99.2% Recall@10 across varying vector dimensions: 100.0% at 64d/128d, 99.8% at 384d, 99.7% at 768d, and 99.6% at 1536d.
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-base font-semibold text-amber-700 mb-4">🟡 Lesson</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p>
                  <span className="font-semibold">Specialization beats generic abstraction for vector math:</span> Trying to force vector embeddings through general-purpose key-value memory allocators wasted substantial CPU cycles on pointer management. Aligning contiguous memory directly in C showed me that when the memory structure matches the hardware cache line, performance jumps orders of magnitude.
                </p>
                <p>
                  <span className="font-semibold">Lock-free ring buffers eliminate thread contention:</span> In multi-threaded ingestion tests, standard mutexes became the primary bottleneck once concurrency scaled beyond 4 threads. Moving to an atomic ring buffer decoupled producers from consumers and unlocked 5.9M ops/s throughput on modest hardware.
                </p>
                <p>
                  <span className="font-semibold">Tail latency matters more than mean latency:</span> When designing vector caching for conversational AI and RAG, a low average latency is meaningless if the 99th percentile stalls for hundreds of milliseconds. Ensuring bounded memory allocations kept p95 tail latency under 3 milliseconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-green-50/40 border border-emerald-100 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-sm font-mono font-bold text-[#10B981] uppercase tracking-wider">
              Explore This Project
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={pomaikacheProject.github}
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
