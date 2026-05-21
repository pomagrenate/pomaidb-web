import fs from "fs";
import path from "path";

const researchDirectory = path.join(process.cwd(), "content/research");

type ResearchMetadata = {
  title: string;
  authors: string;
  date: string;
  abstract: string;
  keywords: string[];
};

export interface ResearchItem extends ResearchMetadata {
  slug: string;
  fileName: string;
  href: string;
  pages?: number;
  fileSize: string;
}

const researchMetadata: Record<string, ResearchMetadata & { pages?: number }> = {
  mfhoi: {
    title: "MFHOI-Miner: An Efficient Method for Mining Maximal Frequent High-Occupancy Itemsets",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 34,
    abstract:
      "This paper introduces Maximal Frequent High-Occupancy Itemsets and MFHOI-Miner, an exact vertical bitset-based depth-first algorithm for discovering concise, occupancy-aware dense frequent patterns.",
    keywords: [
      "Frequent itemset mining",
      "High-occupancy itemsets",
      "Maximal frequent itemsets",
      "Pattern mining",
    ],
  },
  chuim: {
    title: "CHUO-Miner: Closed High-Utility Occupancy Itemset Mining with Lossless Hybrid Signatures",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 7,
    abstract:
      "High-utility itemset mining discovers profitable patterns, closed high-utility itemset mining compresses redundant high-utility outputs, and high-occupancy itemset mining captures patterns that dominate the transactions in which they appear. These objectives have usually been studied separately. This paper studies Closed High-Utility Occupancy Itemset Mining (CHUOIM), where a valid pattern must simultaneously satisfy minimum support, minimum absolute utility, minimum classical average occupancy, and support-closure. We introduce CHUO-Miner, a vertical COU-list algorithm that combines exact utility accounting, reciprocal transaction-length occupancy accounting, remaining-utility pruning, an occupancy-envelope upper bound, backward closure pruning, forward closure jumping, and lossless CHUO-signatures. Experiments on Foodmart, Liquor, and Chainstore show that CHUO-Miner produces compact closed hybrid representatives across diverse thresholds. Compared with EFIM, CHUI-Miner, and EFIM-Closed, it reduces output size by orders of magnitude and avoids timeouts on Chainstore. Compared with MHOUI, it is slower but solves a stricter problem by returning support-closed representatives with reconstructable support-equivalent subpatterns.",
    keywords: [
      "High-utility itemset mining",
      "Closed itemset mining",
      "Occupancy mining",
      "Utility occupancy",
      "CHUI",
      "HUIM",
      "Compact pattern representation",
    ],
  },
  data_mining_2025_2026_survey_q1: {
    title: "Global Breakthroughs in Data Mining During 2025–2026: A Survey of Pattern Mining, Graph Mining, Stream Mining, and LLM-Centric Knowledge Discovery",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 13,
    abstract:
      "Data mining in 2025–2026 is no longer organized around a simple divide between symbolic pattern discovery and predictive learning. The field is being reorganized by four convergent shifts: foundation models for structured data, neuro-symbolic and graph–LLM hybrids, privacy-first localized mining, and systems-aware knowledge discovery inside prompt, retrieval, cache, and inference workloads. This survey synthesizes the recent landscape across four technical pillars: advanced pattern and association-rule mining, scalable graph and network mining, stream and time-series mining, and knowledge discovery through large language models. We analyze methodological breakthroughs, data structures, computational primitives, scalability bottlenecks, and open research gaps. The paper argues that the defining transition of 2025–2026 is the movement from mining passive databases toward mining dynamic structured state, including graphs, time-evolving streams, prompt traces, retrieval caches, encrypted intermediates, and local edge-resident workloads.",
    keywords: [
      "Data mining survey",
      "High-utility itemset mining",
      "Graph mining",
      "Time-series mining",
      "Stream mining",
      "Large language models",
      "Retrieval-augmented generation",
      "Prompt mining",
      "Privacy-preserving data mining",
      "Foundation models",
    ],
  },
  faro_tokenizer_fixed: {
    title: "FARO-Tokenizer: A Flat-Array Robin-Hood Offset Tokenizer for Zero-Dependency High-Performance Text Mining Pipelines",
    authors: "Quan Van",
    date: "May 19, 2026",
    pages: 20,
    abstract:
      "Massive text mining pipelines frequently spend substantial time transforming raw text into integer identifiers before downstream algorithms such as Apriori, FP-Growth, Eclat, or high-utility itemset mining can operate. Existing tokenization systems often depend on heavyweight runtime libraries, pointer-rich dictionary structures, repeated memory allocation, or intermediate text serialization. These design choices are poorly aligned with low-level data mining frameworks that require compact integer transaction streams. This paper introduces FARO-Tokenizer, a Flat-Array Robin-Hood Offset Tokenizer designed for pure ISO C99-style implementations and high-throughput memory-mapped text streams. FARO-Tokenizer performs one sequential pass over an input byte stream, applies deterministic boundary normalization, computes streaming token hashes, assigns auto-incrementing integer identifiers, and emits integer tokens directly into a downstream transaction builder. Its central data structure is an inserts-only flat hash table consisting of fixed-width slots and an append-only lexeme arena. The hash table uses Robin Hood open addressing with compact fingerprints and displacement metadata to reduce probe-length variance and improve unsuccessful lookup termination. The tokenizer is UTF-8 safe while remaining zero-dependency: ASCII text is processed through a fast canonicalization path, while valid multibyte UTF-8 sequences are preserved without corruption. We formalize the tokenizer model, slot layout, hashing equations, probe-distance invariant, early-stop theorem, memory model, stream tokenization procedure, multilingual boundary policy, synthetic experimental methodology, and direct integration contract with transaction-based data mining algorithms. The resulting architecture provides a practical systems bridge between raw text streams and integer-only pattern mining frameworks.",
    keywords: [
      "Tokenization",
      "Text mining",
      "Hash table",
      "Robin Hood hashing",
      "Memory-mapped files",
      "C99",
      "UTF-8",
      "Itemset mining",
      "FP-Growth",
      "Apriori",
      "SPMF",
    ],
  },
  hupp: {
    title: "HUPP-Miner: High-Utility Prompt Pattern Mining for Cost-Aware and Accuracy-Preserving Generative AI Systems",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 22,
    abstract:
      "Large language model systems increasingly depend on prompt compression, semantic caching, retrieval-augmented generation, and prompt optimization to reduce token cost, latency, and context-window pressure while preserving output quality. Existing prompt-compression methods optimize individual prompts; semantic caching systems reuse previous computation; and prompt-optimization methods search over full prompt strings or prompt programs. However, none of these paradigms directly mine recurring semantic prompt structures whose occurrence predicts a favorable cost–accuracy trade-off across historical prompt logs. This paper introduces High-Utility Prompt Pattern Mining (HUPPM), a new data mining problem connecting high-utility itemset mining and generative AI infrastructure. In HUPPM, prompt logs are treated as a transaction database, semantic concepts are treated as items, and the utility of a pattern is defined by the best achievable optimization gain among candidate prompt rewrites that preserve that pattern's semantics. Unlike classical high-utility itemset mining, where utility is additive and static, prompt-pattern utility is contextual, non-additive, multi-objective, and model-dependent. We formalize prompt transaction databases, semantic itemsets, candidate optimizer families, semantic specificity, pattern-conditioned gain, and high-utility prompt patterns. We prove that classical transaction-weighted utilization cannot be directly transferred to HUPPM and introduce two safe pruning bounds: Prompt Transaction-Weighted Opportunity (PTWO), which upper-bounds the utility of all descendants, and Accuracy-Aware Upper Bound (AAUB), which upper-bounds the achievable alignment of all descendants. We then propose HUPP-Miner, a vertical array-based algorithm using compressed concept bitmaps, preserve-mask tables, suffix-specificity arrays, and HUPP-lists. Finally, we describe how mined High-Utility Prompt Templates can be deployed as an on-premise real-time prompt compressor and optimizer.",
    keywords: [
      "High-utility itemset mining",
      "Prompt compression",
      "Prompt optimization",
      "Retrieval-augmented generation",
      "Semantic caching",
      "Large language models",
      "Utility-list mining",
      "Cost-aware inference",
    ],
  },
  mhoui: {
    title: "MHOUI-Miner: An Exact Method for Mining Maximal High-Occupancy Utility Itemsets",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 29,
    abstract:
      "Frequent itemset mining discovers itemsets that occur frequently, high-occupancy itemset mining discovers itemsets that cover a large fraction of their supporting transactions, and high-utility itemset mining discovers itemsets with high economic or semantic value. Existing approaches usually optimize these objectives separately, or combine utility with utility-occupancy, where occupancy is defined as the ratio between itemset utility and transaction utility. This paper proposes a new itemset pattern type called the Maximal High-Occupancy Utility Itemset (MHOUI). In contrast to utility-occupancy mining, MHOUI uses classical transaction occupancy, defined as |X|/|T |, and combines it with total utility u(X) as an independent constraint. An itemset is first considered a High-Occupancy Utility Itemset (HOUI) if it satisfies minimum support, minimum average classical occupancy, and minimum total utility. A weak MHOUI is a HOUI that is not Pareto-dominated by any strict HOUI superset with respect to average occupancy and total utility. A strong MHOUI further removes an itemset if a strict HOUI superset has equal or higher occupancy and equal or higher utility. We formalize the MHOUI problem, prove key theoretical properties, derive safe support, utility, and occupancy upper bounds, and propose MHOUI-Miner, an exact hybrid vertical algorithm using bitsets and Bitset-Occupancy-Utility lists. The proposed framework provides a compact, interpretable, and utility-aware representation of dense transaction patterns.",
    keywords: [
      "High-utility itemset mining",
      "High-occupancy itemset mining",
      "Maximal pattern mining",
      "Utility mining",
      "Pareto dominance",
      "Concise pattern representation",
      "Vertical bitset mining",
    ],
  },
  vifp: {
    title: "VIFP: Shape-Hiding Tree Mining on Encrypted Data via Virtual-Interval FP-Growth",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 22,
    abstract:
      "Privacy-preserving frequent itemset mining has been studied for more than two decades, mainly through secure candidate counting, horizontally or vertically partitioned protocols, outsourced encrypted support computation, and partial homomorphic outsourcing. However, existing methods do not fully solve the problem of executing tree-based frequent pattern mining, such as FP-Growth, directly over encrypted or secret-shared data without an online decryption-key holder. The core obstacle is structural: FP-Growth derives its efficiency from dynamic prefix trees, recursive conditional pattern bases, variable fan-out, pointer chasing, and data-dependent memory allocation, while fully homomorphic encryption (FHE) and secure multi-party computation (SMPC) are most expensive exactly under hidden branching, hidden memory access, and dynamic data structures. This paper introduces a new problem called shape-hiding keyless conditional prefix mining. The goal is to compute frequent itemsets, or an encrypted representation equivalent to FP-Growth output, while hiding not only the raw transactions but also the evolving tree shape, branch fan-out, conditional database sizes, active prefix identities, support values, and memory-access patterns. We then propose Virtual-Interval FP-Growth (VIFP), a new encrypted-tree mining framework that preserves FP-Growth semantics while replacing dynamic FP-tree nodes with static, fixed-width, intervalized array structures. VIFP uses three custom data structures: an Occurrence-Ordered Transaction Tape, a Header-Segmented Posting Array, and Projected Interval Descriptors. These structures turn encrypted pointer chasing into batched scans, stable partitions, and segmented histograms. The framework can be instantiated using additive secret sharing with oblivious sorting and DPF-assisted scatter/gather, or using packed FHE with SIMD support and programmable bootstrapping for threshold tests. We provide formal definitions, a leakage model, algorithmic procedures, correctness arguments, and theoretical complexity analysis showing why VIFP avoids the main bottleneck of direct encrypted FP-tree construction.",
    keywords: [
      "Privacy-preserving data mining",
      "Frequent itemset mining",
      "FP-Growth",
      "Secure multi-party computation",
      "Fully homomorphic encryption",
      "Encrypted data structures",
      "Shape-hiding computation",
      "Oblivious algorithms",
    ],
  },
  LAGA_self_contained_data_generator_q1: {
    title: "LAGA: A Self-Contained Synthetic Transaction Data Generator for Benchmarking Pattern Mining Algorithms",
    authors: "Quan Van",
    date: "May 19, 2026",
    pages: 28,
    abstract:
      "Reproducible benchmarking of pattern mining algorithms requires synthetic transaction databases with precisely controlled statistical properties. Existing generators either depend on external libraries, produce outputs that cannot be independently verified, or expose insufficient parameters to reproduce realistic transaction structures. This paper introduces LAGA, a self-contained, zero-dependency synthetic transaction data generator written in portable C99. LAGA uses a Linear Additive Generator Array to produce transaction databases whose length distributions, item frequency distributions, transaction utility distributions, item occupancy distributions, and temporal ordering can each be independently parameterized and verified. We provide a formal data model, generator equations, correctness theorems, and a benchmarking methodology for dense and sparse pattern mining algorithms.",
    keywords: [
      "Synthetic data generation",
      "Transaction database",
      "Benchmark",
      "Pattern mining",
      "C99",
      "Data generator",
    ],
  },
  aura_hoi_q1_paper: {
    title: "AURA-HOI: Adaptive Utility-Ranked Anytime Mining of High-Occupancy Itemsets",
    authors: "Quan Van",
    date: "May 20, 2026",
    pages: 26,
    abstract:
      "High-occupancy itemset mining discovers patterns that dominate the transactions they appear in, but existing algorithms require full database passes before returning any results. This paper introduces AURA-HOI, an anytime algorithm for high-occupancy itemset mining that produces a ranked stream of high-occupancy patterns sorted by decreasing average occupancy. AURA-HOI combines an adaptive utility-ranked traversal strategy with tight occupancy upper bounds to prioritize the most dominant patterns first, enabling early termination with quality guarantees. Experiments on benchmark datasets demonstrate that AURA-HOI recovers the top-k patterns significantly faster than exhaustive methods while maintaining exact correctness for complete enumeration.",
    keywords: [
      "High-occupancy itemset mining",
      "Anytime algorithms",
      "Adaptive mining",
      "Top-k pattern mining",
      "Itemset mining",
    ],
  },
  closed_hoi_q1_paper: {
    title: "Closed High-Occupancy Itemset Mining: Definitions, Algorithms, and Compact Representations",
    authors: "Quan Van",
    date: "May 20, 2026",
    pages: 24,
    abstract:
      "High-occupancy itemset mining produces patterns that cover a large fraction of each supporting transaction, but the output can be exponentially redundant. This paper formalizes Closed High-Occupancy Itemsets (CHOI), where an itemset is closed if no proper superset has identical support and equal or higher average occupancy. We prove the CHOI closure operator is well-defined, establish that CHOIs form a complete and lossless condensed representation, and design an efficient algorithm using vertical bitsets, a closure-checking operator, and early-termination pruning to enumerate CHOIs without redundancy.",
    keywords: [
      "Closed itemset mining",
      "High-occupancy itemset mining",
      "Condensed representation",
      "Lossless compression",
      "Vertical mining",
    ],
  },
  hiep: {
    title: "HIEP: High-Utility Itemset Mining with Episode Pattern Integration for Sequential Event Logs",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 30,
    abstract:
      "High-utility itemset mining and episode pattern mining have each been studied extensively, but their integration for sequential event logs with heterogeneous utility models has received limited attention. This paper introduces HIEP, a unified framework for High-utility Itemset-Episode Pattern mining that discovers recurring co-occurrence episodes in timestamped event sequences whose aggregate utility exceeds a user-defined threshold. HIEP uses a time-window projection model, a compound utility function integrating occurrence frequency, inter-event gap penalties, and per-item utility weights, and a projected episode database structure enabling efficient depth-first enumeration with tight upper bounds.",
    keywords: [
      "Episode mining",
      "High-utility itemset mining",
      "Sequential pattern mining",
      "Event logs",
      "Time-series mining",
    ],
  },
  hust: {
    title: "HUST: Hierarchical Utility-Sensitive Tree Mining for Multi-Level Pattern Discovery",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 27,
    abstract:
      "Hierarchical databases encode items at multiple levels of abstraction, where low-level items can be aggregated into higher-level taxonomic categories. High-utility itemset mining on flat databases ignores this structure. This paper introduces HUST, a Hierarchical Utility-Sensitive Tree mining algorithm that discovers high-utility patterns across multiple taxonomy levels simultaneously. HUST uses a compressed hierarchical utility-tree with cross-level utility propagation, a level-sensitive utility upper bound, and a top-down enumeration strategy that avoids redundant cross-level candidate generation.",
    keywords: [
      "Hierarchical itemset mining",
      "Multi-level pattern mining",
      "Taxonomy",
      "High-utility itemset mining",
      "Tree-based mining",
    ],
  },
  medm_gen_q1_paper: {
    title: "MEDM-Gen: Medical Event Data Mining with Generative Augmentation for Rare Pattern Discovery",
    authors: "Quan Van",
    date: "May 20, 2026",
    pages: 22,
    abstract:
      "Medical event databases are characterized by severe class imbalance, rare co-occurrence patterns, and heterogeneous utility semantics derived from clinical outcome data. Standard high-utility itemset mining algorithms fail on medical event logs because rare but clinically significant patterns fall below minimum support thresholds while frequent but clinically trivial patterns dominate the output. This paper introduces MEDM-Gen, a medical event data mining framework with generative augmentation that combines a conditional variational augmentation module for rare pattern synthesis with a utility-aware mining algorithm incorporating clinical significance weights. MEDM-Gen produces rare-pattern-aware high-utility itemsets validated against held-out clinical event datasets.",
    keywords: [
      "Medical data mining",
      "Rare pattern mining",
      "Generative augmentation",
      "High-utility itemset mining",
      "Clinical event logs",
      "Healthcare informatics",
    ],
  },
  sparc_hoi_anti_bitset_q1_spec: {
    title: "SPARC-HOI: Sparse Anti-Chain Bitset Mining for High-Occupancy Itemsets with Anti-Monotone Pruning",
    authors: "Quan Van",
    date: "May 21, 2026",
    pages: 25,
    abstract:
      "High-occupancy itemset mining with vertical bitset representations achieves high throughput on dense datasets but degrades on sparse databases where bitsets are large and mostly empty. This paper introduces SPARC-HOI, a sparse anti-chain bitset algorithm for high-occupancy itemset mining that switches between dense and sparse bitset representations based on occupancy density thresholds. SPARC-HOI incorporates an anti-chain pruning layer that eliminates dominated candidates before bitset intersection, a compressed sparse-row bitset layout for sparse transaction sets, and an adaptive representation selector that chooses the optimal bitset format per projected database. Experiments on nine real-world datasets spanning dense retail, sparse web-click, and mixed biomedical logs demonstrate consistent speed improvements over dense-only vertical HOI miners.",
    keywords: [
      "High-occupancy itemset mining",
      "Sparse bitset",
      "Anti-chain pruning",
      "Vertical mining",
      "Adaptive representation",
      "Pattern mining",
    ],
  },
};

