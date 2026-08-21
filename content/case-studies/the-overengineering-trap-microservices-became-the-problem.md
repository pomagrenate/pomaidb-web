---

title: "The Overengineering Trap: When Microservices Became the Problem"
slug: "the-overengineering-trap-microservices-became-the-problem"
series: "Pomai Ecosystem Architecture"
date: "2026-08-21"
author: "Quan Van"
excerpt: "I thought I was designing a system for scale. In reality, I was designing problems I didn't have yet. This is what I learned from over-engineering the Pomai Ecosystem."
tags: ["System Design", "Microservices", "Architecture", "Overengineering", "Distributed Systems", "Pomai Ecosystem"]
category: "Engineering"
repo: "[Pomai Ecosystem Architecture](https://github.com/pomagrenate/Pomai-Ecosystem---A-Microservices-Architecture-Case-Study-with-AI-RAG-Integration)"
--------------------------------------------------------------------------------------------------------------------------------------------------------

# The Overengineering Trap: When Microservices Became the Problem

When I started building the Pomai Ecosystem, I had a very clear picture in my head.

Multiple products.

Independent services.

Horizontal scaling.

Service isolation.

Dedicated databases.

Event-driven communication.

API gateways.

Observability.

Containers everywhere.

It sounded like a proper production architecture.

And honestly, it looked impressive on a diagram.

There was only one problem.

**The system didn't need most of it yet.**

I wasn't solving problems.

I was preparing for problems that didn't exist.

That was my introduction to one of the most expensive mistakes in software engineering:

> **Overengineering.**

---

## The Architecture I Thought I Needed

Pomai started as a multimodule monolith.

That was actually a very reasonable architecture for the stage of the product.

Different modules lived inside the same application, shared infrastructure, and could communicate through ordinary function calls.

Simple.

Fast to develop.

Easy to debug.

Then the ecosystem started growing.

I had multiple products with different responsibilities, including productivity tools, meetings, storage, collaboration, and AI capabilities.

At some point, I started asking the classic engineering questions:

* What happens when one service needs to scale independently?
* What if one product becomes much more popular than the others?
* What if one service crashes?
* What if different teams work on different services?
* What if we eventually have millions of users?
* What if we need independent deployments?
* What if we need event-driven communication?

These are all legitimate questions.

But there was a subtle problem.

**None of those problems were actually happening yet.**

Instead of asking:

> "What problem am I solving?"

I was asking:

> "What problems might I have someday?"

That difference completely changed the architecture.

---

## The Microservices Honeymoon

Moving from a multimodule monolith to microservices felt like an upgrade.

Suddenly, every domain could have its own service.

The architecture became cleaner on paper.

I could separate responsibilities.

I could deploy services independently.

I could choose the right technology for different problems.

And the system looked much more scalable.

The architecture started to look something like this:

```text
                        ┌──────────────┐
                        │     Client   │
                        └───────┬──────┘
                                │
                                ▼
                        ┌──────────────┐
                        │ Kong Gateway │
                        └───────┬──────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        ┌──────────┐      ┌──────────┐      ┌──────────┐
        │ Service A│      │ Service B│      │ Service C│
        └────┬─────┘      └────┬─────┘      └────┬─────┘
             │                 │                 │
             ▼                 ▼                 ▼
        ┌──────────┐      ┌──────────┐      ┌──────────┐
        │ Database │      │ Database │      │ Database │
        └──────────┘      └──────────┘      └──────────┘
```

Then I added more infrastructure.

Gateway.

Cache.

Object storage.

Message queues.

Monitoring.

Container management.

Logging.

Health checks.

Service discovery.

Eventually, I realized something uncomfortable.

**The infrastructure was becoming a product of its own.**

---

## The Hidden Cost of "Scalable"

The biggest misconception I had was that scalability was mostly about adding more machines.

It isn't.

Distributed systems introduce a completely different class of problems.

Inside a monolith:

```text
create_task()
    ↓
update_project()
    ↓
notify_user()
```

These operations can happen inside the same process.

When the same workflow crosses service boundaries:

```text
Service A
    ↓
HTTP
    ↓
Service B
    ↓
Database
    ↓
Event
    ↓
Message Broker
    ↓
Service C
```

