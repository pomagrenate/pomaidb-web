---
title: "A Larger Context Window Does Not Remove the Need for RAG"
slug: "larger-context-window-does-not-remove-rag"
series: "AI Engineering Notes"
date: "2026-08-31"
author: "Quan Van"
excerpt: "A large context window sounds like it should make retrieval unnecessary. But after working with constrained local models and explicit retrieval pipelines, I started looking at the problem differently: context capacity and context quality are two different engineering problems."
category: "Engineering"
tags:
  - "AI"
  - "RAG"
  - "LLM"
  - "System Design"
  - "Information Retrieval"
  - "AI Engineering"
  - "Context Engineering"
---

# A Larger Context Window Does Not Remove the Need for RAG

> **Senior AI Engineering Question**
>
> **"If an LLM can already accept a huge context window, why do we still need RAG?"**

This question sounds simple.

It is also one of those questions where the obvious answer is usually incomplete.

A natural reaction is:

```text
Small context
    ↓
Need retrieval

Large context
    ↓
Just put everything into the prompt
```

At first glance, this makes sense.

If the model can read more information, why spend engineering effort building:

```text
retrieval
vector search
chunking
ranking
metadata filtering
context construction
```

instead of simply giving the model everything?

I wanted to understand this distinction more carefully.

The important realization for me was that:

> **Context capacity and context quality are not the same problem.**

A larger context window solves one constraint.

It does not automatically solve information selection.

---

# The Architecture I Was Already Thinking About

In my AI work around the Pomai Ecosystem, I deliberately kept the RAG pipeline explicit rather than hiding everything behind a large AI framework.

The basic flow was:

```text
User Question
      │
      ▼
Intent / Query Handling
      │
      ▼
Retrieval
      │
      ├── Qdrant
      │
      └── Metadata / lexical filtering
      │
      ▼
Relevant Context
      │
      ▼
Prompt Construction
      │
      ▼
Local LLM
      │
      ▼
Answer
```

The interesting part is that the LLM is not responsible for finding everything.

The retrieval system performs a different job:

```text
"What information should the model see?"
```

The LLM then performs another job:

```text
"Given this information, how should I reason about and express an answer?"
```

That separation started to look much more important than I originally thought.

---

# The Context Window Is Not a Database

An LLM context window is fundamentally a sequence of tokens.

Conceptually:

```text
C = [t₁, t₂, t₃, ..., tₙ]
```

where each:

```text
tᵢ
```

is a token.

The model receives that sequence and processes it.

A database has a very different responsibility.

A database can answer questions such as:

```text
Give me all records matching X.

Give me records between these timestamps.

Give me documents belonging to this user.

Give me the top K similar documents.

Give me events from service A.
```

A context window does not inherently provide that data-management semantics.

It is simply the information currently presented to the model.

This distinction sounds obvious, but it changes the way I think about RAG.

---

# More Context Is Not Necessarily More Useful Context

Imagine a knowledge base containing:

```text
10,000 documents
```

and a user asks:

```text
"Why did the payment service become slow?"
```

One possible strategy is:

```text
Retrieve relevant documents
        ↓
Give them to the model
```

Another is:

```text
Give the model everything
```

The second approach increases the amount of information available.

But it also increases the amount of irrelevant information.

So the real optimization problem isn't simply:

```text
maximize context
```

It is closer to:

```text
maximize useful information
subject to context and computation constraints
```

That is a different problem.

---

# Retrieval Is an Information Selection Layer

This made me look at RAG less as:

```text
LLM + Vector Database
```

and more as:

```text
Information Selection
        +
Language Model
```

The retrieval layer tries to reduce a large information space:

```text
D = {d₁, d₂, ..., dₙ}
```

into a smaller relevant subset:

```text
R ⊂ D
```

The LLM then receives something closer to:

```text
Question + R
```

instead of:

```text
Question + D
```

The goal is not necessarily to retrieve everything.

The goal is to retrieve enough of the right information.

---

# Semantic Similarity Is Only One Part of Retrieval

One thing I found particularly interesting from designing the logging pipeline was that semantic search and exact filtering solve different problems.

Suppose I ask:

```text
"Find logs related to database timeouts."
```

Semantic similarity is useful.

A vector search engine can retrieve logs whose meaning is related to:

```text
database timeout
connection timeout
query timeout
database unavailable
```

even if the exact words differ.

But now consider:

```text
"Find logs for user_id = 12345."
```

This is a different problem.

I don't necessarily want:

```text
"logs that semantically resemble user 12345"
```

I want:

```text
exactly user_id = 12345
```

That is why the architecture used both semantic retrieval and structured/lexical filtering.

The important lesson isn't:

> "Vector databases are better."

or:

> "Search engines are better."

It is:

> **Different retrieval mechanisms encode different notions of relevance.**

---

# Relevance Has Multiple Definitions

Consider a document:

```text
Document A
```

It might be semantically similar to the query.

But perhaps it is:

```text
three years old
```

while another document:

```text
Document B
```

is slightly less semantically similar but belongs to:

```text
the current service
the correct user
the correct environment
the correct timestamp range
```

Which one is more relevant?

This means relevance can involve:

```text
semantic similarity
+
metadata
+
time
+
identity
+
source
+
permissions
+
business rules
```

A single embedding similarity score cannot necessarily represent all of these dimensions.

---

# This Is Where Context Engineering Starts

I used to think about prompt engineering primarily as:

```text
"How should I phrase the instruction?"
```

But the more interesting question is:

```text
"What exactly should enter the context?"
```

Suppose:

```text
Question
+
10 highly relevant pieces of evidence
```

versus:

```text
Question
+
1,000 weakly relevant pieces of evidence
```

The second input contains more information.

But that does not mean it is better information.

So prompt construction is only one stage of context engineering.

A broader pipeline looks like:

```text
Knowledge
   ↓
Retrieval
   ↓
Filtering
   ↓
Ranking
   ↓
Compression
   ↓
Context Construction
   ↓
LLM
```

The model is only one component in the chain.

---

# Why This Matters Even More for Small Models

This became especially relevant when I worked with a very small local model.

The model I used in the Pomai AI service was Qwen2.5 0.5B running through llama.cpp.

I chose it because of hardware constraints rather than because it represented the strongest reasoning model available.

That constraint changed the architecture.

A large model might have more capacity to interpret noisy context.

A small model gives me less room for sloppy context construction.

So I wanted to control:

```text
what enters the prompt
how much enters the prompt
what order information appears in
what instructions accompany it
```

This was one of the reasons I preferred a deliberately simple pipeline rather than hiding prompt and retrieval behavior behind heavy abstractions.

---

# The Smaller the Model, the More I Care About the Boundary

This led me to a broader architectural principle:

```text
Weak model
    ↓
Stronger external structure
```

Instead of asking:

```text
"Can the model figure everything out?"
```

I can move some responsibility outside the model.

For example:

```text
Application
    │
    ├── intent routing
    ├── filtering
    ├── retrieval
    ├── context construction
    └── validation
             │
             ▼
           LLM
```

The model becomes one component inside a controlled system.

It doesn't have to be the system.

---

# This Is Also Why I Didn't Need an AI Framework for Everything

One reason I moved away from heavy frameworks in that particular architecture was control.

I wanted the flow to be explicit:

```text
if intent == X:
    retrieve X

elif intent == Y:
    retrieve Y
```

rather than immediately creating an autonomous loop where:

```text
LLM
 ↓
tool
 ↓
LLM
 ↓
tool
 ↓
LLM
 ↓
...
```

The more autonomous the system becomes, the more difficult it can be to reason about:

```text
latency
failure
cost
context growth
tool selection
termination
```

For a small local model, that trade-off becomes particularly interesting.

I wasn't trying to build the most autonomous agent possible.

I was trying to build a system whose behavior I could understand.

---

# RAG Is Not "Giving the Model More Knowledge"

This is probably the biggest conceptual distinction I take away.

A naive description of RAG is:

```text
RAG = LLM + external knowledge
```

A more useful engineering description is:

```text
RAG =
knowledge retrieval
+
relevance estimation
+
context construction
+
generation
```

The retrieval component determines what evidence is available.

The generation component determines how the model uses that evidence.

Those are different responsibilities.

---

# The Hidden Cost of "Just Put Everything in the Prompt"

Even if the context window is technically large enough, there are still engineering questions.

For example:

```text
How do I select the documents?

How do I handle stale information?

How do I enforce user-level access?

How do I prioritize conflicting documents?

How do I handle duplicated information?

How do I deal with extremely long documents?

How do I update knowledge without retraining the model?

How do I trace which source produced an answer?
```

A larger context window doesn't automatically answer these questions.

It only gives us more space.

---

# RAG Also Separates Knowledge From Model Parameters

This is another reason I find retrieval architectures useful.

Suppose application knowledge changes:

```text
old policy
    ↓
new policy
```

If that knowledge exists only inside model parameters, updating it can imply:

```text
new training
```

or some other model-update mechanism.

With retrieval:

```text
Knowledge Store
      ↓
Retriever
      ↓
Current Context
      ↓
LLM
```

the model and knowledge source can evolve more independently.

The model provides general language capabilities.

The retrieval layer provides current application-specific information.

That separation is architecturally attractive.

---

# But RAG Does Not Automatically Make Answers Correct

This is another trap.

Suppose retrieval returns:

```text
wrong documents
```

The model now receives:

```text
Question
+
wrong evidence
```

The LLM may still generate a fluent answer.

So:

```text
good generation
```

doesn't imply:

```text
good retrieval
```

and:

```text
good retrieval
```

doesn't automatically imply:

```text
correct reasoning
```

We therefore have at least two major failure surfaces:

```text
Retrieval Failure
        ↓
Wrong / incomplete context

Generation Failure
        ↓
Bad interpretation of correct context
```

This distinction becomes important when debugging AI systems.

---

# Debugging RAG Is Different From Debugging a Normal API

Suppose a traditional API returns the wrong result.

I might inspect:

```text
request
 ↓
business logic
 ↓
database query
 ↓
response
```

With RAG:

```text
request
 ↓
query transformation
 ↓
retrieval
 ↓
ranking
 ↓
context construction
 ↓
prompt
 ↓
LLM inference
 ↓
generated answer
```

Now a wrong answer can originate from multiple stages.

For example:

```text
Case 1:
Retriever returned irrelevant documents.

Case 2:
Retriever returned the correct documents,
but omitted an important one.

Case 3:
Context was correct,
but the prompt constructed it poorly.

Case 4:
Context was correct,
but the model misunderstood it.

Case 5:
Everything was correct,
but the final output formatting introduced an error.
```

That means observability for AI systems has to go deeper than:

```text
HTTP 200
```

---

# This Connects Back to My Logging Architecture

This is where my previous work on AI-driven observability becomes interesting.

A normal application log might tell me:

```text
retrieval_service: 200
```

That isn't enough to understand the quality of a RAG response.

Ideally I want to reason about the pipeline:

```text
query
 ↓
retrieved documents
 ↓
scores
 ↓
context
 ↓
model response
```

The system therefore starts looking less like:

```text
LLM API
```

and more like:

```text
AI pipeline
```

with multiple measurable stages.

---

# A Better Mental Model

Instead of:

```text
        ┌─────────┐
Question│   LLM   │Answer
───────►│         │──────►
        └─────────┘
```

I now prefer thinking:

```text
                    ┌─────────────┐
                    │ Knowledge   │
                    │ Store       │
                    └──────┬──────┘
                           │
                           ▼
Question → Retrieval → Filtering → Context → LLM → Answer
              │             │
              │             │
              └─────────────┘
                Relevance
```

The LLM is still important.

But it isn't the entire architecture.

---

# What I Learned

The biggest thing I took away is that:

> **A context window is a capacity constraint, while retrieval is an information-selection mechanism.**

Increasing one doesn't automatically eliminate the need for the other.

This distinction also changed how I think about AI architecture in general.

Instead of asking:

```text
"Which model should I use?"
```

I increasingly want to ask:

```text
"What responsibility should belong to the model,
and what responsibility should belong to the surrounding system?"
```

That is a much more interesting engineering question.

---

# What Surprised Me

The surprising part isn't that RAG is useful.

It is that the value of RAG doesn't fundamentally come from making the context bigger.

It comes from making the context **more intentional**.

The architecture is effectively trying to transform:

```text
Huge Knowledge Space
```

into:

```text
Small Relevant Evidence Set
```

before asking the model to reason.

That makes RAG feel less like an "AI trick" and more like an information retrieval problem with a generative model attached to it.

---

# What I Would Explore Next

There are several things I would want to investigate experimentally before making stronger claims:

```text
1. How retrieval quality changes as the candidate set grows.

2. How much irrelevant context a particular model can tolerate.

3. Whether reranking consistently improves answer quality.

4. How different chunking strategies affect retrieval.

5. How metadata filtering interacts with semantic retrieval.

6. How context compression affects factual accuracy.

7. How small and large models respond differently to noisy context.

8. How retrieval latency changes as the knowledge base grows.

9. How to evaluate retrieval independently from generation.

10. How to trace the complete evidence path of a generated answer.
```

I haven't benchmarked all of these in this project, so I don't want to turn them into conclusions.

For me, they are the next questions.

---

# The Interview Question

> **"If modern LLMs have very large context windows, why would you still use RAG?"**

A concise answer I'd give is:

> "A larger context window increases the amount of information the model can process, but it doesn't solve information selection. RAG separates retrieval from generation: the retrieval layer identifies relevant evidence from a larger knowledge space, while the LLM reasons over the selected context. This gives the system more control over relevance, freshness, metadata filtering, access boundaries, and observability. So I don't see RAG simply as a workaround for small context windows. I see it as an architectural mechanism for controlling what information reaches the model."

---

# Final Thought

The more I work with AI systems, the less I think about:

```text
"How do I make the model do everything?"
```

and the more I think about:

```text
"What is the smallest responsibility
I actually need the model to perform?"
```

That distinction matters.

A model can generate.

A retriever can retrieve.

A database can enforce structure.

A service can enforce business rules.

A validator can reject invalid output.

And an observability pipeline can tell us what happened.

The interesting AI system is often not the model itself.

## It is the architecture around it.

*This post is part of my ongoing exploration of AI engineering, system design, and the practical boundaries between models and the software systems that surround them.*