export function getResearchItems(): ResearchItem[] {
  if (!fs.existsSync(researchDirectory)) {
    return [];
  }

  return fs
    .readdirSync(researchDirectory)
    .filter((fileName) => fileName.endsWith(".pdf"))
    .map((fileName) => {
      const slug = fileName.replace(/\.pdf$/, "");
      const metadata = researchMetadata[slug] ?? fallbackMetadata(slug);
      const fullPath = path.join(researchDirectory, fileName);
      const stats = fs.statSync(fullPath);

      return {
        slug,
        fileName,
        href: `/research/files/${slug}`,
        fileSize: formatFileSize(stats.size),
        ...metadata,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getResearchFilePath(slug: string) {
  if (!/^[a-z0-9_-]+$/i.test(slug)) {
    return null;
  }

  const fullPath = path.join(researchDirectory, `${slug}.pdf`);

  if (!fullPath.startsWith(researchDirectory) || !fs.existsSync(fullPath)) {
    return null;
  }

  return fullPath;
}

function fallbackMetadata(slug: string): ResearchMetadata {
  return {
    title: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    authors: "Quan Van",
    date: "Research",
    abstract: "Research paper available as a PDF.",
    keywords: ["Research"],
  };
}

function formatFileSize(bytes: number) {
  const megabytes = bytes / 1024 / 1024;
  return `${megabytes.toFixed(1)} MB`;
}
