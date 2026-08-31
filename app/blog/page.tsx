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
      eyebrow="ENGINEERING JOURNAL"
      title="WHAT I LEARNED FROM MY STUPID STUFF"
      description="I built something. I broke something. I learned something. Here is the evidence. Read this so you don't have to suffer the way I did."
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-12">
        {/* Blog Manifesto & Introduction Section */}
        <section className="bg-gradient-to-br from-[#FAFAF8] to-white border border-[#EAEAEA] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#6D5DFB]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-6 relative z-10">
            {/* Spatial Room Branding Badge */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#6D5DFB] text-white">ROOM 04</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-[#171717]">THE LIBRARY (THOUGHT STREAM)</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#6D5DFB] animate-pulse" />
              <span>THE MANIFESTO &bull; LESSONS &amp; EVIDENCE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-snug">
              WHAT I LEARNED FROM MY STUPID STUFF
            </h2>

            <div className="text-[#525252] text-sm sm:text-base leading-relaxed space-y-2">
              <p>I built something. I broke something. I learned something.</p>
              <p className="font-semibold text-[#171717]">Here is the evidence.</p>
              <p className="text-[#6D5DFB] font-bold">
                Read this so you don&apos;t have to suffer the way I did.
              </p>
            </div>

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
