---

title: "What Actually Happens Inside an ORM? From Model Definition to SQL Execution"
slug: "what-happens-inside-an-orm"
date: "2026-08-22"
author: "Quan Van"
excerpt: "A technical investigation into what really happens between an ORM query and the database, exploring model metadata, query construction, parameter binding, SQL generation, execution, and result hydration."
tags: ["ORM", "Database", "Backend", "SQL", "Software Architecture"]
category: "Software Engineering"
--------------------------------

![ORM Query Execution Pipeline](/images/blog/orm_query_pipeline.png)

Modern backend development allows engineers to write database operations that look almost nothing like SQL.

For example:

```ts
const users = await prisma.user.findMany({
    where: {
        age: {
            gt: 18
        }
    },
    orderBy: {
        createdAt: "desc"
    }
});
```

There is no visible SQL.

No connection management.

No cursor handling.

No manual row parsing.

Yet somewhere underneath this abstraction, the database still needs to receive something equivalent to:

```sql
SELECT *
FROM "User"
WHERE "age" > $1
ORDER BY "createdAt" DESC;
```

The ORM has not eliminated SQL.

It has inserted another computational layer between the application and the database.

A simplified pipeline is:

$$
Application
\rightarrow
ORM
\rightarrow
Query\ Representation
\rightarrow
SQL
\rightarrow
Database
\rightarrow
Rows
\rightarrow
Application\ Objects
$$

Understanding this pipeline is important because ORM abstractions can hide both their strengths and their costs.

---

## 1. The ORM Abstraction

An ORM — Object-Relational Mapper — attempts to represent relational database concepts using programming-language abstractions.

A relational database provides concepts such as:

```text
Table
Column
Row
Foreign Key
Index
Transaction
```

while an object-oriented application works with:

```text
Class
Object
Property
Method
Reference
```

The ORM attempts to bridge these two models.

Conceptually:

```text
Object Model
     ↓
   ORM
     ↓
Relational Model
```

For example:

```ts
const user = await db.user.findUnique({
    where: {
        id: 42
    }
});
```

can represent something conceptually equivalent to:

```sql
SELECT *
FROM users
WHERE id = 42
LIMIT 1;
```

The ORM therefore acts as a translation layer.

But translation requires information.

---

## 2. The ORM Needs a Schema

Consider a model definition:

```prisma
model User {
    id        Int      @id @default(autoincrement())
    name      String
    email     String   @unique
    createdAt DateTime @default(now())
}
```

This definition contains much more information than a simple TypeScript type.

The ORM needs to understand:

```text
User
 ├── id
 │    └── Integer
 ├── name
 │    └── String
 ├── email
 │    └── String + Unique
 └── createdAt
      └── DateTime
```

It can use this metadata for multiple purposes:

* query validation
* type generation
* SQL generation
* migration generation
* relationship resolution
* result mapping

The model definition is therefore not merely documentation.

It becomes input to the ORM's internal machinery.

---

## 3. From Schema to Metadata

Internally, an ORM needs a representation of the schema that is easier for software to process.

A simplified internal structure might resemble:

```text
Model: User

Fields:
  id
    type = Int
    primaryKey = true

  name
    type = String

  email
    type = String
    unique = true

  createdAt
    type = DateTime
```

This can be thought of as metadata:

$$
Schema
\rightarrow
Metadata
$$

The ORM can then use that metadata when interpreting application queries.

For example:

```ts
where: {
    email: "quan@example.com"
}
```

can be validated against:

```text
User.email
type = String
unique = true
```

before a database request is even made.

---

## 4. The Query Is Not SQL Yet

Consider:

```ts
db.user.findMany({
    where: {
        age: {
            gt: 18
        }
    }
});
```

The application has expressed a query using a programming-language object.

Conceptually, the ORM first transforms this into an intermediate representation.

Something like:

```text
Query
├── Model: User
├── Operation: FindMany
└── Filter
    └── age
        └── GreaterThan
            └── 18
```

This structure is much closer to an abstract syntax tree than to raw SQL.

