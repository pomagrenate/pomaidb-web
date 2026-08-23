---
title: "CASE STUDY: Why Doesn't Increasing the Database Connection Pool Always Increase Throughput?"
slug: "case-study-database-connection-pool-throughput"
date: "2026-08-23"
author: "Quan Van"
excerpt: "A Senior-level interview case study about a deceptively simple production problem: your API is slow, so you increase the database connection pool — and the system gets even worse."
tags: ["System Design", "Database", "Backend", "Performance", "Concurrency", "Connection Pool", "PostgreSQL", "Interview"]
category: "Senior Engineering"
---

# CASE STUDY: Why Doesn't Increasing the Database Connection Pool Always Increase Throughput?

> **Senior Interview Question**
>
> **"Your API is slow. The database connection pool is exhausted, so you increase the pool size from 20 to 100. Instead of getting faster, the application becomes even slower. Why?"**

This is a deceptively simple question.

A Junior answer might be:

> "Because the database doesn't have enough resources."

That's possible.

But a Senior engineer should immediately ask:

> **"What resource is actually saturated?"**

Because a database connection is not a unit of performance.

It is a **concurrency slot**.

And increasing concurrency does not automatically increase throughput.

Sometimes it does the exact opposite.

---

# 1. Start With the Obvious Model

Suppose we have:

```text
API Server
    ↓
Connection Pool
    ↓
PostgreSQL
````

Initially:

```text
Pool size = 20
```

We observe:

```text
CPU: 40%
DB CPU: 50%
Requests: 2,000 req/s
p99 latency: 300ms
```

Someone suggests:

> "The pool is exhausted. Increase it to 100."

So we do:

```text
Pool size = 100
```

Now:

```text
CPU: 95%
DB CPU: 100%
Requests: 1,500 req/s
p99 latency: 2.5s
```

We made the system worse.

Why?

---

# 2. The First Important Distinction

We need to distinguish:

```text
Concurrency
```

from:

```text
Throughput
```

Concurrency means:

> How many operations are executing or waiting at the same time?

Throughput means:

> How much useful work does the system complete per unit of time?

For example:

```text
20 concurrent queries
→ 2,000 queries/sec
```

does not imply:

```text
100 concurrent queries
→ 10,000 queries/sec
```

The relationship isn't linear.

A system eventually reaches a bottleneck.

After that:

```text
More concurrency
        ↓
More contention
        ↓
More waiting
        ↓
More overhead
        ↓
Less useful throughput
```

---

# 3. Little's Law Gives Us a Useful Mental Model

One of the most useful equations here is:

$$
L = \lambda W
$$

where:

```text
L = average number of items in the system
λ = throughput
W = average time spent in the system
```

For a request system:

```text
Concurrency = Throughput × Latency
```

Suppose:

```text
Throughput = 2,000 req/s
Latency = 50ms
```

Then:

$$
L = 2000 \times 0.05 = 100
$$

So approximately:

```text
100 concurrent requests
```

are present in the system.

But this does **not** mean we should automatically configure:

```text
100 database connections
```

because not every request is necessarily using a database connection for its entire lifetime.

That's the first trap.

---

# 4. HTTP Concurrency Is Not Database Concurrency

Imagine a request:

```text
HTTP Request
    ↓
Authentication
    ↓
Validation
    ↓
Business Logic
    ↓
Database
    ↓
External API
    ↓
Serialization
    ↓
Response
```

The request may exist for:

```text
500ms
```

but perhaps it only needs a database connection for:

```text
20ms
```

Therefore:

```text
HTTP concurrency ≠ DB connection concurrency
```

This distinction matters enormously.

A server might handle:

```text
10,000 concurrent HTTP requests
```

while only needing:

```text
100 database connections
```

at a particular moment.

---

# 5. What Does a Database Connection Actually Represent?

A database connection is not just:

```text
socket = true
```

It usually represents server-side resources too.

Depending on the database, each connection can involve:

```text
Network socket
Authentication/session state
Memory
Backend process/thread/task
Transaction state
Locks
Buffers
Query execution state
```

So if we increase:

```text
20 connections
```

to:

```text
500 connections
```

we aren't simply giving the application "more power."

We're asking the database to manage significantly more simultaneous work.

---

# 6. The Database Has Finite Resources

Imagine the database has:

```text
16 CPU cores
64 GB RAM
NVMe storage
```

Suppose a query requires:

```text
5ms CPU
```

and:

```text
10ms I/O
```

At some point, adding more concurrent queries doesn't increase useful work.

Instead, queries begin competing for:

```text
CPU
Memory
Disk I/O
Buffer cache
Locks
Indexes
Internal latches
Network
```

The system enters a contention regime.

Conceptually:

```text
                    Throughput
                       ▲
                       │          ________
                       │        /
                       │      /
                       │    /
                       │  /
                       │ /
                       └──────────────────► Concurrency
                              ^
                              |
                         Saturation
