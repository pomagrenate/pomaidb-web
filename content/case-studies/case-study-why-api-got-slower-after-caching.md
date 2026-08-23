---
title: "CASE STUDY: Why Did Our API Get Slower After We Added Caching?"
slug: "case-study-why-api-got-slower-after-caching"
date: "2026-08-23"
author: "Quan Van"
excerpt: "A senior-level backend interview case study about a counterintuitive production problem: adding Redis caching makes an API slower instead of faster."
tags:
  - Backend Engineering
  - System Design
  - Redis
  - Caching
  - Performance
  - Distributed Systems
  - Database
  - Senior Interview
category: "Case Study"
---

# CASE STUDY: Why Did Our API Get Slower After We Added Caching?

> **Interview Question**
>
> **"We added Redis caching to an API that was hitting PostgreSQL heavily. Database CPU dropped significantly, but API latency increased from 80ms to 250ms. How would you investigate this?"**

This is a deceptively difficult interview question.

A junior engineer may immediately say:

> "Redis is slow."

Another might say:

> "Maybe the network is slow."

A more dangerous answer is:

> "Let's increase the Redis connection pool."

But none of those answers explain the actual system.

The interesting part of this problem is that **the database got healthier while the API got slower**.

That means our optimization probably succeeded at one layer while introducing a bottleneck somewhere else.

This case study is about how to reason through that situation.

---

# 1. The Original Architecture

Suppose we have this API:

```text
GET /api/products/:id
````

Before caching:

```text
Client
   │
   ▼
API Server
   │
   ▼
PostgreSQL
```

Typical request:

```text
HTTP
 ↓
Application
 ↓
PostgreSQL
 ↓
Application
 ↓
HTTP Response
```

Observed metrics:

```text
p50: 35ms
p95: 80ms
p99: 150ms

PostgreSQL CPU:
75%
```

The database is clearly doing significant work.

So the team decides:

> "Product data doesn't change frequently. Let's cache it."

Reasonable.

---

# 2. We Add Redis

Architecture becomes:

```text
Client
   │
   ▼
API Server
   │
   ▼
 Redis
   │
   ├── HIT ───────► Response
   │
   └── MISS
         │
         ▼
     PostgreSQL
         │
         ▼
       Redis
```

The expected result:

```text
Redis HIT
   ↓
avoid PostgreSQL
   ↓
lower latency
   ↓
lower DB CPU
```

After deployment:

```text
PostgreSQL CPU:
75% → 25%
```

Great.

But:

```text
API p95:
80ms → 250ms
```

Something is wrong.

---

# 3. The First Senior-Level Observation

Don't immediately optimize Redis.

First ask:

> **What exactly changed between the old request path and the new request path?**

Before:

```text
Application
    │
    ▼
PostgreSQL
```

After:

```text
Application
    │
    ▼
Redis
    │
    └── sometimes PostgreSQL
```

We've introduced:

```text
new network hop
new serialization
new deserialization
new connection pool
new timeout
new failure mode
new synchronization behavior
new memory pressure
```

Caching isn't "free."

We've replaced:

```text
one dependency
```

with:

```text
another dependency
```

and created additional application logic.

---

# 4. Start With the Latency Budget

Suppose the original request looked like:

```text
Application processing: 10ms
Database:               60ms
Network:                10ms
--------------------------------
Total:                  80ms
```

After caching:

```text
Application processing: 20ms
Redis:                  120ms
Serialization:           30ms
Network:                 20ms
--------------------------------
Total:                  190ms
```

The first question becomes:

> **Where did the additional latency come from?**

We shouldn't guess.

We need to break the request down.

---

# 5. Distributed Tracing

The first tool I would reach for is distributed tracing.

For example:

```text
HTTP Request
│
├── auth             4ms
│
├── cache.get       110ms
│
├── JSON decode      20ms
│
└── response         6ms
```

Now we have a very strong signal:

```text
cache.get = 110ms
```

Redis isn't supposed to take 110ms for a simple GET in a healthy local deployment.

So now we investigate Redis.

---

# 6. But "Redis Is Slow" Is Still Too Vague

We need to distinguish:

```text
Redis server latency
```

from:

```text
application → Redis latency
```

These are not necessarily the same.

Suppose Redis itself reports:

```text
GET latency:
0.8ms
```

but our application tracing says:

```text
cache.get:
110ms
```

Interesting.

Redis isn't actually processing the command for 110ms.

Something is happening around it.

Possible causes:

```text
connection pool exhaustion
network latency
connection establishment
serialization
client-side locking
thread scheduling
event-loop starvation
queueing
TLS overhead
```

---

# 7. Connection Pool Exhaustion

This is one of the first things I'd investigate.

Suppose:

```text
Application workers:
200
```

but:

```text
Redis connections:
10
```

Now 200 requests may compete for 10 connections.

Conceptually:

```text
200 requests
      │
      ▼
