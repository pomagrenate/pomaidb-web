---

title: "What Actually Happens Inside a React Render? From State Update to DOM Commit"
slug: "what-happens-inside-react-render"
date: "2026-08-22"
author: "Quan Van"
excerpt: "A technical investigation into the internal lifecycle of a React update, from state mutation and Fiber scheduling to reconciliation and the final commit into the DOM."
tags: ["React", "Frontend", "JavaScript", "Fiber", "Rendering", "Web"]
category: "Software Engineering"
--------------------------------

![React Rendering Pipeline](/images/blog/react_render_pipeline.png)

Writing a React component often feels deceptively simple.

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

At the application level, the mental model is straightforward:

```text
Click
  ↓
setCount()
  ↓
React renders
  ↓
UI updates
```

But this model hides most of what actually happens.

React does not simply execute the component and immediately replace the DOM.

An update passes through several distinct stages involving state queues, Fiber nodes, scheduling, reconciliation, effect tracking, and finally a commit phase that mutates the host environment.

A more accurate abstraction is:

$$
Update
\rightarrow
Schedule
\rightarrow
Render
\rightarrow
Reconcile
\rightarrow
Commit
\rightarrow
DOM
$$

Understanding this pipeline explains many behaviors that otherwise appear mysterious:

* Why calling `setState` does not immediately change the DOM
* Why React can render components more than once
* Why rendering should remain free of side effects
* Why keys matter
* Why `useEffect` does not execute during rendering
* Why React can interrupt rendering work
* Why a component function running does not necessarily mean the DOM changed

---

## 1. The Component Is Not the UI

Consider:

```tsx
function UserProfile({ user }) {
    return (
        <div className="profile">
            <h1>{user.name}</h1>
        </div>
    );
}
```

It is tempting to think React treats this function as a DOM node.

It does not.

The component function is better understood as a computation that produces a description of UI.

Conceptually:

$$
Component(props, state)
\rightarrow
Element\ Tree
$$

For example:

```tsx
<UserProfile user={{ name: "Quan" }} />
```

produces something conceptually similar to:

```text
UserProfile
    │
    └── div.profile
          │
          └── h1
               │
               └── "Quan"
```

React can then compare this description against the previous one.

This distinction is fundamental.

The component describes what the UI should look like.

React decides **how to transition the actual UI from the previous state to the next state**.

---

## 2. The Update Begins With State

Consider:

```tsx
setCount(count + 1);
```

The DOM does not immediately change at this line.

Instead, React receives an update request.

A simplified conceptual flow is:

```text
setCount()
    ↓
Create Update
    ↓
Attach Update to State Queue
    ↓
Schedule Work
```

The update can be thought of as containing information about the requested state transition.

Conceptually:

```text
Update {
    action: count + 1
}
```

React associates this update with the component's internal state representation.

The important distinction is:

```text
setState()
```

does not mean:

```text
mutate DOM now
```

It means:

```text
schedule a new UI computation
```

---

## 3. React Needs a Representation of the Tree

React maintains an internal representation of the rendered application.

This is where **Fiber** becomes important.

A simplified Fiber node can be thought of as containing information such as:

```text
Fiber
├── type
├── key
├── props
├── state
├── child
├── sibling
├── return
└── alternate
```

The exact internal implementation is considerably more sophisticated, but this conceptual model is useful.

A Fiber tree may resemble:

```text
                App
                 │
              Header
                 │
              Content
              /     \
           Sidebar  Main
                      │
                    Counter
```

Each Fiber represents a unit of work associated with part of the component tree.

This structure is one of the reasons React can reason about rendering as incremental work rather than one giant operation.

---

## 4. The `alternate` Relationship

One particularly important concept in Fiber is the relationship between two trees.

Conceptually:

```text
Current Tree
     │
     │ alternate
     ↓
Work-in-Progress Tree
```

The current tree represents what React considers committed.

The work-in-progress tree represents the next possible state.

For example:

```text
CURRENT
App
 └── Counter
      └── "0"


WORK-IN-PROGRESS
App
 └── Counter
      └── "1"
```

React can construct and evaluate the new tree without immediately destroying the currently committed UI.

This separation is crucial.

It means:

> **Rendering can describe a future UI before that UI becomes visible.**

---

## 5. Scheduling the Update

Once an update exists, React needs to determine when and how it should be processed.

This is where scheduling enters the architecture.

Not all work has identical urgency.

For example:

```text
User input
    ↓
High priority
```

may need to feel immediate.

Meanwhile:

```text
Large background update
    ↓
Lower priority
```

may be allowed to yield to more urgent work.

Modern React therefore does not conceptually treat every update as an identical synchronous command.

The scheduler can organize work according to priority and execution constraints.

This is one of the major architectural differences between a simple rendering library and a system designed around interruptible rendering.

---

## 6. Render Phase

After React begins processing the update, it enters the render phase.

This phase answers:

> **What should the next UI tree look like?**

React traverses the Fiber tree and evaluates components as necessary.

For our example:

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    return <button>{count}</button>;
}
```

the new state might produce:

```text
Previous:

button
 └── "0"


