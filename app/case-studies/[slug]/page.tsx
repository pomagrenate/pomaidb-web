import React from "react";
import Link from "next/link";
import { getCaseStudyData, getSortedCaseStudiesData } from "@/lib/case-studies";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/forest-journey/ReadingProgress";
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
    <div className="min-h-screen bg-[#020802]">
      <ReadingProgress />

      <div className="border-b border-emerald-900/30 bg-[#030d03]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/case-studies"
            className="text-sm font-bold text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
          >
            <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
            Case Studies
          </Link>
          <div className="flex gap-3">
            <span className="fp-badge">{caseStudy.category}</span>
            <span className="fp-mono-label self-center">{caseStudy.date}</span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {caseStudy.title}
        </h1>

        {/* Author row & Repo Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-14 pb-8 border-b border-emerald-900/30">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800" />
            <span className="text-sm font-semibold text-zinc-300">{caseStudy.author}</span>
            <span className="text-zinc-700 mx-1">|</span>
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
              Architecture Case Study
            </span>
          </div>

          {/* Github Repo Button */}
          {caseStudy.repo && (
            <a
              href={caseStudy.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-800/50 px-4 py-2 rounded-full hover:bg-emerald-900/50 hover:text-emerald-300 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Blueprint Repository
            </a>
          )}
        </div>

        <div
          className="prose max-w-none industrial-markdown forest-prose"
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
        <div className="mt-24 pt-12 border-t border-emerald-900/30 flex flex-col items-center text-center">
          <p className="text-xs font-mono text-emerald-700 uppercase tracking-widest mb-4">
            End of article
          </p>
          <h3 className="font-bold text-lg text-white mb-6">
            Explore the architecture hands-on
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {caseStudy.repo && (
              <a
                href={caseStudy.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="fp-btn fp-btn--ghost px-8 py-3.5 text-sm"
              >
                View Repository
              </a>
            )}
            <Link
              href="/docs"
              className="fp-btn fp-btn--primary px-8 py-3.5 text-sm"
            >
              Read the Engineering Manual
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}