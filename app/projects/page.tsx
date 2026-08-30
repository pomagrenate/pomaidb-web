import React from "react";
import { PROJECT_GROUPS } from "./projects";
import { ProjectsClient } from "@/components/projects-client";

export default function ProjectsIndexPage() {
  return (
    <div className="bg-[#FAFAF8] text-[#171717] min-h-screen py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProjectsClient projectGroups={PROJECT_GROUPS} />
      </div>
    </div>
  );
}