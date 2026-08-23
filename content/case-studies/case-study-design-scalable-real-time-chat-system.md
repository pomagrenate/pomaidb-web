---
title: "CASE STUDY: How Would You Design a Scalable Real-Time Chat System?"
slug: "case-study-design-scalable-real-time-chat-system"
date: "2026-08-22"
author: "Quan Van"
excerpt: "A practical system design case study answering one of the most common backend interview questions: how would you design a scalable real-time chat system?"
tags: ["System Design", "Backend", "WebSocket", "Kafka", "Redis", "Microservices", "Interview"]
category: "System Design"
---

# CASE STUDY: How Would You Design a Scalable Real-Time Chat System?

> **Interview Question:**  
> **"How would you design a scalable real-time chat system like Slack, Discord, or WhatsApp?"**

This is one of those interview questions that sounds simple until you actually try to design it.

At first, the architecture seems obvious:

```text
Client
  ↓
WebSocket Server
  ↓
Database
````

But this design starts falling apart surprisingly quickly.

What happens when:

* 100,000 users connect simultaneously?
* One user opens multiple devices?
* A message needs to reach thousands of users?
* A WebSocket server crashes?
* Messages arrive out of order?
* A user reconnects after losing their network?
* Two users send messages simultaneously?
* The database becomes the bottleneck?
* A user is offline?
* We need message history?
* We need delivery and read receipts?

The interesting part of this interview question is therefore not:

> "Can you implement WebSocket?"

The real question is:

> **Can you design a distributed system where real-time communication, persistence, ordering, delivery, and failure recovery coexist?**

---

# 1. First, Clarify the Requirements

Before drawing architecture diagrams, I would clarify what the system actually needs to support.

For this case study, assume the system supports:

### Functional requirements

* One-to-one conversations
* Group conversations
* Real-time messaging
* Message history
* Online/offline presence
* Delivery status
* Read status
* Multiple devices per user
* Reconnection
* Push notifications for offline users

We will not initially include:

* Voice calls
* Video calls
* End-to-end encryption
* File storage
* Search indexing
* AI features

Those can be added later.

---

# 2. Non-Functional Requirements

The important requirements are:

```text
Low latency
High availability
Horizontal scalability
Message durability
Ordering
Fault tolerance
```

Suppose we have:

```text
10 million registered users
1 million daily active users
200,000 concurrent connections
100,000 messages/sec peak
```

These numbers are hypothetical, but they force us to design for distributed execution rather than a single-server application.

---

# 3. The First Naive Architecture

The simplest architecture looks like this:

```text
                 ┌──────────────┐
                 │    Client    │
                 └──────┬───────┘
                        │
                     WebSocket
                        │
                        ▼
                 ┌──────────────┐
                 │ Chat Server  │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  PostgreSQL  │
                 └──────────────┘
```

A message could work like this:

```text
Client
  ↓
WebSocket
  ↓
Chat Server
  ↓
INSERT message
  ↓
PostgreSQL
  ↓
Broadcast message
```

For an MVP, this is perfectly reasonable.

But it has a fundamental limitation.

The WebSocket connection lives inside one server process.

---

# 4. The WebSocket Scaling Problem

Suppose we have:

```text
Client A
   ↓
Chat Server 1
```

and:

```text
Client B
   ↓
Chat Server 2
```

Now A sends a message to B.

The message arrives at:

```text
Chat Server 1
```

But B is connected to:

```text
Chat Server 2
```

Server 1 cannot simply call:

```text
websocket.send()
```

because B's socket does not exist inside Server 1.

We now have:

```text
             Load Balancer
              /         \
             /           \
            ↓             ↓
       Server 1        Server 2
          │                │
       User A            User B
```

The system needs a mechanism allowing the servers to communicate.

This is the first major architectural problem.

---

# 5. Introduce a Message Broker

A common solution is introducing a distributed messaging layer.

For example:

```text
                     ┌─────────────┐
                     │   Kafka     │
                     └──────┬──────┘
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
       Chat Server 1                 Chat Server 2
             │                             │
          User A                        User B
```

Now the flow becomes:

```text
User A
  ↓
Chat Server 1
  ↓
Kafka
  ↓
Chat Server 2
  ↓
