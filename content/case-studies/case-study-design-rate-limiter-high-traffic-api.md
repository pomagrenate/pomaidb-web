---
title: "CASE STUDY: How Would You Design a Rate Limiter for a High-Traffic API?"
slug: "case-study-design-rate-limiter-high-traffic-api"
date: "2026-08-23"
author: "Quan Van"
excerpt: "A system design case study answering a deceptively simple backend interview question: how would you design a distributed rate limiter that remains accurate, fast, and scalable?"
tags: ["System Design", "Backend", "Rate Limiting", "Redis", "Distributed Systems", "API", "Interview"]
category: "System Design"
---

# CASE STUDY: How Would You Design a Rate Limiter for a High-Traffic API?

> **Interview Question:**  
> **"How would you design a distributed rate limiter for a high-traffic API?"**

At first, the answer seems trivial.

Just count requests:

```text
user_42 → 100 requests
````

and reject the next one.

But the moment the API becomes distributed, the problem changes.

Suppose we have:

```text
                    Load Balancer
                  /       |       \
                 ↓        ↓        ↓
             Server 1  Server 2  Server 3
```

User `42` sends requests across all three servers.

If each server maintains its own counter:

```text
Server 1 → 40 requests
Server 2 → 35 requests
Server 3 → 30 requests
```

the system sees:

```text
40 + 35 + 30 = 105
```

requests.

But none of the servers knows that the global limit has already been exceeded.

Now we have a distributed coordination problem.

And that is the real interview question.

---

# 1. First, Define the Requirement

Let's say the API has:

```text
100 requests / minute / user
```

If:

```text
user_42
```

has already made 100 requests within the current limit window, request 101 should be rejected.

For example:

```http
HTTP/1.1 429 Too Many Requests
```

The system should ideally provide:

```text
Fast decision making
Horizontal scalability
Low latency
Distributed correctness
Automatic expiration
Fault tolerance
```

---

# 2. What Exactly Are We Limiting?

Before choosing an algorithm, we need to define the identity of the limit.

Possible keys include:

```text
IP address
User ID
API key
Tenant ID
Endpoint
User + Endpoint
```

For example:

```text
user:42
```

might have:

```text
100 req/min
```

while:

```text
tenant:acme
```

might have:

```text
10,000 req/min
```

A real system may combine several dimensions:

```text
IP
    ↓
10 req/sec

User
    ↓
100 req/min

Tenant
    ↓
10,000 req/min
```

The limiter can reject the request if **any required limit is exceeded**.

---

# 3. The Naive In-Memory Solution

The simplest implementation is:

```text
Map<UserID, Counter>
```

Conceptually:

```typescript
const counters = new Map<string, number>();
```

When a request arrives:

```text
user_42
   ↓
counter++
   ↓
counter > 100?
   ↓
reject
```

This works perfectly on a single server.

For example:

```text
┌─────────────────┐
│   API Server    │
│                 │
│ user_42 → 73    │
│ user_81 → 12    │
└─────────────────┘
```

The problem appears when we scale horizontally.

---

# 4. Why Local Counters Fail

Suppose we have:

```text
             Load Balancer
             /     |     \
            ↓      ↓      ↓
        Server A Server B Server C
```

User `42` sends:

```text
Server A → 40 requests
Server B → 40 requests
Server C → 40 requests
```

Each server sees:

```text
40 < 100
```

so all requests are accepted.

Globally:

```text
40 + 40 + 40 = 120
```

The user exceeded the limit.

The problem is:

> **The counter is local, but the limit is global.**

We therefore need shared state.

---

# 5. Introduce Redis

A common solution is to move the counter into a shared in-memory datastore.

```text
                  Load Balancer
                 /      |      \
                ↓       ↓       ↓
            Server A Server B Server C
                \       |       /
                 \      |      /
                      Redis
```

Now every server can access:

```text
user:42 → request_count
```

The basic flow becomes:

```text
Request
   ↓
