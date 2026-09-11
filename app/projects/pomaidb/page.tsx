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

// pomaidb-specific project data
const pomaidbProject = {
  title: "pomaidb",
  repo: "pomagrenate/pomaidb",
  github: "https://github.com/pomagrenate/pomaidb",
  description:
    "A predictable, embedded multimodal vector database and offline RAG engine for Edge AI and resource-constrained devices. Built in C++20 with a zero-OOM memory model, append-only flash storage, and an integrated arena memory allocator.",
  tags: [
    "C++20",
    "Vector Database",
    "Edge AI",
    "Offline RAG",
    "palloc",
    "Zero-OOM",
    "Quantization",
    "Append-Only Storage",
  ],
  category: "Side Projects",
};

export default function PomaiDBPage() {
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
              {pomaidbProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-2xl">
              {pomaidbProject.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {pomaidbProject.title}
              </h1>
              <p className="text-base font-mono text-[#6D5DFB] mt-2">
                {pomaidbProject.repo}
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
            {pomaidbProject.description}
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
            {pomaidbProject.tags.map((tag) => (
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
                  <span className="font-semibold">Cloud-first assumptions on edge devices:</span> Most existing vector databases are built for large cloud servers with tens of gigabytes of RAM, multi-core CPU topologies, and high-end NVMe storage. When deployed on embedded devices such as Raspberry Pi, Orange Pi, or IoT gateways (which often have 512 MB to 2 GB RAM), they frequently crash due to uncontrolled memory growth and Out-Of-Memory (OOM) killer invocations.
                </p>
                <p>
                  <span className="font-semibold">Destructive flash drive wear:</span> Consumer edge devices rely on MicroSD cards or raw eMMC flash memory, which have limited write endurance. Storage engines that rely on frequent in-place updates or heavy background B-tree/LSM compactions suffer from severe Write Amplification Factors (often 5x to 10x), rapidly degrading flash hardware and causing disk I/O stalls.
                </p>
                <p>
                  <span className="font-semibold">Tail latency jitter & thread contention:</span> In real-time edge workloads such as camera gateways or local robotics, unpredictable garbage collection cycles and multithreaded mutex contention introduce large tail latency spikes (p99 and p99.9), making deterministic real-time response times difficult to guarantee.
                </p>
                <p>
                  <span className="font-semibold">Heap fragmentation under continuous influx:</span> High-frequency vector ingestion and deletion cycles cause standard OS heap allocators (<code className="font-mono text-xs bg-red-100 px-1 py-0.5 rounded">glibc malloc</code> or <code className="font-mono text-xs bg-red-100 px-1 py-0.5 rounded">MSVCRT</code>) to suffer from severe external fragmentation, gradually inflating the Resident Set Size (RSS) even when logical data sizes remain constant.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Starting point:</span> Standard embedded vector libraries and databases (such as SQLite with vector search extensions, embedded ChromaDB instances, or raw FAISS/HNSW index graphs) running directly inside resource-constrained environments.
                </p>
                <p>
                  <span className="font-semibold">Baseline characteristics:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Unbounded memory consumption during batch streaming ingestion, leading to process termination by the operating system</li>
                  <li>Frequent random in-place writes and high write amplification factors (5.8x to 9.4x), resulting in rapid MicroSD endurance degradation</li>
                  <li>Multi-threaded synchronization overhead on low-power, low-core ARM architectures</li>
                  <li>Standard system memory allocation with 25% to 30% heap fragmentation under adversarial vector churn</li>
                  <li>Complex external infrastructure requirements and lack of native zero-copy multimodal abstractions</li>
                </ul>
                <p>
                  <span className="font-semibold">Expected trade-off:</span> Inability to sustain continuous streaming vector workloads within strict 32 MB to 64 MB hardware memory envelopes without risking OOM termination or storage wear out.
                </p>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Built PomaiDB in C++20:</span> Designed an embedded, multimodal vector database and offline RAG engine centered around a deliberate principle: <em>one process, one logical database, and one predictable execution path</em>.
                </p>
                <p>
                  <span className="font-semibold">Key architectural changes:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-semibold">Pomegranate storage anatomy:</span> Implemented a two-tier storage hierarchy: an in-memory active <strong>Rind</strong> (MemTable) for immediate vector insert/taste, flushed by an asynchronous <strong>Press</strong> worker into immutable on-disk <strong>Locules</strong> (segments) containing <strong>Arils</strong> (clusters), <strong>Seed Kernels</strong> (quantized/full vectors), <strong>Seed Scars</strong> (metadata filters), and <strong>Pulp</strong> (navigational graph connectivity).
                  </li>
                  <li>
                    <span className="font-semibold">Deterministic zero-OOM memory bounding:</span> Integrated an active <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">auto_freeze_on_pressure</code> mechanism with configurable RSS caps (e.g. 32 MB or 64 MB). When memory pressure is detected, PomaiDB automatically flushes saturated Rinds to disk rather than allowing memory usage to expand indefinitely.
                  </li>
                  <li>
                    <span className="font-semibold">Native palloc memory backbone:</span> Replaced standard heap allocators on the critical vector path with <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">palloc</code>, an arena slab allocator providing guaranteed 64-byte alignment for AVX2/AVX-512 and ARM NEON SIMD operations, with O(1) batch reset capabilities.
                  </li>
                  <li>
                    <span className="font-semibold">Multi-format quantization with SeedKernel reranking:</span> Implemented Float32, FP16, Int8 (SQ8 Pulp), and 1-Bit (Binary Quantization) modes. Fast bitwise Hamming distance and integer dot products scan candidate vectors, followed by exact SeedKernel reranking to preserve accuracy.
                  </li>
                  <li>
                    <span className="font-semibold">Flash-friendly log-structured I/O:</span> Enforced append-only sequential writes and tombstone-based deletions for immutable Locules, achieving a near-ideal 1.05x Write Amplification Factor on flash and MicroSD media.
                  </li>
                  <li>
                    <span className="font-semibold">Single-threaded event loop:</span> Eliminated lock contention, mutex-heavy synchronization, and race conditions across the hot query and ingestion paths.
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Test environment:</span> HP ProBook 450 G5, Intel Core i7-8550U (8 logical threads @ 1.80GHz), 16 GB RAM, SATA SSD, alongside simulated memory-constrained container environments (32 MB to 128 MB RAM ceilings).
                </p>
                <p>
                  <span className="font-semibold">Benchmark suites:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">ci_perf_bench.cc</code>: In-memory Rind insertion and taste queries for 64-dimensional vectors under CI gates</li>
                  <li><code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">comprehensive_bench.cc</code>: 10,000 vectors at 128 dimensions across 1,000 queries with Top-k=10 search</li>
                  <li><code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">quantization_comp_bench.cc</code>: Comparative evaluation of FP32, FP16, SQ8, and 1-Bit BQ across 10,000 vectors at 256 dimensions</li>
                  <li><code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">palloc_env_stress.cc</code>: Microarchitectural hardware PMU metrics, SIMD throughput, cache lines, and TLB pressure</li>
                  <li><code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">benchmark_a (Stress Suite)</code>: Multi-environment validation across <em>IoT Starvation</em> (5k vecs @ 1536-dim), <em>Edge Churn</em> (10k vecs over 5 cycles with leak checking), and <em>Cloud Scale</em> (20k vecs @ 1536-dim with 3 disk flushes)</li>
                </ul>
                <p>
                  <span className="font-semibold">Metrics collected:</span> Ingestion throughput (vectors/sec), latency per vector (µs), query latency percentiles (p50, p90, p95, p99, p99.9), Recall@10 accuracy, resident set size (RSS in MB), Write Amplification Factor (WAF), and data integrity verification.
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Microsecond ingestion latency:</span> Ingestion latency dropped to 8.23 µs per vector in batch mode (up to 121,528 vectors/sec at 128 dimensions) and 10.48 µs for individual single puts.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Deterministic tail latency bounds:</span> Sub-25 ms p50 latency across evaluated dimensions (2.13 ms for 64-dim in-memory Rind, 18.45 ms for 256-dim Int8 SQ8) with a tight p99.9 of 34.10 ms on 256-dim SQ8, completely avoiding garbage collection jitter.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Pareto-efficient quantization:</span> 100.0% Recall@10 preserved across Float32 down to 1-Bit Binary Quantization through SeedKernel reranking, while reducing in-memory size by up to 32x (0.32 MB vs 10.24 MB for 10,000 vectors).
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Deterministic zero-OOM memory bounding:</span> Under a continuous 100,000-vector streaming workload, active RSS remained strictly bounded under the configured 32 MB threshold by automatically freezing Rinds to immutable Locules, whereas unconstrained allocation grew past 120 MB.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Minimal write amplification:</span> Append-only Locule writes achieved a Write Amplification Factor of 1.05x, compared to 7.85x for naive full rewrites, protecting consumer flash and MicroSD cards from premature endurance failure.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Resilience under high-dimensional stress:</span> 100% data integrity verified with zero memory leaks across 5 consecutive restart cycles on massive 1536-dimensional embeddings (6 KiB/vector).
                </p>
              </div>

              {/* Performance Visualizations */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-emerald-900 mb-6">
                  Performance Visualizations & Empirical Charts
                </h4>

                <div className="space-y-8">
                  {/* Chart 8: Overview Dashboard */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      1. Pomegranate Engine Architecture & Benchmark Overview
                    </h5>
                    <img
                      src="/images/pomaidb/08_pomaidb_pomegranate_architecture.png"
                      alt="PomaiDB Pomegranate Engine Benchmark Architecture Overview"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Comprehensive summary showing ingestion throughput across dimensions (up to 131,904 vec/s at 64-dim), 100% Recall@10 across precision modes, microsecond-scale vector ingestion latency (8.23 µs batch), and storage footprint reduction down to 1.6 MB per 100k vectors with 1-Bit BQ.
                    </p>
                  </div>

                  {/* Chart 1: Palloc Memory Supremacy */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      2. Memory Backbone: Palloc Microarchitectural Performance
                    </h5>
                    <img
                      src="/images/pomaidb/01_palloc_memory_supremacy.png"
                      alt="Palloc Memory Supremacy Benchmark Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Empirical evaluation of the integrated <code className="font-mono text-[11px] bg-emerald-100 px-1 py-0.5 rounded">palloc</code> allocator: 8.4x to 60.53x peak speedup in vector batch churn, 6.8x lower p50 allocation latency (14 ns vs 95 ns), 3.57x–4.10x SIMD throughput speedup, and a 33% reduction in TLB pressure over the OS allocator.
                    </p>
                  </div>

                  {/* Chart 2: Ingestion Scaling & Latency */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      3. Ingestion Engine: Mode Scaling & Throughput Profile
                    </h5>
                    <img
                      src="/images/pomaidb/02_edge_vector_db_comparison.png"
                      alt="PomaiDB Ingestion Engine Scaling and Latency Profile"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Ingestion throughput and per-vector latency across single puts (95,408 vec/s, 10.48 µs), sequential WAL appends (117,705 vec/s, 8.50 µs), and tuned batch sizes (up to 121,528 vec/s at 1k batch size) measured across 100,000 vectors at 128 dimensions.
                    </p>
                  </div>

                  {/* Chart 3: Quantization Pareto Frontier */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      4. Quantization Pareto Frontier: Memory Compression vs Accuracy
                    </h5>
                    <img
                      src="/images/pomaidb/03_quantization_pareto_tradeoff.png"
                      alt="PomaiDB Quantization Pareto Frontier"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Pareto frontier comparing Float32 (10.24 MB), FP16 (5.12 MB), Int8 SQ8 (2.56 MB), and 1-Bit BQ (0.32 MB) across 10,000 vectors at 256 dimensions. SeedKernel reranking enables aggressive 32x compression while sustaining 100.0% Recall@10.
                    </p>
                  </div>

                  {/* Chart 4: Latency Percentiles */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      5. Search Latency Percentiles & Tail Predictability
                    </h5>
                    <img
                      src="/images/pomaidb/04_tail_latency_percentiles.png"
                      alt="PomaiDB Tail Latency Percentiles"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Logarithmic latency distribution across percentiles (p50 to p99.9). Single-threaded execution eliminates mutex contention, maintaining sub-millisecond p50 on in-memory Rinds and a tight 34.10 ms p99.9 on 256-dim Int8 SQ8 searches.
                    </p>
                  </div>

                  {/* Chart 5: Memory Bounding */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      6. Deterministic Memory Bounding: Auto-Freeze Mechanism
                    </h5>
                    <img
                      src="/images/pomaidb/05_zero_oom_memory_bounding.png"
                      alt="Deterministic Memory Bounding Auto Freeze Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Continuous 100,000-vector ingestion workload under a 32 MB pressure cap. While an unconstrained memtable accumulates memory past 120 MB (risking container OOM kills), PomaiDB's auto-freeze mechanism deterministically resets the active Rind into immutable Locules.
                    </p>
                  </div>

                  {/* Chart 6: Flash Storage WAF */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      7. Storage Longevity: Append-Only Locule Press vs Full Rewrite
                    </h5>
                    <img
                      src="/images/pomaidb/06_flash_storage_write_amplification.png"
                      alt="Flash Storage Write Amplification Factor Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Write Amplification Factor (WAF) comparison showing PomaiDB's O(1) append-only Press achieving 1.05x WAF versus 7.85x for naive segment rewrites, significantly extending flash and MicroSD drive lifespan on edge hardware.
                    </p>
                  </div>

                  {/* Chart 7: Multi-Environment Stress */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      8. Multi-Environment Stress Benchmark (benchmark_a Suite)
                    </h5>
                    <img
                      src="/images/pomaidb/07_multi_environment_stress.png"
                      alt="PomaiDB Multi-Environment Stress Benchmark Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Validation under three edge conditions using 1536-dimensional embeddings: IoT Starvation (pure in-memory, 1,691 vec/s), Edge Churn (5 restart cycles with zero memory leaks, 1,455 vec/s), and Cloud Scale (sustained with 3 disk flushes, 1,078 vec/s). 100% data integrity verified.
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
                  <span className="font-semibold">Edge constraints forced better architectural choices:</span> When I designed for small devices with 64 MB to 128 MB of RAM, I couldn't rely on bloated distributed abstractions or lazy memory reclamation. Constraining the operating environment forced me to think carefully about every memory allocation, pointer dereference, and disk write.
                </p>
                <p>
                  <span className="font-semibold">The single-threaded execution model paid off:</span> I initially wondered whether avoiding multi-threading would bottleneck query throughput. What I noticed in practice was that eliminating mutex locks and thread synchronizations kept CPU caches hot and eliminated lock contention entirely. The result was predictable microsecond-level ingestion without the random latency spikes typical of multithreaded systems.
                </p>
                <p>
                  <span className="font-semibold">Flash storage endurance is an overlooked constraint:</span> When I first started building PomaiDB, my focus was primarily on vector search speed. However, after investigating how embedded storage works, I realized that high write amplification destroys consumer flash memory within months. Switching to an append-only, log-structured model with tombstone deletions brought the Write Amplification Factor down to 1.05x, which is critical for edge device longevity.
                </p>
                <p>
                  <span className="font-semibold">Quantization with SeedKernel reranking exceeded my expectations:</span> I initially assumed that 1-bit binary quantization would degrade retrieval accuracy too severely for practical RAG workloads. What surprised me was that combining fast bitwise candidate filtering with full-precision SeedKernel reranking achieved 100.0% Recall@10 while reducing memory consumption by 32x.
                </p>
                <p>
                  <span className="font-semibold">Memory bounding requires active backpressure:</span> I learned that passive memory tracking is insufficient on edge hardware. Without active auto-freezing and ingestion backpressure, sudden bursts of incoming data will quickly breach physical memory limits and trigger the OS OOM killer.
                </p>
                <p>
                  <span className="font-semibold">What I still want to investigate:</span> I want to test PomaiDB across a wider variety of physical ARM64 boards (such as the Raspberry Pi Zero 2W and Orange Pi Zero 3), explore writing dedicated ARM NEON vector assembly kernels for distance calculation, and test how the embedded RAG pipeline behaves when paired directly with small quantized local LLMs in offline environments.
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
              href={pomaidbProject.github}
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
