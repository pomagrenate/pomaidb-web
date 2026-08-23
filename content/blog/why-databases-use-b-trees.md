---

title: "Why Databases Use B-Trees: The Mathematics Behind Efficient Disk-Based Search"
slug: "why-databases-use-b-trees"
date: "2026-08-22"
author: "Quan Van"
excerpt: "A technical investigation into why database indexes rely on B-Trees and B+Trees, and how high fan-out transforms disk-based search from an expensive linear process into logarithmic traversal."
tags: ["Databases", "B-Trees", "B+Trees", "Data Structures", "Systems"]
category: "Computer Science"
----------------------------

![B-Tree Index Structure](/images/blog/btree_index_structure.png)

In-memory algorithms often assume that accessing an element is cheap.

A CPU can jump to an address in memory, compare a value, and continue execution within nanoseconds. This assumption makes structures such as binary search trees and hash tables extremely effective for many workloads.

Database systems operate under a different constraint.

The dataset may be significantly larger than available RAM. Data must therefore reside on persistent storage, where accessing a small region of data is dramatically more expensive than performing an arithmetic operation in the CPU.

This changes the fundamental optimization target.

A database index is not primarily trying to minimize the number of comparisons.

It is trying to minimize the number of **expensive storage accesses** required to locate those comparisons.

This constraint is one of the reasons B-Trees and their derivative, B+Trees, became fundamental data structures for database indexing.

---

## 1. The Storage Access Problem

Consider a sorted dataset containing one billion records.

A naive search could inspect records sequentially:

$$
O(n)
$$

A binary search reduces the number of comparisons to:

$$
O(\log_2 n)
$$

For one billion elements:

$$
\log_2(10^9) \approx 30
$$

Thirty comparisons sounds extremely efficient.

But databases introduce another dimension.

Suppose every comparison requires loading a different storage page.

Then the algorithm may require approximately thirty storage accesses.

The CPU is not the bottleneck anymore.

The storage system is.

The important question therefore becomes:

> **How can we reduce the number of storage pages that must be accessed?**

The answer is not simply "make the tree balanced."

The answer is:

**Increase the number of children each node can have.**

---

## 2. Why Binary Trees Are Not Ideal for Storage

A traditional binary search tree has at most two children per node.

```text
              50
             /  \
           25    75
          / \    / \
        10  30 60  90
```

The tree is efficient in memory because each comparison determines whether the search continues left or right.

But if every node corresponds to a storage page, the tree has relatively low fan-out.

A search path through a binary tree may therefore require many page reads.

A B-Tree changes the structure fundamentally.

Instead of storing one key per node, a B-Tree stores many keys:

```text
                  [20 | 40 | 60 | 80]
                /    |    |    |     \
               /     |    |    |      \
            <20   20-40 40-60 60-80   >80
```

One node can therefore determine the next branch among many possibilities.

The tree becomes **wide rather than deep**.

This is the central idea behind B-Trees.

---

## 3. High Fan-Out

Let:

* $m$ = maximum number of children per node
* $h$ = tree height
* $N$ = number of indexed records

For a binary tree:

$$
m = 2
$$

For a database B-Tree, $m$ may be hundreds or even thousands depending on page size and key size.

The approximate number of records addressable by a tree of height $h$ is:

$$
N \approx m^h
$$

Therefore:

$$
h \approx \log_m N
$$

Consider a simplified example with:

$$
N = 10^9
$$

A binary tree requires approximately:

$$
\log_2(10^9) \approx 30
$$

levels.

A tree with fan-out:

$$
m = 1000
$$

requires only:

$$
\log_{1000}(10^9) = 3
$$

levels.

This is the fundamental advantage.

The tree does not become faster because individual comparisons are cheaper.

It becomes faster because **the number of expensive levels is dramatically reduced**.

---

## 4. The Database Page

B-Trees are designed around another important concept:

**the page**.

Databases generally move data between storage and memory in blocks rather than reading individual bytes for every operation.

A simplified page might look like:

```text
+------------------------------------------------+
| Page Header                                    |
+------------------------------------------------+
| Key 1 | Key 2 | Key 3 | ... | Key N            |
+------------------------------------------------+
| Child | Child | Child | ... | Child             |
+------------------------------------------------+
```

If a database page is 16 KB and each index entry is small enough, a single page can contain hundreds of keys.

Instead of performing:

```text
read → compare → read → compare → read
```

the database can perform:

```text
read one page
      ↓
compare many keys in memory
      ↓
select child page
      ↓
read next page
```

The expensive operation happens at the page boundary.

The comparisons inside the page are comparatively cheap.

---

## 5. B-Tree Search

Suppose an index contains:

```text
[10 | 20 | 30 | 40 | 50 | 60 | 70 | 80]
```

and we search for:

```text
57
```

The database does not scan every record.

It determines which range contains the key:

$$
50 < 57 < 60
$$

It then follows the corresponding child pointer.

Conceptually:

```text
                  [20 | 40 | 60 | 80]
                       |
                    40-60
                       |
                 [45 | 50 | 55]
                       |
                    55-60
                       |
                      57
```

At every level, the search space is reduced by a large factor.

The complexity remains:

$$
O(\log_m N)
$$

where the important practical variable is the fan-out $m$.

---

## 6. Why B+Trees Became Particularly Important

Modern database indexes frequently use a variant called the **B+Tree**.

The major structural difference is that internal nodes primarily contain:

* separator keys
* child pointers

while the actual indexed records or record references are stored in the leaf level.

A simplified structure looks like:

```text
                  [30 | 60]
                 /    |    \
                /     |     \
              [10]  [40]   [70]
                \      |      /
                 \     |     /
              [10,20] [30,40,50] [60,70,80]
```

The leaves are commonly linked:

```text
[10,20] → [30,40,50] → [60,70,80]
```

That additional structure provides an important property.

Point lookups and range scans can use the same index efficiently.

---

## 7. Range Queries

Consider:

```sql
SELECT *
FROM users
WHERE age BETWEEN 20 AND 30;
```

A hash table is excellent at answering:

```text
WHERE id = 123
```

But range queries are fundamentally different.

The database needs to find a starting point and then efficiently traverse nearby values.

B+Trees are naturally suited to this.

The database first searches for the beginning of the range:

$$
age = 20
$$

Then it walks through neighboring leaf entries:

```text
20 → 21 → 22 → 23 → ... → 30
```

The index therefore provides both:

1. logarithmic positioning
2. sequential traversal

This is one of the reasons ordered indexes are so useful for databases.

---

## 8. Splitting a Full Node

B-Trees must remain balanced as new keys are inserted.

Consider a simplified node:

```text
[10 | 20 | 30 | 40]
```

Suppose the node is full and another key arrives:

```text
25
```

The node cannot simply grow indefinitely.

Instead, it is split.

Conceptually:

```text
Before:

[10 | 20 | 25 | 30 | 40]


After:

        [25]
       /    \
 [10 | 20] [30 | 40]
```

The separator is promoted into the parent.

This operation allows the tree to maintain bounded node sizes while preserving ordering.

Repeated insertions therefore produce a balanced structure rather than allowing one branch to become arbitrarily deep.

---

## 9. Why the Tree Remains Balanced

A critical property of B-Trees is that leaf nodes remain at approximately the same depth.

Consider:

```text
             [40]
            /    \
        [20]      [60]
       /   \      /   \
     ...   ...  ...   ...
```

A search for any key eventually reaches a leaf after approximately the same number of levels.

This gives the tree a predictable worst-case search complexity:

$$
O(\log_m N)
$$

The balancing is not merely an algorithmic convenience.

It ensures that storage access costs remain bounded.

---

## 10. Why Not Use a Hash Table?

Hash indexes can provide excellent equality lookup:

```text
WHERE id = 42
```

Conceptually:

$$
index = hash(key)
$$

The expected lookup complexity is approximately:

$$
O(1)
$$

So why not use hash tables for every database index?

