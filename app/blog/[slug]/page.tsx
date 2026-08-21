import React from "react";
import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";
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
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717]">
      {/* Top Header Bar */}
      <div className="border-b border-[#EAEAEA] bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#525252] hover:text-[#6D5DFB] transition-colors flex items-center gap-2 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Engineering Blog</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6D5DFB] text-xs font-semibold">
              {post.category}
            </span>
            <span className="text-xs font-mono text-slate-400">{post.date}</span>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#171717] mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author & Reading Metadata Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-8 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#525252]">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-xs">
              QV
            </div>
            <span className="font-semibold text-[#171717]">{post.author}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-500">{post.readingTime || 5} min read</span>
          </div>
          <SocialShare title={post.title} url={`https://pomaidb-web.vercel.app/blog/${post.slug}`} />
        </div>

        {/* Markdown Rendered Content */}
        <div
          className="prose max-w-none industrial-markdown"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
        />

        {/* CTA Footer */}
        <div className="mt-20 pt-10 border-t border-[#EAEAEA] bg-white p-8 rounded-3xl text-center border">
          <p className="text-xs font-mono text-[#6D5DFB] font-bold uppercase tracking-wider mb-2">
            EXPLORE THE MANUAL
          </p>
          <h3 className="font-bold text-xl text-[#171717] mb-4">
            Want to integrate PomaiDB into your project?
          </h3>
          <a
            href="https://github.com/pomagrenate/pomaidb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-sm font-semibold shadow-sm transition-all"
          >
            <span>View PomaiDB on GitHub</span>
            <span>→</span>
          </a>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#EAEAEA]">
            <h3 className="text-xl font-bold text-[#171717] mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-[#6D5DFB]/40 transition-all duration-200"
                >
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#6D5DFB] text-[10px] font-semibold mb-3 inline-block">
                    {relatedPost.category}
                  </span>
                  <h4 className="text-base font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{relatedPost.date}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
