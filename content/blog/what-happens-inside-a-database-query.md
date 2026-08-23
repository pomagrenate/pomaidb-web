---

title: "What Actually Happens Inside a Database Query? From SQL to the Execution Plan"
slug: "what-happens-inside-a-database-query"
date: "2026-08-22"
author: "Quan Van"
excerpt: "A deeper investigation into how a relational database transforms SQL into an executable plan, covering parsing, binding, optimization, cardinality estimation, index selection, physical operators, and execution."
tags: ["Databases", "SQL", "Query Optimizer", "Execution Plan", "Backend", "Systems"]
category: "Computer Science"
----------------------------

![Database Query Execution Pipeline](/images/blog/database_query_execution_pipeline.png)

When an application executes:

```sql id="j5h9wp"
SELECT *
FROM users
WHERE age > 30;
```

it is tempting to imagine that the database simply reads the `users` table and returns rows whose `age` is greater than `30`.

That is not what happens.

The database receives a declarative description of the desired result.

It must then determine **how** to produce that result.

The distinction is fundamental:

> SQL describes *what* should be returned.
> The database optimizer determines *how* to obtain it.

A simplified execution pipeline is:

$$
SQL
\rightarrow
Parse
\rightarrow
Bind
\rightarrow
Rewrite
\rightarrow
Optimize
\rightarrow
Execute
$$

The interesting part is that the optimizer is solving a search problem.

There may be many logically equivalent ways to execute the same SQL statement, but their actual costs can differ by orders of magnitude.

---

## 1. SQL Is a Declarative Language

Consider:

```sql id="t1s6pg"
SELECT name
FROM users
WHERE age > 30;
```

The query specifies a result:

```text
Return name
from users
where age > 30
```

It does not explicitly specify:

```text
Scan table
Compare age
Read name
Return row
```

The database is free to choose an execution strategy.

This is the defining property of declarative programming.

The programmer describes:

$$
What
$$

while the system determines:

$$
How
$$

That separation gives relational databases their optimization capabilities.

---

## 2. The Database Receives Text

At the beginning, the query is simply a sequence of characters:

```text id="x8d6q1"
SELECT name FROM users WHERE age > 30;
```

The database cannot execute this string directly.

It first needs to understand its structure.

The first stage is therefore parsing.

Conceptually:

```text id="h6xxj8"
SQL Text
   ↓
Lexer
   ↓
Tokens
   ↓
Parser
   ↓
Syntax Tree
```

The lexer identifies meaningful pieces such as:

```text id="d9efn0"
SELECT
name
FROM
users
WHERE
age
>
30
```

The parser then determines how these tokens relate to one another.

---

## 3. From SQL to an Abstract Syntax Tree

The query:

```sql id="z5wq0d"
SELECT name
FROM users
WHERE age > 30;
```

can be represented conceptually as:

```text id="0y5a6h"
SELECT
├── Projection
│   └── name
│
├── FROM
│   └── users
│
└── WHERE
    └── age > 30
```

This structure is much easier for the database to manipulate than raw text.

The database can now reason about:

* tables
* columns
* predicates
* expressions
* projections
* joins
* aggregations
* ordering

The query has become a structured program.

---

## 4. Parsing Is Not Validation

Successfully parsing:

```sql id="k6q2g0"
SELECT age FROM users;
```

only means the query is syntactically valid.

The database still needs to determine whether:

```text id="gkn1at"
users
```

actually exists.

And whether:

```text id="v5d8r1"
age
```

is a valid column.

This leads to another stage:

**semantic analysis.**

Conceptually:

```text id="l6e5yz"
Syntax Tree
    ↓
Semantic Analysis
    ↓
Bound Query
```

The database resolves identifiers against its catalog.

---

## 5. The System Catalog

A relational database maintains metadata describing the database itself.

Conceptually:

```text id="5fcb2j"
Catalog
├── Tables
├── Columns
├── Types
├── Indexes
├── Constraints
├── Statistics
└── Relationships
```

When the query references:

```sql id="6c2d1v"
users.age
```

the database needs to resolve that identifier.

It asks its metadata system:

```text id="p5n6cc"
Does table "users" exist?
        ↓
Does column "age" exist?
        ↓
What is its data type?
        ↓
What indexes reference it?
```

This information becomes important later during optimization.

---

## 6. The Query Has Meaning Now

After parsing and binding, the database has something closer to:

```text id="4i0j5w"
Query
├── Table: users
├── Output: name
└── Predicate:
      age > 30
```

The query is no longer just text.

It is a semantic representation.

But there is still a major problem.

The database does not yet know the best way to execute it.

---

## 7. Logical Query Processing

Before thinking about physical operations, it is useful to think about the query logically.

The query:

```sql id="5qk5nf"
SELECT name
FROM users
WHERE age > 30;
```

can be represented as:

```text id="d08y5f"
Scan users
      ↓
Filter age > 30
      ↓
Project name
```

This is a **logical query plan**.

It describes operations without committing to specific storage algorithms.

The database can reason about the query at this level before selecting physical operators.

---

## 8. Logical Equivalence

Now consider:

```sql id="1q8a3e"
SELECT name
FROM users
WHERE age > 30
AND country = 'VN';
```

Logically:

```text id="c6ppw2"
Scan users
      ↓
Filter age > 30
      ↓
Filter country = 'VN'
      ↓
Project name
```

But the two filters can be combined:

```text id="s5l9tr"
Scan users
      ↓
Filter age > 30 AND country = 'VN'
      ↓
Project name
```

These are logically equivalent.

The optimizer can transform one representation into another.

This is the beginning of query optimization.

---

## 9. Query Optimization Is a Search Problem

Suppose a query joins three tables:

```text id="3y89m0"
A
B
C
```

The database could theoretically execute:

```text id="4y1v7b"
(A JOIN B) JOIN C
```

or:

```text id="a7h7d4"
A JOIN (B JOIN C)
```

These produce the same logical relationship under appropriate conditions.

But their execution costs can be very different.

With more tables, the number of possible join orders grows rapidly.

For $n$ relations, the number of possible join structures can become extremely large.

The optimizer therefore cannot simply enumerate every possible execution plan indefinitely.

It needs strategies for finding a good plan efficiently.

---

## 10. Statistics Become Critical

How does the database know which plan is better?

It needs information about the data.

Consider:

```sql id="l0qv8j"
SELECT *
FROM users
WHERE country = 'VN';
```

If the table contains:

$$
10,000,000
$$

rows, there is a major difference between:

```text
country = 'VN'
```

matching:

$$
9,000,000
$$

rows versus:

$$
10,000
$$

rows.

The optimizer needs to estimate this selectivity.

This is where database statistics become important.

---

## 11. Cardinality Estimation

Cardinality refers broadly to the number of rows produced by an operation.

Suppose:

```text id="frj3qx"
users = 10,000,000 rows
```

and the optimizer estimates:

```text id="q5v6jh"
country = 'VN'
selectivity = 0.01
```

Then:

$$
10,000,000 \times 0.01
======================

100,000
$$

The optimizer estimates that approximately 100,000 rows will survive the filter.

This estimate influences later decisions.

For example:

```text id="5k2f7g"
100 rows
   ↓
Index lookup may be excellent

9,000,000 rows
   ↓
Sequential scan may be better
```

The same predicate can therefore produce different optimal strategies depending on the data distribution.

---

## 12. Histograms

Databases can maintain statistical summaries of column values.

A simplified histogram might look like:

```text id="y9v4rm"
Age

0-10      ███
11-20     ███████
21-30     █████████████
31-40     ██████████
41-50     █████
51+       ██
```

The optimizer can use such information to estimate how many rows satisfy:

```sql id="f6t6up"
WHERE age > 40
```

Without statistics, the optimizer would be forced to make much weaker assumptions.

Statistics therefore influence execution plans even though they never appear in the SQL statement.

---

## 13. Index Scan vs. Sequential Scan

Suppose the database has:

```text id="y52v1p"
users
├── id
├── name
├── age
└── country

INDEX(age)
```

The query is:

```sql id="yx2h7u"
SELECT *
FROM users
WHERE age = 25;
```

The optimizer has at least two conceptual strategies.

### Strategy A — Sequential Scan

```text id="prz4m8"
Read table
 ↓
Check every row
 ↓
Return matches
```

Cost is approximately related to:

$$
O(N)
$$

where $N$ is the number of rows/pages that must be inspected.

### Strategy B — Index Scan

```text id="i4h8sa"
Search index
 ↓
Find matching row locations
 ↓
Fetch rows
```

This can be much cheaper when the predicate is selective.

But an index scan is not automatically better.

---

## 14. Why the Index Can Lose

Suppose:

```text id="2xqg1p"
users = 10,000,000 rows
```

and:

```sql id="w7m4gx"
WHERE age > 18
```

If almost every row satisfies the predicate, the index may produce a huge number of row references.

The database might effectively perform:

```text id="5j2c3q"
Index
 ↓
Millions of references
 ↓
Millions of table accesses
```

A sequential scan could simply read the table pages in order.

Therefore:

> **An index is not inherently faster than a table scan.**

The optimizer must compare expected costs.

---

## 15. Cost Models

A database optimizer uses a cost model to compare candidate plans.

Conceptually:

$$
Cost(plan)
==========

I/O\ Cost
+
CPU\ Cost
+
Memory\ Cost
+
Other\ Costs
$$

