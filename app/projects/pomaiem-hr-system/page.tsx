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

export default function PomaiEmHrSystemDetailPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <div className="mb-12 flex items-center justify-between border-b border-border pb-6">
        <Link href="/projects" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
          <span className="inline-block transition-transform group-hover:translate-x-[-4px]">←</span> All Projects
        </Link>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted rounded-full border border-border">Case Study: 02</span>
      </div>

      <DocHeading>PomaiEm HR System: Agentic Workforce Operations SaaS</DocHeading>

      <DocParagraph>
        PomaiEm is an HR system SaaS built for many workspace sizes, from small teams to enterprise departments. It combines workspace management, real-time collaboration, automated task creation, shift scheduling, and salary wage calculation into a microservices-oriented operations platform.
      </DocParagraph>

      <div className="space-y-12 mt-12">
        <section id="architecture">
          <DocSubHeading>System Architecture</DocSubHeading>
          <DocParagraph>
            PomaiEm uses automation agents to turn common HR activities into repeatable workflows. Agents can create tasks, assign schedules, track workspace events, and coordinate with payroll logic while each tenant keeps its operational context isolated.
          </DocParagraph>
          <DocTechnicalSpec
            title="Operational Specifications"
            specs={[
              { label: "Product Domain", value: "HR System SaaS" },
              { label: "Workspace Model", value: "Small teams to enterprise" },
              { label: "Automation Layer", value: "Task, schedule, and payroll agents" },
              { label: "Collaboration", value: "Real-time chat and workspace activity" },
              { label: "Architecture", value: "Microservices-oriented services" },
              { label: "Data Role", value: "Tenant context, event state, and workflow memory" },
            ]}
          />
        </section>

        <section id="integration">
          <DocSubHeading>PomaiDB Integration</DocSubHeading>
          <DocParagraph>
            PomaiDB fits the workload as a local operational memory layer for agent tasks and workspace events. The system can keep fast state for active schedules, task queues, chat context, payroll calculations, and workspace-specific rules without pushing every interaction through a distant data path.
          </DocParagraph>
          <DocHighlight title="Key Design Choice: Workspace-Aware Automation">
            PomaiEm treats each workspace as a bounded automation context. PomaiDB can retain the agent state needed to make scheduling, assignment, chat, and salary workflows feel immediate while still supporting many tenant sizes.
          </DocHighlight>
          <DocList>
            <li><strong>Task Automation</strong>: Agents create and assign work items from operational triggers.</li>
            <li><strong>Schedule Assignment</strong>: Shift and calendar logic can be computed against workspace-specific availability.</li>
            <li><strong>Salary Wage Calculation</strong>: Payroll workflows can use attendance, role, and schedule state for automated calculations.</li>
            <li><strong>Real-Time Collaboration</strong>: Chat and workspace events stay connected to the same operational context agents use.</li>
          </DocList>
        </section>

        <section id="resources">
          <DocSubHeading>Technical Resources</DocSubHeading>
          <DocNote title="Demo Video">
            Watch the PomaiEm HR System demo: <a href="https://youtu.be/0ujbOGHRLHg?si=aRrWZYA2nXiCNBKl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PomaiEm HR System SaaS</a>
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