```

Before saturation:

```text
More concurrency
→ More throughput
```

After saturation:

```text
More concurrency
→ More contention
→ More latency
```

And eventually:

```text
More concurrency
→ Less throughput
```

---

# 7. The Interview Trap

The interviewer may ask:

> "The connection pool is exhausted. What do you do?"

The obvious answer is:

> "Increase the pool."

A Senior answer should be:

> "I wouldn't change the pool size yet. I'd first determine whether the pool is exhausted because the database is under-provisioned, queries are slow, transactions are held too long, or the application is generating excessive concurrency."

That difference is important.

You're not treating:

```text
Pool exhaustion
```

as the root cause.

You're treating it as:

```text
A symptom
```

---

# 8. What Can Cause Pool Exhaustion?

There are many possibilities.

## Slow queries

```text
Query takes 2 seconds
        ↓
Connection held for 2 seconds
        ↓
Pool fills up
```

---

## Long transactions

```text
BEGIN
   ↓
Query
   ↓
Business logic
   ↓
External API
   ↓
Another query
   ↓
COMMIT
```

If the transaction stays open while calling an external service:

```text
Database connection
        ↓
blocked for external network latency
```

That's terrible resource utilization.

---

## N+1 Queries

One request may unexpectedly execute:

```text
1 query
+
100 queries
```

instead of:

```text
1 query
```

Under load, this can explode database concurrency.

---

## Connection leaks

If connections aren't returned to the pool:

```text
Request 1 → connection
Request 2 → connection
Request 3 → connection
...
```

eventually:

```text
Pool exhausted
```

even if the database itself is healthy.

---

## Excessive application concurrency

Suppose:

```text
10,000 requests
```

arrive simultaneously.

If every request immediately tries to acquire a database connection:

```text
10,000
   ↓
connection pool
   ↓
100 active
   ↓
9,900 waiting
```

The application has effectively created a queue.

---

# 9. A Connection Pool Is a Queue

This is a useful mental model.

Suppose:

```text
Pool size = 20
```

and:

```text
100 requests
```

need a database connection.

Then:

```text
20 → executing
80 → waiting
```

The pool is performing admission control.

Conceptually:

```text
Requests
   │
   ▼
┌──────────────────┐
│ Connection Pool  │
│                  │
│ [20 connections] │
└────────┬─────────┘
         │
         ▼
     Database
```

Increasing the pool changes the number of requests that can enter the database concurrently.

It does not make each query faster.

---

# 10. The Critical Question: Where Is the Queue?

Suppose:

```text
Pool = 20
```

and:

```text
20 connections active
80 requests waiting
```

We might think:

> "The queue is the problem."

But we need to ask:

> **Why are those 20 connections occupied?**

Maybe:

```text
Query latency = 500ms
```

If we optimize the query to:

```text
Query latency = 50ms
```

the same pool can process much more work.

We didn't increase:

```text
Pool = 20 → 100
```

We improved:

```text
Work per connection
```

This is often much more valuable.

---

# 11. Queueing Theory Explains the Collapse

Imagine the database can sustainably process:

```text
5,000 queries/sec
```

but the application sends:

```text
6,000 queries/sec
```

The difference is:

```text
1,000 queries/sec
```

of excess demand.

The queue grows.

```text
t0 → 1,000 waiting
t1 → 2,000 waiting
t2 → 3,000 waiting
t3 → 4,000 waiting
```

Latency increases.

Eventually:

```text
Timeouts
```

appear.

Then clients retry.

Now traffic becomes:

```text
Original requests
+
Retries
```

which creates even more load.

This can become a positive feedback loop.

---

# 12. Retry Storm

Consider:

```text
Database overloaded
       ↓
