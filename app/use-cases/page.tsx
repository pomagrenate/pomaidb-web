import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DocHeading, DocParagraph } from "@/components/docs/doc-components";

export default function UseCasesIndexPage() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
      <div className="max-w-3xl mb-16">
        <DocHeading>Industrial Case Studies</DocHeading>
        <DocParagraph>
          Explore how PomaiDB is deployed in production environments ranging from autonomous agent clusters to industrial IoT gateways. Each case study highlights the technical architecture and performance metrics.
        </DocParagraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Cheeserag Card */}
        <SolutionCard 
          title="Cheeserag"
          description="High-performance local RAG ecosystem combining C++ inference, embedded vector storage, and autonomous agents."
          href="/use-cases/cheeserag"
          tags={["RAG", "C++", "Autonomous"]}
          image="/logo.png" // Placeholder or branding
        />
        
        {/* Placeholder for future use cases */}
        <div className="rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center p-8 text-center bg-muted/10 grayscale opacity-40">
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-border mb-4 flex items-center justify-center">
            <span className="text-xl font-bold">+</span>
          </div>
          <h3 className="font-bold text-lg">Next Case Study</h3>
          <p className="text-sm text-muted-foreground mt-2">In development: Industrial Fault Detection & Smart City Analytics.</p>
        </div>
      </div>
    </div>
  );
}

function SolutionCard({ title, description, href, tags, image }: { title: string; description: string; href: string; tags: string[]; image: string }) {
  return (
    <Link href={href} className="group block h-full">
      <article className="flex flex-col h-full rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image src={image} alt={title} width={24} height={24} className="grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div className="flex gap-2">
              {tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-muted rounded-md border border-border text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
            {title}
          </h3 >
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
            View Case Study <span>→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
