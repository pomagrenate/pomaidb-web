---
title: "What If AI Never Learned Anything? Can Pure Mathematics Build an Intelligent System?"
slug: "what-if-ai-never-learned-anything-pure-mathematics-ai"
date: "2026-08-23"
author: "Quan Van"
excerpt: "Before neural networks dominated AI, intelligent behavior was already being built from logic, probability, search, optimization, graphs, and mathematical models. But if we completely remove training and build an AI system using only mathematics, what can it actually solve—and where does it fundamentally break?"
tags:
  - AI
  - Artificial Intelligence
  - Mathematics
  - Machine Learning
  - Symbolic AI
  - Probabilistic AI
  - Optimization
  - Algorithms
  - Search
  - Decision Systems
  - AI Engineering
  - Senior Engineering
category: "Artificial Intelligence"
---

# What If AI Never Learned Anything?

## Can Pure Mathematics Build an Intelligent System?

> **A deeper AI question**
>
> **"If intelligence can ultimately be expressed mathematically, why do we need training at all? Could we build an AI system using only mathematics, algorithms, probability, search, optimization, and explicit rules?"**

This is a much more interesting question than:

> "Can we build AI without neural networks?"

Because the answer to that question is obviously:

**Yes.**

AI existed long before modern neural networks became dominant.

But the deeper question is:

> **What happens when we remove training entirely?**

No:

```text
dataset
↓
gradient descent
↓
neural network
↓
learned weights
````

Instead:

```text
problem
↓
mathematical model
↓
search
↓
probability
↓
optimization
↓
decision
```

Can this still behave intelligently?

Yes.

But the real question is:

> **How far can it go?**

And that's where things get interesting.

---

# 1. AI Did Not Begin With Neural Networks

When people hear:

```text
AI
```

they often immediately think:

```text
LLM
Transformer
Neural Network
GPU
Training
Weights
```

But historically, artificial intelligence was much broader.

A system can exhibit intelligent behavior through:

```text
logic
search
planning
probability
optimization
knowledge representation
constraint solving
graph algorithms
game theory
decision theory
```

None of these inherently require neural network training.

For example:

```text
A*
Dijkstra
Minimax
Alpha-Beta Pruning
Bayesian Inference
Monte Carlo Methods
Constraint Satisfaction
Dynamic Programming
SAT Solvers
Integer Programming
```

are all mathematical or algorithmic techniques.

And some of them can produce behavior that looks remarkably intelligent.

---

# 2. Let's Remove the Neural Network Completely

Imagine we want an AI agent.

Normally:

```text
Input
 ↓
Neural Network
 ↓
Prediction
 ↓
Action
```

Now remove the neural network.

We're left with:

```text
Input
 ↓
Representation
 ↓
Mathematical Model
 ↓
Search / Optimization
 ↓
Decision
 ↓
Action
```

The system doesn't need to "remember" what it learned during training.

Instead, it computes what it should do.

This creates a completely different engineering philosophy.

---

# 3. Training vs Computing

A trained model essentially says:

```text
I have learned an approximation of a function.
```

For example:

```text
f(x) → y
```

The training process tries to find parameters:

```text
θ
```

such that:

```text
f(x; θ) ≈ y
```

After training:

```text
input
 ↓
weights
 ↓
output
```

The learned weights contain compressed information about the training distribution.

---

# 4. A Pure Mathematical System Does Something Different

Instead of:

```text
f(x; θ)
```

we might construct:

```text
f(x)
```

directly.

For example:

```text
f(x) = argmin_y C(x, y)
```

The system doesn't need to learn which `y` is good.

We explicitly define:

```text
C(x, y)
```

as the cost function.

Then the system searches for:

```text
y*
```

such that:

```text
y* = argmin_y C(x, y)
```

That's already a decision-making system.

And depending on the problem, it can be extremely powerful.

---

# 5. Example: Navigation

Suppose a robot has:

```text
map
current_position
destination
```

We don't necessarily need a neural network.

Represent the environment as a graph:

```text
A ─── B ─── C
│     │     │
D ─── E ─── F
      │
      G
