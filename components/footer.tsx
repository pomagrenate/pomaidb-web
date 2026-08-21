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
    <footer className="border-t border-[#EAEAEA] bg-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Newsletter Section */}
        <div className="mb-12 text-center max-w-lg mx-auto bg-[#FAFAF8] border border-[#EAEAEA] p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-[#171717] mb-1">Stay Updated</h3>
          <p className="text-sm text-[#737373] mb-6">Get notified about new research, projects, and engineering insights.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-none focus:border-[#6D5DFB] transition-colors"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              {isSubscribed ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[#EAEAEA]">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-black text-[11px] tracking-tight">
                QV
              </div>
              <span className="font-bold text-base tracking-tight text-[#171717] group-hover:text-[#6D5DFB] transition-colors">
                Quan Van
              </span>
            </Link>
            <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider pl-3 border-l border-[#EAEAEA]">
              Systems &amp; Software Engineering
            </span>
          </div>

          <div className="flex gap-x-6">
            <FooterLink href="https://github.com/pomagrenate">GitHub</FooterLink>
            <FooterLink href="https://www.linkedin.com/in/quan-van-15a5b3248/">LinkedIn</FooterLink>
            <FooterLink href="https://x.com/taoxanh_12345">X (Twitter)</FooterLink>
          </div>

          <p className="text-xs font-mono text-[#A3A3A3]">
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
      className="text-sm font-medium text-[#737373] hover:text-[#171717] transition-colors"
    >
      {children}
    </a>
  );
}


