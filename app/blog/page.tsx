import type { Metadata } from "next";
import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";
import { PageShell } from "@/components/page-shell";
import { BlogClient } from "@/components/blog-client";

export const metadata: Metadata = {
  title: "Blog | Quan Van",
  description: "Technical writings on systems engineering, data mining algorithms, and database design by Quan Van.",
};

export default function BlogIndexPage() {
  const allPostsData = getSortedPostsData();

  return (
    <PageShell
      eyebrow="Engineering Journal"
      title="Technical Writing & Essays"
      description="Deep dives into low-level database architecture, C++ pattern mining, memory managers, AI mechanics, and systems engineering."
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-12">
        {/* Blog Manifesto & Introduction Section */}
        <section className="bg-gradient-to-br from-[#FAFAF8] to-white border border-[#EAEAEA] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#6D5DFB]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#6D5DFB] animate-pulse" />
              <span>THE MANIFESTO &bull; BEYOND THE ABSTRACTION</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-snug">
              Don&apos;t stop at &quot;it works.&quot; Ask why.
            </h2>

            <p className="text-[#525252] text-sm sm:text-base leading-relaxed">
              Modern software is built on layers of abstractions—from APIs and frameworks down to OS kernels and physical hardware. This space is dedicated to looking beneath those layers: understanding how systems work internally, exploring trade-offs, and dissecting the engineering behind AI, databases, and low-level software.
            </p>

            {/* Focus Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white border border-[#EAEAEA] rounded-2xl">
                <span className="text-xs font-mono font-bold text-[#6D5DFB] block mb-1">01. SYSTEMS &amp; KERNELS</span>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Sockets, concurrency, memory allocators, compilers, and OS boundaries.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#EAEAEA] rounded-2xl">
                <span className="text-xs font-mono font-bold text-[#6D5DFB] block mb-1">02. AI &amp; ML MECHANICS</span>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Attention, tokenization, quantization, KV caching, and edge inference.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#EAEAEA] rounded-2xl">
                <span className="text-xs font-mono font-bold text-[#6D5DFB] block mb-1">03. ARCHITECTURE &amp; TRADE-OFFS</span>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Analyzing performance, latency, microservices vs monoliths, and building to understand.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/blog/beyond-the-abstraction"
                className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#6D5DFB] hover:text-[#5C4CE5] transition-colors"
              >
                <span>READ THE FULL MANIFESTO</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Interactive Client (Search, Category Filters, Sorting) */}
        <BlogClient posts={allPostsData} />
      </div>
    </PageShell>
  );
}