```

Each edge has a cost:

```text
A → B = 5
B → C = 3
A → D = 2
D → E = 2
E → F = 4
```

Now solve:

```text
shortest_path(A, F)
```

using:

```text
Dijkstra
```

or:

```text
A*
```

The result can be:

```text
A → D → E → F
```

Is this "intelligent"?

It certainly performs:

```text
reasoning
planning
optimization
decision making
```

But it never trained on a dataset.

---

# 6. Now Add Uncertainty

Real environments aren't deterministic.

Suppose the robot estimates:

```text
P(road_blocked | sensor_data)
```

Now we can use probability.

For example:

```text
P(blocked | sensor)
```

might be:

```text
0.82
```

The system can choose:

```text
route A
```

with expected cost:

```text
E[C(A)] = 10
```

and:

```text
route B
```

with:

```text
E[C(B)] = 7
```

Then:

```text
choose B
```

Again:

```text
No training required.
```

We are simply computing.

---

# 7. This Leads to a Powerful Idea

Instead of:

```text
learn what to do
```

we can define:

```text
what "good" means
```

and then compute:

```text
how to achieve it
```

This is optimization.

Formally:

```text
x* = argmin_x C(x)
```

or:

```text
x* = argmax_x U(x)
```

where:

```text
C(x)
```

is a cost function.

or:

```text
U(x)
```

is utility.

---

# 8. Intelligence Becomes Search

Suppose we have:

```text
state S
```

and possible actions:

```text
A1
A2
A3
...
An
```

Each action produces another state:

```text
S
│
├── A1 → S1
├── A2 → S2
├── A3 → S3
└── A4 → S4
```

Now we can search.

The AI becomes:

```text
State
 ↓
Generate possible actions
 ↓
Evaluate states
 ↓
Search
 ↓
Select best action
```

This is an extremely old idea.

And it still works.

---

# 9. Chess Is a Perfect Example

A chess engine doesn't need to understand chess the way humans do.

It can represent:

```text
board state
```

and generate:

```text
legal moves
```

Then:

```text
move
 ↓
new board
 ↓
possible opponent moves
 ↓
new board
 ↓
...
```

This creates a search tree.

Conceptually:

```text
                Position
               /        \
             Move A     Move B
             /   \       /   \
           A1    A2     B1    B2
```

Then evaluate positions.

For example:

```text
evaluation(position)
```

could incorporate:

```text
material
king safety
mobility
pawn structure
piece activity
```

No training is fundamentally required.

---

# 10. But Here's the First Real Problem

The search space explodes.

Suppose:

```text
average legal moves ≈ 30
```

After:

```text
1 ply:
30 positions

2 ply:
900 positions

3 ply:
27,000 positions

4 ply:
810,000 positions

5 ply:
24,300,000 positions
```

And this grows exponentially.

So pure mathematics encounters:

> **Combinatorial explosion.**

This is one of the fundamental problems of non-trained AI.

---

# 11. The First Battle: Search Space

Suppose:

```text
branching factor = b
depth = d
```

Naive search complexity is approximately:

```text
O(b^d)
```

If:

```text
b = 50
d = 20
```

then:

```text
50^20
```

is astronomically large.

No amount of clever coding makes that entire tree cheap to enumerate.

So we need mathematical shortcuts.

---

# 12. Heuristics

Instead of searching everything:

```text
all possibilities
```

we estimate:

```text
which possibilities are promising?
```

This gives us:

```text
heuristic function
```

For example:

```text
h(n)
```

estimates the remaining cost from state `n`.

A* uses:

```text
f(n) = g(n) + h(n)
```

where:

```text
g(n)
```

is the cost already spent.

and:

```text
h(n)
```

is the estimated remaining cost.

This dramatically reduces search.

---

# 13. Heuristics Are a Form of Knowledge

Now we encounter something interesting.

Where does:

```text
h(n)
```

come from?

In a trained system:

```text
data
 ↓
