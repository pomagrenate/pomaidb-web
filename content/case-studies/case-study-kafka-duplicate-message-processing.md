---
title: "CASE STUDY: Kafka Guarantees Delivery — So Why Did My Consumer Process the Same Message Twice?"
slug: "case-study-kafka-duplicate-message-processing"
date: "2026-08-23"
author: "Quan Van"
excerpt: "A Senior-level distributed systems interview case study about Kafka delivery semantics, consumer crashes, offsets, idempotency, retries, and why 'exactly once' is much harder than it sounds."
tags: ["Kafka", "Distributed Systems", "Messaging", "Event-Driven Architecture", "Reliability", "Idempotency", "Backend", "Senior Interview"]
category: "Senior Engineering"
---

# CASE STUDY: Kafka Guarantees Delivery — So Why Did My Consumer Process the Same Message Twice?

> **Senior Interview Question**
>
> **"Kafka guarantees message delivery. Why can a consumer still process the same message twice?"**

This question looks simple.

It isn't.

A common answer is:

> "Because Kafka is at-least-once."

That's technically useful, but it isn't enough for a Senior interview.

The interviewer will immediately ask:

> **"Why?"**

And then:

> **"Where exactly does the duplicate happen?"**

And then:

> **"How would you make the operation safe?"**

And finally:

> **"Can you guarantee exactly-once processing?"**

At that point, the discussion stops being about Kafka configuration.

It becomes a discussion about:

```text
Distributed systems
+
Failure semantics
+
Atomicity
+
Offsets
+
Retries
+
Idempotency
+
External side effects
````

---

# 1. Start With a Simple Consumer

Suppose we have:

```text
Order Service
      │
      ▼
    Kafka
      │
      ▼
Payment Consumer
      │
      ▼
Payment Service
```

Kafka contains:

```text
OrderCreated
```

The consumer receives:

```json
{
  "orderId": "ORD-123",
  "amount": 100
}
```

It then executes:

```text
1. Charge customer
2. Commit Kafka offset
```

Looks straightforward.

Pseudo-code:

```text
message = poll()

chargeCustomer(message)

commitOffset(message)
```

But now imagine the consumer crashes.

---

# 2. The First Failure Scenario

Suppose:

```text
t0:
Consumer receives message offset 42

t1:
Consumer charges customer

t2:
Customer is successfully charged

t3:
Consumer crashes

t4:
Kafka offset 42 was NOT committed
```

The consumer restarts.

Kafka says:

```text
"Offset 42 hasn't been committed yet."
```

So Kafka delivers:

```text
Offset 42
```

again.

Now:

```text
chargeCustomer(message)
```

runs again.

The customer gets charged twice.

Kafka did not necessarily lose the message.

Kafka did exactly what the consumer's offset state told it to do.

---

# 3. The Critical Distinction

There are two separate operations:

```text
Process message
```

and:

```text
Commit offset
```

They are not automatically one atomic operation.

Conceptually:

```text
Kafka
  │
  │ message
  ▼
Consumer
  │
  │ side effect
  ▼
External System
  │
  │ success
  ▼
Consumer
  │
  │ commit offset
  ▼
Kafka
```

There are multiple failure points.

That is the heart of the problem.

---

# 4. Draw the Timeline

Let's make it explicit.

```text
Kafka                  Consumer                 Payment DB

  │                        │                        │
  │──── message 42 ───────►│                        │
  │                        │                        │
  │                        │──── charge ──────────►│
  │                        │                        │
  │                        │◄──── success ─────────│
  │                        │                        │
  │                        │       💥 CRASH         │
  │                        │                        │
  │                        │                        │
  │                        │                        │
  │──── message 42 ───────►│                        │
  │                        │                        │
  │                        │──── charge ──────────►│
```

The duplicate isn't mysterious anymore.

The consumer performed the side effect before the offset became durable.

---

# 5. What If We Reverse the Order?

Someone might propose:

```text
commitOffset()

chargeCustomer()
```

Now the timeline is:

```text
Kafka                  Consumer                 Payment DB

  │                        │                        │
  │──── message 42 ───────►│                        │
  │                        │                        │
  │◄──── commit 42 ────────│                        │
  │                        │                        │
  │                        │       💥 CRASH         │
  │                        │                        │
  │                        │                        │
  │                        │──── charge ──────────►│
