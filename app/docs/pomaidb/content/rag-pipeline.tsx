import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocList, DocHighlight, DocCode, DocNote } from "@/components/docs/doc-components";

export default function RagPipelineDoc() {
    return (
        <>
            <DocHeading>Offline-First Edge RAG Pipeline</DocHeading>

            <DocParagraph>
                Retrieval-Augmented Generation (RAG) is the foundational architecture required to grant Large Language Models (LLMs)
                and Small Language Models (SLMs) dynamic factual recall. RAG systems extract highly relevant snippets from a vast,
                continuously updating external database, and inject those exact documents straight into the inference context window
                of the neural network before forcing it to generate conversational replies.
            </DocParagraph>
            <DocParagraph>
                However, the current industry archetype for RAG depends entirely upon external network latency: developers utilize massive HTTP API
                clusters (like OpenAI or AWS) for text-chunking algorithms, vector-embedding calculation models, and similarity vector database scoring.
            </DocParagraph>
            <DocParagraph>
                <strong>PomaiDB completely inverts this paradigm.</strong> It ships a tightly integrated, fully offline, Zero-Dependency Edge RAG pipeline
                designed explicitly to operate securely atop air-gapped devices, military hardware, or constrained robotic gateways where
                assuming Cloud connectivity is physically dangerous.
            </DocParagraph>

            <DocSubHeading>The Zero-Dependency Ingestion Workflow</DocSubHeading>
            <DocParagraph>
                The PomaiDB pipeline accepts raw, bloated strings of text directly at the API edge. The engine then safely segments it without
                unnecessary memory allocation, embeds it, and indexes the entire hierarchy locally inside strict zero-OOM allocations.
            </DocParagraph>

            <DocList>
                <li><strong>Zero-Copy Semantic Chunking:</strong> C++20's <code>std::string_view</code> allows PomaiDB to evaluate extreme textual corpora efficiently. Moving a multi-megabyte manual manual text across the recursive splitter simply manipulates pointer boundary arithmetic locally—meaning memory utilization remains at exactly O(1) across the processing boundary.</li>
                <li><strong>Deterministically Pluggable Embedders:</strong> The RAG schema requires an <code>EmbeddingProvider</code> interface abstraction to convert string chunks into floating-point numerical space. The library embeds a Deterministic Mock provider by default allowing offline test-driven deployment. For genuine edge inference, it integrates effortlessly with minimal GGML/llama.cpp binaries to calculate real embeddings without modifying the pipeline itself.</li>
                <li><strong>Dynamic Context Orchestration:</strong> When resolving queries, the Orchestrator doesn't just evaluate spatial proximity. It locates the optimal chunk, executes reverse ID lookups internally, and formats a pristine context representation of the text dynamically, returning a single, synthesized payload instantly.</li>
            </DocList>

            <DocHighlight title="Inference-Only AI Dispatch (No Model Tuning)">
                Operating standard databases requires complex metric optimization to establish optimal query heuristics.
                PomaiDB’s heuristic Inference-Dispatch matrix can autonomously classify and prioritize multi-modal membrane
                datatypes—eliminating arbitrary parameter tuning manually while preventing "Overfitting" phenomena against test queries.
            </DocHighlight>

            <DocSubHeading>End-To-End RAG Demonstration (C++)</DocSubHeading>
            <DocParagraph>
                The following example comprehensively demonstrates how an engineer fully establishes an isolated intelligence
                module utilizing PomaiDB's pipeline APIs without relying upon internet HTTP calls.
            </DocParagraph>

            <DocCode language="cpp">
                {`#include "pomai/pomai.h"
#include "pomai/rag/embedding_provider.h"
#include "pomai/rag/pipeline.h"
#include <memory>
#include <string>
#include <iostream>

int main() {
    // 1. Database Initialization
    pomai::DBOptions opt;
    opt.path = "/opt/autonomous_drone/memory_vault";
    opt.dim = 384;              // Output dimensionality of our selected model
    opt.shard_count = 2;        // Split index mapping for multi-thread querying (if implemented)
    
    std::unique_ptr<pomai::DB> db;
    if (!pomai::DB::Open(opt, &db).ok()) return 1;

    // 2. Establishing the specialized RAG Membrane
    // A Membrane Kind of "kRag" instructs PomaiDB to organize memory structures appropriately
    // to map textual documents seamlessly back into vector coordinates.
    pomai::MembraneSpec rag_membrane;
    rag_membrane.name = "local_context_rag";
    rag_membrane.dim = 384;
    rag_membrane.shard_count = 2;
    rag_membrane.kind = pomai::MembraneKind::kRag;
    
    if (!db->CreateMembrane(rag_membrane).ok() || !db->OpenMembrane("local_context_rag").ok()) {
        std::cerr << "Membrane generation failed!\\n"; 
        return 1;
    }

    // 3. Mount an Embedding Provider 
    // In production, this bounds logic targeting edge models (e.g. ALL-MINI-LM-L6 via ONNX Edge).
    // For documentation, we rely on the predictable mock embedder.
    pomai::MockEmbeddingProvider edge_model(384);

    // 4. Configure Chunking Constraints to avert OOM Panics
    pomai::RagPipelineOptions pipe_opts;
    pipe_opts.max_chunk_bytes = 512;        // Bound the maximum token-equivalent size
    pipe_opts.chunk_overlap_bytes = 64;     // Overlap buffers ensure semantic meaning isn't fractured
    
    pomai::RagPipeline pipeline(db.get(), "local_context_rag", 384, &edge_model, pipe_opts);

    // 5. Ingestion Phase - Text -> Chunk -> Embed -> LSM -> physical Disk
    std::string internal_documentation = 
        "OPERATION OMEGA GUIDELINES.\\n"
        "The primary directive for the autonomous navigational framework involves zero human contact.\\n"
        "In the event of communications blackout, standard protocol enforces immediate return to home beacon.";
    
    if (!pipeline.IngestDocument(8001, internal_documentation).ok()) {
       return 1;
    }

    // 6. Natural Language Querying logic
    std::string llm_context;
    auto status = pipeline.RetrieveContext("What is the protocol for communications blackout?", 3, &llm_context);

    if (status.ok()) {
        std::cout << "[RETRIEVED LOCAL EDGE CONTEXT]\\n";
        std::cout << llm_context << "\\n";
        // Context is safely passed to the Local-LLM logic generator here!
    }

    db->Close();
    return 0;
}`}
            </DocCode>

            <DocNote title="Memory Guarantee">
                Across the entirety of that pipeline block—segmentation, vector generation arrays, indexing matrices—the absolute memory
                profile executed strictly inside the palloc allocations bound configuration parameters. There are physically zero vectors
                floating orphaned out in dynamic system RAM blocks that could leak and destroy the machine context.
            </DocNote>
        </>
    );
}