The actual implementation varies by database engine.

The optimizer may estimate things such as:

```text
Number of pages read
Number of rows processed
CPU comparisons
Sort operations
Join operations
Memory usage
```

It then searches for a plan with a low estimated cost.

The key word is:

**estimated.**

The optimizer does not know the future with certainty.

---

## 16. A Query Plan Is a Program

Eventually the optimizer constructs something resembling:

```text id="0n5qwl"
             Nested Loop
              /       \
        Index Scan   Index Scan
          users        orders
```

or:

```text id="d4c3yw"
             Hash Join
             /       \
       Seq Scan    Seq Scan
```

This is more than a visualization.

It represents an executable strategy.

Each node is a physical operator.

The database executor runs these operators according to the plan.

---

## 17. Physical Operators

Common physical operators include:

```text id="l2h0jx"
Sequential Scan
Index Scan
Index Only Scan
Nested Loop
Hash Join
Merge Join
Sort
Aggregate
Limit
Filter
```

The same logical operation can have multiple physical implementations.

For example:

```text id="v6p9l8"
Logical Join
     │
     ├── Nested Loop
     ├── Hash Join
     └── Merge Join
```

The optimizer chooses among them based on estimated costs and available properties.

This is one of the most important concepts in database internals.

---

## 18. Nested Loop Join

Consider:

```text id="l6z9b2"
Users
Orders
```

A nested loop conceptually does:

```text id="2xw9c4"
for each user:
    find matching orders
```

Mathematically, if the outer relation has $N$ rows and the inner lookup costs $C$:

$$
Cost \approx N \times C
$$

This can be excellent when:

```text id="5xq7ya"
N is small
```

and the inner relation has an efficient index.

For example:

```text id="bq9l7a"
Users
  ↓
Index lookup into Orders
```

can be extremely efficient for a small number of users.

---

## 19. Hash Join

A hash join takes a different approach.

Conceptually:

```text id="x7c5g4"
Build Phase

Table A
  ↓
Hash Table


Probe Phase

Table B
  ↓
Hash lookup
```

For example:

```text id="7k1j0f"
A:
user_id = 1
user_id = 2
user_id = 3

        ↓

Hash Table


B:
user_id = 2
user_id = 3

        ↓

Probe
```

The expected behavior can approach:

$$
O(N + M)
$$

for relations containing $N$ and $M$ rows, assuming suitable conditions.

This can be much more efficient than repeatedly searching one relation for every row of another.

---

## 20. Merge Join

A merge join exploits sorted inputs.

If both relations are ordered by the join key:

```text id="04iq8u"
A: 1 2 4 7 9
B: 2 4 5 9
```

the database can walk through them together.

Conceptually:

```text id="5r7a2m"
A → 1 → 2 → 4 → 7 → 9
       ↓   ↓       ↓
B → 2 → 4 → 5 → 9
```

This can be extremely efficient when the inputs are already sorted or can be obtained efficiently in sorted order.

Again, the important point is that the optimizer chooses the algorithm based on the properties of the data and available access paths.

---

## 21. Query Execution Is Often Pipelined

A database does not necessarily materialize every intermediate result into a giant temporary table.

Consider:

```text id="w7a8nq"
Scan
 ↓
Filter
 ↓
Project
 ↓
Limit
```

A pipelined executor can conceptually process:

```text id="x2h4h7"
Read row
 ↓
Check predicate
 ↓
Project columns
 ↓
Return row
```

and then continue.

This can reduce memory usage and improve latency.

The architecture resembles a stream of operators:

$$
Operator_1
\rightarrow
Operator_2
\rightarrow
Operator_3
$$

rather than:

$$
Operator_1
\rightarrow
Huge\ Temporary\ Result
\rightarrow
Operator_2
$$

---

## 22. `LIMIT` Can Change Everything

Consider:

```sql id="9k7r8q"
SELECT *
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

Without an appropriate index, the database may need to:

```text id="k6r8dr"
Read many rows
 ↓
Sort
 ↓
Take 10
```

But with an index:

```text id="9f2x4w"
INDEX(created_at DESC)
```

the database may be able to:

```text id="1d2k6m"
Walk index from newest
 ↓
Read 10 rows
 ↓
