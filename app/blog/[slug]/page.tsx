import React from "react";
import Link from "next/link";
import { 
  DocHeading, 
  DocParagraph, 
} from "@/components/docs/doc-components";
import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
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
    <article className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between border-b border-border pb-6">
        <Link href="/blog" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
          <span className="inline-block transition-transform group-hover:translate-x-[-4px]">←</span> Engineering Blog
        </Link>
        <div className="flex gap-4">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted rounded-full border border-border">{post.category}</span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted rounded-full border border-border">{post.date}</span>
        </div>
      </div>

      <DocHeading>{post.title}</DocHeading>
      
      <div className="flex items-center gap-2 mb-12">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent" />
        <span className="text-sm font-semibold text-foreground/80">{post.author}</span>
        <span className="text-muted-foreground/40 mx-2">|</span>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Industrial Case Study</span>
      </div>
      
      {/* Dynamic Content */}
      <div 
        className="prose prose-zinc dark:prose-invert max-w-none industrial-markdown"
        dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} 
      />

      {/* Footer / CTA */}
      <div className="mt-24 pt-12 border-t border-border flex flex-col items-center text-center">
        <h3 className="font-bold text-lg mb-4">Want to link PomaiDB into your project?</h3>
        <Link 
          href="/docs" 
          className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
        >
          Read the Engineering Manual
        </Link>
      </div>
    </article>
  );
}
