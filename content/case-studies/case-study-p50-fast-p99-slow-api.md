---
title: "CASE STUDY: Your API Is Fast at p50 but Terrible at p99 — Where Is the Problem?"
slug: "case-study-p50-fast-p99-slow-api"
date: "2026-08-23"
author: "Quan Van"
excerpt: "A Senior-level performance debugging case study: the average latency looks excellent, but a small percentage of requests take seconds. The tricky part is discovering why optimizing p50 may do almost nothing for p99."
tags: ["System Design", "Performance", "Distributed Systems", "Observability", "Latency", "Backend", "Concurrency", "Interview"]
category: "Senior Engineering"
---

# CASE STUDY: Your API Is Fast at p50 but Terrible at p99 — Where Is the Problem?

> **Senior Interview Question**
>
> **"Your API has a p50 latency of 20ms, p95 of 80ms, but p99 of 2 seconds. Most requests are extremely fast. Users still complain that the system is slow. How would you investigate?"**

This is a classic Senior-level question because there is an extremely tempting answer:

> "The average latency is fine, so there probably isn't a major problem."

That answer is wrong.

The interesting part of this problem isn't making:

```text
20ms → 15ms
````

The interesting part is understanding why:

```text
99% of requests
    ↓
< 2 seconds

but

1% of requests
    ↓
~2 seconds
```

are behaving completely differently.

At 100,000 requests/second:

$$
100,000 \times 1% = 1,000
$$

requests per second are slow.

That's not a tiny problem.

---

# 1. First: Don't Look at the Average

Suppose our metrics are:

```text
p50 = 20ms
p95 = 80ms
p99 = 2s
average = 45ms
```

Someone might say:

> "Average latency is only 45ms."

But average latency can hide tail behavior.

Imagine 100 requests:

```text
99 requests → 20ms
1 request   → 2,000ms
```

The system can still report a relatively small average.

But one user out of every hundred experiences:

```text
2 seconds
```

of latency.

At scale, that becomes a huge number of users.

---

# 2. What Does p99 Actually Mean?

If:

```text
p99 = 2 seconds
```

it means approximately:

> **99% of requests completed within 2 seconds, while the slowest ~1% took longer.**

It does **not** mean:

```text
The slowest request = 2 seconds
```

And it does not mean:

```text
Exactly 1% are always slow
```

Percentiles describe a distribution over a measurement window.

This distinction matters when debugging production systems.

---

# 3. Why Tail Latency Matters

Imagine a request depends on:

```text
API
 ├── Database
 ├── Redis
 ├── Authentication service
 └── Payment service
```

Each dependency might look healthy individually.

For example:

```text
Database:
p99 = 50ms

Redis:
p99 = 10ms

Auth:
p99 = 30ms

Payment:
p99 = 100ms
```

We might conclude:

> "Everything looks fine."

But the request isn't calling one dependency.

It's calling several.

And their latency distributions interact.

---

# 4. The First Trap: Parallel Dependencies

Suppose a request calls five services in parallel:

```text
                 ┌── Service A
                 │
Request ─────────┼── Service B
                 │
                 ├── Service C
                 │
                 ├── Service D
                 │
                 └── Service E
```

The request can't finish until the required dependencies finish.

Therefore:

$$
T_{request} = \max(T_A,T_B,T_C,T_D,T_E)
$$

This is extremely important.

The request latency is determined by the **slowest dependency**.

---

# 5. Even Small Tail Probabilities Compound

Suppose each dependency has:

```text
99% chance of being fast
1% chance of being slow
```

If we independently call five dependencies, the probability that **at least one** is slow is:

$$
1 - (0.99)^5
$$

which is approximately:

$$
4.9%
$$

So even though every dependency individually has only a 1% slow-request rate, the combined request can have almost:

```text
5%
```

of requests experiencing at least one slow dependency.

This is one reason distributed systems develop ugly tail latency.

---

# 6. Sequential Dependencies Are Different

Suppose the request performs:

```text
A
 ↓
B
 ↓
C
 ↓
D
```

Then:

$$
T = T_A + T_B + T_C + T_D
$$

Now latency accumulates.

If:

```text
A = 20ms
B = 30ms
C = 50ms
D = 20ms
```

then:

```text
Total = 120ms
```

But if one dependency occasionally becomes slow:

```text
A = 20ms
B = 30ms
C = 2s
D = 20ms
```

the entire request becomes:

```text
2.07s
```

This is why dependency topology matters.

---

# 7. First Question: Is the Slow Request Actually Slow?

This sounds strange.

But before investigating the database, ask:

> **Where does the two seconds come from?**

Break request latency down.

For example:

```text
HTTP request
    │
    ├── Queue wait:       1,200ms
    ├── DB:                 20ms
    ├── Redis:               5ms
    ├── Business logic:    100ms
    └── Serialization:      10ms