```

But after restart:

```text
Kafka:
"Offset 42 already processed."
```

So Kafka won't deliver it again.

The message is effectively skipped.

Now we have:

```text
No duplicate
```

but potentially:

```text
Lost business operation
```

So we have two choices:

```text
Process → Commit
```

which risks duplicates,

or:

```text
Commit → Process
```

which risks loss.

This is the fundamental tension.

---

# 6. This Is Why "Exactly Once" Is Difficult

We want:

```text
Process message
+
Apply side effect
+
Commit offset
```

to behave like:

```text
ONE ATOMIC OPERATION
```

But these operations may belong to different systems:

```text
Kafka
+
PostgreSQL
+
Payment Provider
```

We cannot casually assume that:

```text
Kafka transaction
```

and:

```text
external database transaction
```

are one atomic transaction.

This is a distributed transaction problem.

---

# 7. The Interviewer Is Testing Your Mental Model

When someone says:

> "Kafka guarantees exactly-once."

A Senior engineer should immediately ask:

> **"Exactly once for what?"**

Because there are several different meanings.

For example:

```text
Message stored exactly once
```

is different from:

```text
Message delivered exactly once
```

which is different from:

```text
Message processed exactly once
```

which is different from:

```text
Business side effect happens exactly once
```

These are not equivalent.

---

# 8. Delivery Semantics

Messaging systems usually discuss concepts such as:

```text
At-most-once
At-least-once
Exactly-once
```

## At-most-once

The system may lose messages, but doesn't intentionally redeliver them.

Conceptually:

```text
message
  ↓
deliver
  ↓
commit
  ↓
process
```

Failure before processing can mean:

```text
message lost
```

---

## At-least-once

The system prefers not to lose messages.

If processing fails or acknowledgement isn't observed:

```text
message
  ↓
retry
```

Therefore duplicates are possible.

This is the model many applications need to design around.

---

## Exactly-once

The goal is:

```text
one logical input
        ↓
one logical effect
```

But the phrase "exactly once" requires extremely careful definition.

---

# 9. Why At-Least-Once Is Often Practical

Suppose we have:

```text
OrderCreated
```

and the consumer performs:

```text
Create invoice
```

If the consumer crashes after creating the invoice but before committing the offset:

```text
OrderCreated
```

may be delivered again.

If invoice creation is idempotent:

```text
invoice(order_id UNIQUE)
```

then the second attempt can safely become:

```text
already exists
```

Now duplicate delivery doesn't create duplicate business state.

This is a powerful strategy:

> **Accept duplicate delivery, but make processing idempotent.**

---

# 10. Idempotency

An operation is idempotent if repeating it produces the same effective result.

Mathematically:

$$
f(f(x)) = f(x)
$$

For example:

```text
SET user.status = "active"
```

is naturally idempotent.

Running it once:

```text
active
```

Running it ten times:

```text
active
```

The final state is the same.

But:

```text
balance = balance + 100
```

is not idempotent.

One execution:

```text
100 → 200
```

Two executions:

```text
100 → 300
```

So the operation requires protection.

---

# 11. Use an Idempotency Key

Suppose Kafka gives us:

```text
eventId = EVT-123
```

We can store:

```text
processed_events
----------------
event_id
processed_at
result
```

Before processing:

```text
if eventId already exists:
    return
```

Otherwise:

```text
process
record eventId
```

But there is another trap.

---

# 12. The Check-Then-Insert Race

Suppose two consumers accidentally process the same event concurrently.

Both execute:

```text
SELECT * FROM processed_events
WHERE event_id = 'EVT-123';
```

Both receive:

```text
NOT FOUND
```

Then:

```text
Consumer A → process
Consumer B → process
```

We still have duplicate side effects.

So this:

```text
if not exists:
    process
```

is not necessarily safe.

The check and the effect need stronger coordination.

---

# 13. Database Unique Constraint

A better approach is:

```sql
CREATE UNIQUE INDEX
ON processed_events(event_id);
```

Then:

```text
Consumer A
    ↓
