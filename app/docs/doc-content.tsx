import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocCode, DocNote, DocList, DocHighlight, DocTable, DocTechnicalSpec } from "@/components/docs/doc-components";

export const DOC_CONTENT: Record<string, React.ReactNode> = {
  introduction: (
    <>
      <DocHeading>System Overview</DocHeading>
      <DocParagraph>
        PomaiDB is a high-reliability, embedded vector search engine optimized for resource-constrained edge environments.
      </DocParagraph>
      <DocParagraph>
        The system architecture prioritizes deterministic execution, non-volatile storage durability, and comprehensive memory safety. PomaiDB is engineered in C++20 for ARM64 and x86_64 architectures, providing a low-level semantic indexing layer for decentralized AI agents.
      </DocParagraph>
      <DocTechnicalSpec 
        title="Core Technical Specifications"
        specs={[
          { label: "Implementation", value: "C++20 (ISO/IEC 14882:2020)" },
          { label: "Target Arch", value: "ARMv8+, x86_64 (AVX2 optimized)" },
          { label: "Storage Model", value: "Log-Structured Merge (LSM)" },
          { label: "Consistency", value: "Strict WAL Serializability" },
        ]}
      />
      <DocSubHeading>Design Principles</DocSubHeading>
      <DocList>
        <li><strong>IOPS Efficiency</strong>: Sequential write patterns optimized for MicroSD and eMMC Flash endurance.</li>
        <li><strong>Memory Determinism</strong>: Static Arena allocation with hard-coded boundaries to prevent heap fragmentation.</li>
        <li><strong>Fault Tolerance</strong>: Atomic WAL checkpointing ensures data integrity across power-cycle events.</li>
        <li><strong>Zero-Copy Semantics</strong>: <code>std::string_view</code> and <code>std::span</code> integration for minimal CPU cache pollution.</li>
      </DocList>
    </>
  ),
  architecture: (
    <>
      <DocHeading>Architectural Specification</DocHeading>
      <DocParagraph>
        PomaiDB utilizes a shared-nothing, single-threaded executor model. This eliminates lock contention and synchronization overhead, allowing the engine to saturate hardware I/O limits sequentially.
      </DocParagraph>
      <DocSubHeading>Hardware Abstraction Layer (VFS)</DocSubHeading>
      <DocParagraph>
        The <code>Env</code> interface abstracts all system-level calls, including file I/O, threading, and time. This ensures binary portability across diverse edge kernels.
      </DocParagraph>
      <DocHighlight title="Internal Memory Model">
        All ingested vectors are first serialized into a <strong>Memtable</strong> backed by a contiguous <strong>Arena</strong>. Once the Memtable reaches its configured capacity threshold, it is frozen and flushed to a persistent <strong>Segment</strong>.
      </DocHighlight>
      <DocSubHeading>Monolithic vs. Sharded Execution</DocSubHeading>
      <DocTable 
        headers={["Metric", "Monolithic (Embedded)", "Sharded (Parallel)"]}
        rows={[
          ["Thread Safety", "External Synchronization Required", "Internal Shard-Level Locking"],
          ["Write Path", "Strictly Sequential", "Parallelized across Shards"],
          ["Memory Footprint", "Minimal (Shared Arena)", "Variable (Per-Shard Arenas)"],
          ["Application Use", "Low-power IoT / Real-time controllers", "Edge Servers / AI Gateway"],
        ]}
      />
    </>
  ),
  "storage-engine": (
    <>
      <DocHeading>Storage Subsystem (LSM & WAL)</DocHeading>
      <DocParagraph>
        The storage engine is a Log-Structured Merge (LSM) implementation specialized for vector payloads and sequential write-heavy workloads.
      </DocParagraph>
      <DocSubHeading>Write-Ahead Log (WAL) Protocol</DocSubHeading>
      <DocParagraph>
        Data durability is achieved through a synchronous Write-Ahead Log. Each <code>Put</code> operation generates a log record which is flushed to the physical medium before the operation returns success to the caller.
      </DocParagraph>
      <DocTechnicalSpec 
        title="WAL Record Format"
        specs={[
          { label: "Header", value: "CRC32 (4B) + Length (4B) + Type (1B)" },
          { label: "Payload", value: "ID (8B) + Vector Bits (Variable)" },
          { label: "Alignment", value: "8-byte boundary aligned" },
        ]}
      />
      <DocCode language="cpp">
        {`// Durability Guarantee
Status Database::Put(uint64_t id, std::span<const float> vec) {
  WALRecord record = WAL::Serialize(id, vec);
  log_->Append(record);
  log_->Sync(); // Ensure physical persistence
  return memtable_->Insert(id, vec);
}`}
      </DocCode>
    </>
  ),
  quantization: (
    <>
      <DocHeading>Vector Quantization (SQ8 & FP16)</DocHeading>
      <DocParagraph>
        Precision reduction techniques are employed to minimize memory consumption and improve SIMD throughput on edge hardware.
      </DocParagraph>
      <DocSubHeading>Scalar Quantization (SQ8)</DocSubHeading>
      <DocParagraph>
        SQ8 maps 32-bit floating-point values to 8-bit integers via linear scaling. This provides a 4x reduction in storage and memory footprint.
      </DocParagraph>
      <DocTable 
        headers={["Encoding", "Bit-Width", "Memory Impact", "Error Margin (L2)"]}
        rows={[
          ["IEEE-754 FP32", "32-bit", "100% (Reference)", "0.00%"],
          ["Half-Precision FP16", "16-bit", "50%", "< 0.01%"],
          ["SQ8 (Per-Vector Scale)", "8-bit", "25%", "1.2% - 2.8%"],
        ]}
      />
      <DocHighlight title="Hardware Acceleration">
        Search operations on SQ8 encoded vectors utilize specialized SIMD instruction sets (e.g., <strong>ARM NEON <code>vdot</code></strong> or <strong>x86 AVX2 <code>_mm256_madd_epi16</code></strong>) to perform integer-arithmetic distance calculations.
      </DocHighlight>
    </>
  ),
  "agent-memory": (
    <>
      <DocHeading>Agent AI Memory Subsystem</DocHeading>
      <DocParagraph>
        The <code>AgentMemory</code> class provides a high-level API for managing semantically-indexed long-term memory for autonomous agents.
      </DocParagraph>
      <DocSubHeading>Memory Record Schema</DocSubHeading>
      <DocParagraph>
        Records in the AgentMemory system are structured to support versioning, session tracking, and importance-based pruning.
      </DocParagraph>
      <DocTechnicalSpec 
        title="AgentMemoryRecord Schema"
        specs={[
          { label: "agent_id", value: "UUID / String (Unique identifier)" },
          { label: "session_id", value: "Integer (Session grouping)" },
          { label: "p_score", value: "Float (Importance ranking)" },
          { label: "lifecycle", value: "Volatile / Persistent / Immutable" },
        ]}
      />
      <DocCode language="cpp">
        {`// Appending high-importance semantic record
AgentMemoryRecord record;
record.agent_id = "agent_0";
record.text = "System critical protocol alpha initiated.";
record.importance = 0.95f; 

memory->Append(record, &status);`}
      </DocCode>
    </>
  ),
  "rag-pipeline": (
    <>
      <DocHeading>Retrieval-Augmented Generation (RAG) Pipeline</DocHeading>
      <DocParagraph>
        The RAG pipeline provides an integrated solution for document ingestion, semantic chunking, and context retrieval.
      </DocParagraph>
      <DocSubHeading>Pipeline Execution Flow</DocSubHeading>
      <DocList>
        <li><strong>Segmentation</strong>: Recursive splitting of documents into overlapping semantic windows.</li>
        <li><strong>Vectorization</strong>: Inference-driven embedding generation via pluggable providers.</li>
        <li><strong>Index Association</strong>: High-dimensional storage within the logical Membrane space.</li>
        <li><strong>Refinement</strong>: Search results are ranked by similarity and formatted into an LLM context buffer.</li>
      </DocList>
      <DocCode language="cpp">
        {`// Retrieving rank-3 context window
ContextOptions opts;
opts.max_tokens = 512;
opts.k = 3;

std::string context_window;
pipeline->GetContext("Explain the WAL protocol.", opts, &context_window);`}
      </DocCode>
    </>
  ),
  "python-api": (
    <>
      <DocHeading>Python Interface (C-Bindings)</DocHeading>
      <DocParagraph>
        The <code>pomaidb</code> Python package utilizes CPython C-API bindings to interface directly with the C++ engine, ensuring zero-copy data transfer.
      </DocParagraph>
      <DocSubHeading>Standard Initialization</DocSubHeading>
      <DocCode language="python">
        {`import pomaidb

# Configure DB with 128MB Memtable Limit
db = pomaidb.Database(
    path="/data/pomai",
    dimension=384,
    max_memtable_mb=128
)

# Bulk ingestion via list of lists
db.put_batch(ids, vectors, metadata)`}
      </DocCode>
    </>
  ),
  "cpp-api": (
    <>
      <DocHeading>C++ API Reference</DocHeading>
      <DocParagraph>
        The primary C++ interface is exposed via the <code>pomai::DB</code> and <code>pomai::Database</code> classes.
      </DocParagraph>
      <DocTable 
        headers={["Signature", "Description", "Complexity"]}
        rows={[
          ["Open(Options, **out)", "Initialize DB instance with specified parameters.", "O(1)"],
          ["Put(id, vector, metadata)", "Insert or update vector entry.", "O(log N)"],
          ["Search(query, k, **hits)", "K-Nearest Neighbor search via index.", "O(log N + k)"],
          ["GetSnapshot(**out)", "Generate consistent point-in-time view.", "O(1)"],
        ]}
      />
    </>
  ),
};

