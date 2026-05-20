import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md" aria-label="Global Navigation">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xs tracking-tighter">QV</div>
              <span className="font-bold text-xl tracking-tighter text-foreground group-hover:text-primary transition-colors">Quan Van</span>
            </Link>
          </div>
          
          <div className="hidden md:flex gap-x-8">
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/research">Research</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <a 
              href="https://github.com/pomagrenate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="flex md:hidden">
            <div className="flex items-center gap-4">
              <Link href="/projects" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Projects</Link>
              <Link href="/research" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Research</Link>
            </div>
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
      className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
  );
}
