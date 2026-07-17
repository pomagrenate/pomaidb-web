import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocTechnicalSpec, DocCode, DocHighlight, DocNote } from "@/components/docs/doc-components";

export default function StorageEngineDoc() {
    return (
        <>
            <DocHeading>Storage Subsystem: Extreme SSD Durability</DocHeading>

            <DocParagraph>
                Relational databases architected around fixed B-Tree implementations execute continuous "in-place overwrites".
                While adequate for Enterprise SAN hardware, deploying this access pattern upon a commercial MicroSD card inside a drone quickly induces
                Write-Amplification phenomenon—physically exhausting the Flash media's finite P/E (Program/Erase) block cycles until catastrophic silicon failure occurs.
            </DocParagraph>
            <DocParagraph>
                <strong>PomaiDB solves physical hardware death using an advanced Log-Structured Merge (LSM) execution strategy.</strong>
            </DocParagraph>

            <DocSubHeading>Hardware Wear-Aware Append Protocols</DocSubHeading>
            <DocParagraph>
                The engine evaluates every single data mutation strictly as an immutable append record securely directed toward a trailing Write-Ahead Log (WAL).
                Historical data rows are never modified in-place across the drive surface. Deletions and updates simply append rapid "Tombstone" markers mathematically
                overriding precedent reads during index traversal.
            </DocParagraph>

            <DocHighlight title="Endurance-Aware Compaction Biasing">
                Traditional LSM engines aggressively merge and compact historical segments immediately to optimize read speeds, which creates massive background writes.
                PomaiDB embeds <i>Wear-Aware Maintenance metrics</i>—tracking precise byte-written counters directly across the hardware layer.
                Compaction triggers dynamically adjust their heuristics (Endurance-Aware Compaction Biasing), delaying merges on severely strained SD cards to strictly maximize Flash hardware lifespan.
            </DocHighlight>

            <DocSubHeading>The Zero-Copy Synchronous Flush Model</DocSubHeading>
            <DocParagraph>
                Data lands initially into memory-mapped RAM constructs (Memtables). These buffers are periodically dumped into immutable hardware block Segments.
                PomaiDB achieves staggering speeds across low-power ARM64 SOCs because memory reads leverage Zero-Copy <code>mmap</code> views directly.
                The operating system organically pages required mathematical geometry straight into the L1 cache without the PomaiDB engine allocating standard buffered memory copies.
            </DocParagraph>

            <DocTechnicalSpec
                title="Predictable WAL Record Protocol Spec"
                specs={[
                    { label: "Durability Headers", value: "CRC32 (4B) + Length Matrix (4B) + Operation Type Enum (1B)" },
                    { label: "Data Payload Schema", value: "UInt64 Identifiers (8B) + Vector Bits / Raw Semantic Text chunks" },
                    { label: "Hardware Alignment", value: "8-byte cache-line structural byte alignment guaranteeing unified fetches" },
                    { label: "Fsync Granularity", value: "Configurable strictly via FsyncPolicy (kImmediate, kNever, kBatchAligned)" },
                ]}
            />

            <DocSubHeading>Aerospace & Edge Hardware Cryptographic Hardening</DocSubHeading>
            <DocParagraph>
                Physical access implies full system access in edge IoT topology. PomaiDB includes advanced defense mechanics explicitly mitigating physical
                theft of drones, camera configurations, and edge caching nodes. Memory and disk storage blocks natively support continuous
                <code>AES-256-GCM</code> encryption-at-rest executing across the WAL serialization lines.
            </DocParagraph>

            <DocCode language="cpp">
                {`// Cryptographic Integrity Sequence demonstrating PomaiDB Storage Defenses

// 1. Instantiate the KeyManager directly bridging the VFS layer
pomai::EncryptionMatrix keys;
keys.primary_cipher = pomai::SecurityProvider::GenerateAES256("SECURE_ENCLAVE_DERIVED_KEY");

pomai::DBOptions hw_opt;
hw_opt.path = "/data/encrypted_vault";
hw_opt.encryption_key = keys.primary_cipher;

// Active data payloads are transparently encrypted and MAC-authenticated during the Append
std::unique_ptr<pomai::DB> secure_db;
pomai::Status st = pomai::DB::Open(hw_opt, &secure_db);

// 2. Anomaly-Triggered Cryptographic Wipes
// If PomaiDB detects unexpected execution states (e.g. SD-card swap faults, tampering, looping failures)
// The framework invokes emergency Key Destruction loops incinerating encryption material from Volatile RAM.
void trigger_anomaly_event() {
    std::printf("Fatal Chassis intrusion detected via GPIO. Triggering Key Wipe!\\n");
    secure_db->IncinrateCryptographicMaterial();
    // System crashes safely. NVMe data is mathematically inaccessible to hostile operators.
}

// 3. Fsync Configuration for mechanical drives
pomai::WriteOptions w_opts;
w_opts.sync = true; // Forces the OS buffer down mapping directly causing fsync() internally

std::vector<float> vec(384, 0.45f);
st = secure_db->Put(705, vec, w_opts); // Operates securely.
`}
            </DocCode>

            <DocNote title="Hardware Fault Tolerance Confidence:">
                The PomaiDB internal CI/CD matrices run comprehensive crash-replay simulations, artificial power-loss cuts,
                and emulated SD-fault/corrupt block injections. We assert explicit mathematical certainty surrounding our Write-Ahead Log recovery phases.
            </DocNote>

        </>
    );
}
