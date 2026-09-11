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

// fetchr-specific project data
const fetchrProject = {
  title: "fetchr",
  repo: "pomagrenate/fetchr",
  github: "https://github.com/pomagrenate/fetchr",
  description:
    "A blazing-fast, adaptive multi-connection file downloader and background daemon engine built in Rust. Features dynamic parallel byte-range pipelining, resume recovery, zero-lock positional disk I/O, streaming checksums, and a modern CLI & Desktop UI.",
  tags: [
    "Rust",
    "Async / Tokio",
    "HTTP Range Requests",
    "Adaptive Concurrency",
    "Zero-Lock Positional I/O",
    "Streaming Checksums",
    "Download Engine",
    "CLI & Desktop UI",
  ],
  category: "Side Projects",
};

export default function FetchrPage() {
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
              {fetchrProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-2xl">
              {fetchrProject.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {fetchrProject.title}
              </h1>
              <p className="text-base font-mono text-[#6D5DFB] mt-2">
                {fetchrProject.repo}
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
            {fetchrProject.description}
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
            {fetchrProject.tags.map((tag) => (
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
                  <span className="font-semibold">Single-stream bandwidth underutilization:</span> Standard HTTP download tools and browser engines rely on a single TCP connection per transfer. On high-bandwidth connections (e.g. 500 Mbps to 1 Gbps), high latency, packet loss, or server-side per-connection rate limits often restrict throughput to a fraction of the available capacity (e.g., 2 to 9 MB/s), leaving the connection severely underutilized.
                </p>
                <p>
                  <span className="font-semibold">Thread synchronization & disk lock contention:</span> Existing multi-connection download tools often synchronize chunk writes using a shared mutex or a single file pointer. As multiple download workers complete chunks simultaneously, lock contention and continuous flushing on every seek create an I/O bottleneck that starves download workers.
                </p>
                <p>
                  <span className="font-semibold">The static partitioning straggler trap:</span> Legacy multi-part downloaders divide a file into fixed, static ranges upfront. If one connection encounters network jitter or packet loss, the entire download stalls waiting for that single "straggler" chunk while other connections sit completely idle.
                </p>
                <p>
                  <span className="font-semibold">High memory overhead & post-download verification delays:</span> Buffering large chunks in RAM causes memory usage to balloon into hundreds of megabytes during high-speed multi-gigabyte transfers. Furthermore, verifying file integrity (e.g. SHA-256) usually requires reading the entire file back from disk after the download finishes, adding substantial disk I/O wear and time overhead.
                </p>
                <p>
                  <span className="font-semibold">Tool obsolescence on modern HTTPS endpoints:</span> Classic multi-connection tools on Windows (such as Cygwin-based Axel) haven't received architectural updates in years. They fail completely on modern HTTPS/TLS/SNI endpoints with redirect loops or cipher mismatches.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Starting point:</span> Industry-standard utilities tested across identical network workloads: <code className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">curl</code> (v8.x, single-stream baseline), <code className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">aria2c</code> (v1.37.0, official multi-connection x86_64 Windows build), and <code className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">axel</code> (v2.4, Cygwin-based multi-connection downloader).
                </p>
                <p>
                  <span className="font-semibold">Baseline characteristics:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">curl:</span> Single TCP stream baseline (1.00x), constrained to ~9.07 MB/s on rate-limited CDN streams and ~2.60 MB/s on live public internet routes</li>
                  <li><span className="font-semibold">aria2c:</span> Defaults to a conservative 20 MB minimum split size (<code className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">--min-split-size=20M</code>), limiting concurrency on medium-sized files (e.g., 100 MB), with static segment assignments prone to straggler stalls</li>
                  <li><span className="font-semibold">axel:</span> Suffers from Cygwin POSIX socket emulation overhead on Windows (delivering only ~4.7 MB/s), and fails entirely on modern HTTPS endpoints lacking legacy SSL support</li>
                  <li><span className="font-semibold">Integrity checks:</span> Sequential post-download disk reads required for SHA-256 or MD5 verification</li>
                </ul>
                <p>
                  <span className="font-semibold">Expected performance:</span> Single-stream transfers capped below 10 MB/s, multi-connection tools bottlenecked by static partitioning or socket emulation layers.
                </p>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Built Fetchr in 100% safe, async Rust:</span> Architected a modular parallel download engine designed specifically for high throughput, minimal resource utilization, and adaptive network scheduling.
                </p>
                <p>
                  <span className="font-semibold">Key architectural changes:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-semibold">Dynamic Pipelined Work-Stealing Queue:</span> Rather than statically dividing a file into fixed blocks upfront, Fetchr divides transfers into fine-grained sub-chunks (4x per connection) managed through an asynchronous work queue. Fast connections continuously pull new chunks, eliminating the straggler problem completely.
                  </li>
                  <li>
                    <span className="font-semibold">Zero-Lock Positional Disk I/O:</span> Leveraged native OS positional write capabilities (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">FileExt::seek_write</code> on Windows and <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">FileExt::write_all_at</code> on Unix). Multiple asynchronous download workers stream incoming bytes directly into non-overlapping file offsets simultaneously with zero mutex locking.
                  </li>
                  <li>
                    <span className="font-semibold">Streaming On-The-Fly Checksums:</span> Computes running SHA-256, SHA-512, or MD5 hashes incrementally as network buffers arrive. The file is completely verified the instant the final byte lands, eliminating post-download sequential disk passes.
                  </li>
                  <li>
                    <span className="font-semibold">Adaptive AIMD Concurrency Scheduler:</span> Implemented Additive Increase / Multiplicative Decrease logic that monitors real-time chunk throughput and error rates, dynamically adjusting active connection counts to maximize transfer speed without triggering server rate limits.
                  </li>
                  <li>
                    <span className="font-semibold">Persistent SQLite Task Registry:</span> Embedded SQLite storage tracks chunk completion states. Downloads interrupted by power loss or network disconnection resume seamlessly from exact byte boundaries.
                  </li>
                  <li>
                    <span className="font-semibold">Dual Interface (CLI + Desktop UI):</span> Built a lightweight background daemon (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">fetchr-daemon</code>), a CLI client (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">fetchr-cli</code>), and a real-time web dashboard (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">fetchr-desktop</code>) communicating via JSON-RPC IPC.
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Test environment:</span> Windows Native workstation, Intel Core i7-8550U, SSD storage, evaluated across both controlled local CDN simulations and live public internet routes.
                </p>
                <p>
                  <span className="font-semibold">Benchmark suites:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">Controlled Rate-Limited Mock CDN:</span> Evaluated 10 MB and 100 MB file downloads against an HTTP server configured with a 10 MB/s per-connection rate limit to simulate standard ISP and CDN stream throttling.</li>
                  <li><span className="font-semibold">Concurrency Scaling Sweep:</span> Evaluated performance across 1, 2, 4, 8, and 16 concurrent connection workers to observe scaling linearity and thread scheduling overhead.</li>
                  <li><span className="font-semibold">Live Public Internet Benchmark:</span> 100 MB HTTPS payload downloaded over public internet from OVH CDN (Roubaix, France) under realistic transatlantic network latency, packet jitter, and routing hops.</li>
                  <li><span className="font-semibold">Subsystem Microbenchmarks:</span> Measured range scheduler latency (partitioning 10 GB into 1,280 chunks) and streaming checksum throughput.</li>
                </ul>
                <p>
                  <span className="font-semibold">Metrics collected:</span> Effective throughput (MB/s), total transfer duration (seconds), speedup factor relative to single-stream curl baseline, scaling curve linearity, and TLS/HTTPS protocol compatibility.
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">4.21x peak throughput on 100MB CDN transfers:</span> Fetchr (8 connections) achieved <span className="font-semibold text-[#6D5DFB]">38.17 MB/s</span> compared to 9.07 MB/s for curl (1 connection), 8.24 MB/s for aria2c (8 connections), and 4.73 MB/s for axel (8 connections).
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">4.6x faster transfer completion:</span> On a 100 MB payload, Fetchr completed the download in <span className="font-semibold text-[#6D5DFB]">2.62 seconds</span>, compared to 11.03s for curl, 12.13s for aria2, and 21.16s for axel.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Near-linear concurrency scaling (up to 8.48x):</span> Fetchr scaled from 1.00x at 1 connection to 1.93x (2 conn), 3.66x (4 conn), 5.93x (8 conn), and 8.48x (16 conn). In comparison, aria2 plateaued at ~0.91x due to static splitting constraints, and axel degraded to ~0.5x due to Cygwin socket translation overhead.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">4.94x speedup on live public internet (OVH CDN):</span> On a real-world transatlantic 100 MB HTTPS download, Fetchr (8 connections) sustained <span className="font-semibold text-[#6D5DFB]">12.85 MB/s</span> and finished in 7.78 seconds, versus 38.46 seconds (2.60 MB/s) for curl and 30.80 seconds (3.25 MB/s) for aria2. Axel failed completely due to lack of modern TLS/SNI support.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Microsecond scheduler overhead:</span> The internal range scheduler partitioned a 10 GB file into 1,280 byte ranges in just <span className="font-semibold text-[#6D5DFB]">133.5 µs</span> (0.13 milliseconds), proving zero CPU scheduling bottleneck.
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
                      1. Fetchr Empirical Benchmark Overview Dashboard
                    </h5>
                    <img
                      src="/images/fetchr/fetchr_benchmark_overview.png"
                      alt="Fetchr Benchmark Overview Dashboard"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Comprehensive four-panel overview showing: 100MB CDN throughput (Fetchr achieving 38.17 MB/s vs 9.07 MB/s curl baseline), download duration reduction (2.62s vs 12.13s aria2), live internet CDN performance (12.85 MB/s vs 2.60 MB/s curl), and the architectural comparison matrix across Fetchr, Aria2, and Axel.
                    </p>
                  </div>

                  {/* Chart 2: 100MB CDN Throughput */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      2. 100 MB File Transfer Throughput (Controlled Rate-Limited CDN)
                    </h5>
                    <img
                      src="/images/fetchr/fetchr_vs_others_100mb_throughput.png"
                      alt="100MB File Transfer Throughput Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Throughput comparison under a 10 MB/s per-stream server cap. Fetchr's zero-lock positional disk writes enable it to saturate aggregate bandwidth, delivering 23.31 MB/s (4 conn), 38.17 MB/s (8 conn, 4.21x peak speedup), and 32.26 MB/s (16 conn).
                    </p>
                  </div>

                  {/* Chart 3: Download Duration */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      3. Download Duration Comparison (Lower is Better)
                    </h5>
                    <img
                      src="/images/fetchr/fetchr_vs_others_download_time.png"
                      alt="100MB Download Duration Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Transfer completion duration for a 100 MB payload. Fetchr completes in 2.62s at 8 connections (4.6x faster than aria2 at 12.13s, and 8.1x faster than axel at 21.16s).
                    </p>
                  </div>

                  {/* Chart 4: Live Internet CDN */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      4. Real Public Internet Benchmark: 100MB HTTPS Download (OVH CDN Europe)
                    </h5>
                    <img
                      src="/images/fetchr/fetchr_live_cdn_comparison.png"
                      alt="Live Internet CDN Comparison Chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Real-world public internet evaluation against OVH CDN in Europe. Fetchr achieves 12.85 MB/s and completes in 7.78s (4.94x speedup vs curl's 38.46s). Axel failed completely due to lack of modern TLS/SNI support.
                    </p>
                  </div>

                  {/* Chart 5: Concurrency Scaling Curve */}
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                      5. Multi-Connection Scaling Efficiency vs Concurrency (1 to 16 Threads)
                    </h5>
                    <img
                      src="/images/fetchr/fetchr_scaling_curve.png"
                      alt="Multi-Connection Scaling Efficiency Curve"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                    <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                      Scaling curve illustrating how Fetchr's dynamic pipelined work queue achieves near-linear speedup (up to 8.48x at 16 connections), while aria2 plateaus due to static split limits and axel suffers from POSIX emulation overhead.
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
                  <span className="font-semibold">Multi-connection downloading is not just about opening more sockets:</span> When I started building Fetchr, I assumed simply spawning multiple async tasks would automatically yield linear speedups. I quickly realized that without careful disk I/O coordination, multiple workers downloading concurrently create heavy file-lock contention and cache thrashing.
                </p>
                <p>
                  <span className="font-semibold">Zero-lock positional I/O was the true bottleneck breaker:</span> Moving away from standard sequential file handles to OS-level positional writes (<code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">FileExt::seek_write</code> on Windows) was the single biggest architectural improvement. It allowed workers to write non-overlapping byte ranges simultaneously with zero mutex overhead.
                </p>
                <p>
                  <span className="font-semibold">Static chunk partitioning is a trap on real networks:</span> In my early prototypes, I statically divided files into equal parts (e.g. 4 parts for 4 connections). On real internet links, one connection invariably hit a high-latency route or packet drop, and the entire download stalled waiting for that single worker. Switching to a dynamic work-stealing queue with fine-grained sub-chunks completely eliminated straggler delays.
                </p>
                <p>
                  <span className="font-semibold">Legacy tools carry enormous compatibility debt:</span> Benchmarking against Axel was eye-opening. While Axel is still frequently recommended on forums, testing it against real-world HTTPS CDNs showed that it fails completely on modern TLS/SNI endpoints. Modern tooling requires modern networking stacks (like <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">rustls</code> or <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">native-tls</code>).
                </p>
                <p>
                  <span className="font-semibold">More connections have diminishing returns:</span> In my scaling benchmarks, jumping from 8 to 16 connections yielded smaller throughput gains and, in some live public network runs, slightly increased latency due to TCP handshake overhead and server-side socket throttling. 4 to 8 connections proved to be the sweet spot for most web servers.
                </p>
                <p>
                  <span className="font-semibold">What I want to explore next:</span> I want to investigate integrating QUIC / HTTP/3 multi-stream support, experiment with BBR-inspired congestion window probing algorithms directly inside the scheduler, and test BitTorrent piece verification protocols alongside HTTP range requests.
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
              href={fetchrProject.github}
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
