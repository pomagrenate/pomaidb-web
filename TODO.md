Edited projects.ts
Viewed projects.ts:195-230
Listed directory app
Listed directory content
Viewed page.tsx:1-348
Listed directory case-studies
Viewed page.tsx:1-319

# PORTFOLIO AUDIT & HIRING-MANAGER SIMULATION
**Candidate Portfolio:** `Quan Van` (`pomagrenate / pomaidb-web`)  
**Target Capabilities:** AI Systems Engineering, Software Engineering, Data Analytics, Business Analysis, Product/Ops  

---

# STEP 1 — Understand the Existing Portfolio

### Core Narrative & Architecture
The current portfolio is built as a **systems-heavy, research-driven engineering showcase**. Its structural pillars are:
1. **Homepage (`/`):** Hero tagline `"Building AI systems. Sharing what I learn."` with an eyebrow reading `"Personal AI Lab"`. Features 4 highlight cards (`cheeserag`, `pomaidb`, `Fixago`, `Pomai Ecosystem`), 2 blog posts, and an "About Me" box.
2. **Work Showcase (`/projects`):** Categorized into *Side Projects*, *Products Projects*, *Business Credibility*, and *Build for fun & fun to build*. Contains 25+ projects spanning C++ vector engines (`pomaidb`), local RAG (`cheeserag`), memory allocators (`palloc`), Kaggle/PyTorch ML competitions (`OPT-HQ-Net`, `dsg-ewm-arc-agi-3`), microservices platforms (`Pomai Ecosystem`), and live commercial apps (`Fixago`, `VGC-User`).
3. **Deep Technical Case Studies (`/case-studies`):** 18 long-form post-mortem investigations into low-level backend, distributed systems, and AI agent failures (e.g., *Database Connection Pool Throughput*, *P50 Fast P99 Slow API*, *Kafka Duplicate Message Processing*, *Why AI Agent Keeps Calling Same Tool Forever*).
4. **Work With Me (`/hire-me`):** Highlights core competencies (*Microservices Migration*, *AI-Driven Observability*, *On-Premise CI/CD*) and an extensive experience timeline (*Freelance Software Developer*, *AI Engineer at VINAMACHINE/Fixago*, *Website Development Engineer at SKIPLI*, *Product Owner at CrossTech*, *Scientific Research Assistant at HUTECH*, *Product Development Intern at MOCHIMIN*).

### The First 5–15 Seconds Signal
Within 5–15 seconds, the homepage screams: **"Hardcore AI / C++ Systems Developer & Academic Researcher."**  
It does **NOT** communicate "Business Analyst," "Data Analyst," or "Commercial Strategy Lead."

---

# STEP 2 — First-Impression Test

### 5 Seconds
* **Impression:** "This candidate is an AI / ML Hobbyist or R&D Systems Engineer who builds local LLM engines."
* **Evidence:** Eyebrow `"Personal AI Lab"`, Headline `"Building AI systems. Sharing what I learn."`, cards for `cheeserag` and `pomaidb` (C++ vector DB).

### 15 Seconds
* **Impression:** "A highly technical backend/AI engineer with strong C++, Rust, and Go foundations who writes deep technical documentation."
* **Evidence:** Scanning `pomaidb` (C++20), `palloc` (C memory allocator), `ice_age` (AST pruning in Go), and deep case studies on low-level database locks and microservice memory leaks.

### 30 Seconds
* **Impression:** "An exceptional low-level engineer and algorithm practitioner who competes in Kaggle AI challenges, writes C++ storage engines, and builds microservices."
* **Evidence:** Project list shows PyTorch computer vision pipelines (`OPT-HQ-Net`, `biohub-cell-tracking`) alongside backend microservices (`Pomai Ecosystem`).

### 60 Seconds
* **Impression:** "Very strong engineering depth, but I have no idea what business value they delivered or whether they care about revenue, metrics, customers, or ROI."
* **Evidence:** Project cards focus on tech stacks (`C++20`, `PyTorch`, `Kafka`, `Tauri`) rather than outcomes (`+30% conversion`, `$150k ARR saved`, `40% reduction in customer churn`).

### 3 Minutes
* **Impression:** "If I need a C++/Rust/Go backend engineer or an applied AI developer to build custom local RAG / vector DBs, I am emailing them immediately. If I need a Business Analyst or Data Analyst, I will pass because they look way too overqualified and purely engineering-focused."