INSERT EVT-123
    ↓
SUCCESS
```

while:

```text
Consumer B
    ↓
INSERT EVT-123
    ↓
UNIQUE VIOLATION
```

Now the database itself provides concurrency control.

This is generally much safer than relying on:

```text
SELECT
```

followed by:

```text
INSERT
```

without a constraint.

---

# 14. But There Is Another Problem

Suppose we do:

```text
INSERT processed_events
        ↓
charge customer
```

What if:

```text
INSERT succeeds
        ↓
💥 crash
        ↓
charge never happens
```

Now the event is marked as processed even though the business effect didn't happen.

So simply storing the idempotency key isn't enough.

We need to think about **atomicity**.

---

# 15. The Outbox Pattern

Suppose our application receives:

```text
OrderCreated
```

and needs to update PostgreSQL plus publish another event.

A common solution is the **Transactional Outbox**.

Instead of:

```text
DB transaction
     +
Kafka publish
```

we do:

```text
BEGIN TRANSACTION

UPDATE business data

INSERT event into outbox

COMMIT
```

Then a separate publisher reads:

```text
outbox
```

and publishes to Kafka.

Architecture:

```text
                Application
                     │
                     ▼
              PostgreSQL
             /           \
            /             \
     Business Data       Outbox
                           │
                           ▼
                      Publisher
                           │
                           ▼
                         Kafka
```

Now the business update and the event record can be committed atomically inside the same database transaction.

---

# 16. Why the Outbox Helps

Without outbox:

```text
DB update
   ↓
Kafka publish
```

Failure between them creates inconsistency.

For example:

```text
DB update succeeds
Kafka publish fails
```

Now:

```text
Database = new state
Kafka = no event
```

With an outbox:

```text
BEGIN

update DB
insert outbox event

COMMIT
```

Either both database changes happen:

```text
Business state
+
Outbox event
```

or neither happens.

The publisher can retry Kafka delivery later.

---

# 17. But the Outbox Doesn't Magically Give Exactly Once

Suppose the publisher does:

```text
read outbox event
publish to Kafka
mark outbox event as published
```

Now:

```text
publish succeeds
        ↓
💥 crash
        ↓
mark as published never happens
```

The publisher restarts and sees:

```text
not marked as published
```

so it publishes again.

Duplicate event.

Again:

```text
At-least-once delivery
```

has appeared.

That's okay if consumers are idempotent.

---

# 18. This Is the Recurring Pattern

Notice what keeps happening:

```text
Action
 ↓
Success
 ↓
Crash before acknowledgement
 ↓
Retry
 ↓
Duplicate
```

This is not uniquely a Kafka problem.

It appears in:

```text
HTTP
Queues
Databases
Payment systems
Distributed jobs
Webhooks
Cloud APIs
Microservices
```

Once you understand this pattern, many distributed systems problems become easier.

---

# 19. The Two Generals Problem

At a deeper level, we are dealing with uncertainty.

Suppose:

```text
Service A
   ↓
Service B
```

Service A sends:

```text
"Do X"
```

Service B performs X.

But A doesn't know whether B succeeded if communication fails.

A may receive:

```text
timeout
```

But:

```text
timeout ≠ failure
```

The operation might have succeeded and only the response was lost.

This is one of the fundamental difficulties of distributed systems:

> **You often cannot distinguish "the operation failed" from "the operation succeeded but I didn't receive the response."**

---

# 20. Timeout Does Not Mean Failure

This is an extremely important Senior interview concept.

Suppose:

```text
Client
   ↓
Payment Service
```

Client sends:

```text
charge $100
```

Payment service:

```text
processes payment
```

But response is delayed.

Client sees:

```text
TIMEOUT
```

What is the actual state?

Possibilities:

```text
A. Payment failed
B. Payment succeeded
C. Payment is still processing
D. Payment succeeded but response was lost
```

The client doesn't know.

Therefore:

```text
timeout
```

should not automatically be interpreted as:

```text
operation failed
```

---

# 21. Idempotency Solves the Ambiguity

Suppose client sends:

```text
Idempotency-Key: PAY-123
```

The payment service records:

```text
PAY-123 → SUCCESS
```

If the client times out and retries:

```text
PAY-123
```

the payment service can respond:

```text
Already processed.
Here is the original result.
```

Now the retry is safe.

This is one of the most important patterns in reliable APIs.

---

# 22. Kafka Consumer + Database

Let's return to our consumer.

Suppose:

```text
Kafka
   ↓
