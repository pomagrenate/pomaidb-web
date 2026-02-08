/*
 * GENERATED FILE — DO NOT EDIT.
 *
 * Source of truth: third_party/pomaisearch (docs + README).
 * Run: node scripts/sync_pomai_search_docs.mjs
 */

export const pomaiSearchDocs = {
  source: {
    repo: "third_party/pomaisearch",
    sha: "unknown",
    lastUpdated: "unknown",
  },
  pages: {
    overview: `
<h2>Pomai Search Engine</h2>
<p>Pomai Search is an in-memory vector search engine designed for fast similarity search and hybrid vector + keyword queries. It is <strong>not</strong> a source-of-truth database.</p>
<blockquote>
  <strong>This is Pomai Search (in-memory search engine), not a source-of-truth database.</strong>
  <p>Use Pomai Search for low-latency retrieval and hybrid ranking. Use a separate system for durability and transactional guarantees.</p>
</blockquote>

<h3>Why Pomai Search is not FAISS</h3>
<ul>
  <li>Deterministic, contract-driven ranking (stable ordering + NaN-safe scores).</li>
  <li>Explain plans with per-stage budgets and per-result score breakdowns.</li>
  <li>Policy-first planners that enforce latency and candidate budgets.</li>
  <li>Replayable snapshot + contract tests for regression gating.</li>
</ul>

<h3>Determinism contract</h3>
<ul>
  <li>Stable hash routing via <code>StableHash64</code> (no <code>std::hash</code>).</li>
  <li>Deterministic tie-break: score desc, key asc, internal_id asc.</li>
  <li>NaN-safe scoring (NaN treated as <code>-inf</code>).</li>
  <li>Deterministic JSON serialization order for explain/contract/metrics.</li>
</ul>

<h3>Quickstart</h3>
<pre><code class="language-bash">cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j</code></pre>

<h4>Run the server</h4>
<pre><code class="language-bash">./build/pomai_search/pomai-searchd --dim 3 --shards 2 --port 8080 --index flat</code></pre>

<h4>Upsert a document</h4>
<pre><code class="language-bash">./build/pomai_search/pomai-search --command upsert --key doc-1 --vector 1,0,0 --metadata tag=demo --text "hello world"</code></pre>

<h4>Vector search</h4>
<pre><code class="language-bash">./build/pomai_search/pomai-search --command search --vector 1,0,0 --topk 5</code></pre>

<h4>Hybrid search</h4>
<pre><code class="language-bash">./build/pomai_search/pomai-search --command search_hybrid --vector 1,0,0 --text "hello" --alpha 0.7 --topk 5</code></pre>

<h4>Explain search</h4>
<pre><code class="language-bash">curl -s -X POST http://localhost:8080/v1/search_explain \
  -H 'Content-Type: application/json' \
  -d '{"vector":[1,0,0],"topk":5,"policy":{"max_latency_ms":50,"max_candidates":50}}'</code></pre>

<h4>Policy usage</h4>
<pre><code class="language-bash">curl -s -X POST http://localhost:8080/v1/search_hybrid_explain \
  -H 'Content-Type: application/json' \
  -d '{
    "vector":[1,0,0],
    "text_query":"hello",
    "alpha":0.6,
    "topk":5,
    "policy":{"max_latency_ms":25,"max_candidates":100,"recall_bias":0.7,"fusion_method":"rrf"}
  }'</code></pre>

<h4>Contract record/verify</h4>
<pre><code class="language-bash">./build/pomai_search/pomai-search --command contract-record \
  --dataset tests/contracts/dataset.json \
  --queries tests/contracts/queries.json \
  --out tests/contracts

./build/pomai_search/pomai-search --command contract-verify --dir tests/contracts</code></pre>

<h3>Build options</h3>
<ul>
  <li><code>POMAI_SEARCH_ENABLE_AVX2</code> (default ON)</li>
  <li><code>POMAI_SEARCH_ENABLE_ASAN</code> (default OFF)</li>
  <li><code>POMAI_SEARCH_ENABLE_TSAN</code> (default OFF)</li>
  <li><code>POMAI_SEARCH_ENABLE_UBSAN</code> (default OFF)</li>
</ul>

<h3>Benchmark examples</h3>
<pre><code class="language-bash">./build/pomai_search/pomai_search_bench_flat --n 10000 --dim 64 --queries 1000 --topk 10 --shards 4
./build/pomai_search/pomai_search_bench_hnsw --n 10000 --dim 64 --queries 1000 --topk 10 --shards 4
./build/pomai_search/pomai_search_bench_recall --n 20000 --dim 64 --queries 500 --topk 10
./build/pomai_search/pomai_search_bench_quality
./build/pomai_search/pomai_search_bench_simd</code></pre>

<h3>Testing</h3>
<pre><code class="language-bash">ctest --test-dir build/pomai_search --output-on-failure</code></pre>

<h3>Roadmap</h3>
<ul>
  <li><strong>Completed:</strong> deterministic contract + explain-first APIs, replayable snapshots, policy-first planner.</li>
  <li><strong>Next:</strong> IVF-PQ, PQ rerank + hybrid reranking hooks, gRPC transport.</li>
</ul>
    `,
    gettingStarted: `
<h2>Getting started with Pomai Search</h2>
<p>Build Pomai Search from source, configure your first engine, and perform a simple search.</p>

<h3>Prerequisites</h3>
<ul>
  <li>C++20 compiler (GCC 10+, Clang 12+, MSVC 2019+)</li>
  <li>CMake 3.15+</li>
  <li>Basic understanding of vector embeddings</li>
</ul>

<h3>Install from source</h3>
<pre><code class="language-bash">git clone https://github.com/yourusername/pomaisearch.git
cd pomaisearch/pomai_search

mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j$(nproc)</code></pre>

<h3>Use CMake FetchContent</h3>
<pre><code class="language-cmake">include(FetchContent)
FetchContent_Declare(
    pomaisearch
    GIT_REPOSITORY https://github.com/yourusername/pomaisearch.git
    GIT_TAG main
)
FetchContent_MakeAvailable(pomaisearch)

target_link_libraries(your_app PRIVATE pomai_search_core)</code></pre>

<h3>Your first engine</h3>
<h4>1) Include headers</h4>
<pre><code class="language-cpp">#include "pomai_search/search_engine.h"
#include &lt;iostream&gt;
#include &lt;vector&gt;

using namespace pomai_search;</code></pre>

<h4>2) Configure engine</h4>
<pre><code class="language-cpp">SearchEngineConfig cfg;
cfg.dim = 128;                                    // Vector dimensions
cfg.index_type = SearchEngineConfig::IndexType::Hnsw;  // Index type
cfg.similarity = SearchEngineConfig::Similarity::Cosine;
cfg.num_shards = 4;                               // Parallelism</code></pre>

<h4>3) Open engine</h4>
<pre><code class="language-cpp">auto engine_or = SearchEngine::Open(cfg);
if (!engine_or.ok()) {
    std::cerr &lt;&lt; "Failed to open: " &lt;&lt; engine_or.status().message() &lt;&lt; "\n";
    return 1;
}
auto engine = std::move(engine_or.value());</code></pre>

<h4>4) Insert vectors</h4>
<pre><code class="language-cpp">std::vector&lt;float&gt; vec1(128);
vec1[0] = 1.0f;

std::vector&lt;float&gt; vec2(128);
vec2[1] = 1.0f;

engine-&gt;Upsert("doc1", VectorView{vec1.data(), 128}, {{"category", "tech"}});
engine-&gt;Upsert("doc2", VectorView{vec2.data(), 128}, {{"category", "science"}});</code></pre>

<h4>5) Search</h4>
<pre><code class="language-cpp">std::vector&lt;float&gt; query(128);
query[0] = 1.0f;

auto results = engine-&gt;Search(VectorView{query.data(), 128});
if (results.ok()) {
    for (const auto&amp; item : results.value()) {
        std::cout &lt;&lt; item.key &lt;&lt; ": " &lt;&lt; item.score &lt;&lt; "\n";
    }
}</code></pre>

<h3>Common use cases</h3>
<ul>
  <li>Semantic search using text embeddings.</li>
  <li>Image search with image embeddings.</li>
  <li>Recommendation systems using user/item vectors.</li>
  <li>Duplicate detection (score &gt; 0.95).</li>
</ul>

<h3>Advanced features</h3>
<ul>
  <li>Metadata filtering via <code>QueryOptions::filter</code>.</li>
  <li>TTL via <code>Upsert(..., ttl)</code>.</li>
  <li>Hybrid search via <code>SearchHybrid</code>.</li>
  <li>Snapshots for fast restart.</li>
</ul>

<h3>Troubleshooting</h3>
<ul>
  <li><strong>Dimension mismatch</strong>: ensure vector dim equals <code>cfg.dim</code>.</li>
  <li><strong>Low recall</strong>: increase <code>hnsw_ef_search</code> or <code>ivf_nprobe</code>.</li>
  <li><strong>High memory</strong>: switch to <code>IvfSq8</code> or reduce <code>hnsw_m</code>.</li>
</ul>
    `,
    api: `
<h2>API reference</h2>
<p>Complete API documentation for Pomai Search Engine.</p>

<h3>SearchEngine</h3>
<h4>Open an engine</h4>
<pre><code class="language-cpp">static StatusOr&lt;std::unique_ptr&lt;SearchEngine&gt;&gt; Open(const SearchEngineConfig&amp; cfg);</code></pre>

<h4>Upsert</h4>
<pre><code class="language-cpp">Status Upsert(std::string_view key,
              VectorView vec,
              Metadata meta = {},
              std::optional&lt;std::chrono::milliseconds&gt; ttl = std::nullopt,
              std::optional&lt;std::string&gt; text = std::nullopt);</code></pre>
<p>Behavior: if <code>key</code> exists, vector + metadata are replaced; metadata is not merged.</p>

<h4>Delete</h4>
<pre><code class="language-cpp">Status Delete(std::string_view key);</code></pre>

<h4>Exists</h4>
<pre><code class="language-cpp">StatusOr&lt;bool&gt; Exists(std::string_view key) const;</code></pre>

<h4>GetVector</h4>
<pre><code class="language-cpp">StatusOr&lt;std::vector&lt;float&gt;&gt; GetVector(std::string_view key) const;</code></pre>

<h4>Search</h4>
<pre><code class="language-cpp">StatusOr&lt;std::vector&lt;ResultItem&gt;&gt; Search(VectorView q, QueryOptions opt);
StatusOr&lt;std::vector&lt;ResultItem&gt;&gt; Search(VectorView q);</code></pre>

<h4>SearchByKey</h4>
<pre><code class="language-cpp">StatusOr&lt;std::vector&lt;ResultItem&gt;&gt; SearchByKey(std::string_view key, QueryOptions opt);
StatusOr&lt;std::vector&lt;ResultItem&gt;&gt; SearchByKey(std::string_view key);</code></pre>

<h4>SearchHybrid</h4>
<pre><code class="language-cpp">StatusOr&lt;std::vector&lt;ResultItem&gt;&gt; SearchHybrid(const HybridQuery&amp; query, QueryOptions opt);
StatusOr&lt;std::vector&lt;ResultItem&gt;&gt; SearchHybrid(const HybridQuery&amp; query);</code></pre>

<h4>SearchWithExplain</h4>
<pre><code class="language-cpp">StatusOr&lt;SearchResponse&gt; SearchWithExplain(VectorView q,
                                           QueryOptions opt,
                                           QueryPolicy policy);</code></pre>

<h4>Stats + Metrics</h4>
<pre><code class="language-cpp">Stats GetStats() const;
std::string MetricsJson() const;</code></pre>

<h4>Close</h4>
<pre><code class="language-cpp">Status Close();</code></pre>

<h3>Configuration</h3>
<p><strong>SearchEngineConfig</strong> includes dimensions, index type, similarity metric, sharding, and index-specific parameters (HNSW/IVF). Recommended defaults:</p>
<ul>
  <li>Exact search: <code>IndexType::Flat</code></li>
  <li>High recall: <code>IndexType::Hnsw</code>, <code>hnsw_m = 32</code>, <code>hnsw_ef_search = 100</code></li>
  <li>Low memory: <code>IndexType::IvfSq8</code>, <code>ivf_nlist = 1000</code>, <code>ivf_nprobe = 20</code></li>
</ul>

<h3>Data types</h3>
<ul>
  <li><strong>VectorView</strong>: non-owning view (<code>const float*</code> + <code>dim</code>).</li>
  <li><strong>Metadata</strong>: <code>unordered_map&lt;string,string&gt;</code>.</li>
  <li><strong>Filter</strong>: exact match on tag/source/lang.</li>
</ul>

<h3>Snapshot API</h3>
<pre><code class="language-cpp">class SnapshotWriter {
public:
    static Status Write(const SearchEngine&amp; engine, std::string_view path);
};

class SnapshotReader {
public:
    static StatusOr&lt;std::unique_ptr&lt;SearchEngine&gt;&gt; Read(std::string_view path);
};</code></pre>

<h3>Error handling</h3>
<ul>
  <li><code>Status</code> with codes: <code>kOk</code>, <code>kInvalidArgument</code>, <code>kNotFound</code>, <code>kResourceExhausted</code>, <code>kInternal</code>.</li>
  <li><code>StatusOr&lt;T&gt;</code> for results + status.</li>
</ul>

<h3>Thread safety</h3>
<ul>
  <li>Concurrent reads: safe.</li>
  <li>Concurrent writes: safe (internal synchronization).</li>
  <li>Read during write: safe (consistent snapshot view).</li>
</ul>

<h3>Limits</h3>
<ul>
  <li>Max dimensions: 65,536</li>
  <li>Max key length: 256 chars (recommended)</li>
  <li>Max metadata size: 64KB (recommended)</li>
</ul>
    `,
    architecture: `
<h2>Architecture guide</h2>
<p>Deep dive into Pomai Search Engine internals.</p>

<h3>High-level structure</h3>
<pre><code>┌─────────────────────────────────────────────────────────┐
│                    SearchEngine                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                SearchEngine::Impl                  │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │ │
│  │  │  Shard 1 │  │  Shard 2 │  │  Shard N │        │ │
│  │  └──────────┘  └──────────┘  └──────────┘        │ │
│  │  ┌──────────────────────────────────────┐         │ │
│  │  │         Thread Pools                 │         │ │
│  │  │  - Query Pool (parallel search)      │         │ │
│  │  │  - Ingest Pool (parallel upsert)     │         │ │
│  │  └──────────────────────────────────────┘         │ │
│  │  ┌──────────────────────────────────────┐         │ │
│  │  │         Metrics                      │         │ │
│  │  └──────────────────────────────────────┘         │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘</code></pre>

<h3>Shard architecture</h3>
<pre><code>┌─────────────────────────────────────────────┐
│                  Shard                      │
│  ┌────────────────────────────────────────┐ │
│  │         VectorStore                    │ │
│  │  - Contiguous float buffer             │ │
│  │  - Aligned for SIMD                    │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │         Index (one of:)                │ │
│  │  - FlatIndex                           │ │
│  │  - HnswIndex                           │ │
│  │  - IvfFlatIndex                        │ │
│  │  - IvfSq8Index                         │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │         KeywordIndex (BM25)            │ │
│  │  - Inverted index                      │ │
│  │  - TF-IDF scoring                      │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │         Document Metadata              │ │
│  │  - Key → ID mapping                    │ │
│  │  - Metadata storage                    │ │
│  │  - TTL tracking                        │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘</code></pre>

<h3>Sharding strategy</h3>
<pre><code class="language-cpp">shard_id = StableHash64(key) % num_shards;</code></pre>
<ul>
  <li>Deterministic placement.</li>
  <li>Even distribution.</li>
  <li>Parallel query execution.</li>
</ul>

<h3>Index implementations</h3>
<ul>
  <li><strong>FlatIndex</strong>: O(N × D) exact search.</li>
  <li><strong>HnswIndex</strong>: O(log N × M × D) graph search.</li>
  <li><strong>IvfFlatIndex</strong>: cluster + scan (O(nprobe × N/nlist × D)).</li>
  <li><strong>IvfSq8Index</strong>: quantized IVF with refinement (4x memory savings).</li>
</ul>

<h3>Serialization</h3>
<p>Snapshot format V2 stores magic bytes, version, config, shard data, and index state for O(N) load time.</p>

<h3>Threading model</h3>
<ul>
  <li>Parallel shard search (future aggregation + nth_element).</li>
  <li>Shard-level shared_mutex for read/write coordination.</li>
</ul>

<h3>Memory management</h3>
<ul>
  <li>VectorStore uses contiguous aligned allocation (32-byte for AVX2).</li>
  <li>Dot product uses AVX2 with fused multiply-add.</li>
</ul>
    `,
    performance: `
<h2>Performance tuning</h2>
<p>Optimize Pomai Search for your workload.</p>

<h3>Quick wins</h3>
<ul>
  <li>Enable AVX2 (<code>enable_avx2 = true</code>).</li>
  <li>Use multiple shards (<code>num_shards = hardware_concurrency()</code>).</li>
  <li>Pre-normalize vectors for cosine similarity.</li>
  <li>Use snapshots for fast restart.</li>
</ul>

<h3>Index selection</h3>
<ul>
  <li>Exact recall: Flat.</li>
  <li>&lt;100K vectors: HNSW.</li>
  <li>100K-10M: IVF-Flat or HNSW.</li>
  <li>&gt;10M or memory constrained: IVF-SQ8.</li>
</ul>

<h3>Parameter tuning</h3>
<ul>
  <li>HNSW <code>M</code>: 8 (low memory), 16 (default), 32 (high recall).</li>
  <li>HNSW <code>ef_construction</code>: 100 fast, 200 default, 400 max quality.</li>
  <li>HNSW <code>ef_search</code>: 20 fast, 50 balanced, 100 high recall.</li>
  <li>IVF <code>nlist</code>: ~sqrt(N). IVF <code>nprobe</code>: ~nlist/10.</li>
</ul>

<h3>Hardware optimization</h3>
<ul>
  <li>CPU: more cores, larger L3 cache, AVX2/AVX-512.</li>
  <li>Memory: IVF-SQ8 for large datasets; consider distributed for &gt;100M.</li>
  <li>Storage: SSD/NVMe for fast snapshot loads.</li>
</ul>

<h3>Monitoring</h3>
<ul>
  <li>Track p95/p99 latency, QPS, recall, and RSS.</li>
  <li>Alert if p99 &gt; 100ms or recall drops &gt;2%.</li>
</ul>

<h3>Troubleshooting</h3>
<ul>
  <li><strong>High latency</strong>: lower <code>ef_search</code> / <code>nprobe</code>, add shards.</li>
  <li><strong>Low recall</strong>: raise <code>ef_search</code> / <code>nprobe</code>, raise <code>M</code>.</li>
  <li><strong>High memory</strong>: IVF-SQ8, lower <code>hnsw_m</code>.</li>
</ul>

<h3>Benchmarking</h3>
<pre><code class="language-bash">cd build
./benchmark --dataset sift1m --index hnsw --topk 10</code></pre>
    `,
    snapshots: `
<h2>Snapshots &amp; determinism contract</h2>
<blockquote>
  <strong>Determinism contract:</strong>
  <p>Stable routing, deterministic ordering, and NaN-safe scoring ensure identical queries return identical ordering.</p>
</blockquote>

<h3>Deterministic ranking rules</h3>
<ul>
  <li>Stable hash routing via <code>StableHash64</code>.</li>
  <li>Tie-break ordering: score desc, key asc, internal_id asc.</li>
  <li>NaN is treated as negative infinity.</li>
</ul>

<h3>Snapshots</h3>
<p>Snapshots are replayable and allow fast, deterministic restarts.</p>
<pre><code class="language-cpp">Status s = SnapshotWriter::Write(*engine, "index.pomai");
if (!s.ok()) {
    std::cerr &lt;&lt; "Save failed: " &lt;&lt; s.message() &lt;&lt; "\n";
}</code></pre>
<pre><code class="language-cpp">auto engine_or = SnapshotReader::Read("index.pomai");
if (!engine_or.ok()) {
    std::cerr &lt;&lt; "Load failed: " &lt;&lt; engine_or.status().message() &lt;&lt; "\n";
    return;
}
auto engine = std::move(engine_or.value());</code></pre>

<h3>Contract tests</h3>
<pre><code class="language-bash">./build/pomai_search/pomai-search --command contract-record \
  --dataset tests/contracts/dataset.json \
  --queries tests/contracts/queries.json \
  --out tests/contracts

./build/pomai_search/pomai-search --command contract-verify --dir tests/contracts</code></pre>
    `,
    cAbi: `
<h2>Pomai Search C ABI</h2>
<p>The C ABI is a stable wrapper for binding from Rust, Go, Python, Node, and more.</p>

<h3>Versioning &amp; ABI stability</h3>
<ul>
  <li>ABI version: <code>POMAI_SEARCH_C_ABI_VERSION</code> (breaking changes).</li>
  <li>API version: <code>POMAI_SEARCH_C_API_VERSION_{MAJOR,MINOR,PATCH}</code> (non-breaking).</li>
  <li>Every public struct begins with <code>struct_size</code> for forward compatibility.</li>
</ul>

<h3>Ownership &amp; lifetime</h3>
<ul>
  <li>Caller must not free memory returned by C API directly.</li>
  <li>Use matching free functions: <code>pomai_search_results_free</code>, <code>pomai_search_iter_close</code>, <code>pomai_search_engine_close</code>.</li>
  <li>Views are valid only while the owning results/iterator is alive.</li>
</ul>

<h3>Error model</h3>
<ul>
  <li>Functions return <code>pomai_search_status_code_t</code>.</li>
  <li>Extended details via <code>pomai_search_last_error_code()</code> and <code>pomai_search_last_error_message()</code>.</li>
</ul>

<h3>Thread safety</h3>
<ul>
  <li>Engine operations: thread-safe for concurrent search and upsert.</li>
  <li>Results: immutable and safe for concurrent reads.</li>
  <li>Iterators: not thread-safe; use single thread.</li>
</ul>

<h3>Build &amp; link</h3>
<pre><code class="language-bash">cmake -S . -B build -DPOMAI_SEARCH_BUILD_C_API=ON
cmake --build build</code></pre>
<pre><code class="language-cmake">find_package(pomai_search REQUIRED)
target_link_libraries(my_app PRIVATE pomai_search_c)
target_include_directories(my_app PRIVATE /path/to/pomai_search/include)</code></pre>

<h3>Examples</h3>
<ul>
  <li><code>examples/c_api_hello.c</code> — minimal insert/search.</li>
  <li><code>examples/c_api_iter_export.c</code> — iterate and export JSONL.</li>
</ul>

<blockquote>
  <strong>No C++ types; no exceptions across boundary.</strong>
</blockquote>
    `,
    benchmarks: `
<h2>Benchmarks &amp; quality gates</h2>
<p>Pomai Search ships with benchmark binaries to measure latency, QPS, recall, and memory.</p>

<h3>Run benchmarks</h3>
<pre><code class="language-bash">./build/pomai_search/pomai_search_bench_flat --n 10000 --dim 64 --queries 1000 --topk 10 --shards 4
./build/pomai_search/pomai_search_bench_hnsw --n 10000 --dim 64 --queries 1000 --topk 10 --shards 4
./build/pomai_search/pomai_search_bench_recall --n 20000 --dim 64 --queries 500 --topk 10
./build/pomai_search/pomai_search_bench_quality
./build/pomai_search/pomai_search_bench_simd</code></pre>

<h3>Interpret results</h3>
<ul>
  <li><strong>Build time</strong>: index creation time.</li>
  <li><strong>QPS</strong>: queries per second under the given workload.</li>
  <li><strong>Recall@k</strong>: quality relative to exact search.</li>
  <li><strong>Memory</strong>: RSS reported in MB.</li>
</ul>

<h3>Quality gates</h3>
<ul>
  <li>Track p95/p99 latency targets per index type.</li>
  <li>Track recall drift across releases with contract tests.</li>
  <li>Validate memory stays within budget.</li>
</ul>
    `,
    playground: `
<h2>Playground</h2>
<p>Pomai Search’s WASM playground is planned to mirror PomaiDB’s trust playground with deterministic, offline workflows:</p>
<ul>
  <li>Seeded dataset generation for deterministic ingest.</li>
  <li>Upsert vectors with optional metadata/ttl/text.</li>
  <li>Search, SearchByKey, and Hybrid search with alpha slider.</li>
  <li>Deterministic ordering verification.</li>
</ul>
<p>When the Pomai Search WASM target lands, this page will host the offline demo and guardrails (preset sizes, memory estimates, worker execution).</p>
    `,
    nonGoals: `
<h2>Non-goals</h2>
<ul>
  <li>Pomai Search is <strong>not</strong> a source-of-truth database.</li>
  <li>Pomai Search is <strong>not</strong> a distributed or replicated cluster.</li>
  <li>Pomai Search does <strong>not</strong> manage transactional guarantees.</li>
  <li>Pomai Search does <strong>not</strong> run external network calls during search.</li>
</ul>
    `,
  },
} as const;

export type PomaiSearchDocKey = keyof typeof pomaiSearchDocs.pages;
