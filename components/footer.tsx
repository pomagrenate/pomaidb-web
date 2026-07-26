"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="border-t border-emerald-900/25 bg-[#020802]/90 backdrop-blur-md px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Stay Updated</h3>
          <p className="text-sm text-zinc-500 mb-4">Get notified about new research, projects, and engineering insights.</p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-[#0a140a]/60 border border-emerald-900/30 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-700/50 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-900/40 border border-emerald-700/50 rounded-lg text-sm font-bold text-emerald-300 hover:bg-emerald-800/50 transition-colors"
            >
              {isSubscribed ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-emerald-900/20">
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
              Systems &amp; Software Engineering
            </span>
          </div>

          <div className="flex gap-x-6">
            <FooterLink href="https://github.com/pomagrenate">GitHub</FooterLink>
            <FooterLink href="https://www.linkedin.com/in/quan-van-15a5b3248">LinkedIn</FooterLink>
            <FooterLink href="https://github.com/oh-mah-c">Alt GitHub</FooterLink>
            <FooterLink href="mailto:contact@example.com">Email</FooterLink>
            <FooterLink href="https://twitter.com">Twitter</FooterLink>
          </div>

          <p className="text-xs font-mono text-zinc-700 order-last sm:order-none">
            © {new Date().getFullYear()} Quan Van
          </p>
        </div>
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

