---
title: "Pomai Ecosystem: The Real Challenges of Migrating from a Monolith to Microservices"
slug: "the-real-challenges-from-breaking-monolith-to-microservice"
date: "2026-07-17"
author: "Quan Van"
excerpt: "Pomai Ecosystem did not begin as a microservices platform. Like many personal projects, it started with a single frontend application connected to a backend organized as a multi-module monolith. Every feature lived inside the same repository and shared the same Firebase Firestore database. Modules communicated through direct imports or internal REST endpoints while remaining deployed as one application."
tags: ["Pomai", "PomaiLem", "Pomai Connect", "Pomai Draw", "Pomai AI", "Pomai Planner", "Pomai Chat", "Pomai Team", "Pomai Workspace", "Pomai Task", "Pomai Goal"]
category: "System Design"
---

# The Real Challenges of Migrating from a Monolith to Microservices

When people talk about migrating from a monolith to microservices, the conversation usually revolves around technology.

Docker.

Kubernetes.

Kafka.

Service Mesh.

API Gateway.

However, after going through the migration myself, I realized those technologies were never the difficult part.

The hardest challenge was changing the way the entire system was designed.

Moving a project from a multi-module monolith to microservices is not simply cutting a large application into smaller applications. If it were that easy, every monolith could become a successful distributed system in a weekend.

The reality is that every architectural decision introduces a completely new category of problems. Some problems disappear, while many others emerge for the first time.

Looking back at the evolution of the Pomai Ecosystem, these were the biggest engineering challenges I encountered during the migration.

---

## Challenge 1 — Breaking a Shared Database into Independent Domains

Inside the monolith, every module shared the same database.

Every service could query any table.

Every business transaction happened inside a single ACID transaction.

Cross-module operations were almost effortless.

Once the system moved toward microservices, that convenience disappeared immediately.

One of the core principles of microservices is that each service owns its own data.

That sounds straightforward until existing business logic has been written for years assuming every piece of information is directly accessible.

For example, creating a task could involve multiple domains.

Workspace validation.

Permission checking.

Goal synchronization.

Activity logging.

Notifications.

Inside the monolith these operations were simply function calls sharing the same database transaction.

After decomposition, every one of those operations potentially crossed a network boundary.

This forced me to rethink the ownership of every entity inside the system.

Instead of asking *"Which service needs this data?"*, I had to ask *"Who owns this data?"*

That single shift in perspective fundamentally changed the architecture.

---

## Challenge 2 — Finding the Right Service Boundaries

One of the biggest misconceptions about microservices is believing that every business entity deserves its own service.

At one point, I considered splitting almost everything.

Task Service.

Goal Service.

Workspace Service.

Team Service.

Notification Service.

Chat Service.

Auth Service.

While this looked elegant on paper, it quickly became obvious that I was creating more network traffic than actual business value.

Every request required multiple synchronous API calls.

Latency increased.

Deployment became more complicated.

Simple business operations suddenly required orchestration across half a dozen services.

Eventually I realized that service boundaries should be determined by business cohesion rather than database tables.

Highly related domains belong together.

Independent domains should evolve independently.

This led to several strategic consolidations.

Task and Goal became a single service because they constantly interacted.

Workspace and Team naturally formed one business domain.

HR and Payroll remained together because separating them introduced unnecessary complexity without improving scalability.

Meanwhile, services such as Authentication, Chat, Notification, Activity Logging, and AI remained fully independent because they each had distinct scaling requirements.

Ironically, the architecture became simpler after merging several microservices back together.

Sometimes fewer services produce a better distributed system.

---

## Challenge 3 — Replacing Direct Function Calls with Distributed Communication

Inside a monolith, communication is almost free.

A module simply imports another module.

A function executes immediately.

Errors propagate naturally.

Transactions remain consistent.

Microservices completely change this model.

Every function call becomes an HTTP request, a gRPC request, or an asynchronous event.

Now communication involves latency.

Timeouts.

Retries.

Network failures.

Partial failures.

Services becoming temporarily unavailable.

A request that previously completed in a few milliseconds inside one process now depended on multiple independent applications communicating across Docker networks.

This forced me to rethink almost every interaction inside the ecosystem.

Not every operation should remain synchronous.

Many business events no longer required immediate responses.

Instead, they became asynchronous events published through Kafka.

Notifications.

Activity logs.

Analytics.

AI indexing.

Realtime updates.

Rather than tightly coupling services together, they simply reacted to events occurring elsewhere inside the ecosystem.

This dramatically reduced coupling while making the system far more resilient.

---

## Challenge 4 — Maintaining Data Consistency Without Global Transactions

One feature developers rarely appreciate inside a monolith is the ability to wrap everything inside one database transaction.

Once every service owns its own database, distributed transactions become significantly more complicated.

Suppose a task is created.

The Product Service stores the task successfully.

However, the Notification Service crashes.

The Activity Log is unavailable.

The AI indexing pipeline is temporarily offline.

Should the task creation fail?

Should everything roll back?

Should the system retry automatically?

These questions simply never existed inside the monolith.

To solve this problem, I shifted from transaction consistency toward eventual consistency.

Business events became first-class citizens.

Each service became responsible only for its own state.

Kafka guaranteed event delivery.

Consumers became idempotent.

Failures became recoverable rather than catastrophic.

This mindset was one of the biggest conceptual shifts during the migration.

Microservices do not eliminate failures.

They assume failures will happen and design around them.

---

## Challenge 5 — Building Infrastructure Before Building Features

One unexpected lesson was discovering how much infrastructure microservices require before a single business feature can even be deployed.

A monolith usually needs very little infrastructure.

One application.

One database.

One deployment.

Microservices require an ecosystem.

Containerization.

Reverse proxies.

API Gateway.

Monitoring.

Logging.

Container management.

CI/CD.

Networking.

Health checks.

Without these components, the architecture quickly becomes impossible to operate.

This was the point where Docker, Portainer, Jenkins, Gitea, Kong Gateway, Prometheus, Grafana, Kafka, and later the AI-powered RAG logging pipeline became essential rather than optional.

The application itself was no longer the entire system.

The infrastructure became part of the architecture.

---

## Challenge 6 — Learning That Microservices Solve Different Problems

Perhaps the biggest lesson from this migration is that microservices are not an upgrade over monoliths.

They solve different problems.

A monolith optimizes for simplicity.

Microservices optimize for scalability, isolation, and operational flexibility.

The trade-off is increased complexity.

Distributed systems are naturally harder to reason about.

Debugging becomes more difficult.

Infrastructure grows significantly.

Operational costs increase.

Development workflows become more sophisticated.

None of these are disadvantages if the architecture genuinely requires them.

But adopting microservices too early simply means solving problems that do not yet exist.

Looking back, I do not regret starting Pomai as a monolith.

In fact, I believe it was the correct decision.

The monolith allowed the product to evolve quickly.

The migration only happened after the architecture itself demanded a different solution.

That, in my opinion, is how architectural evolution should happen.

Technology should follow product complexity—not the other way around.
