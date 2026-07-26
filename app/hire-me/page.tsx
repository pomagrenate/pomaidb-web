import type { Metadata } from "next";
import Link from "next/link";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";
import { ContactForm } from "@/components/contact-form";

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
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Experience</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Freelance Software Developer */}
                        <div className="fp-card fp-card--hover rounded-xl">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white/90 mb-1">Freelance Software Developer</h3>
                                    <p className="text-emerald-400 text-sm font-mono">Self-employed · Remote</p>
                                </div>
                                <span className="fp-tag">Aug 2023 - Present</span>
                            </div>
                            <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Directed 5-member engineering team as Technical Lead, overseeing task delegation, code reviews, and end-to-end development cycles</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Designed scalable backend systems and custom web applications using NestJS and ExpressJS</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Architected database schemas across MongoDB (NoSQL) and MySQL (SQL) environments</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Built AI-driven smart systems with Docker containerization for cloud/on-premise deployments</span>
                                </li>
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="fp-tag">NestJS</span>
                                <span className="fp-tag">ExpressJS</span>
                                <span className="fp-tag">MongoDB</span>
                                <span className="fp-tag">MySQL</span>
                                <span className="fp-tag">Docker</span>
                            </div>
                        </div>

                        {/* AI Engineer */}
                        <div className="fp-card fp-card--hover rounded-xl">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white/90 mb-1">AI Engineer</h3>
                                    <p className="text-emerald-400 text-sm font-mono">VINAMACHINE · Remote</p>
                                </div>
                                <span className="fp-tag">Jul 2025 - Jun 2026</span>
                            </div>
                            <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Built end-to-end AI core services leveraging LLMs, OCR, speech-to-text, and text-to-speech models</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Implemented scalable microservice architecture with clean data pipelines for real-time translation and multimodal processing</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Optimized system performance for high throughput and low latency across distributed environments</span>
                                </li>
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="fp-tag">Python</span>
                                <span className="fp-tag">NLP</span>
                                <span className="fp-tag">LLMs</span>
                                <span className="fp-tag">Microservices</span>
                            </div>
                        </div>

                        {/* Website Development Engineer */}
                        <div className="fp-card fp-card--hover rounded-xl">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white/90 mb-1">Website Development Engineer</h3>
                                    <p className="text-emerald-400 text-sm font-mono">SKIPLI · Remote</p>
                                </div>
                                <span className="fp-tag">Nov 2025 - Apr 2026</span>
                            </div>
                            <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Architected and developed end-to-end web solutions with high-fidelity UI/UX implementation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Developed robust backend systems, managed databases, and built RESTful APIs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Optimized code for scalability and improved system response times</span>
                                </li>
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="fp-tag">Full-Stack</span>
                                <span className="fp-tag">REST APIs</span>
                                <span className="fp-tag">UI/UX</span>
                            </div>
                        </div>

                        {/* Scientific Research Assistant */}
                        <div className="fp-card fp-card--hover rounded-xl">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white/90 mb-1">Scientific Research Assistant</h3>
                                    <p className="text-emerald-400 text-sm font-mono">HUTECH · Hybrid</p>
                                </div>
                                <span className="fp-tag">Jul 2022 - Nov 2025</span>
                            </div>
                            <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Conducted research on machine learning and deep learning techniques for computer vision and NLP</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Designed and implemented custom learning pipelines including data preprocessing and model optimization</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>Researched data mining algorithms (Apriori, FP-Growth) for large-scale structured datasets</span>
                                </li>
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="fp-tag">Machine Learning</span>
                                <span className="fp-tag">Python</span>
                                <span className="fp-tag">Deep Learning</span>
                                <span className="fp-tag">Data Mining</span>
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

                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="fp-section-dot" />
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">Get In Touch</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-emerald-100 mb-3">Send a Message</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Fill out the form and I'll get back to you within 24-48 hours.
                            </p>
                            <ContactForm />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-emerald-100 mb-3">Alternative Contact</h3>
                                <div className="space-y-4">
                                    <a
                                        href="https://www.linkedin.com/in/quan-van-15a5b3248/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="fp-btn fp-btn--ghost text-sm px-6 py-3 w-full flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        Connect on LinkedIn
                                    </a>
                                    <a
                                        href="https://github.com/pomagrenate"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="fp-btn fp-btn--ghost text-sm px-6 py-3 w-full flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        View GitHub Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ForestPageShell>
    );
}