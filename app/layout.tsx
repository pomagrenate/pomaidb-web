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
        <Navigation />
        <main className="flex-1 page-enter">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