```

The database is innocent.

The request spent most of its time:

```text
waiting
```

not:

```text executing
```

This distinction is crucial.

---

# 8. Latency Is Often Waiting

A request's total latency may consist of:

```text
CPU execution
+
Database waiting
+
Connection pool waiting
+
Thread waiting
+
Queue waiting
+
Network waiting
+
Lock waiting
+
GC pauses
+
External service waiting
```

So:

> **Slow does not necessarily mean expensive computation.**

Sometimes the application is doing almost nothing.

It's just waiting.

---

# 9. Instrument the Request

A good distributed system should provide something like:

```text
request_id = abc123

total = 2040ms

auth          = 15ms
redis         = 8ms
db            = 35ms
payment       = 90ms
queue_wait    = 1800ms
serialization = 12ms
```

Now the problem becomes obvious.

Without instrumentation, you only see:

```text
POST /checkout → 2s
```

With instrumentation, you see:

```text
POST /checkout
    └── queue_wait = 1.8s
```

That's a completely different debugging problem.

---

# 10. Distributed Tracing

This is where distributed tracing becomes extremely valuable.

A trace might look like:

```text
Request
│
├── API Gateway        12ms
│
├── Auth Service       20ms
│
├── Order Service     900ms
│   │
│   ├── Redis          5ms
│   ├── PostgreSQL    30ms
│   └── Queue Wait   850ms
│
└── Response           8ms
```

Immediately we can see:

```text
Order Service
    ↓
Queue Wait
    ↓
850ms
```

The database isn't necessarily the problem.

---

# 11. The Hidden Queue Problem

Suppose:

```text
Application workers = 100
```

but:

```text
Incoming concurrency = 500
```

Then:

```text
100 requests
    ↓
workers

400 requests
    ↓
waiting
```

The waiting requests experience:

```text
queue latency
```

even though the application itself may have:

```text
CPU = 30%
```

This is a classic observability trap.

Someone sees:

```text
CPU = 30%
```

and concludes:

> "We have plenty of capacity."

Not necessarily.

You may be constrained by:

```text
worker count
connection pool
locks
I/O
downstream concurrency
```

rather than CPU.

---

# 12. Connection Pool Queue

Consider:

```text
Workers = 200
DB pool = 20
```

Suppose 100 requests simultaneously need the database.

Then:

```text
20 → DB
80 → waiting for DB connection
```

The application may have plenty of CPU.

But requests are slow.

The latency becomes:

```text
request
   ↓
wait for DB connection
   ↓
execute query
```

If the query itself is only:

```text
10ms
```

but pool wait is:

```text
500ms
```

then optimizing the SQL from:

```text
10ms → 5ms
```

does almost nothing to p99.

---

# 13. Queueing Is Often Non-Linear

This is one of the most important concepts for Senior interviews.

Suppose a server can process:

```text
1,000 req/s
```

and we're sending:

```text
500 req/s
```

Everything may be healthy.

Now traffic becomes:

```text
800 req/s
```

Still fine.

Now:

```text
950 req/s
```

Latency may begin increasing significantly.

Now:

```text
990 req/s
```

The system is close to saturation.

A tiny increase in load can produce a disproportionate increase in waiting time.

Conceptually:

```text
Latency
  ▲
  │                         /
  │                       /
  │                    __/
  │                 __/
  │______________--/
  └────────────────────────► Utilization
                    ^
                 saturation
```

This is why:

> **A system operating at 99% utilization is not necessarily healthier than one operating at 70%.**

You need headroom.

---

# 14. Why 100% Utilization Is Dangerous

Suppose a resource can process:

```text
100 units/sec
```

and incoming work is:

```text
99 units/sec
```

There is very little headroom.

A temporary burst:

```text
120 units/sec
```

creates backlog.

If the burst lasts long enough:

```text
Queue grows
    ↓
Latency grows
    ↓
Timeouts
    ↓
Retries
    ↓
More load
```

This is how a system can collapse even though:

```text
Average traffic
```

looks acceptable.

---

# 15. Tail Latency and Retries

Now let's introduce one of the nastiest interactions.

Suppose:

```text
p99 = 2s
```

and the client timeout is:

```text
1s
```

Then slow requests may timeout before the server finishes.

The client retries:

```text
Request
   ↓
1 second
   ↓
Timeout
   ↓
