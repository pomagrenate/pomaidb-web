import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quan Van | AI Systems Lab & Research",
  description: "A personal lab for local-first AI systems, research notes, and engineering stories. Systems Developer and Data Mining Researcher.",
};

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { SearchModal } from "@/components/search-modal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-emerald-900/40 selection:text-emerald-300`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-foreground tracking-tight">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-900 focus:text-emerald-300 focus:rounded-lg focus:font-bold"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex-1 page-enter">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <SearchModal />
      </body>
    </html>
  );
}

