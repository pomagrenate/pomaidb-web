---
title: "BLOG: Why Adding More Threads Can Make Your Backend Slower"
slug: "why-more-threads-can-make-backend-slower"
date: "2026-08-23"
author: "Quan Van"
excerpt: "A deep dive into concurrency, contention, context switching, queueing, and why increasing the number of workers doesn't necessarily increase throughput."
tags: ["Concurrency", "Backend", "Performance", "Operating Systems", "Distributed Systems", "Thread Pool", "Rust", "Go", "Senior Engineering"]
category: "Backend Engineering"
---

# Why Adding More Threads Can Make Your Backend Slower

There is a very common instinct when a backend becomes slow:

> "We don't have enough workers. Let's increase the number of threads."

It sounds reasonable.

Suppose the server currently has:

```text
8 workers
````

and we're receiving:

```text
500 requests/sec
```

So someone changes:

```text
8 workers
```

to:

```text
64 workers
```

and expects:

```text
more concurrency
→
more throughput
→
lower latency
```

Sometimes that works.

Sometimes it makes the system **significantly worse**.

The reason is simple but surprisingly deep:

> **Concurrency is not the same thing as capacity.**

More concurrent work can mean more:

```text
context switching
+
lock contention
+
cache misses
+
memory pressure
+
queueing
+
I/O contention
```

Eventually, the system spends more time coordinating work than actually doing work.

---

# 1. The First Mental Model

Imagine a CPU with:

```text
8 cores
```

and an application running:

```text
8 CPU-bound threads
```

Each core can execute approximately one thread at a time.

Conceptually:

```text
Core 1 → Thread 1
Core 2 → Thread 2
Core 3 → Thread 3
Core 4 → Thread 4
Core 5 → Thread 5
Core 6 → Thread 6
Core 7 → Thread 7
Core 8 → Thread 8
```

Now create:

```text
800 threads
```

Does the CPU suddenly become 100× faster?

Obviously not.

Instead:

```text
800 threads
      ↓
8 cores
      ↓
threads compete for CPU
```

The operating system scheduler has to decide:

```text
Who runs?
Who waits?
When do we switch?
```

The CPU is still the same CPU.

---

# 2. What Is Context Switching?

A CPU cannot execute every runnable thread simultaneously.

When the scheduler switches from:

```text
Thread A
```

to:

```text
Thread B
```

the CPU needs to preserve and restore execution state.

Conceptually:

```text
Thread A
   │
   ▼
Save state
   │
   ▼
Scheduler
   │
   ▼
Restore Thread B
   │
   ▼
Thread B
```

The exact mechanics are more complicated, but the important point is:

> **Switching between execution contexts has a cost.**

If there are too many runnable threads, scheduling overhead increases.

---

# 3. CPU-Bound Work

Suppose we have:

```text
8 CPU cores
```

and every request performs:

```text
CPU-heavy computation
```

For example:

```text
hashing
compression
parsing
image processing
cryptography
simulation
```

If we configure:

```text
8 workers
```

we can potentially keep the cores busy.

Now:

```text
16 workers
```

doesn't automatically double throughput.

The CPU is already saturated.

We have:

```text
8 cores
+
16 runnable threads
```

The additional threads compete for the same CPU time.

---

# 4. The Important Distinction: CPU-Bound vs I/O-Bound

This is one of the most important concepts in backend concurrency.

A CPU-bound operation spends most of its time:

```text
running on CPU
```

An I/O-bound operation spends significant time:

```text
waiting
```

For example:

```text
HTTP request
   ↓
PostgreSQL
   ↓
wait
```

While the request is waiting for PostgreSQL:

```text
CPU
```

doesn't necessarily need to remain occupied by that request.

This means concurrency can be useful.

---

# 5. Why More Concurrency Helps I/O

Suppose:

```text
1 request
```

takes:

```text
100ms
```

but:

```text
90ms
```

is spent waiting for the database.

Then the CPU might only be doing actual work for:

```text
10ms
```

If we only allow one request at a time:

```text
Request A
████████████████████████
          WAIT
