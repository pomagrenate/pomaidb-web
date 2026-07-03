import type { Metadata } from "next";
import Link from "next/link";
import { getResearchItems } from "@/lib/research";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

export const metadata: Metadata = {
  title: "Research | Quan Van",
  description: "Research papers and technical publications by Quan Van on data mining, vector indexing, and oblivious trees.",
};

export default function ResearchPage() {
  const researchItems = getResearchItems();

  return (
    <ForestPageShell
      eyebrow="Academic Publications"
      title="Scientific Research"
      description="Driven by a passion for scientific inquiry and the practical application of academic algorithms to low-level systems engineering. Below are my published papers and technical manuscripts."
    >
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
        {researchItems.length > 0 ? (
          <div className="space-y-4">
            {researchItems.map((item, i) => (
              <div
                key={item.slug}
                className="fp-card fp-card--row"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="fp-badge">
                      {item.date}
                    </span>
                    {item.pages ? (
                      <span className="fp-mono-label">{item.pages} pages</span>
                    ) : null}
                  </div>
                  <h2 className="text-lg font-bold text-white/90 leading-snug">
                    {item.title}
                  </h2>
                  {item.authors && (
                    <p className="text-xs text-emerald-300/50 mt-1 font-mono">{item.authors}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  <Link
                    href={item.href}
                    target="_blank"
                    className="fp-btn fp-btn--primary"
                  >
                    Open PDF
                  </Link>
                  <Link
                    href={item.href}
                    download={item.fileName}
                    className="fp-btn fp-btn--ghost"
                  >
                    Download
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="fp-card text-center py-12">
            <h2 className="text-xl font-bold text-white/80">No research papers yet</h2>
            <p className="mt-3 text-zinc-500 text-sm">
              Add PDF files to <span className="font-mono text-emerald-400/70">content/research</span> and they will appear here.
            </p>
          </div>
        )}
      </div>
    </ForestPageShell>
  );
}