// Map documentation aliases
DOC_CONTENT["quick-start"] = (
  <>
    <DocHeading>Technical Quick Start</DocHeading>
    <DocParagraph>Minimum implementation requirements for standard C++ deployments.</DocParagraph>
    <DocCode>
{`#include "pomai/pomai.h"

int main() {
  pomai::DBOptions opt;
  opt.path = "/var/lib/pomaidb";
  opt.dim = 384;

  std::unique_ptr<pomai::DB> db;
  pomai::DB::Open(opt, &db);

  std::vector<float> vec(384, 0.5f);
  db->Put(1, vec);
  return 0;
}`}
    </DocCode>
  </>
);

DOC_CONTENT["memory"] = (
    <>
      <DocHeading>Memory Management & Determinism</DocHeading>
      <DocParagraph>
        PomaiDB implements a static memory allocation model to eliminate fragmentation in long-running edge processes.
      </DocParagraph>
      <DocTechnicalSpec 
        title="Memory Constraints"
        specs={[
          { label: "Arena Type", value: "Contiguous Segmented Buffer" },
          { label: "Allocation Policy", value: "Pre-allocated Static Pool" },
          { label: "Alignment", value: "64-byte Cache Line Aligned" },
          { label: "Isolation", value: "Per-Membrane Memory Segregation" },
        ]}
      />
      <DocHighlight title="Backpressure Semantics">
        When a Memtable exceeds 95% of its allocated capacity, the engine will trigger <code>Status::ResourceExhausted</code>. Application developers must handle this by initiating a <code>Flush()</code> or <code>Checkpoint()</code> operation.
      </DocHighlight>
    </>
);

