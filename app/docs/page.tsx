import React from "react";
import Link from "next/link";
import { DocHeading, DocParagraph, DocNote } from "@/components/docs/doc-components";
import { DOCS_NAV } from "./docs-config";

export default function DocsIndex() {
  return (
    <>
      <DocHeading>Welcome to PomaiDB Documentation</DocHeading>
      <DocParagraph>
        Learn how to build, deploy, and optimize PomaiDB for your edge applications.
        Whether you are working with Raspberry Pi, NVIDIA Jetson, or custom ARM hardware,
        our guides will help you get the most out of our predictable vector engine.
      </DocParagraph>
      <DocNote title="Getting Started">
        If you are new to PomaiDB, we recommend starting with the{" "}
        <Link href="/docs/introduction" className="text-emerald-400 hover:underline font-bold">
          Introduction
        </Link>{" "}
        to understand our &quot;Edge-First&quot; philosophy.
      </DocNote>

      <div className="mt-12 space-y-12">
        {DOCS_NAV.map((category: any, i: number) => (
          <section key={i}>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-emerald-900/40" />
              {category.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {category.pages.map((page: any, j: number) => (
                <Link
                  key={j}
                  href={`/docs/${page.slug}`}
                  className="group flex flex-col p-4 rounded-lg border border-transparent hover:border-emerald-900/50 hover:bg-emerald-900/15 transition-all"
                >
                  <span className="text-base font-semibold text-zinc-300 group-hover:text-emerald-300 transition-colors">
                    {page.title}
                  </span>
                  <span className="text-xs text-zinc-600 mt-1 line-clamp-1">
                    Technical specifications and implementation details for {page.title.toLowerCase()}.
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
