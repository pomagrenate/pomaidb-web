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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pomaidb-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quan Van | AI Systems, Databases & High-Performance Engineering",
    template: "%s | Quan Van",
  },
  description:
    "Personal portfolio and engineering lab of Quan Van. Documenting deep dives into local-first AI systems, vector databases, high-throughput caching, and data mining research.",
  keywords: [
    "Quan Van",
    "Systems Engineering",
    "PomaiDB",
    "PomaiKache",
    "CheesePath",
    "Fetchr",
    "Vector Database",
    "Vector Caching",
    "Embedded Databases",
    "AI Agents",
    "C++",
    "Rust",
    "TypeScript",
    "Data Mining",
    "High Performance Computing",
  ],
  authors: [{ name: "Quan Van", url: "https://github.com/pomagrenate" }],
  creator: "Quan Van",
  publisher: "Quan Van",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Quan Van | AI Systems, Databases & High-Performance Engineering",
    description:
      "Personal portfolio and engineering lab of Quan Van. Documenting deep dives into local-first AI systems, vector databases, high-throughput caching, and data mining research.",
    url: siteUrl,
    siteName: "Quan Van - AI Systems & Research",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/pomaidb/benchmark_chart.png",
        width: 1200,
        height: 630,
        alt: "Quan Van - AI Systems Lab & Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quan Van | AI Systems, Databases & High-Performance Engineering",
    description:
      "Personal portfolio and engineering lab of Quan Van. Documenting deep dives into local-first AI systems, vector databases, high-throughput caching, and data mining research.",
    creator: "@taoxanh_12345",
    images: ["/images/pomaidb/benchmark_chart.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Quan Van",
      url: siteUrl,
      jobTitle: "Systems Developer & AI Engineer",
      sameAs: [
        "https://github.com/pomagrenate",
        "https://www.linkedin.com/in/quan-van-15a5b3248/",
        "https://x.com/taoxanh_12345",
      ],
      knowsAbout: [
        "High-Performance Computing",
        "Database Architecture",
        "Vector Caching",
        "AI Agent Frameworks",
        "Data Mining",
        "Computer Vision",
        "C++",
        "Rust",
        "TypeScript",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Quan Van | AI Systems Lab & Research",
      description:
        "Personal portfolio and engineering lab of Quan Van exploring local-first AI, vector caching, and database internals.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-[#6D5DFB]/15 selection:text-[#6D5DFB]`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#171717] tracking-tight">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#6D5DFB] focus:text-white focus:rounded-lg focus:font-bold shadow-md"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <SearchModal />
      </body>
    </html>
  );
}

