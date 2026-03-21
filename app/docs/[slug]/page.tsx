import React from "react";
import { notFound } from "next/navigation";
import { DOC_CONTENT } from "../doc-content";

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = DOC_CONTENT[slug];

  if (!content) {
    notFound();
  }

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      {content}
    </article>
  );
}
