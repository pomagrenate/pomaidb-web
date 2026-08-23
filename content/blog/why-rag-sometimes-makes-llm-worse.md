---
title: "BLOG: Why Does RAG Sometimes Make an LLM Worse?"
slug: "why-rag-sometimes-makes-llm-worse"
date: "2026-08-23"
author: "Quan Van"
excerpt: "RAG is often presented as the obvious solution to hallucination. But retrieval can also make an LLM less accurate, less confident, and sometimes completely wrong. Let's understand why."
tags:
  - AI
  - LLM
  - RAG
  - Retrieval-Augmented Generation
  - Machine Learning
  - Information Retrieval
  - Backend Engineering
  - AI Engineering
  - Senior Engineering
category: "Artificial Intelligence"
---

# Why Does RAG Sometimes Make an LLM Worse?

> **Senior AI Engineer Question**
>
> **"If RAG gives an LLM additional knowledge, why can adding RAG actually make the answer worse than using the LLM alone?"**

This is one of those questions that looks simple.

Most developers learn RAG as:

```text
User Question
      ↓
Embedding
      ↓
Vector Search
      ↓
Relevant Documents
      ↓
LLM
      ↓
Answer
````

The intuition is:

> **More context = more knowledge = better answer.**

Unfortunately, that's not how language models work.

Sometimes:

```text
LLM
 ↓
good answer
```

becomes:

```text
LLM + RAG
 ↓
wrong answer
```

And this isn't necessarily because the model is bad.

The retrieval system itself may have introduced:

```text
irrelevant context
contradictory context
outdated context
incomplete context
duplicated context
misleading context
```

The important lesson is:

> **RAG does not automatically add knowledge. It adds evidence. Bad evidence can make reasoning worse.**

---

# 1. RAG Is Not a Knowledge Upgrade

Let's define the problem properly.

A normal LLM receives:

```text
Q
```

and generates:

```text
A = LLM(Q)
```

A RAG system instead generates:

```text
A = LLM(Q, C)
```

where:

```text
Q = user question
C = retrieved context
```

The entire quality of RAG therefore depends on:

```text
Retrieval Quality
+
Context Quality
+
Context Interpretation
+
Generation Quality
```

Not just:

```text
LLM Quality
```

This distinction is extremely important.

---

# 2. The Hidden Assumption Behind RAG

Most simple RAG implementations assume:

```text
Retrieved document
       ↓
Relevant
       ↓
Correct
       ↓
Useful
```

But these are four different properties.

A document can be:

### Relevant

It talks about the same topic.

### Correct

Its information is factually correct.

### Useful

It actually helps answer the question.

### Current

Its information is still valid.

These properties are not equivalent.

---

# 3. Example

Imagine the user asks:

> "How do I configure authentication in version 3?"

The retriever finds:

```text
Document A:
Authentication configuration for version 3
```

Great.

But also:

```text
Document B:
Authentication configuration for version 2
```

Both contain:

```text
authentication
configuration
version
```

The embedding similarity can be high.

But:

```text
Version 2 ≠ Version 3
```

Now the LLM receives:

```text
Version 3 information
+
Version 2 information
```

The model must figure out which one is correct.

We just transformed:

```text
simple question
```

into:

```text
information reconciliation problem
```

---

# 4. Retrieval Is an Information Selection Problem

A RAG system isn't fundamentally:

> "Find some documents."

It's:

> **"Find the smallest set of evidence that maximizes the probability of answering the question correctly."**

That's a much harder problem.

Suppose we retrieve:

```text
Top 10 documents
```

but only:

```text
2 documents
```

are actually useful.

Then:

```text
8 irrelevant documents
```

become noise.

The model now has to reason through the noise.

---

# 5. More Context Can Cause Context Dilution

Imagine:

```text
Question
+
Relevant context
```

produces:

```text
accurate answer
```

Now add:

```text
20 unrelated chunks
```

The model has more tokens.

But not necessarily more useful information.

Conceptually:

```text
Signal:
██████████