API Server
   ↓
Redis
   ↓
Check counter
   ↓
Allow / Reject
```

This solves the basic consistency problem.

But it introduces another question:

> **How exactly should we count requests?**

---

# 6. The Fixed Window Algorithm

The simplest algorithm is a fixed time window.

For:

```text
100 requests / minute
```

we divide time into:

```text
10:00:00 → 10:00:59
10:01:00 → 10:01:59
10:02:00 → 10:02:59
```

Redis might store:

```text
rate:user:42:10:01
```

with:

```text
value = 73
TTL = remaining window
```

The algorithm is conceptually:

```text
window = current_time / 60

key = user + window

increment(key)

if counter > 100:
    reject
else:
    allow
```

Very simple.

Very fast.

But it has a nasty edge case.

---

# 7. The Fixed Window Boundary Problem

Suppose the limit is:

```text
100 requests/minute
```

User sends:

```text
100 requests
at 10:00:59
```

Then another:

```text
100 requests
at 10:01:00
```

The system sees:

```text
Window 1 → 100
Window 2 → 100
```

and allows everything.

But over approximately two seconds:

```text
200 requests
```

were accepted.

The nominal limit was:

```text
100/minute
```

but the user effectively generated:

```text
200 requests
in ~2 seconds
```

This is the fixed-window boundary problem.

---

# 8. Sliding Window

A more precise approach is a sliding window.

Instead of asking:

> "How many requests happened during this fixed minute?"

we ask:

> "How many requests happened during the previous 60 seconds?"

For example:

```text
Current time = 10:01:30

Window:
10:00:30 → 10:01:30
```

Now the boundary problem becomes much smaller.

But storing every request timestamp is expensive.

Suppose:

```text
1 million users
```

and each user generates:

```text
100 requests/minute
```

Storing every timestamp creates significant memory pressure.

---

# 9. Sliding Window Log

Conceptually:

```text
user_42:
[
  10:01:01,
  10:01:04,
  10:01:05,
  10:01:09,
  ...
]
```

When a new request arrives:

```text
Remove timestamps older than 60 seconds
Count remaining timestamps
If count < 100:
    append current timestamp
    allow
else:
    reject
```

This is accurate.

But memory usage becomes:

$$
O(R)
$$

where $R$ is the number of requests retained within the window.

For extremely high traffic, this can become expensive.

---

# 10. Sliding Window Counter

We can approximate the sliding window using multiple buckets.

For example:

```text
1 minute
```

can be divided into:

```text
10-second buckets
```

giving:

```text
10:00:00
10:00:10
10:00:20
10:00:30
10:00:40
10:00:50
```

Instead of storing every request timestamp, we store counts:

```text
user_42

10:00:00 → 13
10:00:10 → 17
10:00:20 → 11
10:00:30 → 20
...
```

The memory footprint is significantly smaller.

The trade-off is that the algorithm becomes approximate depending on the bucket size.

---

# 11. Token Bucket

Another extremely useful algorithm is the **Token Bucket**.

Instead of counting requests, imagine that every user owns a bucket of tokens.

Suppose:

```text
Capacity = 100 tokens
Refill rate = 10 tokens/sec
```

Every request consumes one token.

```text
Request
   ↓
Take 1 token
   ↓
Token available?
   ├── Yes → allow
   └── No  → reject
```

Tokens continuously refill.

This means a user can burst up to:

```text
100 requests
```

if the bucket is full.

After that, requests are constrained by:

```text
10 requests/sec
```

---

# 12. Why Token Bucket Is Interesting

Token Bucket naturally separates:

```text
Burst capacity
```

from:

```text
Sustained rate
```

For example:

```text
Bucket capacity = 100
Refill = 10/sec
```

means:

```text
Burst:
100 requests immediately

