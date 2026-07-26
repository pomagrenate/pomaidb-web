"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  title: string;
  slug: string;
  type: "blog" | "research" | "project" | "case-study";
  category?: string;
}

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // This would normally fetch from your API
    // For now, we'll do a simple mock search
    const mockResults: SearchResult[] = [
      { title: "The 3-Pillar Architecture", slug: "pomai-ecosystem-3-pillar-architecture", type: "case-study", category: "Engineering" },
      { title: "The Polyglot Contract", slug: "pomai-ecosystem-protobuf-polyglot-contract", type: "case-study", category: "Engineering" },
    ];

    const filtered = mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.category?.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-2xl bg-[#050505] border border-emerald-900/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-emerald-900/20">
          <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts, research, projects..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
            <span>ESC</span>
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-2">
              {results.map((result) => (
                <Link
                  key={result.slug}
                  href={`/${result.type}/${result.slug}`}
                  className="block px-4 py-3 rounded-lg hover:bg-emerald-900/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <span className="fp-tag">{result.type}</span>
                    <span className="text-white font-medium">{result.title}</span>
                  </div>
                  {result.category && (
                    <p className="text-zinc-500 text-sm mt-1">{result.category}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-emerald-900/20 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">ESC</kbd>
            <span>to close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