```

the CPU sits mostly idle.

But if we allow multiple requests:

```text
Request A → waiting
Request B → CPU
Request C → waiting
Request D → CPU
```

we can keep the CPU productive while other requests wait.

This is the fundamental reason asynchronous systems can achieve high concurrency.

---

# 6. But There Is a Limit

Suppose the database can handle:

```text
1,000 queries/sec
```

and our application creates:

```text
10,000 concurrent database requests
```

More concurrency doesn't make PostgreSQL process queries faster.

Instead:

```text
more requests
      ↓
more connections / queueing
      ↓
more contention
      ↓
higher latency
```

Eventually:

```text
p99
```

explodes.

This is why:

> **Concurrency should usually be bounded.**

---

# 7. A Queue Is Not Necessarily Bad

Consider:

```text
Requests
   ↓
Queue
   ↓
Workers
```

Suppose:

```text
100 requests
```

arrive and we have:

```text
10 workers
```

Then:

```text
10 → processing
90 → waiting
```

The queue provides:

```text
backpressure
```

and prevents unlimited concurrency.

Without a queue or concurrency limit:

```text
100
→ 1,000
→ 10,000
→ 100,000
```

in-flight operations can eventually consume:

```text
memory
connections
file descriptors
CPU
```

and crash the process.

---

# 8. The Queueing Problem

Suppose our service can process:

```text
1,000 req/s
```

and traffic is:

```text
500 req/s
```

Everything is comfortable.

Now:

```text
900 req/s
```

Still manageable.

But at:

```text
990 req/s
```

we are operating extremely close to capacity.

If traffic briefly reaches:

```text
1,200 req/s
```

the system begins accumulating backlog.

That backlog becomes:

```text
latency
```

So instead of:

```text
request = 20ms
```

we might get:

```text
request
+
queue wait
=
500ms
```

---

# 9. More Threads Can Hide the Real Bottleneck

Suppose:

```text
Application
   ↓
PostgreSQL
```

Database connection pool:

```text
20 connections
```

Application workers:

```text
200 threads
```

We increase workers to:

```text
2,000 threads
```

But PostgreSQL still has:

```text
20 connections
```

Now:

```text
2,000 workers
       ↓
20 DB connections
       ↓
1,980 waiting
```

The application didn't become more capable.

We simply moved the queue somewhere else.

---

# 10. The Database Can Become the Bottleneck

This is where Senior engineers should stop looking at one service in isolation.

Imagine:

```text
API
 ↓
200 workers
 ↓
Database
 ↓
20 connections
```

If all 200 workers want the database:

```text
200
 ↓
20
 ↓
180 waiting
```

Now suppose we increase workers:

```text
2,000
 ↓
20
 ↓
1,980 waiting
```

We've increased:

```text
memory usage
scheduler overhead
connection wait
```

without increasing:

```text
database capacity
```

The system may become slower.

---

# 11. Little's Law

A very useful equation for reasoning about concurrency is:

$$
L = \lambda W
$$

where:

```text
L = average number of items in the system
λ = arrival rate
W = average time in the system
```

For a backend:

```text
concurrency ≈ throughput × latency
```

Suppose:

```text
throughput = 1,000 req/s
latency = 100ms
```

Then:

$$
L = 1000 \times 0.1
$$

so:

```text
L = 100 concurrent requests
```

This is extremely useful when designing worker pools.

---

# 12. What Little's Law Does NOT Say

It does **not** mean:

> "If I increase concurrency, throughput automatically increases."

Instead, it describes a relationship between:

```text
throughput
latency
concurrency
```

If the bottleneck is saturated, increasing concurrency can primarily increase:

```text
latency
```

rather than:

```text
throughput
```

You are adding people to a queue, not adding cashiers.

---

# 13. The Restaurant Analogy

Imagine a restaurant has:

```text
5 chefs
```

and:

```text
100 customers
```

Adding:

```text
50 waiters
```

doesn't necessarily make the kitchen produce food faster.

You may get:

```text
more orders
+
more coordination
+
more kitchen pressure
```

but still:

```text
5 chefs
```

The bottleneck remains.

Backend systems behave similarly.

---

# 14. Contention

Another major reason more threads can hurt performance is:

```text
shared state
```

Suppose 100 threads need:

```text
Mutex
```

to access:

```text
shared cache
```

Conceptually:

```text
Thread 1 ─┐
Thread 2 ─┤
Thread 3 ─┤
Thread 4 ─┤
Thread 5 ─┤
           ▼
         Mutex
           │
           ▼
      Shared State