Sustained:
~10 requests/sec
```

This is often a better model for APIs than a simple fixed window.

---

# 13. The Token Bucket Equation

Let:

```text
C = bucket capacity
r = refill rate
Δt = elapsed time
T = current tokens
```

The token count can be conceptualized as:

$$
T' = \min(C, T + r\Delta t)
$$

When a request arrives:

$$
T'' = T' - 1
$$

The request is allowed if:

$$
T' \geq 1
$$

Otherwise:

```text
reject
```

This is a tiny algorithm.

But implementing it correctly in a distributed system is the difficult part.

---

# 14. The Race Condition

Imagine:

```text
Current tokens = 1
```

Two API servers receive requests simultaneously.

```text
Server A              Server B
   │                     │
   │ read tokens = 1     │
   │                     │
   │                     │ read tokens = 1
   │                     │
   ▼                     ▼
consume token         consume token
   │                     │
   ▼                     ▼
allow                  allow
```

Now:

```text
2 requests
```

were accepted even though only:

```text
1 token
```

existed.

The problem is that:

```text
read
+
modify
```

was not atomic.

This is a classic distributed concurrency problem.

---

# 15. Atomicity Matters

The operation needs to behave like:

```text
check
+
update
```

as one atomic operation.

Conceptually:

```text
if tokens >= 1:
    tokens--
    return ALLOW
else:
    return REJECT
```

must not be interleaved by another request.

This is where Redis scripting or atomic primitives can become useful.

For example, the entire token-bucket calculation can be executed atomically inside Redis.

The API servers then become clients of the atomic state transition.

---

# 16. Why Not Use PostgreSQL?

We could technically store counters in PostgreSQL.

For example:

```text
rate_limits
-------------------------
user_id
tokens
updated_at
```

But the limiter may be called on **every request**.

If the API receives:

```text
100,000 requests/sec
```

and every request generates:

```text
SELECT
UPDATE
```

against PostgreSQL, the rate limiter itself can become the bottleneck.

Redis is often better suited because:

```text
Memory-first
Low latency
Atomic primitives
TTL
High throughput
```

But this is a workload decision, not a universal rule.

---

# 17. The Rate Limiter Should Be Close to the Request

If every request has to travel through:

```text
API
 ↓
Rate Limit Service
 ↓
API
 ↓
Application
```

we add another network hop.

For a high-volume API, this can become expensive.

A common architecture is to put rate limiting near the edge:

```text
Client
  ↓
CDN / Gateway / Load Balancer
  ↓
Rate Limiter
  ↓
Application
```

For example:

```text
                Internet
                    │
                    ▼
              API Gateway
                    │
              Rate Limiter
                    │
             ┌──────┴──────┐
             ▼             ▼
         Service A      Service B
```

This allows abusive traffic to be rejected before it reaches expensive application logic.

---

# 18. Gateway-Level vs Application-Level Limits

We can have multiple layers.

### Gateway-level

Useful for:

```text
IP limits
API key limits
Global traffic protection
DDoS-like bursts
```

### Application-level

Useful for:

```text
Business-specific quotas
User-specific operations
Expensive endpoints
Tenant limits
```

For example:

```text
Gateway:
1000 req/sec/IP

Application:
10 expensive reports/hour/user
```

These are different concerns.

---

# 19. Different Endpoints May Need Different Limits

Imagine:

```http
GET /users
```

costs:

```text
1 CPU unit
```

while:

```http
POST /reports/generate
```

costs:

```text
500 CPU units
```

Giving both endpoints:

```text
100 req/min
```

would make little sense.

We might define:

```text
GET /users
→ 1000/min

POST /reports/generate
→ 10/min
```

The limiter can therefore use a compound key:

```text
user_id + endpoint
```

such as:

```text
rate:user_42:/reports/generate
```

---

# 20. Multi-Tenant APIs

Suppose we run a SaaS platform.

We have:

```text
Tenant A
Tenant B
Tenant C
```

Tenant A has:

```text
Plan: Free
Limit: 100 req/min
```

Tenant B:

```text
Plan: Pro
Limit: 10,000 req/min
```

Tenant C:

```text
Plan: Enterprise
Limit: 100,000 req/min
```

The rate limiter therefore needs configuration:

```text
Tenant
   ↓
