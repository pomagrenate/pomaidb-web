---
title: "Pomai Ecosystem - The 3-Pillar Architecture: Decoupling Real-time Data, Analytics, and AI"
slug: "pomai-ecosystem-3-pillar-architecture"
series: "Pomai Ecosystem Architecture"
date: "2026-07-23"
author: "Quan Van"
excerpt: "How I architected a highly scalable, polyglot microservices ecosystem by decoupling data ingestion, stream processing, and AI reasoning into three resilient pillars."
tags: ["System Design", "Microservices", "Kafka", "Data Lakehouse", "RAG", "Go", "Python"]
category: "Engineering"
repo: "https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration."
---

# The 3-Pillar Architecture: Decoupling Real-time Data, Analytics, and AI

<div align="center">
  <img src="../../public/images/blog/3_pillar_architecture.png" alt="The 3-Pillar Pomai Architecture" width="800"/>
  <p><i>Figure 1: The blueprint of the Pomai Ecosystem, illustrating the Realtime, Data, and AI Hubs connected via Kafka.</i></p>
</div>

When building the Pomai Ecosystem, I quickly realized that throwing all functionalities into a single monolithic service—or even a loosely defined set of microservices—was a recipe for disaster. 

Modern AI-driven applications face a unique set of conflicting workloads:
1. **Ingestion requires high I/O and low latency** (keeping users connected).
2. **Data Processing requires high memory and CPU** (transforming JSON to Parquet).
3. **AI Reasoning requires specialized compute and vector math** (Embeddings, RAG, LLM inference).

Forcing a high-speed WebSocket server to wait for an AI model to generate an embedding is architectural suicide. To solve this, I designed a **3-Pillar Architecture**, entirely decoupled by an Apache Kafka backbone and strictly governed by Protocol Buffers (Protobuf). 

Here is a deep dive into the three pillars—the **Realtime Hub**, the **Data Hub**, and the **AI Hub**—and the engineering decisions behind them.

---

## Pillar 1: The Realtime Hub (The Gateway)

**Language:** Go
**Primary Role:** Ingress, Client Connections, and Event Production.

The Realtime Hub is the front door of the Pomai Ecosystem. It handles WebSocket connections, gRPC streams, and REST API calls from clients. 

### Why this design?
The sole responsibility of the Realtime Hub is to accept data and immediately offload it to Kafka. It does **not** process data, it does **not** write to databases, and it does **not** talk to the AI. 

This strict boundary ensures that the user experience is never blocked by backend latency. To guarantee zero data loss without compromising system liveness, I implemented a **Tiered-Consistency Policy**:
*   **For Ephemeral Data (Telemetry/UI interactions):** If Kafka experiences backpressure, the Hub drops these events to keep the WebSocket loop unblocked.
*   **For Critical Data (Knowledge Updates/System Errors):** If Kafka is down, the Hub utilizes a Local Disk Appender, writing events to a temporary file. A background Resync Worker replays them to Kafka once the connection is restored. 

By writing this in **Go**, the Realtime Hub utilizes lightweight goroutines to handle thousands of concurrent WebSocket connections with minimal RAM footprint.

---

## Pillar 2: The Data Hub (The Silent Janitor)

**Language:** Go
**Primary Role:** Stream ETL, Data Lakehouse Bridge, and Routing.

If Kafka is a raging river of data, the Data Hub is the hydroelectric dam. It acts purely as an asynchronous Kafka consumer, working silently in the background.

### Why this design?
Without the Data Hub, Kafka would eventually run out of disk space, and raw JSON logs would be impossible to query efficiently. The Data Hub performs a critical **Streaming ETL (Extract, Transform, Load)** process:
1.  **Extract:** It reads raw events from Kafka without auto-committing, ensuring "At-least-once" delivery.
2.  **Transform:** It groups thousands of JSON messages into micro-batches (e.g., every 60 seconds or 10,000 messages) and converts them into heavily compressed, columnar **Parquet** files.
3.  **Load:** It uploads these partitioned files (`year=2026/month=07/...`) to a MinIO S3 bucket, effectively creating an ultra-cheap, highly performant Data Lakehouse.

Furthermore, the Data Hub acts as a router. If it detects a `knowledge_update` event, it dispatches it to the AI Hub. It only commits the Kafka offset *after* the MinIO upload and AI dispatch are successful, ensuring absolute data integrity.

---

## Pillar 3: The AI Hub (The Intelligence Engine)

**Language:** Python
**Primary Role:** Retrieval-Augmented Generation (RAG), Embeddings, and Analytical Reasoning.

The AI Hub is where the raw data is transformed into actionable intelligence. Because the AI ecosystem is dominated by Python (FastAPI, LangChain, PyTorch), this pillar is a polyglot departure from the Go-based ingestion layer.

### Why this design?
By isolating the AI Hub, I protected the core application from the unpredictable resource spikes caused by machine learning models. The AI Hub operates on a dual-path RAG system:
*   **Real-time RAG:** It receives continuous `knowledge_update` payloads routed by the Data Hub, generates vector embeddings, and upserts them into **Qdrant** for immediate semantic retrieval.
*   **Analytical RAG:** Instead of loading terabytes of historical logs into memory, the AI Hub utilizes **DuckDB**. When reasoning over historical trends, it executes SQL queries directly against the Parquet files stored in MinIO by the Data Hub. 

This hybrid approach allows the AI to possess both real-time awareness and deep historical context, all while staying within strict memory constraints (often under 1GB of RAM for analytics).

---

## The Glue: Kafka and Protobuf

A decoupled architecture is only as strong as its communication layer. 

1.  **Apache Kafka:** Replaces synchronous HTTP/gRPC calls between the pillars. If the AI Hub goes down for maintenance, the Realtime Hub doesn't crash; it just keeps pushing to Kafka, and the AI Hub catches up when it comes back online.
2.  **Protocol Buffers (Protobuf):** Initially, the system used JSON, which led to schema drift and runtime parsing errors across the Go and Python services. By migrating to a centralized `api/proto/v1` repository, Protobuf enforces strict, binary-serialized API contracts. A field cannot be changed in the Realtime Hub without the Data Hub and AI Hub compilers acknowledging it.

## Conclusion

Building the Pomai Ecosystem was a transition from writing "applications" to engineering an "infrastructure." 

By separating the architecture into three distinct pillars—Ingestion (Realtime), Processing (Data), and Reasoning (AI)—I created a system that is resilient to outages, highly cost-effective, and capable of infinite horizontal scaling. It proves that with the right architectural blueprints, you can build enterprise-grade, AI-driven data pipelines without relying on expensive managed cloud services.