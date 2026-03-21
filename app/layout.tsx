import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PomaiDB | The predictable vector database for the edge",
  description: "An embedded, single-threaded vector database built for edge devices, IoT gateways, and environments where stability and deterministic behavior matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-primary/20 selection:text-primary`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground tracking-tight">
        {children}
      </body>
    </html>
  );
}
