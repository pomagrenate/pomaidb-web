import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Code2,
  FolderGit2,
  Package,
  Globe,
  Bot,
  Zap,
  ShieldCheck,
  Languages,
} from "lucide-react";

// Fixago project data
const fixagoProject = {
  title: "Fixago",
  subtitle: "www.fixago.vn",
  live: "https://www.fixago.vn/",
  description:
    "An on-demand home repair and technician dispatch marketplace in Vietnam. Solves traditional friction where homeowners had to physically visit repair shops for leaking pipes, air conditioning, and electrical issues. Built with 'Fixie', a 24/7 multilingual AI customer service assistant that maintains 99% availability, supports >1,000 concurrent requests, communicates across 10 languages, and extracts bookings deterministically without hallucinations.",
  tags: [
    "Next.js",
    "React",
    "TypeScript",
    "On-Demand Marketplace",
    "24/7 AI Customer Service",
    "10 Languages Support",
    "Zero-Hallucination Extraction",
    "High Concurrency (>1000 req/s)",
    "Vietnam",
  ],
  category: "Products Projects",
};

const SUPPORTED_LANGUAGES = [
  { name: "Tiếng Việt", localized: "Vietnamese", code: "vi" },
  { name: "English", localized: "English", code: "en" },
  { name: "Français", localized: "French", code: "fr" },
  { name: "中文", localized: "Chinese", code: "zh" },
  { name: "Deutsch", localized: "German", code: "de" },
  { name: "Italiano", localized: "Italian", code: "it" },
  { name: "Español", localized: "Spanish", code: "es" },
  { name: "日本語", localized: "Japanese", code: "ja" },
  { name: "한국어", localized: "Korean", code: "ko" },
  { name: "Русский", localized: "Russian", code: "ru" },
];

