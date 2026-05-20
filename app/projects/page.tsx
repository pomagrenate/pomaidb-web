import React from "react";
import Link from "next/link";
import { DocHeading, DocParagraph } from "@/components/docs/doc-components";

interface ProjectItem {
  title: string;
  repo: string;
  github: string;
  description: string;
  tags: string[];
  details?: string;
  demo?: string;
}

interface ProjectGroup {
  category: string;
  description: string;
  projects: ProjectItem[];
}

const PROJECT_GROUPS: ProjectGroup[] = [
  {
    category: "Low-Level & Storage Systems",
    description: "System libraries, allocators, and specialized database engines focusing on resource predictability and memory bounds.",
    projects: [
      {
        title: "PomaiDB",
        repo: "pomagrenate/pomaidb",
        github: "https://github.com/pomagrenate/pomaidb",
        description: "The predictable edge-native database for multimodal AI memory. Embedded, single-threaded, and offline-first with memory-mapped structures.",
        tags: ["C++20", "LSM Tree", "Vector Indexing"],
        details: "/docs"
      },
      {
        title: "Palloc",
        repo: "pomagrenate/palloc",
        github: "https://github.com/pomagrenate/palloc",
        description: "A hardware-aware DRAM bank partitioning memory allocator designed to protect edge systems from OOM failures and ensure strict performance isolation.",
        tags: ["C / Rust", "Memory Allocation", "Kernel"],
      },
      {
        title: "Ice Age",
        repo: "pomagrenate/ice_age",
        github: "https://github.com/pomagrenate/ice_age",
        description: "Cold storage and index archiving system optimized for flash wear-aware databases, serializing old vector embeddings dynamically.",
        tags: ["C++", "Serialization", "Wear-Leveling"],
      },
      {
        title: "PomaiCache",
        repo: "pomagrenate/pomaicache",
        github: "https://github.com/pomagrenate/pomaicache",
        description: "Semantic cache layer optimized for LLM prompting to reduce redundant network and GPU cycles on repetitive tasks.",
        tags: ["C++", "Semantic Caching", "Bitmap Indexes"],
      }
    ]
  },
  {
    category: "Data Mining & Parsing",
    description: "C++ pattern mining algorithms and high-throughput lexical scanners.",
    projects: [
      {
        title: "dm",
        repo: "oh-mah-c/dm",
        github: "https://github.com/oh-mah-c/dm",
        description: "High-performance C++ Data Mining library implementing CHUO-Miner, MFHOI-Miner, HUPP-Miner, and oblivious shape-hiding tree-mining (VIFP).",
        tags: ["C++20", "Pattern Mining", "Oblivious Algorithms"],
      },
      {
        title: "SyntaxVoid",
        repo: "pomagrenate/syntaxvoid",
        github: "https://github.com/pomagrenate/syntaxvoid",
        description: "A low-level C99 lexical analysis library featuring the Flat-Array Robin-Hood Offset Tokenizer (FARO-Tokenizer) for zero-dependency parsing.",
        tags: ["C99", "Tokenization", "Robin Hood Hashing"],
      },
      {
        title: "PomaiSearch",
        repo: "pomagrenate/pomaisearch",
        github: "https://github.com/pomagrenate/pomaisearch",
        description: "Hybrid keyword and semantic query search engine using vector membranes and posting list structures.",
        tags: ["C++", "Information Retrieval", "Membrane Index"],
      }
    ]
  },
  {
    category: "AI Agents & RAG Frameworks",
    description: "Orchestration engines, context compressors, and autonomous agent loops.",
    projects: [
      {
        title: "Cheeserag",
        repo: "pomagrenate/cheeserag",
        github: "https://github.com/pomagrenate/cheeserag",
        description: "Local-first Retrieval-Augmented Generation ecosystem coordinating C++ inference, embedded vectors, and Go autonomous cores.",
        tags: ["Go", "RAG Pipeline", "Local AI"],
        details: "/projects/cheeserag"
      },
      {
        title: "Cheesebrain",
        repo: "pomagrenate/cheesebrain",
        github: "https://github.com/pomagrenate/cheesebrain",
        description: "The cognitive execution framework and local LLM agent execution loop for the Cheeserag autonomous cluster.",
        tags: ["C++", "Agent Loop", "ReAct Framework"],
      },
      {
        title: "ContextSqueezer",
        repo: "pomagrenate/contextsqueezer",
        github: "https://github.com/pomagrenate/contextsqueezer",
        description: "Utility aimed at optimizing token consumption for AI agents by identifying and compressing redundant context chunks.",
        tags: ["Python", "Prompt Compression", "NLP"],
      },
      {
        title: "ZenithSearch",
        repo: "pomagrenate/ZenithSearch",
        github: "https://github.com/pomagrenate/ZenithSearch",
        description: "AI-assisted semantic search engine combining hybrid sparse-dense representation and neural query expanders.",
        tags: ["Python / Go", "Semantic Search", "Neural IR"],
      }
    ]
  },
  {
    category: "Applications & SaaS Projects",
    description: "Operational prototypes and vertical solutions using embedded AI backends.",
    projects: [
      {
        title: "Po-Health",
        repo: "pomagrenate/po-health",
        github: "https://github.com/pomagrenate/po-health",
        description: "AI-assisted drug retrieval and patient management system showcasing description-based vector lookup.",
        tags: ["Healthcare SaaS", "Vector Search", "Clinical Stats"],
        details: "/projects/po-health",
        demo: "https://youtu.be/-3J2Cwv7lno?si=8-klZDhR6MikEBNN"
      },
      {
        title: "PomaiEm HR System",
        repo: "pomagrenate/pomaiem-hr-system",
        github: "https://github.com/pomagrenate",
        description: "Multi-workspace HR operations SaaS with embedded agent workflows for automated tasking, shifts, and wage computing.",
        tags: ["HR SaaS", "Task Automation", "SaaS Tenant Architecture"],
        details: "/projects/pomaiem-hr-system",
        demo: "https://youtu.be/0ujbOGHRLHg?si=aRrWZYA2nXiCNBKl"
      }
    ]
  }
];

export default function ProjectsIndexPage() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mb-16">
        <DocHeading>Projects & Engineering Work</DocHeading>
        <DocParagraph>
          A comprehensive gallery of my systems-programming libraries, data-mining engines, local-first RAG components, and operational applications. All code is designed with a focus on predictability, low latency, and systems-level optimization.
        </DocParagraph>
      </div>

      <div className="space-y-20">
        {PROJECT_GROUPS.map((group) => (
          <section key={group.category} className="border-t border-border/50 pt-12">
            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">
                {group.category}
              </h2>
              <p className="text-muted-foreground text-sm">
                {group.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.projects.map((project) => (
                <article
                  key={project.title}
                  className="flex flex-col h-full rounded-2xl border border-border bg-card/40 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs">
                        {project.title.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-muted rounded border border-border text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground mb-4 block">
                      {project.repo}
                    </span>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-border/40 text-xs font-bold mt-auto">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        GitHub <span>↗</span>
                      </a>
                      {project.details && (
                        <Link href={project.details} className="text-primary hover:underline">
                          Read Manual
                        </Link>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Demo Video
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