learning
 ↓
h(n)
```

In a pure mathematical system:

```text
human/domain knowledge
 ↓
mathematical formulation
 ↓
h(n)
```

This is the trade.

The system doesn't learn the heuristic.

**You design it.**

---

# 14. This Creates a New Bottleneck

Without training:

```text
computation
```

is not necessarily the hardest part.

The hardest part can become:

> **Encoding the world into mathematical structure.**

For example:

```text
What makes a good route?

What makes a good chess position?

What makes a good software architecture?

What makes a good answer?

What makes a useful search result?
```

These aren't purely computational questions.

They require a representation.

---

# 15. Representation Is Everything

Suppose we want to build:

```text
AI software engineer
```

Without training.

What is the state?

Maybe:

```text
repository
files
AST
symbols
dependencies
types
compiler errors
tests
git history
```

Now we can represent the project as a graph:

```text
Module A
   │
   ├── imports → Module B
   │
   └── calls → Function X
                   │
                   └── accesses → Database
```

Now we can perform graph algorithms.

---

# 16. Code Completion Without Training

This is where the idea becomes particularly interesting.

Suppose the user writes:

```rust
let result = user.
```

A traditional ML model might predict:

```text
email
name
id
```

based on learned patterns.

But a mathematical system can inspect:

```text
type(user)
```

Suppose:

```rust
struct User {
    id: u64,
    name: String,
    email: String,
}
```

Then the completion candidates are:

```text
id
name
email
```

No training required.

The system is performing:

```text
symbol resolution
+
type inference
+
AST analysis
```

This is deterministic intelligence.

---

# 17. But Ranking Becomes Hard

Suppose:

```text
user.
```

has:

```text
id
name
email
created_at
updated_at
```

Which should appear first?

A pure mathematical engine can define a score:

```text
Score(candidate) =
w1 * TypeCompatibility
+
w2 * ScopeDistance
+
w3 * UsageFrequency
+
w4 * NameSimilarity
+
w5 * ContextRelevance
```

Then:

```text
rank candidates by Score
```

Still no neural network.

---

# 18. But Where Does Usage Frequency Come From?

Now we can distinguish:

```text
training
```

from:

```text
statistics
```

Suppose the IDE records:

```text
email → selected 120 times
name → selected 80 times
id → selected 60 times
```

We can estimate:

```text
P(candidate | context)
```

using frequencies.

This isn't necessarily neural network training.

It's statistical modeling.

For example:

```text
P(email | User.member_access)
```

could be:

```text
120 / 260
```

Now ranking becomes:

```text
semantic score
+
statistical score
```

---

# 19. This Is Where Markov Models Become Interesting

Suppose code tokens are:

```text
let
user
=
get_user
(
id
)
```

A simple model can estimate:

```text
P(token_n | token_{n-1}, token_{n-2}, ...)
```

For example:

```text
P("unwrap" | "result", ".")
```

or:

```text
P("await" | "future", ".")
```

This can be implemented with:

```text
N-gram
Markov chains
transition matrices
```

No neural network required.

---

# 20. But Pure Statistical Prediction Has a Problem

Consider:

```rust
let result = database.
```

The statistically common completion might be:

```text
query
```

But the actual database object may only expose:

```text
execute
```

The statistical model doesn't know the program's semantics.

The compiler does.

Therefore:

```text
Statistical Model
+
Program Analysis
```

is much stronger than either one alone.

---

# 21. Hybrid Mathematical Intelligence

Now we can construct:

```text
Code Context
     │
     ├──────────────┐
     ▼              ▼
AST Analysis    Statistical Model
     │              │
     ▼              ▼