Noise:
████████████████████████████
```

The model's attention has to operate over a much larger information space.

This is one reason:

> **Retrieving everything is not a retrieval strategy.**

---

# 6. The "Top-K" Trap

A common RAG configuration looks like:

```text
top_k = 5
```

Why 5?

Often:

> "Because 5 seems reasonable."

But there is no universal correct value.

For one query:

```text
k = 2
```

may be ideal.

For another:

```text
k = 10
```

may be necessary.

For another:

```text
k = 0
```

may actually be the correct choice.

This leads to an important concept:

> **Retrieval should be query-dependent.**

---

# 7. Retrieval Confidence

Instead of always doing:

```text
retrieve top 5
```

we can evaluate similarity.

Suppose:

```text
Chunk A = 0.94
Chunk B = 0.91
Chunk C = 0.52
Chunk D = 0.48
Chunk E = 0.45
```

Maybe:

```text
0.94
0.91
```

are genuinely relevant.

The rest may simply be the "least bad" results.

Vector search always returns something.

That doesn't mean the results are useful.

---

# 8. The Empty Retrieval Problem

This is one of the most important cases.

User asks:

> "What is the internal deployment process for service X?"

But the knowledge base contains nothing about it.

Vector search might still return:

```text
Deployment documentation for service Y
Deployment documentation for service Z
Generic Kubernetes documentation
```

Why?

Because the vector database has to return nearest neighbors.

So the system might produce:

```text
Question
 ↓
No actual answer exists
 ↓
Retriever returns vaguely related documents
 ↓
LLM sees documents
 ↓
LLM assumes they are relevant
 ↓
Hallucinated answer
```

The correct behavior should sometimes be:

```text
"I don't have enough information to answer this."
```

---

# 9. Retrieval Should Be Allowed to Fail

A mature RAG system should have:

```text
RELEVANT
```

and:

```text
NOT_RELEVANT
```

as possible outcomes.

Not:

```text
ALWAYS_RETURN_TOP_K
```

This is a major architectural distinction.

---

# 10. Semantic Similarity Is Not Semantic Correctness

Embeddings answer something approximately like:

> "How similar are these texts in semantic representation?"

They do not directly answer:

> "Is this document the correct evidence for this question?"

For example:

```text
Question:
How do I reset a user's password?
```

A document saying:

```text
How administrators authenticate users
```

may be semantically close.

But it doesn't answer the question.

So:

```text
similarity
```

is a proxy.

Not truth.

---

# 11. Dense Retrieval Has Blind Spots

Vector search is excellent at semantic matching.

But some queries depend heavily on exact information.

For example:

```text
API version:
v1.12.7
```

or:

```text
Error:
ERR_AUTH_4012
```

or:

```text
Function:
CreateSession()
```

Exact lexical matching can be extremely important.

This is why serious retrieval systems often combine:

```text
Dense Retrieval
+
Sparse Retrieval
```

For example:

```text
BM25
+
Embedding Search
```

---

# 12. Hybrid Search

A simplified architecture:

```text
                    Query
                      │
              ┌───────┴───────┐
              ▼               ▼
        Vector Search      BM25 Search
              │               │
              └───────┬───────┘
                      ▼
                  Fusion
                      │
                      ▼
                Final Results
```

Dense retrieval captures:

```text
semantic similarity
```

Sparse retrieval captures:

```text
exact terms
```

Together they can be much more robust.

---

# 13. But Hybrid Search Still Isn't Enough

Suppose retrieval returns:

```text
10 documents
```

They are all potentially relevant.

We still have a ranking problem.

Which document should come first?

This is where:

> **Reranking**

becomes useful.

---

# 14. Reranking

Instead of:

```text
Query
 ↓
Vector DB
 ↓
Top 5
 ↓
LLM
```

we can do:

```text
Query
 ↓
Retriever
 ↓
Top 30
 ↓
Reranker
 ↓
Top 5
 ↓