┌──────────────┐
│ Redis Pool   │
│              │
│ 10 conns     │
└──────┬───────┘
       │
       ▼
     Redis
```

If all connections are busy:

```text
request
   ↓
wait for connection
   ↓
Redis GET
```

The Redis command itself may still take:

```text
1ms
```

but the request spent:

```text
100ms
```

waiting for a connection.

This is a classic example of why:

> **Dependency latency and end-to-end latency are not the same metric.**

---

# 8. A Useful Formula

Think of:

```text
Cache latency
```

as:

```text
pool wait
+
connection setup
+
network
+
Redis processing
+
response transfer
+
deserialization
```

So:

```text
Redis GET = 1ms
```

doesn't mean:

```text
cache.get() = 1ms
```

The application may experience:

```text
cache.get() = 100ms
```

because of everything surrounding the actual command.

---

# 9. What If the Pool Is Fine?

Suppose we verify:

```text
Redis pool:
healthy

pool wait:
<1ms

Redis command latency:
<1ms
```

But:

```text
application cache.get:
100ms
```

Now we investigate serialization.

---

# 10. The Cache Value Might Be Huge

Suppose the API returns:

```json
{
  "id": 123,
  "name": "Product",
  "description": "...",
  "reviews": [...],
  "recommendations": [...],
  "metadata": {...}
}
```

The team decides to cache the entire response.

Maybe the cached payload is:

```text
2 MB
```

Every request now performs:

```text
Redis
 ↓
2MB payload
 ↓
network
 ↓
deserialization
 ↓
allocation
 ↓
JSON parsing
```

The database may be doing less work.

But the application is doing more work.

---

# 11. Cache Hit Does Not Mean Cheap

This is a subtle but important concept.

A cache hit means:

```text
we avoided the original expensive operation
```

It does **not** mean:

```text
the replacement operation is cheap
```

For example:

```text
PostgreSQL query:
30ms

Redis GET:
1ms

Deserialize:
20ms

Copy:
10ms

Network:
15ms
```

The cached request can still be:

```text
46ms
```

depending on the architecture.

---

# 12. Serialization Can Become the Bottleneck

Suppose we cache:

```text
large nested object
```

as JSON.

The request path becomes:

```text
Redis
 ↓
bytes
 ↓
JSON parser
 ↓
temporary objects
 ↓
application object
```

That creates:

```text
CPU work
memory allocations
GC pressure
```

If the service is written in a garbage-collected language, repeated allocation can become particularly significant.

You might see:

```text
Redis CPU:
low

PostgreSQL CPU:
low

Application CPU:
high

GC:
high
```

The optimization moved the work.

---

# 13. Cache Stampede

Now consider another possibility.

Suppose a popular key expires:

```text
product:123
```

At time:

```text
12:00:00
```

it expires.

Suddenly:

```text
1,000 requests
```

arrive simultaneously.

All see:

```text
CACHE MISS
```

Then:

```text
1,000 requests
      │
      ├── PostgreSQL
      ├── PostgreSQL
      ├── PostgreSQL
      ├── PostgreSQL
      └── ...