---

# STEP 3 — Recruiter Simulation

## Software Engineer
* **Shortlist?** **DEFINITELY YES.**
* **Yes Signals:** C++20 vector engine (`pomaidb`), thread-safe memory allocator (`palloc`), Go AST pruning engine (`ice_age`), Redis latency reduction at SKIPLI (65% drop), and 18 low-level distributed systems case studies.
* **Hesitation:** Is this candidate purely an R&D developer who will over-engineer simple web CRUD apps?
* **Missing:** Clear indication of team size, sprint process in standard corporate environments, and maintenance of legacy codebases.

## AI / ML Engineer
* **Shortlist?** **DEFINITELY YES.**
* **Signal Quality:** **Serious Production & R&D Work** (Not tutorial work).
* **Evidence:** Kaggle/Research benchmarks (`OPT-HQ-Net` for solar filament segmentation, CZ Biohub 3D cell tracking with graph transformers, ARC-AGI-3 world model agents), plus production local LLM deployment at VINAMACHINE/Fixago using Llama.cpp & Qdrant.

## Data Analyst
* **Shortlist?** **PROBABLY NO / MAYBE.**
* **Why:** The homepage and hero section hide your data analysis capabilities. You have `Shopping Mall Customer Segmentation` and `Superstore Data Analysis`, but they are buried under "Business Credibility" at the bottom of the `/projects` page.
* **Missing:** Business question framing, financial modeling, SQL query teardowns, cohort analysis, and explicit business recommendations on the main page.

## Business Analyst
* **Shortlist?** **MAYBE / HESITANT.**
* **Why:** Your `/hire-me` page shows you were a **Product Owner at CrossTech** (backlog management, user story grooming, feature adoption strategy) and **Product Intern at MOCHIMIN** (market research, Azure cost optimization). However, your homepage completely hides this! A recruiter screening for a BA will bounce off the homepage within 5 seconds thinking you are a C++ systems programmer.

## Market Research
* **Shortlist?** **NO.**
* **Why:** Market research requires customer profiling, TAM/SAM/SOM sizing, competitive landscape mapping, and user interview synthesizing. While you performed strategic benchmarking at CrossTech and market validation at MOCHIMIN, these are buried in bullet points under `/hire-me`.

## Business Development
* **Shortlist?** **NO.**
* **Why:** Zero evidence of deal-making, partnership structuring, funnel conversion optimization, sales pipelines, or revenue growth metrics.

---

# STEP 4 — CEO Simulation

> **"Why should I care about this candidate?"**

* **Reaction:** "This person is a powerhouse builder. They don't just prompt ChatGPT; they write C++ engines, build microservices, optimize Redis performance, analyze customer segmentation data, and have experience as a Product Owner. **BUT**, they present themselves as an academic lab / dev playground rather than a business problem solver."
* **Would I spend 3–5 minutes?** Yes, because the sheer depth of output (`pomaidb`, `cheeserag`, 18 case studies) stands out from 99% of boilerplate resume spammers.
* **Would I forward to CTO?** **100% Yes.** "Look at this engineer, let's interview them for backend/AI."
* **Would I forward to Head of Data/Product?** **No, unless I re-frame their profile.** I would assume they would be bored doing data analyst or business analyst work.

---

# STEP 5 — CTO / Engineering Lead Simulation

* **Engineering Maturity Signal:** **EXTREMELY HIGH.**
* **Depth vs. Breadth:** You have **GENUINE DEPTH**. 
  * C++20 zero-OOM memory management is not something a "bootcamp breadth developer" touches.
  * Writing 30,000-word post-mortems on *Database Connection Pool Exhaustion* and *Kafka Outbox Patterns* proves real debugging judgment and architectural discipline.
* **CTO Verdict:** "A top 5% candidate for Backend, Systems, and Applied AI Engineering."

---

# STEP 6 — Head of Data / Analytics Simulation

> **"Can this person turn messy data into something useful for the business?"**

* **Current Evidence:** **Moderate to Low on Homepage, High in Specific Projects.**
* **Evaluation:**
  * Your `Shopping Mall Customer Segmentation` project uses K-Means (k=8) on 15,079 records and implements a consulting-grade *Business Insight Matrix* (Finding/Evidence/Implication). This is **EXCELLENT**.
  * Your `Superstore Data Analysis` project shows Streamlit visualization.
  * **Gap:** You don't showcase SQL analytical queries, financial sensitivity modeling, or executive KPI dashboards prominently. You treat data analysis as a secondary hobby rather than a core problem-solving tool.

