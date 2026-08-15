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
        category: "Low-Level & Storage Systems",
        description: "System libraries, allocators, and specialized database engines focusing on resource predictability and memory bounds.",
        projects: [
            {
                title: "PomaiDB",
                repo: "pomagrenate/pomaidb",
                github: "https://github.com/pomagrenate/pomaidb",
                description: "The predictable edge-native database for multimodal AI memory. Embedded, single-threaded, and offline-first with memory-mapped structures.",
                tags: ["C++20", "LSM Tree", "Vector Indexing"],
                details: "/docs/pomaidb"
            },
            {
                title: "Palloc",
                repo: "pomagrenate/palloc",
                github: "https://github.com/pomagrenate/palloc",
                description: "A hardware-aware DRAM bank partitioning memory allocator designed to protect edge systems from OOM failures and ensure strict performance isolation.",
                tags: ["C / Rust", "Memory Allocation", "Kernel"],
            },
            {
                title: "Ice Age",
                repo: "pomagrenate/iceage",
                github: "https://github.com/pomagrenate/iceage",
                description: "Cold storage and index archiving system optimized for flash wear-aware databases, serializing old vector embeddings dynamically.",
                tags: ["Go", "Serialization", "AI Agent Tool"],
                details: "/docs/iceage"
            },
            {
                title: "PomaiCache",
                repo: "pomagrenate/pomaicache",
                github: "https://github.com/pomagrenate/pomaicache",
                description: "Semantic cache layer optimized for LLM prompting to reduce redundant network and GPU cycles on repetitive tasks.",
                tags: ["C++", "Semantic Caching", "Bitmap Indexes"],
            }
        ]
    },
    {
        category: "Data Mining & Parsing",
        description: "C++ pattern mining algorithms and high-throughput lexical scanners.",
        projects: [
            {
                title: "dm",
                repo: "oh-mah-c/dm",
                github: "https://github.com/oh-mah-c/dm",
                description: "High-performance C++ Data Mining library implementing CHUO-Miner, MFHOI-Miner, HUPP-Miner, and oblivious shape-hiding tree-mining (VIFP).",
                tags: ["C++20", "Pattern Mining", "Oblivious Algorithms"],
            },
            {
                title: "SyntaxVoid",
                repo: "pomagrenate/syntaxvoid",
                github: "https://github.com/pomagrenate/syntaxvoid",
                description: "A low-level C99 lexical analysis library featuring the Flat-Array Robin-Hood Offset Tokenizer (FARO-Tokenizer) for zero-dependency parsing.",
                tags: ["C99", "Tokenization", "Robin Hood Hashing"],
            },
            {
                title: "PomaiSearch",
                repo: "pomagrenate/pomaisearch",
                github: "https://github.com/pomagrenate/pomaisearch",
                description: "Hybrid keyword and semantic query search engine using vector membranes and posting list structures.",
                tags: ["C++", "Information Retrieval", "Membrane Index"],
            }
        ]
    },
    {
        category: "AI Agents & RAG Frameworks",
        description: "Orchestration engines, context compressors, and autonomous agent loops.",
        projects: [
            {
                title: "Cheeserag",
                repo: "pomagrenate/cheeserag",
                github: "https://github.com/pomagrenate/cheeserag",
                description: "Local-first Retrieval-Augmented Generation ecosystem coordinating C++ inference, embedded vectors, and Go autonomous cores.",
                tags: ["Go", "RAG Pipeline", "Local AI"],
                details: "/projects/cheeserag"
            },
            {
                title: "Cheesebrain",
                repo: "pomagrenate/cheesebrain",
                github: "https://github.com/pomagrenate/cheesebrain",
                description: "The cognitive execution framework and local LLM agent execution loop for the Cheeserag autonomous cluster.",
                tags: ["C++", "Agent Loop", "ReAct Framework"],
            },
            {
                title: "ContextSqueezer",
                repo: "pomagrenate/contextsqueezer",
                github: "https://github.com/pomagrenate/contextsqueezer",
                description: "Utility aimed at optimizing token consumption for AI agents by identifying and compressing redundant context chunks.",
                tags: ["Python", "Prompt Compression", "NLP"],
            },
            {
                title: "ZenithSearch",
                repo: "pomagrenate/ZenithSearch",
                github: "https://github.com/pomagrenate/ZenithSearch",
                description: "AI-assisted semantic search engine combining hybrid sparse-dense representation and neural query expanders.",
                tags: ["Python / Go", "Semantic Search", "Neural IR"],
            }
        ]
    },
    {
        category: "Applications & SaaS Projects",
        description: "Operational prototypes and vertical solutions using embedded AI backends.",
        projects: [
            {
                title: "Fixago Platform",
                live: "https://www.fixago.vn",
                description: "Technician Booking Platform featuring AI Integration for matching service professionals with customer requests efficiently.",
                tags: ["Marketplace", "AI Integration", "Booking"],
            },
            {
                title: "Po-Health",
                repo: "pomagrenate/po-health",
                github: "https://github.com/pomagrenate/po-health",
                description: "AI-assisted drug retrieval and patient management system showcasing description-based vector lookup.",
                tags: ["Healthcare SaaS", "Vector Search", "Clinical Stats"],
                demo: "https://youtu.be/-3J2Cwv7lno?si=8-klZDhR6MikEBNN"
            },
            {
                title: "PomaiEm HR System",
                repo: "pomagrenate/pomaiem-hr-system",
                github: "https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration.",
                description: "Multi-workspace HR operations SaaS with embedded agent workflows for automated tasking, shifts, and wage computing.",
                tags: ["HR SaaS", "Task Automation", "SaaS Tenant Architecture"],
                demo: "https://youtu.be/0ujbOGHRLHg?si=aRrWZYA2nXiCNBKl"
            },
            {
                title: "Esolution Landing Page",
                live: "https://www.esolutions.vn",
                description: "A landing page for showcasing the Esolution projects with admin dashboard to manage project listings, categories, and details.",
                tags: ["Landing Page", "Admin Dashboard", "Project Showcase"],
            }
        ]
    },
    {
        category: "Go Microservices & Frameworks",
        description: "Microservice frameworks and libraries for building scalable distributed systems in Go.",
        projects: [
            {
                title: "GoX Framework",
                repo: "pomagrenate/gox",
                github: "https://github.com/pomagrenate/gox",
                description: "A framework for building microservices in Go, with a focus on simplicity and observability.",
                tags: ["Go", "Microservices", "Framework"],
                details: "/docs/gox"
            }
        ]
    },
    {
        category: "Interactive Apps & Utilities",
        description: "Interactive visualizers, games, and web-based utilities showcasing Pomai technologies.",
        projects: [
            {
                title: "Pomai Diagram App",
                repo: "pomagrenate/pomai-diagram-app",
                live: "https://pomai-app-hub-alpha.vercel.app/",
                description: "A desktop-native visual flowchart and diagramming application built with React Flow and Tauri.",
                tags: ["React Flow", "Tauri", "Diagrams"],
            },
            {
                title: "Pomai Model Inference Visualizer",
                repo: "pomagrenate/pomai-model-inference-visualize",
                live: "https://pomai-app-hub-alpha.vercel.app/",
                description: "A desktop utility to visualize ONNX model graphs and monitor inference execution using React Flow and ONNX Runtime Web.",
                tags: ["ONNX", "Tauri", "Visualization"],
            },
            {
                title: "Bento Sort",
                repo: "pomagrenate/bento-sort",
                live: "https://pomai-app-hub-alpha.vercel.app/",
                description: "An interactive, procedurally generated logic puzzle game focused on spatial grouping logic and framer-motion animations.",
                tags: ["React", "Framer Motion", "Procedural Generation"],
            },
            {
                title: "Perfect Split",
                repo: "pomagrenate/perfect-split",
                live: "https://pomai-app-hub-alpha.vercel.app/",
                description: "A physics-based 2D slicing game using Matter.js and PolyboolJS. Tests spatial reasoning with procedurally generated concave polygons.",
                tags: ["Matter.js", "Computational Geometry", "Physics Engine"],
            }
        ]
    }
];