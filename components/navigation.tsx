"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020802]/85 backdrop-blur-md" aria-label="Global Navigation">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-emerald-900/70 border border-emerald-700/40 flex items-center justify-center text-emerald-300 font-black text-xs tracking-tighter">
              QV
            </div>
            <span className="font-bold text-xl tracking-tighter text-white/80 group-hover:text-emerald-300 transition-colors">
              Quan Van
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-x-8">
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/research">Research</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/case-studies">Case Studies</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <NavLink href="/videos">Videos</NavLink>
            <NavLink href="/hire-me">Hire Me</NavLink>
            <a
              href="https://github.com/pomagrenate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              GitHub ↗
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden flex items-center gap-2 text-zinc-400 hover:text-emerald-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-16 left-0 right-0 bg-[#020802]/95 backdrop-blur-xl border-b border-emerald-900/30 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 py-4 space-y-3">
          <MobileNavLink href="/projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</MobileNavLink>
          <MobileNavLink href="/research" onClick={() => setIsMobileMenuOpen(false)}>Research</MobileNavLink>
          <MobileNavLink href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</MobileNavLink>
          <MobileNavLink href="/case-studies" onClick={() => setIsMobileMenuOpen(false)}>Case Studies</MobileNavLink>
          <MobileNavLink href="/docs" onClick={() => setIsMobileMenuOpen(false)}>Docs</MobileNavLink>
          <MobileNavLink href="/videos" onClick={() => setIsMobileMenuOpen(false)}>Videos</MobileNavLink>
          <MobileNavLink href="/hire-me" onClick={() => setIsMobileMenuOpen(false)}>Hire Me</MobileNavLink>
          <a
            href="https://github.com/pomagrenate"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-sm font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold leading-6 text-zinc-400 hover:text-emerald-300 transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2 text-sm font-semibold text-zinc-400 hover:text-emerald-300 transition-colors"
    >
      {children}
    </Link>
  );
}