---

# STEP 7 — Business Lead / Product Lead Simulation

```text
Business Problem → Data / Evidence → Analysis → Decision → Implementation
```

* **Current Positioning:** You currently present as **Implementation → Technical Architecture**.
* **Unrealized Advantage:** Because you have been a **Product Owner**, a **Research Assistant**, and an **AI/Systems Engineer**, you possess the rare ability to execute the entire chain:
  1. Frame the business problem (PO experience at CrossTech).
  2. Perform data analysis & segmentation (Shopping Mall Customer Segmentation).
  3. Design & implement the technical fix (C++/Go/Python/Next.js).
* **The Problem:** Your portfolio currently communicates: **"I am a technical person who builds AI & low-level systems."**

---

# STEP 8 — Identity / Positioning Audit

> "This person is a **Systems & Applied AI Engineer who also possesses Product & Data Analytics capabilities**."

> "The strongest thing about this candidate is **their technical depth, systems-level execution, and ability to document complex post-mortems**."

> "The candidate appears to be targeting **AI Systems, Backend Engineering, and C++/Rust/Go R&D** roles."

> "The biggest concern I have about this candidate is **that non-technical recruiters for Data/Business Analyst roles will instantly dismiss them as over-specialized in low-level engineering**."

> "The most compelling reason to interview this candidate is **their rare ability to build real systems from raw storage engines to AI agents and product feature backlogs**."

---

# STEP 9 — Positioning Problem & Recommended Identity

### Evaluation of Positioning Identities:

* **Identity A (AI / Software Engineer):** Currently strong, but eliminates BA/Data Analyst opportunities.
* **Identity B (AI Engineer + Data Analyst):** Feels fragmented—looks like someone who couldn't decide between building software or writing Excel/SQL reports.
* **Identity C (Technical + Analytical Problem Solver):** Generic; sounds like resume filler.
* **Identity D (Software / AI Engineer with Business & Data Analytics capabilities):** **BEST CANDIDATE.** Positioned as a **Full-Stack Technical & Analytical Engineer** who builds data-driven software and bridges business strategy with technical execution.
* **Identity E (Multidisciplinary technology professional):** Too vague; risks looking unfocused.

### 🌟 Recommended Primary Positioning: **Identity D**
> **"AI Systems Engineer & Technical Analyst — Bridging Systems Architecture, Data Analytics, and Business Strategy."**

---

# STEP 10 — "Would You Stop Scrolling?" Test

| Signal | Score / 10 | Reason / Evidence |
| :--- | :---: | :--- |
| **Immediate clarity** | **6 / 10** | Clear for AI/Systems, confusing for Business/Data roles. |
| **Differentiation** | **9 / 10** | C++ vector DB + 18 deep case studies + PO experience sets you far apart. |
| **Technical credibility** | **10 / 10** | `pomaidb`, `palloc`, `cheeserag`, zero-OOM C++ engines. |
| **Analytical credibility** | **6 / 10** | `Shopping Mall Segmentation` is great, but hidden at the bottom. |
| **Business credibility** | **5 / 10** | CrossTech PO experience is buried on `/hire-me`. |
| **Visual professionalism** | **9 / 10** | Clean typography, subtle gradients, high-end design aesthetics. |
| **Narrative quality** | **7 / 10** | Excellent technical writing, but lacks commercial revenue framing. |
| **Project credibility** | **9.5 / 10** | Live links (`Fixago`, `VGC-User`), public repos, benchmarks. |
| **Evidence of impact** | **6.5 / 10** | Engineering impact is shown (65% latency drop), business revenue impact is sparse. |
| **Hiring relevance** | **7.5 / 10** | 10/10 for SWE/AI; 5/10 for BA/Data Analyst. |

### 20-Second Verdict:
> *"This candidate is an elite technical builder who builds vector DBs and local RAG systems. If I am hiring a Senior Software/AI Engineer, I am stopping immediately to read their case studies. If I am hiring a Data Analyst or Business Analyst, I assume they applied to the wrong job posting and keep scrolling."*

---

# STEP 11 — "Would You Explore the Entire Portfolio?" Test

