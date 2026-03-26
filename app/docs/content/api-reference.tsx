import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocCode, DocNote, DocTable, DocHighlight, DocTechnicalSpec } from "@/components/docs/doc-components";

export default function ApiReferenceDoc() {
    return (
        <>
            <DocHeading>Exhaustive API Integrations & SDK References</DocHeading>

            <DocParagraph>
                PomaiDB is designed as an embedded library, completely bypassing network driver overhead for local host services.
                Because it is meant to be embedded directly into Edge OS systems, robotics navigation controllers, and IoT gateways,
                PomaiDB natively supports comprehensive foreign function interfaces (FFI). It exposes raw C++20 internals predictably
                to C, Python, Go, and theoretically any system capable of binding to standard ABI structs.
            </DocParagraph>
            <DocParagraph>
                This section provides massively detailed documentation and complete code examples across all major access layers.
            </DocParagraph>

            <DocSubHeading>1. C++20 Native Engine Integration</DocSubHeading>
            <DocParagraph>
                Direct C++ implementation provides extreme zero-copy advantages, enabling the absolute maximum throughput of local storage
                interfaces without intermediate data parsing abstractions. You instantiate the database by providing a <code>pomai::DBOptions</code>
                struct, which defines physical boundaries such as vector dimension, localized sharding limits, and the fsync durability policy.
            </DocParagraph>

            <DocHighlight title="Complete C++ Deployment Example">
                This example demonstrates the full configuration of a PomaiDB instance: configuring options, opening the database,
                explicitly creating a multimodal Membrane (kVector), executing rapid ingestion loops, flushing to persist data, and evaluating
                a nearest-neighbor query with score assertions.
            </DocHighlight>

            <DocCode language="cpp">
                {`#include "pomai/pomai.h"
#include <cstdio>
#include <memory>
#include <vector>

int main() {
    // 1. Configure the Physical Database Engine
    pomai::DBOptions opt;
    opt.path = "/data/pomaidb/sensors"; // VFS target path
    opt.dim = 384;                      // All vectors in default membrane will be 384-dimensional
    opt.shard_count = 4;                // Configure localized Logical Sharding limits
    opt.fsync = pomai::FsyncPolicy::kNever; // Optimize for SD-Card longevity, bypassing immediate OS flush

    // 2. Open / Initialize the Engine
    std::unique_ptr<pomai::DB> db;
    pomai::Status st = pomai::DB::Open(opt, &db);
    if (!st.ok()) {
        std::fprintf(stderr, "Engine failed to initialize: %s\\n", st.ToString().c_str());
        return 1;
    }

    // 3. (Optional) Create a specific Multimodal Membrane
    pomai::MembraneSpec vision_membrane;
    vision_membrane.name = "robot_vision";
    vision_membrane.dim = 512;
    vision_membrane.shard_count = 2;
    vision_membrane.kind = pomai::MembraneKind::kVector;
    
    if (db->CreateMembrane(vision_membrane).ok()) {
        db->OpenMembrane("robot_vision");
    }

    // 4. Ingest Telemetry Vectors (Simulated)
    std::vector<float> vec(opt.dim, 0.142f);
    
    // pomai::DB::Put requires an ID and a contiguous span of floating-point values
    st = db->Put(1001, vec); 
    if (!st.ok()) return 1;
    
    st = db->Put(1002, vec);
    if (!st.ok()) return 1;

    // 5. Force write-behind buffer serialization to the physical WAL layer
    st = db->Flush();
    if (!st.ok()) return 1;

    // 6. Freeze the active Memtable to ensure immutable index preparation
    st = db->Freeze("__default__");
    if (!st.ok()) return 1;

    // 7. Evaluate an Approximate Nearest-Neighbor (ANN) Search
    pomai::SearchResult result;
    st = db->Search(vec, 5, &result); // Query vector, Top-K = 5
    if (!st.ok()) return 1;

    // 8. Iterate over resultant hits
    for (const auto& hit : result.hits) {
        std::printf("Result Match -> ID: %llu | Score: %.6f\\n", 
                    static_cast<unsigned long long>(hit.id), 
                    hit.score);
    }

    // Safe engine shutdown
    db->Close();
    return 0;
}`}
            </DocCode>

            <DocNote title="Memory Safety Note:">
                Notice that <code>DB::Open</code> utilizes a <code>std::unique_ptr</code>. PomaiDB requires absolute ownership of its
                execution space; instantiation via smart pointers prevents memory leaks if the DB exits abruptly due to critical system hardware failure.
            </DocNote>


            <DocSubHeading>2. Python Edge Connectivity via C-Types</DocSubHeading>
            <DocParagraph>
                Python routinely acts as the primary orchestrator logic across Modern AI agents (like Langchain or AutoGPT).
                However, native Python is entirely unsuitable for extreme performance memory bounds. Thus, the <code>pomaidb</code> Python package
                utilizes standard <code>ctypes</code> to bind seamlessly to the compiled <code>libpomai_c.so</code> (or <code>.dylib</code> / <code>.dll</code>) library structure.
            </DocParagraph>
            <DocParagraph>
                Because it utilizes ctypes against the C-ABI, the data bridging overhead is minimal. Memory allocated in the C++ layer
                stays isolated from Python's Garbage Collector.
            </DocParagraph>

            <DocCode language="python">
                {`import os
import typing
import pomaidb

def execute_edge_rag_pipeline():
    """
    Demonstrates offline document ingestion without ANY external inference APIs.
    All chunking and embedding logic is securely executed by the bonded C++ library.
    """
    db_path = "/tmp/rag_db_vault"
    
    # 1. Initialize local embedding dimensions with strict shard balancing
    # The max_memtable_mb limit enforces the Zero-OOM backpressure protocols
    db = pomaidb.open_db(
        path=db_path, 
        dim=768, 
        shards=2, 
        max_memtable_mb=128
    )

    try:
        # 2. Declare logical typed membrane namespaces (Rag specific)
        pomaidb.create_rag_membrane(db, "rag_memory", dim=768, shard_count=2)

        raw_document = """
        SYSTEM INITIALIZATION SEQUENCE ALPHA.
        The edge device drone is positioned within the localized robotics network.
        Awaiting telemetry synchronization.
        """

        # 3. Offline document ingestion bypasses all external AI models.
        # This function executes Zero-Copy chunking (std::string_view mapping) internally.
        pomaidb.ingest_document(
            db=db, 
            membrane="rag_memory", 
            doc_id=402, 
            text=raw_document
        )

        # 4. Multimodal inference query parsing text into top_k related hits securely
        # The query text will be converted to vectors deterministically by the embedded mock/local model.
        context_string = pomaidb.retrieve_context(
            db=db, 
            membrane="rag_memory", 
            query_text="Where is the edge device positioned?", 
            top_k=2
        )
        
        print(f"Retrieved Edge Context:\\n{context_string}")

    finally:
        # 5. Guaranteed cleanup of unmanaged C-bindings
        pomaidb.close(db)

if __name__ == "__main__":
    execute_edge_rag_pipeline()`}
            </DocCode>


            <DocSubHeading>3. Batch Operations & High Throughput Ingestion</DocSubHeading>
            <DocParagraph>
                Ingesting data vector-by-vector via standard <code>Put()</code> incurs per-call overhead, regardless of execution speed.
                PomaiDB embraces batch processing primitives directly at the VFS and WAL layer to push up to <strong>31,004 vectors/sec
                    (~15.14 MB/s)</strong> on constrained ARM64 CPUs and aged SATA SSDs.
            </DocParagraph>
            <DocParagraph>
                When you evaluate <code>PutBatch()</code>, PomaiDB locks the active memtable briefly, serializes everything into one single,
                massive WAL appended block, flushes it (based on <code>FsyncPolicy</code>), and inserts the records into the Memtable arena entirely in bulk.
            </DocParagraph>

            <DocCode language="cpp">
                {`// Extreme Edge Bulk Ingestion Pipeline
std::vector<uint64_t> bulk_ids = {101, 102, 103, 104, 105};

// Flattened memory layout for cache-line locality
std::vector<float> bulk_vectors; 
bulk_vectors.reserve(5 * opt.dim);

for (int i=0; i<5; i++) {
    // Generate simulated sensor noise arrays
    for(int d=0; d<opt.dim; d++) {
        bulk_vectors.push_back(0.5f * i);
    }
}

// Ensure dimension safety (Assert logic highly recommended)
if (bulk_vectors.size() != bulk_ids.size() * opt.dim) {
    throw std::runtime_error("Vector layout misalignment");
}

// Bulk payload dispatched entirely via one WAL transaction
pomai::Status st = db->PutBatch(bulk_ids, bulk_vectors);

if (st.ok()) {
   std::printf("[SUCCESS] Successfully ingested %zu dimensional arrays in bulk.\\n", bulk_ids.size());
}`}
            </DocCode>

            <DocSubHeading>4. Virtual Time-Travel & Consistent Snapshot Iterators</DocSubHeading>
            <DocParagraph>
                A powerful feature derived directly from PomaiDB's Log-Structured Merge roots is the capacity for read-consistent snapshots.
                Each modification increments an internal Logical Sequence Number (LSN). You can generate a snapshot guaranteeing that your
                evaluation query (or read cursor iterator) views the multidimensional index <strong>exactly</strong> as it existed right at that moment,
                totally isolating the read path from background compactions, tombstones, and aggressive live writes occurring concurrently.
            </DocParagraph>

            <DocCode language="cpp">
                {`// Request a consistent point-in-time Snapshot from the Membrane Manager
const pomai::Snapshot* snapshot = db->GetSnapshot();

pomai::ReadOptions read_opts;
read_opts.snapshot = snapshot; // Bind the snapshot to specific reading policies

// Use an Iterator to scan the raw multidimensional log structures sequentially
std::unique_ptr<pomai::Iterator> it = db->NewIterator(read_opts);

float vector_sum = 0.0f;
size_t count = 0;

for (it->SeekToFirst(); it->Valid(); it->Next()) {
    // Access strictly via zero-copy views
    const uint64_t current_id = it->id();
    std::span<const float> current_vector = it->vector();
    
    // Evaluate custom Mini-OLAP operation manually
    vector_sum += current_vector[0]; // Sample evaluation
    count++;
}

// Ensure the snapshot primitive is released safely to prevent WAL compaction stalling!
db->ReleaseSnapshot(snapshot);

std::printf("Analyzed %zu immutable past vectors securely.\\n", count);`}
            </DocCode>

            <DocSubHeading>5. Raw C-API Interfacing (Foreign Function Layer)</DocSubHeading>
            <DocParagraph>
                All Python, Go, and Rust bindings interact transparently over the <code>c_types.h</code> headers. The C wrapper exposes
                deterministic ABI-stable structures engineered never to leak memory externally. Handlers like <code>pomai_rag_pipeline_create()</code>
                return raw opaque pointers that must be subsequently freed utilizing <code>pomai_rag_pipeline_destroy()</code>.
            </DocParagraph>
            <DocTechnicalSpec
                title="Key C-API Struct Entities"
                specs={[
                    { label: "pomai_db_options_t", value: "C-Struct handling dim, shard_count, and string paths." },
                    { label: "pomai_status_t", value: "Unified struct wrapping error codes and dynamically allocated message strings." },
                    { label: "pomai_search_result_t", value: "Managed buffer array containing ranked (ID, Score) struct tuples." },
                ]}
            />
        </>
    );
}