Consumer
   ↓
PostgreSQL
```

We want:

```text
process message
+
record processed event
```

to happen atomically.

If both happen inside PostgreSQL:

```text
BEGIN

INSERT processed_event(event_id)

UPDATE business_state

COMMIT
```

then duplicate processing can be detected within the same transaction.

After success:

```text
commit Kafka offset
```

If the process crashes before committing the Kafka offset:

```text
Kafka redelivers
```

but PostgreSQL says:

```text
event already processed
```

So the second attempt becomes harmless.

---

# 23. The Important Ordering

A robust pattern can look conceptually like:

```text
poll Kafka
   ↓
BEGIN DB transaction
   ↓
check/insert event ID
   ↓
apply business change
   ↓
COMMIT DB transaction
   ↓
commit Kafka offset
```

The interesting part is:

```text
DB transaction
```

contains the business effect.

If the consumer crashes:

### Crash before DB commit

```text
No business effect
No offset commit
```

Kafka retries.

Safe.

### DB commit succeeds, then crash before offset commit

```text
Business effect exists
Offset not committed
```

Kafka retries.

Idempotency detects the duplicate.

Safe.

### Offset commit succeeds after DB commit

Everything is complete.

Safe.

---

# 24. But What If the Database and Kafka Transaction Are Integrated?

Kafka supports transactional mechanisms for Kafka-side operations.

This can provide stronger guarantees when the processing flow is entirely within Kafka's transactional model.

For example:

```text
Consume Kafka
     ↓
Process
     ↓
Produce Kafka
     ↓
Commit transaction
```

The system can coordinate:

```text
consumed offsets
+
produced records
```

within Kafka's transaction mechanism.

But here's the important Senior-level qualification:

> **This does not automatically make an arbitrary external side effect exactly-once.**

If the consumer calls:

```text
Stripe
PostgreSQL
Email provider
External HTTP API
```

Kafka cannot magically roll back those external operations.

---

# 25. Exactly Once Inside Kafka vs Exactly Once in the World

This distinction is critical.

Suppose:

```text
Kafka topic A
      ↓
Consumer
      ↓
Kafka topic B
```

Kafka transactions can help provide exactly-once semantics for the Kafka processing pipeline.

But:

```text
Kafka
 ↓
HTTP API
```

is different.

Kafka cannot undo:

```text
POST /charge
```

because the external service doesn't participate in the same transaction.

Therefore:

```text
Kafka EOS
```

does not automatically mean:

```text
World-wide exactly-once side effects
```

---

# 26. Distributed Transactions

One theoretical solution is a distributed transaction protocol such as:

```text
Two-Phase Commit
```

Conceptually:

```text
Coordinator
    │
    ├── Database
    │
    └── Kafka
```

Phase 1:

```text
PREPARE
```

Phase 2:

```text
COMMIT
```

This can coordinate multiple transactional participants.

But distributed transactions have significant costs and complexity:

```text
Coordination
Latency
Failure recovery
Blocking
Operational complexity
Availability trade-offs
```

Modern systems often prefer:

```text
Local transactions
+
Outbox
+
Idempotency
+
Retries
+
Compensation
```

rather than putting everything behind a distributed transaction.

---

# 27. Compensation Is Another Tool

Suppose:

```text
Order
 ↓
Reserve inventory
 ↓
Charge payment
```

But payment fails.

We may need:

```text
Release inventory
```

This is a compensating action.

Instead of trying to atomically commit everything across services:

```text
Inventory
Payment
Shipping
```

we allow local transactions and define how to recover from partial success.

This leads into patterns such as:

```text
Saga
```

where a business workflow consists of:

```text
local transaction
→ event
→ local transaction
→ event
```

with compensating operations when necessary.

---

# 28. Why This Matters in Real Systems

Imagine:

```text
Order Service
Inventory Service
Payment Service
Shipping Service
Notification Service
```

Trying to put all of them into one distributed transaction would be extremely expensive.

Instead:

```text
OrderCreated
    ↓
