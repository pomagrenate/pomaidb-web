export interface ProjectItem {
  title: string;
  repo?: string;
  github?: string;
  live?: string;
  description: string;
  tags: string[];
  details?: string;
  demo?: string;
}

export interface ProjectGroup {
  category: string;
  description: string;
  projects: ProjectItem[];
}

export const PROJECT_GROUPS: ProjectGroup[] = [
  {
    category: "Side Projects",
    description: "Privacy-first local AI tools, C++ storage engines, memory allocators, Rust IDE tooling, and developer utilities.",
    projects: [
      {
        title: "cheeserag",
        repo: "pomagrenate/cheeserag",
        github: "https://github.com/pomagrenate/cheeserag",
        description: "Privacy-first, fully offline local RAG workspace & NotebookLM alternative. Powered by embedded C++ vector DB (PomaiDB), local GGUF inference, and programmatic citations on edge hardware.",
        tags: ["Go", "C++", "Local RAG", "Edge AI"],
        details: "/projects/cheeserag",
      },
      {
        title: "cheesepath",
        repo: "pomagrenate/cheesepath",
        github: "https://github.com/pomagrenate/cheesepath",
        description: "A lightweight, zero-dependency local AI agent framework in pure Go. Turn any OpenAI-compatible local LLM into an autonomous agent with LCEL-style pipelines.",
        tags: ["Go", "Local AI", "Agent Framework"],
      },
      {
        title: "pomaidb",
        repo: "pomagrenate/pomaidb",
        github: "https://github.com/pomagrenate/pomaidb",
        description: "🧠 Predictable, embedded multimodal vector database & offline RAG engine for Edge AI (ARM64 / Zero-OOM). Built in C++20.",
        tags: ["C++20", "Vector DB", "Edge AI"],
      },
      {
        title: "rust-studio",
        repo: "pomagrenate/rust-studio",
        github: "https://github.com/pomagrenate/rust-studio",
        description: "A fast, hackable Rust IDE powered by Tauri & rust-analyzer. Instant compiler diagnostics, AST refactoring, Cargo tools, and zero-AI deterministic fixes.",
        tags: ["Rust", "Tauri", "IDE", "rust-analyzer"],
      },
      {
        title: "ice_age",
        repo: "pomagrenate/ice_age",
        github: "https://github.com/pomagrenate/ice_age",
        description: "⚡ Universal IDE plugin & proxy that cuts LLM token consumption by up to 70% using deterministic AST pruning & context compression. Written in Go.",
        tags: ["Go", "AST Pruning", "IDE Plugin"],
      },
      {
        title: "palloc",
        repo: "pomagrenate/palloc",
        github: "https://github.com/pomagrenate/palloc",
        description: "An ultra-fast, lightweight, and thread-safe general-purpose memory allocator. Drop-in malloc replacement built for high throughput and low latency.",
        tags: ["C", "Memory Allocator", "Low Latency"],
      },
      {
        title: "pomai-diagram-app",
        repo: "pomagrenate/pomai-diagram-app",
        github: "https://github.com/pomagrenate/pomai-diagram-app",
        description: "Design ERD & UML diagrams and instantly generate production-ready SQL schemas and boilerplate CRUD APIs. Fast, visual, developer-first tool.",
        tags: ["TypeScript", "React Flow", "SQL Generator"],
      },
      {
        title: "pomai-model-inference-visualize",
        repo: "pomagrenate/pomai-model-inference-visualize",
        github: "https://github.com/pomagrenate/pomai-model-inference-visualize",
        description: "Visualize neural network architectures and track layer-by-layer inference computations in real time. Native, high-performance desktop model visualizer.",
        tags: ["ONNX", "Deep Learning", "Visualization"],
      },
      {
        title: "morsel",
        repo: "pomagrenate/morsel",
        github: "https://github.com/pomagrenate/morsel",
        description: "A blazing-fast, encrypted, local-first clipboard manager.",
        tags: ["Rust", "Local-First", "Clipboard"],
      },
      {
        title: "vexona",
        repo: "pomagrenate/vexona",
        github: "https://github.com/pomagrenate/vexona",
        description: "A high-performance, deterministic 2D-to-3D spatial video reconstruction engine written in pure Rust. No AI, zero GPU dependency, powered by pure projective geometry.",
        tags: ["Rust", "3D Reconstruction", "Geometry"],
      },
      {
        title: "fetchr",
        repo: "pomagrenate/fetchr",
        github: "https://github.com/pomagrenate/fetchr",
        description: "A blazing-fast, adaptive download engine built in Rust. Features dynamic parallel range requests, resume recovery, low memory streaming, and zero fluff.",
        tags: ["Rust", "Networking", "Download Engine"],
      },
      {
        title: "gox",
        repo: "pomagrenate/gox",
        github: "https://github.com/pomagrenate/gox",
        description: "The all-in-one workflow manager for Go monorepos. Fast scaffolding, multi-process dev runner with unified logs, workspace diagnostics, and multi-platform release builder.",
        tags: ["Go", "Monorepo", "DevTools"],
      },
      {
        title: "pomaiwhiteboard",
        repo: "pomagrenate/pomaiwhiteboard",
        github: "https://github.com/pomagrenate/pomaiwhiteboard",
        description: "Sketch hand-drawn diagrams effortlessly on an infinite collaborative whiteboard. Perfect for brainstorming, system design, and live team collaboration.",
        tags: ["TypeScript", "Canvas", "Whiteboard"],
      },
      {
        title: "OPT-HQ-Net",
        repo: "pomagrenate/OPT-HQ-Net",
        github: "https://github.com/pomagrenate/OPT-HQ-Net",
        description: "Oriented-Prompted Topological Network (OPT-HQ Net) for High-Precision Solar Filament Instance Segmentation on the MAGFiLO Benchmark.",
        tags: ["PyTorch", "Computer Vision", "Instance Segmentation", "Kaggle"],
      },
      {
        title: "biohub-cell-tracking",
        repo: "pomagrenate/biohub-cell-tracking",
        github: "https://github.com/pomagrenate/biohub-cell-tracking",
        description: "SGT-DFO: Anisotropic Spatiotemporal Graph Transformer with Differentiable Graph-Flow Optimization for 3D+time cell tracking, mitosis lineage reconstruction, and light-sheet microscopy segmentation (CZ Biohub Challenge).",
        tags: ["PyTorch", "Graph Transformer", "3D Cell Tracking", "Microscopy"],
      },
      {
        title: "kaggriculture",
        repo: "pomagrenate/kaggriculture",
        github: "https://github.com/pomagrenate/kaggriculture",
        description: "Model-Based Autonomous Decision & Receding-Horizon Control System for Kaggle's Kaggriculture Simulation Competition.",
        tags: ["Kaggle", "Agriculture", "Computer Vision"],
      },
      {
        title: "dsg-ewm-arc-agi-3-agent",
        repo: "pomagrenate/dsg-ewm-arc-agi-3-agent",
        github: "https://github.com/pomagrenate/dsg-ewm-arc-agi-3-agent",
        description: "DSG-EWM: Dynamic Neuro-Symbolic Graph-Guided Executable World Model Agent for ARC Prize 2026 (ARC-AGI-3)",
        tags: ["Kaggle", "Agriculture", "Computer Vision"],
      },
      {
        title: "smartphone-addiction-prediction",
        repo: "pomagrenate/smartphone-addiction-prediction",
        github: "https://github.com/pomagrenate/smartphone-addiction-prediction",
        description: "Predicting Smartphone Addiction - Kaggle Playground Series s6e8 | HyTab-Addict Hybrid GBDT & PyTorch TabM Deep Ensemble Framework",
        tags: ["Kaggle", "Machine Learning", "Computer Vision"],
      },
      {
        title: "e4m2025-solar-tracking-dataset",
        repo: "pomagrenate/e4m2025-solar-tracking-dataset",
        github: "https://github.com/pomagrenate/e4m2025-solar-tracking-dataset",
        description: "E4M 2025: The International Solar Tracking Dataset Challenge",
        tags: ["Kaggle", "Agriculture", "Computer Vision"],
      }
    ],
  },
  {
    category: "Products Projects",
    description: "Production platforms, enterprise microservices architectures, and customer-facing commercial products.",
    projects: [
      {
        title: "Fixago",
        live: "https://www.fixago.vn/",
        description: "Book fast & reliable home repair services in Vietnam with Fixago. From AC & appliance repairs to plumbing & maintenance, enjoy 24/7 AI-powered instant booking.",
        tags: ["Marketplace", "24/7 AI Booking", "Vietnam"],
      },
      {
        title: "Pomai Ecosystem",
        repo: "pomagrenate/Pomai-Ecosystem",
        github: "https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration.",
        description: "Pomai Ecosystem: A modular enterprise management platform built on microservices architecture. Featuring Pomaiem (custom workflows), Pomai Connect (B2B network), Pomai Storage (secure data lake), and centralized AI-RAG intelligence.",
        tags: ["Microservices", "Enterprise SaaS", "AI-RAG"],
      },
      {
        title: "Esolutions",
        live: "https://www.esolutions.vn/",
        description: "Esolutions - Delivering smart, efficient, and comprehensive solutions for modern homes and buildings. Discover sustainable living and facility enhancements today.",
        tags: ["Smart Buildings", "Facility Management", "PropTech"],
      },
    ],
  },
  {
    category: "Build for fun & fun to build",
    description: "Creative web experiments, interactive mini-games, and fun projects built for pure enjoyment.",
    projects: [
      {
        title: "Perfect Split",
        live: "https://perfect-split.vercel.app/",
        description: "A fun web-based geometry & physics game where players slice random objects into two perfectly balanced 50/50 halves.",
        tags: ["Web Game", "Geometry", "Physics"],
      },
      {
        title: "Bento Sort",
        live: "https://bento-sort.vercel.app/",
        description: "A cozy puzzle game where players organize and arrange delicious dishes into perfectly fitted bento box layouts.",
        tags: ["Web Game", "Puzzle", "Bento Grid"],
      },
    ],
  },
];