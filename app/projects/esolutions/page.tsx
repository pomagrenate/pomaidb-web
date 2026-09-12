import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Code2,
  FolderGit2,
  Package,
  Globe,
  Building2,
  Layers,
  Sparkles,
  Cpu,
} from "lucide-react";

// Esolutions project data
const esolutionsProject = {
  title: "Esolutions",
  subtitle: "www.esolutions.vn",
  live: "https://www.esolutions.vn/",
  description:
    "A corporate showcase and dynamic digital platform built for E-Solutions, a provider of smart building engineering, architectural lighting, HVAC management, and facility automation in Vietnam. Built with an intuitive administrative CMS enabling non-technical teams to dynamically feature primary solutions, showcase landmark project portfolios (e.g., Hue Plaza, Central Tower), and manage global partner brands without writing code.",
  tags: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Smart Buildings & IoT",
    "Dynamic CMS & Admin",
    "Responsive UI/UX",
    "PropTech",
  ],
  category: "Products Projects",
};

export default function EsolutionsPage() {
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
              {esolutionsProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              ES
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {esolutionsProject.title}
              </h1>
              <p className="text-base font-mono text-[#0EA5E9] mt-2">
                {esolutionsProject.subtitle}
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
            {esolutionsProject.description}
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
            {esolutionsProject.tags.map((tag) => (
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
            <FolderGit2 className="w-5 h-5 text-[#0EA5E9]" />
            <h2 className="text-sm font-mono font-bold text-[#0EA5E9] uppercase tracking-wider">
              Project Analysis
            </h2>
          </div>

          <div className="space-y-8">
            {/* Problem */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h3 className="text-base font-semibold text-red-700 mb-4">🔴 Problem</h3>
              <div className="text-sm text-red-800 space-y-3">
                <p>
                  <span className="font-semibold">Content inertia in corporate landing pages:</span> E-Solutions provides smart building infrastructure, intelligent architectural facade lighting, HVAC automation, and high-resolution commercial LED displays. As the business regularly completed high-profile installations (such as Hue Plaza and Central Tower) and established new partnerships with global technology brands (such as Philips and Apex LED), keeping the digital storefront current became a constant pain point.
                </p>
                <p>
                  <span className="font-semibold">Engineering bottlenecks for routine marketing:</span> The existing landing page had hardcoded content. Every time the marketing team wanted to feature a new flagship project, update a partner logo, or reorder solutions, they had to submit requests to engineers, wait for code edits, test, and trigger full production redeployments.
                </p>
                <p>
                  <span className="font-semibold">Lack of responsive design and visual hierarchy:</span> The legacy website failed to present technical building solutions in an organized, visually compelling way on mobile and tablet devices, hurting credibility with commercial developers and architects browsing on smartphones.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Initial state:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Static, hardcoded frontend requiring manual developer commits for every content tweak.</li>
                  <li>Multi-day turnaround times for simple marketing updates (adding new case study photos, highlighting a new partner).</li>
                  <li>Inconsistent mobile layout with unoptimized high-resolution images that caused slow load times.</li>
                  <li>No centralized database or management interface for categorizing projects by building sector (commercial, residential, industrial).</li>
                </ul>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">Decoupled Architecture with Next.js & React:</span> I built a modern, responsive web application for E-Solutions focused on clean visual hierarchy, fast rendering, and smooth interactions across devices.
                </p>
                <p>
                  <span className="font-semibold">Intuitive Admin CMS for Non-Technical Staff:</span> I engineered an administrative control panel so non-technical team members can manage site content independently:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <span className="font-semibold">Dynamic Primary Solutions Management:</span> Staff can toggle visibility, prioritize ordering, and update technical copy for core solution pillars (Smart Lighting, Building Management Systems, Commercial HVAC, Audio-Visual & LED).
                  </li>
                  <li>
                    <span className="font-semibold">Landmark Projects Showcase:</span> A structured manager to upload high-resolution installation photography, project metadata (client, year, location), and link them directly to architectural landmarks like Hue Plaza and Central Tower.
                  </li>
                  <li>
                    <span className="font-semibold">Partner Brand Ecosystem:</span> An admin controller to easily add or update verified hardware and vendor partners (Philips, Apex LED, and other international automation suppliers).
                  </li>
                  <li>
                    <span className="font-semibold">Responsive UI & Image Optimization:</span> Implemented Next.js image optimization and responsive grid layouts, ensuring fast loading even with high-resolution architectural photography.
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Evaluation context:</span> Measured across production site performance, mobile viewport audits, and editorial workflow efficiency.
                </p>
                <p>
                  <span className="font-semibold">Key areas evaluated:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-semibold">Content update turnaround:</span> Time required to publish a newly completed project dropped from 2–3 business days down to under 5 minutes via self-service CMS entry.
                  </li>
                  <li>
                    <span className="font-semibold">Performance & image delivery:</span> Verified responsive picture srcset handling and Next.js image caching to keep load times crisp across mobile cellular connections.
                  </li>
                  <li>
                    <span className="font-semibold">Cross-device consistency:</span> Validated UI breakpoints from 375px mobile screens up to 4K desktop displays.
                  </li>
                </ul>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#0EA5E9]">Empowered marketing & sales teams:</span> Non-technical team members now manage featured products, new project galleries, and partner logos independently without engineering tickets.
                </p>
                <p>
                  <span className="font-semibold text-[#0EA5E9]">Professional digital showcase:</span> Landmark architectural installations like Hue Plaza and Central Tower are presented with high-definition photography and clear technical scopes, enhancing trust with prospective B2B clients.
                </p>
                <p>
                  <span className="font-semibold text-[#0EA5E9]">Fast & accessible:</span> The responsive design ensures seamless browsing for building contractors, architects, and corporate executives on both mobile and desktop.
                </p>
              </div>

              {/* Interface Visualizations */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-emerald-900 mb-6">
                  Platform Interface & Showcase
                </h4>

                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    E-Solutions Technological Solutions Homepage & Project Showcase
                  </h5>
                  <img
                    src="/images/esolutions/esolutions.png"
                    alt="E-Solutions Smart Building & Lighting Technological Solutions Homepage"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    The E-Solutions landing interface featuring primary technological solution pillars (Smart Building Automation, Architectural Lighting, Energy Management), dynamic partner brand integrations (Philips, Apex LED), and featured landmark projects including Hue Plaza and Central Tower.
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-base font-semibold text-amber-700 mb-4">🟡 Lesson</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p>
                  <span className="font-semibold">Constrained CMS schemas beat unstructured WYSIWYG:</span> In my earlier attempts at content management, I gave users open-ended rich text fields, which often resulted in misaligned margins or broken typography. By enforcing strict schemas (title, client name, year, categorized tags, aspect-ratio-locked image URLs), the layout remains pristine regardless of who publishes the content.
                </p>
                <p>
                  <span className="font-semibold">In B2B infrastructure, visual proof comes first:</span> Commercial developers and enterprise clients want to see tangible evidence that solutions have been tested in real buildings. Featuring landmark project photography prominently on the landing page created much more engagement than paragraphs of technical jargon.
                </p>
                <p>
                  <span className="font-semibold">Developer time is best spent on architecture, not copy edits:</span> Investing the initial effort to build an intuitive content admin saved dozens of hours of back-and-forth communication for simple image swaps or wording adjustments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="bg-gradient-to-br from-sky-50/80 via-blue-50/50 to-indigo-50/40 border border-sky-100 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#0EA5E9]" />
            <h2 className="text-sm font-mono font-bold text-[#0EA5E9] uppercase tracking-wider">
              Explore This Project
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={esolutionsProject.live}
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