User B
```

This gives us a communication backbone between WebSocket servers.

---

# 6. But Kafka Is Not the Whole Answer

It is tempting to say:

> "Just put everything into Kafka."

That is not enough.

Kafka is excellent for:

* durable event streams
* partitioned processing
* ordered events within partitions
* replay
* decoupling producers and consumers

But it is not designed to be the actual connection registry for:

```text
User → WebSocket connection
```

We need another mechanism.

For example:

```text
Redis
```

can maintain ephemeral connection and presence information.

Conceptually:

```text
Redis

user:42
   ↓
server-7

user:81
   ↓
server-2

user:105
   ↓
server-7
```

This tells the system where a user's active connection currently lives.

---

# 7. Revised Architecture

We now have:

```text
                         ┌───────────────┐
                         │ Load Balancer │
                         └───────┬───────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
            Chat Server 1   Chat Server 2   Chat Server 3
                 │               │               │
                 └───────────────┼───────────────┘
                                 │
                         ┌───────▼───────┐
                         │     Kafka     │
                         └───────┬───────┘
                                 │
                         ┌───────▼───────┐
                         │     Redis     │
                         └───────────────┘

                                 │
                                 ▼
                         ┌───────────────┐
                         │  PostgreSQL   │
                         └───────────────┘
```

Now each component has a different responsibility.

---

# 8. Responsibility of Each Component

## Load Balancer

Responsible for:

```text
Connection distribution
TLS termination
Health checking
```

It distributes incoming WebSocket connections across chat servers.

---

## WebSocket Servers

Responsible for:

```text
Connection management
Authentication
Receiving messages
Sending messages
Connection lifecycle
```

They should ideally remain relatively stateless.

The actual connection itself is inherently local to the process, but important state about that connection should not be treated as durable application state.

---

## Redis

Responsible for fast ephemeral information:

```text
User presence
Connection mapping
Session metadata
Short-lived state
```

Example:

```text
user:42 → server-7
```

---

## Kafka

Responsible for asynchronous event distribution:

```text
MessageCreated
MessageDelivered
MessageRead
UserOnline
UserOffline
```

For example:

```text
MessageCreated
      ↓
Kafka
 ┌────┼────────┐
 ↓    ↓        ↓
Chat  Storage  Notification
```

This decouples the different consumers.

---

## PostgreSQL

Responsible for durable business data:

```text
Users
Conversations
Members
Messages
Read states
```

Kafka is not the primary query interface for message history.

If the user opens a conversation:

```text
GET /conversations/123/messages
```

we want efficient database retrieval.

---

# 9. Message Flow

Now let's answer the most important question.

What happens when User A sends:

```text
"Hello"
```

to User B?

---

## Step 1 — Client Sends Message

The client sends:

```json
{
  "conversationId": "conv_123",
  "clientMessageId": "msg_client_789",
  "content": "Hello"
}
```

The `clientMessageId` is important.

We will come back to it later.

---

# 10. Step 2 — WebSocket Server Receives It

The WebSocket server authenticates the connection.

For example:

```text
JWT
 ↓
User ID
 ↓
Conversation authorization
```

We must verify that User A actually belongs to:

```text
conversationId = conv_123
```

Authentication alone is not enough.

The user may be authenticated but still unauthorized to send messages to a particular conversation.

---

# 11. Step 3 — Create a Message Event

The server constructs a canonical message:

```json
{
  "messageId": "msg_001",
  "conversationId": "conv_123",
  "senderId": "user_a",
  "content": "Hello",
  "createdAt": "...",
  "clientMessageId": "msg_client_789"
}
```

Notice that the server generates:

```text
messageId
```

rather than trusting the client to define the canonical identity.

---

# 12. Step 4 — Publish the Event

The message is published to Kafka.

Conceptually:

```text
Topic: conversation_messages

Partition:
conversation_id = conv_123
```

This is where partitioning becomes extremely important.

---

# 13. Why Partition by Conversation?

Suppose:

```text
Message A
Message B
Message C
```

belong to:

```text
conversation_123
```

We want:

```text
A → B → C
```

to maintain a consistent ordering model.

If messages are distributed randomly:

```text
Partition 1 → A
Partition 2 → B
Partition 3 → C
```

then consumers cannot naturally rely on ordering between partitions.

Instead:

```text
hash(conversationId)
        ↓
Kafka Partition
```

means all events for the same conversation can be routed to the same partition.

Conceptually:

```text
conversation_123
       ↓
hash()
       ↓
partition_7