LLM
```

The first-stage retriever optimizes for:

```text
high recall
```

The reranker optimizes for:

```text
high precision
```

This separation is powerful.

---

# 15. Recall vs Precision

Imagine the knowledge base contains:

```text
100 relevant documents
```

Our retriever returns:

```text
20 documents
```

If:

```text
15
```

are relevant:

```text
Recall = 15 / 100 = 15%
```

Not great.

But precision:

```text
15 / 20 = 75%
```

is reasonable.

A first-stage retriever often prefers higher recall.

Then reranking improves precision.

---

# 16. Why Not Just Use the LLM as the Retriever?

You could ask an LLM:

> "Which documents are relevant?"

Potentially.

But using an LLM for every retrieval operation can be:

```text
expensive
slow
hard to scale
```

A typical architecture therefore separates:

```text
cheap retrieval
```

from:

```text
expensive reasoning
```

This is an important systems principle:

> **Use cheap mechanisms to narrow the search space before expensive reasoning.**

---

# 17. Chunking Is More Important Than People Think

Suppose we have a document:

```text
100 pages
```

and split it into:

```text
500-token chunks
```

This seems reasonable.

But chunk boundaries matter.

Imagine:

```text
Chunk 1:
The authentication middleware validates the token.

Chunk 2:
If validation fails, the request is rejected with 401.
```

If the user asks:

> "What happens when authentication fails?"

Retrieving only:

```text
Chunk 2
```

may be sufficient.

But some questions require:

```text
Chunk 1 + Chunk 2
```

The retrieval unit determines what evidence the model sees.

---

# 18. Bad Chunking Creates False Context

Imagine:

```text
Chunk A:
Product X supports feature Y.

Chunk B:
Product Z does NOT support feature Y.
```

If metadata is lost during chunking, the model may see:

```text
does NOT support feature Y
```

without knowing:

```text
Product Z
```

Now the information itself is technically correct.

But the context is semantically incomplete.

This is a classic RAG failure.

---

# 19. Context Must Preserve Identity

When chunking documents, preserve metadata such as:

```text
document_id
title
section
product
version
timestamp
author
source
```

Instead of:

```text
Chunk:
"The service supports OAuth2."
```

prefer something conceptually like:

```text
Document: Authentication Guide
Product: Pomai API
Version: 3.2
Section: OAuth2

"The service supports OAuth2."
```

Now the model has provenance.

---

# 20. Metadata Filtering

Suppose the user asks:

> "How does authentication work in version 3?"

Instead of searching the entire database:

```text
Vector Search(all documents)
```

we can filter:

```text
version = 3
product = X
```

then perform semantic search.

Conceptually:

```text
Query
 ↓
Metadata Filter
 ↓
Candidate Documents
 ↓
Vector Search
 ↓
Reranking
```

This can drastically reduce false positives.

---

# 21. Retrieval Is Often a Database Query Problem

This is an underrated perspective.

Traditional database query:

```text
SELECT *
FROM documents
WHERE product = 'X'
AND version = '3';
```

Semantic retrieval:

```text
Find documents semantically related to Q
```

A mature system often combines both.

For example:

```text
WHERE:
    product = X
    version = 3
```

then:

```text
ORDER BY semantic_similarity
```

This is much more powerful than blindly searching everything.

---

# 22. Query Rewriting

The user might ask:

> "How do I make it work?"

That's terrible for retrieval.

A query rewriting layer can transform it into:

```text
"What configuration is required to enable feature X?"
```

Or perhaps:

```text
"feature X configuration documentation"
```

This improves retrieval.

But query rewriting has its own danger:

> **The LLM can misunderstand the user's intent before retrieval even starts.**

Now the system can fail before the vector database is involved.

---

# 23. Multi-Query Retrieval

One query may have multiple interpretations.

For example:

> "How does authentication work?"

Could mean:

```text
OAuth2
JWT
session authentication
API keys
middleware
authorization
```

We can generate multiple retrieval queries:

```text
Q1 = authentication architecture
Q2 = JWT authentication
Q3 = OAuth2 flow
Q4 = authorization middleware
```

Then merge results.

This can increase recall.

But again:

```text
more queries
→
more candidates
→
more noise
```

So reranking becomes even more important.

---

# 24. RAG Is a Pipeline, Not a Single Algorithm

A serious architecture might look like:

```text
                 User Query
                     │
                     ▼
              Query Analysis
                     │
                     ▼
              Query Rewriting
                     │
                     ▼
             Metadata Filtering
                     │
             ┌───────┴────────┐
             ▼                ▼
        Dense Search       BM25 Search
             │                │
             └───────┬────────┘
                     ▼
                  Fusion
                     │
                     ▼
                Reranking
                     │
                     ▼
             Context Selection
                     │
                     ▼
                  LLM
                     │
                     ▼
                Validation
                     │
                     ▼
                 Response
