import React from "react";
import Link from "next/link";
import { DocHeading, DocParagraph } from "@/components/docs/doc-components";
import { getSortedPostsData } from "@/lib/blog";

export default function BlogIndexPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
      <div className="max-w-3xl mb-16">
        <DocHeading>Engineering Blog</DocHeading>
        <DocParagraph>
          Deep dives into the technical architecture of PomaiDB, vector search algorithms, and the future of decentralized edge AI.
        </DocParagraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {allPostsData.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl transition-all">
      <article className="flex flex-col h-full bg-card/50 backdrop-blur-sm border border-border/80 rounded-2xl hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:bg-card transition-all duration-500 overflow-hidden">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md">
              {post.category}
            </span>
            <span className="text-xs font-mono text-muted-foreground">{post.date}</span>
          </div>
          
          <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-10 flex-1 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-6 border-t border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent" />
              <span className="text-sm font-semibold text-foreground/80">{post.author}</span>
            </div>
            <div className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
              Read More <span>→</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
