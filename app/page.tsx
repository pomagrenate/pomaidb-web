import Image from "next/image";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen bg-background">
      {/* Background Decor */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
        <div className="flex lg:flex-1 items-center gap-2">
          <Image src="/logo.png" alt="PomaiDB Logo" width={32} height={32} className="rounded-sm" />
          <span className="font-bold text-xl tracking-tighter">PomaiDB</span>
        </div>
        <div className="flex gap-x-6">
          <a href="https://github.com/pomagrenate/pomaidb" target="_blank" className="text-sm font-semibold leading-6 hover:text-primary transition-colors">
            GitHub
          </a>
          <a href="/docs" className="text-sm font-semibold leading-6 hover:text-primary transition-colors">
            Documentation
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-7xl">
            The predictable vector database for the <span className="text-primary">edge</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
            Embedded, single-threaded, and offline-first. Built for environments where stability and hardware longevity matter more than theoretical peaks.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </a>
            <a href="https://github.com/pomagrenate/pomaidb" target="_blank" className="text-sm font-semibold leading-6 group">
              View Source <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 border-t border-border/50">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Reliability First</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for Edge AI
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            <FeatureCard
              title="SD-Card Savior"
              description="Append-only, log-structured storage designed to maximize the lifespan of flash storage and eMMC."
              icon={<SdCardIcon />}
            />
            <FeatureCard
              title="Single-Threaded"
              description="Strict event loop architecture. No mutexes, no race conditions, and predictable latency by design."
              icon={<CpuIcon />}
            />
            <FeatureCard
              icon={<div className="font-bold text-primary">AI</div>}
              title="Agent AI Memory"
              description="Specialized long-term memory for LLM agents with built-in sessions and device-wide pruning."
            />
            <FeatureCard
              icon={<div className="font-bold text-primary">RAG</div>}
              title="Offline Edge RAG"
              description="Zero-copy recursive chunking and retrieval pipeline for totally offline document search."
            />
          </dl>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Integrates in seconds</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Built as a lightweight C++20 library with clean C and Python bindings. Link it into your app and start searching.
            </p>
          </div>
          <div className="mt-16 sm:mt-20 glass rounded-2xl p-4 sm:p-8 overflow-hidden">
            <pre className="text-sm font-mono overflow-x-auto">
              <code className="text-muted-foreground">
                <span className="text-primary">#include</span> <span className="text-accent">&quot;pomai/pomai.h&quot;</span>{"\n"}
                {"\n"}
                <span className="text-primary">int</span> main() {"{"}{"\n"}
                {"  "}pomai::DBOptions opt;{"\n"}
                {"  "}opt.path = <span className="text-accent">&quot;/data/vectors&quot;</span>;{"\n"}
                {"  "}opt.dim = <span className="text-primary">384</span>;{"\n"}
                {"\n"}
                {"  "}std::unique_ptr&lt;pomai::DB&gt; db;{"\n"}
                {"  "}pomai::DB::Open(opt, &db);{"\n"}
                {"\n"}
                {"  "}std::vector&lt;<span className="text-primary">float</span>&gt; vec(opt.dim, <span className="text-primary">0.1f</span>);{"\n"}
                {"  "}db-&gt;Put(<span className="text-primary">1</span>, vec);{"\n"}
                {"\n"}
                {"  "}pomai::SearchResult result;{"\n"}
                {"  "}db-&gt;Search(vec, <span className="text-primary">5</span>, &result);{"\n"}
                {"\n"}
                {"  "}db-&gt;Close();{"\n"}
                {"  "}<span className="text-primary">return</span> <span className="text-primary">0</span>;{"\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Hardware Section */}
      <div className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
            <div className="mx-auto w-full max-w-xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight">Built for the real edge</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Optimized for ARM64 and x86_64. Whether it's a Raspberry Pi in a smart camera or an Orange Pi in an industrial gateway, PomaiDB delivers consistent performance.
              </p>
              <div className="mt-10 flex flex-wrap gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-bold text-xl uppercase tracking-widest">Raspberry Pi</span>
                <span className="font-bold text-xl uppercase tracking-widest">NVIDIA Jetson</span>
                <span className="font-bold text-xl uppercase tracking-widest">Orange Pi</span>
                <span className="font-bold text-xl uppercase tracking-widest">eMMC / SD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 py-12 lg:px-8 border-t border-border">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="PomaiDB Logo" width={24} height={24} className="rounded-sm opacity-80" />
            <span className="font-semibold text-muted-foreground">© 2026 PomaiDB. All rights reserved.</span>
          </div>
          <div className="flex gap-x-8">
            <a href="https://github.com/pomagrenate/pomaidb" className="text-sm text-muted-foreground hover:text-primary">GitHub</a>
            <a href="https://www.linkedin.com/in/quan-van-15a5b3248" className="text-sm text-muted-foreground hover:text-primary">LinkedIn</a>
            <a href="https://discord.gg/xmSk3GPH" className="text-sm text-muted-foreground hover:text-primary">Discord</a>
          </div>
        </div>
      </footer>
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

// Simple Hero Icons
function SdCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M9 13v4" /><path d="M15 13v4" /><path d="M12 13v4" /><path d="M18 6v2" /><path d="M6 6v2" /></svg>
  );
}

function CpuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
  );
}

function ZapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  );
}

function CloudOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20" /><path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" /><path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07" /></svg>
  );
}
