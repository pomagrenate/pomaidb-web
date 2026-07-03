import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-emerald-900/25 bg-[#020802]/90 backdrop-blur-md px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-6 rounded-lg bg-emerald-900/60 border border-emerald-700/30 flex items-center justify-center text-emerald-300 font-black text-[10px] tracking-tighter">
              QV
            </div>
            <span className="font-bold text-lg tracking-tighter text-zinc-500 group-hover:text-emerald-400 transition-colors">
              Quan Van
            </span>
          </Link>
          <span className="text-xs font-mono text-zinc-700 uppercase tracking-widest pl-4 border-l border-emerald-900/30">
            Systems &amp; Data Mining
          </span>
        </div>

        <div className="flex gap-x-8">
          <FooterLink href="https://github.com/pomagrenate">GitHub</FooterLink>
          <FooterLink href="https://www.linkedin.com/in/quan-van-15a5b3248">LinkedIn</FooterLink>
          <FooterLink href="https://github.com/oh-mah-c">Alt GitHub</FooterLink>
        </div>

        <p className="text-xs font-mono text-zinc-700 order-last sm:order-none">
          © 2026 Quan Van
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-semibold text-zinc-600 hover:text-emerald-400 transition-colors"
    >
      {children}
    </a>
  );
}

