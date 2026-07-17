import type { Metadata } from "next";
import Link from "next/link";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

export const metadata: Metadata = {
    title: "Hire Me | Quan Van",
    description: "Available for full-time roles, contract work, and system architecture consulting.",
};

export default function HireMePage() {
    return (
        <ForestPageShell
            eyebrow="Work With Me"
            title="System Architecture & Engineering"
            description="I specialize in building scalable microservices, self-hosted infrastructure, and AI-driven observability platforms. Available for full-time roles and specialized contract engagements."
        >
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">What I Do</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <div className="fp-card fp-card--hover group block rounded-xl relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-5">
                                <span className="fp-badge">Architecture</span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-3 text-white/90 group-hover:text-emerald-300 transition-colors duration-300 leading-snug">
                                Microservices Migration
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Transforming fragile monoliths into robust, event-driven microservices. Expertise in solving distributed data integrity (Outbox Pattern), high availability gateways (Kong/Nginx), and seamless database migrations.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="fp-tag">PostgreSQL</span>
                                <span className="fp-tag">Kafka</span>
                                <span className="fp-tag">Kong</span>
                            </div>
                        </div>

                        <div className="fp-card fp-card--hover group block rounded-xl relative overflow-hidden" style={{ animationDelay: "60ms" }}>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="fp-badge">AI Systems</span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-3 text-white/90 group-hover:text-emerald-300 transition-colors duration-300 leading-snug">
                                AI-Driven Observability
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Moving beyond standard dashboards by building autonomous Root Cause Analysis (RCA) pipelines. Integrating Flink, Kafka, and CPU-only local LLMs (Llama.cpp) for highly secure, low-cost log intelligence.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="fp-tag">RAG</span>
                                <span className="fp-tag">Qdrant</span>
                                <span className="fp-tag">Llama.cpp</span>
                            </div>
                        </div>

                        <div className="fp-card fp-card--hover group block rounded-xl relative overflow-hidden" style={{ animationDelay: "120ms" }}>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="fp-badge">DevOps</span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-3 text-white/90 group-hover:text-emerald-300 transition-colors duration-300 leading-snug">
                                On-Premise CI/CD
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Designing zero-downtime deployment engines focusing on Data Sovereignty. Building completely self-hosted automation pipelines using Jenkins, Gitea, and Docker to eliminate configuration drift.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="fp-tag">Jenkins</span>
                                <span className="fp-tag">Docker</span>
                                <span className="fp-tag">Gitea</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Why Work With Me?</h2>
                    </div>

                    <div className="fp-card rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-lg font-bold text-emerald-100 mb-3">Ownership Mindset</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    I do not just write code; I own the system. From the initial architecture design to container orchestration and automated testing, I build systems that understand themselves and are resilient to failure.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-emerald-100 mb-3">Cost-Efficient Engineering</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    I prioritize elegant architecture over expensive hardware. Whether it is moving away from costly managed NoSQL to relational databases, or running enterprise-grade AI observability completely on standard CPUs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fp-card bg-gradient-to-br from-[#040e04] to-[#020802] rounded-2xl border border-emerald-900/30 text-center py-16 px-6">
                    <h2 className="text-3xl font-black text-white/95 tracking-tight mb-4">Ready to build something robust?</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
                        Whether you are a startup scaling your architecture, an enterprise dealing with distributed data issues, or a team looking for a dedicated Backend Engineer.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:your.email@example.com"
                            className="fp-btn fp-btn--primary text-sm px-8 py-4 w-full sm:w-auto"
                        >
                            Contact via Email
                        </a>
                        <a
                            href="https://www.linkedin.com/in/quan-van-15a5b3248/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fp-btn fp-btn--ghost text-sm px-8 py-4 w-full sm:w-auto"
                        >
                            Connect on LinkedIn
                        </a>
                    </div>
                </div>

            </div>
        </ForestPageShell>
    );
}