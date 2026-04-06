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

export default function CheeseragDetailPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <div className="mb-12 flex items-center justify-between border-b border-border pb-6">
        <Link href="/use-cases" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
          <span className="inline-block transition-transform group-hover:translate-x-[-4px]">←</span> All Projects
        </Link>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted rounded-full border border-border">Case Study: 01</span>
      </div>

      <DocHeading>Cheeserag: High-Performance Local RAG Ecosystem</DocHeading>
      
      <DocParagraph>
        Cheeserag is a unified, local-first retrieval-augmented generation (RAG) ecosystem. It combines a C++ inference engine, an embedded vector database, and a Go-based autonomous agent into a single, seamless developer experience.
      </DocParagraph>

      <div className="space-y-12 mt-12">
        <section id="architecture">
          <DocSubHeading>System Architecture</DocSubHeading>
          <DocParagraph>
            The Cheeserag stack is designed for deterministic execution on resource-constrained hardware. It avoids the latency spikes of cloud-based services by running the entire embedding and retrieval pipeline locally.
          </DocParagraph>
          <DocTechnicalSpec 
            title="Industrial Specifications"
            specs={[
              { label: "Inference Server", value: "Cheesebrain (C++20)" },
              { label: "Vector Membrane", value: "PomaiDB (Embedded)" },
              { label: "Autonomous Core", value: "Cheesepath (Go/ReAct)" },
              { label: "Target Hardware", value: "ARMv8+ / x86_64" },
              { label: "Memory Snapshot", value: "Snapshot-based persistence" },
              { label: "Consistency", value: "Strict WAL Serializability" },
            ]}
          />
        </section>

        <section id="integration">
          <DocSubHeading>PomaiDB Integration</DocSubHeading>
          <DocParagraph>
            Cheeserag utilizes PomaiDB specifically for its <strong>predictable memory footprint</strong> and <strong>single-threaded event loop</strong>. This ensures that the agentic background tasks do not cause frame drops or UI stuttering on the host device.
          </DocParagraph>
          <DocHighlight title="Key Design Choice: Local-First">
            By embedding PomaiDB directly into the RAG facade, Cheeserag achieves sub-10ms retrieval latency for local knowledge repositories, enabling "real-time" thinking loops for the autonomous agent.
          </DocHighlight>
          <DocList>
            <li><strong>Unified Lifecycle</strong>: The <code>cheese</code> CLI manages service readiness and environment heartbeats.</li>
            <li><strong>Zero-Copy Chunking</strong>: Document chunks are indexed with minimal memory copies between host and vector store.</li>
            <li><strong>Session Persistence</strong>: Automatically restores agent state and semantic context across hardware reboots.</li>
          </DocList>
        </section>

        <section id="resources">
          <DocSubHeading>Technical Resources</DocSubHeading>
          <DocNote title="External Source">
            View the source code and configuration details on GitHub: <a href="https://github.com/pomagrenate/cheeserag" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pomagrenate/cheeserag</a>
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