Queries become slow
       ↓
Requests timeout
       ↓
Clients retry
       ↓
More queries
       ↓
Database becomes more overloaded
       ↓
More timeouts
```

This is a classic cascading failure pattern.

The database wasn't necessarily destroyed by the original traffic.

It may have been destroyed by:

> **the system's reaction to overload.**

This is why Senior engineers care about:

```text
Timeouts
Retries
Backoff
Circuit breakers
Load shedding
Concurrency limits
```

---

# 13. More Connections Can Make the Retry Storm Worse

Suppose the database can comfortably handle:

```text
100 concurrent queries
```

but we configure:

```text
500 connections
```

Now 500 queries can execute simultaneously.

If the database starts saturating:

```text
CPU → 100%
I/O → saturated
lock contention → increases
query latency → increases
```

The application doesn't see:

```text
More throughput
```

It sees:

```text
More simultaneous slow queries
```

This is why:

> **A bigger connection pool can amplify overload.**

---

# 14. The Database Is Often Better Protected by Less Concurrency

This sounds counterintuitive.

Suppose:

```text
Database optimal concurrency = 80
```

and:

```text
Application concurrency = 1,000
```

Instead of allowing all 1,000 requests to hit the database, we can enforce:

```text
Database concurrency limit = 80
```

Then:

```text
1,000 requests
      ↓
Concurrency limiter
      ↓
80 queries
      ↓
Database
```

The remaining requests wait or fail fast.

This is **backpressure**.

We intentionally prevent the database from being overwhelmed.

---

# 15. Rate Limiting Is Not Enough

Suppose we use:

```text
10,000 requests/sec
```

as our rate limit.

That doesn't tell us how many queries are simultaneously executing.

Imagine:

```text
10,000 req/s
```

where each request takes:

```text
1 second
```

Then roughly:

$$
10,000 \times 1 = 10,000
$$

requests may be in flight.

If each request holds a DB connection:

```text
10,000 DB connections
```

would be absurd.

This is why:

```text
Rate limiting
```

and:

```text
Concurrency limiting
```

solve different problems.

---

# 16. Database Connections Should Usually Be Bounded

A healthy architecture usually has a deliberate upper bound:

```text
Application
   ↓
Bounded DB Pool
   ↓
Database
```

The exact number depends on:

```text
Database capacity
Query characteristics
Number of application instances
CPU
Memory
Workload
Transaction duration
```

There is no universal:

```text
poolSize = 100
```

formula.

---

# 17. The Multi-Instance Trap

This is another Senior-level interview trap.

Suppose we have:

```text
10 application instances
```

and configure:

```text
pool size = 100
```

You might think:

```text
100 connections
```

But the actual maximum is:

$$
10 \times 100 = 1,000
$$

database connections.

Now Kubernetes scales to:

```text
50 instances
```

and suddenly:

$$
50 \times 100 = 5,000
$$

possible connections.

The application may scale horizontally while the database does not.

This is one of the easiest ways to accidentally overload a database.

---

# 18. Connection Pool Size Is a Global Capacity Decision

When configuring:

```text
poolSize = 100
```

you should not think only about one server.

Think:

$$
TotalConnections =
Instances \times PoolSize
$$

For example:

```text
20 instances
×
50 connections
=
1,000 connections
```

Then ask:

> Can the database actually support 1,000 active connections?

And more importantly:

> Does the workload benefit from 1,000 concurrent queries?

Those are different questions.

---

# 19. Idle Connections Are Another Resource

Not every connection is actively executing a query.

You may have:

```text
100 connections
```

but:

```text
10 active
90 idle
```

Those idle connections still consume resources.

Therefore:

```text
Maximum pool size
```

and:

```text
Actual active concurrency
```

are different metrics.

A good observability setup should track both.

---

# 20. What Should We Measure?

Before changing the pool, I'd inspect:

### Application

```text
Request rate
p50/p95/p99 latency
Request concurrency
Pool utilization
Pool wait time
Connection acquisition latency
Query count/request
Timeout rate
Retry rate
```

### Database

```text
CPU
Memory
Disk I/O
Cache hit ratio
Active connections
Idle connections
Query latency
Lock waits
Deadlocks
Slow queries
Transactions
Replication lag
```

### Query-level

```text
Execution time
Rows scanned
Rows returned
Index usage
Query plan
Sort operations
Temporary tables
```

Without this information, changing:

```text
pool size
```

is mostly guessing.

---

# 21. Pool Wait Time Is Especially Interesting

Suppose:

```text
Pool utilization = 100%
```

and:

```text
Pool wait time = 500ms
```

This tells us:

```text
Requests want database connections
but cannot acquire them.
```

But it doesn't tell us whether the database is the root cause.

We need to inspect:

```text
Why are connections not being returned?
```

Maybe:

```text
Queries are slow
```

or:

```text
Transactions are long
```

or:

```text
Application code is leaking connections
```

or:

```text
A downstream dependency is called while holding the connection
```

---

# 22. The Transaction Trap

Consider:

```typescript
await db.transaction(async (tx) => {
    const user = await tx.user.find(...);

    await callExternalPaymentAPI();

    await tx.payment.create(...);
});
```

Looks reasonable.

But conceptually:

```text
BEGIN
  ↓