```

Only one thread can enter the critical section at a time.

So adding more threads creates:

```text
more competition
```

rather than:

```text
more parallelism
```

---

# 15. The Lock Convoy

Suppose:

```text
Thread A
Thread B
Thread C
Thread D
```

all need the same lock.

Execution becomes:

```text
A → lock
A → work
A → unlock

B → lock
B → work
B → unlock

C → lock
...
```

Even though we have:

```text
4 threads
```

the critical section is effectively serialized.

If the critical section is large:

```text
parallelism
```

may provide almost no benefit.

---

# 16. Amdahl's Law

This leads to one of the most important laws in parallel computing.

Suppose:

```text
90%
```

of the workload can be parallelized.

Then:

```text
10%
```

must remain sequential.

Amdahl's Law says:

$$
Speedup(N) =
\frac{1}
{(1-P)+\frac{P}{N}}
$$

where:

```text
P = parallelizable fraction
N = number of workers
```

If:

```text
P = 0.9
```

then even with infinitely many workers:

$$
Speedup(\infty) = \frac{1}{0.1} = 10
$$

So:

```text
∞ workers
```

doesn't produce:

```text
∞ speedup
```

because the sequential portion remains.

---

# 17. Real Systems Are Worse

In a real backend, increasing concurrency can introduce additional overhead:

```text
scheduling
synchronization
memory allocation
cache misses
network contention
database contention
lock contention
```

So the theoretical speedup from parallelism is often reduced further.

A system might look like:

```text
Workers      Throughput

1            100 req/s
2            190 req/s
4            350 req/s
8            600 req/s
16           700 req/s
32           680 req/s
64           600 req/s
```

The interesting point is:

```text
32 workers
```

is worse than:

```text
16 workers
```

because we've crossed the useful concurrency point.

---

# 18. Why Does Throughput Go Down?

Eventually the system spends more time on:

```text
coordination
```

than:

```text
useful work
```

For example:

```text
CPU
├── 60% useful work
├── 15% context switching
├── 10% lock contention
├── 10% cache misses
└── 5% other overhead
```

Increasing concurrency further might turn that into:

```text
CPU
├── 40% useful work
├── 25% context switching
├── 20% contention
├── 10% cache misses
└── 5% other
```

The CPU is still busy.

But it's doing less useful work.

This distinction is important:

> **High CPU utilization does not necessarily mean high productive utilization.**

---

# 19. CPU Cache Matters

Modern CPUs don't only have:

```text
RAM
```

They have multiple cache levels:

```text
CPU
 ↓
L1
 ↓
L2
 ↓
L3
 ↓
