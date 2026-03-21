import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DOCS_NAV } from "./docs-config";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background/50 backdrop-blur-md overflow-y-auto hidden lg:block">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="PomaiDB" width={24} height={24} className="rounded-sm grayscale hover:grayscale-0 transition-all" />
            <span className="font-bold tracking-tighter group-hover:text-primary transition-colors">PomaiDB Docs</span>
          </Link>
        </div>
        <nav className="p-6 space-y-8">
          {DOCS_NAV.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {group.category}
              </h3>
              <ul className="space-y-1">
                {group.pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/docs/${page.slug}`}
                      className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-background/80 backdrop-blur-md px-6 lg:px-8">
          <div className="flex lg:hidden mr-4">
             <Image src="/logo.png" alt="PomaiDB" width={24} height={24} className="rounded-sm" />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Documentation v0.1.0</span>
            <div className="flex gap-4">
               <a href="https://github.com/pomagrenate/pomaidb" target="_blank" className="text-sm hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </header>
        <div className="flex-1 px-6 py-12 lg:px-12 max-w-4xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
