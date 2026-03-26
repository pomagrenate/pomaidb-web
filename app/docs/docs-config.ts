export interface DocPage {
  title: string;
  slug: string;
  category: string;
  content: string;
}

export const DOCS_NAV = [
  {
    category: "Getting Started",
    pages: [
      { title: "Introduction", slug: "introduction" },
      { title: "Quick Start", slug: "quick-start" },
    ],
  },
  {
    category: "Core Concepts",
    pages: [
      { title: "Architecture & Execution", slug: "architecture" },
      { title: "Storage Engine (WAL & LSM)", slug: "storage-engine" },
      { title: "Memory & Zero-OOM", slug: "memory" },
      { title: "VFS & Portability", slug: "vfs" },
    ],
  },
  {
    category: "Advanced Storage",
    pages: [
      { title: "Quantization (SQ8/FP16)", slug: "quantization" },
      { title: "Sharding & Embedded", slug: "sharding-vs-embedded" },
      { title: "Metric Types", slug: "metrics" },
    ],
  },
  {
    category: "Membranes & Subsystems",
    pages: [
      { title: "Membrane Lifecycle", slug: "membranes-lifecycle" },
      { title: "Supported Kinds & Types", slug: "membranes-kinds" },
    ],
  },
  {
    category: "Edge Analytics & Memory",
    pages: [
      { title: "Hybrid & Multimodal Search", slug: "agent-memory" },
      { title: "Object Links & Time-Travel", slug: "records-sessions" },
      { title: "Device-Wide Pruning", slug: "pruning" },
    ],
  },
  {
    category: "Offline-First RAG Pipeline",
    pages: [
      { title: "RAG Overview", slug: "rag-overview" },
      { title: "Zero-Copy Chunking", slug: "chunking" },
      { title: "Embedding Providers", slug: "embedding-providers" },
      { title: "RAG Pipeline Usage", slug: "rag-pipeline" },
    ],
  },
  {
    category: "API Reference",
    pages: [
      { title: "C++ API", slug: "cpp-api" },
      { title: "Python API", slug: "python-api" },
      { title: "C API", slug: "c-api" },
      { title: "Batch Operations", slug: "batch-ops" },
      { title: "Metadata & Filtering", slug: "metadata-filtering" },
      { title: "Snapshots & Iterators", slug: "snapshots-iterators" },
    ],
  },
];

export const ALL_DOCS: DocPage[] = [
  {
    title: "Introduction",
    slug: "introduction",
    category: "Getting Started",
    content: `PomaiDB is the predictable vector database for the edge of things. 

It is an embedded, single-threaded vector database written in C++20, built for edge devices and environments where stability and hardware longevity matter more than peak throughput.`,
  },
];
