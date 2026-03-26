import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocList, DocTable, DocHighlight, DocCode } from "@/components/docs/doc-components";

export default function MembranesDoc() {
    return (
        <>
            <DocHeading>Membranes & Multimodal AI Memory Architecture</DocHeading>

            <DocParagraph>
                A deeply unique aspect defining the core architectural philosophy of PomaiDB is its complete rejection of the
                "One-Size-Fits-All Monolithic Index". Modern Edge AI and Robotics require executing profoundly different queries across
                substantially divergent domains simultaneously—mapping computer vision coordinates, retaining RAG textual history logs,
                geographically mapping obstacle clouds, and evaluating raw sensor scalar matrices.
            </DocParagraph>
            <DocParagraph>
                PomaiDB isolates all of these completely differing operational profiles into logical, immutably typed collections known as
                <strong>Membranes</strong>.
            </DocParagraph>

            <DocSubHeading>The Membrane Typology Spectrum</DocSubHeading>
            <DocParagraph>
                Every Membrane specifies isolated dimension sets, independent hardware sharding rules, strictly designated index typologies
                (e.g., IVF clustering algorithms vs navigable HNSW networks), and unique retention parameters—all while safely operating atop
                the unified physical VFS and Log-Structured WAL system beneath.
            </DocParagraph>

            <DocList>
                <li><code>kVector</code> & <code>kRag</code>: Traditional dense embedding stores mapped explicitly over textual corpora for Retrieval-Augmented Generation workflows.</li>
                <li><code>kGraph</code>: Advanced Edge/Vertex topological stores designed specifically to empower associative logic traversing path logic between disjointed multi-dimensional coordinates.</li>
                <li><code>kTimeSeries</code> & <code>kKeyValue</code>: Extreme-velocity telemetry ingestion endpoints built directly beside the AI vector stores preventing multi-database maintenance complexity.</li>
                <li><code>kMesh</code>, <code>kSpatial</code> & <code>kBlob</code>: Binary object engines combined with spatial routing models specifically developed for processing LiDAR point clouds and robotic navigation meshes in real-time.</li>
            </DocList>

            <DocHighlight title="Intelligent kMesh & TaskScheduler LOD Management">
                The <code>kMesh</code> membrane encapsulates PomaiDB's most advanced edge capability. It ships with a fully asynchronous
                multi-Level-of-Detail (LOD) generation manager. Operating strictly via a low-priority background TaskScheduler thread,
                PomaiDB continuously interpolates incoming high-poly meshes and algorithmically generates decimated/compression tiers
                passively while standard execution continues entirely undisturbed.
                <br /><br />
                When standard retrieval queries fire, the interface automatically prioritizes latency targets resulting in lower-tier
                LODs returning instantly. System engineers then deliberately structure override queries requiring high-resolution
                results where visualization necessity trumps physical compute speed.
            </DocHighlight>

            <DocSubHeading>ObjectLinker Integration (Phase 2 Roadmap)</DocSubHeading>
            <DocParagraph>
                While separating domains enforces structural security, the ability to seamlessly trace data dependencies is paramount.
                PomaiDB's next generation <strong>ObjectLinker</strong> technology structurally empowers deterministic multi-lateral query expansions natively internally.
            </DocParagraph>
            <DocParagraph>
                Using the <code>LinkObjects</code> architecture, PomaiDB binds distinct internal Global Identifiers (GIDs) bridging vectors to graphs to meshes directly.
            </DocParagraph>

            <DocCode language="cpp">
                {`// Conceptual Membrane Linking Matrix Example
// Phase 2 Draft Integration Flowchart
pomai::MembraneSpec vision("vision_vectors", pomai::kVector, 512);
pomai::MembraneSpec taxonomy("world_graph", pomai::kGraph, 0);

db->CreateMembrane(vision);
db->CreateMembrane(taxonomy);

// Ingest visual feature arrays mapping camera object boundaries
db->OpenMembrane("vision_vectors")->Put(201, image_embedding_span);

// Connect semantic world associations directly inside the database
pomai::NodeID current_node = db->OpenMembrane("world_graph")->InsertVertex("Obstacle: Table");
db->OpenMembrane("world_graph")->InsertEdge(current_node, "IS_LOCATED_IN", "KitchenNode");

// Execute the Phase 2 ObjectLinker Binding Protocol across discrete sets!
db->LinkObjects( /* target ID */ 201, /* Linked Graph GID */ current_node );

// Later AI-Decision queries automatically cascade out:
// A spatial query matching image_embedding_span instantly navigates the graph edge
// returning 'KitchenNode' autonomously!`}
            </DocCode>

            <DocSubHeading>Multimodal Hybrid Search Orchestration</DocSubHeading>
            <DocParagraph>
                Evaluating constraints across membranes requires a sophisticated Query Orchestrator. PomaiDB executes intricate filtering combinations deterministically.
            </DocParagraph>
            <DocTable
                headers={["Query Stage", "Filter Type", "Algorithmic Behavior", "Outcome"]}
                rows={[
                    ["Pre-Filtering", "Metadata (device_id='robot_4')", "Bitmap intersection across indices", "Isolates calculation boundaries"],
                    ["Vector Search", "Cosine Similarity (Top-K=5)", "Quantized SIMD Matrix evaluation", "Locates dense geometrical proximity"],
                    ["Object Linked Expand", "Graph Traversal limits", "Traverse neighbor vertices recursively", "Resolves spatial semantic association"],
                    ["Post-Aggregation", "Mini-OLAP Aggregations", "Calculate Averages / Bounds limit", "Final Deterministic Telemetry"],
                ]}
            />
        </>
    );
}
