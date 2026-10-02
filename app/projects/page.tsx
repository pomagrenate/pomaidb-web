import React from "react";
import type { Metadata } from "next";
import { PROJECT_GROUPS } from "./projects";
import { ProjectsClient } from "@/components/projects-client";

export const metadata: Metadata = {
  title: "Projects & Engineering Experiments",
  description:
    "Explore open-source systems, databases, AI agent engines, vector caches, and web architectures engineered by Quan Van.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Engineering Experiments | Quan Van",
    description:
      "Explore open-source systems, databases, AI agent engines, vector caches, and web architectures engineered by Quan Van.",
    url: "/projects",
  },
};

export default function ProjectsIndexPage() {
  return (
    <div className="bg-[#FAFAF8] text-[#171717] min-h-screen py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProjectsClient projectGroups={PROJECT_GROUPS} />
      </div>
    </div>
  );
}