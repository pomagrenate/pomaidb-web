import type { Metadata } from "next";
import { getSortedCaseStudiesData } from "@/lib/case-studies";
import { PageShell } from "@/components/page-shell";
import { CaseStudiesClient } from "@/components/case-studies-client";

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
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-12">
        <CaseStudiesClient caseStudies={allCaseStudiesData} />
      </div>
    </PageShell>
  );
}