A → partition_7
B → partition_7
C → partition_7
```

Kafka guarantees ordering within a partition.

This gives us an important invariant:

> **Messages belonging to the same partition can be processed in log order.**

It does not magically solve every ordering problem, but it gives us a strong foundation.

---

# 14. Step 5 — Persist the Message

A consumer processes:

```text
MessageCreated
```

and persists it into PostgreSQL.

For example:

```sql
INSERT INTO messages (
    id,
    conversation_id,
    sender_id,
    content,
    created_at
)
VALUES (...);
```

Now the message becomes durable application state.

---

# 15. Step 6 — Find the Recipient's Server

Suppose Redis contains:

```text
user_b → server_12
```

The event consumer knows:

```text
recipient = user_b
```

so it needs to deliver the message to:

```text
server_12
```

That server already owns User B's WebSocket connection.

The system can therefore route the event:

```text
Kafka
  ↓
Chat Server 12
  ↓
WebSocket
  ↓
User B
```

---

# 16. The Complete Message Pipeline

Putting everything together:

```text
User A
  │
  │ WebSocket
  ▼
Chat Server 1
  │
  │ Validate
  ▼
Kafka
  │
  ├───────────────┐
  │               │
  ▼               ▼
Storage         Delivery
Consumer        Consumer
  │               │
  ▼               ▼
PostgreSQL      Redis
                  │
                  ▼
             Chat Server 12
                  │
                  ▼
               User B
```

This is already a reasonably scalable architecture.

But now we reach the interesting part.

---

# 17. What If the Same Message Is Processed Twice?

Distributed systems fail.

Imagine:

```text
Kafka
  ↓
Consumer
  ↓
INSERT message
  ↓
Crash
```

The consumer successfully inserted the message into PostgreSQL.

But it crashed before acknowledging the Kafka message.

After restarting, Kafka may deliver the event again.

Now:

```text
Message
   ↓
INSERT
   ↓
Crash
   ↓
Retry
   ↓
INSERT AGAIN
```

We have a duplicate.

This is why distributed messaging systems often require **idempotent consumers**.

---

# 18. Idempotency

We can enforce uniqueness using:

```text
messageId
```

or:

```text
conversationId + clientMessageId
```

For example:

```sql
CREATE UNIQUE INDEX
ON messages(conversation_id, client_message_id);
```

Now if the same event arrives twice:

```text
First attempt
    ↓
INSERT succeeds

Second attempt
    ↓
UNIQUE constraint
    ↓
Already exists
```

The consumer can safely treat the second attempt as already processed.

This gives us:

> **At-least-once delivery + idempotent processing**

which is often a much more realistic distributed-system strategy than assuming exactly-once execution everywhere.

---

# 19. Exactly Once Is Not Magic

A common interview trap is saying:

> "I will guarantee exactly-once delivery."

This requires careful qualification.

There are multiple meanings of "exactly once":

```text
Exactly once produced
Exactly once consumed
Exactly once persisted
Exactly once delivered to a client
Exactly once observed by a user
```

These are different guarantees.

A practical architecture often aims for:

```text
At-least-once event delivery
+
Idempotent processing
+
Stable message identity
```

rather than pretending the entire distributed pipeline has magical exactly-once semantics.

---

# 20. What Happens When User B Is Offline?

Redis might contain:

```text
user_b → null
```

or simply no active connection.

The message should still be persisted.

The system can then publish:

```text
MessageCreated
```

to a notification service.

The notification service determines:

```text
User offline?
    ↓
Yes
    ↓
Push notification
```

For example:

```text
Kafka
  ↓
Notification Service
  ↓
Push Provider
  ↓
Mobile Device
```

The important architectural principle is:

> **Message persistence should not depend on the recipient being online.**

---

# 21. Reconnection

Now suppose User B loses their network.

Their WebSocket disappears.

When they reconnect:

```text
Client
  ↓
Authenticate
  ↓
Open WebSocket
  ↓
Request messages after cursor
```

For example:

```http
GET /conversations/123/messages?after=msg_900
```

The server can return:

```text
msg_901
msg_902
msg_903
```

The client can then recover any events missed while disconnected.

This is why durable message history matters.

WebSocket should be treated as a **delivery channel**, not the source of truth.

---

# 22. WebSocket Is Not Your Database

This distinction is critical.

A common architecture mistake is treating:

```text
WebSocket
```

as if it were the message state itself.

It is not.

WebSocket provides:

```text
real-time transport
```

while PostgreSQL provides:

```text
durable state
```

Conceptually:

```text
                Source of Truth
                     │
                     ▼
                PostgreSQL
                     │
            ┌────────┴────────┐
            ▼                 ▼
       WebSocket          REST/API
       delivery           retrieval
