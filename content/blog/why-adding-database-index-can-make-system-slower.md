---
title: "Why Can Adding an Index Make Your Database Slower?"
slug: "why-adding-database-index-can-make-system-slower"
date: "2026-08-23"
author: "Quan Van"
excerpt: "Indexes make database reads faster—or at least that's what we usually learn. But in production systems, adding an index can actually make writes slower, increase storage pressure, and sometimes even cause the optimizer to choose a worse execution plan."
tags:
  - Database
  - PostgreSQL
  - MySQL
  - SQL
  - Indexing
  - Query Optimization
  - Backend Engineering
  - System Design
  - Performance
  - Senior Engineering
category: "Backend Engineering"
---

# Why Can Adding an Index Make Your Database Slower?

> **Senior Backend Interview Question**
>
> **"If an index makes queries faster, why don't we just create indexes for every column?"**

This sounds like a trivial question.

A junior answer might be:

> "Because indexes consume storage."

That's true.

But it's not the interesting part.

A better answer is:

> **Because an index is not a free optimization. It changes the cost model of the entire database workload.**

An index can make:

```text
SELECT
````

faster.

But it can simultaneously make:

```text
INSERT
UPDATE
DELETE
```

more expensive.

And in some cases, an index can even make a particular query **slower** because the query optimizer chooses an inefficient execution plan.

So let's go deeper.

---

# 1. What Is an Index Actually Doing?

Suppose we have:

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    age INT
);
```

And we execute:

```sql
SELECT *
FROM users
WHERE email = 'quan@example.com';
```

Without an index, the database may have to scan the table:

```text
Row 1 → check email
Row 2 → check email
Row 3 → check email
Row 4 → check email
...
Row N → check email
```

Conceptually:

```text
O(N)
```

For a million rows:

```text
1,000,000 rows
```

might need to be inspected.

Now create:

```sql
CREATE INDEX idx_users_email
ON users(email);
```

The database can use the index to locate the relevant rows much faster.

Conceptually:

```text
Index
  ↓
email = quan@example.com
  ↓
row location
  ↓
table row
```

This is why indexes are powerful.

---

# 2. Then Why Not Index Everything?

Because the index itself is data.

Imagine:

```text
users table
+
email index
+
name index
+
age index
+
created_at index
+
status index
+
country index
+
phone index
```

Now every write potentially needs to maintain several additional structures.

Consider:

```sql
INSERT INTO users (...)
VALUES (...);
```

Without secondary indexes:

```text
INSERT
  ↓
write table
```

With 7 indexes:

```text
INSERT
 ├── write table
 ├── update index #1
 ├── update index #2
 ├── update index #3
 ├── update index #4
 ├── update index #5
 ├── update index #6
 └── update index #7
```

The database isn't simply storing the row anymore.

It's maintaining an ecosystem of data structures.

---

# 3. Indexes Trade Write Performance for Read Performance

This is the first important rule:

```text
More indexes
    ↓
Potentially faster reads
    ↓
More expensive writes
```

Therefore, the correct question isn't:

> "Should this column have an index?"

It is:

> **"Does the workload justify maintaining this index?"**

That distinction matters enormously in production.

---

# 4. Read-Heavy vs Write-Heavy Systems

Imagine two systems.

### System A

```text
90% SELECT
10% INSERT/UPDATE
```

Indexes can be extremely valuable.

Now imagine:

### System B

```text
10% SELECT
90% INSERT/UPDATE
```

An aggressive indexing strategy can become expensive.

For example:

```text
logging system
event ingestion
metrics pipeline
analytics ingestion
IoT telemetry
```

may receive enormous write volumes.

Adding dozens of indexes to the ingestion table can significantly increase write amplification.

---

# 5. What Is Write Amplification?

Suppose one logical operation:

```text
INSERT 1 row
```

causes:

```text
1 table write
+
5 index updates
```

The logical operation is still:

```text
1 INSERT
```

but physically the database has more work to perform.

This is broadly referred to as:

> **Write amplification.**

It's one reason storage engines need to carefully manage indexes, pages, WAL, caching, and background maintenance.

---

# 6. An Index Also Consumes Memory

This is another part people often overlook.

Databases love memory.

Why?

Because memory is much faster than disk.

If frequently accessed index pages fit into memory:

```text
Query
 ↓
Memory
 ↓
Index
```

Excellent.

But if you create too many indexes:

```text
Table
+
Index A
+
Index B
+
Index C
+
Index D
+
Index E
...
```

your working set becomes larger.

Now the database has more pages competing for:

```text
Buffer Pool / Shared Buffers
```

This can result in:

```text
cache pressure
+
more disk reads
+
more page eviction
```

So an index can theoretically improve one query while contributing to worse cache behavior for other queries.

---

# 7. The Index Isn't the Whole Query

This is where interview questions become more interesting.

Suppose:

```sql
SELECT *
FROM orders
WHERE user_id = 100
AND status = 'pending';
```

You might create:

```sql
CREATE INDEX idx_orders_user
ON orders(user_id);
```

Great.

But perhaps the query actually filters heavily by:

```text
user_id
+
status
```

A composite index may be more appropriate:

```sql
CREATE INDEX idx_orders_user_status
ON orders(user_id, status);
```

Now the database can potentially narrow the search much more effectively.

The lesson:

> **Index design should follow query patterns, not individual columns.**

---

# 8. Indexes Are About Access Patterns

Don't start with:

```text
"What columns do I have?"
```

Start with:

```text
"What queries do I actually execute?"
```

For example:

```sql
SELECT *
FROM orders
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 20;
```

This query tells us much more about what the index should look like.

Potentially:

```sql
CREATE INDEX idx_orders_user_created
ON orders(user_id, created_at DESC);
```

Now the index corresponds to the actual access pattern.

---

# 9. Composite Indexes Have Ordering

This is a classic interview trap.

Suppose:

```sql
CREATE INDEX idx_orders
ON orders(user_id, status, created_at);
```

The order matters.

It is not equivalent to:

```sql
CREATE INDEX idx_orders
ON orders(status, user_id, created_at);
```

Indexes aren't just bags of columns.

Their structure determines what kinds of searches can efficiently use them.

---

# 10. The Leftmost Prefix Problem

Consider:

```text
(user_id, status, created_at)
```

Queries using:

```text
user_id
```

can potentially use the index.

Queries using:

```text
user_id + status
```

can potentially use it even better.

Queries using:

```text
user_id + status + created_at
```

can exploit the full structure.

But a query filtering only:

```text
created_at
```

doesn't necessarily get the same benefit.

The database isn't magically searching an arbitrary set of columns.

The index has an ordering.

---

# 11. Selectivity Matters

Suppose you have:

```sql
users.gender
```

with values:

```text
male
female
```

A query:

```sql
WHERE gender = 'male'
```

may match a huge portion of the table.

Compare that with:

```sql
WHERE email = 'quan@example.com'
```

which may match exactly one row.

The second predicate has much higher selectivity.

That generally makes an index much more attractive.

---

# 12. But "Low Cardinality = Never Index" Is Wrong

Another common interview trap:

> "Never index boolean columns."

Too simplistic.

Consider:

```text
is_deleted
```

Suppose:

```text
99.9% rows → false
0.1% rows → true
```

A query:

```sql
WHERE is_deleted = true
```

could be highly selective.

An index may be useful.

The correct question is not:

> "Is this a boolean?"

It's:

> **"How selective is the predicate under the actual workload?"**

---

# 13. Data Distribution Changes

This is a major production issue.

Suppose today:

```text
active = 10%
inactive = 90%
```

An index might be useful.

Six months later:

```text
active = 80%
inactive = 20%
```

Now the same index may have very different value.

Database optimization isn't static.

It depends on:

```text
data distribution
query distribution
table size
hardware
statistics
```

---

# 14. The Query Optimizer Makes Decisions

Modern relational databases generally have an optimizer.

You give it:

```sql
SELECT ...
```

The database considers possible execution strategies.

For example:

```text
Plan A:
Sequential Scan

Plan B:
Index Scan

Plan C:
Bitmap Scan

Plan D:
Index + Sort

Plan E:
Join using Hash Join
```

The optimizer estimates their costs.

Then chooses one.

This means:

> **Having an index does not mean the database will use it.**

---

# 15. Sometimes the Database Correctly Ignores Your Index

Imagine:

```text
table = 1,000 rows
```

and:

```sql
WHERE status = 'active'
```

matches:

```text
900 rows
```

Using the index may require:

```text
index lookup
+
900 row lookups
```

A sequential scan may simply read the table efficiently.

So:

```text
Index exists
```

does not imply:

```text
Index should be used
```

The optimizer may correctly choose:

```text
Sequential Scan
```

---

# 16. Why Can an Index Make a Query Slower?

Now we reach the interesting part.

Suppose the optimizer estimates:

```text
Index Scan = cheap
```

but reality is:

```text
Index Scan = expensive
```

because the statistics are wrong or stale.

The database chooses:

```text
Index Scan
```

and ends up doing many random page accesses.

Meanwhile:

```text
Sequential Scan
```

might have been faster.

So the issue isn't:

```text
"indexes are slow"
```