Next:

button
 └── "1"
```

The render phase computes this difference.

Importantly:

**The render phase does not mean React has already modified the DOM.**

This distinction is one of the most important concepts in React internals.

---

## 7. Rendering Is Expected to Be Pure

Because React may evaluate rendering work without immediately committing it, component rendering should behave like a pure computation.

Conceptually:

$$
UI = f(props, state)
$$

Given the same inputs, the rendering logic should produce the same result.

Bad example:

```tsx
function Component() {
    database.write("something");

    return <div>Hello</div>;
}
```

The database operation is a side effect.

If React renders this component more than once, the operation could execute more than once.

This is why side effects belong in mechanisms designed for effects rather than inside the render calculation itself.

The render phase should primarily answer:

```text
"What should the UI be?"
```

not:

```text
"What external systems should I mutate?"
```

---

## 8. Reconciliation

React now has an old tree and a new tree.

The problem becomes:

> **Which parts actually changed?**

This process is generally referred to as reconciliation.

Suppose the previous result is:

```text
<ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
</ul>
```

and the next result is:

```text
<ul>
    <li>A</li>
    <li>C</li>
    <li>D</li>
</ul>
```

React needs to determine how the existing structure should transition.

It does not blindly destroy the entire DOM and recreate it.

Instead, it attempts to identify which existing structures can be reused and which require insertion, deletion, or updates.

---

## 9. Why Keys Exist

This is where React's `key` becomes more than a warning mechanism.

Consider:

```tsx
items.map(item => (
    <Row key={item.id} item={item} />
))
```

The key provides identity information.

Without stable identity, consider:

```text
Previous:

[A, B, C]

Next:

[B, C, D]
```

React needs to determine whether the first position represents:

```text
A → B
```

or whether the original `B` simply moved into the first position.

Keys provide a stronger identity signal:

```text
A(id=1)
B(id=2)
C(id=3)

↓

B(id=2)
C(id=3)
D(id=4)
```

Now React can reason about:

```text
id=1 → deleted
id=2 → reused
id=3 → reused
id=4 → inserted
```

The key is therefore not merely a performance hint.

It participates in the identity model used during reconciliation.

---

## 10. Reconciliation Produces Work

After comparing the trees, React knows which changes need to eventually reach the host environment.

Conceptually:

```text
Old Tree
    +
New Tree
    ↓
Reconciliation
    ↓
Required Changes
```

Those changes may include operations such as:

```text
Placement
Update
Deletion
```

For example:

```text
Old:

<div>
    Hello
</div>


New:

<div>
    Hello World
</div>
```

The resulting work may effectively be:

```text
Update text node
```

while:

```text
Old:

<div />

New:

<div>
    <span>Hello</span>
</div>
```

may require placement of a new host node.

---

## 11. The Render Phase Can Be Interrupted

One of the most interesting properties of the Fiber architecture is that rendering work can be divided into units.

Conceptually:

```text
Fiber A
   ↓
Fiber B
   ↓
Fiber C
   ↓
Fiber D
```

Instead of treating the entire tree as one indivisible operation, React can process work incrementally.

Conceptually:

```text
Render A
Render B
Render C
     ↓
Yield
     ↓
Handle urgent work
     ↓
Resume
     ↓
Render D
```

This is extremely important for responsiveness.

A large amount of rendering work should not necessarily monopolize the main thread indefinitely.

The architecture therefore separates:

```text
"Computing the next UI"
```

from:

```text
"Making that UI visible"
```

---

## 12. Render and Commit Are Different

The complete pipeline can now be divided into two major conceptual phases:

```text
                UPDATE
                   │
                   ↓
             RENDER PHASE
                   │
        ┌──────────┴──────────┐
        │                     │
   Evaluate Components   Reconcile Tree
        │                     │
        └──────────┬──────────┘
                   ↓
             COMMIT PHASE
                   │
                   ↓
              Host DOM
```

The render phase determines what should happen.

The commit phase actually applies the necessary changes.

This distinction explains why React can potentially discard render work.

If a render produces a candidate tree but that tree is never committed, the user never sees it.

---

## 13. The Commit Phase

Once React has completed the required render work, it can commit the result.

This is where changes cross the boundary between React's internal representation and the host environment.

For a browser application:

```text
React
  ↓
React DOM
  ↓
Browser DOM
```

Conceptually:

```text
Fiber Tree
    ↓
Commit
    ↓
DOM Mutation
```

For example:

```text
Create element
Set property
Insert node
Remove node
Update text
```

The commit phase is therefore fundamentally different from rendering.

Rendering computes.

Committing mutates.

---

## 14. Why This Separation Matters

Suppose rendering performs:

```text
Component A
Component B
Component C
Component D
```

and during this process React discovers that higher-priority work should be processed first.

If rendering immediately mutated the DOM after every component, reversing or interrupting that work would become much more difficult.

But if rendering only constructs a candidate result:

```text
Current UI
    │
    ├── remains visible
    │
    ↓
Work-In-Progress
    │
    ├── can be evaluated
    ├── can be paused
    ├── can be abandoned
    └── can be completed