```

At this point, RAG starts looking much less like:

```text
"just use a vector database"
```

and much more like:

> **Information retrieval engineering.**

---

# 25. The LLM Should Not Blindly Trust Retrieval

This is a critical design principle.

Your system prompt shouldn't imply:

```text
"Always answer using retrieved context."
```

A better instruction is conceptually:

```text
Use retrieved context as evidence.

If the evidence is insufficient,
say that the information is insufficient.

Do not invent missing facts.

If sources conflict,
identify the conflict instead of silently choosing one.
```

This gives the model an escape hatch.

---

# 26. Evidence-Based Generation

A strong RAG system should conceptually perform:

```text
Question
   ↓
Evidence
   ↓
Reasoning
   ↓
Answer
```

rather than:

```text
Question
   ↓
Retrieved text
   ↓
Generate something plausible
```

The distinction is subtle but enormous.

---

# 27. Contradictory Documents

Suppose retrieval returns:

```text
Document A:
Timeout = 30 seconds

Document B:
Timeout = 60 seconds
```

What should the LLM do?

A weak RAG system:

```text
chooses one
```

A stronger system:

```text
detects conflict
```

and responds:

> "The available documentation is inconsistent. One document specifies 30 seconds while another specifies 60 seconds."

Then:

```text
version metadata
timestamp
source authority
```

can determine which is authoritative.

---

# 28. Source Authority

Not every document should have equal weight.

For example:

```text
Official documentation
        >
Internal engineering documentation
        >
Generated notes
        >
User-generated content
```

You can encode this as metadata:

```text
source_priority
```

Then ranking becomes:

```text
semantic relevance
+
source authority
+
recency
+
version compatibility
```

This is far more realistic than pure cosine similarity.

---

# 29. Recency Matters

Suppose:

```text
2022:
API uses authentication method A

2026:
API migrated to authentication method B
```

Both documents can be highly relevant.

But only one is current.

So retrieval should sometimes consider:

```text
relevance
+
timestamp
```

not relevance alone.

---

# 30. The RAG Context Window Problem

Modern LLMs support large context windows.

That does not mean:

> "Put the entire database into the prompt."

Large context has costs:

```text
latency
cost
attention complexity
noise
```

And more importantly:

> **The model may not use every piece of context equally well.**

The objective isn't:

```text
maximize context
```

It's:

```text
maximize useful evidence
```

---

# 31. Context Compression

Suppose retrieval produces:

```text
20 chunks
```

Instead of directly sending them to the LLM, we can compress them:

```text
20 chunks
   ↓
relevant facts
   ↓
5 concise evidence blocks
   ↓
LLM
```

This reduces noise.

But compression can remove important details.

So again:

```text
compression
```

is a trade-off.

---

# 32. Lost-in-the-Middle

One interesting failure mode is that models may not use information equally depending on where it appears in a long context.

Conceptually:

```text
Context:

[Important]
[Noise]
[Noise]
[Noise]
[Important]
[Noise]
[Noise]
[Noise]
[Important]
```

The model's ability to use all of this isn't guaranteed to be uniform.

This is another reason to avoid:

```text
"just stuff everything into the prompt"
```

---

# 33. RAG vs Fine-Tuning

Another common interview question:

> **"When should you use RAG versus fine-tuning?"**

A useful distinction:

### RAG

Best when the model needs:

```text
external knowledge
frequently changing information
private documents
citations
retrievable facts
```

### Fine-tuning

Best when you want to change:

```text
behavior
style
format
task specialization
response patterns
```

Fine-tuning is generally not the ideal mechanism for continuously changing factual knowledge.

---

# 34. RAG Doesn't Teach the Model

This is a common misunderstanding.

If we provide:

```text
Company policy:
Employees receive 15 days PTO.
```

through RAG, the model hasn't learned:

```text
15 days PTO
```

as a new permanent parameter.

It simply received:

```text
context
```

for this generation.

Next request:

```text
without retrieval
```

may not contain that information.

That's the key distinction between:

```text
in-context knowledge
```

and:

```text
parametric knowledge
```

---

# 35. Parametric vs Non-Parametric Knowledge

LLMs primarily store knowledge in:

```text
parameters
```

RAG provides:

```text
external memory
```

Conceptually:

```text
             LLM
          ┌────────┐
          │Weights │
          └───┬────┘
              │
              │
       ┌──────▼──────┐
       │ External    │
       │ Knowledge   │
       └─────────────┘
