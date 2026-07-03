import React from "react";
import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/forest-journey/ReadingProgress";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostData(slug);
  } catch (e) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#020802]">
      {/* Glowing reading progress bar */}
      <ReadingProgress />

      {/* Top strip */}
      <div className="border-b border-emerald-900/30 bg-[#030d03]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm font-bold text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
          >
            <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
            Engineering Blog
          </Link>
          <div className="flex gap-3">
            <span className="fp-badge">{post.category}</span>
            <span className="fp-mono-label self-center">{post.date}</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author row */}
        <div className="flex items-center gap-3 mb-14 pb-8 border-b border-emerald-900/30">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800" />
          <span className="text-sm font-semibold text-zinc-300">{post.author}</span>
          <span className="text-zinc-700 mx-1">|</span>
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Technical Essay
          </span>
        </div>

        {/* Content */}
        <div
          className="prose max-w-none industrial-markdown forest-prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
        />

        {/* CTA footer */}
        <div className="mt-24 pt-12 border-t border-emerald-900/30 flex flex-col items-center text-center">
          <p className="text-xs font-mono text-emerald-700 uppercase tracking-widest mb-4">
            End of article
          </p>
          <h3 className="font-bold text-lg text-white mb-6">
            Want to link PomaiDB into your project?
          </h3>
          <Link
            href="/docs"
            className="fp-btn fp-btn--primary px-10 py-3.5 text-sm"
          >
            Read the Engineering Manual
          </Link>
        </div>
      </article>
    </div>
  );
}
