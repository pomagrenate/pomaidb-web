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
              <Image src="/logo.png" alt="PomaiDB Logo" width={28} height={28} className="rounded-sm grayscale group-hover:grayscale-0 transition-all duration-300" />
              <span className="font-bold text-xl tracking-tighter text-foreground group-hover:text-primary transition-colors">PomaiDB</span>
            </Link>
          </div>
          
          <div className="hidden md:flex gap-x-8">
            <NavLink href="/use-cases">Use Cases</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/docs">Documentation</NavLink>
            <a 
              href="https://github.com/pomagrenate/pomaidb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="flex md:hidden">
            {/* Mobile menu could go here, but for now we keep it simple */}
            <Link href="/docs" className="text-xs font-bold uppercase tracking-widest text-primary">Docs</Link>
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
