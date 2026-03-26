import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocList, DocTechnicalSpec, DocHighlight, DocCode } from "@/components/docs/doc-components";

export default function MemoryDoc() {
    return (
        <>
            <DocHeading>Memory Management & Dynamic Resource Constraints</DocHeading>

            <DocParagraph>
                Standard applications deployed to edge-hardware ecosystems face intense competition for volatile RAM. Standard SQL and NoSQL engines
                dynamically expand their internal heaps relative to query complexity. In an AI node, executing a sprawling graph traversal
                could silently request multiple Gigabytes of memory—crashing the operating system kernel instantaneously via the OOM-Killer.
            </DocParagraph>
            <DocParagraph>
                <strong>PomaiDB was engineered precisely around a "Zero OOM-Panic" design model.</strong>
            </DocParagraph>

            <DocSubHeading>1. Integrated Palloc Arena Modeling</DocSubHeading>
            <DocParagraph>
                To permanently eradicate Heap Fragmentation across continuous monthly uptimes, PomaiDB optionally integrates deeply with the
                <code>palloc</code> abstraction framework. Palloc provides O(1) mathematical arena limits. Upon kernel startup, PomaiDB locks a single contiguous
                block mapping memory mapping (e.g. exactly 128 Megabytes).
            </DocParagraph>
            <DocList>
                <li>Every configuration structure, metadata mapping string, active logical frontier, and ingestion vector resolves allocation calls targeting the Arena.</li>
                <li>Memory alignment bounds automatically lock at 64-byte boundaries guaranteeing CPU cache-line performance.</li>
                <li>Internal iterators, background compaction filters, and RAG overlapping chunk matrices reuse memory dynamically bounding total consumption perfectly.</li>
            </DocList>

            <DocHighlight title="Mathematical Backpressure Throttling">
                When ingestion payloads overload physical boundaries—for instance, when an active Memtable breaches 95% of its total specified memory payload length—the engine initiates absolute <strong>Resource Backpressure</strong>.
                <br /><br />
                Instead of dynamically allocating more RAM, the system instantly halts the event loop, freezes the Memtable synchronously, restricts external HTTP APIs (Phase 3) returning <code>429 Resource Exhausted</code> payloads safely, and waits for background thread sequences to physically purge the I/O memory onto persistent segments before automatically unpausing the architecture.
            </DocHighlight>

            <DocSubHeading>2. Granular Query Limits (The Frontier Protocol)</DocSubHeading>
            <DocParagraph>
                The AI Orchestrator governs memory constraints per query dynamically during multi-modal searches traversing thousands of interconnected vectors.
            </DocParagraph>

            <DocTechnicalSpec
                title="Execution Bounds Controls"
                specs={[
                    { label: "Graph Frontier", value: "HNSW/Navigable lists bounded to static lengths destroying sprawling traversals safely." },
                    { label: "RAG Documentation", value: "Memory caps restricting total concurrent Chunk ingestion size bounds." },
                    { label: "Blob Operations", value: "String_View offsets restricting massive blob copies across system boundaries." },
                    { label: "Vector Geometry", value: "SIMD Quantization optimizations shrinking runtime geometry arrays by 400% on average." },
                ]}
            />

            <DocSubHeading>3. Edge Device Tuning Code Example</DocSubHeading>
            <DocParagraph>
                Operators initialize deployment instances configuring these resource guardrails directly through the engine initialization protocols across all ABI surfaces.
            </DocParagraph>

            <DocCode language="cpp">
                {`// PomaiDB: Memory Allocation Guarantee Initialization
#include "pomai/pomai.h"
#include <iostream>

int main() {
    pomai::DBOptions opt;
    opt.path = "/var/lib/pomaidb";
    opt.dim = 384;
    
    // 1. Defining Hard Execution Limitations globally across the instance
    opt.max_memtable_mb = 32;       // Memtable freezes when 32 Megabytes of data occupies the Arena
    opt.max_concurrent_compactions = 1; // Limit background Thread spawns restricting memory footprint
    
    std::unique_ptr<pomai::DB> db;
    pomai::Status st = pomai::DB::Open(opt, &db);

    // 2. Monitoring the active Backpressure status safely
    if (st.IsResourceExhausted()) {
        std::cerr << "CRITICAL: The allocation arena is completely saturated.\\n";
        std::cerr << "Initiating manual DB->Flush() and gracefully retrying ingestion.\\n";
        
        db->Flush();
        st = pomai::DB::Open(opt, &db); // Retry successfully
    }
    
    // In scenarios running completely embedded Python implementations:
    // python_db = pomaidb.Database(max_memtable_mb=32) 
    
    return 0;
}`}
            </DocCode>
        </>
    );
}
