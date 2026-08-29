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
      title="Hire Me If You Dare."
      description="I build software, AI systems, statistical data pipelines, and occasionally things that probably didn't need to exist. I like difficult problems, weird ideas, messy data, and turning vague goals into things that actually work."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 space-y-16">
        {/* Core Capability Streams / Persona Cards */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
            <span>ROLE ALIGNMENT &amp; ENGAGEMENT TYPES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Persona A: Technical & Systems */}
            <div className="bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
                <span>FOR SOFTWARE &amp; AI ENGINEERING ROLES</span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] mb-2">Systems &amp; AI Engineer</h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Targeting Software Engineer, AI/ML Engineer, Backend Developer, and Systems Architect roles.
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

        {/* What I Do */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
            <span>CORE COMPETENCIES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6D5DFB] text-[11px] font-semibold mb-4 inline-block">
                  Architecture
                </span>
                <h3 className="text-lg font-bold text-[#171717] mb-3">Microservices Migration</h3>
                <p className="text-[#525252] text-xs leading-relaxed mb-6">
                  Transforming fragile monoliths into robust, event-driven microservices. Expertise in outbox pattern data integrity, Kong gateways, and database migrations.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["PostgreSQL", "Kafka", "Kong"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold mb-4 inline-block">
                  AI Systems
                </span>
                <h3 className="text-lg font-bold text-[#171717] mb-3">AI-Driven Observability</h3>
                <p className="text-[#525252] text-xs leading-relaxed mb-6">
                  Autonomous Root Cause Analysis (RCA) pipelines. Integrating Flink, Kafka, and CPU-only local LLMs (Llama.cpp) for low-cost log intelligence.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["RAG", "Qdrant", "Llama.cpp"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-semibold mb-4 inline-block">
                  Data Intelligence
                </span>
                <h3 className="text-lg font-bold text-[#171717] mb-3">Data &amp; Insight Analytics</h3>
                <p className="text-[#525252] text-xs leading-relaxed mb-6">
                  Translating 15k+ record datasets into consulting-grade Business Insight Matrices (Finding → Evidence → Implication) and executive Streamlit dashboards.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["K-Means", "Python", "Streamlit"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-semibold mb-4 inline-block">
                  Product Strategy
                </span>
                <h3 className="text-lg font-bold text-[#171717] mb-3">Backlog &amp; Requirements</h3>
                <p className="text-[#525252] text-xs leading-relaxed mb-6">
                  Groomed 100+ user stories, reduced sprint planning ambiguity by 40%, and partnered with design/engineering squads to boost feature adoption by 35%.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Agile/Scrum", "User Stories", "SDLC"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
            <span>EXPERIENCE</span>
          </div>

          <div className="space-y-6">
            {/* 1. Freelance Software Developer */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#171717]">Freelance Software Developer</h3>
                  <p className="text-[#6D5DFB] text-xs font-mono font-semibold">Self-employed · Vietnam (Remote)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Aug 2023 - Present
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

            {/* 2. AI Engineer - VINAMACHINE */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-[#171717]">AI Engineer</h3>
                    <a href="https://www.fixago.vn/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-semibold transition-colors flex items-center gap-1">
                      <span>Fixago</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <p className="text-emerald-600 text-xs font-mono font-semibold">VINAMACHINE · Part-time · Vietnam (Remote)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Nov 2025 - Aug 2026
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• Engineered end-to-end AI workflows from the ground up, identifying effective LLM patterns (System Prompts, Progressive Refinement) to automate complex document processing.</li>
                <li>• Reviewed, validated, and optimized model-generated code, diagnosing reasoning failures to ensure architectural alignment and system stability in high-concurrency environments.</li>
                <li>• Collaborated closely with the core team to refine nodes-based logic and improve context/memory management for real-time interactions.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["LLMs", "Prompt Engineering", "Text-to-Speech", "Context Management", "System Stability"].map((t) => (
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
                      <span>VGC User Portal</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <p className="text-[#6D5DFB] text-xs font-mono font-semibold">SKIPLI · Full-time · United States (Remote)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Nov 2025 - Apr 2026
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
                      <span>CrossTech Community</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <p className="text-purple-600 text-xs font-mono font-semibold">CrossTech · Part-time · Ho Chi Minh City, Vietnam (Hybrid)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Jul 2025 - Nov 2025
                </span>
              </div>
              <ul className="space-y-2 text-[#525252] text-sm leading-relaxed mb-6">
                <li>• <strong>Backlog Management &amp; Requirement Engineering:</strong> Transformed high-level product vision into a groomed backlog of 100+ actionable user stories and precise acceptance criteria, reducing sprint planning ambiguity by 40%.</li>
                <li>• <strong>User-Centric Design Strategy:</strong> Partnered with UI/UX teams to translate user pain points into intuitive wireframes and prototypes, boosting feature adoption rates by over 35% pre-development.</li>
                <li>• <strong>Agile Development Leadership:</strong> Served as primary contact across full SDLC for multi-functional engineering teams, cutting average blocker resolution time by 50% and ensuring 95%+ sprint goal consistency.</li>
                <li>• <strong>Market Intelligence &amp; Strategic Benchmarking:</strong> Leveraged competitive analysis to identify critical feature gaps, delivering recommendations that increased user retention by 25%.</li>
                <li>• <strong>Cross-Functional Orchestration:</strong> Acted as central nexus between business stakeholders and technical squads, successfully shipping 10+ core high-impact product features on schedule.</li>
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {["Agile / Scrum", "Requirement Engineering", "Product Backlog", "UI/UX Strategy", "Stakeholder Alignment"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#F4F4F6] text-[10px] font-mono text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Scientific Research Assistant - HUTECH */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#171717]">Scientific Research Assistant</h3>
                  <p className="text-sky-600 text-xs font-mono font-semibold">HUTECH University of Technology · Ho Chi Minh City, Vietnam (Hybrid)</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F4F4F6] text-xs font-mono font-semibold text-[#525252] self-start sm:self-auto">
                  Jul 2022 - Nov 2025
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

            {/* 6. Product Development Intern - MOCHIMIN */}
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
                  Aug 2025 - Oct 2025
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