Valid Candidates   Probability
     │              │
     └──────┬───────┘
            ▼
        Ranking
            │
            ▼
       Completion
```

This is interesting because:

> **The "AI" doesn't necessarily need to be a neural network.**

It can be an ensemble of deterministic mathematical systems.

---

# 22. But Now We Hit a Much Bigger Problem

What happens when the environment isn't formally structured?

For example:

```text
"Make this backend faster."
```

What exactly is the mathematical state?

We could inspect:

```text
CPU
memory
queries
network
locks
profiles
```

But:

```text
"make it faster"
```

doesn't define a precise objective.

We need to translate natural language into:

```text
constraints
objectives
variables
```

This is difficult.

---

# 23. Natural Language Is the Hard Part

Mathematical systems are extremely good when the problem is:

```text
well-defined
```

For example:

```text
Find shortest path.
```

Excellent.

```text
Find minimum cost.
```

Excellent.

```text
Satisfy these constraints.
```

Excellent.

But:

```text
"Write clean code."
```

is ambiguous.

What is:

```text
clean?
```

We can define metrics:

```text
cyclomatic complexity
coupling
cohesion
duplication
dependency depth
test coverage
```

But these are only proxies.

---

# 24. The Proxy Problem

Suppose we define:

```text
Code Quality =
- complexity
- duplication
- coupling
```

Now optimize it.

The system may produce:

```text
extremely abstract code
```

with:

```text
low duplication
low coupling
```

but terrible readability.

This is a classic optimization problem:

> **Optimizing the metric is not necessarily the same as optimizing the real objective.**

This is not unique to AI.

It is one of the deepest problems in optimization itself.

---

# 25. Goodhart's Law Appears

A simplified version:

> **When a measure becomes a target, it stops being a good measure.**

Suppose:

```text
Goal:
maximize test coverage
```

The mathematical system can generate:

```text
lots of trivial tests
```

and achieve:

```text
99% coverage
```

without necessarily improving software quality.

The algorithm did exactly what we asked.

The problem was:

```text
we asked the wrong thing.
```

---

# 26. This Is One of the Fundamental Limits

Pure mathematics can optimize:

```text
defined objective
```

But real-world problems often contain:

```text
implicit preferences
ambiguity
context
unknown variables
human judgment
```

This is where learned models become powerful.

They can approximate complicated relationships from examples.

---

# 27. Training Is Essentially a Compression Mechanism

This is a useful way to think about machine learning.

Suppose the real world contains:

```text
billions of examples
```

We could manually encode every relationship.

Obviously impossible.

Instead:

```text
data
 ↓
optimization
 ↓
parameters
```

The parameters become a compressed representation of patterns.

The trained model gives us:

```text
fast inference
```

instead of:

```text
explicitly computing everything
```

This is one of the reasons training is so powerful.

---

# 28. Pure Algorithms Have the Opposite Trade-Off

A non-trained system may say:

```text
I don't know the pattern.
I'll calculate it.
```

That's powerful when the search space is manageable.

But if the problem requires exploring:

```text
10^30 possibilities
```

the computation becomes impossible.

A trained model may instead provide:

```text
approximate answer
```

in milliseconds.

So:

```text
Training
→
precompute knowledge into parameters

