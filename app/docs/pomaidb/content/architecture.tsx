import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocList, DocTechnicalSpec, DocHighlight, DocTable, DocCode } from "@/components/docs/doc-components";

export default function ArchitectureDoc() {
    return (
        <>
            <DocHeading>Architectural Execution Model & Core Engines</DocHeading>

            <DocParagraph>
                Modern distributed vector databases are structurally organized around network consensus protocols, immense connection pools,
                and horizontally scalable Shard coordination layers. PomaiDB intentionally rejects this complexity. It is built atop a strictly
                <strong>shared-nothing, single-threaded executor model</strong> designed entirely to maximize cache-line locality and deterministic
                low-latency performance on constrained System-on-Chip (SoC) architectures like the Broadcom BCM2711 (Raspberry Pi 4) and NVIDIA Jetson Orin Nano.
            </DocParagraph>

            <DocSubHeading>1. The Tri-Partite Execution Core</DocSubHeading>
            <DocParagraph>
                Execution flows exclusively through three heavily optimized primary subsystems executing synchronously on the main Event Loop thread:
            </DocParagraph>
            <DocList>
                <li><strong><code>DbImpl</code> (The Controller):</strong> The monolithic orchestrator. It manages the central event horizon loop, routes IOPS directly linking to the <code>VFS</code> layer, controls hardware-level bindings (such as memory mapping), and executes atomic transactional boundaries securely.</li>
                <li><strong><code>MembraneManager</code> (The Typology Router):</strong> Manages the dynamic instantiation, topological formatting, Memory-Arena mapping, and isolated lifecycle phasing of logically separated <code>kVector</code>, <code>kGraph</code>, and <code>kRag</code> structures bridging the unified WAL.</li>
                <li><strong><code>QueryOrchestrator</code> (The Intelligence Kernel):</strong> Receives raw client input parameters, compiles multi-membrane heuristic execution graphs, binds bounding frontiers securely preventing RAM escalation, and dispatches SIMD instructions dynamically dependent upon current SoC hardware capabilities (e.g. accelerating calculations via ARM Neon or x86 AVX2 natively).</li>
            </DocList>

            <DocSubHeading>2. Edge-Native Connectivity (Phase 3 Spec)</DocSubHeading>
            <DocParagraph>
                Typical edge architectures require standing up proxy sidecars (like Nginx or HAProxy) simply to protect and route telemetry
                into database nodes securely. PomaiDB embeds enterprise-grade connectivity protocols directly inside the <code>DbImpl</code> loop
                layer.
            </DocParagraph>
            <DocParagraph>
                Operating entirely decoupled from traditional web frameworks, the engine runs native extremely lightweight HTTP and MQTT/WebSocket-style listeners
                exposing standard ingress endpoints: <code>/health</code>, <code>/metrics</code>, <code>/ingest/meta/..</code> and <code>/ingest/vector/..</code>.
            </DocParagraph>
            <DocHighlight title="Resilient Edge Protocols">
                Because Edge deployments suffer severe intermittent network blackouts, PomaiDB intrinsically embeds Token Auth protocols,
                Ingress Rate-Limiting functionality to protect against uncoordinated sensory flooding bursts, Identity/Idempotency Keys neutralizing duplicate payload transmissions during power recovery sequences,
                and instantaneous synchronous JSON ACK/ERR model replies executing zero heap allocations.
            </DocHighlight>

            <DocSubHeading>3. Edge Analytical Aggregation (Mini-OLAP)</DocSubHeading>
            <DocParagraph>
                Retrieving uncompressed raw vector geometries across low bandwidth cellular modems in IoT networks is computationally restrictive.
                PomaiDB shifts logic directly down to the database core. The architecture includes a specialized embedded "Mini-OLAP" post-filtering pipeline.
            </DocParagraph>
            <DocParagraph>
                Engineers can configure PomaiDB to dynamically return evaluated mathematics operating over the final Top-K hit sets.
                Calculable primitives include <code>Sum()</code>, <code>Avg()</code>, <code>Min()</code>, <code>Max()</code>, and <code>Count()</code> filters entirely locally.
            </DocParagraph>

            <DocSubHeading>Simulated Architecture Execution Stack Trace</DocSubHeading>
            <DocCode language="bash">
                {`# 1. DbImpl Initializes the VFS and validates physical NVMe boundaries
[pomai_init] Starting single-threaded Executor Loop. Clock: Monotonic
[pomai_mem] Pre-allocating 128MB Arena via palloc routines. Address: 0x7fffb841a000

# 2. MembraneManager provisions topological matrices over the Arena
[membrane_mgr] Provisioning membrane 'sensor_data' [kTimeSeries] [Dim: 64]
[membrane_mgr] Provisioning membrane 'camera_vision' [kVector] [Dim: 512]

# 3. Embedded Ingress Thread (Phase 3) receives raw MQTT Telemetry
[ingress_mqtt] Received payload {id: 2049, type: 'vector'} from device_04. 
[ingress_mqtt] Idempotency key 'a1b2c3d4' validated successfully.

# 4. Transaction commits natively into the WAL without any thread-context switching
[wal_engine] Appended 528 bytes securely to segment 001. Sync constraint: NEVER.

# 5. QueryOrchestrator resolves a comprehensive multi-modal query
[query_orch] Evaluating Cosine Distances across 'camera_vision' matrix [SIMD AVX2 Path Enabled].
[query_orch] Filtering metadata partition hints -> location_id == "FACTORY_FLOOR_A".
[query_orch] Contextual Frontier bounded. Executing Mini-OLAP Average -> 0.8842`}</DocCode>


            <DocSubHeading>4. Trade-Off Comparison Matrix</DocSubHeading>
            <DocTable
                headers={["Structural Component", "PomaiDB Embedded Engine", "Scale-Out Cloud Systems"]}
                rows={[
                    ["Concurrency Logic", "Sequential Determinism (Zero Locking)", "Multi-Version Concurrency (MVCC) / Latches"],
                    ["Fault Tolerance", "Atomic Checkpointing / Sequential Recovery", "Paxos / Raft Distributed Consensus Networks"],
                    ["Resource Allocation", "Rigorous Static Pre-Allocation", "Generational Garbage Collection"],
                    ["Primary Application", "Automotive, AI Wearables, Drones", "Gen-AI SaaS, Recommendation Engines"],
                    ["System Complexity", "Micro-kernel Minimalist Footprint", "High-Complexity Operator Maintenance"],
                ]}
            />
        </>
    );
}
