import type { Metadata } from "next";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

export const metadata: Metadata = {
    title: "Cheeserag Studio | Pomai Ecosystem",
    description: "Privacy-First Local Knowledge Workspace — A Local-First Alternative to NotebookLM",
};

export default function CheeseragStudioPage() {
    return (
        <ForestPageShell
            eyebrow="Privacy-First Local Workspace"
            title="Cheeserag Studio"
            description="An end-to-end, fully offline AI workspace. Upload PDFs, CSVs, and transcripts, then chat with them through a rich 3-panel web interface. Every answer is strictly grounded in your documents — no hallucinations, no data leakage, zero cloud calls."
        >
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">What's Inside</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            title="Cheesebrain"
                            desc="OpenAI-compatible server (/v1/chat/completions, /v1/embeddings)."
                            tag="C++20 | LLM Inference"
                        />
                        <FeatureCard
                            title="PomaiDB"
                            desc="Multi-membrane edge vector DB with zero-OOM guarantees."
                            tag="C++20 + Python | Vector DB"
                        />
                        <FeatureCard
                            title="Cheese API"
                            desc="Workspace CRUD, async ingest, citation metadata, audio overviews."
                            tag="Python / FastAPI | Orchestrator"
                        />
                        <FeatureCard
                            title="Cheesepath Agent"
                            desc="CLI agent with ReAct, planning, multi-role panel, tool registry."
                            tag="Go | Autonomous Agent"
                        />
                        <FeatureCard
                            title="Studio UI"
                            desc="3-panel workspace: sources, chat, notes with exact PDF citations."
                            tag="TypeScript / Next.js 14 | UI"
                        />
                    </div>
                </div>

                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Edge AI Design Philosophy</h2>
                    </div>

                    <div className="fp-card border-emerald-900/50 mb-10 relative overflow-hidden bg-[#050a05]">
                        <p className="text-zinc-400 text-sm leading-relaxed italic relative z-10">
                            "I could have easily integrated the OpenAI API, but my goal was to engineer a highly secure, air-gapped, local-first RAG workspace capable of running on resource-constrained hardware. By designing a micro-agent pipeline architecture and integrating it tightly with PomaiDB, I successfully mitigated the reasoning limitations of a 0.5B model. This kept the total memory footprint under 1 GB while maintaining high extraction accuracy and zero data leakage."
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="fp-card border-emerald-900/30">
                            <h3 className="text-lg font-bold text-white/90 mb-3">Tactic 1: Algorithmic Citation</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                The LLM is never asked to place citation markers. The backend runs TF-IDF cosine similarity between the generated answer and retrieved chunks. Footnote markers are programmatically inserted, ensuring zero hallucinated citations.
                            </p>
                        </div>
                        <div className="fp-card border-emerald-900/30">
                            <h3 className="text-lg font-bold text-white/90 mb-3">Tactic 2: Prompt Chaining</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Audio overviews run sequentially: extract bullet points, aggregate via pure Python, and synthesize dialogue. Each LLM call is kept under 512 tokens, well within the reliable context window of a 0.5B model.
                            </p>
                        </div>
                        <div className="fp-card border-emerald-900/30">
                            <h3 className="text-lg font-bold text-white/90 mb-3">Tactic 3: Constrained Generation</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Enforcing max_tokens to 150 prevents rambling. Using completion-style prompts ending with a colon forces the model to fill a blank rather than drift into uncontrolled generation.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Recommended Start (Docker Compose)</h2>
                    </div>
                    
                    <div className="fp-card border-emerald-900/30">
                        <p className="text-zinc-400 text-sm mb-4">The easiest path. Docker builds all three C++ submodules automatically inside containers.</p>
                        <pre className="bg-[#020502] p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-sm overflow-x-auto"><code>
docker-compose up --build -d
                        </code></pre>
                        
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-sm text-left text-zinc-300">
                                <thead className="text-xs uppercase bg-emerald-950/30 text-emerald-400">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-emerald-900/40 font-mono">Service</th>
                                        <th className="px-4 py-3 border-b border-emerald-900/40 font-mono">URL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                        <td className="px-4 py-3 font-mono text-emerald-300">Studio Web UI</td>
                                        <td className="px-4 py-3 text-zinc-400">http://localhost:3000</td>
                                    </tr>
                                    <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                        <td className="px-4 py-3 font-mono text-emerald-300">Cheese API</td>
                                        <td className="px-4 py-3 text-zinc-400">http://localhost:9090/docs</td>
                                    </tr>
                                    <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                        <td className="px-4 py-3 font-mono text-emerald-300">Cheesebrain</td>
                                        <td className="px-4 py-3 text-zinc-400">http://localhost:8080</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Manual Build & Installation</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="fp-card border-emerald-900/30">
                                <h3 className="font-bold text-white/90 mb-3">1. Submodules & PomaiDB</h3>
                                <pre className="bg-[#020502] p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-sm overflow-x-auto"><code>
git clone https://github.com/pomagrenate/cheeserag.git
cd cheeserag
git submodule update --init --recursive
cd third_party/pomaidb
git submodule update --init third_party/palloc
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_COMPILER=g++ -DPOMAI_BUILD_TESTS=OFF
cmake --build build -j$(nproc)
cd ../..
                                </code></pre>
                            </div>

                            <div className="fp-card border-emerald-900/30">
                                <h3 className="font-bold text-white/90 mb-3">2. Cheesebrain & Go Agent</h3>
                                <pre className="bg-[#020502] p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-sm overflow-x-auto"><code>
cd third_party/cheesebrain
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release -j$(nproc)
cd ../..
go build -o build/cheeserag-agent ./cmd/cheeserag-agent/
                                </code></pre>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="fp-card border-emerald-900/30">
                                <h3 className="font-bold text-white/90 mb-3">3. Python API Setup</h3>
                                <pre className="bg-[#020502] p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-sm overflow-x-auto"><code>
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
export POMAI_C_LIB=$(pwd)/third_party/pomaidb/build/libpomai_c.so
export PYTHONPATH=$(pwd)/third_party/pomaidb/python:$PYTHONPATH
                                </code></pre>
                            </div>
                            
                            <div className="industrial-markdown">
                                <h3>Minimum Prerequisites</h3>
                                <ul>
                                    <li><strong>CMake:</strong> 3.20+</li>
                                    <li><strong>Compiler:</strong> C++20 capable (GCC 11+, Clang 14+)</li>
                                    <li><strong>Go:</strong> 1.23+</li>
                                    <li><strong>Python:</strong> 3.10+</li>
                                    <li><strong>Node.js:</strong> 18+</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">System Data Flow</h2>
                    </div>
                    <div className="fp-card bg-[#020502] border border-emerald-900/40">
                        <pre className="text-emerald-400 font-mono text-xs overflow-x-auto p-4">
{`Browser
  │  drag-drop PDF
  ▼
Studio (Next.js :3000)
  │  POST /api/v1/ingest  (multipart)
  ▼
Cheese API (FastAPI :9090)
  │  1. process_file_with_meta()
  │  2. fetch_embedding()
  │  3. put_chunk_with_text()
  │  4. store_chunk_meta()
  │  SSE progress → browser
  ▼
PomaiDB (libpomai_c.so — in-process)

                              Chat query
Browser ──────────────────────────────────────►
                                                Cheese API
                                                  │  embed query
                                                  │  search_rag_membrane()
                                                  │  if max_score < 0.35 → "not found"
                                                  │  else: build grounded system prompt
                                                  │  stream /v1/chat/completions
                                                  ▼
                                               Cheesebrain (:8080)`}
                        </pre>
                    </div>
                </div>

            </div>
        </ForestPageShell>
    );
}

function FeatureCard({ title, desc, tag }: { title: string, desc: string, tag: string }) {
    return (
        <div className="fp-card fp-card--hover rounded-xl flex flex-col h-full border-emerald-900/20">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white/90">{title}</h3>
                <span className="fp-tag">{tag}</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                {desc}
            </p>
        </div>
    );
}