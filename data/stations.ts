export interface Station {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  links: {
    label: string;
    href: string;
    primary?: boolean;
  }[];
  markerLabel: string;
}

export const stations: Station[] = [
  {
    id: "origin",
    number: "00",
    name: "Origin",
    subtitle: "Academic Researcher & Systems Developer",
    description:
      "I build systems that run where others can't — edge devices, constrained memory, local-first inference. My work spans low-level C++ databases, agentic AI architectures, and academic data mining research.",
    tags: ["Systems", "Research", "AI"],
    links: [
      { label: "Read Research", href: "/research", primary: true },
      { label: "View Projects", href: "/projects" },
    ],
    markerLabel: "Origin Stone",
  },
  {
    id: "pomaidb",
    number: "01",
    name: "PomaiDB",
    subtitle: "Embedded Vector Database",
    description:
      "A local-first, single-threaded vector store built for edge AI. LSM-based storage engine designed for flash memory longevity and resource-constrained ARM/x86 deployments.",
    tags: ["C++20", "Vector Indexing", "Edge Computing"],
    links: [
      { label: "Read Docs", href: "/docs", primary: true },
      { label: "GitHub", href: "https://github.com/pomagrenate/pomaidb" },
    ],
    markerLabel: "System Marker",
  },
  {
    id: "cheeserag",
    number: "02",
    name: "Cheeserag",
    subtitle: "Agentic RAG System",
    description:
      "Local-first RAG and agent orchestration framework integrating C++ LLM inference servers and embedded vector databases into autonomous retrieval loops.",
    tags: ["Go", "RAG", "Agent Loops"],
    links: [
      { label: "Case Study", href: "/projects/cheeserag", primary: true },
      { label: "GitHub", href: "https://github.com/pomagrenate/cheeserag" },
    ],
    markerLabel: "Archive Stone",
  },
  {
    id: "cheesebrain",
    number: "03",
    name: "Cheesebrain",
    subtitle: "Local LLM Agent Execution Loop",
    description:
      "The cognitive execution framework and local LLM agent loop for the Cheeserag cluster. Implements ReAct-style reasoning using C++ inference backends — no cloud required.",
    tags: ["C++", "Agent Loop", "ReAct"],
    links: [
      { label: "GitHub", href: "https://github.com/pomagrenate/cheesebrain", primary: true },
    ],
    markerLabel: "Archive Stone",
  },
  {
    id: "dm",
    number: "04",
    name: "dm",
    subtitle: "Data Mining Research Framework",
    description:
      "Core C++ library implementing CHUO-Miner, HUPP-Miner, MHOUI-Miner, and VIFP — algorithms for high-utility, occupancy-aware pattern discovery and oblivious shape-hiding tree mining.",
    tags: ["C++20", "Data Mining", "Algorithms"],
    links: [
      { label: "GitHub", href: "https://github.com/oh-mah-c/dm", primary: true },
    ],
    markerLabel: "Research Gate",
  },
  {
    id: "palloc",
    number: "05",
    name: "palloc",
    subtitle: "Hardware-Aware Memory Allocator",
    description:
      "DRAM bank-partitioning allocator designed to safeguard performance isolation and prevent edge system OOMs. Operates at kernel module level for predictable memory access patterns.",
    tags: ["C / Rust", "Memory Systems", "Kernel"],
    links: [
      { label: "GitHub", href: "https://github.com/pomagrenate/palloc", primary: true },
    ],
    markerLabel: "System Marker",
  },
  {
    id: "ice-age",
    number: "06",
    name: "Ice Age",
    subtitle: "Cold Storage & Index Archiving",
    description:
      "Cold storage and index archiving system for flash wear-aware databases. Dynamically serializes old vector embeddings to keep hot-path indexes small and access times predictable.",
    tags: ["C++", "Serialization", "Wear-Leveling"],
    links: [
      { label: "GitHub", href: "https://github.com/pomagrenate/ice_age", primary: true },
    ],
    markerLabel: "Archive Stone",
  },
  {
    id: "pomaicache",
    number: "07",
    name: "PomaiCache",
    subtitle: "Semantic LLM Prompt Cache",
    description:
      "Semantic cache layer for LLM workloads. Uses bitmap indexes and embedding similarity to avoid redundant GPU/network cycles on repeated or near-identical prompts.",
    tags: ["C++", "Semantic Caching", "Bitmap Indexes"],
    links: [
      { label: "GitHub", href: "https://github.com/pomagrenate/pomaicache", primary: true },
    ],
    markerLabel: "System Marker",
  },
  {
    id: "syntaxvoid",
    number: "08",
    name: "SyntaxVoid",
    subtitle: "Zero-Dependency Lexical Scanner",
    description:
      "A low-level C99 lexical analysis library featuring the FARO-Tokenizer — Flat-Array Robin-Hood Offset Tokenizer — for zero-dependency, zero-allocation parsing.",
    tags: ["C99", "Tokenization", "Robin Hood Hashing"],
    links: [
      { label: "GitHub", href: "https://github.com/pomagrenate/syntaxvoid", primary: true },
    ],
    markerLabel: "Research Gate",
  },
  {
    id: "po-health",
    number: "09",
    name: "Po-Health",
    subtitle: "AI-Assisted Drug Retrieval System",
    description:
      "Healthcare SaaS showcasing description-based vector search for drug retrieval and patient management. Demonstrates PomaiDB in a real clinical workflow context.",
    tags: ["Healthcare SaaS", "Vector Search", "Clinical Stats"],
    links: [
      { label: "Case Study", href: "/projects/po-health", primary: true },
      { label: "Demo Video", href: "https://youtu.be/-3J2Cwv7lno?si=8-klZDhR6MikEBNN" },
    ],
    markerLabel: "Archive Stone",
  },
  {
    id: "research",
    number: "10",
    name: "Research",
    subtitle: "Papers, Algorithms & Experiments",
    description:
      "Academic publications in data mining, privacy-preserving computation (VIFP shape-hiding trees), and high-utility pattern recognition. Peer-reviewed and conference submitted.",
    tags: ["Academia", "Algorithms", "Privacy"],
    links: [
      { label: "Browse Papers", href: "/research", primary: true },
    ],
    markerLabel: "Research Gate",
  },
  {
    id: "writing",
    number: "11",
    name: "Writing",
    subtitle: "Blog, Notes & Technical Essays",
    description:
      "Engineering notes, system design deep-dives, and research commentary. Written for practitioners who build real systems and want the reasoning behind the decisions.",
    tags: ["Blog", "Essays", "Engineering"],
    links: [
      { label: "Go to Blog", href: "/blog", primary: true },
    ],
    markerLabel: "Archive Stone",
  },
  {
    id: "contact",
    number: "∞",
    name: "Contact",
    subtitle: "End of the Path",
    description:
      "Reach me on GitHub, read my CV, or send an email. Open to research collaborations, systems consulting, and interesting problems that push the boundaries of local-first AI.",
    tags: ["GitHub", "Open Source", "Collaboration"],
    links: [
      { label: "GitHub", href: "https://github.com/pomagrenate", primary: true },
      { label: "Research", href: "/research" },
    ],
    markerLabel: "Final Gate",
  },
];