```

This makes RAG similar to giving the model a dynamically searchable memory.

But memory quality matters.

---

# 36. A Better Mental Model

Don't think:

```text
RAG = LLM + Vector DB
```

Think:

```text
RAG =
Information Retrieval
+
Evidence Selection
+
Context Construction
+
Language Reasoning
```

And each layer can fail independently.

---

# 37. How Would You Evaluate a RAG System?

This is another Senior interview question.

Bad answer:

> "We ask users if the answers look good."

Useful, but insufficient.

You need to evaluate multiple layers.

---

# 38. Retrieval Metrics

For retrieval:

```text
Recall@K
Precision@K
MRR
NDCG
```

These answer questions like:

> Did we retrieve the relevant evidence?

---

# 39. Generation Metrics

For generation:

```text
answer correctness
faithfulness
groundedness
citation correctness
```

These answer:

> Did the model produce an answer supported by the evidence?

---

# 40. End-to-End Evaluation

Ultimately:

```text
Question
 ↓
Retrieval
 ↓
Generation
 ↓
Answer
```

needs evaluation as a complete system.

You can have:

```text
excellent retrieval
+
terrible generation
```

or:

```text
excellent LLM
+
terrible retrieval
```

and both produce poor results.

---

# 41. Build a Golden Dataset

A serious RAG project should have a dataset like:

```text
Question
Expected Evidence
Expected Answer
Source
Metadata
```

For example:

```text
Question:
How long does a JWT remain valid?

Evidence:
Authentication Guide → Section 4

Expected:
JWT expires after 15 minutes.
```

Then every retrieval change can be evaluated automatically.

---

# 42. Why This Matters in Production

Imagine you change:

```text
chunk_size:
500 → 1000
```

Your subjective impression:

> "Seems fine."

But the evaluation might show:

```text
Recall@5:
91% → 78%

Faithfulness:
94% → 86%
```

Now you know the change was harmful.

Without evaluation:

```text
"it feels better"
```

becomes your engineering methodology.

That's dangerous.

---

# 43. RAG Is an Information Architecture Problem

At a senior level, the interesting question isn't:

> "Which embedding model should I use?"

It's:

> **"How should information flow through the system so that the model receives the right evidence at the right time?"**

That leads to decisions around:

```text
document ingestion
chunking
metadata
indexing
retrieval
reranking
context construction
source authority
versioning
evaluation
observability
```

The embedding model is only one piece.

---

# 44. Production RAG Needs Observability

For every request, you want to know:

```text
query
rewritten_query
retrieved_documents
similarity_scores
reranker_scores
final_context
model
latency
token_usage
answer
citations
```

Without this, debugging becomes:

```text
"Why did the AI answer incorrectly?"
```

followed by:

```text
"I don't know."
```

You need to know whether the failure happened in:

```text
retrieval
ranking
context construction
generation
```

---

# 45. Trace the Entire Request

A useful trace:

```text
Request
 │
 ├── Query Rewrite: 40ms
 │
 ├── Vector Search: 20ms
 │
 ├── BM25: 10ms
 │
 ├── Reranking: 80ms
 │
 ├── Context Build: 5ms
 │
 └── LLM: 900ms