* **Would they stop?** **Likely** (for technical recruiters); **Possible** (for general recruiters).
* **Would they explore?** **Very Likely** (for CTOs/Engineering Leads); **Unlikely** (for non-technical HR screeners).
* **Would they finish a case study?** **Likely** (if they are an engineering manager looking for deep technical proof).
* **Would they click GitHub?** **Very Likely** (repos are linked cleanly on cards).
* **Would they contact you?** **Very Likely for SWE/AI; Possible for BA/Data Analyst (if re-positioned).**

---

# STEP 12 — Project Quality Audit

| Project | Strong Signal | Weak Signal | Target Role | Keep / Change / Move |
| :--- | :--- | :--- | :--- | :--- |
| `cheeserag` | Local RAG, C++ vector DB integration | None | AI / SWE | **KEEP** (Hero Featured) |
| `pomaidb` | Low-level C++20 storage engine | Technical only | Systems / SWE / AI | **KEEP** (Hero Featured) |
| `Fixago` | Live commercial product, 24/7 AI booking | Needs outcome metrics | Full-Stack / Product | **KEEP** (Add business metrics) |
| `Pomai Ecosystem` | Enterprise Microservices, Outbox pattern | Needs visual architecture diagram | Backend / Architect | **KEEP** (Add diagram) |
| `Shopping Mall Segmentation` | Consulting-grade K-Means (k=8), Insight Matrix | Hidden at bottom | Data Analyst / BA / Product | **MOVE UP** (Promote to Business & Data section) |
| `Superstore Data Analysis` | Executive Streamlit analytics | Basic dataset | Data Analyst | **KEEP** (Under Business & Data) |
| `OPT-HQ-Net` / `Biohub` | PyTorch computer vision, Kaggle research | Academic niche | ML / Research | **KEEP** (Under Research/AI) |
| `CrossTech PO Backlog` | Groomed 100+ stories, +35% adoption | Currently only text on `/hire-me` | BA / Product / Ops | **NEW CASE STUDY** (Create Product/BA case study) |
| `Perfect Split` / `Bento Sort` | Mini web games | No business signal | Fun / Playground | **KEEP LOWER** (Bottom of projects) |

---

# STEP 13 — Case Study Audit

Your 18 case studies currently follow this technical flow:
```text
Problem → Architecture → Engineering Decisions → Implementation → Trade-offs → Results
```
**This is PERFECT for Software / AI / Systems Engineering.**

However, to support **Data Analyst, Business Analyst, and Product Analyst** roles, you need 2–3 case studies that follow the analytical business flow:
```text
Business Problem → Data & Metrics → Methodology / Segmentation → Insight Matrix → Strategic Recommendation → Business Impact
```

---

# STEP 14 — Homepage Audit

### Current Homepage Assessment:
* **Hero Tagline:** `"Building AI systems. Sharing what I learn."`
* **Eyebrow:** `"Personal AI Lab"`
* **Classification:** Currently feels like a **High-End Technical R&D Lab / Engineer Showcase**.
* **What's Missing:** Zero mention of **Data Analytics, Business Decision-Making, or Product/Business Impact**.

---

# STEP 15 — Business Expansion Strategy

### Evaluated Options:
* **Option A (Mix technical and business projects together):** Bad. Confuses recruiters (e.g., C++ vector DB next to Streamlit sales chart).
* **Option B (Separate "Business & Analytics" category in `/projects`):** Better (what we just started doing with "Business Credibility").
* **Option C (Separate "Data & Business Analytics" section on Homepage + `/projects`):** **EXCELLENT.**
* **Option D (Unified Case Studies system with filtering tabs for *Engineering* vs. *Data & Business*):** **BEST APPROACH.**

### 🌟 Recommendation: Option C + Option D
On the homepage and `/projects`, introduce clear category streams (*Systems & AI Engineering* and *Data & Business Analytics*).

---

# STEP 16 — Avoid Identity Crisis

Do **NOT** try to look like a generic junior data analyst who only knows Excel formulas.

Exploit your technical strength as your **competitive moat** for business/data roles:
> **"The Technical Data & Business Analyst"** — An analyst who can not only write complex SQL/Python and generate business insights, but can also inspect data pipelines, understand backend architectures, and build automated reporting tools.

### Recommended Dual-Pillar Positioning:
* **Primary Core:** AI Systems & Software Engineering
* **Secondary Pillar:** Data Analytics, Business Analysis & Product Strategy

---

# STEP 17 — Recruiter Cognitive Load