DB connection acquired
  ↓
SELECT
  ↓
WAIT 800ms for payment API
  ↓
INSERT
  ↓
COMMIT
  ↓
connection released
```

The database connection was occupied during:

```text
External API latency
```

which has nothing to do with the database.

A better design might minimize the transaction boundary.

For example:

```text
Read
  ↓
External operation
  ↓
Short transaction
  ↓
Commit
```

The exact redesign depends on consistency requirements.

The key principle is:

> **Don't hold scarce resources while waiting on unrelated slow resources.**

---

# 23. This Principle Generalizes

The same idea appears everywhere.

Don't hold:

```text
Database connection
```

while waiting for:

```text
HTTP API
```

Don't hold:

```text
Distributed lock
```

while doing:

```text
CPU-heavy work
```

Don't hold:

```text
File descriptor
```

while waiting unnecessarily for:

```text
User input
```

Scarce resources should have carefully controlled lifetimes.

---

# 24. Another Trick: CPU Can Be the Bottleneck

Suppose the database is fast:

```text
DB latency = 5ms
```

but the application performs expensive JSON transformation:

```text
DB
 ↓
10 MB result
 ↓
CPU-heavy serialization
 ↓
HTTP response
```

Now increasing DB connections may accomplish almost nothing.

The actual bottleneck is:

```text
Application CPU
```

This is why Senior engineers don't optimize the component that *looks* busy.

They identify the actual limiting resource.

---

# 25. Amdahl's Law Appears Here Too

Suppose an operation takes:

```text
100ms
```

where:

```text
Database = 20ms
Business logic = 30ms
Serialization = 50ms
```

You optimize the database:

```text
20ms → 5ms
```

New latency:

```text
5 + 30 + 50 = 85ms
```

You saved:

```text
15ms
```

But the system cannot become infinitely faster by optimizing the database.

The rest of the operation still dominates.

This is the general idea behind **Amdahl's Law**:

> Optimizing one component is bounded by the fraction of total execution time that component represents.

---

# 26. What If Queries Are Actually Fast?

Suppose we measure:

```text
Query p95 = 5ms
Query p99 = 10ms
```

but:

```text
Pool wait p99 = 500ms
```

This is interesting.

The database isn't necessarily slow.

The application may simply have insufficient connection capacity relative to its workload.

Now increasing the pool could help.

But we still need to ask:

```text
How many connections can the DB sustain?
```

and:

```text
Why is so much concurrency reaching the DB?
```

This is where measurement changes the answer.

---

# 27. A Better Decision Tree

When the pool is exhausted:

```text
Pool exhausted?
      │
      ▼
Measure pool wait time
      │
      ▼
Why are connections occupied?
      │
      ├── Slow queries
      │      ↓
      │   Optimize queries
      │
      ├── Long transactions
      │      ↓
      │   Reduce transaction scope
      │
      ├── Connection leak
      │      ↓
      │   Fix lifecycle
      │
      ├── Excessive concurrency
      │      ↓
      │   Add backpressure
      │
      └── Genuine DB capacity need
             ↓
          Carefully increase pool