```

The cache has failed exactly when we needed it most.

This is called:

> **Cache stampede**

or:

> **Thundering herd**

---

# 14. The More Dangerous Version

Suppose the cache miss causes:

```text
1,000 DB queries
```

PostgreSQL becomes slow.

Then requests remain active longer.

That causes:

```text
more concurrent requests
```

which creates:

```text
more connection pressure
```

which causes:

```text
more waiting
```

which causes:

```text
higher latency
```

Now the system looks like:

```text
Cache expiration
      ↓
Cache miss spike
      ↓
DB traffic spike
      ↓
DB latency spike
      ↓
Request duration increases
      ↓
More requests remain in-flight
      ↓
Connection pools saturate
      ↓
System latency explodes
```

This is a feedback loop.

---

# 15. How Would You Fix Cache Stampede?

There are several strategies.

### Request coalescing

Only one request rebuilds the cache:

```text
Request A ─┐
Request B ─┤
Request C ─┤
Request D ─┤
            ▼
        Lock / Singleflight
            │
            ▼
        PostgreSQL
            │
            ▼
          Redis
            │
       ┌────┼────┐
       ▼    ▼    ▼
       A    B    C
```

This prevents:

```text
N requests
```

from generating:

```text
N database queries
```

---

# 16. Stale-While-Revalidate

Another strategy is:

```text
serve stale value
+
refresh asynchronously
```

Instead of:

```text
expired
 ↓
block request
 ↓
query DB
```

we can:

```text
stale cache
 ↓
return immediately

background refresh
 ↓
Redis
```

This trades:

```text
perfect freshness
```

for:

```text
better availability and latency
```

That trade-off can be perfectly reasonable for:

```text
product catalog
news
recommendations
configuration
analytics
```

but not necessarily for:

```text
account balance
payment status
inventory reservation
```

---

# 17. Cache Invalidation

This leads to one of the most famous distributed-systems problems:

> **"There are only two hard things in Computer Science: cache invalidation and naming things."**

Suppose:

```text
Product price = $100
```

Redis contains:

```text
product:123 → $100
```

Then PostgreSQL changes:

```text
$100 → $80
```

If we don't invalidate Redis:

```text
Database:
$80

Cache:
$100
```

The API returns stale data.

So caching introduces a new consistency problem.

---

# 18. Write-Through vs Cache-Aside

There are several caching patterns.

### Cache-aside

Application controls the cache:

```text
Read:

Application
   ↓
Cache
   │
   └── miss → DB → Cache
```

Write:

```text
Application
   ↓
DB
   ↓
Invalidate Cache
```

This is simple and common.

But invalidation must be correct.

---

# 19. Write-Through

The application writes through the cache:

```text
Application
     ↓
Cache
     ↓
Database
```

The cache becomes part of the write path.

This can provide stronger consistency properties depending on implementation.

But it also makes the write path more complicated.

---

# 20. Write-Behind

Another pattern:

```text
Application
     ↓
Cache
     ↓
Async persistence
     ↓