Because databases need more than equality lookup.

Consider:

```sql
WHERE price > 100
```

or:

```sql
ORDER BY created_at
```

or:

```sql
WHERE age BETWEEN 20 AND 30
```

A hash function destroys ordering.

The keys:

```text
10
20
30
40
50
```

might be distributed into completely unrelated hash buckets.

A B+Tree preserves ordering.

That ordering is extremely valuable for database workloads.

---

## 11. The Real Cost Model

Traditional algorithm analysis often focuses on:

$$
\text{CPU Operations}
$$

Database systems require a broader model:

$$
\text{Total Cost}
=================

\text{CPU Cost}
+
\text{Memory Cost}
+
\text{Storage I/O Cost}
$$

In many workloads, storage access is orders of magnitude more expensive than a few additional comparisons.

Therefore a database may intentionally perform more CPU work to reduce I/O.

For example, searching through hundreds of keys inside one already-loaded page is usually preferable to reading several additional pages.

This leads to a general systems principle:

> **Optimize the expensive boundary, not necessarily the individual operation.**

---

## 12. B-Trees and Modern Storage

The original motivation for B-Trees came from storage systems where random access was extremely expensive.

Modern hardware changes the exact cost model.

SSDs are dramatically faster than spinning disks.

NVMe devices provide high parallelism and low latency.

Memory is also becoming larger.

Yet B-Tree-like structures remain fundamental because the underlying problem has not disappeared.

Large databases still have datasets larger than RAM.

Storage is still slower than memory.

And moving data between layers remains expensive.

The optimization target has evolved, but the principle remains:

```text
Minimize expensive data movement.
```

---

## 13. Indexes Are Not Free

An index improves reads, but it introduces costs.

Suppose a table contains:

```text
users
├── id
├── name
├── email
├── age
└── created_at
```

Creating indexes on every column may appear attractive.

But every index consumes:

* storage
* memory
* maintenance time
* write bandwidth
* cache capacity

When a row is inserted or modified, affected indexes may also need to be updated.

Therefore:

$$
\text{Faster Reads}
\neq
\text{Free Performance}
$$

An index represents a trade-off between read efficiency and write/storage overhead.

---

## 14. The Deeper Pattern

B-Trees are interesting not simply because they are clever data structures.

They demonstrate a much broader idea in systems engineering.

The best design depends on the cost structure of the environment.

A binary tree may be perfectly reasonable when:

```text
memory access ≈ cheap
```

But when:

```text
storage access ≫ CPU comparison
```

the optimal structure changes.

The algorithm is therefore shaped by the hardware.

This relationship appears everywhere in computer science.

Caches exist because memory is slower than registers.

Virtual memory exists because physical memory is limited.

Compression exists because storage and bandwidth are expensive.

Indexes exist because searching persistent data is expensive.

Distributed systems exist because one machine is not always enough.

Software architecture is ultimately constrained by the physical world beneath it.

---

## 15. Architectural Conclusion

The B-Tree is a useful reminder that algorithmic complexity alone does not describe real system performance.

A binary search may require only:

$$
O(\log_2 N)
$$

comparisons.

But if each comparison crosses an expensive storage boundary, those comparisons can dominate execution time.

B-Trees solve the problem by increasing fan-out:

$$
h \approx \log_m N
$$

A large $m$ dramatically reduces tree height, allowing a database to locate data with relatively few page accesses.

B+Trees extend the model further by separating internal navigation from leaf storage and linking leaves to support efficient ordered traversal and range queries.

The result is not merely a faster search tree.

It is a data structure designed around a physical constraint.

And that is perhaps the more important lesson:

> **Good systems algorithms are rarely optimized for an abstract machine. They are optimized for the machine that actually exists.**

> [!NOTE]
> **Research Insight:** The key optimization behind B-Trees is not minimizing comparisons. It is minimizing expensive page accesses by maximizing fan-out. This distinction illustrates why algorithm design for databases must account for the memory hierarchy and storage system rather than relying solely on traditional CPU-oriented complexity analysis.