```

This means a client can reconstruct its state even if the real-time connection disappears.

---

# 23. Ordering Is More Complicated Than It Looks

Suppose User A sends:

```text
Message 1
Message 2
Message 3
```

The client expects:

```text
1 → 2 → 3
```

But distributed systems can produce:

```text
2 → 1 → 3
```

because messages may experience different network or processing delays.

We therefore need to define exactly what ordering guarantee we provide.

A reasonable requirement is:

> **Messages within the same conversation should have a consistent server-defined order.**

One approach is assigning a monotonically increasing sequence:

```text
conversation_id = 123

message 1 → sequence 100
message 2 → sequence 101
message 3 → sequence 102
```

The client can then use:

```text
sequence
```

rather than relying entirely on timestamps.

---

# 24. Why Timestamps Are Not Enough

Suppose:

```text
Message A
createdAt = 10:00:00.100

Message B
createdAt = 10:00:00.090
```

This does not necessarily tell us which one the user logically sent first.

Clock synchronization is imperfect.

Distributed machines can have:

```text
clock drift
network delay
different timestamp precision
```

Therefore:

```text
createdAt
```

is useful for displaying time.

But it should not automatically be treated as the canonical ordering mechanism.

A logical sequence is often more appropriate for ordering within a conversation.

---

# 25. Group Chat Changes the Problem

Now suppose:

```text
Conversation
    ↓
100,000 members
```

A single message could potentially require:

```text
100,000 deliveries
```

If we naively perform:

```text
for each member:
    send WebSocket
```

we create a massive fan-out operation.

This is known as a **fan-out problem**.

---

# 26. Fan-Out on Write vs. Fan-Out on Read

There are two broad strategies.

### Fan-out on write

When a message is created:

```text
Message
 ↓
Generate recipient events
 ↓
100,000 users
```

Advantages:

* fast reads
* simple retrieval for each user

Disadvantages:

* expensive writes
* huge event volume
* difficult for massive groups

---

### Fan-out on read

Store the message once:

```text
Conversation
    ↓
Message
```

When users read the conversation:

```text
User
 ↓
Fetch messages
```

Advantages:

* cheap message writes
* less duplication

Disadvantages:

* more work during reads
* potentially expensive for very large queries

---

# 27. Choosing the Strategy

For normal one-to-one or small group chats:

```text
Fan-out on write
```

may be practical.

For massive broadcast-style channels:

```text
Fan-out on read
```

or a hybrid architecture may be better.

This is another important interview lesson:

> **There is rarely one universally correct architecture.**

The correct decision depends on:

```text
Traffic pattern
Read/write ratio
Group size
Latency requirements
Storage cost
```

---

# 28. Presence Is a Different Problem

Consider:

```text
User A is online.
```

Does that mean:

```text
WebSocket connected?
```

Not necessarily.

We need to define what "online" means.

A practical system might use:

```text
Heartbeat
    ↓
Redis TTL
```

For example:

```text
user:42:presence
TTL = 30 seconds
```

The client periodically sends:

```text
heartbeat
```

and the server refreshes the TTL.

If the heartbeat stops:

```text
TTL expires
    ↓
User considered offline
```

This is much more robust than assuming:

```text
socket exists = user online forever
```

---

# 29. Presence Should Be Ephemeral

Presence is fundamentally different from messages.

A message is:

```text
durable
```

Presence is:

```text
ephemeral
```

Therefore storing presence in PostgreSQL as the primary mechanism would be inefficient.

A better conceptual separation is:

```text
PostgreSQL
    ↓
Durable state

Redis
    ↓
Ephemeral state
```

This is an example of choosing storage based on data characteristics rather than forcing everything into one database.

---

# 30. What Happens When a WebSocket Server Crashes?

Suppose:

```text
User A
  ↓
Server 7
```

and Server 7 crashes.

The user's connection disappears.

What happens to the messages?

Ideally:

```text
Message
 ↓
Kafka
 ↓
PostgreSQL
```

means the message is independent of Server 7's lifetime.

User A reconnects:

```text
Client
 ↓
Load Balancer
 ↓
Server 12
 ↓