ReserveInventory
    ↓
InventoryReserved
    ↓
ChargePayment
    ↓
PaymentSucceeded
    ↓
CreateShipment
```

Each service owns its own local transaction.

Failures are handled through:

```text
retry
timeout
idempotency
compensation
dead-letter queues
manual recovery
```

This is much closer to how resilient distributed systems are commonly designed.

---

# 29. The Dead-Letter Queue

What happens when a message repeatedly fails?

Suppose:

```text
retry 1 → fail
retry 2 → fail
retry 3 → fail
retry 4 → fail
```

We shouldn't necessarily retry forever.

We can move the event to:

```text
Dead Letter Queue
```

Architecture:

```text
Kafka
  ↓
Consumer
  ↓
Processing
  │
  ├── Success → ACK
  │
  └── Failure
          ↓
       Retry
          ↓
       Retry
          ↓
        DLQ
```

The DLQ allows operators to inspect:

```text
Poison messages
Malformed data
Permanent business errors
Unexpected schema
Dependency failures
```

---

# 30. But DLQ Is Not a Garbage Bin

A bad architecture says:

```text
error
 ↓
DLQ
```

and forgets about it.

A production system needs:

```text
DLQ monitoring
Retry policy
Alerting
Inspection
Replay mechanism
Root-cause analysis
```

Otherwise the system becomes:

```text
"reliable"
```

by silently losing business operations into a queue nobody watches.

---

# 31. Poison Messages

Suppose one event always crashes the consumer:

```text
Event 123
```

If we continuously retry:

```text
123
123
123
123
123
...
```

we can block useful messages depending on the architecture.

This is a **poison message**.

We need controlled retry behavior.

For example:

```text
attempt 1 → 1s
attempt 2 → 5s
attempt 3 → 30s
attempt 4 → 5m
attempt 5 → DLQ
```

The exact policy depends on business requirements.

---

# 32. Partition Ordering Creates Another Trap

Kafka preserves ordering within a partition.

Suppose:

```text
Partition 0:

Offset 10 → OrderCreated
Offset 11 → OrderPaid
Offset 12 → OrderShipped
```

If processing offset 10 fails repeatedly, later messages may be affected depending on consumer behavior and application design.

Therefore:

> **Ordering guarantees often create throughput and failure-isolation trade-offs.**

You can't simply demand:

```text
global ordering
+
maximum parallelism
+
independent failure
```

without paying a cost somewhere.

---

# 33. Ordering vs Parallelism

Suppose we have:

```text
1 partition
```

Then one consumer processes:

```text
A → B → C → D
```

Ordering is easy.

But throughput is constrained.

With:

```text
100 partitions
```

we can process many messages concurrently.

But ordering is now generally scoped to partitions rather than globally.

So partitioning is not merely:

```text
performance configuration
```

It is also:

```text
semantic design
```

---

# 34. Choosing a Partition Key Is a Business Decision

Suppose events are:

```text
OrderCreated
OrderPaid
OrderShipped
```

If we partition by:

```text
orderId
```

then events for the same order can stay ordered.

```text
hash(orderId) → partition
```

But if we partition randomly:

```text
OrderCreated → partition 1
OrderPaid    → partition 7
OrderShipped → partition 3
```

the consumer may observe them in an unexpected order across partitions.

Therefore:

> **The partition key should often reflect the entity whose ordering matters.**

---

# 35. But Hot Partitions Exist

Suppose one customer generates:

```text
10 million events/sec
```

and we partition by:

```text
customerId
```

Then that customer's events all map to one partition.

We get:

```text
Partition 7
   ↓