```

This is much better than:

```text
Pool exhausted
    ↓
poolSize += 100
```

---

# 28. What If the Database Is Already Saturated?

Suppose:

```text
DB CPU = 100%
DB I/O = 100%
```

and:

```text
Pool = 20
```

Increasing:

```text
20 → 100
```

is probably dangerous.

You're essentially telling the database:

> "Please execute even more work while you're already overloaded."

The correct response may be:

```text
Reduce concurrency
Optimize queries
Cache
Load shed
Scale database
Read replicas
Partition workload
```

rather than:

```text
Increase pool size
```

---

# 29. Read Replicas Change the Problem

Suppose most traffic is read-heavy:

```text
90% reads
10% writes
```

We could separate:

```text
Writes
   ↓
Primary DB

Reads
   ↓
Read Replicas
```

Architecture:

```text
                 Application
                /           \
               ↓             ↓
            Writes         Reads
               ↓             ↓
            Primary      Replica Pool
```

Now database capacity can scale differently by workload.

But this introduces consistency questions.

For example:

```text
WRITE user profile
      ↓
Primary
      ↓
Immediately READ profile
      ↓
Replica
```

The replica may not have received the write yet.

So:

```text
More DB capacity
```

can introduce:

```text
Consistency trade-offs
```

This is why Senior system design is mostly about understanding trade-offs.

---

# 30. Another Interview Question

The interviewer may now ask:

> **"If your database is slow, why not just add read replicas?"**

A strong response:

> "I'd first determine whether the workload is actually read-heavy and whether the bottleneck is CPU, I/O, locking, or query execution. Read replicas help primarily with scalable reads, but they don't solve write contention, poorly indexed queries, long transactions, or a workload dominated by writes. They also introduce replication lag and potentially stale reads."

That answer demonstrates much more maturity than:

> "Because replicas make the database faster."

---

# 31. What About Caching?

Suppose the same query executes:

```text
100,000 times/sec
```

but the result changes once per minute.

Sending all 100,000 requests to PostgreSQL is wasteful.

A cache could turn:

```text
100,000 DB queries/sec
```

into:

```text
100 DB queries/sec
```

depending on the workload.

Architecture:

```text
Request
   ↓
Cache
   ├── HIT → Response
   │
   └── MISS
         ↓
      Database
```

This reduces database concurrency rather than simply increasing database capacity.

---

# 32. But Caching Introduces Its Own Trap

Suppose a cache expires.

Suddenly:

```text
10,000 requests
```

miss simultaneously.

They all query the database.

```text
Cache MISS
   ↓
10,000 DB queries
```

This is a **cache stampede**.

So we may need:

```text
Request coalescing
Single-flight
Jittered expiration
Stale-while-revalidate
Distributed locking
```

Again:

> **Every optimization changes the failure modes of the system.**

---

# 33. The Senior Engineer's Optimization Loop

A strong production workflow is:

```text
Observe
   ↓
Hypothesize
   ↓
Measure
   ↓
Change
   ↓
Measure again
   ↓
Validate
```

Not:

```text
Slow
 ↓
Increase pool
 ↓
Deploy
```

For example:

```text
Observation:
Pool wait p99 = 400ms

Hypothesis:
Queries hold connections too long

Measure:
Average query execution = 8ms
Average transaction duration = 300ms

Discovery:
Application holds transactions during external API calls

Fix:
Reduce transaction scope

Result:
Pool wait p99 = 20ms
```

That's engineering.

---

# 34. The Trickiest Part of the Interview

The interviewer may intentionally give you this information:

```text
Pool size = 20
Pool exhausted
```

and ask:

> "What should you do?"

The correct response isn't immediately:

> "Increase it."

The correct response begins with:

> **"I need to know why the pool is exhausted."**

Then investigate:

```text
Pool wait time
Connection utilization
Query latency
Transaction duration
Query frequency
Database saturation
Application concurrency
Instance count
Connection leaks
```

Only then decide whether the pool is actually too small.

---

# 35. Senior-Level Mental Model

Think of the system as a collection of bounded resources:

```text
             ┌───────────────┐
             │ HTTP Workers  │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │ DB Pool       │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │ Database CPU  │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │ Disk / I/O    │
             └───────────────┘
