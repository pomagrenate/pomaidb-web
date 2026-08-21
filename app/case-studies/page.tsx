import type { Metadata } from "next";
import Link from "next/link";
import { getSortedCaseStudiesData } from "@/lib/case-studies";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Case Studies | Quan Van",
  description: "Case Studies by Quan Van on building production systems and AI integrations.",
};

export default function CaseStudiesIndexPage() {
  const allCaseStudiesData = getSortedCaseStudiesData();

  return (
    <PageShell
      eyebrow="Production Engineering"
      title="Systems Case Studies"
      description="In-depth breakdowns of real-world software deployments, architectural trade-offs, performance optimizations, and lessons learned in production."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {allCaseStudiesData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCaseStudiesData.map((post) => (
              <Link
                key={post.slug}
                href={`/case-studies/${post.slug}`}
                className="group bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#F4F4F6] border border-[#EAEAEA] text-[#171717] text-[11px] font-semibold">
                      {post.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{post.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-[#525252] text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white text-[10px] font-bold">
                      QV
                    </div>
                    <span className="text-xs font-semibold text-[#171717]">{post.author}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#6D5DFB] group-hover:underline flex items-center gap-1">
                    <span>Read case study</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#EAEAEA] rounded-2xl text-center py-12 px-6">
            <h2 className="text-xl font-bold text-[#171717]">No case studies yet</h2>
            <p className="mt-2 text-[#737373] text-sm">
              Check back soon for new technical case studies.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