Every arrow introduces another failure point.

Now you have to think about:

* network failures
* retries
* timeouts
* duplicated messages
* ordering
* idempotency
* partial failures
* distributed tracing
* eventual consistency
* service health
* deployment coordination

The business problem hasn't necessarily become more complicated.

**The architecture has.**

---

## The "One Database Per Service" Trap

One of the most common pieces of microservice advice is:

> Each service should own its database.

Conceptually, this makes sense.

In practice, it also creates a lot of operational complexity.

Imagine a relatively simple workflow.

A user creates something.

That action needs information from three different domains.

In a monolith, this might be a straightforward transaction.

In a distributed architecture, I now need to think about:

```text
Service A
    ↓
Service B
    ↓
Service C
```

What happens if Service C fails?

Service A already committed its transaction.

Service B already committed its transaction.

Now the system is partially successful.

There is no simple rollback button.

I suddenly need distributed consistency strategies for a problem that could have been solved with a local transaction.

This is the part that architecture diagrams rarely show.

---

## Overengineering Doesn't Always Look Like Bad Code

This is an important distinction.

Overengineering is not necessarily:

```text
bad code
```

It can actually be:

```text
excellent code
+
excellent architecture
+
excellent infrastructure
=
wrong solution
```

You can build a beautifully engineered system that solves the wrong problem.

That makes overengineering particularly dangerous.

Because technically, everything looks correct.

The services are clean.

The interfaces are well-defined.

The infrastructure is automated.

The monitoring is working.

The architecture is scalable.

And yet...

**The product is slower to build.**

---

## The Complexity Tax

Every abstraction has a cost.

Every service has a cost.

Every infrastructure component has a cost.

Every network boundary has a cost.

The cost isn't always money.

It can be:

```text
Development complexity
+
Operational complexity
+
Debugging complexity
+
Deployment complexity
+
Cognitive load
```

For example, adding another service doesn't only mean adding another repository.

It can mean adding:

* Docker configuration
* environment variables
* health checks
* deployment configuration
* monitoring
* logs
* networking
* authentication
* API contracts
* documentation
* testing
* CI/CD configuration

A five-minute function call can become a distributed API contract.

That's the complexity tax.

---

## The Most Expensive Part: Cognitive Load

The thing that hurt the most wasn't CPU usage.

It wasn't RAM.

It wasn't even infrastructure cost.

It was **cognitive load**.

When I worked on the system, I had to remember:

```text
Which service owns this data?

Which database contains it?

Which API exposes it?

Is this synchronous or asynchronous?

Which event triggers this workflow?

What happens if the consumer is down?

Where should I look for the logs?

Which container is responsible?

Is this request going through the gateway?

Is the cache involved?
```

That is a lot of mental context for a relatively simple feature.

The architecture was becoming harder to reason about than the business domain itself.

That's a warning sign.

---

## The Question I Should Have Asked Earlier

Eventually I changed the question.

Instead of asking:

> "How can I make this architecture scalable?"

I started asking:

> **"What is the simplest architecture that can handle the problems I actually have today?"**

That question is much harder.

Because it forces you to remove things.

And engineers love adding things.

We love:

* new services
* new abstractions
* new frameworks
* new infrastructure
* new patterns

Deleting something feels less impressive.

But good architecture is often about knowing what **not** to build.

---

## What I Would Do Differently Today

If I were starting the Pomai Ecosystem again, I wouldn't immediately jump from:

```text
Multimodule Monolith
```

to:

```text
Full Microservices Architecture
```

I would introduce complexity gradually.

Something closer to:

```text
Phase 1
Multimodule Monolith
        ↓
Phase 2
Modular Boundaries
        ↓
Phase 3
Extract High-Value Services
        ↓
Phase 4
Introduce Async Communication
        ↓
Phase 5
Independent Scaling
```

The important part is that **each architectural step should be triggered by an actual problem**.

Not by a theoretical future.

---

## When Should You Actually Extract a Service?

I now look for concrete signals.

A module deserves to become a service when at least one of these becomes true:

### 1. It needs independent scaling

If one part of the system consumes significantly more resources than the rest, separating it makes sense.

For example:

```text
AI inference
```

may have completely different resource requirements from:

```text
CRUD APIs
```

That is a real architectural boundary.

---

### 2. It needs independent deployment

If changing one domain constantly requires redeploying everything, extraction can reduce deployment coupling.

That's a real problem.

---

### 3. It has a clear ownership boundary

A service should represent a meaningful business capability.

Not:

```text
user_controller_service
```

just because splitting controllers sounds clean.

The boundary should exist because the domain exists.

---

### 4. It has different reliability requirements

Some components can fail without bringing down the entire system.

AI processing is a good example.

A failed AI request shouldn't necessarily make:

```text
authentication
billing
or core CRUD
```

unavailable.

That's a meaningful reason for isolation.

---

### 5. The team actually needs the boundary

This one is often ignored.

If three developers are working on one product, you probably don't need fifteen independently deployable services.

Microservices are not free organizationally.

They introduce coordination costs.

---

## Architecture Should Follow Pressure

This became my biggest lesson.

Architecture shouldn't be driven by imagination alone.

It should be driven by **pressure**.

```text
Traffic pressure
        ↓
Scaling decision

Deployment pressure
        ↓
Service boundary

Reliability pressure
        ↓
Isolation

Team pressure
        ↓
Ownership boundary

Data pressure
        ↓
Storage separation
```

When the pressure doesn't exist, the architecture doesn't necessarily need to exist either.

---

## What About the Future?

This is where engineers usually object.

"But what if the product becomes huge?"

That's a fair question.

But there is an important difference between:

> **Designing for the future**

and

> **Building the future prematurely.**

You should absolutely design your code so that future extraction is possible.

You don't necessarily need to perform the extraction today.

For example, instead of immediately creating a separate service, create a strong module boundary:

```text
application/
├── auth/
├── projects/
├── collaboration/
├── storage/
└── ai/
```

Give each module:

* clear responsibilities
* explicit interfaces
* controlled dependencies
* isolated business logic

Then, when `ai/` genuinely needs independent scaling, extracting it becomes much easier.

This is what I now call:

> **Design for extraction, not extraction by default.**

---

## The Irony of Engineering

There is a strange irony here.

The more experienced you become, the more technologies you know.

And the more technologies you know, the more ways you discover to complicate a system.

You learn:

```text
Kubernetes
Kafka
Redis
Service Mesh
Event Sourcing
CQRS
DDD
Microservices
Distributed Tracing
```

And suddenly every new project looks like an opportunity to use all of them.

But experience should eventually teach you something else:

> **Knowing how to build something is not a reason to build it.**

---

## What I Kept

The lesson wasn't:

> "Microservices are bad."

They aren't.

I still believe microservices are extremely useful when the system actually requires them.

The lesson was:

> **Complexity must be earned.**

If a component needs isolation, isolate it.

If a service needs independent scaling, separate it.

If asynchronous processing solves a real bottleneck, introduce a queue.

If centralized routing becomes a real problem, use a gateway.

But don't introduce infrastructure simply because production systems are supposed to have it.

---

## What I Removed From My Thinking

I stopped asking:

```text
"What does a production-grade architecture look like?"
```

And started asking:

```text
"What does this product actually need?"
```

That shift sounds small.

It isn't.

It completely changes how you design systems.

---

## The Architecture I Believe In Now

I don't believe in:

```text
Monolith vs Microservices
```

I believe in:

```text
Simple → Modular → Distributed
```

in that order.

Start simple.

Create strong boundaries.

Measure real problems.

Then distribute only where the pressure demands it.

Your architecture should evolve with the product.

Not the other way around.

---

## The Takeaway

Overengineering is rarely caused by bad intentions.

It usually comes from good engineers trying to build something that will survive the future.

The problem is that the future is uncertain.

And every piece of infrastructure you introduce today becomes a problem you have to maintain today.

The best architecture isn't the one with the most sophisticated components.

It's the one where **every component has earned its place**.

For me, the biggest lesson from the Pomai Ecosystem was simple:

> **Don't build for the system you imagine you'll have. Build for the problems you actually have.**

Then, when those problems arrive, let them tell you what architecture to build next.

That's not under-engineering.

## **That's engineering.**
