"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/research", label: "Research" },
    { href: "/blog", label: "Blog" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/videos", label: "Videos" },
    { href: "/hire-me", label: "Hire Me" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAEAEA] bg-white/90 backdrop-blur-md transition-colors" aria-label="Global Navigation">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#6D5DFB] to-[#9181F4] flex items-center justify-center text-white font-black text-xs tracking-tight shadow-sm shadow-[#6D5DFB]/20 group-hover:scale-105 transition-transform">
              QV
            </div>
            <span className="font-bold text-lg tracking-tight text-[#171717] group-hover:text-[#6D5DFB] transition-colors">
              Quan Van
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const isHireMe = link.href === "/hire-me";

              if (isHireMe) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3.5 py-1.5 rounded-full bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all ml-1 flex items-center gap-1"
                  >
                    <span>Hire Me</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 flex flex-col items-center gap-1 ${
                    isActive ? "text-[#171717] font-semibold" : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DFB] animate-pulse" />
                  )}
                </Link>
              );
            })}
            <a
              href="https://github.com/pomagrenate"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-[#737373] hover:text-[#171717] transition-colors ml-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center p-2 text-[#737373] hover:text-[#171717] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Toggle navigation menu</span>
            <div className="flex flex-col gap-1.5">
              <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white/95 border-b border-[#EAEAEA] backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden py-0'
        }`}
      >
        <div className="px-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 text-sm font-medium ${
                  isActive ? "text-[#6D5DFB] font-semibold" : "text-[#525252] hover:text-[#171717]"
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DFB]" />}
              </Link>
            );
          })}
          <a
            href="https://github.com/pomagrenate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 pt-2 border-t border-[#EAEAEA] text-sm font-medium text-[#525252] hover:text-[#171717]"
          >
            <span>GitHub ↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}


