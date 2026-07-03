import Link from "next/link";
import { getResearchItems } from "@/lib/research";
import { getSortedPostsData } from "@/lib/blog";
import { ForestJourney } from "@/components/forest-journey/ForestJourney";

export default function Home() {
  const researchItems = getResearchItems().slice(0, 3);
  const blogPosts = getSortedPostsData().slice(0, 3);

  return (
    <div className="relative bg-[#020802]">
      {/* ─── Forest Journey Hero ─── */}
      <ForestJourney />

      {/* ─── Transition band ─── */}
      <div
        style={{
          height: "80px",
          background: "linear-gradient(to bottom, #020802, #050505)",
        }}
        aria-hidden="true"
      />

      {/* ─── Recent Research Papers ─── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-emerald-400 uppercase tracking-widest font-mono">
            Academic Work
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Recent Research Publications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchItems.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col border border-emerald-900/40 bg-[#0a140a]/60 backdrop-blur p-6 rounded-xl hover:border-emerald-700/50 transition-all duration-300"
            >
              <span className="text-[9px] w-fit font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-900/30 text-emerald-400 rounded border border-emerald-800/40 mb-4 font-mono">
                {item.date}
              </span>
              <h3 className="text-lg font-bold tracking-tight mb-2 line-clamp-2 text-white">
                {item.title}
              </h3>
              <p className="text-xs text-emerald-300/50 mb-4 font-semibold">
                {item.authors}
              </p>
              <p className="text-sm text-zinc-400 flex-1 line-clamp-3 mb-6">
                {item.abstract}
              </p>
              <Link
                href={item.href}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-emerald-900/40 border border-emerald-700/40 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-800/50 transition-colors"
              >
                Open PDF
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:underline"
          >
            Browse Full Publications <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* ─── Latest Blog Posts ─── */}
      {blogPosts.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 border-t border-emerald-900/20">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-emerald-400 uppercase tracking-widest font-mono">
              Engineering Blog
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Latest Technical Writing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border border-emerald-900/40 bg-[#0a140a]/60 backdrop-blur p-6 rounded-xl hover:border-emerald-700/50 transition-all duration-300"
              >
                <span className="text-[9px] w-fit font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-800/60 text-zinc-400 rounded mb-4 font-mono">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight group-hover:text-emerald-300 transition-colors duration-300 line-clamp-2 mb-2 text-white">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-500 font-mono mb-4">{post.date}</p>
                <p className="text-sm text-zinc-400 line-clamp-3">{post.excerpt}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:underline"
            >
              Go to Engineering Blog <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}

      {/* ─── Bottom fade ─── */}
      <div
        className="h-20"
        style={{ background: "linear-gradient(to bottom, #050505, #050505)" }}
      />
    </div>
  );
}
