import type { Metadata } from "next";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

export const metadata: Metadata = {
    title: "GoX | Pomai Ecosystem",
    description: "The All-in-One Workflow Manager for Go Monorepos",
};

export default function GoXPage() {
    return (
        <ForestPageShell
            eyebrow="Backend Tooling"
            title="GoX"
            description="The All-in-One Workflow Manager for Go Monorepos. Stop fighting with Makefiles and scripts. Start building. gox doesn't replace the Go toolchain; it orchestrates it."
        >
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                {/* Why GoX / Core Features */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Why GoX?</h2>
                    </div>
                    
                    <p className="text-zinc-400 mb-8 max-w-3xl">
                        When a Go project grows beyond <code className="text-emerald-400 font-mono text-sm">go run main.go</code>, things get messy. You end up with complex <code className="text-emerald-400 font-mono text-sm">go.work</code> setups, chaotic Makefiles, and custom bash scripts to manage multiple processes. GoX solves this.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            title="Instant Workspace"
                            desc="Scaffolds a scalable Go workspace architecture in seconds with standard directories."
                            tag="Architecture"
                        />
                        <FeatureCard
                            title="⚡ Multi-Process Dev"
                            desc="Run your API, Worker, and CLI simultaneously with beautifully color-coded logs."
                            tag="Workflow"
                        />
                        <FeatureCard
                            title="Smart Scaffolding"
                            desc="Add new microservices or shared libraries automatically linked to your go.work."
                            tag="Automation"
                        />
                        <FeatureCard
                            title="🩺 Built-in Doctor"
                            desc="Automatically detects missing dependencies, broken module links, and port conflicts!"
                            tag="Diagnostics"
                        />
                        <FeatureCard
                            title="One-Click Release"
                            desc="Cross-compiles lean, production-ready binaries for Windows, Mac, and Linux with SHA-256 checksums."
                            tag="CI/CD"
                        />
                    </div>
                </div>

                {/* Quick Start Journey */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Quick Start Journey</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="fp-card border-emerald-900/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-400 font-mono text-xs font-bold border border-emerald-700/50">1</span>
                                    <h3 className="font-bold text-white/90">Initialize a new Workspace</h3>
                                </div>
                                <p className="text-zinc-400 text-sm mb-4">Create a brand new system with a standardized, scalable architecture. This creates the gox.yaml and initializes go mod/work.</p>
                                <pre className="bg-[#020502] p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-sm overflow-x-auto">
                                    gox init my-system<br/>
                                    cd my-system
                                </pre>
                            </div>

                            <div className="fp-card border-emerald-900/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-400 font-mono text-xs font-bold border border-emerald-700/50">2</span>
                                    <h3 className="font-bold text-white/90">Scaffold Microservices</h3>
                                </div>
                                <p className="text-zinc-400 text-sm mb-4">Add a new backend API, a background worker, and a shared library. GoX handles the boilerplate and linking automatically.</p>
                                <pre className="bg-[#020502] p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-sm overflow-x-auto">
                                    gox app add api<br/>
                                    gox app add worker<br/>
                                    gox lib add database
                                </pre>
                            </div>

                            <div className="fp-card border-emerald-900/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-400 font-mono text-xs font-bold border border-emerald-700/50">3</span>
                                    <h3 className="font-bold text-white/90">Run Everything in Dev Mode</h3>
                                </div>
                                <p className="text-zinc-400 text-sm mb-4">Start all your services at once. No more opening 5 different terminal tabs! Enjoy graceful shutdowns and unified logging.</p>
                                <pre className="bg-[#020502] p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-sm overflow-x-auto">
                                    gox dev
                                </pre>
                            </div>
                        </div>

                        {/* Installation & Configuration */}
                        <div className="industrial-markdown">
                            <h3>Installation</h3>
                            <pre><code>
{`# Clone the repository
git clone https://github.com/your-username/gox.git

# Build the tool
cd gox
go build -o gox ./cmd/gox

# Move it to your PATH (Linux/Mac)
sudo mv gox /usr/local/bin/

# On Windows, move gox.exe to your System PATH`}
                            </code></pre>

                            <h3 className="mt-8">The gox.yaml Engine</h3>
                            <p>Your entire ecosystem is orchestrated by a single config file at the root of your project:</p>
                            <pre><code>
{`name: my-system
apps:
  api:
    path: apps/api
    main: ./cmd/api
    port: 8080
  worker:
    path: apps/worker
    main: ./cmd/worker
libs:
  database:
    path: libs/database
tasks:
  dev:
    - run: api
    - run: worker
release:
  targets:
    - windows/amd64
    - linux/amd64
    - darwin/arm64`}
                            </code></pre>
                        </div>
                    </div>
                </div>

                {/* Commands & Diagnostics */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Commands & Diagnostics</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="industrial-markdown">
                            <h3>Command Reference</h3>
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full text-sm text-left text-zinc-300">
                                    <thead className="text-xs uppercase bg-emerald-950/30 text-emerald-400">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-emerald-900/40 font-mono">Command</th>
                                            <th className="px-4 py-3 border-b border-emerald-900/40 font-mono">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox init [name]</td>
                                            <td className="px-4 py-3 text-zinc-400">Initialize a new gox workspace.</td>
                                        </tr>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox app add &lt;name&gt;</td>
                                            <td className="px-4 py-3 text-zinc-400">Generate a new app and link it.</td>
                                        </tr>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox lib add &lt;name&gt;</td>
                                            <td className="px-4 py-3 text-zinc-400">Generate a new library and link it.</td>
                                        </tr>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox dev</td>
                                            <td className="px-4 py-3 text-zinc-400">Start all apps defined in tasks.dev.</td>
                                        </tr>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox build [app]</td>
                                            <td className="px-4 py-3 text-zinc-400">Compile all/specific apps to bin/.</td>
                                        </tr>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox test [mod]</td>
                                            <td className="px-4 py-3 text-zinc-400">Run tests recursively across apps.</td>
                                        </tr>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox doctor</td>
                                            <td className="px-4 py-3 text-zinc-400">Run env and conflict diagnostics.</td>
                                        </tr>
                                        <tr className="hover:bg-emerald-900/10">
                                            <td className="px-4 py-3 font-mono text-emerald-300">gox release [v]</td>
                                            <td className="px-4 py-3 text-zinc-400">Cross-compile optimized binaries.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="fp-card bg-[#050a05] h-fit">
                            <h3 className="text-lg font-bold text-white/90 mb-4">The Doctor is IN</h3>
                            <p className="text-zinc-400 text-sm mb-4">
                                Tired of weird errors because someone forgot to add a folder or two apps are fighting for port 8080? Just ask the doctor.
                            </p>
                            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm border border-red-900/30">
                                <div className="text-zinc-500 mb-2">$ gox doctor</div>
                                <div className="text-emerald-500/80">--- Gox Doctor ---</div>
                                <div className="text-emerald-400">Go installed: go version go1.22.0</div>
                                <div className="text-emerald-400">App 'api' directory exists</div>
                                <div className="text-red-400">Port conflict: App 'worker' and 'api' both use port 8080</div>
                                <div className="text-amber-400 mt-2">Found 1 issue(s) that need your attention.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Philosophy */}
                <div className="mt-24 pt-12 border-t border-emerald-900/30 flex flex-col items-center text-center">
                    <p className="text-xs font-mono text-emerald-700 uppercase tracking-widest mb-4">
                        Philosophy
                    </p>
                    <h3 className="font-bold text-lg text-white mb-4">
                        go command = Engine | gox = Steering Wheel
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-xl">
                        GoX is not a package manager or a Go replacement. The Go official toolchain is incredibly powerful. GoX simply acts as the missing workflow operating layer, built for Gophers who love shipping fast.
                    </p>
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