Pure algorithm
→
compute knowledge at runtime
```

This is a very useful conceptual distinction.

---

# 29. Training Is Not Magic

This is an important point.

A neural network doesn't magically "understand the world."

Training performs optimization:

```text
minimize L(θ)
```

where:

```text
L
```

is a loss function.

Gradient descent updates:

```text
θ_{t+1}
=
θ_t
-
η ∇L(θ_t)
```

At a fundamental level:

```text
optimization
+
linear algebra
+
probability
+
statistics
```

are still mathematics.

The difference is that we use mathematics to discover useful parameters automatically.

---

# 30. So Could We Replace Training With Mathematics?

Here's the subtle answer:

**Training itself is mathematics.**

Therefore:

```text
"AI without mathematics"
```

doesn't make sense.

The real distinction is:

```text
explicitly designed mathematical intelligence
```

versus:

```text
learned mathematical parameters
```

The first says:

```text
human defines the model
```

The second says:

```text
human defines the learning objective
machine discovers the parameters
```

---

# 31. The Real Engineering Question

Instead of asking:

> "Can AI exist without training?"

Ask:

> **"Which parts of intelligence can be computed explicitly, and which parts are too expensive or ambiguous to encode manually?"**

This gives us a much more useful framework.

---

# 32. Problems Where Pure Mathematics Is Extremely Strong

There are many.

### Pathfinding

```text
A*
Dijkstra
Floyd-Warshall
```

### Scheduling

```text
constraint programming
integer programming
linear programming
```

### Routing

```text
graph optimization
```

### Resource allocation

```text
optimization
```

### Symbolic reasoning

```text
logic
SAT
SMT
```

### Program analysis

```text
AST
CFG
type systems
data-flow analysis
```

### Search

```text
Minimax
Alpha-Beta
Monte Carlo Tree Search
```

### Anomaly detection

```text
statistical thresholds
distance functions
probability distributions
```

### Ranking

```text
weighted scoring
Bayesian models
learning-to-rank without neural networks
```

These aren't toys.

They solve real production problems.

---

# 33. Problems Where It Starts Struggling

Purely designed systems become much harder when the input is:

```text
unstructured
ambiguous
high-dimensional
context-heavy
open-ended
```

Examples:

```text
"Explain this weird bug."
```

```text
"Write a natural email to my customer."
```

```text
"Understand what this developer actually means."
```

```text
"Look at this image and determine what is happening."
```

```text
"Read these 500 documents and summarize the important relationships."
```

The mathematical challenge isn't that mathematics can't represent these things.

It can.

The problem is:

> **We don't know the representation and objective cheaply enough.**

---

# 34. Representation Becomes the Bottleneck

Suppose I give a system:

```text
10,000 source files
```

and ask:

```text
"Find the architectural problem."
```

We can represent the repository as:

```text
AST graph
dependency graph
call graph
type graph
module graph
```

Great.

But what exactly is:

```text
architectural problem?
```

Maybe:

```text
cycle
```

Maybe:

```text
high coupling
```

Maybe:

```text
wrong abstraction
```

Maybe:

```text
business logic in controller
```

Some are mathematically detectable.

Some require semantic judgment.

---

# 35. This Suggests a Powerful Architecture

Instead of:

```text
LLM does everything
```

we can build:

```text
                Intelligence System
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 Deterministic      Statistical       Learned
 Algorithms         Models             Models
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                    Decision
```

For example, an IDE could use:

```text
Compiler
+
AST
+
Type System
+
Graph Algorithms
+
N-gram Statistics
+
Optional Neural Model
```

The neural model doesn't need to own everything.

---

# 36. This Is Probably the More Interesting Future

People often ask:

> "Will AI replace algorithms?"

Probably not.

A more realistic future is:

```text
Algorithms
        +
Statistical Models
        +
Neural Models
        +
Optimization
```

working together.

A compiler will still need:

```text
parser
type checker
borrow checker
```

even if an LLM writes the code.

A database will still need:

```text
query optimizer
indexes
transactions
locks
```

even if AI helps generate SQL.

An autonomous agent will still need:

```text
authorization
timeouts
state
budgets
```

even if an LLM decides what tool to call.

---

# 37. Why This Matters for AI Engineers

A common mistake is:

```text
AI Engineer
=
know how to call an LLM API
```

That's not enough.

A stronger AI engineer understands:

```text
probability
optimization
search
graphs
statistics
information retrieval
distributed systems
program analysis
data structures
```

because AI systems ultimately have to operate inside real software systems.

---

# 38. A Pure Mathematical AI for Code Completion

Let's make the idea concrete.

Suppose we're building a code completion engine without a neural model.

Pipeline:

```text
Source Code
    │
    ▼