RAM
```

Accessing data from cache is much faster than going to main memory.

If many threads operate on shared data, they can cause cache-line contention and cache invalidation.

This becomes particularly important with:

```text
lock-free structures
atomic counters
shared queues
high-frequency synchronization
```

So concurrency isn't free even when there are enough CPU cores.

---

# 20. False Sharing

A particularly interesting low-level problem is **false sharing**.

Suppose two independent variables happen to live on the same CPU cache line:

```text
Cache Line
┌─────────────────────────────┐
│ counterA │ counterB         │
└─────────────────────────────┘
```

Thread A updates:

```text
counterA
```

while Thread B updates:

```text
counterB
```

They aren't logically sharing data.

But the CPU cache operates at cache-line granularity.

So updates can cause cache coherence traffic.

The result:

```text
independent variables
```

can interfere with one another.

This is one reason high-performance systems sometimes carefully align data structures.

---

# 21. Concurrency Is a Resource

A useful mental model is:

```text
CPU
Memory
Connections
Threads
File descriptors
Sockets
Database capacity
Queue capacity
```

are all finite resources.

Therefore:

> **Concurrency itself should be managed as a resource.**

Don't ask:

> "How many concurrent requests can we support?"

Ask:

> "How much concurrency can each bottleneck safely absorb?"

---

# 22. Bounded Concurrency

Suppose an external API can safely handle:

```text
100 concurrent requests
```

Our application receives:

```text
10,000 tasks
```

A dangerous design is:

```text
10,000 tasks
    ↓
10,000 HTTP requests
```

A safer design is:

```text
10,000 tasks
    ↓
bounded queue
    ↓
100 concurrent requests
```

Now the system has explicit backpressure.

---

# 23. Semaphore-Based Concurrency Control

Conceptually:

```text
semaphore = 100
```

Each task must acquire a permit:

```text
acquire()
   ↓
perform request
   ↓
release()
```

At most:

```text
100
```

operations run concurrently.

This is useful for protecting:

```text
database
external APIs
CPU-heavy operations
memory-intensive jobs
file operations
```

---

# 24. Backpressure

Suppose:

```text
Producer
   ↓
Consumer
```

Producer generates:

```text
10,000 jobs/sec
```

but consumer can handle:

```text
5,000 jobs/sec
```

If we allow unlimited buffering:

```text
queue
100
1,000
10,000
100,000
1,000,000
...
```

Eventually memory becomes the bottleneck.

Backpressure forces the producer to slow down.

Conceptually:

```text
Producer
   │
   │ too fast
   ▼
[Bounded Queue]
   │
   ▼
Consumer
```

When the queue is full:

```text
producer waits
```

or:

```text
request rejected
```

or:

```text
work is dropped
```

depending on business requirements.

---

# 25. Rejection Can Be Better Than Latency

This sounds counterintuitive.

Suppose the system is overloaded.

Option A:

```text
accept everything
↓
queue everything
↓
latency = 30 seconds
```

Option B:

```text
reject excess work
↓
latency = controlled
```

For interactive systems, Option B may provide a much better user experience.

This is why systems use mechanisms such as:

```text
rate limiting
load shedding
circuit breakers
bounded queues
timeouts
```

---

# 26. Thread Pool Design

A thread pool isn't simply:

```text
threads = CPU × 10
```

The right size depends on the workload.

For CPU-bound tasks:

```text
threads ≈ number of CPU cores
```

is often a reasonable starting point.

For I/O-heavy workloads:

```text
threads > CPU cores
```

can make sense because many workers spend time waiting.

But even then:

> **Measure instead of blindly multiplying the number.**

The ideal number depends on:

```text
CPU
I/O latency
blocking behavior
downstream limits
memory
request mix
contention
```

---

# 27. Why Async Doesn't Mean Infinite Concurrency

This is another common misunderstanding.

People sometimes hear:

> "Async is efficient."

and conclude:

> "Therefore we can run millions of requests."

Not necessarily.

Async primarily reduces the cost of waiting.

For example:

```text
Task A → waiting for network
Task B → CPU
Task C → waiting for DB
Task D → CPU
```

One execution context can coordinate many waiting operations.

But downstream resources still have limits:

```text
database
network
CPU
memory
```

Async changes how efficiently we wait.

It doesn't create infinite capacity.

---

# 28. Go Goroutines

Go makes it extremely cheap to create goroutines:

```go
go process()
```

But:

```text
cheap goroutine
```

doesn't mean:

```text
cheap external operation
```

If you create:

```text
1,000,000 goroutines
```

that all attempt:

```text
database query
```

the database doesn't suddenly become 1,000,000× faster.

You still need:

```text
bounded concurrency
```

and:

```text
connection pooling
```

---

# 29. Rust Async Tasks

Rust's async model has a similar principle.

Creating many lightweight tasks can be cheap:

```rust
tokio::spawn(...)
```

but if every task eventually does:

```text
database query
```

or:

```text
CPU-heavy computation
```

you can still overload the underlying resource.

The runtime manages execution.

It doesn't remove physical constraints.

---

# 30. CPU-Bound Work in Async Systems

This is especially important.

Suppose we have an async HTTP server:

```text
async fn handler()
```

and inside it we perform:

```text
huge CPU computation
```

without moving it to an appropriate blocking/CPU execution mechanism.

Then the async executor's worker thread can become occupied.

Conceptually:

```text
Async executor
     │
     ├── Request A
     ├── Request B
     ├── Request C
     └── CPU-heavy Request D
                 ↓
             blocks worker