The important architectural idea is:

> **The ORM does not necessarily translate source code directly into SQL character-by-character.**

It can first construct a structured representation of the intended operation.

---

## 5. Query Builders Are Intermediate Representations

This is similar to how compilers work.

A compiler does not generally transform:

```c
x = a + b;
```

directly into machine instructions as a simple string replacement.

It constructs intermediate representations.

Similarly, an ORM can conceptually perform:

```text
Application Query
       ↓
Query Representation
       ↓
SQL Representation
       ↓
Database Execution
```

The intermediate representation gives the ORM an opportunity to reason about:

* filtering
* joins
* ordering
* pagination
* projections
* relationships
* parameters

before generating SQL.

This is one of the reasons an ORM can support multiple database engines.

---

## 6. Parameter Binding

Consider:

```ts
db.user.findMany({
    where: {
        email: inputEmail
    }
});
```

A safe SQL representation should not simply concatenate:

```text
"SELECT ... WHERE email = '" + inputEmail + "'"
```

Instead, the ORM typically produces parameterized SQL.

Conceptually:

```sql
SELECT *
FROM users
WHERE email = $1;
```

with:

```text
$1 = inputEmail
```

The query and its data are therefore treated as separate values.

Conceptually:

$$
SQL\ Structure
\neq
User\ Data
$$

This separation is fundamental to safe database interaction.

It also allows database drivers and database engines to handle parameters more efficiently.

---

## 7. SQL Generation

The ORM now has enough information to construct SQL.

Consider:

```ts
db.user.findMany({
    where: {
        age: {
            gt: 18
        }
    },
    orderBy: {
        createdAt: "desc"
    }
});
```

A simplified generated query could be:

```sql
SELECT
    "id",
    "name",
    "email",
    "createdAt"
FROM "User"
WHERE "age" > $1
ORDER BY "createdAt" DESC;
```

with:

```text
parameters = [18]
```

The database does not know that the query originated from Prisma, Hibernate, Sequelize, Entity Framework, or another ORM.

It receives a database-level representation.

This means the ORM abstraction ultimately terminates at the database protocol boundary.

---

## 8. The Database Still Does the Hard Work

One misconception about ORMs is that they somehow optimize the database query automatically.

They can improve query construction and provide useful abstractions.

But the database engine still performs the fundamental work:

```text
SQL
 ↓
Parser
 ↓
Query Planner
 ↓
Execution Plan
 ↓
Indexes / Tables
 ↓
Rows
```

For example:

```sql
SELECT *
FROM users
WHERE email = $1;
```

may cause the database to inspect an index:

```text
Email Index
     ↓
Matching Row
     ↓
Heap / Table
     ↓
Result
```

The ORM does not replace the database query planner.

It constructs the request that eventually reaches it.

---

## 9. ORM and Query Planner Are Different Layers

This distinction is important.

Consider:

```text
Application
     ↓
ORM
     ↓
Generated SQL
     ↓
Database Parser
     ↓
Query Planner
     ↓
Execution Engine
```

The ORM answers:

> "What database operation does the application want?"

The query planner answers:

> "What is the most efficient way for the database to execute that operation?"

These are different problems.

An ORM can generate syntactically correct SQL that is still extremely inefficient.

For example:

```sql
SELECT *
FROM orders
WHERE customer_id = $1;
```

may be fast with:

```text
INDEX(customer_id)
```

but slow if the database has to scan millions of rows.

The ORM cannot magically create optimal indexes for every workload.

---

## 10. Relationships Introduce Complexity

Consider:

```prisma
model User {
    id     Int    @id
    posts  Post[]
}

model Post {
    id      Int  @id
    userId  Int
    user    User @relation(fields: [userId], references: [id])
}
```

The application may request:

```ts
db.user.findMany({
    include: {
        posts: true
    }
});
```

The ORM now has to translate a relationship into relational operations.

One possible SQL strategy is a join:

```sql
SELECT
    users.*,
    posts.*
FROM users
LEFT JOIN posts
    ON posts.user_id = users.id;
```

