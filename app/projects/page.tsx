import React from "react";
import { PageShell } from "@/components/page-shell";
import { PROJECT_GROUPS } from "./projects";
import { ProjectsClient } from "@/components/projects-client";

export default function ProjectsIndexPage() {
  return (
    <PageShell
      eyebrow="Personal Lab & Catalogue"
      title="Projects & Software Systems"
      description="A curated repository of systems programming, local AI tools, physics mini-games, commercial platforms, and statistical data models — built for curiosity, performance, and real-world impact."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <ProjectsClient projectGroups={PROJECT_GROUPS} />
      </div>
    </PageShell>
  );
}