Database
```

Now writes may be acknowledged before reaching the database.

This can improve write throughput.

But the system now accepts:

```text
temporary inconsistency
```

and potentially:

```text
data loss
```

if the cache fails before persistence.

Again:

> **Caching is fundamentally a consistency trade-off, not just a performance optimization.**

---

# 21. The Interview Trap

Interviewer:

> **"Would you cache database results?"**

Weak answer:

> "Yes, Redis makes it faster."

Strong answer:

> "Potentially, but I'd first establish that the database is actually the bottleneck and that the data has a suitable consistency and access pattern. I'd consider cacheability, hit ratio, invalidation strategy, TTL, object size, memory cost, stampede behavior, and failure semantics. A cache adds another distributed dependency, so I wouldn't introduce it just because Redis is fast."

That answer demonstrates system-level thinking.

---

# 22. Cache Hit Ratio

Suppose:

```text
1,000,000 requests
```

and:

```text
Cache hits = 950,000
Cache misses = 50,000
```

Then:

$$
HitRatio =
\frac{950000}{1000000}
= 95%
$$

Excellent.

But now imagine:

```text
Hit ratio = 20%
```

The system still pays:

```text
Redis lookup
+
application overhead
+
database query
```

for most requests.

You might have added complexity without achieving much benefit.

---

# 23. Cache Effectiveness Is More Than Hit Ratio

A 99% hit rate isn't automatically good.

Imagine:

```text
1% misses
```

but those 1% are:

```text
the hottest keys
```

and each miss triggers:

```text
expensive database work
```

Then those misses may still dominate system cost.

You should care about:

```text
hit ratio
miss cost
key distribution
object size
eviction rate
latency
```

---

# 24. The Hot-Key Problem

Imagine one product is extremely popular:

```text
product:iphone
```

receiving:

```text
100,000 requests/sec
```

while other products receive:

```text
100 requests/sec
```

Now a single key becomes a hotspot.

Even though:

```text
cache hit ratio = 99.99%
```

we may still have:

```text
one extremely hot key
```

creating:

```text
CPU concentration
network concentration
single-node pressure
```

This is the hot-key problem.

---

# 25. Cache Locality

Another question:

> **Where is Redis located?**

Architecture A:

```text
API
 │
 ▼
Redis
```

same machine or same low-latency network.

Architecture B:

```text
API
 │
 ▼
Cross-region network
 │
 ▼
Redis
```

These are completely different latency profiles.

A cache doesn't magically eliminate network latency.

If your cache is:

```text
Singapore
```

while your API is:

```text
Vietnam
```

you've introduced a network dependency into every cache hit.

---

# 26. Distributed Cache vs Local Cache

You can also use:

```text
Application
   │
   ├── Local Memory Cache
   │
   └── Redis
```

Now the request path becomes:

```text
L1 cache
 ↓ miss
L2 cache
 ↓ miss
Database
```

For example:

```text
L1 = process memory
L2 = Redis
L3 = PostgreSQL
```

This can dramatically reduce latency for extremely hot data.

But now we have multiple copies.

Which means:

```text
more invalidation
more consistency complexity
more memory
```

Again, optimization introduces trade-offs.

---

# 27. The Cache Hierarchy

Think of it as:

```text
             Fast
              ▲
              │
      ┌──────────────┐
      │ CPU / Memory │
      └──────────────┘
              │
      ┌──────────────┐
      │ Local Cache  │
      └──────────────┘
              │
      ┌──────────────┐
      │    Redis     │
      └──────────────┘
              │
      ┌──────────────┐
      │  PostgreSQL  │
      └──────────────┘
              │
              ▼
             Slow
```

The further down you go:

```text
higher latency
higher capacity
often stronger persistence
```

depending on the architecture.

---

# 28. What If Redis Goes Down?

This is another critical interview question.

Suppose:

```text
Redis
  X
```

Do we:

### Option A

```text
API fails
```

or:

### Option B

```text
Redis unavailable
       ↓
fallback to DB
```

Option B sounds better.

But imagine:

```text
1,000 requests/sec
```

and all requests suddenly fall back to PostgreSQL.

The database may collapse.

This is:

> **Cache failure amplification.**

---

# 29. The Cache Should Not Automatically Become a Single Point of Failure

If Redis is an optimization layer:

```text
Redis = performance
Database = source of truth
```

then we generally don't want:

```text
Redis failure
   ↓
entire API failure
```

But we also don't want:

```text
Redis failure
   ↓
all traffic → DB
   ↓
DB overload
```

So we need controlled fallback.

For example:

```text
Redis unavailable
      ↓
rate-limited DB fallback
      ↓
bounded concurrency
      ↓
protect database
```

This is much safer.

---

# 30. Circuit Breaker Around the Cache?

This sounds strange because Redis is "just a cache."

But if Redis becomes unhealthy:

```text
every request
 ↓
Redis timeout
 ↓
wait 1 second
 ↓