Plan
   ↓
Rate Limit Policy
   ↓
Algorithm
```

For example:

```json
{
  "tenant": "acme",
  "requestsPerSecond": 500,
  "burst": 1000
}
```

This configuration should ideally not require redeploying the entire application.

---

# 21. Dynamic Configuration

Suppose a customer upgrades:

```text
100 req/min
```

to:

```text
10,000 req/min
```

The rate limiter should be able to update the policy dynamically.

Conceptually:

```text
Configuration Service
        ↓
Redis / Config Cache
        ↓
Rate Limiter
```

This introduces another caching problem:

> What happens when the configuration changes but some servers still have the old policy?

Possible strategies include:

```text
Short TTL
Pub/Sub invalidation
Versioned configuration
Central configuration service
```

Again, distributed systems are largely about managing state transitions.

---

# 22. What Happens When Redis Goes Down?

This is where the interview gets interesting.

Suppose:

```text
API
 ↓
Redis
 ↓
ERROR
```

What should happen?

There are at least two possible strategies.

### Fail open

```text
Redis unavailable
     ↓
Allow request
```

Advantages:

```text
Application remains available
```

Disadvantages:

```text
Potential abuse
Traffic spike
Backend overload
```

---

### Fail closed

```text
Redis unavailable
     ↓
Reject request
```

Advantages:

```text
Protect backend
```

Disadvantages:

```text
Healthy users may be blocked
```

There is no universal answer.

The decision depends on the endpoint.

---

# 23. Fail Open for Some APIs

For a normal public read API:

```text
GET /products
```

you might prefer:

```text
Redis failure
↓
temporarily fail open
```

because availability is important.

For an expensive endpoint:

```text
POST /ai/generate
```

you might prefer:

```text
Redis failure
↓
fail closed
```

because allowing unrestricted traffic could destroy the backend.

This is a good example of why system design should be driven by business requirements.

---

# 24. What About Local Fallback?

A distributed limiter can also use:

```text
Global Redis limit
+
Local emergency limit
```

For example:

```text
Global:
1000 req/min/user

Local emergency protection:
200 req/sec/server
```

Even if Redis fails, each server has a local circuit breaker or protection mechanism.

This doesn't preserve the exact global rate limit.

But it can protect the application from catastrophic overload.

This is an example of **defense in depth**.

---

# 25. Distributed Rate Limiting Is an Accuracy vs Availability Problem

At this point we can see a broader trade-off.

We want:

```text
Perfect global accuracy
+
Zero latency
+
No coordination
+
Infinite scalability
+
High availability
```

We cannot generally get all of these simultaneously.

The more globally accurate the limiter must be, the more coordination is required.

The more coordination we introduce:

```text
Server
  ↓
Shared State
  ↓
Decision
```

the more latency and failure dependencies we introduce.

Therefore:

> **Rate limiting is fundamentally a trade-off between accuracy, latency, coordination, and availability.**

---

# 26. What About Sharding Redis?

Suppose Redis contains:

```text
100 million users
```

and the traffic becomes enormous.

One Redis instance may no longer be enough.

We can shard:

```text
                 Redis Cluster
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     Node 1     Node 2     Node 3
```

Keys can be distributed using hashing:

```text
hash(user_id)
      ↓
Redis node
```

For example:

```text
user_42 → Node 1
user_81 → Node 3
user_99 → Node 2
```

Now rate-limit state is horizontally distributed.

---

# 27. The Important Consequence of Sharding

If the limiter checks:

```text
user
+
IP
+
tenant
```

and these keys live on different Redis nodes, a single request may require multiple distributed operations.

For example:

```text
User limit
    ↓
Node 1

