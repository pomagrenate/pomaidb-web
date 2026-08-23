---
title: "Beyond the Abstraction: Notes on Technology, Engineering, and Everything In Between"
slug: "beyond-the-abstraction"
date: "2026-08-22"
author: "Quan Van"
excerpt: "A personal manifesto and space for exploring technology, systems, AI mechanics, and the ideas that sit beneath the abstractions we use every day."
tags: ["Technology", "Software Engineering", "Systems", "Programming", "Philosophy"]
category: "Engineering"
---

# Beyond the Abstraction

Software has a strange property.

We use extraordinarily complicated systems every day without needing to understand how they actually work.

A developer can call an API without knowing how TCP manages a connection. A frontend application can render thousands of elements without thinking about how a browser schedules work. An engineer can use a database without considering how pages are laid out on disk, how indexes are traversed, or how a query planner decides what to execute.

We build higher and higher layers of abstraction.

And that is a good thing.

Abstraction is what makes modern software possible.

But sometimes, I want to look underneath it.

Not because every engineer needs to understand everything.

Because sometimes the most interesting part of technology is hidden exactly where the abstraction ends.

---

## Why This Blog Exists

This is not intended to be a blog about one specific technology.

It is not exclusively an AI blog.

It is not exclusively a programming blog.

And it is certainly not intended to be a collection of tutorials explaining how to install another JavaScript framework.

Technology is too large for that.

Instead, this is a place where I write about the things I become curious about.

Sometimes that means exploring how a machine learning system works internally.

Sometimes it means looking at a programming language, a database, a distributed system, an operating system, or a compiler.

Sometimes it may be a completely different subject.

The common thread is simple:

> **I want to understand things deeply enough to explain why they work.**

---

## From Using Technology to Understanding It

There is a significant difference between knowing how to use something and understanding it.

You can use a Transformer without understanding attention.

You can use an LLM without understanding tokenization.

You can build a backend service without understanding how concurrency actually behaves.

You can use Docker without knowing what namespaces and cgroups are doing underneath.

You can write Rust without knowing how the compiler turns ownership rules into guarantees enforced by the generated program.

None of these are prerequisites for building useful software.

But once you start asking the deeper questions, technology becomes much more interesting.

For example, a tokenizer may look like a small preprocessing step:

```text
Text → Tokens → Model
```

But underneath that simple pipeline is a series of decisions about vocabulary, sequence length, statistical frequency, representation density, and computational cost.

Byte Pair Encoding is one example of this kind of hidden machinery. It starts with small units and repeatedly merges statistically frequent pairs until it constructs a vocabulary capable of representing language efficiently.

What looks like a simple list of tokens is actually the result of an optimization process.

Similarly, causal masking can appear to be nothing more than a triangular matrix.

```text
1 0 0
1 1 0
1 1 1
```

But that matrix represents a fundamental constraint in autoregressive generation: a token must not be allowed to obtain information from the future.

The implementation is small.

The idea behind it is not.

These are the kinds of things I find worth writing about.

---

## Technology Is a Stack of Abstractions

One of the things I find most fascinating about computing is how many layers are stacked on top of one another.

A web request can be viewed as:

```text
Application
    ↓
Framework
    ↓
Runtime
    ↓
Operating System
    ↓
Kernel
    ↓
Hardware
    ↓
Physics
```

The same event can be explained at completely different levels.

At the application level:

> "The server received a request."

At the operating-system level:

> "A process received data through a socket."

At the hardware level:

> "A CPU executed instructions while memory and I/O subsystems moved data around."

All of these descriptions can be correct simultaneously.

The interesting question is not always *which one is correct*.

Sometimes it is:

**What happens when we move one layer deeper?**

That question is probably the central theme of this blog.

---

## Engineering Is Full of Trade-offs

Another thing I want to explore is that engineering rarely has universally correct answers.

A larger vocabulary can reduce token sequence length, but it also increases the size of embedding and output layers.

More abstraction can make a system easier to develop, but can also hide performance characteristics.

Caching can make a system dramatically faster, while introducing consistency problems.

Microservices can provide organizational and deployment advantages, while simultaneously introducing network boundaries and operational complexity.

Rust can provide strong compile-time guarantees, but those guarantees come with a different programming model.

More computation can improve accuracy, but computation costs energy, latency, and money.

Technology is full of these trade-offs.

So I am less interested in writing:

> "Technology X is better than Technology Y."

And more interested in asking:

> **"What problem was this technology designed to solve, and what did we trade to solve it?"**

That question tends to lead somewhere more interesting.

---

## Software Engineering

A large part of this blog will naturally revolve around software engineering.

Backend systems. APIs. Databases. Distributed systems. Concurrency. Caching. Messaging. Authentication. Infrastructure. Observability. Architecture. Performance. Programming languages. Developer tooling.

Some articles may be practical. Others may be theoretical. And occasionally I may take something that looks extremely ordinary and investigate what actually happens underneath it.

Because software engineering is full of invisible machinery.

A function call. A database query. A network packet. A process. A thread. A memory allocation. A compiler optimization.

Each one can become a rabbit hole.

---

## Artificial Intelligence

AI will also have a significant place here.

Not simply because AI is currently popular, but because modern AI systems expose some fascinating problems in computer science.

Tokenization. Attention. Transformers. Inference. Quantization. Vector representations. Retrieval. Agents. Model architectures. Training systems. Memory. Optimization.

These topics sit at the intersection of mathematics, statistics, computer science, and engineering.

And I am particularly interested in the engineering side.

What happens when a model has to run on limited hardware? How does inference actually consume memory? Why does quantization work? What does a context window really represent? Where does latency come from? What happens between a user's prompt and the first generated token?

These questions are often more interesting than simply asking which model is currently the best.

---

## Systems and the Machine Beneath the Software

There is another direction I want to explore: systems.

Operating systems. Compilers. CPU architecture. Memory. Storage. Networking. File systems. Runtime design. Low-level programming.

This area is especially interesting because the abstractions become thinner.

Eventually you reach a point where the machine stops being invisible.

Memory is no longer just an abstract object. A process is no longer just an application. A thread is no longer simply "something running." Performance is no longer a number in a benchmark.

The underlying machine starts to matter.

And understanding those boundaries changes how you design software at higher levels.

---

## Open Source and Building Things

Technology is not only about studying existing systems. It is also about building.

I enjoy exploring ideas by implementing them.

Open-source software makes this especially interesting because the implementation is often available for inspection.

Building a small database teaches you things about databases. Building a compiler teaches you things about programming languages. Building an inference engine teaches you things about machine learning systems.

You don't always need to build the next revolutionary product.

Sometimes building a tiny version is enough to understand the original.

---

## How I Want to Write

I want these articles to be more than collections of definitions.

When possible, I want to start with the problem. Then understand the mechanism. Then examine the implementation. Then ask what trade-offs were made. And finally, step back and understand why the design makes sense.

```text
Problem → Constraints → Design → Mechanism → Implementation → Trade-offs → Consequences
```

---

## The Principle

There is one principle I want to keep throughout this blog:

> **"Don't stop at 'it works.' Ask why."**

Why does it work? Why was it designed this way? What assumptions does it make? What happens when those assumptions fail? What are we trading for the convenience? And perhaps most importantly: **What is happening underneath the abstraction?**

Welcome to the rabbit hole.