```

React has significantly more flexibility.

Only after the result is ready does it cross the commit boundary.

---

## 15. Effects Belong to a Different Lifecycle

Consider:

```tsx
useEffect(() => {
    document.title = "Dashboard";
}, []);
```

The effect is not conceptually part of the pure UI calculation.

Instead, React tracks the effect during rendering and handles it during the appropriate post-commit lifecycle.

Conceptually:

```text
Render
  ↓
Determine Effects
  ↓
Commit
  ↓
Run Effect
```

This ordering matters.

The effect is associated with the committed result rather than being an arbitrary side effect of evaluating the component function.

---

## 16. Why `useEffect` Can Feel Delayed

A developer may write:

```tsx
setCount(1);
```

and expect:

```text
setCount
 ↓
DOM update
 ↓
useEffect
```

But React's architecture is not simply a synchronous chain of JavaScript statements.

The update enters React's scheduling and rendering machinery.

A simplified model is:

```text
Event
 ↓
State Update
 ↓
Schedule
 ↓
Render
 ↓
Reconcile
 ↓
Commit
 ↓
Effects
```

The exact timing and scheduling behavior depends on the type of update, rendering environment, and React's execution model.

The important point is that **state updates participate in a rendering lifecycle rather than acting as direct DOM assignments**.

---

## 17. The DOM Is a Host Environment

React itself does not fundamentally need to be a browser DOM library.

Its architecture separates the reconciliation process from the environment where the result is applied.

For browsers:

```text
React
 ↓
React DOM
 ↓
DOM
```

But the broader model can support other environments.

Conceptually:

```text
                React Reconciler
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
        DOM          Native       Other
```

The reconciler determines what should happen.

A renderer determines how those operations are translated into the target environment.

This separation is one reason the React ecosystem extends beyond ordinary browser DOM rendering.

---

## 18. A More Accurate Mental Model

The common mental model:

```text
State
 ↓
Component
 ↓
DOM
```

is useful for beginners.

But for understanding React's architecture, a better model is:

```text
State Update
      ↓
Update Queue
      ↓
Scheduler
      ↓
Fiber Work
      ↓
Component Evaluation
      ↓
Reconciliation
      ↓
Work-In-Progress Tree
      ↓
Commit
      ↓
Host Environment
      ↓
Effects
```

Each stage exists for a reason.

The architecture is not complicated merely for the sake of complexity.

It exists to solve a particular problem:

> **How can a declarative UI system efficiently transform changing application state into a consistent host UI while retaining control over scheduling and work?**

---

## 19. React Is Not "Re-rendering the DOM"

One of the most persistent misconceptions is:

> "When state changes, React re-renders the DOM."

That description is misleading.

A component may execute again without the browser DOM being completely recreated.

For example:

```text
Component function executes
        ↓
New element description
        ↓
Reconciliation
        ↓
No meaningful host changes
```

The component was rendered.

The DOM may not have changed.

This distinction becomes especially important when profiling applications.

A component appearing in a render profile does not automatically imply that an equivalent amount of DOM work occurred.

---

## 20. The Deeper Architectural Pattern

React's architecture reflects a broader systems principle:

> **Separate computation from commitment.**

The render phase is largely about computation.

The commit phase is about making the result real.

This pattern appears in many other systems.

Compilers construct intermediate representations before generating machine code.

Databases construct query plans before executing them.

Graphics systems construct command structures before submitting work to hardware.

Transactional systems prepare state before committing it.

React follows a similar conceptual pattern:

```text
Candidate State
      ↓
Compute
      ↓
Validate / Reconcile
      ↓
Commit
```

The specific implementation is different, but the architectural idea is surprisingly general.

---

## 21. Architectural Conclusion

React is often introduced as:

> "A library for building user interfaces."

That is technically correct but architecturally incomplete.

At a deeper level, React is a system for managing the transition between application state and a host environment.

The important abstraction is not simply:

$$
State \rightarrow DOM
$$

but:

$$
State
\rightarrow
Scheduled\ Work
\rightarrow
Fiber\ Tree
\rightarrow
Reconciliation
\rightarrow
Commit
\rightarrow
Host\ Environment
$$

Fiber provides a structure for representing units of rendering work.

Reconciliation determines how the next tree relates to the previous tree.

Scheduling determines when work should be performed.

The commit phase turns the computed result into actual host mutations.

And effects provide a controlled boundary for interacting with systems outside the pure rendering calculation.

Once this architecture becomes visible, many React behaviors stop looking magical.

`setState` is no longer "change the DOM."

A component render is no longer "paint the screen."

A key is no longer "something React complains about."

And reconciliation is no longer a mysterious optimization.

They become parts of a larger system designed around one central idea:

> **Compute the next UI independently, then commit the smallest necessary transition into the real world.**

> [!NOTE]
> **Research Insight:** The most important abstraction in React is not the component itself, but the separation between rendering and commitment. Fiber, scheduling, reconciliation, and the commit phase collectively allow React to treat UI updates as manageable units of work rather than immediate DOM mutations. This separation is what gives a declarative UI system room to reason about priority, interruption, identity, and consistency.