```

Now unrelated requests can become slower.

So:

> **Async is excellent for waiting; it does not magically make CPU work non-blocking.**

---

# 31. CPU Pool + I/O Runtime

A good architecture can separate workloads:

```text
HTTP Runtime
     │
     ├── Network I/O
     ├── Database I/O
     └── Async tasks
     
CPU Worker Pool
     │
     ├── Compression
     ├── Parsing
     ├── Image processing
     └── Heavy computation
```

This protects the I/O runtime from CPU-heavy work.

The same architectural idea applies to:

```text
web servers
job processors
message consumers
AI inference services
```

---

# 32. The Same Principle Applies to Kafka Consumers

Suppose a Kafka consumer receives:

```text
10,000 messages/sec
```

and each message performs:

```text
CPU-heavy processing
```

We might try:

```text
100 workers
```

But if:

```text
CPU = 8 cores
```

then:

```text
100 CPU-bound workers
```

may create significant contention.

A better design might be:

```text
Kafka
 ↓
bounded worker queue
 ↓
8–16 CPU workers
```

with the exact number determined through measurement.

---

# 33. Concurrency vs Parallelism

These terms are often confused.

### Concurrency

Multiple tasks are in progress.

```text
A waiting
B running
C waiting
D running
```

### Parallelism

Multiple tasks are literally executing simultaneously.

```text
Core 1 → A
Core 2 → B
Core 3 → C
Core 4 → D
```

A single CPU can support concurrency through scheduling.

Multiple CPU cores provide actual parallelism.

This distinction matters when reasoning about performance.

---

# 34. Why This Matters in Interviews

Interviewer:

> **"You have 8 CPU cores. Would you create 8 threads or 800?"**

Bad answer:

> "800 because more concurrency is better."

Also bad:

> "8 because CPU has 8 cores."

Better:

> "It depends on the workload. For CPU-bound work, I'd start around the number of cores and benchmark. For I/O-bound work, more concurrency can be useful because workers spend time waiting, but I'd still bound it based on downstream capacity and memory. The important thing is to find the saturation point rather than choosing a number arbitrarily."

That's a Senior answer.

---

# 35. Another Interview Trap

Interviewer:

> "Our service CPU is only 30%. Should we increase the worker count?"

Not necessarily.

You need to ask:

```text
Where are requests waiting?
```

Maybe:

```text
CPU = 30%
DB pool = saturated
```

or:

```text
CPU = 30%
external API = saturated
```

or:

```text
CPU = 30%
lock contention = high
```

or:

```text
CPU = 30%
network = saturated
```

Low CPU does not automatically mean:

```text
more threads
```

---

# 36. Another Interview Trap

Interviewer:

> "We doubled the worker pool and throughput didn't improve. Why?"

Possible answers:

```text
CPU bottleneck
Database bottleneck
Network bottleneck
Lock contention
Connection pool
External dependency
Memory bandwidth
Cache contention
Queueing
```

The correct answer isn't one specific resource.

The correct engineering response is:

> **Profile and identify the bottleneck.**

---

# 37. Bottleneck Migration

This is an important system-design concept.

Suppose:

```text
API
 ↓
