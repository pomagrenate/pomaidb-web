# PomaiDB Web

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

**The modern web interface for PomaiDB: The predictable edge-native database for multimodal AI memory.**

PomaiDB Web is a fast, responsive, and beautifully designed web application built to seamlessly interface with PomaiDB instances. Developed with **Next.js 16**, **React 19**, and **Tailwind CSS v4**, this project provides a robust frontend for managing your edge-native databases, visualizing multimodal AI memories (such as vectors, graph links, and RAG contexts), and monitoring system health.

---

## 🚀 Key Features

- **Database Visualization**: Explore and manage PomaiDB's typed membranes (`kVector`, `kRag`, `kGraph`, `kText`, etc.) through an intuitive UI.
- **RAG Pipeline Interface**: Ingest, search, and visualize document chunks and Context-Squeezer data seamlessly from your browser.
- **Edge Metrics Dashboard**: Monitor real-time memory usage, ingestion throughput, palloc allocations, and hardware wear-aware maintenance stats.
- **Modern Tech Stack**: Powered by the Next.js App Router for optimal performance, server-side rendering, and seamless client-side navigation.
- **Responsive Design**: Fully responsive styling powered by advanced Tailwind CSS utility classes, perfectly optimized for both desktop and mobile views.

---

## 🛠️ Technology Stack

PomaiDB Web is built on a modern, high-performance web foundation:

- **Framework**: [Next.js](https://nextjs.org) (v16.2.1) using the modern App Directory (`/app`) routing paradigm.
- **UI Library**: [React](https://react.dev) (v19.2.4)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (v4) tightly integrated with PostCSS.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust static typing and excellent developer experience.
- **Linting**: Pre-configured with ESLint via `eslint-config-next` for code quality and consistency.

---

## ⚙️ Getting Started

### Prerequisites

To get started with PomaiDB Web, you must have the following installed on your machine:
- **Node.js** (v20 or higher recommended)
- A package manager of your choice (`npm`, `yarn`, `pnpm`, or `bun`)
- A running instance of [PomaiDB](https://github.com/pomagrenate/pomaidb) exposing its embedded HTTP endpoints (Phase 3 functionality) on the network.

### Installation

1. Clone the repository and navigate into the directory:
   ```bash
   git clone https://github.com/pomagrenate/pomaidb-web.git
   cd pomaidb-web
   ```

2. Install the necessary project dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000). The page will auto-update as you edit files in the `app/` and `components/` directories.

---

## 📂 Project Structure

- `app/`: Next.js App Router pages, metadata, layouts, and API routes.
- `components/`: Reusable React application blocks and interface components.
- `public/`: Static assets such as images and fonts (including Vercel's optimized Geist font family).
- `next.config.ts`: Next.js specific configuration options.
- `eslint.config.mjs` & `tsconfig.json`: Tooling configurations ensuring code style and type safety.

---

## 🤝 Contributing

We welcome community feedback and contributions! Since PomaiDB Web is designed to be the companion dashboard for PomaiDB, please align your UI/UX suggestions with our **predictable edge-native** philosophy. 

Feel free to open an issue or submit a pull request for optimizations, visual improvements, or new membrane visualization features.

---

## 📜 License

PomaiDB Web is released under the **MIT License**. See the [LICENSE](LICENSE) file for more details.
