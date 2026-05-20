import Link from "next/link";
import { getResearchItems } from "@/lib/research";
import { getSortedPostsData } from "@/lib/blog";

export default function Home() {
  const researchItems = getResearchItems().slice(0, 3); // Get top 3 research papers
  const blogPosts = getSortedPostsData().slice(0, 3); // Get top 3 blog posts

  return (
    <div className="relative isolate bg-background pb-24">
      {/* Background Decor */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Academic Researcher & Systems Developer</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-7xl">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Quan Van</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            A developer and researcher passionate about scientific inquiry and translating complex academic algorithms into high-performance, low-level database systems and agentic architectures.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/projects"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:scale-105 active:scale-95"
            >
              Explore Projects
            </Link>
            <Link href="/research" className="text-sm font-semibold leading-6 group">
              Read My Research <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Expertise / Research Focus */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 border-t border-border/50">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Core Expertise</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Low-Level Engineering Meets Data Mining
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <FeatureCard
              title="Predictable Vector DBs"
              description="Author of PomaiDB: An embedded, single-threaded, LSM-based vector store built specifically for resource-constrained edge devices and flash memory longevity."
              icon={<DatabaseIcon />}
            />
            <FeatureCard
              title="Advanced Pattern Mining"
              description="Developing state-of-the-art algorithms (CHUO-Miner, HUPP-Miner, MHOUI-Miner) for high-utility, occupancy-aware, and closed itemset pattern recognition."
              icon={<BrainIcon />}
            />
            <FeatureCard
              title="Privacy-Preserving Systems"
              description="Designing shape-hiding keyless tree mining architectures (VIFP) that allow executing recursive operations directly over encrypted and secret-shared data."
              icon={<ShieldIcon />}
            />
          </dl>
        </div>
      </div>

      {/* Featured Projects Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary">Portfolio Highlights</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Systems & Libraries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectHighlightCard
            title="PomaiDB"
            description="Predictable, edge-native vector database designed to run single-threaded with an append-only LSM storage engine. Linking into lightweight ARM/x86 configurations."
            tags={["C++20", "Vector Indexing", "Edge Computing"]}
            github="https://github.com/pomagrenate/pomaidb"
            docs="/docs"
          />

          <ProjectHighlightCard
            title="dm"
            description="The core C++ Data Mining library implementing high-occupancy and closed utility itemset discovery, vertical bitsets, and shape-hiding encrypted tree processing."
            tags={["C++20", "Data Mining", "Oblivious Systems"]}
            github="https://github.com/oh-mah-c/dm"
          />

          <ProjectHighlightCard
            title="Cheeserag"
            description="Local-first RAG and agent orchestration framework integrating C++ LLM inference servers and embedded vector databases into autonomous loops."
            tags={["Go", "RAG", "Agent Loops"]}
            github="https://github.com/pomagrenate/cheeserag"
            details="/projects/cheeserag"
          />

          <ProjectHighlightCard
            title="palloc"
            description="A hardware-aware DRAM bank partitioning memory allocator designed to safeguard long-term performance isolation and prevent edge system OOMs."
            tags={["C / Rust", "Memory Systems", "Kernel Modules"]}
            github="https://github.com/pomagrenate/palloc"
          />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            View All 12 Projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Recent Research Papers */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 border-t border-border/50">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary">Academic Work</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Recent Research Publications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchItems.map((item) => (
            <article key={item.slug} className="flex flex-col border border-border/80 bg-card p-6 rounded-xl hover:border-primary/50 transition-all duration-300">
              <span className="text-[9px] w-fit font-black uppercase tracking-widest px-2 py-0.5 bg-primary/15 text-primary rounded border border-primary/10 mb-4">
                {item.date}
              </span>
              <h3 className="text-lg font-bold tracking-tight mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-4 font-semibold">{item.authors}</p>
              <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-6">
                {item.abstract}
              </p>
              <Link
                href={item.href}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Open PDF
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            Browse Full Publications <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Latest Technical Writing */}
      {blogPosts.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 border-t border-border/50 bg-muted/10">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-primary">Engineering Blog</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Latest Technical Writing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col border border-border/80 bg-card/60 p-6 rounded-xl hover:border-primary/50 hover:bg-card transition-all duration-300">
                <span className="text-[9px] w-fit font-black uppercase tracking-widest px-2 py-0.5 bg-muted text-muted-foreground rounded mb-4">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground font-mono mb-4">{post.date}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Go to Engineering Blog <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col group">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <dt className="text-base font-semibold leading-7">{title}</dt>
      <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
        <p className="flex-auto">{description}</p>
      </dd>
    </div>
  );
}

function ProjectHighlightCard({
  title,
  description,
  tags,
  github,
  docs,
  details,
}: {
  title: string;
  description: string;
  tags: string[];
  github: string;
  docs?: string;
  details?: string;
}) {
  return (
    <div className="flex flex-col bg-card/50 backdrop-blur-sm border border-border/80 rounded-2xl p-8 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{title}</h3>
        <div className="flex gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-muted rounded border border-border text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-8">
        {description}
      </p>
      <div className="flex flex-wrap gap-4 border-t border-border/40 pt-6">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          Source Code
        </a>
        {docs && (
          <Link href={docs} className="text-xs font-bold text-primary hover:underline">
            Documentation
          </Link>
        )}
        {details && (
          <Link href={details} className="text-xs font-bold text-primary hover:underline">
            View Case Study
          </Link>
        )}
      </div>
    </div>
  );
}

// Icons
function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
  );
}

function BrainIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2.96-1.29-4.83-3.6-5.9A3 3 0 0 0 14 3a3 3 0 0 0-4 1.5 5 5 0 0 1-5 5.5 3 3 0 0 0-1.5 5.5c2.31 1.07 3.5 2.94 3.5 5.9A7 7 0 0 0 12 22Z"/></svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  );
}