But depending on the ORM, database, query shape, and configuration, other execution strategies may be used.

The conceptual problem remains:

```text
Object Relationship
        ↓
Relational Relationship
```

This translation is one of the most complicated responsibilities of an ORM.

---

## 11. The N+1 Problem

A particularly famous failure mode occurs when application code causes one query to load a collection and then another query for each individual item.

Conceptually:

```text
Query users
     ↓
User 1 → Query posts
User 2 → Query posts
User 3 → Query posts
...
User N → Query posts
```

The number of queries becomes:

$$
1 + N
$$

For:

$$
N = 1000
$$

the application could potentially perform:

$$
1001
$$

database queries.

The problem is not necessarily that the ORM is "bad."

The abstraction made it easy to express operations without making the database interaction obvious.

This is one of the reasons engineers working with ORMs still need to understand SQL and relational execution.

---

## 12. Hydration

The database does not return TypeScript objects.

It returns rows.

For example:

```text
[
    {
        id: 42,
        name: "Quan",
        email: "quan@example.com"
    }
]
```

The ORM may then transform the database representation into application-level structures.

Conceptually:

```text
Database Row
     ↓
Driver Result
     ↓
ORM Mapping
     ↓
Application Object
```

This process is often referred to as hydration.

The inverse process can occur when application objects or values are transformed into database parameters.

Thus the ORM performs translation in both directions:

$$
Application
\leftrightarrow
Database
$$

---

## 13. Type Mapping

The database and programming language do not always share identical type systems.

For example:

```text
Database
----------------
INTEGER
VARCHAR
TIMESTAMP
BOOLEAN
DECIMAL
JSON
```

while the application might use:

```text
number
string
Date
boolean
Decimal
object
```

The ORM needs a mapping:

```text
INTEGER  → number
VARCHAR  → string
TIMESTAMP → Date
BOOLEAN  → boolean
```

The mapping becomes more complicated for types such as:

* decimals
* binary data
* JSON
* arrays
* database-specific types
* spatial data

This is another hidden responsibility behind apparently simple ORM APIs.

---

## 14. Transactions Add Another Layer

Consider:

```ts
await db.$transaction(async tx => {
    await tx.user.create(...);
    await tx.order.create(...);
});
```

At the application level, this looks like a single abstraction.

Underneath, the database must maintain transactional state.

Conceptually:

```text
BEGIN
   ↓
INSERT user
   ↓
INSERT order
   ↓
COMMIT
```

If something fails:

```text
BEGIN
   ↓
INSERT user
   ↓
INSERT order
   X
ROLLBACK
```

The ORM provides an interface for expressing the transaction.

The database provides the actual transactional guarantees.

Again, the abstraction boundary does not remove the underlying system.

It simply gives the application a different interface to it.

---

## 15. Connection Pools

Another hidden subsystem is connection management.

A backend application may execute:

```ts
await db.user.findMany();
```

without explicitly opening a TCP connection.

The ORM or database driver may maintain a connection pool:

```text
                Connection Pool
             ┌──────┬──────┬──────┐
             │ Conn │ Conn │ Conn │
             └──────┴──────┴──────┘
                 ↑      ↑      ↑
                 └──────┼──────┘
                        │
                    ORM / Driver
```

Instead of creating a new database connection for every query, existing connections can be reused.

Conceptually:

$$
Request
\rightarrow
Acquire\ Connection
\rightarrow
Execute
\rightarrow
Release
$$

Connection pooling becomes especially important in high-concurrency backend systems.

---

## 16. The ORM Can Become a Performance Boundary

An abstraction is useful precisely because it hides details.

But hidden details can also become hidden costs.

Consider:

```ts
await db.user.findMany({
    include: {
        posts: true
    }
});
```

At the application level, this is concise.

At the database level, it might involve:

```text
JOIN
+
Large Result Set
+
Object Construction
+
Hydration
+
Memory Allocation
```

The real cost is therefore not visible from the source code alone.

This produces an important engineering principle:

> **High-level code should not be used as a substitute for understanding the lower-level system it controls.**

---

## 17. ORMs Are Not Just Query Builders

A mature ORM may provide much more than SQL generation.

Its architecture can include:

```text
Schema System
     ↓
Type Generator
     ↓
Query API
     ↓
Query Representation
     ↓
SQL Generator
     ↓
Driver
     ↓
Connection Pool
     ↓
Database
```

And on the way back:

```text
Database
     ↓
Rows
     ↓
Driver
     ↓
Type Mapping
     ↓
Hydration
     ↓
Application
```

The ORM is therefore closer to a small compiler/runtime system than a simple convenience wrapper around SQL.

---

## 18. ORM as a Compiler-Like System

A useful mental model is to compare an ORM with a compiler.

A compiler transforms:

$$
Source\ Code
\rightarrow
IR
\rightarrow
Machine\ Code
$$

An ORM can conceptually transform:

$$
Application\ Query
\rightarrow
Query\ IR
\rightarrow
SQL
$$

The analogy is not exact.

A database still performs its own parsing and optimization after receiving SQL.

But the architecture is similar enough to reveal something important:

**the ORM is performing semantic translation, not merely string formatting.**

This is why ORM internals can become surprisingly complex.

---

## 19. Why Understanding SQL Still Matters

ORMs dramatically improve developer productivity.

They can provide:

* type safety
* schema management
* migrations
* reusable query abstractions
* relationship mapping
* transaction APIs
* database portability

But they do not eliminate the need to understand relational databases.

An engineer should still be able to reason about:

```text
JOIN
INDEX
SCAN
SORT
GROUP BY
TRANSACTION
LOCK
CARDINALITY
QUERY PLAN
```

Otherwise, when performance problems appear, the ORM becomes a black box.

The correct debugging process becomes:

```text
Application
    ↓
ORM Query
    ↓
Generated SQL
    ↓
EXPLAIN
    ↓
Database Execution Plan
```

rather than simply changing application code until the request becomes faster.

---

## 20. The Abstraction Boundary

The deeper lesson is not that ORMs are good or bad.

The question is where the abstraction should end.

For ordinary CRUD:

```ts
db.user.findUnique(...)
```

may be exactly the right abstraction.

For highly optimized analytical queries:

```sql
WITH ...
WINDOW ...
JOIN ...
GROUP BY ...
```

raw SQL may provide more control.

A mature backend architecture can therefore contain multiple levels:

```text
Simple Operations
        ↓
ORM

Complex Domain Queries
        ↓
Query Builder

Highly Specialized Operations
        ↓
Raw SQL
```

The choice depends on the problem.

Abstraction should reduce accidental complexity without hiding the complexity that engineers actually need to control.

---

## 21. Architectural Conclusion

An ORM is often described as a layer that lets developers interact with databases using objects instead of SQL.

That description is accurate, but incomplete.

A more useful model is:

$$
Application
\rightarrow
Schema\ Metadata
\rightarrow
Query\ Representation
\rightarrow
SQL
\rightarrow
Driver
\rightarrow
Connection
\rightarrow
Database
$$

and then:

$$
Rows
\rightarrow
Driver
\rightarrow
Type\ Mapping
\rightarrow
Hydration
\rightarrow
Application
$$

The ORM sits between two fundamentally different computational models.

On one side:

```text
Objects
Types
Functions
Application State
```

On the other:

```text
Tables
Rows
Indexes
Transactions
SQL
```

Its job is to translate between them.

That translation is extraordinarily useful.

But it is still a translation.

And whenever performance, correctness, or scalability becomes important, the engineer eventually has to look through the abstraction.

> [!NOTE]
> **Research Insight:** An ORM is better understood as a compiler-like translation layer than as a simple database wrapper. It transforms application-level operations into structured queries, SQL, parameters, and database operations, then performs the reverse transformation through type mapping and hydration. The abstraction improves productivity, but the database remains responsible for query planning, indexing, storage, and transactional execution. Understanding both layers is therefore essential for diagnosing real-world backend performance.