Resume from cursor
```

The client can recover missing messages from durable storage.

This is a core distributed-systems principle:

> **Connection state can be ephemeral. Business state must survive process failure.**

---

# 31. What Should Be Stateful?

A useful interview question is:

> "What state should actually live inside the WebSocket server?"

Ideally, only connection-local state:

```text
Socket
Authentication context
Connection metadata
Subscriptions
```

Durable state should live elsewhere:

```text
Messages
Users
Conversation membership
Read state
```

This allows WebSocket servers to scale horizontally.

---

# 32. Horizontal Scaling

Now we can add servers:

```text
                  Load Balancer
              /       |       \
             ↓        ↓        ↓
         Server 1  Server 2  Server 3
             │        │        │
             └────────┼────────┘
                      ↓
                    Kafka
```

If traffic increases:

```text
3 servers
   ↓
10 servers
   ↓
50 servers
```

we can scale the WebSocket layer independently.

This is one of the major benefits of separating connection handling from durable state.

---

# 33. Database Scaling

Eventually PostgreSQL itself may become a bottleneck.

We can introduce:

```text
Primary
   │
   ├── Replica 1
   ├── Replica 2
   └── Replica 3
```

Writes go to:

```text
Primary
```

while suitable reads can go to:

```text
Replicas
```

However, we must be careful.

Read replicas introduce replication lag.

If a user writes:

```text
Message 100
```

and immediately reads from a replica, that replica may not contain the message yet.

Therefore not every read can blindly be sent to replicas.

---

# 34. Partitioning Messages

A massive `messages` table can become difficult to manage.

One possible strategy is partitioning by:

```text
conversation_id
```

or:

```text
created_at
```

depending on workload.

For example:

```text
messages_2026_01
messages_2026_02
messages_2026_03
...
```

Time-based partitioning can help with:

```text
retention
archival
maintenance
large historical datasets
```

But partitioning should be introduced based on actual workload rather than treated as a default requirement.

---

# 35. The Final Architecture

A production-oriented architecture might therefore look like:

```text
                         ┌───────────────────┐
                         │      Clients      │
                         └─────────┬─────────┘
                                   │
                            WebSocket / HTTPS
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   Load Balancer   │
                         └─────────┬─────────┘
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             ▼                     ▼                     ▼
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │ Chat Server │       │ Chat Server │       │ Chat Server │
      │      1      │       │      2      │       │      N      │
      └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
             │                     │                     │
             └─────────────────────┼─────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
             ┌─────────────┐               ┌─────────────┐
             │    Redis    │               │    Kafka    │
             │             │               │             │
             │ Presence    │               │ Events      │
             │ Connections │               │ Ordering    │
             │ Ephemeral   │               │ Replay      │
             └─────────────┘               └──────┬──────┘
                                                   │
                              ┌────────────────────┼──────────────────┐
                              │                    │                  │
                              ▼                    ▼                  ▼
                       ┌─────────────┐      ┌─────────────┐   ┌─────────────┐
                       │   Message   │      │ Notification│   │  Analytics  │
                       │   Consumer  │      │   Service   │   │   Consumer  │
                       └──────┬──────┘      └─────────────┘   └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │ PostgreSQL  │
                       │             │
                       │ Messages    │
                       │ Users       │
                       │ Channels    │
                       └─────────────┘
```

---

# 36. The Important Invariants

A strong system design answer should not only contain boxes.

It should define invariants.

### Invariant 1 — Messages are durable

Once the system acknowledges successful persistence:

```text
Message
    ↓
PostgreSQL
```

the message should survive WebSocket/server failures.

---

### Invariant 2 — WebSocket is not the source of truth

If the connection disappears:

```text
WebSocket lost
```

the user can recover through:

```text
Message history
```

---

### Invariant 3 — Same-conversation ordering is deterministic

Messages in the same conversation receive a server-defined ordering mechanism:

```text
sequence = 100
sequence = 101
sequence = 102
```

---

### Invariant 4 — Message processing is idempotent

If the same event arrives twice:

```text
event
event
```

the system should not create two logical messages.

---

### Invariant 5 — Ephemeral state is separated from durable state

```text
Redis
    ↓
Presence / connections

PostgreSQL
    ↓