DOC_CONTENT["vfs"] = (
    <>
      <DocHeading>VFS Abstraction Layer</DocHeading>
      <DocParagraph>
        The Virtual File System (VFS) provides a platform-agnostic interface for low-level storage and threading.
      </DocParagraph>
      <DocTechnicalSpec 
        title="VFS Interface Requirements"
        specs={[
          { label: "Storage Path", value: "Absolute / Relative Path Strings" },
          { label: "File Access", value: "Sequential, Random, Writable" },
          { label: "Threading", value: "POSIX Threads / Windows Threads" },
          { label: "Clock", value: "Monotonic High-Resolution Timer" },
        ]}
      />
    </>
);
DOC_CONTENT["membranes-lifecycle"] = (
    <>
      <DocHeading>Membrane Lifecycle Management</DocHeading>
      <DocParagraph>
        Membranes are isolated logical partitions within a singular physical database instance.
      </DocParagraph>
      <DocSubHeading>Operational Lifecycle</DocSubHeading>
      <DocList>
        <li><code>Initialize</code>: Physical creation of segment-based index and WAL allocation.</li>
        <li><code>Activate</code>: Memory-mapping of existing segments and Arena initialization.</li>
        <li><code>Hibernate</code>: De-allocation of Arena and closure of segment file handles.</li>
        <li><code>Terminate</code>: Permanent removal of segment files and metadata headers.</li>
      </DocList>
    </>
);
DOC_CONTENT["records-sessions"] = (
    <>
      <DocHeading>Semantic Record Specification</DocHeading>
      <DocParagraph>
        The <code>AgentMemoryRecord</code> structure serves as the primary data exchange format for the AgentAI subsystem.
      </DocParagraph>
      <DocTechnicalSpec 
        title="Record Attributes"
        specs={[
          { label: "agent_id", value: "Fixed-Length GUID / Token" },
          { label: "session_id", value: "Monotonic Sequence Integer" },
          { label: "schema_ver", value: "Protocol Versioning (uint8)" },
          { label: "bloom_filter", value: "Probabilistic query optimizer" },
        ]}
      />
    </>
);
DOC_CONTENT["rag-overview"] = (
    <>
      <DocHeading>RAG Pipeline Specification</DocHeading>
      <DocParagraph>
        A multi-component pipeline for document processing and context retrieval.
      </DocParagraph>
      <DocHighlight title="Standard Workflow">
        Ingestion &rarr; Normalization &rarr; Chunking (Recursive) &rarr; Vectorization &rarr; Indexing.
      </DocHighlight>
    </>
);
DOC_CONTENT["batch-ops"] = (
    <>
      <DocHeading>High-Throughput Batch Operations</DocHeading>
      <DocParagraph>
        Batching optimizes the write-path by minimizing syscall overhead and merging WAL flush operations.
      </DocParagraph>
      <DocNote title="Benchmark Data">
        Single <code>Put</code>: 12ms latency.<br/>
        Batch <code>PutBatch</code> (100 vectors): 45ms latency (&tilde;0.45ms per vector).
      </DocNote>
    </>
);
DOC_CONTENT["snapshots-iterators"] = (
    <>
      <DocHeading>Consistent Snapshots & Iterators</DocHeading>
      <DocParagraph>
        Snapshots provide a read-consistent view of a Membrane at a specific logical sequence number (LSN).
      </DocParagraph>
      <DocNote title="Read Consistency">
        Once a snapshot is acquired, concurrent <code>Put/Delete</code> operations will not be visible within that snapshot's iterator scope.
      </DocNote>
    </>
);
// Remap remaining minor slugs
DOC_CONTENT["membranes-kinds"] = DOC_CONTENT["membranes-lifecycle"];
DOC_CONTENT["pruning"] = DOC_CONTENT["memory"];
DOC_CONTENT["chunking"] = DOC_CONTENT["rag-pipeline"];
DOC_CONTENT["embedding-providers"] = DOC_CONTENT["rag-pipeline"];
DOC_CONTENT["c-api"] = DOC_CONTENT["cpp-api"];
