import type { Metadata } from "next";
import Link from "next/link";
import { getResearchItems, type ResearchItem } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research | Quan Van",
  description: "Research papers and technical publications by Quan Van on data mining, vector indexing, and oblivious trees.",
};

export default function ResearchPage() {
  const researchItems = getResearchItems();

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Academic Publications</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Scientific Research
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            I am driven by a passion for scientific research and the practical application of academic algorithms to low-level systems engineering. Below is a list of my papers and technical manuscripts.
          </p>
        </div>
      </section>

      <section className="border-t border-border/70 bg-muted/10">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          {researchItems.length > 0 ? (
            <div className="space-y-4">
              {researchItems.map((item) => (
                <div key={item.slug} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all duration-300 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md">
                        {item.date}
                      </span>
                      {item.pages ? (
                        <span className="text-xs font-mono text-muted-foreground">{item.pages} pages</span>
                      ) : null}
                    </div>
                    <h2 className="text-lg font-bold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={item.href}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Open PDF
                    </Link>
                    <Link
                      href={item.href}
                      download={item.fileName}
                      className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      Download
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border bg-card p-8 rounded-xl">
              <h2 className="text-xl font-bold tracking-tight">No research papers yet</h2>
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
