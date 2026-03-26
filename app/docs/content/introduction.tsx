import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocList, DocTechnicalSpec, DocCode, DocHighlight, DocNote } from "@/components/docs/doc-components";

export default function IntroductionDoc() {
    return (
        <>
            <DocHeading>Introduction: The Predictable Edge-Native Engine</DocHeading>

            <DocParagraph>
                PomaiDB is the predictable, edge-native database engineered specifically for multimodal Artificial Intelligence (AI) Memory.
                Developed from the ground up natively in <code>C++20</code>, PomaiDB is a highly-optimized, embedded, single-threaded
                vector and document store tailored for extreme environments: IoT sensor gateways, autonomous robotics platforms,
                industrial shop-floor deployments, and offline-first AI appliances.
            </DocParagraph>

            <DocParagraph>
                Unlike distributed, cluster-oriented vector databases (like Pinecone or Milvus) that rely on massive thread
                parallelism, sprawling network consensus algorithms, and virtually unlimited RAM scaling, PomaiDB deliberately makes a fundamentally different architectural tradeoff.
                It assumes only a <strong>single process</strong> and a <strong>single thread of execution</strong>.
            </DocParagraph>

            <DocHighlight title="The Philosophy of Constraint">
                By constraining the engine to a single monolithic loop, PomaiDB eliminates complex multi-threading deadlock reasoning entirely.
                It provides strictly predictable microsecond-level latency, mathematically bounds its memory allocations preventing catastrophic Out-Of-Memory (OOM) kernel panics,
                and enforces an I/O model mathematically guaranteeing that fragile flash storage mediums (such as MicroSD cards and eMMC drives) survive years of continuous, heavy ingestion without suffering physical silicon failure.
            </DocHighlight>

            <DocSubHeading>Why Relational & Distributed Engines Fail on the Edge</DocSubHeading>

            <DocList>
                <li><strong>SD-Card Erase Phenomenon:</strong> Traditional databases continuously execute "Random In-Place Overwrites" updating B-Trees dynamically. Wear leveling on embedded devices instantly fractures, creating write-amplification that destroys the drive. PomaiDB utilizes <strong>Log-Structured, Append-Only</strong> storage—the exact sequential I/O pattern your hardware was built for.</li>
                <li><strong>Volatile Heaps vs Static Arenas:</strong> Complex queries in traditional vector search engines dynamically allocate RAM, eventually triggering the OS OOM-Killer. PomaiDB integrates with <strong>palloc</strong> for O(1) contiguous configurations. If the engine breaches its capacity, it initiates structural <strong>Backpressure</strong>, stalling writes until hardware flushes complete securely.</li>
                <li><strong>Dependency on Cloud Inference:</strong> Constructing AI memories usually implies calling remote LLMs (like OpenAI) to chunk text, generate embeddings, and score semantic similarities. PomaiDB ships with an <strong>Offline-First Edge RAG Pipeline</strong>—empowering engineers to absorb text, format it securely, embed the context, and rank similarities locally using Zero-Copy <code>std::string_view</code> execution.</li>
            </DocList>

            <DocSubHeading>Rapid Integration Verification (C++ and Python)</DocSubHeading>
            <DocParagraph>
                Deploying PomaiDB takes mere seconds. Because it is a statically linked executable engine lacking a separate "Server Daemon",
                engineers simply import the runtime via <code>pomai/pomai.h</code> or through the <code>pomaidb</code> Python package using automated
                <code>ctypes</code> FFI protocols.
            </DocParagraph>

            <DocCode language="python">
                {`# 1. Edge IoT Initialization (Python C-Bindings)
import pomaidb

# Initialize the engine allocating exactly 128 MB of RAM boundaries
# Targeting 768-dimensional AI Embeddings strictly partitioned across 2 Local Logical Shards
db = pomaidb.open_db(
    path="/mnt/nvme01/pomaidb/drone_logs", 
    dim=768, 
    shards=2, 
    max_memtable_mb=128
)

# 2. Declare distinct multimodal storage domains
# Organizing data natively separated into 'telemetry' vectors and 'system_rag' documentation
pomaidb.create_rag_membrane(db, "system_rag", dim=768, shard_count=2)

# 3. Absorb vast offline context entirely without network HTTP reliance
pomaidb.ingest_document(
    db=db, 
    membrane="system_rag", 
    doc_id=9001, 
    text="Critical subsystem parameter limits set to alpha boundaries."
)

# Seamless, highly predictable Zero-Copy Context retrieval
retrieved = pomaidb.retrieve_context(db, "system_rag", "What are the parameter limits?", top_k=1)
pomaidb.close(db)`}
            </DocCode>

            <DocTechnicalSpec
                title="High-Level Production Specifications"
                specs={[
                    { label: "Core Execution Layer", value: "C++20 Native (ISO/IEC 14882:2020)" },
                    { label: "Operating Architecture", value: "ARMv8+ natively optimized; x86_64 AVX2 supported" },
                    { label: "Primary Storage Targets", value: "Flash Storage (MicroSD, eMMC, Consumer SATA SSDs)" },
                    { label: "Execution Typology", value: "Strictly Single-Threaded Event Loop (Zero Mutex Model)" },
                    { label: "Phase 3 Capabilities", value: "Built-in Edge Ingress Listeners (MQTT/HTTP JSON Interfaces)" },
                ]}
            />
        </>
    );
}
