import type { Metadata } from "next";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

export const metadata: Metadata = {
    title: "Iceage | Pomai Ecosystem",
    description: "Make your AI coding agent respond in compressed, terse prose. No filler, no hedging.",
};

export default function IceagePage() {
    return (
        <ForestPageShell
            eyebrow="Agent Tooling"
            title="Iceage"
            description="Make your AI coding agent respond in compressed, terse prose — no filler, no hedging, no pleasantries. Technical accuracy stays. Token cost drops. Code, commits, and security warnings stay normal."
        >
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                {/* Before / After Showcase */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">The Impact</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="fp-card border-red-900/30">
                            <div className="flex items-center justify-between mb-4">
                                <span className="fp-badge !bg-red-500/10 !text-red-400 !border-red-500/20">Before (Standard AI)</span>
                                <span className="text-xs text-zinc-500 font-mono">Verbose & Costly</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed italic">
                                "Sure! I'd be happy to help you with that. The issue you're experiencing is most likely caused by the fact that you're creating a new object reference on every render, which React interprets as a changed prop even though the values are the same. To resolve this, you should wrap the object in a useMemo hook."
                            </p>
                        </div>

                        <div className="fp-card border-emerald-900/50 relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="fp-badge">After (Iceage Full)</span>
                                <span className="text-xs text-emerald-400 font-mono">~75% Fewer Tokens</span>
                            </div>
                            <p className="text-emerald-100/90 text-sm leading-relaxed font-mono relative z-10">
                                "New object ref each render. Inline object prop = new ref = re-render. Wrap in useMemo."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Universal Agent Support */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Universal Agent Support</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AgentCard
                            name="Claude Code"
                            desc="Auto-activates on every session via Hooks. Includes custom slash commands (/iceage, /iceage-review)."
                            tag="Deep Integration"
                        />
                        <AgentCard
                            name="Cursor"
                            desc="Uses .cursor/rules/iceage.mdc with alwaysApply: true. Activates on every session automatically."
                            tag="Ruleset"
                        />
                        <AgentCard
                            name="Windsurf"
                            desc="Uses .windsurf/rules/iceage.md with trigger: always_on. No manual activation needed."
                            tag="Ruleset"
                        />
                        <AgentCard
                            name="Cline"
                            desc="Auto-discovers .clinerules/iceage.md in the workspace root automatically."
                            tag="Auto-discovery"
                        />
                        <AgentCard
                            name="GitHub Copilot"
                            desc="Appends to .github/copilot-instructions.md for seamless repository-level rules."
                            tag="Instructions"
                        />
                        <AgentCard
                            name="Gemini CLI"
                            desc="Uses GEMINI.md context file to enforce the terse prompt natively."
                            tag="Context File"
                        />
                    </div>
                </div>

                {/* Features & Modes */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Features & Intensity Levels</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="industrial-markdown">
                            <h3>Intensity Modes</h3>
                            <ul>
                                <li><strong>/iceage lite:</strong> Tight but full sentences, no filler.</li>
                                <li><strong>/iceage (default):</strong> Fragments OK, drops articles and pleasantries.</li>
                                <li><strong>/iceage ultra:</strong> Max compression, abbreviations, arrows for causality (<code>Skip handshake → fast under load</code>).</li>
                                <li><strong>/iceage wenyan:</strong> Classical Chinese (文言文) mode for ultimate density.</li>
                            </ul>

                            <h3 className="mt-8">Smart Auto-Clarity</h3>
                            <p>
                                Iceage automatically reverts to normal phrasing for security warnings, destructive operations, or when confused, resuming terse mode immediately after.
                            </p>
                        </div>

                        <div className="industrial-markdown">
                            <h3>Ecosystem Tools</h3>
                            <ul>
                                <li><strong>iceage-compress:</strong> Go-based CLI tool to compress your existing markdown documentation to iceage style in-place.</li>
                                <li><strong>iceage-commit:</strong> Generates Conventional Commits with terse bodies and ≤50 char subjects.</li>
                                <li><strong>iceage-review:</strong> One-line code review comments (e.g., <code>L42: 🔴 bug: token check inverted.</code>)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* How it Works (Claude Code) */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Under the Hood: Claude Code Hooks</h2>
                    </div>

                    <div className="fp-card bg-[#050a05]">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-emerald-400 font-bold mb-2 font-mono text-sm">1. SessionStart Hook</h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Writes tracking state to <code className="text-emerald-300">~/.claude/.iceage-active</code>. Injects the full ruleset as hidden system context (invisible to the user) and nudges setup if the statusline is not yet configured.
                                </p>
                            </div>
                            <div className="h-px bg-emerald-900/30 w-full" />
                            <div>
                                <h4 className="text-emerald-400 font-bold mb-2 font-mono text-sm">2. UserPromptSubmit Hook</h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Watches for <code className="text-emerald-300">/iceage</code> commands to update the mode flag file. Matches natural-language triggers ("activate iceage") and sends per-turn reminders to prevent the LLM's style from drifting mid-conversation.
                                </p>
                            </div>
                            <div className="h-px bg-emerald-900/30 w-full" />
                            <div>
                                <h4 className="text-emerald-400 font-bold mb-2 font-mono text-sm">3. Statusline Scripts</h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Reads the flag file and outputs <code className="text-emerald-300">[ICEAGE]</code> or <code className="text-emerald-300">[ICEAGE:ULTRA]</code> badges directly in the Claude Code terminal status bar. Silent-fails on filesystem errors to never block a session.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ForestPageShell>
    );
}

function AgentCard({ name, desc, tag }: { name: string, desc: string, tag: string }) {
    return (
        <div className="fp-card fp-card--hover rounded-xl flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white/90">{name}</h3>
                <span className="fp-tag">{tag}</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                {desc}
            </p>
        </div>
    );
}