Currently, a recruiter screening for a Data Analyst or Business Analyst has to do **too much mental work** to connect your PO experience and Customer Segmentation project to their job description.

**Fix:** Add a dedicated **"Core Capabilities"** or **"Target Roles"** toggle/selector or explicit sub-headline on the Homepage & `/hire-me` page.

---

# STEP 18 — Credibility Audit

* **Exaggerations / Buzzwords:** Low. Your projects are backed by working code, GitHub repos, and live URLs (`Fixago`, `VGC-User`).
* **AI-Generated Smell:** Extremely low. The detailed technical explanations in your 18 case studies prove real human engineering experience.
* **Trust Factor:** **9.5 / 10.**

---

# STEP 19 — Competitive Differentiation

### What average candidates bring:
* **Junior Data Analyst:** basic SQL queries, sample PowerBI dashboard, iris dataset.
* **Junior Business Analyst:** basic user stories, flowcharts.
* **Junior Developer:** basic MERN stack CRUD apps.

### What YOU bring (Your Moat):
1. **Full SDLC Execution:** You can frame the business requirement (PO experience), perform statistical data analysis (K-Means / Streamlit), build low-level backend microservices (C++/Go/Kafka), and deploy live applications (Next.js/Docker).
2. **Consulting-Grade Insight Matrices:** Bridging technical ML outputs directly to revenue optimization strategy.

---

# STEP 20 — Hiring Funnel Simulation

```text
Job Application / CV → Portfolio Link → Homepage (5s) → 20s Decision → Case Study / Project → Interview
```

* **Current Drop-off Point for BA / Data Analyst:** **Homepage (5s).**  
  *The recruiter sees "Personal AI Lab" and assumes you are overqualified/uninterested in BA/Data roles.*
* **Fixing the Funnel:** Update the Homepage Hero and split featured projects into two distinct streams: **Engineering Systems** and **Data & Business Analytics**.

---

# STEP 21 — Final Verdict

### Scores:
* **Technical Positioning:** `9.5 / 10`
* **Business/Analytics Positioning:** `5.5 / 10` (Needs homepage promotion)
* **Recruiter Appeal (SWE/AI):** `9.5 / 10`
* **Recruiter Appeal (BA/Data Analyst):** `5.0 / 10` (Currently too hidden)
* **CEO Appeal:** `8.5 / 10`
* **CTO Appeal:** `9.8 / 10`
* **Head of Data / Analytics Appeal:** `6.5 / 10`
* **Differentiation:** `9.5 / 10`
* **Clarity:** `7.0 / 10`
* **Credibility:** `9.5 / 10`
* **Overall Hiring Value:** `8.5 / 10`

### Questions & Answers:
1. **If you were a recruiter, would you interview me for SWE/AI?**
   * **Definitely Yes.** Top tier candidate with real systems execution.
2. **If you were a recruiter, would you interview me for BA / Data Analyst?**
   * **Maybe / Probably No (currently).** Only because the homepage hides your analytical and product background.
3. **If you were a CEO, would you spend 5 minutes exploring?**
   * **Definitely Yes.** The portfolio is exceptionally high quality.

---

# STEP 22 — Top 10 Most Important Changes

| Priority | Change | Why | Expected Impact |
| :---: | :--- | :--- | :--- |
| **1** | **Refactor Hero Sub-headline** | Expand beyond "Personal AI Lab" to include Data Analytics & Systems Strategy. | Bounces 80% fewer BA/Data Analyst recruiters. |
| **2** | **Add "Data & Business Analytics" Stream to Homepage** | Showcase `Shopping Mall Customer Segmentation` & `Superstore Analysis` directly on Homepage alongside `cheeserag`. | Immediate visual proof of analytical capability. |
| **3** | **Create 1 Business/BA Case Study** | Document your CrossTech Product Owner backlog grooming (100+ stories, +35% feature adoption) as a formal case study. | 10x credibility for Product Analyst / Business Analyst roles. |
| **4** | **Add Role-Based Persona Badges on `/hire-me`** | Clear tabs/cards: *"For Engineering Teams"* vs. *"For Data & Business Teams"*. | Eliminates recruiter cognitive load instantly. |
| **5** | **Add Business Outcome Metrics to Projects** | Add metric badges (e.g., `65% Latency Reduction`, `15k Customer Personas Mapped`). | Proves commercial value to CEOs & Business Leads. |
| **6** | **Rename / Refine Category Tags in `/projects`** | Elevate *Business Credibility* category right below *Products Projects*. | Already placed cleanly; ensure tags reflect strategy. |
| **7** | **Add Filter Tabs to Case Studies Page (`/case-studies`)** | Allow filtering by `[All]`, `[Systems & Engineering]`, `[Data & Business Analysis]`. | Enables quick navigation for non-technical screeners. |
| **8** | **Promote PO & Data Skills in "About Me"** | Update homepage About Me tags to include `Data Analytics`, `Business Strategy`, `Product Backlog`. | Highlights multidisciplinary depth. |
| **9** | **Add Architecture / Flow Diagrams to Case Studies** | Add visual diagrams to microservice & analytics case studies. | Increases engagement for non-technical readers. |
| **10** | **Add Downloadable PDF Resume Links tailored by role** | Offer "Download Software/AI Resume" and "Download Data/Business Resume" on `/hire-me`. | Direct conversion for HR recruiters. |

