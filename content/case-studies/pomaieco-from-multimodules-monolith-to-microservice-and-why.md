---
title: "Pomai Ecosystem - From a Multi-Module Monolith to a Microservices Architecture`"
slug: "pomaieco-from-multimodules-monolith-to-microservice-and-why"
series: "Pomai Ecosystem Architecture"
date: "2026-07-17"
author: "Quan Van"
excerpt: "Pomai Ecosystem did not begin as a microservices platform. Like many personal projects, it started with a single frontend application connected to a backend organized as a multi-module monolith. Every feature lived inside the same repository and shared the same Firebase Firestore database. Modules communicated through direct imports or internal REST endpoints while remaining deployed as one application."
tags: ["Pomai Ecosystem", "Pomai Lem", "Pomai Connect", "Pomai Draw", "Pomai AI", "Pomai Planner", "Pomai Chat", "Pomai Team", "Pomai Workspace", "Pomai Task", "Pomai Goal"]
category: "System Design"
repo: "https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration."
---

# When "Shipping Fast" Hits a Wall: My Journey from Monolith to Microservices

Pomai Ecosystem did not begin with a grand plan for microservices, event streaming, or AI-powered observability. Like most side projects that capture our imagination, it started with a single, naive question: *"How quickly can I ship this?"*

In the early days, the answer was simple: build a multi-module monolith, hook it up to Firebase Firestore, and let the code fly. It was beautiful in its simplicity. Every module lived in one happy repository, shared the same runtime, and talked through direct function calls.

For a while, it felt like I was winning. Features went out the door in hours, not days. But as Pomai grew, those early victories started to look like architectural debts.

## The Illusion of Simplicity

The first cracks didn't appear in the code—they appeared on my credit card statement.

Firebase is a developer’s dream until you reach the scale where it isn't. As Pomai expanded, every dashboard refresh and every nested query triggered a cascade of billable document reads. The system wasn’t becoming slower; it was becoming unsustainable. My primary architectural constraint had stopped being "how to solve a problem" and had become "how to avoid going broke."

But the cost was just the wake-up call. The real problem was structural.

Inside that monolith, I had tried to keep things tidy by organizing code into business modules. Yet, as I added support for different workspace types—Small Business vs. Enterprise—I hit the "if-else" trap. My controllers were becoming monstrous. I remember staring at a function that was 200 lines long, filled with conditional logic just to figure out how many tasks a user was allowed to create.

That’s when I took my first real step toward professional architecture. I stopped trying to patch the monolith and started designing **Strategy + Factory patterns**. I wanted to hide the complexity behind clean abstractions. It didn't solve the scaling problem, but it gave me a clean separation of concerns—a foundation that would save my life later.

## The Hard Truth: Time to Leave Firebase

Refactoring from Firestore to PostgreSQL wasn't just a database migration; it was a heart transplant.

I had to deconstruct deeply nested document structures into normalized tables. Every `firebase-admin` query had to be rewritten. I chose **Prisma** as my companion, not because it was trendy, but because it gave me the type-safety I desperately needed to stay sane during the transition.

There were many nights spent debugging SQL joins and transaction states, wondering if it was worth it. But when I finally saw the system running on a relational database—predictable, performant, and under my total control—I knew there was no going back. I had traded the "magic" of Firebase for the "reliability" of SQL.

## Why I "Chose" Microservices (or rather, why they chose me)

People often ask why I migrated to microservices. The truth? I didn't want to. I resisted it until the monolith literally begged to be broken.

When you have a single deployment unit for every single module, you’re trapped. You want to update the Chat service? You have to redeploy everything. You want to scale the AI Engine? You have to scale the whole monolith. It was like trying to steer a cruise ship when all you needed was a speedboat.

I didn't split the services randomly. I spent weeks identifying the true "seams" in the business.

* **Authentication, Chat, and AI** were the obvious outcasts—they had completely different scaling needs.
* **HR and Payroll**, however, stayed together. They were too tightly coupled to be torn apart.

This wasn't about "Microservices" as a buzzword; it was about **Autonomy**. I wanted each service to breathe on its own.

## The "Over-Engineering" That Saved Me

Once you go down the microservices path, the real chaos begins. Distributed communication, service discovery, API routing... suddenly, I wasn't just a coder; I was a platform engineer.

I had to teach myself:

* **Kong Gateway & Nginx:** To handle the traffic I couldn't remember how to route.
* **Kafka:** To ensure that when a task was updated in one service, the RAG Engine actually knew about it.
* **Prometheus & Grafana:** To finally see the "vital signs" of my system rather than guessing why it was lagging.
* **Llama.cpp & Qdrant:** To build a logging system that doesn't just store logs—it talks to me.

I realized that all these "complex" tools—Kafka, Flink, Vector DBs—weren't over-engineering. They were the necessary responses to the challenges of a distributed system.

## The Lesson: Architecture is a Living Thing

If I were to restart Pomai today, I would still start with a monolith. There is no shame in building small.

My biggest takeaway from this entire journey is simple: **Good architecture is not about picking the shiniest technology on Day 1. It is about building a system that allows you to evolve naturally.**

Pomai didn't become a microservices platform because I wanted it to. It became one because the complexity of the product demanded it.

I didn't just build an ecosystem; I built a laboratory for my own growth. And if there’s one thing I’ve learned, it’s this: don't fear the monolith, and don't worship the microservice. Just keep listening to what your system needs, and don't be afraid to break it, rebuild it, and make it better.

---

*If you’re interested in the technical blueprints behind these decisions—the design patterns, the Kafka configs, or how I built a CPU-only AI Logging system—feel free to check out the [Pomai Ecosystem GitHub repository](https://www.google.com/search?q=https://github.com/your-repo-link).*
