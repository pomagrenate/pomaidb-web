import React from "react";

// Import modular documentation components
import IntroductionDoc from "./content/introduction";
import ArchitectureDoc from "./content/architecture";
import StorageEngineDoc from "./content/storage-engine";
import MemoryDoc from "./content/memory";
import VfsDoc from "./content/vfs";
import RagPipelineDoc from "./content/rag-pipeline";
import MembranesDoc from "./content/membranes";
import ApiReferenceDoc from "./content/api-reference";

export const DOC_CONTENT: Record<string, React.ReactNode> = {
  // Getting Started
  "introduction": <IntroductionDoc />,
  "quick-start": <IntroductionDoc />, // Covered functionally within Intro & API references

  // Core Concepts
  "architecture": <ArchitectureDoc />,
  "storage-engine": <StorageEngineDoc />,
  "memory": <MemoryDoc />,
  "vfs": <VfsDoc />,

  // Advanced Storage
  "quantization": <StorageEngineDoc />, // Quantization and metrics discussed organically in Engine/Membranes
  "sharding-vs-embedded": <ArchitectureDoc />,
  "metrics": <MembranesDoc />,

  // Membranes
  "membranes-lifecycle": <MembranesDoc />,
  "membranes-kinds": <MembranesDoc />,

  // Agent AI Memory
  "agent-memory": <MembranesDoc />,
  "records-sessions": <MembranesDoc />,
  "pruning": <StorageEngineDoc />,

  // Edge RAG Pipeline
  "rag-overview": <RagPipelineDoc />,
  "chunking": <RagPipelineDoc />,
  "embedding-providers": <RagPipelineDoc />,
  "rag-pipeline": <RagPipelineDoc />,

  // API Reference
  "cpp-api": <ApiReferenceDoc />,
  "python-api": <ApiReferenceDoc />,
  "c-api": <ApiReferenceDoc />,
  "batch-ops": <ApiReferenceDoc />,
  "metadata-filtering": <ApiReferenceDoc />,
  "snapshots-iterators": <ApiReferenceDoc />,
};