---

# STEP 23 — What NOT to Change

1. **DO NOT delete or hide your C++/Rust/Go projects (`pomaidb`, `palloc`, `cheeserag`).** These are your crown jewels and prove rare technical depth.
2. **DO NOT delete your 18 technical case studies.** They give you 9.9/10 CTO credibility.
3. **DO NOT turn the design into a corporate corporate template.** The current sleek, typography-first vanilla CSS design is clean, fast, and modern.
4. **DO NOT fake or overstate business metrics.** Keep every claim grounded in evidence.

---

# STEP 24 — Proposed Future Information Architecture

```text
HOME
  ├── Hero (Dual positioning: AI Systems, Software Engineering & Data Analytics)
  ├── Dual Featured Work
  │     ├── Stream A: Systems & AI Engineering (cheeserag, pomaidb, Fixago)
  │     └── Stream B: Data & Business Analytics (Shopping Mall Segmentation, Superstore Analysis)
  ├── Multidisciplinary About Me
  └── Blog Highlights

WORK SHOWCASE (/projects)
  ├── Systems & AI Engineering
  ├── Commercial Products
  ├── Business & Data Credibility
  └── Creative Experiments

CASE STUDIES (/case-studies)
  ├── Filter: Systems & Architecture (18 case studies)
  └── Filter: Data Analytics & Product Strategy (Customer Segmentation, PO Case Study)

WORK WITH ME (/hire-me)
  ├── Role Focus Selector (Software/AI Engineer | Data Analyst | Business Analyst)
  ├── Technical & Analytical Skill Matrix
  ├── Comprehensive Experience Timeline
  └── Role-Specific Resume Downloads & Contact Form
```

---

# STEP 25 — Homepage Rewrite Strategy

### Current vs. Ideal Positioning:

1. **Current Tagline:** `"Building AI systems. Sharing what I learn."`  
   *Assessment:* 100% engineering focused.
2. **Proposed Tagline:**  
   `"Building AI systems & data intelligence."`  
   *or*  
   `"Engineering scalable systems. Deciphering business data."`
3. **Proposed Sub-headline:**  
   `"I design high-performance software, build applied AI systems, and transform complex datasets into actionable business strategy."`
4. **What stays:** `cheeserag`, `pomaidb`, `Fixago`.
5. **What is added:** `Shopping Mall Customer Segmentation` as a featured analytics card right on the homepage grid.

---

# STEP 26 — Final Strategic Recommendation

### 🌟 Recommended Strategy: **Strategy 5 — Create Role-Specific Entry Points & Streams within One Unified Portfolio**

* **Why:** You do **not** need two separate portfolio websites. Having C++ vector engines alongside customer segmentation data analysis makes you look like a **rare, high-leverage technical asset**—provided the homepage clearly organizes these capabilities rather than hiding data behind C++ code.
* **Hiring Benefits:** 
  * For **Software/AI Engineer** roles: Shows you aren't just a coder, but someone who understands product backlogs and business metrics.
  * For **Data/Business Analyst** roles: Shows you are far superior to standard analysts because you can actually build systems and automate pipelines.
* **Risk:** Minimal, as long as the information architecture cleanly separates engineering from data analytics.

---

### Implementation Next Steps
Whenever you are ready, we can implement:
1. Updated dual-stream Homepage layout in `app/page.tsx`.
2. Role-based tabs on `app/hire-me/page.tsx`.
3. Category filters on `app/case-studies/page.tsx`.