---
title: "Pomai Ecosystem: The Real Challenges of Breaking Down a Monolith to Microservices`"
slug: "pthe-real-challenges-from-breaking-monolith-to-microservice"
date: "2026-07-17"
author: "Quan Van"
excerpt: "Pomai Ecosystem did not begin as a microservices platform. Like many personal projects, it started with a single frontend application connected to a backend organized as a multi-module monolith. Every feature lived inside the same repository and shared the same Firebase Firestore database. Modules communicated through direct imports or internal REST endpoints while remaining deployed as one application."
tags: ["Pomai Ecosystem", "Pomai Lem", "Pomai Connect", "Pomai Draw", "Pomai AI", "Pomai Planner", "Pomai Chat", "Pomai Team", "Pomai Workspace", "Pomai Task", "Pomai Goal"]
category: "System Design"
---

# Pomai Ecosystem: An Architectural Evolution

Pomai Ecosystem did not begin as a distributed system, nor was it originally designed around AI agents or microservices. Like many side projects that evolved into larger platforms, it started as a multi-module monolith, backed by Firebase.

This repository serves as a technical showcase of how a personal project evolved into an enterprise-ready ecosystem through deliberate architectural decisions.

---

## 🚀 The Architectural Journey

### 1. From Monolith to Macro-services

Initially, the ecosystem thrived as a monolith due to rapid deployment velocity. However, as the product scaled, the "multi-module" structure became a bottleneck. I transitioned to a **Macro-services architecture**, consolidating highly coupled domains (like Task & Goal, HR & Payroll) to reduce network overhead, while keeping independent domains (Auth, Chat, AI Engine) as autonomous services.

### 2. The Migration: NoSQL to PostgreSQL

The most grueling challenge was migrating from Firestore to PostgreSQL. To maintain development velocity, I adopted **Prisma ORM**, which bridged the gap between Firestore’s rapid-development feel and the robustness of a relational database.

### 3. Solving the "Port-Hell" with Kong Gateway

As the number of services grew, managing ports became impossible. I transitioned from a custom-coded gateway to **Kong Gateway**, utilizing its native JWT/OAuth2 plugins, Rate Limiting, and traffic management to secure the ecosystem. To ensure **High Availability (HA)**, I implemented **Nginx as a Round-Robin Load Balancer** in front of a Kong cluster to prevent a single point of failure.

### 4. Reliable Distributed Data

To solve the "Dual-write problem" across microservices, I implemented the **Transactional Outbox Pattern** combined with **Apache Kafka**. This ensured eventual consistency, where every state change is captured reliably and consumed by downstream services (e.g., RAG Engine, Activity Logs) without breaking system integrity.

---

## 🛠 Tech Stack Highlights

| Domain | Core Technology |
| --- | --- |
| **Backend** | Node.js, Prisma ORM, Strategy/Factory Patterns |
| **Data Layer** | PostgreSQL, Milvus, Elasticsearch |
| **Messaging** | Apache Kafka (Event-Driven) |
| **Gateway** | Kong Gateway + Nginx (Load Balancing) |
| **DevOps** | Docker, Portainer, Jenkins, Gitea |
| **Monitoring** | Prometheus, Grafana, cAdvisor |
| **AI Engine** | Llama.cpp (CPU-only RAG) |

---

## 🧠 The "Monitoring" Leap: AI-Powered RCA

When logs hit the "million" mark, human inspection became impossible. I built an autonomous **RAG Logging Pipeline** that processes streams via **Apache Flink**, generates embeddings on the CPU using **llama.cpp**, and stores them in **Qdrant**. This allows me to perform **Semantic Root Cause Analysis** by simply asking the system: *"Why did the payment service spike in latency?"*

---

## 📂 Project Structure

To keep the monolith clean before the microservices split, I implemented strict domain boundaries using the **Strategy Pattern**.

```bash
pomai-ecosystem/
├── gateway/            # Kong/Nginx HA cluster config
├── services/
│   ├── task_service/       # Core domain (Strategy + Factory)
│   ├── ai_engine/          # CPU-only RAG & Vector search
│   └── ...
├── strategies/             # 🚀 Core Design Pattern implementation
│   ├── base.js             # The abstract contract
│   ├── factory.js          # The Orchestrator
│   ├── enterprise.js       # Enterprise implementation
│   └── small.js            # Small-business implementation
├── jenkins/                # CI/CD Pipeline as Code
└── README.md

```

---

## 📖 Deep Dive

This repository provides the blueprints for the architecture. For the full story behind the decisions—the "Why"—and the lessons learned from refactoring through months of development, please read my full case study blog:

**[🔗 Read: Pomai Ecosystem: From a Multi-Module Monolith to a Microservices Architecture](https://pomaidb-web.vercel.app/blog/pomaieco-from-multimodules-monolith-to-microservice-and-why)**

---

*“Good architecture is not about choosing the most advanced technology. It is about allowing the architecture to evolve naturally as the complexity of the product evolves.”*