🔥 HOT
```

while other partitions are mostly idle.

Now our ordering decision created a throughput bottleneck.

This is another Senior trade-off:

```text
Ordering
vs
Load distribution
```

---

# 36. What If We Need Both?

Sometimes we need to redesign the business model.

Instead of requiring:

```text
global order
```

we may only need:

```text
order per entity
```

or:

```text
ordering per account
```

or:

```text
ordering per aggregate
```

Reducing the scope of ordering can dramatically increase scalability.

A Senior engineer should always challenge:

> "Do we really need global ordering?"

---

# 37. The Interviewer's Favorite Trap

Interviewer:

> "Kafka guarantees ordering, right?"

Bad answer:

> "Yes."

Better:

> "Kafka guarantees ordering within a partition, not globally across all partitions."

Then the interviewer might ask:

> "So if I increase the number of partitions, can I preserve global ordering?"

Answer:

> "Not without adding another coordination mechanism that effectively serializes the processing again. More partitions increase parallelism but weaken global ordering semantics."

That is the deeper trade-off.

---

# 38. Another Trap: Consumer Crash

Interviewer:

> "Consumer processed the message but crashed before committing the offset. What happens?"

Answer:

```text
Message may be delivered again.
```

Then:

> "How do you prevent duplicate business effects?"

Answer:

```text
Idempotent processing
+
Unique event IDs
+
Database constraints
+
Transactional state changes
```

Then:

> "Can Kafka itself guarantee exactly once?"

Answer:

> "Kafka can provide transactional exactly-once semantics for Kafka-native consume/process/produce workflows, but arbitrary external side effects still require application-level coordination such as idempotency or transactional integration."

That's a strong answer.

---

# 39. Another Trap: "Just Commit Earlier"

Interviewer:

> "Why not commit the offset before processing?"

Answer:

> "Because if the consumer crashes after committing but before the business operation completes, the message may never be processed. That gives us at-most-once behavior for that operation."

Then:

> "So what do you prefer?"

Answer:

> "Usually at-least-once delivery combined with idempotent processing, unless the business semantics specifically allow loss."

---

# 40. Another Trap: "Just Use Exactly Once"

Interviewer:

> "Why not configure Kafka for exactly-once?"

Don't answer:

> "Problem solved."

Instead:

> "I need to define exactly what operation must be exactly-once. Kafka transactions can coordinate Kafka-side operations, but if the consumer performs an external side effect, such as charging a payment provider or writing to an unrelated database, Kafka cannot automatically roll that effect back. We still need idempotency or another transactional integration strategy."

That answer demonstrates understanding instead of memorization.

---

# 41. The Real Design

For a typical Kafka → PostgreSQL consumer, I'd consider:

```text
                    Kafka
                      │
                      ▼
                 Consumer
                      │
                      ▼
             BEGIN PostgreSQL TX
                      │
                      ├── Check event ID
                      │
                      ├── Apply business state
                      │
                      └── Record processed event
                      │
                      ▼
                   COMMIT
                      │
                      ▼
                Commit Offset
```

The database transaction provides atomicity between:

```text
business state
+
idempotency record
```

Kafka offset remains outside that transaction, but duplicate delivery becomes harmless.

---

# 42. What If Processing Calls an External API?

Now:

```text
Kafka
 ↓
Consumer
 ↓
PostgreSQL
 ↓
External Payment API
```

The problem becomes harder.

Suppose:

```text
DB transaction
   ↓
Payment API
   ↓
success
   ↓
DB commit
```

The payment API isn't part of the database transaction.

If DB commit fails:

```text
Payment succeeded
DB says nothing happened
```

We have inconsistency.

So we need another design.

---

# 43. Separate the Workflow

One possible approach:

```text
Kafka Event
    ↓
Create Payment Intent in DB
    ↓
Commit
    ↓
Payment Worker
    ↓
External Payment API
    ↓
Record Result
```

The payment operation gets its own durable state machine.

For example:

```text
PENDING
   ↓
PROCESSING
   ↓
SUCCEEDED
```

or:

```text
PENDING
   ↓
PROCESSING
   ↓
FAILED
   ↓
RETRY
```

Now recovery is explicit.

---

# 44. Durable State Machines

This is a powerful pattern.

Instead of trying to make:

```text
one giant atomic operation
```

we model:

```text
business state
```

explicitly.

For example:

```text
Payment

