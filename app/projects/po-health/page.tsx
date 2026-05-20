import React from "react";
import Link from "next/link";
import {
  DocHeading,
  DocSubHeading,
  DocParagraph,
  DocList,
  DocHighlight,
  DocTechnicalSpec,
  DocNote
} from "@/components/docs/doc-components";

export default function PoHealthDetailPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <div className="mb-12 flex items-center justify-between border-b border-border pb-6">
        <Link href="/projects" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
          <span className="inline-block transition-transform group-hover:translate-x-[-4px]">←</span> All Projects
        </Link>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted rounded-full border border-border">Case Study: 03</span>
      </div>

      <DocHeading>Po-Health: AI-Assisted Drug Retrieval and Patient Intelligence</DocHeading>

      <DocParagraph>
        Po-Health is a healthcare operations system for drug retrieval, patient management, and medical statistics. Its AI agent retrieves drugs from natural descriptions instead of relying only on keyword matches, then connects those results to patient records and health metrics such as BMI.
      </DocParagraph>

      <div className="space-y-12 mt-12">
        <section id="architecture">
          <DocSubHeading>System Architecture</DocSubHeading>
          <DocParagraph>
            The system centers on semantic retrieval for drug discovery and structured patient workflows. Clinicians or operators can describe symptoms, treatment needs, or medicine characteristics, and the agent searches by meaning while the application maintains patient, encounter, and statistics data.
          </DocParagraph>
          <DocTechnicalSpec
            title="Healthcare Specifications"
            specs={[
              { label: "Product Domain", value: "Healthcare operations" },
              { label: "Retrieval Mode", value: "Description-based AI agent search" },
              { label: "Clinical Data", value: "Patients, drugs, and health records" },
              { label: "Statistics", value: "BMI and additional health metrics" },
              { label: "Search Behavior", value: "Semantic retrieval beyond word matching" },
              { label: "Data Role", value: "Drug vectors, patient state, and metric history" },
            ]}
          />
        </section>

        <section id="integration">
          <DocSubHeading>PomaiDB Integration</DocSubHeading>
          <DocParagraph>
            PomaiDB supports Po-Health as a low-latency retrieval and state layer for medical workflows. Drug descriptions can be indexed for semantic matching, while patient management features keep structured records and calculated statistics close to the agent context.
          </DocParagraph>
          <DocHighlight title="Key Design Choice: Meaning-Based Retrieval">
            Po-Health separates clinical intent from exact wording. PomaiDB can help store vectorized drug descriptions and patient context so the agent can retrieve likely matches even when the user describes a drug indirectly.
          </DocHighlight>
          <DocList>
            <li><strong>Drug Retrieval</strong>: Finds drugs from descriptions, indications, and contextual clues instead of exact text matches.</li>
            <li><strong>Patient Management</strong>: Maintains patient records, care context, and operational history.</li>
            <li><strong>Health Statistics</strong>: Calculates BMI and other patient metrics from stored measurements.</li>
            <li><strong>Agent Context</strong>: Keeps retrieval results and patient data aligned during clinical workflows.</li>
          </DocList>
        </section>

        <section id="resources">
          <DocSubHeading>Technical Resources</DocSubHeading>
          <DocNote title="Demo Video">
            Watch the Po-Health demo: <a href="https://youtu.be/-3J2Cwv7lno?si=8-klZDhR6MikEBNN" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Po-Health AI drug retrieval system</a>
          </DocNote>
        </section>
      </div>

      <div className="mt-24 pt-12 border-t border-border flex flex-col items-center text-center">
        <h3 className="font-bold text-lg mb-4">Want to link PomaiDB into your project?</h3>
        <Link
          href="/docs"
          className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
        >
          Read the Engineering Manual
        </Link>
      </div>
    </div>
  );
}
