import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Hire Me If You Dare | Quan Van",
  description: "I build software, AI systems, statistical analytics, and occasionally things that probably didn't need to exist. Available for full-time roles & contract work.",
};

export default function HireMePage() {
  return (
    <PageShell
      eyebrow="Work With Me"
      title="Work With Me."
      description="I build some AI, extract business insights, and create something crazy. I like difficult problems, weird ideas, messy data, and turning vague goals into code that actually works."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 space-y-16">
        {/* Core Capability Streams / Persona Cards */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
            <span>ROLE ALIGNMENT &amp; ENGAGEMENT TYPES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Persona A: Technical & AI */}
            <div className="bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
                <span>FOR SOFTWARE &amp; AI ENGINEERING ROLES</span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] mb-2">Software &amp; AI Engineer</h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Targeting Software Engineer, AI/ML Developer, Backend Developer, and Product Engineer roles.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["C++20", "Rust", "Go", "Local RAG", "Microservices", "Kafka", "Redis"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-white border border-indigo-100 text-[11px] font-mono font-semibold text-[#6D5DFB]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Persona B: Data & Business */}
            <div className="bg-gradient-to-br from-white to-amber-50/30 border border-amber-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>FOR DATA, ANALYTICS &amp; PRODUCT ROLES</span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] mb-2">Data &amp; Technical Business Analyst</h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Targeting Data Analyst, Business Analyst, Product Analyst, and Technical Product Owner roles.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Data Analytics", "K-Means", "Insight Matrix", "Backlog Strategy", "Agile / Scrum", "Streamlit"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-white border border-amber-100 text-[11px] font-mono font-semibold text-amber-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Superpower Ability */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
            <span>MY SUPERPOWER ABILITY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tech & AI Superpower */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6D5DFB] text-[11px] font-semibold mb-4 inline-block">
                  Engineering &amp; AI Superpowers
                </span>
                <h3 className="text-lg font-bold text-[#171717] mb-3">AI &amp; Backend Systems</h3>
                <p className="text-[#525252] text-xs leading-relaxed mb-6">
                  Building local AI RAG workspaces, C++20 vector engines, high-concurrency microservices, prompt engineering (Progressive Refinement), and Redis caching layers.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["C++20", "Rust", "Go", "Python", "Local RAG", "Redis", "Docker", "Node.js"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Business & Product Superpower */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-semibold mb-4 inline-block">
                  Product &amp; Analytics Superpowers
                </span>
                <h3 className="text-lg font-bold text-[#171717] mb-3">Requirements &amp; Data Insights</h3>
                <p className="text-[#525252] text-xs leading-relaxed mb-6">
                  Translating vague business requests into groomed backlogs (100+ user stories), K-Means clustering (k=8), Markov journey state transitions, and Business Insight Matrices.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Agile/Scrum", "User Stories", "K-Means", "Markov Chains", "Insight Matrix", "Streamlit"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Personal Craft & Mindset (Tài lẻ) */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-semibold mb-4 inline-block">
                  Personal Crafts &amp; Mindset
                </span>
                <h3 className="text-lg font-bold text-[#171717] mb-3">Focus &amp; Strategic Arts</h3>
                <p className="text-[#525252] text-xs leading-relaxed mb-6">
                  Beyond software, I train strategic reading through <strong>Go Game (Cờ vây - 囲碁)</strong> and practice artistic focus with the <strong>Recorder Flute (Sáo Recorder)</strong>.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Go Game (Cờ vây)", "Recorder Flute (Sáo)", "Pattern Recognition", "Focus & Discipline"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-mono font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Experience Timeline */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
            <span>PROFESSIONAL EXPERIENCE</span>
          </div>

          <div className="space-y-6">
            {/* 1. Freelance Software Developer */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#171717]">Freelance Software Developer</h3>
                  <p className="text-[#6D5DFB] text-xs font-mono font-semibold">Self-employed · Self-employed · Vietnam (Remote)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Aug 2023 - Present · 3 yrs 1 mo
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• Gathered and analyzed client requirements, translating business needs into scalable software solutions.</li>
                <li>• Designed backend architectures, RESTful APIs, and database schemas for enterprise applications using modern backend technologies.</li>
                <li>• Delivered end-to-end software projects, collaborating directly with clients from requirement analysis through deployment.</li>
                <li>• Developed and deployed AI-enabled applications using Docker across cloud and on-premise environments.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["Software Architecture", "REST APIs", "Database Design", "Docker", "AI Applications"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. AI Engineer - VINAMACHINE / Fixago */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-[#171717]">AI Engineer</h3>
                    <a href="https://www.fixago.vn/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-semibold transition-colors flex items-center gap-1">
                      <span>Fixago (VINAMACHINE)</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <p className="text-emerald-600 text-xs font-mono font-semibold">VINAMACHINE · Part-time · Vietnam (Remote)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Nov 2025 - Aug 2026 · 10 mos
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• Engineered end-to-end AI workflows from the ground up, identifying effective LLM patterns (System Prompts, Progressive Refinement) to automate complex document processing.</li>
                <li>• Reviewed, validated, and optimized model-generated code, diagnosing reasoning failures to ensure architectural alignment and system stability in high-concurrency environments.</li>
                <li>• Collaborated closely with the core team to refine nodes-based logic and improve context/memory management for real-time interactions.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["Large Language Models (LLM)", "Text-to-Speech", "Prompt Engineering", "Context Management", "System Stability"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Website Development Engineer - SKIPLI */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-[#171717]">Website Development Engineer</h3>
                    <a href="https://user.vgcnews24.com/vi/login" target="_blank" rel="noopener noreferrer" className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#6D5DFB] hover:bg-indigo-100 border border-indigo-200 text-[10px] font-semibold transition-colors flex items-center gap-1">
                      <span>Login | VGC User</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <p className="text-[#6D5DFB] text-xs font-mono font-semibold">SKIPLI · Full-time · United States (Remote)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Nov 2025 - Apr 2026 · 6 mos
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• Designed and developed scalable web applications and high-performance backend modules supporting business-critical workflows.</li>
                <li>• Engineered data caching layers using Redis, slashing real-time data retrieval and dashboard loading latency by over 65% for high-volume users.</li>
                <li>• Collaborated with cross-functional remote teams across time zones to deliver high-quality software, improve system performance, and resolve critical production issues.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["Node.js", "React.js", "Redis", "Backend Modules", "Latency Reduction"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Product Owner - CrossTech */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-[#171717]">Product Owner</h3>
                    <a href="https://www.facebook.com/congdongcrosstech/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-[10px] font-semibold transition-colors flex items-center gap-1">
                      <span>Cộng Đồng CrossTech</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <p className="text-purple-600 text-xs font-mono font-semibold">CrossTech · Part-time · Ho Chi Minh City, Vietnam (Hybrid)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Jul 2025 - Dec 2025 · 6 mos
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• <strong>Requirement Analysis &amp; Backlog Management:</strong> Gathered business requirements and broke them down into detailed user stories with clear acceptance criteria; managed and prioritized sprint backlogs for development sprints.</li>
                <li>• <strong>Product Flow &amp; Prototyping:</strong> Collaborated with UI/UX designers to translate user workflows and edge cases into wireframes, ensuring feature designs aligned with user needs and technical feasibility.</li>
                <li>• <strong>Agile Sprint Coordination:</strong> Worked directly with engineering and QA teams throughout the SDLC, participating in daily standups, backlog grooming, and sprint reviews to clarify requirements and unblock tasks.</li>
                <li>• <strong>Data &amp; Competitor Research:</strong> Analyzed market trends and competitor features, synthesizing user feedback to propose practical improvements for the product roadmap.</li>
                <li>• <strong>Stakeholder Alignment:</strong> Acted as a bridge between business stakeholders and developers, ensuring technical solutions accurately reflected business goals and were delivered on schedule.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["Agile / Scrum", "Requirement Analysis", "User Stories", "Product Flow", "Stakeholder Alignment"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Product Development Intern - MOCHIMIN */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-[#171717]">Product Development Intern</h3>
                    <a href="https://lazyprompter.com/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-[10px] font-semibold transition-colors flex items-center gap-1">
                      <span>Lazy Prompter</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <p className="text-amber-600 text-xs font-mono font-semibold">MOCHIMIN · Internship · Singapore (Remote)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Aug 2025 - Oct 2025 · 3 mos
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• Built AI-powered micro-tools focused on productivity and content creation (such as Lazy Prompter).</li>
                <li>• Conducted market research to validate product opportunities and prioritize new features.</li>
                <li>• Optimized Azure services, improving operational efficiency while reducing infrastructure costs.</li>
                <li>• Collaborated on UX/UI design to deliver intuitive and user-friendly product experiences.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["AI Micro-tools", "Azure", "Market Research", "Productivity", "UI/UX Design"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Research Experience Timeline */}
        {/* Research & Publications Timeline */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>RESEARCH EXPERIENCE &amp; PUBLICATIONS</span>
          </div>

          <div className="space-y-6">
            {/* Scientific Research Assistant - HUTECH */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#171717]">Scientific Research Assistant</h3>
                  <p className="text-sky-600 text-xs font-mono font-semibold">HUTECH - Ho Chi Minh City University of Technology · Self-employed · Ho Chi Minh City, Vietnam (Hybrid)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Jul 2022 - Nov 2025 · 3 yrs 5 mos
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• Conducted research on machine learning, deep learning, computer vision, natural language processing, and multimodal AI for real-world applications.</li>
                <li>• Designed and implemented end-to-end ML pipelines, including data preprocessing, model development, training, evaluation, and performance optimization.</li>
                <li>• Investigated data mining algorithms such as Apriori and FP-Growth, proposing optimized approaches for large-scale pattern mining and benchmarking using Python.</li>
                <li>• Authored research papers, technical reports, and experimental documentation while collaborating with researchers on applied AI projects.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Data Mining", "Python"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Publication: MHOI Data Mining */}
            <div className="bg-gradient-to-br from-white to-sky-50/40 border border-sky-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    FEATURED PUBLICATION
                  </span>
                  <a
                    href="https://www.hutech.edu.vn/khcnhtqt/hoi-thao-trong-nuoc/14618849-ky-yeu-hoi-nghi-sinh-vien-nghien-cuu-khoa-hoc-hutech-2024"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-0.5 rounded-full bg-white text-sky-700 hover:bg-sky-50 border border-sky-200 text-[10px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>HUTECH Scientific Proceedings 2024</span>
                    <span>↗</span>
                  </a>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-xs font-mono font-semibold text-sky-700 border border-sky-200 self-start sm:self-auto">
                  2024 Proceedings
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-[#171717] mb-2 leading-snug">
                Mining Maximal High Occupancy Itemsets (MHOI)
              </h4>

              <p className="text-xs font-mono text-sky-600 mb-4">
                HUTECH Scientific Research Conference (Hội nghị Sinh viên Nghiên cứu Khoa học HUTECH)
              </p>

              <div className="bg-white/90 border border-sky-100 rounded-xl p-4 mb-5 text-xs text-[#525252] leading-relaxed italic">
                &ldquo;This research proposes an efficient approach for mining Maximal High Occupancy Itemsets (MHOI). Unlike traditional frequent itemset mining, MHOI focuses on the contribution of items within their supporting transactions. To address the challenges of high computational costs and memory consumption, the proposed algorithm incorporates advanced pruning strategies and compact data structures. By focusing exclusively on maximal patterns, the method significantly reduces the discovery of redundant information, ensuring that only the most significant and representative patterns are extracted from the dataset.&rdquo;
              </div>

              <div className="flex flex-wrap gap-1.5">
                {["MHOI Algorithm", "Data Mining", "Maximal Pattern Mining", "Pruning Strategies", "Memory Optimization", "Python Benchmarking"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-white border border-sky-200 text-[10px] font-mono text-sky-700 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Volunteering & Community Impact */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>VOLUNTEERING &amp; COMMUNITY IMPACT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. HUTECH Poverty Alleviation */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                    Poverty Alleviation
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Apr 2023 - Jun 2023</span>
                </div>
                <h3 className="text-base font-bold text-[#171717] mb-1">Student Volunteer</h3>
                <p className="text-xs font-semibold text-emerald-600 mb-3">HCM University of Technology (HUTECH)</p>
                <p className="text-xs text-[#525252] leading-relaxed mb-4">
                  Collaborated with fellow students to raise funds within the university community to buy food, clothes, and necessities for homeless individuals and children in need.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">3 mos · Community Relief</span>
            </div>

            {/* 2. HUTECH Environment */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-semibold">
                    Environment
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Jul 2022</span>
                </div>
                <h3 className="text-base font-bold text-[#171717] mb-1">Student Volunteer</h3>
                <p className="text-xs font-semibold text-teal-600 mb-3">HCM University of Technology (HUTECH)</p>
                <ul className="text-xs text-[#525252] leading-relaxed space-y-1 mb-4">
                  <li>• Cleaned a sub-district street with the volunteer team.</li>
                  <li>• Inspected local households to eliminate mosquito breeding grounds for community public health.</li>
                </ul>
              </div>
              <span className="text-[10px] font-mono text-slate-400">1 mo · Street Cleanup &amp; Sanitation</span>
            </div>

            {/* 3. HUTECH Children & Pagoda Meal */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">
                    Children &amp; Community
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Jul 2022</span>
                </div>
                <h3 className="text-base font-bold text-[#171717] mb-1">Student Volunteer</h3>
                <p className="text-xs font-semibold text-amber-600 mb-3">HCM University of Technology (HUTECH)</p>
                <ul className="text-xs text-[#525252] leading-relaxed space-y-1 mb-4">
                  <li>• Assisted monks in cleaning pagoda facilities.</li>
                  <li>• Prepared and served community meals for visitors and local residents.</li>
                </ul>
              </div>
              <span className="text-[10px] font-mono text-slate-400">1 mo · Pagoda Outreach</span>
            </div>

            {/* 4. HUTECH Tet Gift Wrapping */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-semibold">
                    Children &amp; Tet Support
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Nov 2022</span>
                </div>
                <h3 className="text-base font-bold text-[#171717] mb-1">Student Volunteer</h3>
                <p className="text-xs font-semibold text-purple-600 mb-3">HCM University of Technology (HUTECH)</p>
                <p className="text-xs text-[#525252] leading-relaxed mb-4">
                  Participated in a gift-wrapping initiative to package festive gift boxes for underprivileged families, bringing warmth and care for the Tet holiday.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">1 mo · Festive Gift Outreach</span>
            </div>

            {/* 5. Red Cross COVID-19 Rice Bank */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-semibold">
                    Health &amp; Disaster Relief
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Nov 2021 - Dec 2021</span>
                </div>
                <h3 className="text-base font-bold text-[#171717] mb-1">Volunteer Staff</h3>
                <p className="text-xs font-semibold text-red-600 mb-3">Red Cross</p>
                <p className="text-xs text-[#525252] leading-relaxed mb-4">
                  Operated Rice Bank Machines and supported food supply logistics during the COVID-19 pandemic to deliver essential rice directly to families in need.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">2 mos · COVID-19 Food Relief</span>
            </div>

            {/* 6. High School Orphanage Night */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-semibold">
                    Children &amp; Orphanage
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Jun 2020</span>
                </div>
                <h3 className="text-base font-bold text-[#171717] mb-1">Student Volunteer</h3>
                <p className="text-xs font-semibold text-indigo-600 mb-3">High School Outreach</p>
                <ul className="text-xs text-[#525252] leading-relaxed space-y-1 mb-4">
                  <li>• Organized a pre-festive night for children at a local orphanage.</li>
                  <li>• Performed a sign-language dance routine and hosted interactive games with prizes (Banh Tet, cookies, candies).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Honors & Awards Section */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>HONORS &amp; AWARDS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. TOP 3 IT GOT TALENT */}
            <div className="bg-gradient-to-br from-white to-amber-50/40 border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                  3rd Prize · IT Competition
                </span>
                <span className="text-[11px] font-mono text-amber-700 font-semibold">Dec 2024</span>
              </div>
              <h3 className="text-lg font-bold text-[#171717] mb-1">Top 3 IT GOT TALENT (Table D)</h3>
              <p className="text-xs font-semibold text-amber-700 mb-3">
                Issued by HCA (Ho Chi Minh City Computer Association) · Associated with HUTECH
              </p>
              <p className="text-xs text-[#525252] leading-relaxed mb-4">
                Participated in the IT GOT TALENT Competition and won the 3rd Prize with the project <strong>ATM SMART SYSTEM</strong>.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["HCA Association", "ATM Smart System", "3rd Prize", "Software Engineering"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[10px] font-mono text-amber-700 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. TOP 3 HDBANK HACKATHON */}
            <div className="bg-gradient-to-br from-white to-amber-50/40 border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                  3rd Prize · Hackathon
                </span>
                <span className="text-[11px] font-mono text-amber-700 font-semibold">Dec 2024</span>
              </div>
              <h3 className="text-lg font-bold text-[#171717] mb-1">Top 3 HDBank Hackathon 2024</h3>
              <p className="text-xs font-semibold text-amber-700 mb-3">
                Associated with HCM University of Technology (HUTECH)
              </p>
              <p className="text-xs text-[#525252] leading-relaxed mb-4">
                Competed against regional teams and secured 3rd place overall in the HDBank Hackathon 2024.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["HDBank Hackathon", "3rd Place", "Fintech & Data", "HUTECH Team"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[10px] font-mono text-amber-700 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. TOP 10 HUTECH CODEWAR 2023 */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                  Top 10 Finalist
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">2023</span>
              </div>
              <h3 className="text-lg font-bold text-[#171717] mb-1">Top 10 HUTECH CodeWar 2023</h3>
              <p className="text-xs font-semibold text-indigo-600 mb-3">
                Associated with HCM University of Technology (HUTECH)
              </p>
              <p className="text-xs text-[#525252] leading-relaxed mb-4">
                Awarded as one of the Top 10 best competitive programming teams in HUTECH CodeWar 2023.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Competitive Programming", "Algorithms", "CodeWar 2023", "Top 10 Team"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Merit as Active Person in Blood Donation */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                  Humanitarian Recognition
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">Jun 2023</span>
              </div>
              <h3 className="text-lg font-bold text-[#171717] mb-1">Merit as Active Person in Blood Donation</h3>
              <p className="text-xs font-semibold text-red-600 mb-3">
                Humanitarian Blood Donation Movement
              </p>
              <p className="text-xs text-[#525252] leading-relaxed mb-4">
                Recognized and awarded a certificate of merit for active participation and continuous contributions to voluntary blood donation activities.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Blood Donation", "Certificate of Merit", "Community Service", "Humanitarian"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-mono border border-red-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>LANGUAGES &amp; SPOKEN PROTOCOLS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vietnamese */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-semibold">
                    Native
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Primary</span>
                </div>
                <h3 className="text-lg font-bold text-[#171717] mb-2">Vietnamese</h3>
                <p className="text-xs text-[#525252] leading-relaxed font-medium">
                  Speak like a god.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Mother Tongue</span>
                <span className="text-[11px] text-emerald-600 font-bold">100%</span>
              </div>
            </div>

            {/* English */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[#6D5DFB] text-[10px] font-mono font-semibold">
                    Professional
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Global Tech</span>
                </div>
                <h3 className="text-lg font-bold text-[#171717] mb-2">English</h3>
                <p className="text-xs text-[#525252] leading-relaxed font-medium">
                  Fluent enough to argue with Stack Overflow.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Technical &amp; Business</span>
                <span className="text-[11px] text-[#6D5DFB] font-bold">Fluent</span>
              </div>
            </div>

            {/* Japanese */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-mono font-semibold">
                    In Progress
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">日本語</span>
                </div>
                <h3 className="text-lg font-bold text-[#171717] mb-2">Japanese</h3>
                <p className="text-xs text-[#525252] leading-relaxed font-medium">
                  Learning because of Anime. Still learning.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Motivation: Anime &amp; Curiosity</span>
                <span className="text-[11px] text-pink-600 font-bold">WIP 🎌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
            <span>GET IN TOUCH</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5 bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#171717]">Direct Connect</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Prefer direct communication? Reach out via LinkedIn or GitHub.
              </p>
              <div className="space-y-3">
                <a
                  href="https://www.linkedin.com/in/quan-van-15a5b3248/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#FAFAF8] border border-[#EAEAEA] text-sm font-semibold text-[#171717] hover:border-[#6D5DFB] transition-all"
                >
                  <span>Connect on LinkedIn</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://github.com/pomagrenate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#FAFAF8] border border-[#EAEAEA] text-sm font-semibold text-[#171717] hover:border-[#6D5DFB] transition-all"
                >
                  <span>View GitHub Profile</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://x.com/taoxanh_12345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#FAFAF8] border border-[#EAEAEA] text-sm font-semibold text-[#171717] hover:border-[#6D5DFB] transition-all"
                >
                  <span>Follow on X (Twitter)</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}