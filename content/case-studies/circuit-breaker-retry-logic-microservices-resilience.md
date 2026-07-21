---
title: "Pomai Ecosystem - When One Service Falls, They All Shouldn't: Building Resilience with Circuit Breakers and Retry Logic"
slug: "circuit-breaker-retry-logic-microservices-resilience"
series: "Pomai Ecosystem Architecture"
date: "2026-07-19"
author: "Quan Van"
excerpt: "In a distributed system, a single service failure can cascade through the entire ecosystem. Here is how I learned that circuit breakers alone weren't enough and why retry logic with exponential backoff became essential for keeping Pomai Ecosystem alive during network hiccups."
tags: ["System Design", "Microservices", "Circuit Breaker", "Retry Logic", "Resilience", "Fault Tolerance"]
category: "Architecture"
repo: "https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration."
---

# When One Service Falls, They All Shouldn't: Building Resilience with Circuit Breakers and Retry Logic

The morning started like any other. I was monitoring the Pomai Ecosystem dashboard when I noticed something strange. The `agent_service` was showing elevated error rates, but what worried me more was that the `task_service`, `goal_service`, and even the `chat_service` were also struggling.

I dug into the logs and found the root cause: the `workspace_service` had a brief network hiccup. It was down for maybe thirty seconds. But in those thirty seconds, the `agent_service` had tried to call it repeatedly, each call timing out and consuming resources. The cascading effect was immediate—other services that depended on the agent service also started timing out.

The entire ecosystem was suffering from a single service's temporary blip.

## The False Security of Circuit Breakers

I had already implemented circuit breakers across the system. They were supposed to prevent exactly this kind of cascading failure. When a service fails repeatedly, the circuit breaker opens and stops sending requests, allowing the failing service to recover.

But looking at the metrics, I saw the problem. The circuit breaker was opening, but by the time it did, the damage was already done. The `agent_service` makes over twenty-five external calls to different services for every user interaction. Even with circuit breakers, a network blip would cause multiple services to trip their breakers simultaneously.

The circuit breaker was doing its job—failing fast—but it was too aggressive. A momentary network glitch shouldn't immediately open the circuit and block all traffic. The system needed to be more forgiving of transient failures.

## The Missing Piece: Retry Logic

I realized that circuit breakers are excellent for genuine service outages, but they shouldn't be the first line of defense against transient network issues. A "blip" in the network shouldn't immediately trip the breaker.

The real problem was that the system wasn't giving services a chance to recover from minor hiccups. If a request failed due to a momentary network congestion, the circuit breaker would count it as a failure and eventually open. But if the system had simply retried the request a couple of times, it likely would have succeeded.

I needed to implement retry logic before the circuit breaker even counted a failure.

## Implementing Retry with Exponential Backoff

I created a shared circuit breaker library that combines both retry logic and circuit breaking. The retry mechanism works on a simple principle: if a request fails, try again before giving up.

But I couldn't just retry immediately. If a service is struggling, hammering it with rapid retries would only make things worse. I implemented exponential backoff:

- First retry: 100ms delay
- Second retry: 200ms delay  
- Third retry: 400ms delay
- Maximum delay capped at 5 seconds

This gives the downstream service time to recover while still being aggressive enough to handle transient failures quickly.

## Smart Error Detection

Not all errors should trigger retries. If a request fails because of a 404 Not Found or a 400 Bad Request, retrying won't help. I implemented smart error detection that only retries on:

- Network timeouts
- Connection failures
- 5xx server errors
- 429 Too Many Requests

For 4xx client errors, the system fails immediately—there's no point retrying a request that's fundamentally incorrect.

## The New Flow

The updated resilience pattern now works in layers:

1. **First Line: Retry Logic** - If a request fails, retry with exponential backoff (up to 3 attempts)
2. **Second Line: Circuit Breaker** - If retries fail consistently, the circuit breaker opens after 5 consecutive failures
3. **Final Line: Fallback** - If the circuit is open, use fallback logic or fail gracefully

This means that a momentary network glitch might cause a 200ms delay while the system retries, but it won't trip the circuit breaker. Only genuine, prolonged issues will cause the circuit to open.

## Real-World Impact

After implementing this combined approach, the metrics told a different story. During the same network conditions that previously caused cascading failures, the system now handled them gracefully.

The `agent_service` showed increased retry activity during network hiccups, but the circuit breakers remained closed most of the time. Users experienced slight delays instead of complete failures. The ecosystem became more "stubborn" in a good way—it stayed operational through minor instabilities.

## The Cost of Complexity

Adding retry logic and circuit breakers isn't free. It adds complexity to the codebase. Every external service call now needs to be wrapped with the circuit breaker library. The metrics become more complex to interpret—you have to track both failures and retries.

But the alternative is worse. A system that crumbles under minor network issues isn't a production-ready distributed system. The complexity is the price you pay for reliability.

## Lessons Learned

Circuit breakers alone aren't enough for a resilient microservices architecture. They're excellent for handling genuine service outages, but they're too aggressive for transient network issues. Retry logic with exponential backoff provides the first line of defense, handling the minor hiccups that are inevitable in any distributed system.

The combination of retry logic and circuit breakers creates a layered defense: retry logic handles the noise, circuit breakers handle the signal. This approach significantly improves overall availability without sacrificing the system's ability to fail fast when it truly needs to.

In distributed systems, failure isn't a question of "if" but "when." The goal isn't to prevent failure—it's to design the system so that when things go wrong, the impact is contained and recovery is automatic.

---

*The circuit breaker implementation with retry logic is available in the shared `@pomegranate/circuit-breaker` package. The `agent_service` currently uses this pattern for all 25+ external service calls, and the pattern is ready to be applied to other services as needed.*
