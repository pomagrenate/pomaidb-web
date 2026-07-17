---
title: "Pomai Ecosystem - The Dual-Write Dilemma: Ensuring Data Integrity in a Distributed Ecosystem"
slug: "distributed-data-integrity-outbox-pattern-kafka"
date: "2026-07-28"
author: "Quan Van"
excerpt: "Splitting a monolith into microservices is easy. Keeping the data consistent across them is the real nightmare. Here is how I solved the dual-write problem using the Transactional Outbox Pattern and Kafka."
tags: ["System Design", "Microservices", "Kafka", "PostgreSQL", "Data Integrity", "Outbox Pattern"]
category: "Architecture"
---

# The Dual-Write Dilemma: Ensuring Data Integrity in a Distributed Ecosystem

There is a dangerous honeymoon phase when you first migrate to microservices. You successfully split your code, your containers are running, and you feel like a distributed systems genius. 

Then, the data inconsistencies begin.

In the early days of the Pomai Ecosystem's microservices architecture, I encountered a silent but deadly bug. A user would create a new Task, and it would successfully save in the core `Task Service` database. But when they searched for it a minute later via the AI RAG Engine, it wasn't there. 

I checked the logs. The database `INSERT` was successful, but the network request to send the "TaskCreated" event to Apache Kafka had timed out. The system was now in an inconsistent state: the database had the data, but the rest of the ecosystem was completely unaware of it. 

I had just discovered the infamous **"Dual-Write Problem."**

## The Illusion of Two Steps

When a service needs to update its own database and also notify other services, the logic usually looks like this:

1. Save data to PostgreSQL.
2. Publish an event to Kafka.

This looks fine until reality hits. What if step 1 succeeds, but the application crashes right before step 2? Or what if Kafka goes down for a few seconds? The database is updated, but the event is lost forever. You cannot wrap a PostgreSQL save and a Kafka publish in a single traditional ACID transaction because they are two entirely different systems.

I realized that even with my consolidated "Macro-services" architecture, managing distributed state was a formidable challenge. I needed a way to guarantee that if a transaction committed to the database, the event would *always* reach Kafka, regardless of network partitions or partial failures.

## The Solution: The Transactional Outbox Pattern

To avoid the dual-write problem without reverting to the monolithic nightmare, I implemented the **Transactional Outbox Pattern**.

Instead of trying to talk to the database and the message broker simultaneously, I changed the flow to rely entirely on PostgreSQL's internal transaction guarantees.

Here is how I engineered it:
1. **The Single Transaction:** When a user updates a task, the service updates the `Tasks` table and simultaneously inserts a record into a local `Outbox` table (e.g., representing the `TaskUpdated` event) **within the exact same PostgreSQL transaction**.
2. **Atomic Guarantee:** If the database transaction fails, neither the task update nor the outbox event is saved. If it succeeds, *both* are guaranteed to be stored safely on disk.
3. **The Relay Process:** A separate background worker (or relay process) constantly polls this `Outbox` table. It reads the pending events and pushes them to Kafka. Once Kafka acknowledges receipt, the relay marks the event as processed in the database.

This strategy completely decoupled the main business logic from Kafka's availability. It successfully guaranteed **At-Least-Once delivery** of every state change across the ecosystem[cite: 1].

## The Consequence: Embracing Idempotency

In distributed systems, every solution introduces a new problem. "At-Least-Once" delivery means that occasionally, due to network retries, Kafka might deliver the exact same event twice. 

If my Activity Log service receives two identical `TaskUpdated` events, I don't want it to create two identical log entries. Therefore, I had to make **Idempotency a first-class citizen** in my architecture[cite: 1].

Every Consumer Service in Pomai is designed to be idempotent[cite: 1]. I achieve this by attaching a unique `event_id` (or `idempotency_key`) to every message[cite: 1]. Before a service processes an event, it checks its local database to see if that `event_id` has already been handled. By doing this, I ensure that processing the same event multiple times yields the exact same result, preventing duplicate entries and corrupted states[cite: 1].

## Future-Proofing: Semantic Versioning for Events

As the ecosystem evolved, the structure of the data changing became another risk. If I added a new field to the Task schema, older consumer services might break when trying to parse the new Kafka message.

To solve this, I adopted a strict schema registry strategy using **Semantic Versioning for Events**[cite: 1]. By explicitly versioning the event payloads (e.g., `TaskUpdated_v1`, `TaskUpdated_v2`), downstream consumers could gracefully handle evolution without breaking the integrity of the data processing pipeline[cite: 1].

## The Takeaway: Reliable Asynchrony

By enforcing the Outbox Pattern, Idempotency, and Event Versioning, I transformed Pomai from a fragile web of synchronous API calls into a robust, self-healing ecosystem[cite: 1]. 

The Transactional Outbox ensures that my RAG Engine, Activity Log, and Notification Service never miss a state change, even during high-traffic spikes or transient network outages[cite: 1]. 

Microservices are not just about deploying smaller containers. They are about accepting that failure is inevitable and designing your data flow so that the system can always recover its consistency. It is a massive architectural overhead, but achieving true operational reliability is worth every line of code[cite: 1].

---
*If you are curious about the database schema for the Outbox table or how the Kafka consumers handle idempotency, check out the source code in the [Pomai Ecosystem GitHub repository](https://github.com/your-repo-link).*