Retry
```

Now the server may still be processing the original request.

So we get:

```text
Original request
+
Retry request
```

for one logical user operation.

The system has effectively multiplied its own workload.

---

# 16. Retry Amplification

Suppose:

```text
100,000 requests/sec
```

and:

```text
5% timeout
```

That's:

$$
100,000 \times 0.05 = 5,000
$$

timeouts per second.

If each timeout causes one retry:

```text
5,000 additional req/s
```

Now total traffic becomes approximately:

```text
105,000 req/s
```

If the additional load increases latency:

```text
more timeouts
    ↓
more retries
    ↓
more load
```

we have a feedback loop.

---

# 17. Why Exponential Backoff Exists

A naive client does:

```text
timeout
↓
retry immediately
↓
timeout
↓
retry immediately
```

This is dangerous.

A better client uses:

```text
Retry 1 → 100ms
Retry 2 → 200ms
Retry 3 → 400ms
Retry 4 → 800ms
```

plus jitter.

For example:

$$
delay = random(0, base \times 2^n)
$$

The randomness matters.

Without jitter, thousands of clients can retry simultaneously.

That's called a **thundering herd** pattern.

---

# 18. But Retries Aren't Always Safe

Suppose:

```http
POST /payments
```

times out.

Did the payment fail?

Not necessarily.

The server might have:

```text
processed payment
```

but the response was lost.

The client sees:

```text
timeout
```

and retries.

Now we risk:

```text
charge twice
```

Therefore retrying requires another question:

> **Is the operation idempotent?**

---

# 19. Idempotency Changes the Design

For a payment operation, we might use:

```http
Idempotency-Key: 8f7a...
```

The server stores:

```text
idempotency_key
        ↓
result
```

If the same logical operation arrives again:

```text
same key
   ↓
already processed
   ↓
return previous result
```

Now retries become safer.

This is a much deeper solution than simply:

```text
retry = true
```

---

# 20. Tail Latency Can Come From Garbage Collection

Suppose:

```text
p50 = 20ms
p99 = 2s
```

and the application uses a garbage-collected runtime.

Most requests:

```text
20ms
```

but occasionally:

```text
GC pause
```

causes:

```text
1–2 second latency spike
```

depending on the runtime and workload.

If CPU metrics look normal at a coarse level, the tail may still be caused by:

```text
allocation rate
heap pressure
GC cycles
stop-the-world behavior
runtime scheduling
```

This is why runtime-level metrics can matter.

---

# 21. Tail Latency Can Come From Lock Contention

Suppose several requests update the same resource:

```text
user_id = 42
```

They all try:

```sql
UPDATE accounts
SET balance = ...
WHERE user_id = 42;
```

The database may serialize access.

Now:

```text
Request A → lock → 20ms
Request B → waiting → 200ms
Request C → waiting → 400ms
Request D → waiting → 800ms
```

The query itself isn't necessarily slow.

The requests are:

```text
waiting for a lock
```

This distinction matters enormously.

---

# 22. Tail Latency Can Come From Hot Keys

A distributed cache may look healthy globally:

```text
Redis CPU = 30%
```

but one key may receive enormous traffic:

```text
product:popular
```

Suppose:

```text
10 million requests/sec
```

all depend on one logical piece of state.

The system can develop:

```text
hot key
```

behavior.

Averages hide this.

You need per-key or per-operation visibility when relevant.

---

# 23. Tail Latency Can Come From One Bad Host

Suppose we have:

```text
100 API servers
```

and one has:

```text
network problems
```

or:

```text
CPU throttling
```

or:

```text
GC pressure
```

If the load balancer sends requests there, only a fraction of traffic becomes slow.

You might see:

```text
p50 = 20ms
p95 = 70ms
p99 = 2s
```

and wonder:

> "Why only 1%?"

Because perhaps:

```text
1 out of 100 hosts
```

is unhealthy.

This is why aggregate metrics can hide localized failures.

---

# 24. Always Break Metrics Down by Dimension

Instead of only:

```text
p99 latency = 2s
```

look at:

```text
service
instance
region
endpoint
HTTP status
dependency
tenant
database
availability zone
```

For example:

```text
Instance A → p99 = 30ms
Instance B → p99 = 25ms
Instance C → p99 = 28ms
Instance D → p99 = 2.1s
```

Now the mystery disappears.

---

# 25. One of the Most Dangerous Mistakes: Averaging Percentiles

Suppose:

```text
Region A:
p99 = 100ms