```

Every layer has a capacity.

If one layer is saturated:

```text
Adding capacity somewhere else
```

doesn't necessarily help.

Sometimes it simply moves more work toward the bottleneck.

---

# 36. The Deepest Lesson

This case isn't really about PostgreSQL.

It isn't really about connection pools.

It is about a fundamental systems principle:

> **Concurrency is not free.**

Every additional concurrent operation competes for some resource.

That resource might be:

```text
CPU
Memory
Disk
Network
Locks
Database connections
Threads
File descriptors
Kernel resources
```

Increasing concurrency can improve utilization when the system is underutilized.

But once the bottleneck is saturated:

```text
Concurrency ↑
       ↓
Contention ↑
       ↓
Latency ↑
       ↓
Timeouts ↑
       ↓
Retries ↑
       ↓
Load ↑
       ↓
Throughput ↓
```

That is how healthy systems collapse.

---

# 37. The 60-Second Senior Interview Answer

If asked:

> **"Why did increasing the database connection pool make the application slower?"**

A strong answer would be:

> "Because a connection pool controls database concurrency, not database capacity. If the database or one of its resources was already saturated, increasing the pool allowed more queries to execute concurrently and increased contention for CPU, I/O, locks, memory, or internal database resources. That can increase query latency and even reduce throughput.
>
> I'd first determine why the pool was exhausted. I'd inspect pool wait time, query latency, transaction duration, connection leaks, database CPU and I/O, lock contention, and the number of application instances. I'd also remember that a pool size of 100 across 20 instances potentially means 2,000 database connections.
>
> If queries are genuinely fast and the database has spare capacity, increasing the pool may help. Otherwise, I'd look at query optimization, transaction scope, caching, concurrency limiting, load shedding, or database scaling. The goal isn't to maximize the number of connections — it's to find the concurrency level that maximizes useful throughput without pushing the bottleneck into saturation."

That is the kind of answer that signals:

```text
"I understand systems."
```

rather than:

```text
"I know how to configure an ORM."
```

---

# 38. Follow-Up Questions the Interviewer May Throw at You

After your answer, expect questions like:

### Q1

> "How would you determine the optimal pool size?"

Don't give a magic number.

Talk about:

```text
Database capacity
Query latency
Application instances
Workload
CPU
I/O
Concurrency
Observed saturation
```

---

### Q2

> "Why can a pool of 100 be fine with one server but terrible with 50 servers?"

Because:

$$
TotalConnections = Instances \times PoolSize
$$

---

### Q3

> "What if the database CPU is only 30%, but the pool is exhausted?"

Investigate:

```text
Locks
I/O
Slow queries
Transactions
Connection leaks
External waits
Application-side bottlenecks
```

CPU isn't the only resource.

---

### Q4

> "What if the queries are fast but the pool is still exhausted?"

Investigate:

```text
Connection acquisition
Transaction lifetime
Application concurrency
Pool configuration
Connection leaks
Too many application instances
```

---

### Q5

> "Would you rather have a queue or reject requests?"

Depends on the workload.

For some operations:

```text
Queue
```

is appropriate.

For latency-sensitive operations:

```text
Fail fast / load shed
```

may be better.

---

### Q6

> "Why not create one database connection per request?"

Because connection creation and database session resources are expensive, and unbounded connection concurrency can overwhelm the database.

---

### Q7

> "Why not set the pool to the database's maximum connection count?"

Because multiple application instances may share the database, and maximum connections is not the same as optimal concurrent workload.

---

# 39. Final Takeaway

The dangerous assumption is:

> **"More concurrency means more performance."**

It doesn't.

A better model is:

```text
                     Underutilized
                          │
                          ▼
               More concurrency helps
                          │
                          ▼
                     Saturation
                          │
                          ▼
               More concurrency hurts
                          │
                          ▼
                    System collapse
```

The goal of a Senior engineer is therefore not:

> **"How do I maximize concurrency?"**

It is:

> **"What concurrency level allows the system to maximize useful throughput while keeping latency and resource contention under control?"**

And that distinction is one of the biggest differences between **configuring a backend** and **engineering a backend**.