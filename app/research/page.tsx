import type { Metadata } from "next";
import Link from "next/link";
import { getResearchItems } from "@/lib/research";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Research | Quan Van",
  description: "Research papers and technical publications by Quan Van on data mining, vector indexing, and oblivious trees.",
};

export default function ResearchPage() {
  const researchItems = getResearchItems();

  return (
    <PageShell
      eyebrow="Academic Publications"
      title="Scientific Research"
      description="Driven by scientific inquiry and the practical application of academic algorithms to low-level systems engineering. Below are my published papers, preprints, and technical manuscripts."
    >
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
        {researchItems.length > 0 ? (
          <div className="space-y-6">
            {researchItems.map((item) => (
              <div
                key={item.slug}
                className="group bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-[#6D5DFB]/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-mono font-semibold">
                      {item.date}
                    </span>
                    {item.pages && (
                      <span className="text-xs font-mono text-slate-400">
                        {item.pages} pages • {item.fileSize}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors leading-snug">
                    {item.title}
                  </h2>
                  {item.authors && (
                    <p className="text-xs font-mono font-semibold text-slate-500">{item.authors}</p>
                  )}
                  {item.abstract && (
                    <p className="text-sm text-[#525252] leading-relaxed line-clamp-2 pt-1">
                      {item.abstract}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={item.href}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>Open PDF</span>
                    <span>↗</span>
                  </Link>
                  <Link
                    href={item.href}
                    download={item.fileName}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F4F4F6] text-[#171717] border border-[#EAEAEA] text-xs font-semibold transition-all"
                  >
                    <span>Download</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#EAEAEA] rounded-2xl text-center py-12 px-6">
            <h2 className="text-xl font-bold text-[#171717]">No research papers yet</h2>
            <p className="mt-2 text-[#737373] text-sm">
              Add PDF files to <span className="font-mono text-[#6D5DFB]">content/research</span> and they will appear here.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
