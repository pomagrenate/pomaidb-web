import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Code2,
  FolderGit2,
  Package,
  Globe,
} from "lucide-react";

// vgc-user project data
const vgcUserProject = {
  title: "VGC-User",
  subtitle: "user.vgcnews24.com",
  live: "https://user.vgcnews24.com/vi/login",
  description:
    "A unified identity, authentication, and content management control plane built for the Viet Global Connect (VGC) ecosystem. Centralizes user profiles, classified advertisements, business directory verifications, and editorial news subscriptions across multiple independent sub-portals.",
  tags: [
    "Next.js",
    "React",
    "TypeScript",
    "Firebase Auth",
    "Cloud Firestore",
    "SSO Control Plane",
    "Centralized Dashboard",
    "Bilingual (VI/EN)",
  ],
  category: "Products Projects",
};

export default function VgcUserPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717]">
      {/* Top Navigation Strip */}
      <div className="border-b border-[#EAEAEA] bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/projects"
            className="text-sm font-semibold text-[#525252] hover:text-[#6D5DFB] transition-colors flex items-center gap-2 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Projects</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F4F4F6] border border-[#EAEAEA] text-[#171717] text-xs font-semibold">
              {vgcUserProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7CF6] flex items-center justify-center text-white font-bold text-2xl">
              VU
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {vgcUserProject.title}
              </h1>
              <p className="text-base font-mono text-[#6D5DFB] mt-2">
                {vgcUserProject.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
              Overview
            </h2>
          </div>
          <p className="text-lg text-[#525252] leading-relaxed">
            {vgcUserProject.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
              Technologies & Concepts
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {vgcUserProject.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-lg bg-[#F4F4F6] border border-[#EAEAEA] text-sm font-mono font-semibold text-[#525252]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Problem → Baseline → Change → Measurement → Result → Lesson */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#6D5DFB]" />
            <h2 className="text-sm font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              Project Analysis
            </h2>
          </div>

          <div className="space-y-8">
            {/* Problem */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h3 className="text-base font-semibold text-red-700 mb-4">🔴 Problem</h3>
              <div className="text-sm text-red-800 space-y-3">
                <p>
                  <span className="font-semibold">Ecosystem fragmentation:</span> The Viet Global Connect (VGC) network expanded into several independent web properties: a community classifieds platform (<code className="font-mono text-xs bg-red-100 px-1 py-0.5 rounded">postings.vgcnews24.com</code>), an international business directory (<code className="font-mono text-xs bg-red-100 px-1 py-0.5 rounded">biz.vgcnews24.com</code>), and a major editorial news portal (<code className="font-mono text-xs bg-red-100 px-1 py-0.5 rounded">vgcnews24.com</code>).
                </p>
                <p>
                  <span className="font-semibold">Siloed data & login friction:</span> Because each website originally operated as an isolated service, community members had to register separate accounts, maintain disjointed profiles, and log in repeatedly across subdomains. There was no unified place where a business owner or community member could view their posted job listings, verify their business profile, and manage their editorial news preferences.
                </p>
                <p>
                  <span className="font-semibold">Administrative overhead:</span> Managing verification requests for commercial profiles and moderating classified posts across disconnected backends created administrative bottlenecks, duplication of records, and security synchronization delays.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Starting architecture:</span> Independent website silos deployed across separate subdomains without a shared authentication boundary or centralized state store.
                </p>
                <p>
                  <span className="font-semibold">Baseline characteristics:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Three separate registration and authentication flows across classifieds, business hub, and editorial portals</li>
                  <li>No cross-domain session persistence, leading to dropped engagement and user churn</li>
                  <li>Disparate database schemas with zero unified user identity mapping</li>
                  <li>Manual review and verification processes handled via disconnected admin channels</li>
                </ul>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Built VGC-User as the central hub:</span> Designed and developed a unified control plane (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">user.vgcnews24.com</code>) using React, Next.js, TypeScript, and Firebase.
                </p>
                <p>
                  <span className="font-semibold">Key architectural changes:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-semibold">Single Sign-On (SSO) & Email Verification:</span> Built a secure, passwordless authentication flow using email verification codes, syncing session states across all VGC subdomains.
                  </li>
                  <li>
                    <span className="font-semibold">Classified Posts Management:</span> Created a centralized interface allowing users to create, update, pause, and monitor the performance of classified ads published across <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">postings.vgcnews24.com</code>.
                  </li>
                  <li>
                    <span className="font-semibold">Business Profile Verification:</span> Implemented a formal verification workflow where corporate entities submit legal documentation to receive verified badges on <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">biz.vgcnews24.com</code>.
                  </li>
                  <li>
                    <span className="font-semibold">Editorial Access & Bookmarking:</span> Integrated reading history, newsletter preferences, and saved articles linked directly to the main editorial portal (<code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">vgcnews24.com</code>).
                  </li>
                  <li>
                    <span className="font-semibold">Real-Time Activity Analytics:</span> Embedded real-time view counts, click-through rates, and message inquiries directly in the user dashboard.
                  </li>
                  <li>
                    <span className="font-semibold">Bilingual Accessibility:</span> Designed native dual-language support (Tiếng Việt & English) to accommodate domestic users as well as the global Vietnamese diaspora.
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Evaluation context:</span> Deployed on production infrastructure serving the global VGC network.
                </p>
                <p>
                  <span className="font-semibold">Key areas evaluated:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><span className="font-semibold">Cross-domain token propagation:</span> Verified seamless token sharing and secure cookie validation across <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">postings.</code>, <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">biz.</code>, and <code className="font-mono text-xs bg-purple-100 px-1 py-0.5 rounded">user.</code> subdomains.</li>
                  <li><span className="font-semibold">Data synchronization:</span> Verified real-time write propagation when updating business profiles or classified statuses via Cloud Firestore listeners.</li>
                  <li><span className="font-semibold">Mobile responsiveness:</span> Tested accessibility and responsive layout across desktop, tablet, and mobile browsers.</li>
                </ul>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Unified ecosystem identity:</span> Users and business entities now log in once to manage all their interactions across classifieds, business listings, and news channels without separate credentials.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Centralized post lifecycle:</span> Classified posts and directory listings can be updated, extended, or paused from a single dashboard, updating live endpoints in real time.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Streamlined business verification:</span> Consolidated the verification queue into a secure, auditable workflow that reduced turnaround time for verified business status.
                </p>
              </div>

              {/* Interface Visualizations */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-emerald-900 mb-6">
                  Platform Interface & Architecture Showcase
                </h4>

                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    VGC Central Authentication & Ecosystem Dashboard Interface
                  </h5>
                  <img
                    src="/images/vgc/vgc.png"
                    alt="Viet Global Connect Ecosystem Central Dashboard"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    The VGC-User authentication portal showcasing the integrated ecosystem services (Classifieds, Business Hub, Editorial News, and User Dashboard) alongside core capabilities including classified post management, business verification, and real-time engagement analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-base font-semibold text-amber-700 mb-4">🟡 Lesson</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p>
                  <span className="font-semibold">Centralizing identity across subdomains requires clean boundaries:</span> Building VGC-User taught me that uniting independently developed sub-properties is largely a session and token coordination challenge. Setting up proper cross-subdomain cookie policies and role-based custom claims simplified security across all sites.
                </p>
                <p>
                  <span className="font-semibold">Bilingual support must be first-class from day one:</span> Serving both domestic readers and the international diaspora meant that language toggling could not be an afterthought or a raw browser auto-translate. Hardcoding structured dictionary keys ensured UI labels and business categories remained consistent.
                </p>
                <p>
                  <span className="font-semibold">Consolidated moderation saves hours:</span> Before centralizing the dashboard, staff had to jump between separate portals to review posts and verify businesses. Having a single source of truth dramatically reduced administrative effort.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#6D5DFB]" />
            <h2 className="text-sm font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              Explore This Project
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={vgcUserProject.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#171717] hover:bg-black text-white text-base font-semibold transition-all"
            >
              <Globe className="w-5 h-5 text-white" />
              <span>Visit Live Platform</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