Region B:
p99 = 2s
```

You should not casually say:

```text
Global p99 ≈ (100ms + 2s) / 2
```

Percentiles are not generally composable that way.

You need the underlying distribution or appropriately aggregated histogram data.

This is a subtle but important observability concept.

---

# 26. Histograms Are Often Better Than Just Percentiles

Instead of only storing:

```text
p50
p95
p99
```

a histogram can represent:

```text
0–10ms
10–20ms
20–50ms
50–100ms
100–500ms
500ms–1s
1–2s
2s+
```

Then you can understand the shape of the distribution.

For example:

```text
0–20ms      ███████████████████
20–50ms     ███████
50–100ms    ██
100–500ms   █
500ms–1s    ▏
1–2s        ▏
2s+         ▏
```

The long tail becomes visible.

---

# 27. Don't Immediately Optimize the Slowest Endpoint

Suppose:

```text
GET /users
p99 = 2s
```

You investigate and discover:

```text
1% of requests
```

are slow because they trigger:

```text
large result sets
```

But perhaps those requests are only:

```text
admin/reporting traffic
```

while normal users are fast.

The right solution may not be:

```text
optimize everything
```

It may be:

```text
separate workload
```

For example:

```text
Interactive API
        ↓
Primary application

Reporting API
        ↓
Read replica / analytical store
```

Isolation can be more valuable than optimization.

---

# 28. Tail Latency Is Often a Resource Isolation Problem

Imagine:

```text
Normal requests
        │
        ▼
Shared worker pool
        ▲
        │
Expensive requests
```

A few expensive requests can occupy workers.

Then normal requests queue behind them.

Even though normal requests are cheap:

```text
normal request CPU = 5ms
```

they experience:

```text
queue wait = 1.5s
```

So their p99 becomes terrible.

This is called **head-of-line blocking** in certain queueing contexts.

The solution may be:

```text
Separate worker pools
Separate queues
Concurrency limits
Priority scheduling
Workload isolation
```

---

# 29. An Example Architecture

Instead of:

```text
                  API
                   │
             Shared Workers
             /            \
       Normal           Expensive
```

use:

```text
                    API
                  /     \
                 /       \
                ▼         ▼
       Normal Worker   Expensive Worker
             Pool            Pool
                │               │
                ▼               ▼
           Normal DB       Analytics DB
```

Now an expensive workload can't consume the entire capacity of the normal request path.

This is a powerful technique in high-scale systems.

---

# 30. The Interview Trap: "Just Scale Horizontally"

Suppose p99 is bad.

Someone says:

> "Add more servers."

Maybe.

But what if the bottleneck is:

```text
database
```

Then:

```text
10 servers
→ 100 servers
```

could produce:

```text
10× more database traffic
```

and make the database slower.

Similarly, if the bottleneck is:

```text
Redis
```

adding API servers may increase Redis pressure.

If the bottleneck is:

```text
network bandwidth
```

adding compute won't solve it.

Scaling the wrong layer can amplify the bottleneck.

---

# 31. Find the Saturation Point

A useful performance experiment is to gradually increase load:

```text
100 req/s
200 req/s
400 req/s
600 req/s
800 req/s
1000 req/s
```

Measure:

```text
throughput
p50
p95
p99
CPU
memory
I/O
queue depth
dependency latency
errors
```

You might discover:

```text
600 req/s → p99 = 100ms
700 req/s → p99 = 150ms
800 req/s → p99 = 400ms
900 req/s → p99 = 1.5s
```

This reveals the system's knee point.

The system isn't simply:

```text
fast
```

or:

```text
slow
```

It has a capacity curve.

---

# 32. Capacity Planning Is About the Tail

Suppose your SLA is:

```text
p99 < 500ms
```

and the system can technically process:

```text
10,000 req/s
```

but at:

```text
9,500 req/s
```

p99 becomes:

```text
2 seconds
```

Then your practical capacity under that SLA is not:

```text
10,000 req/s
```

It may be closer to:

```text
8,000 req/s
```

depending on the measured behavior.

This is why:

> **Capacity is defined by the performance target, not merely by maximum throughput before the system crashes.**

---

# 33. What Would I Investigate First?

If I received:

```text
p50 = 20ms
p95 = 80ms
p99 = 2s
```

my first steps would be:

```text
1. Confirm the metric and time window.
2. Break latency down by endpoint.
3. Break it down by instance/region.
4. Inspect distributed traces for slow requests.
5. Identify where time is spent waiting.
6. Check queue and connection-pool wait.
7. Check dependency tail latency.
8. Check GC/runtime pauses.
9. Check lock contention.
10. Check retries and timeouts.
11. Compare traffic against saturation.
```

I would **not** immediately:

```text
increase CPU
increase DB connections
add servers
add cache
```

without evidence.

---

# 34. The Senior Debugging Loop

A useful mental model:

```text
                 Symptom
                    │
                    ▼
              Measure Tail
                    │
                    ▼
            Locate Slow Time
                    │
                    ▼
           Identify Bottleneck
                    │
                    ▼
             Form Hypothesis
                    │
                    ▼
              Test Hypothesis
                    │
                    ▼
               Apply Fix
                    │
                    ▼
            Measure p99 Again