Tenant limit
    ↓
Node 2

IP limit
    ↓
Node 3
```

Now the request decision becomes:

```text
Node 1
+
Node 2
+
Node 3
```

This increases complexity and latency.

Therefore, key design matters.

---

# 28. Composite Keys Can Help

Sometimes we can encode related dimensions into one key:

```text
tenant:user:endpoint
```

For example:

```text
acme:user_42:/reports
```

Then the state can be colocated.

But this changes what the limiter can efficiently enforce.

This is another recurring distributed-systems principle:

> **Data modeling determines communication patterns.**

---

# 29. HTTP Response Design

A rate limiter should communicate useful information to clients.

For example:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 12
```

Depending on the API design, headers may also expose:

```text
Limit
Remaining
Reset
```

Conceptually:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 17
X-RateLimit-Reset: 1724389200
```

The exact header scheme depends on the API standard and gateway implementation.

The important part is that the client should know:

```text
I was rate limited.
How much capacity remains?
When should I retry?
```

---

# 30. Clients Need Backoff

A rate limiter becomes much more useful when clients react correctly.

If the server returns:

```text
429
```

the client shouldn't immediately retry:

```text
request
 ↓
429
 ↓
request
 ↓
429
 ↓
request
 ↓
429
```

That creates a retry storm.

Instead, clients should use backoff.

For example:

$$
delay = base \times 2^n
$$

with some jitter.

Conceptually:

```text
Retry 1 → 100ms
Retry 2 → 200ms
Retry 3 → 400ms
Retry 4 → 800ms
```

with randomization to prevent many clients from retrying simultaneously.

---

# 31. Rate Limiting and Backpressure

Rate limiting is closely related to backpressure.

If downstream capacity is:

```text
10,000 requests/sec
```

but incoming traffic is:

```text
100,000 requests/sec
```

the system has two choices:

```text
Process everything
```

which eventually causes:

```text
Queue growth
Memory pressure
CPU saturation
Timeouts
Cascading failure
```

or:

```text
Reject excess work early
```

which preserves system health.

Therefore:

> **A rate limiter is not merely a security mechanism. It is also a load-shedding mechanism.**

---

# 32. Rate Limiting vs Concurrency Limiting

These are not identical.

Rate limiting controls:

```text
Requests / time
```

Concurrency limiting controls:

```text
Requests executing simultaneously
```

Suppose:

```text
100 requests/sec
```

but each request takes:

```text
10 seconds
```

Then:

$$
100 \times 10 = 1000
$$

requests could be simultaneously in flight.

A rate limiter alone may not protect the service.

We might additionally enforce:

```text
Maximum concurrent requests = 100
```

This is particularly useful for expensive operations.

---

# 33. A Better Production Architecture

Putting the pieces together:

```text
                         Internet
                            │
                            ▼
                   ┌─────────────────┐
                   │   API Gateway   │
                   └────────┬────────┘
                            │
                    Rate Limiting
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
         ┌──────────────┐       ┌──────────────┐
         │ Application  │       │ Application  │
         │   Server 1   │       │   Server N   │
         └──────┬───────┘       └──────┬───────┘
                │                      │
                └──────────┬───────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Redis Cluster   │
                  │                 │
                  │ Token Buckets   │
                  │ Counters        │
                  │ Policies        │
                  └─────────────────┘
```

The gateway can reject abusive traffic before it consumes application resources.

The application can still perform business-specific limits.

---

# 34. Multi-Layer Protection

A mature architecture might look like:

```text
                    Client
                      │
                      ▼
                 Edge Layer
                      │
              IP Rate Limit
                      │
                      ▼
                API Gateway
                      │
             API Key Rate Limit
                      │
                      ▼
               Application
                      │
            User/Tenant Limit
                      │
                      ▼
             Expensive Operation
                      │
            Concurrency Limit
