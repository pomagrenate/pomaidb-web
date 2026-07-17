---
title: "Pomai Ecosystem: From Port-Hell to High Availability: Architecting an Enterprise-Grade API Gateway"
slug: "api-gateway-kong-nginx-high-availability"
date: "2026-08-02"
author: "Quan Van"
excerpt: "When my microservices multiplied, managing routing and security became a nightmare. Here is how I evolved from a custom-coded proxy to a Highly Available Kong and Nginx Gateway cluster."
tags: ["System Design", "API Gateway", "Kong", "Nginx", "Load Balancing", "High Availability"]
category: "Infrastructure"
---

# From Port-Hell to High Availability: Architecting an Enterprise-Grade API Gateway

Building microservices is fun until you have to figure out how the frontend will actually talk to them. 

In the early phases of the Pomai Ecosystem, as I split the monolith into independent services (Auth, Chat, Task, AI Engine), I quickly found myself descending into what I call **"Port-Hell."** 

Every service ran on a different port: Auth on 8081, Chat on 8082, Task on 8083. The frontend codebase became a messy configuration file mapping domains to arbitrary numbers. Worse, if I needed to enforce authentication or rate limiting, I had to duplicate that logic across every single service. 

It was an architectural mess. The frontend knew too much about the backend infrastructure, and the backend was doing too much repetitive work.

## Phase 1: The "DIY" Custom Gateway

My first instinct was to build a custom solution. I engineered a lightweight, custom routing gateway in Node.js that acted as a single entry point for all internal services. 

* **Unified Entry Point:** All client requests hit the Gateway on port 80 or 443. The Gateway intelligently routed traffic based on the URL path (e.g., `/api/auth/*` went to the AuthService).
* **Centralized Security:** I moved JWT validation and basic rate limiting out of the microservices and into this custom gateway[cite: 1]. 

This "Gateway-first" approach worked beautifully for a while[cite: 1]. It adhered to the Separation of Concerns principle, keeping my microservices focused purely on business logic[cite: 1]. 

But as Pomai evolved, I hit a **"Feature Wall."**[cite: 1] I found myself spending more time writing boilerplate code for request retries, advanced rate-limiting, and complex routing than actually building product features[cite: 1]. I was reinventing the wheel.

## Phase 2: The Enterprise Shift (Kong Gateway)

I realized that an API Gateway shouldn't be a piece of custom business logic; it is fundamental infrastructure. I decided to deprecate my custom code and migrate to **Kong Gateway**[cite: 1].

Transitioning to Kong was a game-changer. Built on Nginx and OpenResty, it shifted the burden of infrastructure management from my custom code to a battle-tested platform[cite: 1]:
* **Declarative Security:** Instead of maintaining my own JWT validation code, I simply enabled Kong's native JWT and OAuth2 plugins[cite: 1].
* **Traffic Protection:** To protect my databases and the RAG Engine from "noisy neighbor" requests or DoS attacks, Kong’s Rate Limiting plugin provided granular control over request quotas[cite: 1].
* **Observability:** Kong integrated seamlessly with my Prometheus and Grafana stack, allowing me to monitor latencies and error rates across all services from a single dashboard—something my custom gateway struggled to do consistently[cite: 1].

## Phase 3: The SPOF Problem & High Availability (HA)

Kong was fantastic, but it introduced a new architectural vulnerability: **The Single Point of Failure (SPOF)**[cite: 1]. 

If my single Kong instance went down, the entire Pomai Ecosystem would become unreachable, even if all the backend microservices were perfectly healthy[cite: 1]. To achieve true 99.99% uptime, I needed a redundant gateway layer.

But this created a dilemma: If I spin up two Kong instances, how does the frontend know which one to talk to? 

### The Solution: Nginx as a Layer 7 Load Balancer

To solve this, I introduced **Nginx** as the public-facing entry point, acting as a Layer 7 Load Balancer sitting in front of a Kong cluster[cite: 1].

1. **The Round-Robin Strategy:** Nginx receives all incoming client requests and distributes them across the available Kong instances using a round-robin algorithm[cite: 1]. This ensures no single Kong node is overwhelmed[cite: 1].
2. **Auto-Failover:** Nginx actively monitors the health of the Kong nodes[cite: 1]. If `Kong-Instance-1` crashes, Nginx instantly detects the failure and routes 100% of the traffic to `Kong-Instance-2`[cite: 1]. The frontend never even notices a hiccup.
3. **Zero-Downtime Maintenance:** I can now take down one Kong node to update its configuration or apply security patches while the system remains fully operational[cite: 1].

## The Final Architecture

The evolution from a custom port-forwarder to a highly available cluster completely decoupled the frontend from the backend. The frontend now talks to a single, stable IP (Nginx)[cite: 1]. Nginx balances the load across the Kong Cluster[cite: 1]. Kong enforces security and routes the traffic to the appropriate microservice[cite: 1]. 

Transitioning to Kong and Nginx wasn't just a technical upgrade; it was an operational necessity[cite: 1]. It taught me that while writing custom code is great for learning, knowing when to leverage enterprise-grade infrastructure is what makes an architecture truly scalable.

---
*Curious about the Nginx config files or how to set up Kong declaratively in Docker? Check out the `api-gateway` setup in the [Pomai Ecosystem GitHub repository](https://github.com/your-repo-link).*