export default function FixagoPage() {
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
              {fixagoProject.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* Project Header */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              FX
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {fixagoProject.title}
              </h1>
              <p className="text-base font-mono text-[#FF6B35] mt-2">
                {fixagoProject.subtitle}
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
            {fixagoProject.description}
          </p>
        </div>

        {/* Multilingual Support Banner */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-5 h-5 text-[#6D5DFB]" />
            <h2 className="text-sm font-mono font-bold text-[#6D5DFB] uppercase tracking-wider">
              24/7 Multilingual AI Assistant (10 Supported Languages)
            </h2>
          </div>
          <p className="text-sm text-[#525252] mb-6">
            To serve both local homeowners and the growing expatriate community in Vietnam, Fixie communicates natively in 10 languages:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className="p-3 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA] text-center"
              >
                <div className="text-sm font-bold text-[#171717]">{lang.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{lang.localized}</div>
              </div>
            ))}
          </div>
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
            {fixagoProject.tags.map((tag) => (
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
                  <span className="font-semibold">The friction of physical repair sourcing:</span> In Vietnam, when a water pipe bursts, an air conditioner stops cooling during a 38°C heatwave, or electrical switches short-circuit, homeowners typically have to drive out to find physical street-corner repair shops or rely on word-of-mouth recommendations.
                </p>
                <p>
                  <span className="font-semibold">Opaque pricing & lack of warranty:</span> Independent repair technicians rarely provide itemized quotes before opening appliances, leading to price haggling, surprise charges, and zero guarantees once the repairman walks away.
                </p>
                <p>
                  <span className="font-semibold">The 8-hour human administrator bottleneck:</span> Traditional customer service desks operate exclusively during business hours (8 hours a day). However, household plumbing and electrical failures frequently happen late in the evening, early in the morning, or during holiday weekends when human coordinators are unreachable.
                </p>
                <p>
                  <span className="font-semibold">Language barriers for international residents:</span> Vietnam hosts a substantial expatriate and international tourist population. When non-Vietnamese speakers face utility breakdowns, communicating technical issues like refrigerant leaks or circuit breaker trips over standard phone calls is nearly impossible.
                </p>
              </div>
            </div>

            {/* Baseline */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-700 mb-4">⚪ Baseline</h3>
              <div className="text-sm text-gray-800 space-y-3">
                <p>
                  <span className="font-semibold">Traditional repair dispatch flow:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Customers had to physically search for independent neighborhood repair shacks or make multiple phone calls.</li>
                  <li>Customer service hotline active only ~8 hours per day (e.g., 8:00 AM to 5:00 PM), with zero coverage at night or on holidays.</li>
                  <li>No centralized dispatch software, leading to mismatched technician skill sets and long waiting times (often next-day or later).</li>
                  <li>Customer support restricted solely to Vietnamese, excluding non-native residents.</li>
                  <li>Pricing decided arbitrarily on-site without standard catalog verification.</li>
                </ul>
              </div>
            </div>

            {/* Change */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-base font-semibold text-blue-700 mb-4">🔵 Change</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  <span className="font-semibold">On-Demand Booking Marketplace:</span> I built Fixago as an on-demand repair platform where users choose their service category (Air Conditioner repair/cleaning, Plumbing, Electrical, Appliances), enter their home address and preferred time slot, and have an accredited technician dispatched directly to their doorstep with transparent upfront pricing and warranty coverage (7–90 days).
                </p>
                <p>
                  <span className="font-semibold">Fixie — 24/7 Multilingual AI Booking Assistant:</span> To solve the 8-hour administrator limit, I designed and integrated &quot;Fixie&quot;, an intelligent assistant operating round the clock:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <span className="font-semibold">24/7 Availability & 99% Uptime:</span> Architected to handle inbound requests at any hour without queue fatigue, ensuring that late-night pipe bursts get booked immediately for first-slot morning or emergency dispatch.
                  </li>
                  <li>
                    <span className="font-semibold">High Concurrency (&gt;1,000 concurrent requests):</span> Decoupled the conversational ingestion layer so the assistant can converse with more than 1,000 users simultaneously during city-wide weather events (such as sudden heatwaves causing surges in AC servicing demand).
                  </li>
                  <li>
                    <span className="font-semibold">10-Language Native Support:</span> Configured native multilingual understanding covering Tiếng Việt, English, Français, 中文, Deutsch, Italiano, Español, 日本語, 한국어, and Русский. Expatriates can describe plumbing issues in German, French, or Japanese, and the system correctly maps their request.
                  </li>
                  <li>
                    <span className="font-semibold">Deterministic Zero-Hallucination Extraction:</span> Rather than letting an LLM generate unconstrained text confirmations, I implemented a strict JSON schema function-calling protocol:
                    <ul className="list-circle list-inside ml-6 mt-1 space-y-1 text-xs text-blue-900 font-mono">
                      <li>• Strict schema enforcement for (service_type, address, district, preferred_time, phone)</li>
                      <li>• Regex validation against Vietnamese telecom prefixes and city/district address trees</li>
                      <li>• Explicit user confirmation prompt before writing any booking into the dispatch database</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            {/* Measurement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-base font-semibold text-purple-700 mb-4">🟣 Measurement</h3>
              <div className="text-sm text-purple-800 space-y-3">
                <p>
                  <span className="font-semibold">Evaluation context:</span> Measured across real conversational booking dialogues and simulated stress loads.
                </p>
                <p>
                  <span className="font-semibold">Key areas evaluated:</span>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-semibold">Availability & Concurrency:</span> Tested conversational API availability maintaining 99%+ uptime under concurrent traffic spikes exceeding 1,000 simulated client connections.
                  </li>
                  <li>
                    <span className="font-semibold">Multilingual intent accuracy:</span> Tested intent classification across all 10 supported languages for core repair categories (refrigerant leak, drain blockage, circuit tripping).
                  </li>
                  <li>
                    <span className="font-semibold">Data extraction precision:</span> Evaluated whether the schema parser correctly rejected invalid phone formats or incomplete addresses rather than hallucinating booking confirmation IDs.
                  </li>
                </ul>
              </div>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-700 mb-4">🟢 Result</h3>
              <div className="text-sm text-emerald-800 space-y-3">
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Frictionless home repair booking:</span> Customers no longer need to wander the neighborhood looking for technicians. Selecting a service, reviewing fixed tariff rates, and scheduling a technician takes under 2 minutes.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">24/7 uninterrupted intake:</span> By delegating tier-1 booking and customer triage to Fixie, customer inquiries received after 6:00 PM or during holidays are processed instantly without waiting for the next working day.
                </p>
                <p>
                  <span className="font-semibold text-[#6D5DFB]">Seamless international customer experience:</span> Foreign residents in Vietnam can book household repairs comfortably in their native language without translation misunderstandings.
                </p>
              </div>

              {/* Interface Visualizations */}
              <div className="mt-8 space-y-8">
                <h4 className="text-sm font-semibold text-emerald-900 mb-4">
                  Platform Interface & AI Assistant Showcase
                </h4>

                {/* Image 1: Landing Page */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Fixago On-Demand Marketplace & Transparent Booking Flow
                  </h5>
                  <img
                    src="/images/fixago/landing.png"
                    alt="Fixago On-Demand Home Repair Marketplace Web & Mobile Interface"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    The Fixago responsive web platform highlighting fast booking steps (Select service → Doorstep technician → Complete repair → 7–90 days warranty), transparent pricing, and direct service categorization for AC, electrical, and plumbing.
                  </p>
                </div>

                {/* Image 2: AI Assistant */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-800 mb-2">
                    Fixie 24/7 Multilingual AI Assistant (10 Languages Support)
                  </h5>
                  <img
                    src="/images/fixago/ai.png"
                    alt="Fixie 24/7 Multilingual AI Customer Service Assistant Interface"
                    className="w-full rounded-lg border border-emerald-200 shadow-sm"
                  />
                  <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                    The Fixie conversational AI widget presenting 10 supported languages (Tiếng Việt, English, Français, 中文, Deutsch, Italiano, Español, 日本語, 한국어, Русский). Operates 24/7 with 99% uptime and zero-hallucination structured booking extraction.
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-base font-semibold text-amber-700 mb-4">🟡 Lesson</h3>
              <div className="text-sm text-amber-800 space-y-3">
                <p>
                  <span className="font-semibold">Never trust generative output for operational logistics:</span> When building Fixie, I quickly realized that an LLM can sound completely confident while making up an invalid phone number or guessing a street name that does not exist in Ho Chi Minh City or Da Nang. Enforcing deterministic schema extraction with strict validation layers before database writes was critical.
                </p>
                <p>
                  <span className="font-semibold">Language support is about terminology, not just translation:</span> Translating &quot;pipe leaking&quot; literally can produce formal terms rarely used by homeowners or foreign residents describing their immediate crisis. Crafting domain-specific multilingual terminology dictionaries significantly improved intent recognition accuracy.
                </p>
                <p>
                  <span className="font-semibold">AI handles coverage; human technicians deliver trust:</span> The AI solved the late-night availability and concurrency bottleneck, but customer trust ultimately depends on the technician arriving on time with the right spare parts. Pairing AI booking with immediate SMS verification created a much more reliable service loop.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-yellow-50/40 border border-orange-100 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-5 h-5 text-[#FF6B35]" />
            <h2 className="text-sm font-mono font-bold text-[#FF6B35] uppercase tracking-wider">
              Explore This Project
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={fixagoProject.live}
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
