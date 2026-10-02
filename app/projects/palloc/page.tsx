import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Palloc - Ultra-Fast Thread-Safe Memory Allocator in C++",
  description:
    "An ultra-fast, lightweight, and thread-safe general-purpose memory allocator. Drop-in malloc replacement built for high throughput and low latency.",
  alternates: {
    canonical: "/projects/palloc",
  },
  openGraph: {
    title: "Palloc - Ultra-Fast Memory Allocator in C++ | Quan Van",
    description:
      "Drop-in malloc replacement and general-purpose memory allocator built for high throughput and predictable low latency.",
    url: "/projects/palloc",
  },
};
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
                  <span className="font-semibold">mimalloc limitation:</span> Microsoft's mimalloc is an excellent general-purpose allocator, but it's not optimized for vector/embedding workloads where memory allocations are contiguous and huge.
                </p>
                <p>
                  <span className="font-semibold">Vector allocation patterns:</span> Vector operations in machine learning and embedding workloads require large, contiguous memory blocks that are allocated and freed in batch patterns, which general-purpose allocators don't handle optimally.
                </p>
                <p>
                  <span className="font-semibold">Performance bottleneck:</span> The overhead of individual malloc/free operations for large contiguous blocks creates significant performance penalties in high-throughput vector processing scenarios.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Starting point:</span> mimalloc (Microsoft Research) - a high-performance general-purpose memory allocator
                </p>
                <p>
                  <span className="font-semibold">Baseline characteristics:</span> Excellent for general workloads, but not optimized for:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Large contiguous memory blocks</li>
                  <li>Batch allocation/deallocation patterns</li>
                  <li>Vector and embedding workloads</li>
                  <li>SIMD-aligned memory access</li>
                </ul>
                <p>
                  <span className="font-semibold">Expected performance:</span> Standard malloc/free overhead for large allocations
                </p>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Forked mimalloc:</span> Created palloc as a specialized fork of mimalloc optimized for vector/embedding workloads
                </p>
                <p>
                  <span className="font-semibold">Key architectural changes:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Arena-based allocation with O(1) reset vs O(N) individual frees</li>
                  <li>64-byte alignment guarantees for SIMD operations (AVX-512)</li>
                  <li>Contiguous memory allocation for better TLB utilization</li>
                  <li>Reduced fragmentation in batch allocation scenarios</li>
                  <li>Optimized for large, contiguous memory blocks</li>
                </ul>
                <p>
                  <span className="font-semibold">Implementation approach:</span> Drop-in malloc replacement via LD_PRELOAD/DYLD_INSERT_LIBRARIES/Windows DLL redirect
                </p>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Test environment:</span> Linux with POSIX override, Dell Latitude E5440, Intel Core i5 (2 cores), 8GB RAM
                </p>
                <p>
                  <span className="font-semibold">Benchmark suite:</span> Adversarial benchmarks for vector/embedding workloads including:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Vector batch churn (batch sizes: 32, 128, 512, 4096)</li>
                  <li>SIMD latency tests (hot/cold cache, aligned/unaligned)</li>
                  <li>TLB pressure tests (working sets up to 8GB)</li>
                  <li>Comparison: palloc vs system allocator</li>
                </ul>
                <p>
                  <span className="font-semibold">Metrics collected:</span> Throughput, latency, memory usage, cache performance, TLB efficiency
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Exceptional batch performance:</span> 18.4x average speedup, 60.53x peak speedup in batch churn scenarios
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">SIMD improvements:</span> 3.57x speedup (hot aligned), 4.10x speedup (cold unaligned) for memory operations
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Latency reductions:</span> p50 latency reduced from 37-165ns (system) to 6-37ns (palloc)
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">TLB benefits:</span> 1.33x improvement in TLB pressure tests with large working sets
                </p>
                <p>
                  <span className="font-semibold">Exceeded expectations:</span> Significantly outperformed expected 2-4x batch improvements, achieving 18.4x average
                </p>
              </div>
              
              {/* Performance Visualizations */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-emerald-900 mb-4">Performance Visualizations</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Speedup Comparison</h5>
                    <img
                      src="/images/palloc/speedup_comparison.png"
                      alt="Speedup comparison chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Throughput Comparison</h5>
                    <img
                      src="/images/palloc/throughput_comparison.png"
                      alt="Throughput comparison chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Latency Distribution</h5>
                    <img
                      src="/images/palloc/latency_distribution.png"
                      alt="Latency distribution chart"
                      className="w-full rounded-lg border border-emerald-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-emerald-800 mb-2">Memory Usage Analysis</h5>
                    <img
                      src="/images/palloc/memory_usage.png"
                      alt="Memory usage chart"
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
                  <span className="font-semibold">Architecture matters for specific workloads:</span> General-purpose allocators like mimalloc are excellent, but specialized allocators can provide order-of-magnitude improvements for specific workload patterns.
                </p>
                <p>
                  <span className="font-semibold">Arena-based allocation power:</span> The O(1) reset operation vs O(N) individual frees creates dramatic performance differences at scale, especially for batch allocation patterns common in ML workloads.
                </p>
                <p>
                  <span className="font-semibold">Memory alignment benefits:</span> Guaranteed 64-byte alignment provided measurable SIMD benefits (3.57x-4.10x), validating the design decision to prioritize alignment for vector operations.
                </p>
                <p>
                  <span className="font-semibold">Benchmark design complexity:</span> I learned that benchmarking memory allocators is non-trivial. Workload patterns, warm-up iterations, and measurement methodology all significantly impact results. The adversarial benchmark suite was crucial for testing real-world vector/embedding workloads.
                </p>
                <p>
                  <span className="font-semibold">Performance vs expectations:</span> I initially expected 2-4x improvements for batch operations, but achieved 18.4x average with 60.53x peak. This taught me that well-designed specialized allocators can outperform general-purpose ones by orders of magnitude for specific workloads.
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