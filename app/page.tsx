import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";
import { HeroVisual } from "@/components/hero-visual";

export default function Home() {
  const blogPosts = getSortedPostsData().slice(0, 2);

  const featuredProjects = [
    {
      title: "cheeserag",
      category: "Local AI RAG",
      categoryColor: "bg-indigo-50 text-[#6D5DFB] border-indigo-200",
      iconBg: "bg-indigo-100 text-[#6D5DFB]",
      description: "Privacy-first, fully offline local RAG workspace & NotebookLM alternative powered by embedded C++ vector DB.",
      stars: "Local AI",
      href: "/projects/cheeserag",
      demo: "https://github.com/pomagrenate/cheeserag",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "pomaidb",
      category: "Vector DB",
      categoryColor: "bg-sky-50 text-sky-600 border-sky-200",
      iconBg: "bg-sky-100 text-sky-600",
      description: "Predictable, embedded multimodal vector database & offline RAG engine for Edge AI in C++20.",
      stars: "C++20 Engine",
      href: "https://github.com/pomagrenate/pomaidb",
      demo: "https://github.com/pomagrenate/pomaidb",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      title: "Fixago",
      category: "Commercial Product",
      categoryColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      iconBg: "bg-emerald-100 text-emerald-600",
      description: "Book fast & reliable home repair services in Vietnam with 24/7 AI-powered instant booking.",
      stars: "Live App",
      href: "https://www.fixago.vn/",
      demo: "https://www.fixago.vn/",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Pomai Ecosystem",
      category: "Microservices",
      categoryColor: "bg-purple-50 text-purple-600 border-purple-200",
      iconBg: "bg-purple-100 text-purple-600",
      description: "Enterprise management platform built on microservices architecture with AI-RAG integration.",
      stars: "Architecture",
      href: "https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration.",
      demo: "https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#FAFAF8] text-[#171717] min-h-screen">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#EAEAEA]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Personal AI Lab</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#171717] leading-[1.08]">
                Building <span className="text-[#6D5DFB]">AI</span> systems.
                <br />
                Sharing what I <span className="text-[#10B981]">learn</span>.
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-[#525252] max-w-xl font-normal leading-relaxed">
                I build practical AI solutions, explore research ideas, and write about engineering and the future of AI.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-sm font-semibold shadow-lg shadow-[#6D5DFB]/25 hover:shadow-xl hover:shadow-[#6D5DFB]/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Explore my work</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F4F4F6] text-[#171717] border border-[#EAEAEA] text-sm font-semibold shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Read the blog</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </Link>
              </div>

              {/* Connect Bar */}
              <div className="pt-8 border-t border-[#EAEAEA]/80">
                <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
                  CONNECT WITH ME
                </p>
                <div className="flex flex-wrap items-center gap-6 text-slate-500 font-semibold text-xs transition-all">
                  <a
                    href="https://github.com/pomagrenate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#171717] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/quan-van-15a5b3248/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#0A66C2] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z"/></svg>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://x.com/taoxanh_12345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#171717] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span>X (Twitter)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Abstract Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. FEATURED WORK (PROJECTS) ─── */}
      <section className="py-20 border-b border-[#EAEAEA]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
                <span>FEATURED WORK</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
                Things I've built
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-semibold text-[#525252] hover:text-[#6D5DFB] flex items-center gap-1 transition-colors"
            >
              <span>View all projects</span>
              <span>→</span>
            </Link>
          </div>

          {/* 4 Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="group relative bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${project.iconBg}`}>
                      {project.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${project.categoryColor}`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#525252] leading-relaxed line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Footer Info: GitHub Stars & Demo Link */}
                <div className="pt-4 border-t border-[#EAEAEA]/80 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                    <span>{project.stars}</span>
                  </div>
                  <Link
                    href={project.href}
                    className="text-[#6D5DFB] group-hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Live demo</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. RECENT ARTICLES & ABOUT ME (2-COLUMN SPLIT) ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
            {/* Left Column: Recent Articles */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
                    <span>RECENT ARTICLES</span>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#171717]">
                    Latest from the blog
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm font-semibold text-[#525252] hover:text-[#6D5DFB] flex items-center gap-1 transition-colors"
                >
                  <span>View all articles</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Editorial Article List */}
              <div className="space-y-6">
                {blogPosts.map((post, idx) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col sm:flex-row gap-5 p-5 bg-white border border-[#EAEAEA] rounded-2xl hover:border-[#6D5DFB]/40 hover:shadow-lg transition-all duration-200"
                  >
                    {/* Abstract Thumbnail */}
                    <div className="w-full sm:w-36 h-28 sm:h-auto rounded-xl bg-gradient-to-tr from-purple-100 via-indigo-50 to-emerald-100 flex items-center justify-center shrink-0 border border-slate-100">
                      <svg className={`w-8 h-8 ${idx % 2 === 0 ? 'text-[#6D5DFB]' : 'text-emerald-600'} opacity-70`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>

                    {/* Article Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#525252] line-clamp-2 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>8 min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: About Me */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
                  <span>ABOUT ME</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] mb-4">
                  Engineer. Researcher. Builder.
                </h2>

                <p className="text-sm text-[#525252] leading-relaxed mb-6">
                  I'm an AI Engineer passionate about building practical systems that solve real problems. My work sits at the intersection of AI, systems engineering, and product development.
                </p>

                {/* Tech Pill Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {["AI Engineer", "System Design", "Rust", "Go", "LLM"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#F4F4F6] text-[#525252] border border-[#EAEAEA] rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Avatar Illustration & Link */}
              <div className="flex items-center justify-between pt-6 border-t border-[#EAEAEA]/80">
                <Link
                  href="/hire-me"
                  className="text-sm font-semibold text-[#6D5DFB] hover:underline flex items-center gap-1"
                >
                  <span>More about me</span>
                  <span>→</span>
                </Link>

                {/* Minimalist Illustration Blob */}
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 flex items-center justify-center border border-purple-200">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