Lexer
    │
    ▼
Parser
    │
    ▼
AST
    │
    ▼
Symbol Table
    │
    ▼
Type Resolution
    │
    ▼
Candidate Generation
    │
    ├── Scope
    ├── Type
    ├── Imports
    ├── API
    └── Syntax
    │
    ▼
Candidate Scoring
    │
    ├── Edit Distance
    ├── Frequency
    ├── Context
    ├── Scope Distance
    └── Markov Probability
    │
    ▼
Ranking
    │
    ▼
Completion
```

This is absolutely possible.

And a good implementation could be surprisingly useful.

---

# 39. But It Will Not Behave Like an LLM

Suppose the user types:

```rust
fn process_payment(...)
```

A neural model may infer:

```text
probably validate input
probably call payment provider
probably log transaction
probably handle retry
probably return result
```

A pure algorithmic system cannot simply "know" that unless we encode:

```text
payment domain knowledge
```

into its model.

That's the difference.

---

# 40. But This Limitation Is Also a Strength

Because deterministic systems are:

```text
predictable
```

They can provide:

```text
same input
+
same state
=
same output
```

This is extremely valuable.

For example:

```text
compiler
static analyzer
type checker
security validator
```

should often be deterministic.

You don't want:

```text
Yesterday:
"This code is safe."

Today:
"Maybe unsafe."
```

because the model sampled differently.

---

# 41. Determinism Is an Engineering Feature

Consider:

```text
AI output:
70% confidence
```

versus:

```text
formal rule:
type mismatch
```

The second is much easier to:

```text
test
debug
audit
reproduce
verify
```

This is why deterministic algorithms aren't obsolete.

They are often exactly what production systems need.

---

# 42. The Interesting Middle Ground

We can create a system where:

```text
deterministic mathematics
```

handles:

```text
hard constraints
```

while:

```text
statistical or learned models
```

handle:

```text
soft decisions
```

For example:

```text
Candidate generation
→ deterministic

Candidate validity
→ deterministic

Candidate ranking
→ statistical

Natural-language explanation
→ neural
```

This architecture is often much safer than:

```text
LLM does everything
```

---

# 43. The Deeper Question: Is This "AI"?

At this point someone might ask:

> "If it's just algorithms, why call it AI?"

The answer depends on your definition.

If AI means:

> "A system that performs tasks associated with human intelligence."

Then:

```text
search
planning
reasoning
decision making
```

can absolutely qualify.

If AI means:

> "A system that learns representations from data."

Then a purely deterministic system isn't machine learning.

These are different concepts.

---

# 44. AI Is a Broader Category Than Machine Learning

A useful hierarchy is:

```text
Artificial Intelligence
│
├── Symbolic AI
│
├── Search
│
├── Planning
│
├── Optimization
│
├── Probabilistic AI
│
├── Machine Learning
│   ├── Classical ML
│   └── Neural Networks
│       ├── CNN
│       ├── RNN
│       └── Transformers
│
└── Hybrid Systems
```

So:

```text
AI ≠ Neural Network
```

and:

```text
AI ≠ Machine Learning
```

Machine learning is one approach to building AI.

---

# 45. The Fundamental Trade-Off

We can summarize the entire discussion with this:

```text
                Pure Algorithm
                     │
        ┌────────────┴────────────┐
        │                         │
   Explicit Knowledge        Runtime Compute
        │                         │
        ▼                         ▼
   Predictable              Potentially Expensive
```

while:

```text
                Learned Model
                     │
        ┌────────────┴────────────┐
        │                         │
   Learned Knowledge        Fast Inference
        │                         │
        ▼                         ▼
  Hard to Interpret         Expensive Training
