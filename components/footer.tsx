import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/50 backdrop-blur-md px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group opacity-80 hover:opacity-100 transition-opacity">
            <Image src="/logo.png" alt="PomaiDB Logo" width={24} height={24} className="rounded-sm grayscale group-hover:grayscale-0 transition-all duration-300" />
            <span className="font-bold text-lg tracking-tighter text-muted-foreground group-hover:text-primary transition-colors">PomaiDB</span>
          </Link>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest pl-4 border-l border-border/40">Built for the Edge</span>
        </div>
        
        <div className="flex gap-x-8">
          <FooterLink href="https://github.com/pomagrenate/pomaidb">GitHub</FooterLink>
          <FooterLink href="https://www.linkedin.com/in/quan-van-15a5b3248">LinkedIn</FooterLink>
          <FooterLink href="https://discord.gg/xmSk3GPH">Discord</FooterLink>
        </div>

        <p className="text-xs font-medium text-muted-foreground/60 order-last sm:order-none">
          © 2026 PomaiDB. All rights reserved. Registered for industrial use.
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
      className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4"
    >
      {children}
    </a>
  );
}