```

The key is:

> **Don't optimize what you cannot explain.**

---

# 35. The 60-Second Interview Answer

If the interviewer asks:

> **"Your API has a p50 of 20ms but p99 of 2 seconds. What do you do?"**

A strong answer:

> "I would treat this as a tail-latency problem rather than optimizing the average. First I'd break the latency down by endpoint, instance, region, and dependency, then use distributed tracing to determine whether the slow time is actual execution or queueing/waiting.
>
> I'd inspect application worker queues, database connection-pool wait, database lock contention, slow queries, downstream dependency p99, network latency, GC/runtime pauses, and retry behavior. I'd also check whether one unhealthy instance or region is responsible for the tail.
>
> If the request depends on multiple downstream services, I'd consider the fact that the overall latency can be dominated by the slowest dependency, so individually acceptable p99s can combine into a much worse end-to-end tail.
>
> Finally, I'd check whether timeouts and retries are amplifying the problem. I wouldn't immediately scale the API horizontally because the actual bottleneck could be a shared database, cache, queue, or downstream service. I'd identify the saturated resource first and then decide whether to optimize, isolate workloads, add capacity, or introduce backpressure."

---

# 36. Interviewer Follow-Up: "What If Everything Looks Fine?"

The interviewer might push:

> "CPU is fine. Memory is fine. Database is fine. Redis is fine. Why is p99 still 2 seconds?"

This is where you should start thinking about:

```text
Queueing
Locks
Network
GC
Scheduler
Connection pools
Thread pools
Connection acquisition
Load balancer behavior
One unhealthy host
DNS
TLS
Kernel/socket queues
External dependencies
```

The important insight is:

> **A resource can be underutilized while requests are still waiting on it.**

---

# 37. Interviewer Follow-Up: "Why Does p99 Matter More Than Average?"

A good answer:

> "Because user experience and system behavior are determined by the distribution, not just the mean. At high request volumes, even a 1% tail represents a large absolute number of slow requests. More importantly, tail latency often interacts with timeouts, retries, queueing, and dependency composition, so a small tail can become a system-wide reliability problem."

---

# 38. Interviewer Follow-Up: "Can Lowering p50 Make p99 Worse?"

Yes.

Imagine an optimization increases throughput:

```text
p50:
20ms → 10ms
```

but also increases:

```text
contention
```

so:

```text
p99:
500ms → 2s
```

The system became faster for most requests but significantly worse for the tail.

This can happen when optimizing for average throughput without considering:

```text
contention
queueing
resource saturation
```

Therefore:

> **A performance optimization should be evaluated against the entire latency distribution.**

---

# 39. The Deeper Principle

The deepest lesson isn't:

> "Use p99."

It is:

> **Latency is an emergent property of the entire system.**

A request doesn't care that:

```text
CPU = fast
Database = fast
Redis = fast
Network = fast
```

individually.

It experiences:

```text
queues
+
dependencies
+
contention
+
timeouts
+
retries
+
scheduling
+
resource limits
```

The end-to-end latency emerges from their interaction.

---

# 40. Final Mental Model

When you see:

```text
p50 = 20ms
p99 = 2s
```

don't ask:

> "What code is slow?"

Ask:

```text
Where did the slow requests spend their time?
```

Then decompose:

```text
                2 seconds
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Queue       Execute     Wait
        │           │           │
        ▼           ▼           ▼
    Workers       CPU       Dependencies
    DB Pool       GC        Locks
    Network                 I/O
```

And finally ask:

> **"What resource is actually causing the tail?"**

That's the Senior-level question.

---

# 41. Final Takeaway

The most dangerous performance metric is often:

```text
"Everything looks fine on average."
```

Distributed systems don't fail because every request is slow.

They can fail because:

```text
a small fraction
        ↓
becomes a large absolute number
        ↓
creates queues
        ↓
causes timeouts
        ↓
causes retries
        ↓
creates more load
        ↓
pushes the system closer to saturation
```

So when an interviewer gives you:

```text
p50 = 20ms
p95 = 80ms
p99 = 2s
```

don't immediately optimize the 20ms.

Find the **2 seconds**.

And more importantly:

> **Find what the request was waiting for during those 2 seconds.**

That question will often lead you much closer to the real bottleneck than CPU utilization, average latency, or raw throughput ever will.