CPU
```

CPU is the bottleneck.

We optimize the code.

Now:

```text
CPU → faster
```

but:

```text
Database
```

becomes the bottleneck.

Then we optimize the database.

Now:

```text
Network
```

becomes the bottleneck.

The bottleneck moves.

Therefore:

> **Optimization is often a process of moving the bottleneck rather than eliminating bottlenecks permanently.**

---

# 38. Why Benchmarking Matters

Suppose we compare:

```text
8 workers
16 workers
32 workers
64 workers
128 workers
```

Measure:

```text
throughput
p50
p95
p99
CPU
memory
queue depth
DB utilization
network
lock contention
```

You may discover:

```text
Workers    Throughput    p99

8          4,000/s       50ms
16         6,500/s       70ms
32         7,500/s       120ms
64         7,400/s       800ms
128        6,800/s       2.1s
```

The best configuration isn't:

```text
maximum workers
```

It's closer to:

```text
32 workers
```

because that's where the system has reached its useful operating point.

---

# 39. Optimize for the System, Not One Metric

If we only optimize:

```text
throughput
```

we might get:

```text
8,000 req/s
```

but:

```text
p99 = 5 seconds
```

If our SLA says:

```text
p99 < 500ms
```

then this isn't an improvement.

Similarly:

```text
p50 = 10ms
```

is meaningless if:

```text
p99 = 10s
```

Performance engineering must consider:

```text
throughput
+
latency distribution
+
resource utilization
+
error rate
```

together.

---

# 40. A Better Mental Model for Worker Pools

Think of a worker pool as a valve.

```text
                 Incoming Work
                       │
                       ▼
                ┌─────────────┐
                │    Queue    │
                └──────┬──────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Worker 1  Worker 2  Worker N
             │         │         │
             └─────────┼─────────┘
                       ▼
                  Bottleneck
```

The pool controls how much pressure reaches the bottleneck.

If you make:

```text
Worker N → ∞
```

you may simply remove the valve.

Then the bottleneck gets flooded.

---

# 41. The Senior-Level Question

The junior question is:

> "How many threads should I use?"

The Senior question is:

> **"What resource am I trying to keep busy, and what resource am I trying not to overload?"**

That's a much better framing.

For example:

### CPU-bound

Goal:

```text
maximize CPU utilization
without excessive contention
```

### Database-bound

Goal:

```text
keep DB busy
without exceeding safe DB concurrency
```

### External API-bound

Goal:

```text
maximize useful throughput
without violating rate limits
```

### Memory-bound

Goal:

```text
limit concurrent memory-heavy operations
```

---

# 42. A Practical Design Example

Suppose we build:

```text
Image Processing API
```

Each image requires:

```text
CPU = 500ms
Memory = 200MB
```

Server:

```text
8 CPU cores
16GB RAM
```

If we allow:

```text
100 concurrent images
```

memory requirements could theoretically approach:

$$
100 \times 200MB = 20GB
$$

which exceeds available memory.

So memory itself imposes a concurrency limit.

Even though:

```text
CPU cores = 8
```

the practical concurrency limit may be constrained by:

```text
RAM
```

before CPU.

This is why concurrency limits should be based on **resource requirements**, not a universal formula.

---

# 43. Admission Control

For expensive work, we can reject or defer requests before starting them.

For example:

```text
if active_jobs >= MAX_CONCURRENCY:
    return 429
```

or:

```text
enqueue job
```

instead of:

```text
start immediately
```

This is admission control.

The purpose isn't to make the system accept everything.

The purpose is to keep the system operating within a safe region.

---

# 44. Graceful Degradation

Suppose the system is overloaded.

Instead of allowing everything to become slow, we can degrade:

```text
Normal:

recommendations
analytics
personalization
```

Under pressure:

```text
disable recommendations
disable analytics
serve core functionality
```

This protects critical operations.

Again:

> **Reliability often means refusing some work so that the rest of the system remains healthy.**

---

# 45. The Connection to Circuit Breakers

Suppose an external dependency becomes slow:

```text
Payment Service
p99 = 5 seconds
```

If our service continues sending:

```text
10,000 concurrent requests
```

we may accumulate a huge number of waiting requests.

A circuit breaker can transition:

```text
CLOSED
  ↓
OPEN
```

and temporarily stop sending traffic.

This prevents one unhealthy dependency from consuming all our workers.

---

# 46. Timeouts Are Also Concurrency Control

Consider:

```text
HTTP request
```

with no timeout.

If a dependency hangs:

```text
worker
  ↓
waiting
```

forever.

Repeat this:

```text
100
1,000
10,000
```

times.

Eventually all workers can be occupied.

Therefore:

> **Timeouts are not merely user-experience settings. They are resource-protection mechanisms.**

---

# 47. The Relationship Between Timeouts and Pool Size

Suppose:

```text
worker pool = 100
timeout = 60 seconds
```

A dependency outage can potentially occupy:

```text
100 workers
```

for:

```text
60 seconds
```

If instead:

```text
timeout = 2 seconds
```

the system can recover much faster from stuck requests.

But an overly aggressive timeout can also create false failures and retries.

So timeout values should reflect:

```text
expected latency
SLA
dependency behavior
retry policy
business semantics
```

---

# 48. Why Senior Engineers Care About Headroom

A system operating at:

```text
70% capacity
```

has room for:

```text
traffic spikes
GC
background jobs
deployments
temporary dependency slowdown
```

A system operating at:

```text
99% capacity
```

has almost no room.

Small perturbations can create:

```text
queueing
timeouts
retries
cascading failure
```

So capacity planning should include:

```text
headroom
```

rather than targeting maximum utilization.

---

# 49. A Cascading Failure Example

Imagine:

```text
Service A
   ↓
Service B
   ↓
Database
```

Database becomes slow.

Then:

```text
B requests wait longer
```

So B's workers remain occupied.

Then:

```text
B queue grows
```

A sees slower responses:

```text
A workers wait
```

A's queue grows.

Clients timeout:

```text
clients retry
```

Now traffic increases.

So:

```text
DB slowdown
   ↓
B queue
   ↓
A queue
   ↓
timeouts
   ↓
retries
   ↓
more DB traffic
```

This is a cascading failure.

The original problem was:

```text
database slowdown
```

but the entire system can eventually become unhealthy.

---

# 50. The Solution Isn't "More Threads"

In fact, adding workers during the cascade can make things worse.

Better mechanisms include:

```text
bounded concurrency
timeouts
circuit breakers
backpressure
rate limiting
load shedding
bulkheads
retry budgets
```

These mechanisms control the amount of work entering the system.

---

# 51. Bulkheads

A useful pattern is to isolate resources.

Instead of:

```text
All requests
     ↓
One worker pool
```

use:

```text
Critical API
     ↓
Worker Pool A

Background Jobs
     ↓
Worker Pool B

Reporting
     ↓