It's:

```text
"the chosen execution plan is wrong for the actual data."
```

---

# 17. Statistics Matter

Databases maintain statistics about data distribution.

Conceptually:

```text
column cardinality
value frequency
histograms
distribution
```

The optimizer uses these statistics to estimate:

```text
How many rows will this predicate return?
```

For example:

```sql
WHERE status = 'pending'
```

If the optimizer thinks:

```text
estimated rows = 100
```

but reality is:

```text
actual rows = 800,000
```

the chosen plan can be terrible.

---

# 18. EXPLAIN Is Your Friend

When investigating a slow query:

```sql
EXPLAIN
SELECT ...
```

is usually a starting point.

For deeper analysis:

```sql
EXPLAIN ANALYZE
SELECT ...
```

can show actual execution behavior.

Conceptually compare:

```text
Estimated:
100 rows

Actual:
800,000 rows
```

That discrepancy is extremely valuable.

---

# 19. The Senior Engineer Doesn't Say "Add an Index"

This is a subtle but important interview distinction.

Suppose someone says:

> "This query is slow."

Junior response:

```text
Add index.
```

Senior response:

```text
Measure first.
```

Then investigate:

```text
1. Query shape
2. Execution plan
3. Cardinality
4. Statistics
5. Data distribution
6. Locking
7. I/O
8. Cache behavior
9. CPU
10. Network
```

Only then decide whether an index is appropriate.

---

# 20. Sometimes the Query Is the Problem

Consider:

```sql
SELECT *
FROM users
WHERE LOWER(email) = 'quan@example.com';
```

Suppose you have:

```sql
INDEX(email)
```

Depending on the database and expression, the normal index may not be directly usable in the desired way because you're applying a function.

Potentially, you may need:

```text
functional/expression index
```

or a different data model.

The important lesson:

> **The index must match the access pattern.**

---

# 21. `SELECT *` Can Also Matter

Suppose the query is:

```sql
SELECT *
FROM orders
WHERE user_id = ?
```

An index on:

```text
user_id
```

can identify matching rows.

But the database may still need to visit the table pages to fetch:

```text
id
created_at
status
total
shipping_address
...
```

If the query only needs:

```sql
SELECT id, created_at, total
```

there may be opportunities for a covering/index-only strategy depending on the database and index design.

This is why query design and index design are tightly connected.

---

# 22. Index-Only Access

Conceptually:

```text
Query
 ↓
Index
 ↓
Answer
```

instead of:

```text
Query
 ↓
Index
 ↓
Table
 ↓
Answer
```

Avoiding table access can significantly reduce I/O.

But this comes with a trade-off:

```text
larger index
```

because the index may need to contain additional data.

Again:

> **Optimization is a trade-off.**

---

# 23. Indexes Can Increase Storage Dramatically

Imagine:

```text
Table:
20 GB
```

You add:

```text
Index A: 5 GB
Index B: 4 GB
Index C: 8 GB
Index D: 3 GB
```

Now:

```text
Total:
40 GB
```

The database has doubled its storage footprint.

This affects:

```text
backup
restore
replication
disk usage
cache pressure
maintenance
```

So indexes are architectural decisions, not merely SQL decorations.

---

# 24. Indexes Affect Replication

In a replicated database:

```text
Primary
   │
   ├──── Replica 1
   ├──── Replica 2
   └──── Replica 3
```

Indexes have to exist on replicas as part of the database state.

More indexes mean more storage and maintenance work across the topology.

This matters when operating at scale.

---

# 25. Index Maintenance Is a Production Concern

As data changes:

```text
INSERT
UPDATE
DELETE
```

indexes need maintenance.

Depending on the database engine, there can also be concerns around:

```text
bloat
fragmentation
vacuum
statistics
rebuild/reorganization
```

The exact mechanics differ between PostgreSQL, MySQL/InnoDB, SQL Server, and others.

But the broader principle is universal:

> **Indexes have lifecycle costs.**

---

# 26. The Most Dangerous Index Is the One Nobody Uses

Imagine:

```text
idx_a
idx_b
idx_c
idx_d
idx_e
idx_f
```

Nobody knows why they exist.

They've been there for:

```text
3 years
```

Removing them feels dangerous.

So they stay forever.

Now every write maintains unnecessary structures.

This is technical debt.

---

# 27. Indexes Need Observability

A mature database operation should answer:

```text
Which indexes are used?
Which indexes aren't used?
Which queries benefit from them?
Which indexes are expensive to maintain?
```

Without this visibility:

```text
CREATE INDEX
```

becomes permanent guesswork.

---

# 28. Don't Optimize the Schema From One Query

Imagine:

```text
Query A:
very fast

Query B:
very slow
```

You add an index for B.

But that index increases:

```text
write cost
storage
cache pressure
```

and B only runs:

```text
once per day
```

while your writes happen:

```text
100,000 times per second
```

That might be a terrible trade.

Optimization must consider:

```text
frequency × cost × business importance
```

not merely:

```text
"this query is slow."
```

---

# 29. Workload Matters More Than Individual Queries

Think in terms of:

```text
Database workload
```

rather than:

```text
single query
```

For example:

```text
100M INSERT/day
+
10M UPDATE/day
+
1M SELECT/day
```

has very different optimization priorities from:

```text
1M INSERT/day
+
500M SELECT/day
```

The same index can have completely different value in these systems.

---

# 30. Indexing Is a Cost Model

A useful mental model is:

```text
Index Benefit
=
Read Performance Improvement

Index Cost
=
Write Amplification
+
Storage
+
Memory Pressure
+
Maintenance
+
Replication Cost
+
Operational Complexity
```

You want:

```text
Benefit > Cost
```

under the actual workload.

That's the real answer to:

> "Why don't we index everything?"

---

# 31. The Interview Answer

If an interviewer asks:

> **"Why can adding an index make a database slower?"**

A strong answer:

> "Because an index isn't free. It improves some read access paths but adds write amplification, storage consumption, memory pressure, and maintenance overhead. More importantly, an index doesn't guarantee a faster query—the optimizer still has to choose an execution plan, and inaccurate statistics or poor selectivity can cause an index scan to be worse than a sequential scan.
>
> So I wouldn't add indexes based only on which columns appear in queries. I'd look at the actual workload, query frequency, execution plans, cardinality, data distribution, and write/read ratio. I'd verify with EXPLAIN ANALYZE and monitor whether the index is actually being used and whether its benefit justifies its maintenance cost."

---

# 32. A Trickier Follow-Up

> **"If the index isn't being used, should we immediately delete it?"**

Not necessarily.

You need to know:

```text
Why isn't it being used?
```

Possibilities include:

```text
1. Query doesn't benefit from it.
2. Another index is better.
3. Table is too small.
4. Predicate has poor selectivity.
5. Statistics are inaccurate.
6. Query is rare.
7. Query planner estimates another plan is cheaper.
8. The index is needed for a different workload.
9. It supports a constraint or uniqueness requirement.
```

So:

> **Unused doesn't automatically mean useless.**

---

# 33. Another Senior Question

> **"Would you prefer one giant composite index or multiple smaller indexes?"**

There is no universal answer.

You need to consider:

```text
query patterns
selectivity
ordering
write cost
storage
index intersection capabilities
maintenance
```

A giant composite index may be excellent for a specific access pattern but useless for unrelated queries.

Multiple smaller indexes provide flexibility but may increase maintenance and allow less optimal execution strategies.

The right answer is:

> **Design indexes around real query patterns and verify with execution plans.**

---

# 34. Another Trick Question

> **"If a query uses an index, does that mean the index is helping?"**

No.

This is subtle.

A query can technically use an index while still performing badly.

For example:

```text
Index Scan
+
millions of random heap/table accesses
```

could be worse than:

```text
Sequential Scan
```

Therefore:

```text
"index used"
```

is not the same as:

```text
"index was beneficial."
```

Measure:

```text
actual execution time
rows
I/O
buffers
CPU
```

---

# 35. The Bigger Lesson

Database optimization is not:

```text
Add index
→
problem solved
```

It is:

```text
Observe
 ↓
Measure
 ↓
Understand workload
 ↓
Inspect execution plan
 ↓
Form hypothesis
 ↓
Change
 ↓
Benchmark
 ↓
Monitor
```

This is fundamentally an engineering feedback loop.

---

# Final Takeaways

```text
1. Indexes are data structures, not magic performance switches.

2. Every index has a maintenance cost.

3. Indexes generally trade write performance for read performance.

4. More indexes increase storage and memory pressure.

5. The optimizer decides whether an index is useful.

6. An index can be slower than a sequential scan.

7. Cardinality and data distribution matter.

8. Composite index column order matters.

9. Index design should follow query patterns.

10. Query frequency matters as much as query latency.

11. EXPLAIN / EXPLAIN ANALYZE should guide optimization.

12. "Index exists" does not mean "index should be used."

13. "Index is used" does not mean "index is beneficial."

14. Unused indexes should be investigated before removal.

15. Database optimization is workload optimization, not query optimization in isolation.
```

---

# One Sentence to Remember

> **An index is a trade: you spend storage and write performance to buy a faster access path for specific read patterns.**