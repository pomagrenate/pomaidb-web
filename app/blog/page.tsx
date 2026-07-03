import type { Metadata } from "next";
import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

export const metadata: Metadata = {
  title: "Blog | Quan Van",
  description: "Technical writings on systems engineering, data mining algorithms, and database design by Quan Van.",
};

export default function BlogIndexPage() {
  const allPostsData = getSortedPostsData();

  return (
    <ForestPageShell
      eyebrow="Engineering Blog"
      title="Technical Writing"
      description="Deep dives into low-level database architecture, C++ pattern mining, memory managers, and the mechanics of local-first agent environments."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {allPostsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPostsData.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="fp-card fp-card--hover group block focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#020802] rounded-xl"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="fp-badge">{post.category}</span>
                  <span className="fp-mono-label">{post.date}</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight mb-3 text-white/90 group-hover:text-emerald-300 transition-colors duration-300 leading-snug">
                  {post.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-emerald-900/30">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700" />
                    <span className="text-sm font-semibold text-zinc-300">{post.author}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="fp-card text-center py-12">
            <h2 className="text-xl font-bold text-white/80">No posts yet</h2>
            <p className="mt-3 text-zinc-500 text-sm">
              Add markdown files to <span className="font-mono text-emerald-400/70">content/blog</span> and they will appear here.
            </p>
          </div>
        )}
      </div>
    </ForestPageShell>
  );
}