```

Neither is universally superior.

They optimize different things.

---

# 46. What Happens in the Real World?

The practical problem becomes:

```text
Can we afford to compute the answer?
```

If yes:

```text
algorithmic solution
```

may be excellent.

If no:

```text
approximation
```

becomes attractive.

And machine learning is one powerful way to construct that approximation.

---

# 47. Neural Networks Can Be Seen as Learned Approximators

Suppose the ideal function is:

```text
f(x)
```

but computing it exactly is extremely expensive.

We can learn:

```text
fθ(x) ≈ f(x)
```

Now inference is cheap.

That's one way to understand why neural networks are so powerful.

They aren't necessarily solving the exact mathematical problem.

They are learning a computationally efficient approximation.

---

# 48. This Changes How We Should Think About "AI Without Training"

The question isn't:

> "Can mathematics replace AI?"

Because AI itself is mathematical.

The better question is:

> **"Can explicit algorithms replace learned approximations for this particular problem?"**

Sometimes:

```text
Yes.
```

Sometimes:

```text
Absolutely not economically.
```

And sometimes:

```text
Hybrid is best.
```

---

# 49. The Senior Engineering Answer

If an interviewer asks:

> **"Can you build an intelligent system without training a model?"**

A strong answer would be:

> "Yes. AI is broader than machine learning. We can build intelligent behavior using search, planning, probabilistic inference, optimization, constraint solving, graph algorithms, symbolic reasoning, and statistical models without neural-network training.
>
> The limitation is scalability and representation. A deterministic system requires us to explicitly define the state, actions, constraints, objective function, and heuristics. For well-defined domains like routing, scheduling, program analysis, planning, and optimization, this can work extremely well.
>
> The problem becomes harder when the input is unstructured, ambiguous, high-dimensional, or difficult to formally represent. Machine learning becomes valuable there because training can automatically discover useful approximations and representations from data.
>
> So I wouldn't frame it as mathematics versus AI. Both are mathematical. The real trade-off is between explicitly engineered computation and knowledge learned from data."

---

# 50. And the Harder Follow-Up

> **"Then why not just use a giant mathematical algorithm instead of training an LLM?"**

Because the problem isn't only computation.

It's also:

```text
representation.
```

A giant algorithm still needs to know:

```text
what matters
what doesn't
what relationships exist
what the user means
what constitutes success
```

Training provides a mechanism for discovering many of these relationships automatically.

Without training:

```text
human engineering effort
```

becomes the bottleneck.

With training:

```text
data
+
compute
```

becomes the bottleneck.

That is the real trade.

---

# Final Takeaways

```text
1. AI existed before modern neural networks.

2. Pure mathematical systems can perform intelligent behavior.

3. Search, optimization, probability, logic, and graphs are legitimate AI techniques.

4. The main limitation of non-trained AI is often not mathematics itself, but representation.

5. Deterministic systems are excellent for well-defined problems.

6. Combinatorial explosion is one of their major practical limitations.

7. Heuristics reduce search, but heuristics must be designed.

8. Training can be understood as automatically discovering useful parameters and representations.

9. A learned model often replaces expensive computation with a cheap approximation.

10. Pure algorithms provide predictability and reproducibility.

11. Neural models provide flexibility in ambiguous and unstructured domains.

12. Code intelligence can combine ASTs, type systems, graphs, statistics, and search without neural networks.

13. Statistical models do not necessarily require neural-network training.

14. AI does not equal machine learning.

15. Machine learning does not equal neural networks.

16. The strongest real-world architecture is often hybrid.

17. Deterministic mathematics should handle hard constraints whenever possible.

18. Statistical or learned models can handle soft, uncertain decisions.

19. The important question isn't "Can AI exist without training?"

20. The important question is "Which parts of intelligence can we compute explicitly, and which parts are cheaper to learn?"
```

# One Sentence to Remember

> **A trained AI learns an approximation of the world; a pure mathematical AI tries to calculate its way through the world. The engineering challenge is deciding when calculation is cheaper than learning.**