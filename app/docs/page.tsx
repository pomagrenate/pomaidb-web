import type { Metadata } from "next";
import Link from "next/link";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

export const metadata: Metadata = {
    title: "Documentation | Pomai Ecosystem",
    description: "Technical documentation, architecture blueprints, and API references for the Pomai Ecosystem.",
};

const projects = [
    {
        slug: "pomaidb",
        title: "PomaiDB",
        description: "Embedded database architecture, memory management, storage engine, and virtual file systems for local-first agent environments.",
        badge: "Core Database",
        tags: ["Storage Engine", "VFS", "Memory"],
        href: "/docs/pomaidb/"
    },
    {
        slug: "ice_age",
        title: "Ice Age",
        description: "An plugins for Agent Coding as Claude Code, Antigravity, Cursor, etc. Help you reduce token to 90%",
        badge: "Core Agent Plugin",
        tags: ["Code", "Antigravity", "Claude Code"],
        href: "/docs/ice_age/"
    }
];

export default function DocsIndexPage() {
    return (
        <ForestPageShell
            eyebrow="Documentation"
            title="Ecosystem Docs"
            description="Comprehensive technical documentation, architecture blueprints, and API references for the microservices within the Pomai Ecosystem."
        >
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, i) => (
                        <Link
                            key={project.slug}
                            href={project.href}
                            className="fp-card fp-card--hover group flex flex-col focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#020802] rounded-xl"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <span className="fp-badge">{project.badge}</span>
                            </div>

                            <h3 className="text-xl font-bold tracking-tight mb-3 text-white/90 group-hover:text-emerald-300 transition-colors duration-300 leading-snug">
                                {project.title}
                            </h3>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                {project.tags.map(tag => (
                                    <span key={tag} className="fp-tag">{tag}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-5 border-t border-emerald-900/30">
                                <span className="text-sm font-semibold text-zinc-300">Read Docs</span>
                                <span className="text-sm font-bold text-emerald-400 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                                    View →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </ForestPageShell>
    );
}