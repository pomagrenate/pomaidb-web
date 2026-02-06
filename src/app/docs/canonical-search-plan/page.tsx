import React from "react";

export default function CanonicalSearchPlanDoc() {
  return (
    <div className="mdx">
      <h1>Canonical search plan: IVF + exact rerank</h1>

      <h2>Objectives</h2>
      <ul>
        <li>
          <strong>High recall</strong>: &gt;= 0.94 recall@1/10/100.
        </li>
        <li>
          <strong>Performance</strong>: Sub-linear search scaling using IVF (Inverted File Index).
        </li>
        <li>
          <strong>Consistency</strong>: Strict snapshot isolation. Readers see a fixed point-in-time view.
        </li>
        <li>
          <strong>Simplicity</strong>: One canonical path. No index zoo.
        </li>
      </ul>

      <h2>Architecture</h2>

      <h3>The canonical pipeline</h3>
      <p>
        The search operation follows a strictly defined &quot;Coarse → Gather → Rerank&quot; pipeline.
      </p>

      <ol>
        <li>
          <p>
            <strong>Coarse stage (routing)</strong>
          </p>
          <ul>
            <li>Compute distances between Query and <strong>Centroids</strong>.</li>
            <li>Select top <code>nprobe</code> centroids.</li>
            <li>
              <strong>Input</strong>: Query.
            </li>
            <li>
              <strong>Output</strong>: List of candidate Centroid IDs.
            </li>
          </ul>
        </li>

        <li>
          <p>
            <strong>Gather stage (candidate selection)</strong>
          </p>
          <ul>
            <li>Fetch Posting Lists for selected centroids.</li>
            <li>Accumulate Candidate Vector IDs.</li>
            <li>
              <strong>Constraint</strong>: Cap candidates at <code>max_candidates</code> per segment to prevent
              OOM.
            </li>
          </ul>
        </li>

        <li>
          <p>
            <strong>Exact rerank stage</strong>
          </p>
          <ul>
            <li>Fetch full vectors for all candidates.</li>
            <li>Compute exact Dot Product (SIMD optimized).</li>
            <li>Maintains a generic Top-K Min-Heap.</li>
            <li>
              <strong>Constraint</strong>: Tie-breaking must be deterministic (Score desc, ID asc).
            </li>
          </ul>
        </li>
      </ol>

      <h3>Indexing strategy: segment-level IVF</h3>
      <p>Indices are immutable and scoped 1:1 with Segments.</p>
      <ul>
        <li>
          <strong>Structure</strong>: <code>IVFFlat</code> (Centroids + Adjacency List of IDs).
        </li>
        <li>
          <strong>Persistence</strong>: Sidecar file (e.g., <code>segment_X.idx</code>) alongside{" "}
          <code>segment_X.dat</code>.
        </li>
        <li>
          <strong>Lifecycle</strong>:
          <ul>
            <li>Built during <code>Freeze</code> (MemTable → Segment).</li>
            <li>Built during <code>Compact</code> (Merged Segment → New Index).</li>
            <li>Loaded via mmap/read-all during <code>DB::Open</code>.</li>
          </ul>
        </li>
      </ul>

      <h3>Snapshot semantics</h3>
      <p>
        Search adheres to strict Snapshot Isolation. Layers (searched in order, deduped via{" "}
        <code>SeenTracker</code>):
      </p>
      <ol>
        <li>
          <strong>Active MemTable</strong>: Brute-force scan (small, &lt;5000 items).
        </li>
        <li>
          <strong>Frozen MemTables</strong>: Brute-force scan (transient).
        </li>
        <li>
          <strong>Segments</strong>: IVF Search (dominant data).
        </li>
      </ol>

      <p>
        <strong>Note on consistency</strong>: Unlike previous versions, Search <strong>DOES</strong> scan the
        Active MemTable, ensuring <code>Put(X) → Search(X)</code> works instantly (Read Your Writes) if X is
        top-k.
      </p>

      <h2>Configuration knobs (minimal zoo)</h2>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Knob</th>
            <th style={{ textAlign: "left" }}>Default</th>
            <th style={{ textAlign: "left" }}>Scope</th>
            <th style={{ textAlign: "left" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>nlist</code>
            </td>
            <td>64</td>
            <td>Build</td>
            <td>
              Number of centroids (set via <code>IndexParams</code>).
            </td>
          </tr>
          <tr>
            <td>
              <code>nprobe</code>
            </td>
            <td>8</td>
            <td>Query</td>
            <td>
              Number of centroids to search (set via <code>IndexParams</code>).
            </td>
          </tr>
          <tr>
            <td>
              <code>max_candidates</code>
            </td>
            <td>4096</td>
            <td>Query</td>
            <td>Max candidates to rerank per segment (Hardcoded for now).</td>
          </tr>
          <tr>
            <td>
              <code>rerank_k</code>
            </td>
            <td>TopK</td>
            <td>Query</td>
            <td>Implicitly TopK.</td>
          </tr>
        </tbody>
      </table>

      <h2>Multi-threading model</h2>
      <ul>
        <li>
          <strong>Shard-level</strong>: Queries are distributed to Shards (existing).
        </li>
        <li>
          <strong>Segment-level</strong>: Inside a Shard, large segments are searched in parallel using a
          bounded <code>ThreadPool</code>.
        </li>
        <li>
          <strong>Scratch buffers</strong>: All temporary buffers (scores, candidates) are thread-local or
          pooled. No per-query allocations in hot loop.
        </li>
      </ul>

      <h2>Invariants &amp; fallbacks</h2>
      <ul>
        <li>
          <strong>Fallback</strong>: If <code>.idx</code> is missing/corrupt, segment falls back to Brute Force
          scan.
        </li>
        <li>
          <strong>Determinism</strong>: KMeans uses fixed seed. Rerank uses stable sort.
        </li>
        <li>
          <strong>Safety</strong>: If <code>max_candidates</code> is reached, we drop remaining candidates? No,
          we prioritize by coarse distance? Currently just &quot;first nprobe lists&quot;.
        </li>
      </ul>
    </div>
  );
}