PENDING
PROCESSING
SUCCEEDED
FAILED
CANCELLED
```

Every transition becomes:

```text
durable
observable
retryable
```

This makes distributed failures much easier to reason about.

---

# 45. The Most Important Principle

In distributed systems:

> **You don't eliminate failures. You design what happens when they occur.**

Assume:

```text
consumer crashes
network times out
database becomes unavailable
Kafka redelivers
response is lost
service restarts
message is duplicated
dependency becomes slow
```

Then ask:

> **What state does the system end up in?**

And:

> **Can we safely recover from that state?**

That's the mindset interviewers are looking for at Senior level.

---

# 46. The 60-Second Senior Interview Answer

If asked:

> **"Kafka guarantees delivery. Why can a consumer process the same message twice?"**

A strong answer:

> "Because message delivery and business processing are separate operations. A consumer can process a message successfully and apply a side effect, then crash before committing its Kafka offset. When it restarts, Kafka sees the offset as uncommitted and redelivers the message. If the business operation isn't idempotent, the side effect can happen twice.
>
> I generally prefer designing consumers for at-least-once delivery with idempotent processing. I'd give each event a stable ID, enforce uniqueness at the database level, and perform the idempotency record and business state change in the same local transaction where possible. Then a redelivery becomes harmless.
>
> Kafka transactions can provide stronger exactly-once semantics for Kafka-native consume-and-produce workflows, but they don't automatically make arbitrary external side effects exactly-once. If the consumer calls another database or an external payment API, I still need application-level idempotency, an outbox or state-machine pattern, and potentially compensation."

---

# 47. Senior Follow-Up Questions

The interviewer can continue from here.

### Q1

> "Why isn't `SELECT processed_event` followed by `INSERT processed_event` safe?"

Because concurrent consumers can both observe:

```text
NOT FOUND
```

before either inserts.

Use:

```text
UNIQUE constraint
```

and transactional handling.

---

### Q2

> "What happens if the consumer crashes after the DB commit but before Kafka offset commit?"

Kafka redelivers.

The idempotency check detects the already-applied event.

---

### Q3

> "What happens if Kafka offset commits first?"

The message can be skipped if the process crashes before the business operation completes.

---

### Q4

> "Can Kafka transactions make Stripe charge exactly once?"

Not by themselves.

Stripe is an external system and isn't automatically part of the Kafka transaction.

You need:

```text
idempotency key
+
durable operation state
+
safe retry semantics
```

---

### Q5

> "Why not use distributed transactions everywhere?"

Because of:

```text
latency
coordination complexity
failure modes
operational cost
availability trade-offs
```

Local transactions plus asynchronous coordination are often more practical.

---

### Q6

> "Why is a timeout not equivalent to failure?"

Because the operation may have succeeded while its response was lost or delayed.

---

### Q7

> "Why is idempotency so important in distributed systems?"

Because retries are unavoidable.

If:

```text
retry
```

can safely produce the same logical outcome, failures become recoverable.

---

# 48. The Mental Model to Remember

Whenever you see:

```text
A → B
```

ask:

```text
What if A sends the request
and B succeeds
but A never receives the response?
```

Then:

```text
What if A retries?
```

Then:

```text
Can B safely execute the operation twice?
```

If the answer is no:

```text
How will we make it idempotent?
```

And finally:

```text
Where is the durable source of truth?
```

That sequence of questions is useful far beyond Kafka.

It applies to:

```text
HTTP APIs
Webhooks
Payments
Queues
Microservices
Distributed jobs
Database replication
Cloud APIs
Event-driven architectures
```

---

# 49. Final Takeaway

The dangerous assumption is:

> **"The message was delivered, therefore the business operation happened exactly once."**

Those are completely different statements.

A more accurate mental model is:

```text
             Message
                │
                ▼
             Delivery
                │
                ▼
            Processing
                │
                ▼
          Business Effect
                │
                ▼
          Acknowledgement
```

Every boundary introduces a failure window.

The Senior engineer's job is not to pretend those windows don't exist.

It is to make those windows:

```text
observable
+
recoverable
+
idempotent
+
durable
```

So when the interviewer asks:

> **"Can Kafka guarantee exactly-once processing?"**

don't answer simply:

> "Yes."

or:

> "No."

The Senior answer is:

> **"Exactly once at which boundary?"**

Because in distributed systems, **the boundary is the problem.**