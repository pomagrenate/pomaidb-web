import type { Metadata } from "next";
import Link from "next/link";
import { getResearchItems, type ResearchItem } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research | PomaiDB",
  description: "Research papers and technical publications by Quan Van.",
};

export default function ResearchPage() {
  const researchItems = getResearchItems();

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Research</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Papers and technical work
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A collection of research notes, papers, and algorithms behind my work in data mining, vector storage, and edge AI systems.
          </p>
        </div>
      </section>

      <section className="border-t border-border/70 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          {researchItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {researchItems.map((item) => (
                <ResearchCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="border border-border bg-card p-8">
              <h2 className="text-2xl font-bold tracking-tight">No research papers yet</h2>
              <p className="mt-3 text-muted-foreground">
                Add PDF files to <span className="font-mono text-sm">content/research</span> and they will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ResearchCard({ item }: { item: ResearchItem }) {
  return (
    <article className="flex h-full flex-col border border-border/80 bg-card p-8 transition-colors hover:border-primary/50">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md">
          Paper
        </span>
        <span className="text-xs font-mono text-muted-foreground">{item.date}</span>
        <span className="text-xs font-mono text-muted-foreground">{item.fileSize}</span>
        {item.pages ? <span className="text-xs font-mono text-muted-foreground">{item.pages} pages</span> : null}
      </div>

      <h2 className="mt-6 text-2xl font-bold leading-tight tracking-tight">
        {item.title}
      </h2>
      <p className="mt-3 text-sm font-semibold text-foreground/70">{item.authors}</p>
      <p className="mt-5 flex-1 text-sm leading-7 text-muted-foreground">{item.abstract}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {item.keywords.map((keyword) => (
          <span key={keyword} className="border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {keyword}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-border/60 pt-6">
        <Link
          href={item.href}
          target="_blank"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open PDF
        </Link>
        <Link
          href={item.href}
          download={item.fileName}
          className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Download
        </Link>
      </div>
    </article>
  );
}
