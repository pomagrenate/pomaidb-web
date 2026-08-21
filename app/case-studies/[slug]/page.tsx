import React from "react";
import Link from "next/link";
import { getCaseStudyData, getSortedCaseStudiesData } from "@/lib/case-studies";
import { notFound } from "next/navigation";
import { SeriesNavigator, PostContext } from "@/components/case-studies/SeriesNavigator";

export async function generateStaticParams() {
  const caseStudies = getSortedCaseStudiesData();
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let caseStudy;
  try {
    caseStudy = await getCaseStudyData(slug);
  } catch (e) {
    notFound();
  }

  const allCaseStudies = getSortedCaseStudiesData();
  let relatedSeriesPosts: PostContext[] = [];

  if (caseStudy.series) {
    relatedSeriesPosts = allCaseStudies
      .filter((cs) => cs.series === caseStudy.series)
      .map((cs) => ({
        title: cs.title,
        slug: cs.slug,
        seriesOrder: cs.seriesOrder || 0,
      }));
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717]">
      {/* Top Navigation Strip */}
      <div className="border-b border-[#EAEAEA] bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/case-studies"
            className="text-sm font-semibold text-[#525252] hover:text-[#6D5DFB] transition-colors flex items-center gap-2 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Case Studies</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F4F4F6] border border-[#EAEAEA] text-[#171717] text-xs font-semibold">
              {caseStudy.category}
            </span>
            <span className="text-xs font-mono text-slate-400">{caseStudy.date}</span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#171717] mb-6 leading-tight">
          {caseStudy.title}
        </h1>

        {/* Author row & Repo Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#525252]">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-xs">
              QV
            </div>
            <span className="font-semibold text-[#171717]">{caseStudy.author}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-500">Architecture Case Study</span>
          </div>

          {caseStudy.repo && (
            <a
              href={caseStudy.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D5DFB] bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Blueprint Repository ↗
            </a>
          )}
        </div>

        <div
          className="prose max-w-none industrial-markdown"
          dangerouslySetInnerHTML={{ __html: caseStudy.contentHtml || "" }}
        />

        {caseStudy.series && caseStudy.seriesOrder !== undefined && (
          <SeriesNavigator
            seriesName={caseStudy.series}
            currentOrder={caseStudy.seriesOrder}
            allSeriesPosts={relatedSeriesPosts}
          />
        )}

        {/* CTA footer */}
        <div className="mt-20 pt-10 border-t border-[#EAEAEA] bg-white p-8 rounded-3xl text-center border">
          <p className="text-xs font-mono text-[#6D5DFB] font-bold uppercase tracking-wider mb-2">
            PRACTICAL IMPLEMENTATION
          </p>
          <h3 className="font-bold text-xl text-[#171717] mb-6">
            Explore the architecture hands-on
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {caseStudy.repo && (
              <a
                href={caseStudy.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F4F4F6] text-[#171717] border border-[#EAEAEA] text-sm font-semibold transition-all"
              >
                <span>View Repository</span>
                <span>↗</span>
              </a>
            )}
            <a
              href="https://github.com/pomagrenate/pomaidb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-sm font-semibold shadow-sm transition-all"
            >
              <span>View PomaiDB on GitHub</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}