```

Now you can reason about:

```text
latency
cost
quality
```

instead of guessing.

---

# 46. The Most Dangerous RAG Failure

The most dangerous failure isn't:

```text
"No answer."
```

It's:

```text
Confidently wrong answer
```

Because users can detect:

```text
"I don't know."
```

But they may trust:

```text
"The timeout is 30 seconds."
```

even if:

```text
the correct value is 60 seconds.
```

Therefore:

> **Uncertainty handling is part of RAG design.**

---

# 47. RAG Should Know When Not to Answer

A mature system should be able to produce:

```text
I don't have sufficient evidence
to answer this reliably.
```

This is not a failure.

It can actually be a success condition.

If:

```text
False Positive Answer Cost
>
False Negative Answer Cost
```

then conservative behavior is desirable.

---

# 48. The Senior-Level Architecture

A production-oriented RAG system might therefore look like:

```text
                       User Query
                           │
                           ▼
                   Intent Detection
                           │
                           ▼
                    Query Rewriting
                           │
                           ▼
                  Metadata Filtering
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        Dense Retrieval           Sparse Retrieval
              │                         │
              └────────────┬────────────┘
                           ▼
                         Fusion
                           │
                           ▼
                       Reranker
                           │
                           ▼
                  Evidence Selection
                           │
                           ▼
                  Context Construction
                           │
                           ▼
                         LLM
                           │
                           ▼
                  Grounding Check
                           │
                           ▼
                  Citation / Answer
```

And surrounding the entire system:

```text
        ┌───────────────────────────────┐
        │        Observability          │
        │                               │
        │ latency                       │
        │ retrieval scores              │
        │ token usage                   │
        │ answer quality                │
        │ failures                      │
        └───────────────────────────────┘
```

---

# 49. The Interview Answer

If an interviewer asks:

> **"Why can RAG make an LLM worse?"**

A strong Senior answer would be:

> "Because RAG doesn't inherently provide correct information; it provides retrieved context. If retrieval returns irrelevant, outdated, contradictory, or incomplete evidence, the LLM may incorporate that information into its reasoning and produce a worse answer than it would have produced from its own parametric knowledge.
>
> I'd therefore treat RAG as an information retrieval pipeline rather than simply a vector database lookup. I'd use metadata filtering, potentially hybrid dense and sparse retrieval, reranking, and confidence thresholds to improve evidence quality. I'd also explicitly allow the system to return 'insufficient evidence' when retrieval fails.
>
> Finally, I'd evaluate retrieval and generation separately using metrics such as Recall@K and ranking metrics for retrieval, and groundedness, correctness, and citation accuracy for generation. In production I'd trace the entire pipeline so we can determine whether an incorrect answer originated from retrieval, ranking, context construction, or generation."

---

# 50. Follow-Up Question

> **"If the LLM already knows the answer, should you still use RAG?"**

Not necessarily.

This is where blindly applying RAG becomes dangerous.

If the question is:

> "What is HTTP?"

and the model has reliable parametric knowledge:

```text
RAG may add nothing.
```

But if the question is:

> "What is our company's internal HTTP gateway configuration?"

then:

```text
RAG becomes essential.
```

The correct architecture depends on:

```text
Question
+
Knowledge source
+
Freshness requirement
+
Reliability requirement
```

---

# 51. The Deeper Lesson

The interesting thing about RAG is that it changes the nature of the AI problem.

Without RAG:

```text
Can the model answer?
```

With RAG:

```text
Can we retrieve the correct evidence?
Can we rank it correctly?
Can we construct the context correctly?
Can the model reason over it?
Can we detect unsupported answers?
```

We have transformed:

```text
LLM problem
```

into:

```text
LLM
+
Search
+
Ranking
+
Data Engineering
+
Backend Engineering
+
Evaluation
```

That's why production AI engineering is much more than calling:

```text
client.chat.completions.create(...)
```

---

# Final Takeaways

```text
1. RAG does not automatically improve an LLM.

2. Retrieved context can be wrong, irrelevant, outdated, or contradictory.

3. Vector similarity is not the same as factual relevance.

4. A retriever should be allowed to return "no useful evidence."

5. Top-K should not be treated as a universal constant.

6. Hybrid retrieval combines semantic and lexical matching.

7. Reranking separates recall from precision.

8. Metadata is extremely important for version, product, source, and time.

9. Chunking determines the retrieval unit and can destroy context if done poorly.

10. Query rewriting can improve retrieval but can also introduce new errors.

11. More context is not always better.

12. RAG should be evaluated at both retrieval and generation levels.

13. Production RAG needs observability across the entire pipeline.

14. A good RAG system knows when it does not have enough evidence.

15. The real objective isn't maximizing retrieved documents.

16. The objective is maximizing useful evidence for the current question.
```

---

# One Sentence to Remember

> **RAG doesn't make an LLM smarter by giving it more text; it makes the system better only when it gives the model the right evidence.**