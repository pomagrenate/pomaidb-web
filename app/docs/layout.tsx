import React from "react";
import Link from "next/link";
import { DOCS_NAV } from "./docs-config";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#020802] text-white">
      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-40 w-68 border-r border-emerald-900/30 bg-[#030d03]/90 backdrop-blur-md overflow-y-auto hidden lg:flex flex-col">
        {/* Sidebar header */}
        <div className="flex h-16 items-center px-6 border-b border-emerald-900/30 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-6 rounded-lg bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-emerald-300 font-black text-[10px] tracking-tighter">
              QV
            </div>
            <span className="font-bold tracking-tighter text-white/80 group-hover:text-emerald-300 transition-colors">
              PomaiDB Docs
            </span>
          </Link>
        </div>

        {/* Sidebar nav */}
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          {DOCS_NAV.map((group) => (
            <div key={group.category}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-600 inline-block" />
                {group.category}
              </h3>
              <ul className="space-y-0.5">
                {group.pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/docs/${page.slug}`}
                      className="block px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-emerald-900/30 hover:text-emerald-300 transition-all"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-6 py-4 border-t border-emerald-900/30 shrink-0">
          <p className="text-[10px] font-mono text-emerald-800 uppercase tracking-widest">
            v0.1.0 — Edge AI Lab
          </p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 lg:pl-68 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-16 z-30 flex h-14 items-center border-b border-emerald-900/25 bg-[#020802]/90 backdrop-blur-md px-6 lg:px-8">
          <div className="flex lg:hidden mr-4">
            <div className="h-6 w-6 rounded-lg bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-emerald-300 font-black text-[10px]">
              QV
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between">
            <span className="text-xs font-mono text-emerald-700 uppercase tracking-widest">
              Documentation v0.1.0
            </span>
            <a
              href="https://github.com/pomagrenate/pomaidb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 py-12 lg:px-12 max-w-4xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