Worker Pool C
```

Now a heavy reporting workload cannot consume every worker needed by the critical API.

This is analogous to compartments in a ship:

```text
one compartment floods
≠
entire ship sinks
```

---

# 52. The Deep Principle

At this point, the common thread becomes clear.

A backend is not just:

```text
code
```

It is a network of finite resources:

```text
CPU
Memory
Threads
Queues
Connections
Databases
Caches
Networks
External APIs
```

Each resource has:

```text
capacity
latency
contention
failure modes
```

When you increase concurrency, you change the pressure across this entire system.

Sometimes that's beneficial.

Sometimes you simply move the bottleneck.

Sometimes you create a new one.

---

# 53. The 60-Second Interview Answer

If the interviewer asks:

> **"Why can increasing the number of threads make a backend slower?"**

A strong answer:

> "Because concurrency isn't equivalent to capacity. For CPU-bound workloads, once the CPU cores are saturated, additional threads mostly introduce scheduling and context-switching overhead. For I/O-bound workloads, additional concurrency can improve utilization because tasks spend time waiting, but only up to the capacity of the underlying dependencies.
>
> Increasing concurrency can also increase lock contention, memory pressure, cache contention, database connection-pool contention, and queueing. If the database is the bottleneck, adding application workers may simply create a larger queue in front of the database.
>
> I'd therefore determine whether the workload is CPU- or I/O-bound, identify the actual bottleneck, and benchmark different concurrency levels while measuring throughput, p50/p95/p99 latency, queue depth, CPU, memory, and downstream utilization. The goal isn't maximum concurrency; it's finding the concurrency level that maximizes useful throughput while keeping latency and resource utilization within the required SLO."

---

# 54. Follow-Up: "How Do You Choose Thread Pool Size?"

A strong answer:

> "I wouldn't use a universal formula. For CPU-bound work I'd start near the number of available cores and benchmark. For I/O-bound work I'd allow more concurrency because workers spend time waiting, but I'd constrain it based on downstream capacity, memory, connection pools, and latency targets. I'd then load-test the system and identify the saturation point."

---

# 55. Follow-Up: "CPU Is Only 40%, Can I Add More Workers?"

Answer:

> "Not necessarily. Low CPU can mean the system is waiting on another resource such as a database, network, lock, connection pool, or external dependency. I'd first identify where requests are spending their time. Increasing workers without understanding the bottleneck can increase queueing and contention without increasing throughput."

---

# 56. Follow-Up: "Why Not Let Concurrency Be Unlimited?"

Answer:

> "Because every in-flight operation consumes resources. Unlimited concurrency can exhaust memory, sockets, connections, queues, or downstream capacity. It can also amplify failures by turning a slow dependency into a large number of blocked tasks. Bounded concurrency provides backpressure and protects the system."

---

# 57. Follow-Up: "Why Does Async Help?"

Answer:

> "Async helps primarily by making waiting cheaper. Instead of dedicating a heavyweight execution thread to a task that's waiting on I/O, the runtime can schedule other work. But async doesn't increase the capacity of the database, network, CPU, or external service. Those resources still need bounded concurrency."

---

# 58. Follow-Up: "Would You Use 1,000 Goroutines?"

Answer:

> "Creating 1,000 goroutines can be perfectly reasonable if they're lightweight and mostly waiting, but I wouldn't allow all 1,000 to simultaneously hit a constrained dependency. I'd separate task concurrency from resource concurrency—for example, many goroutines may exist, but a semaphore could limit database or external API operations to a safe level."

---

# 59. The Mental Model to Remember

When you see:

```text
More workers
```

don't automatically think:

```text
More performance
```

Think:

```text
More concurrency
       ↓
Where does that work go?
       ↓
CPU?
DB?
Network?
Queue?
Lock?
External API?
Memory?
       ↓
Can that resource absorb it?
```

If yes:

```text
throughput may increase
```

If no:

```text
queueing
+
contention
+
latency
+
failure
```

may increase instead.

---

# 60. Final Takeaway

The easiest way to remember this is:

> **Concurrency is pressure.**

A worker is not free.

A goroutine is not free.

An async task is not free.

A database connection is not free.

A queue entry is not free.

Every unit of concurrency consumes some combination of:

```text
CPU
memory
connections
scheduler time
cache bandwidth
network bandwidth
downstream capacity
```

So the real engineering question isn't:

> **"How many workers can I create?"**

It's:

> **"How much concurrent work can the slowest resource safely handle?"**

Once you start thinking this way, many backend performance problems become easier to reason about.

And that's the transition from:

```text
"I know how to make code concurrent."
```

to:

```text
"I know how to design a system that remains fast
when concurrency increases."
```