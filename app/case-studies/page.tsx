import type { Metadata } from "next";
import { getSortedCaseStudiesData } from "@/lib/case-studies";
import { CaseStudiesClient } from "@/components/case-studies-client";

export const metadata: Metadata = {
  title: "Systems Case Studies | Quan Van",
  description: "Deep dives into real-world software systems, architecture decisions, performance optimizations, and lessons learned in production.",
};

export default function CaseStudiesIndexPage() {
  const allCaseStudiesData = getSortedCaseStudiesData();

  return (
    <div className="bg-[#FAFAF8] text-[#171717] min-h-screen py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CaseStudiesClient caseStudies={allCaseStudiesData} />
      </div>
    </div>
  );
}
