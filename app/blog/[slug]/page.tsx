import React from "react";
import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/forest-journey/ReadingProgress";
import { SocialShare } from "@/components/social-share";

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

  const allPosts = getSortedPostsData();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

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
        <div className="flex items-center justify-between mb-14 pb-8 border-b border-emerald-900/30">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800" />
            <span className="text-sm font-semibold text-zinc-300">{post.author}</span>
            <span className="text-zinc-700 mx-1">|</span>
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
              Technical Essay
            </span>
            <span className="text-zinc-700 mx-1">|</span>
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
              {post.readingTime} min read
            </span>
          </div>
          <SocialShare title={post.title} url={`https://pomaidb-web.vercel.app/blog/${post.slug}`} />
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

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-emerald-900/30">
            <h3 className="text-xl font-bold text-white mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="fp-card fp-card--hover group block rounded-xl"
                >
                  <span className="fp-tag mb-3 inline-block">{relatedPost.category}</span>
                  <h4 className="text-lg font-bold text-white/90 group-hover:text-emerald-300 transition-colors mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-zinc-500">{relatedPost.date}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
