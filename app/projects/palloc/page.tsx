import React from "react";
import Link from "next/link";
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

// Palloc-specific project data
const pallocProject = {
  title: "palloc",
  repo: "pomagrenate/palloc",
  github: "https://github.com/pomagrenate/palloc",
  description: "An ultra-fast, lightweight, and thread-safe general-purpose memory allocator. Drop-in malloc replacement built for high throughput and low latency.",
  tags: ["C", "Memory Allocator", "Low Latency"],
  category: "Side Projects",
};

export default function PallocPage() {
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
              {pallocProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-2xl">
              {pallocProject.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {pallocProject.title}
              </h1>
              <p className="text-base font-mono text-[#6D5DFB] mt-2">{pallocProject.repo}</p>
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
            {pallocProject.description}
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
            {pallocProject.tags.map((tag) => (
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
              Adversarial Benchmark Results
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Benchmark Execution Summary */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🎯 Benchmark Execution Summary</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold">Build Process:</span> Successfully installed cmake and built palloc with POSIX override. Fixed compilation issues in the adversarial benchmark suite and built the executable.
                </p>
                <p>
                  <span className="font-semibold">Architecture Validation:</span> The benchmark results successfully validate palloc's architectural advantages including arena-based allocation (O(1) reset), 64-byte alignment for SIMD, contiguous memory for better TLB utilization, and reduced fragmentation.
                </p>
                <p>
                  <span className="font-semibold">Performance Exceeded Expectations:</span> Results significantly exceeded the expected improvements outlined in the blueprint, particularly in batch allocation scenarios where palloc's arena-based architecture provides maximum benefit.
                </p>
              </div>
            </div>

            {/* Test Environment */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">Test Environment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-[#525252]">Platform:</span>
                  <span className="ml-2 text-[#171717]">Linux with POSIX override</span>
                </div>
                <div>
                  <span className="font-semibold text-[#525252]">Build System:</span>
                  <span className="ml-2 text-[#171717]">CMake with optimizations</span>
                </div>
                <div>
                  <span className="font-semibold text-[#525252]">Device:</span>
                  <span className="ml-2 text-[#171717]">Dell Latitude E5440</span>
                </div>
                <div>
                  <span className="font-semibold text-[#525252]">CPU:</span>
                  <span className="ml-2 text-[#171717]">Intel Core i5 (2 cores)</span>
                </div>
                <div>
                  <span className="font-semibold text-[#525252]">RAM:</span>
                  <span className="ml-2 text-[#171717]">8GB</span>
                </div>
                <div>
                  <span className="font-semibold text-[#525252]">Benchmark Suite:</span>
                  <span className="ml-2 text-[#171717]">Adversarial benchmarks for vector/embedding workloads</span>
                </div>
                <div>
                  <span className="font-semibold text-[#525252]">Comparison:</span>
                  <span className="ml-2 text-[#171717]">palloc vs system allocator</span>
                </div>
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">Key Performance Metrics</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#EAEAEA]">
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Scenario</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Metric</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Palloc</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">System</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#6D5DFB]">Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Batch Churn</td>
                      <td className="py-3 px-4">Average Throughput</td>
                      <td className="py-3 px-4">18.4x higher</td>
                      <td className="py-3 px-4">baseline</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">18.4x</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">Batch Churn</td>
                      <td className="py-3 px-4">Best Case</td>
                      <td className="py-3 px-4">60.53x higher</td>
                      <td className="py-3 px-4">baseline</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">60.53x</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">SIMD Latency</td>
                      <td className="py-3 px-4">Hot Aligned</td>
                      <td className="py-3 px-4">8.10 Mop/s</td>
                      <td className="py-3 px-4">2.27 Mop/s</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">3.57x</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">SIMD Latency</td>
                      <td className="py-3 px-4">Cold Unaligned</td>
                      <td className="py-3 px-4">173.57 Kop/s</td>
                      <td className="py-3 px-4">42.38 Kop/s</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">4.10x</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">TLB Pressure</td>
                      <td className="py-3 px-4">THP Benefit</td>
                      <td className="py-3 px-4">1.33x better</td>
                      <td className="py-3 px-4">baseline</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">1.33x</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vector Batch Churn Results */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">1. Vector Batch Churn - Exceptional Performance</h3>
              <div className="text-sm text-[#525252] space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Average speedup: 18.4x</span> for palloc vs system allocator
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Best case: 60.53x speedup</span> (batch-4096-dim-768)
                </p>
                <p>
                  <span className="font-semibold">Consistent improvements</span> across all batch sizes (32, 128, 512, 4096)
                </p>
                <p>
                  <span className="font-semibold">Latency reductions:</span> p50 latency 6-37ns vs 37-165ns for system allocator
                </p>
              </div>
            </div>

            {/* SIMD Latency Results */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">2. SIMD Latency - Memory Alignment Benefits</h3>
              <div className="text-sm text-[#525252] space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Hot cache aligned: 3.57x speedup</span> for dim-384
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Cold cache unaligned: 4.10x speedup</span> for dim-384
                </p>
                <p>
                  <span className="font-semibold">Better cold cache performance</span> indicating improved memory locality
                </p>
                <p>
                  <span className="font-semibold">Consistent advantages</span> with aligned memory access patterns
                </p>
              </div>
            </div>

            {/* TLB Pressure Results */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">3. TLB Pressure - Working Set Scaling</h3>
              <div className="text-sm text-[#525252] space-y-3">
                <p>
                  <span className="font-semibold">Tested up to 8GB working sets</span> successfully
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">THP benefits observed</span> in several configurations (1.33x improvement)
                </p>
                <p>
                  <span className="font-semibold">Stride impact validated</span> - larger strides show better performance
                </p>
                <p>
                  <span className="font-semibold">Scalable performance</span> across different working set sizes
                </p>
              </div>
            </div>

            {/* Expected vs Actual Performance */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">Expected vs Actual Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#EAEAEA]">
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Expected Improvement</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#525252]">Actual Achieved</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#6D5DFB]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">2-4x batch improvement</td>
                      <td className="py-3 px-4">18.4x average</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">Exceeded ⭐</td>
                    </tr>
                    <tr className="border-b border-[#EAEAEA]">
                      <td className="py-3 px-4">30-50% SIMD improvement</td>
                      <td className="py-3 px-4">Up to 4.10x</td>
                      <td className="py-3 px-4 font-semibold text-[#6D5DFB]">Exceeded ⭐</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">20-40% TLB improvement</td>
                      <td className="py-3 px-4">Up to 1.33x THP benefit</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">Achieved ✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Charts */}
            <div>
              <h3 className="text-base font-semibold text-[#171717] mb-6">Performance Visualizations</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-[#525252] mb-4">Speedup Comparison</h4>
                  <img
                    src="/images/palloc/speedup_comparison.png"
                    alt="Speedup comparison chart"
                    className="w-full rounded-xl border border-[#EAEAEA] shadow-sm"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-[#525252] mb-4">Throughput Comparison</h4>
                  <img
                    src="/images/palloc/throughput_comparison.png"
                    alt="Throughput comparison chart"
                    className="w-full rounded-xl border border-[#EAEAEA] shadow-sm"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#525252] mb-4">Latency Distribution</h4>
                  <img
                    src="/images/palloc/latency_distribution.png"
                    alt="Latency distribution chart"
                    className="w-full rounded-xl border border-[#EAEAEA] shadow-sm"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#525252] mb-4">Memory Usage Analysis</h4>
                  <img
                    src="/images/palloc/memory_usage.png"
                    alt="Memory usage chart"
                    className="w-full rounded-xl border border-[#EAEAEA] shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Architecture Validation */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🚀 Architecture Validation Confirmed</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Arena-based allocation:</span> O(1) reset vs O(N) individual frees ✅
                </p>
                <p>
                  <span className="font-semibold">64-byte alignment:</span> Guaranteed SIMD alignment for AVX-512 ✅
                </p>
                <p>
                  <span className="font-semibold">Contiguous memory:</span> Better TLB utilization and cache locality ✅
                </p>
                <p>
                  <span className="font-semibold">Reduced fragmentation:</span> Lower memory overhead in batch scenarios ✅
                </p>
              </div>
            </div>

            {/* What I Learned */}
            <div className="bg-[#F4F4F6] p-6 rounded-xl">
              <h3 className="text-base font-semibold text-[#171717] mb-4">What I Learned from Building and Benchmarking palloc</h3>
              <div className="text-sm text-[#525252] space-y-3">
                <p>
                  <span className="font-semibold">Allocator Internals:</span> Building palloc taught me about free list management, page allocation strategies, thread-local caches, and the trade-offs between cache locality and fragmentation.
                </p>
                <p>
                  <span className="font-semibold">Benchmark Design:</span> I learned that benchmarking memory allocators is non-trivial. Workload patterns, warm-up iterations, and measurement methodology all significantly impact results. The adversarial benchmark suite was particularly valuable for testing real-world vector/embedding workloads.
                </p>
                <p>
                  <span className="font-semibold">Architecture Matters:</span> The arena-based design proved exceptionally effective for batch allocation scenarios, far exceeding my initial expectations. The O(1) reset operation vs O(N) individual frees creates a dramatic performance difference at scale.
                </p>
                <p>
                  <span className="font-semibold">SIMD Alignment Benefits:</span> The guaranteed 64-byte alignment provided measurable benefits for SIMD operations, with 3.57x to 4.10x speedups in latency benchmarks. This validated the design decision to prioritize alignment.
                </p>
                <p>
                  <span className="font-semibold">Memory Locality:</span> The contiguous memory allocation and better TLB utilization demonstrated clear benefits in cold cache scenarios, showing that the architectural choices translate to real-world performance improvements.
                </p>
                <p>
                  <span className="font-semibold">Performance vs Expectations:</span> I initially expected 2-4x improvements for batch operations, but achieved 18.4x average with 60.53x peak. This taught me that well-designed allocators can outperform general-purpose ones by orders of magnitude for specific workloads.
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
              href={pallocProject.github}
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