fallback DB
```

you've added:

```text
1 second
```

to every request.

A circuit breaker or short timeout can allow the application to bypass an unhealthy cache temporarily.

The key is:

> **Failing fast can be better than waiting for a dependency that is already unhealthy.**

---

# 31. Cache Timeouts Matter

Imagine:

```text
Redis timeout = 5 seconds
```

and:

```text
1,000 concurrent requests
```

all wait for Redis.

Potentially:

```text
1,000 requests
×
5 seconds
```

worth of worker occupancy.

Now suppose:

```text
Redis timeout = 50ms
```

Requests fail quickly and can potentially fallback or return an appropriate error.

Timeouts are part of capacity design.

---

# 32. Why Retries Can Make It Worse

Suppose Redis times out.

We retry:

```text
Request
 ↓
Redis
 ↓ timeout
Redis
 ↓ timeout
Redis
 ↓ timeout
```

Now one user request becomes:

```text
3 dependency requests
```

Under load:

```text
10,000 requests
```

can become:

```text
30,000 Redis requests
```

This is a retry storm.

Therefore:

> **Retries increase load.**

Retries must be bounded and carefully designed.

---

# 33. The Retry + Cache Failure Disaster

Consider:

```text
Redis slow
   ↓
requests timeout
   ↓
application retries
   ↓
Redis receives more traffic
   ↓
Redis becomes even slower
   ↓
more timeouts
   ↓
more retries
```

That's another feedback loop.

A Senior engineer should always ask:

> **"What happens when the dependency is slow, not just when it is completely down?"**

Partial failure is often more dangerous than total failure.

---

# 34. What Metrics Would I Monitor?

For the API:

```text
request rate
p50
p95
p99
error rate
in-flight requests
```

For Redis:

```text
command latency
connections
connection pool wait
memory
evictions
hit/miss ratio
CPU
network throughput
hot keys
```

For PostgreSQL:

```text
CPU
active connections
query latency
locks
buffer/cache hit ratio
slow queries
connection pool wait
```

For the application:

```text
CPU
memory
GC
allocation rate
thread pool utilization
queue depth
```

Without these metrics, debugging becomes guesswork.

---

# 35. What Would I Check First?

My investigation order would be:

```text
1. Confirm the latency regression
2. Compare p50 / p95 / p99
3. Trace request path
4. Measure Redis command latency
5. Measure Redis pool wait
6. Check serialization cost
7. Check payload size
8. Check cache hit ratio
9. Check cache miss behavior
10. Check DB fallback traffic
11. Check connection pools
12. Check application CPU / memory / GC
```

The exact order can change depending on telemetry.

But the principle is:

> **Follow the latency, don't guess the bottleneck.**

---

# 36. The Most Interesting Possibility

Suppose we discover:

```text
Redis:
1ms

DB:
20ms

API:
250ms
```

And:

```text
Redis pool wait:
180ms
```

Now the mystery is solved.

The problem wasn't:

```text
Redis processing
```

It was:

```text
connection pool contention
```

Perhaps we configured:

```text
max_connections = 10
```

while the API has:

```text
500 concurrent requests
```

The database got faster because Redis absorbed the reads.

But the Redis connection pool became the new bottleneck.

---

# 37. This Is Bottleneck Migration

The system changed from:

```text
Before:

API → PostgreSQL
       ▲
       │
   Bottleneck
```

to:

```text
After:

API → Redis → PostgreSQL
      ▲
      │
  Bottleneck
