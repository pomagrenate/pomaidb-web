import React from "react";
import Link from "next/link";

export function Navigation() {
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

          {/* Mobile nav */}
          <div className="flex md:hidden gap-4">
            <Link href="/projects" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors">Projects</Link>
            <Link href="/research" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors">Research</Link>
          </div>
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