Stop
```

The presence of `LIMIT` therefore changes the economics of the plan.

The optimizer is not merely asking:

> "Which operation is fastest?"

It is asking:

> **"Which complete strategy is cheapest for producing the required result?"**

---

## 23. Projection Matters Too

Consider:

```sql id="8h2qwl"
SELECT name
FROM users
WHERE age > 30;
```

versus:

```sql id="8v9vbb"
SELECT *
FROM users
WHERE age > 30;
```

The second query requests much more data.

This can affect:

* I/O
* memory
* network transfer
* CPU
* index usability

In some cases, an index can contain all required columns.

Then the database may be able to answer the query directly from the index.

Conceptually:

```text id="4v5f3a"
Index
├── age
└── name
```

No additional table lookup may be necessary.

This is the idea behind an index-only access path in systems that support it under appropriate conditions.

---

## 24. The Optimizer Is Only as Good as Its Information

Suppose the database estimates:

```text id="6d7c4f"
Expected rows: 100
```

but reality is:

```text id="a8w6e1"
Actual rows: 5,000,000
```

A plan chosen for 100 rows may be terrible for five million.

For example:

```text id="yq5e3r"
Nested Loop
```

might be excellent for a tiny result but disastrous for a huge one.

This explains why statistics maintenance and accurate cardinality estimation are so important.

A query optimizer is fundamentally making decisions under uncertainty.

---

## 25. `EXPLAIN` Exposes the Hidden Program

This is where a database engineer can inspect what the optimizer decided.

For example:

```sql id="2o0z8u"
EXPLAIN
SELECT *
FROM users
WHERE age > 30;
```

A conceptual output might resemble:

```text id="y5t3hx"
Seq Scan on users
  Filter: age > 30
  Estimated Rows: 120000
```

The database is effectively exposing part of the program it intends to execute.

This changes the debugging workflow.

Instead of asking:

> "Why is this SQL slow?"

you can ask:

```text id="0x5m8j"
What plan was selected?
        ↓
Why was this access path selected?
        ↓
What cardinality was estimated?
        ↓
What was the actual cardinality?
        ↓
Where did the cost come from?
```

This is a much more powerful way to reason about database performance.

---

## 26. ORM → SQL → Execution Plan

This also connects directly to the previous article about ORMs.

A backend request might look like:

```text id="h0x1fs"
API Request
    ↓
Service
    ↓
ORM
    ↓
Generated SQL
    ↓
Database Parser
    ↓
Query Optimizer
    ↓
Execution Plan
    ↓
Storage Engine
```

This means a slow ORM query cannot always be fixed at the ORM layer.

The real bottleneck may be:

```text id="5d2m2r"
Bad SQL
Bad Index
Bad Statistics
Bad Join Order
Bad Cardinality Estimate
Large Result Set
Storage I/O
Lock Contention
```

The ORM is only one layer in the pipeline.

---

## 27. The Database Is Compiling Your Query

A useful mental model is to think of a SQL query as a small program.

The database performs something similar to:

```text id="1y4qz0"
SQL Source
    ↓
Lexing
    ↓
Parsing
    ↓
Semantic Analysis
    ↓
Logical Representation
    ↓
Optimization
    ↓
Physical Plan
    ↓
Execution
```

That looks remarkably similar to a compiler pipeline.

The difference is that the final target is not machine instructions.

It is a database execution strategy.

The database is effectively compiling a declarative program into a physical execution plan.

---

## 28. Why SQL Can Stay Declarative

This architecture explains one of the most powerful properties of SQL.

The application can say:

```sql id="0nq5tb"
SELECT *
FROM orders
WHERE customer_id = 42;
```

without knowing whether the database will use:

```text id="j9x4n5"
Sequential Scan
```

or:

```text id="q7g4a1"
Index Scan
```

or another access strategy.

The query describes the desired result.

The database retains freedom over the implementation.

That freedom is precisely what makes query optimization possible.

---

## 29. Architectural Conclusion

A SQL query is not an instruction sequence.

It is a declarative specification that enters a compilation-like pipeline:

$$
SQL
\rightarrow
AST
\rightarrow
Logical\ Plan
\rightarrow
Optimized\ Plan
\rightarrow
Physical\ Operators
\rightarrow
Execution
$$

The optimizer sits at the center of this process.

It uses:

* schema metadata
* indexes
* statistics
* cardinality estimates
* cost models
* physical operators

to choose an execution strategy.

The final query plan is therefore the database's answer to a difficult question:

> **"Given the data, hardware, indexes, and constraints I currently know about, what is the cheapest way to produce this result?"**

And that leads to a broader lesson about high-level systems:

> **Declarative abstractions are powerful because they preserve implementation freedom.**

SQL tells the database what result is required.

The optimizer decides how to obtain it.

The storage engine eventually turns that decision into actual reads, comparisons, memory operations, and I/O.

The abstraction ends there.

Underneath the query is not magic.

It is a program.

> [!NOTE]
> **Research Insight:** A relational database can be understood as a compiler for declarative data-processing programs. SQL is parsed into a semantic representation, transformed into a logical plan, optimized using statistics and cost estimation, and finally compiled into physical operators such as scans and joins. Understanding this pipeline is the key to moving from "I know SQL" to "I understand why a database executes SQL the way it does."