```

The optimization did work.

It reduced PostgreSQL pressure.

But the system's bottleneck migrated.

This is one of the most important lessons in performance engineering:

> **An optimization can succeed locally while making the overall system worse.**

---

# 38. The Correct Fix

Suppose the root cause is:

```text
Redis pool too small
```

We could increase:

```text
10 → 50
```

But don't stop there.

Ask:

```text
Can Redis safely handle 50 connections?
```

And:

```text
Will 50 connections per application instance
be safe if we have 20 instances?
```

Because:

```text
50 × 20 = 1,000 Redis connections
```

Suddenly the global architecture matters.

---

# 39. Per-Instance Configuration Can Be Dangerous

Imagine:

```text
20 API instances
```

each configured:

```text
Redis pool = 100
```

Potential maximum:

```text
20 × 100 = 2,000 connections
```

Maybe Redis can handle that.

Maybe it can't.

This is why distributed systems require us to reason about:

```text
local limits
+
global limits
```

A configuration that looks safe on one machine can be unsafe at fleet scale.

---

# 40. Another Subtle Problem: Connection Storms

Suppose all API instances restart.

There are:

```text
100 instances
```

and each opens:

```text
100 Redis connections
```

That's:

```text
10,000 connection attempts
```

almost simultaneously.

This can create a connection storm.

Therefore systems often need:

```text
connection limits
backoff
jitter
startup staggering
```

rather than assuming dependencies can absorb arbitrary connection bursts.

---

# 41. What About Cache TTL?

Suppose:

```text
TTL = 10 seconds
```

for:

```text
1 million keys
```

If many keys are created around the same time, they can expire around the same time.

That can produce:

```text
mass expiration
 ↓
cache misses
 ↓
DB spike
```

Randomized TTLs can spread expiration:

```text
TTL = base + random_jitter
```

For example:

```text
10s + random(0..5s)
```

Now expirations are distributed over time.

---

# 42. Cache Eviction Can Produce the Same Problem

Suppose Redis memory becomes full.

Redis starts evicting keys.

Hit ratio changes:

```text
95%
 ↓
70%
```

Database traffic rises:

```text
5%
 ↓
30%
```

Database latency rises.

Application latency rises.

So a cache can fail gradually rather than suddenly.

This is why:

```text
cache hit ratio
```

is an operational metric, not merely a performance statistic.

---

# 43. The Real Definition of a Good Cache

A good cache isn't simply:

```text
fast
```

It should provide:

```text
high useful hit rate
predictable latency
controlled memory usage
safe failure behavior
appropriate consistency
bounded miss amplification
```

A cache that is extremely fast but causes:

```text
stale data
+
stampedes
+
DB overload
```

is not a good cache architecture.

---

# 44. A Senior-Level Architecture

A more robust architecture could look like:

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     API      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Local Cache  │
                    └──────┬───────┘
                           │ miss
                    ┌──────▼───────┐
                    │    Redis     │
                    └──────┬───────┘
                           │ miss
                    ┌──────▼───────┐
                    │   Singleflight
                    │ / Coalescing │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ PostgreSQL   │
                    └──────────────┘
```

With:

```text
timeouts
bounded concurrency
metrics
tracing
circuit breakers
```

around appropriate boundaries.

---

# 45. The Actual Interview Answer

If asked:

> **"We added Redis, DB CPU dropped, but API latency increased. What would you do?"**

I would answer:

> "First, I would not assume Redis itself is slow. I'd break down the end-to-end latency using tracing and compare the old and new request paths.
>
> I'd specifically measure Redis command latency separately from application-side cache latency, because the application may be waiting for a Redis connection, serialization, network I/O, or a lock even if Redis itself is fast.
>
> I'd then check Redis connection-pool utilization and wait time, cache hit ratio, payload size, serialization cost, application CPU and memory, and whether cache misses are creating database spikes.
>
> I'd also investigate cache stampedes, hot keys, eviction, TTL synchronization, and fallback behavior when Redis is slow or unavailable.
>
> If Redis is healthy but the application spends 100ms waiting for a connection from a pool, then the optimization has simply moved the bottleneck from PostgreSQL to Redis connection management.
>
> I would fix the actual bottleneck and then re-run load tests, because increasing the Redis pool blindly could just move the bottleneck again to Redis itself or create too many connections across the entire fleet."

---

# 46. The Follow-Up That Often Appears

Interviewer:

> **"Would you increase the Redis connection pool?"**

The correct answer is:

> **"Possibly, but only after confirming pool contention is the bottleneck."**

Then continue:

> "I'd also calculate the global connection count across all application instances and verify that Redis can safely handle it. I wouldn't optimize a local metric without considering fleet-wide resource limits."

That's a much stronger answer than:

> "Yes, increase it."

---

# 47. Another Follow-Up

Interviewer:

> **"What if Redis becomes unavailable?"**

Answer:

> "I would define the cache's failure semantics explicitly. If Redis is only an optimization layer, the database should remain the source of truth, but I wouldn't blindly send all traffic to the database during a cache outage. I'd use short timeouts, bounded fallback concurrency, potentially a circuit breaker, and load shedding if necessary to protect the database."

---

# 48. Another Follow-Up

Interviewer:

> **"What if 10,000 requests miss the same key?"**

Answer:

> "I'd prevent them from independently rebuilding the same cache entry. I'd use request coalescing or singleflight so only one request fetches the data and populates the cache while the others wait for the shared result. For data where slight staleness is acceptable, stale-while-revalidate is another option."

---

# 49. Another Follow-Up

Interviewer:

> **"Is caching always a good performance optimization?"**

Answer:

> "No. Caching trades computation and latency for memory, consistency complexity, invalidation complexity, and another operational dependency. I'd cache data when access patterns, freshness requirements, object size, and miss cost justify it. If the underlying query is already cheap or has poor locality, caching may add complexity without meaningful benefit."

---

# 50. The Deeper Lesson

The interesting part of this case isn't Redis.

It's this:

```text
Optimization
    ↓
Changes resource usage
    ↓
Changes bottleneck
    ↓
Changes system behavior
```

You cannot evaluate a performance optimization purely by looking at the component you optimized.

If:

```text
DB CPU ↓
```

that is good.

But if:

```text
API latency ↑
```

then the system as a whole got worse.

The only meaningful question is:

> **Did the system achieve a better overall performance envelope?**

---

# 51. What I Would Remember for an Interview

When someone asks about a surprising performance regression, use this sequence:

```text
1. Establish the symptom
2. Measure the latency breakdown
3. Identify the bottleneck
4. Understand resource contention
5. Check downstream effects
6. Check failure behavior
7. Check saturation
8. Change one thing
9. Load-test again
```

Don't start with:

```text
"Increase X."
```

Start with:

```text
"Where is the time actually being spent?"
```

---

# 52. Final Mental Model

A backend is a pipeline:

```text
Request
  ↓
Application
  ↓
Cache
  ↓
Database
  ↓
External Services
```

Every layer has:

```text
capacity
latency
queue
connections
failure modes
```

Adding a cache doesn't remove the complexity.

It changes the topology:

```text
Before:

Application → Database


After:

Application → Cache → Database
```

And therefore creates new questions:

```text
What happens on hit?
What happens on miss?
What happens on expiration?
What happens under stampede?
What happens when cache is slow?
What happens when cache is down?
What happens when cache is full?
What happens when connections are exhausted?
What happens when the cached object is huge?
What happens when the data changes?
```

If you can answer those questions, you're no longer thinking about:

> "How do I make Redis fast?"

You're thinking about:

> **"How do I make the entire system predictable under load?"**

And that is the much more important Senior-level skill.

---

# Key Takeaways

```text
1. A cache hit is not automatically cheap.

2. End-to-end latency can be high even when Redis itself is fast.

3. Connection-pool contention can become the new bottleneck.

4. Cache misses can amplify database load.

5. Cache expiration can create thundering-herd problems.

6. Cache invalidation introduces consistency complexity.

7. Redis failure can overload the database if fallback is uncontrolled.

8. Retries can amplify dependency failures.

9. Cache hit ratio is necessary but not sufficient for evaluating cache effectiveness.

10. Optimizing one component can migrate the bottleneck somewhere else.

11. Distributed systems must be evaluated at fleet scale, not only per instance.

12. The goal is not maximum cache performance.
    The goal is predictable system behavior under load.
```

---

# One Sentence to Remember

> **A cache doesn't eliminate work; it changes where the work happens—and Senior engineers need to understand where that work moves.**