```

Different layers protect different resources.

This is much more robust than one giant global counter.

---

# 35. The Interview Answer in 60 Seconds

If the interviewer asks:

> **"How would you design a distributed rate limiter?"**

A strong answer could be:

> "First I'd clarify what we're limiting: IP, user, API key, tenant, endpoint, or a combination. For a distributed API, I wouldn't keep counters only in application memory because requests can hit different instances. I'd use a shared low-latency store such as Redis.
>
> For the algorithm, I'd consider token bucket if we want to support controlled bursts, or a sliding-window approach if we need more precise request-rate semantics. The critical implementation detail is atomicity: checking and updating the rate-limit state must happen as one atomic operation to avoid race conditions between API servers.
>
> I'd put coarse-grained rate limiting at the gateway so rejected traffic doesn't consume application resources, and keep business-specific limits inside the application if necessary.
>
> I'd also define the failure behavior explicitly. Depending on the endpoint, Redis failure might fail open for availability or fail closed for expensive or security-sensitive operations. Finally, I'd return 429 with retry information and expect clients to use exponential backoff with jitter."

That answer demonstrates understanding of:

```text
Algorithms
Distributed State
Concurrency
Caching
Failure Modes
API Design
Load Shedding
Scalability
```

---

# 36. What the Interviewer Is Actually Testing

Again, the interviewer isn't really asking:

> "Do you know Redis?"

They are testing whether you understand:

### Shared state

```text
Where is the counter?
```

### Atomicity

```text
What happens when two requests arrive simultaneously?
```

### Algorithm selection

```text
Fixed window?
Sliding window?
Token bucket?
```

### Failure

```text
What if Redis dies?
```

### Scalability

```text
Can the limiter handle millions of keys?
```

### Placement

```text
Gateway?
Application?
Both?
```

### Backpressure

```text
What happens when traffic exceeds capacity?
```

These are the real engineering questions.

---

# 37. The Deeper Lesson

The easiest mistake is to think:

> "Rate limiting means counting requests."

It doesn't.

The real problem is:

> **How do we make a distributed admission decision under high concurrency?**

Every request asks:

```text
Should this operation be allowed?
```

The answer depends on shared state:

```text
Current usage
+
Time
+
Policy
+
Capacity
```

So the system must perform:

$$
Decision = f(State, Time, Policy)
$$

while many machines are modifying that state simultaneously.

That is why rate limiting becomes a distributed-systems problem.

---

# 38. Final Mental Model

When designing a rate limiter, think through this chain:

```text
                 Request
                    │
                    ▼
             Identify Client
                    │
                    ▼
             Load Policy
                    │
                    ▼
            Read Shared State
                    │
                    ▼
             Atomic Decision
                /       \
               /         \
           ALLOW        REJECT
             │             │
             ▼             ▼
        Application       429
             │             │
             ▼             ▼
          Response     Retry-After
```

Then ask:

```text
What is the state?

Where does it live?

Who can modify it?

Is the modification atomic?

What algorithm defines the limit?

What happens when the datastore fails?

How does the system scale?

What happens during bursts?

What happens when clients retry?
```

Those questions matter much more than whether the implementation uses a particular Redis command.

---

# 39. Final Takeaway

A rate limiter looks like a tiny feature:

```text
if requests > limit:
    reject
```

But at scale, it becomes a distributed coordination mechanism.

The engineering challenge is balancing:

$$
Accuracy
\leftrightarrow
Latency
\leftrightarrow
Availability
\leftrightarrow
Scalability
$$

There is no perfect implementation for every workload.

A good design starts by understanding what you're protecting.

Then choose:

```text
Algorithm
    ↓
State Store
    ↓
Atomicity Model
    ↓
Failure Policy
    ↓
Placement
    ↓
Scaling Strategy
```

And perhaps the most important lesson is this:

> **A system isn't scalable merely because every component can scale horizontally. It is scalable when the coordination required between those components remains manageable.**

A rate limiter is a small feature that exposes this principle extremely clearly.