Messages / business state
```

---

# 37. Failure Scenarios

A strong interview answer should always discuss failure.

### Kafka unavailable

The message ingestion path may need:

```text
Retry
Backpressure
Circuit breaking
```

depending on the desired availability guarantees.

---

### PostgreSQL unavailable

Messages may remain in the event stream until persistence succeeds.

This is one reason durable event infrastructure can be valuable.

---

### Redis unavailable

Real-time routing/presence can degrade.

But durable messages should remain safe in PostgreSQL/Kafka.

This distinction is important:

```text
Redis failure
≠
Message data loss
```

if Redis is not being used as the source of truth.

---

### WebSocket server crashes

Clients reconnect.

Messages are recovered from durable state.

---

# 38. The Interview Answer in 60 Seconds

If the interviewer asks:

> **"How would you design a scalable real-time chat system?"**

I would answer:

> "I would separate real-time connection handling from durable message storage. Clients establish WebSocket connections through a load balancer to horizontally scalable chat servers. The WebSocket layer handles authentication and connection lifecycle but doesn't become the source of truth for messages.
>
> When a message arrives, the server validates the sender and conversation membership, assigns a server-side message ID, and publishes a message event to Kafka. I would partition events by conversation ID so messages within the same conversation have a deterministic processing order.
>
> A consumer persists messages into PostgreSQL, while another delivery path uses Redis to determine which WebSocket server currently owns the recipient's connection. If the recipient is offline, the message remains durable and a notification service can trigger a push notification.
>
> I'd design consumers to be idempotent because distributed processing can result in duplicate deliveries. Clients would use message IDs or conversation sequence numbers to deduplicate and order messages. On reconnection, the client would request messages after its last known cursor from durable storage.
>
> For scaling, WebSocket servers are stateless from a business-data perspective and can scale horizontally, while Kafka handles event distribution, Redis handles ephemeral presence and connection metadata, and PostgreSQL handles durable state."

That answer demonstrates much more than:

```text
"I know WebSocket."
```

It demonstrates understanding of:

```text
Distributed Systems
Message Queues
Consistency
Ordering
Idempotency
Failure Recovery
Caching
Database Design
Horizontal Scaling
```

---

# 39. What the Interviewer Is Actually Testing

The interviewer is usually not primarily testing whether you know:

```text
WebSocket API
```

They are testing whether you can reason about boundaries.

For example:

### Where does state live?

```text
WebSocket?
Redis?
Database?
Kafka?
```

### What happens when a server dies?

```text
Does data disappear?
Can the client recover?
```

### How do you scale?

```text
Vertical?
Horizontal?
Partition?
Replicate?
```

### How do you guarantee ordering?

```text
Timestamp?
Sequence?
Partition?
```

### What happens when an event is duplicated?

```text
Idempotency?
Unique constraint?
Deduplication?
```

### What is the source of truth?

```text
WebSocket?
Kafka?
PostgreSQL?
```

These questions reveal whether someone understands distributed systems rather than merely knowing a list of technologies.

---

# 40. The Deeper Lesson

The most important lesson from this case study is not:

> "Use Kafka + Redis + PostgreSQL."

That would be the wrong takeaway.

The deeper lesson is:

> **Choose each component according to the property of the data or workload it is responsible for.**

For example:

```text
Real-time connection
        ↓
WebSocket

Ephemeral presence
        ↓
Redis

Durable event stream
        ↓
Kafka

Durable relational state
        ↓
PostgreSQL
```

The architecture works because each system has a relatively clear responsibility.

The goal is not to add technologies.

The goal is to separate fundamentally different problems.

---

# 41. Final Architecture Mental Model

When designing a distributed chat system, think in terms of:

```text
                    ┌──────────────┐
                    │   Client     │
                    └──────┬───────┘
                           │
                     Real-time
                           │
                           ▼
                    ┌──────────────┐
                    │ WebSocket    │
                    │ Layer        │
                    └──────┬───────┘
                           │
                     Event Stream
                           │
                           ▼
                    ┌──────────────┐
                    │    Kafka     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Storage       Delivery     Notification
             │             │
             ▼             ▼
        PostgreSQL       Redis
```

The system is not one giant application.

It is a chain of guarantees:

```text
Authentication
      ↓
Authorization
      ↓
Message Identity
      ↓
Ordering
      ↓
Durability
      ↓
Delivery
      ↓
Acknowledgement
      ↓
Recovery
```

And that is ultimately what a strong system design interview answer should demonstrate.

Not that you know every technology.

But that you understand **where guarantees come from, what happens when they fail, and how the system recovers.**

> [!NOTE]
> **Interview Takeaway:** When answering a system-design question, do not start by listing technologies. Start with requirements, identify the difficult guarantees, define where state lives, and then choose infrastructure that provides those guarantees. A strong answer explains not only the happy path, but also duplication, ordering, failure, recovery, scaling, and trade-offs.