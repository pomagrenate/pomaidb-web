---
title: "CASE STUDY: Why Does Your AI Agent Keep Calling the Same Tool Forever?"
slug: "why-ai-agent-keeps-calling-same-tool-forever"
date: "2026-08-23"
author: "Quan Van"
excerpt: "A production AI agent can have a powerful LLM, excellent tools, and a solid RAG system—and still get stuck in an infinite tool-calling loop. This case study explores why that happens and how to design an agent that can actually control its own execution."
tags:
  - AI
  - LLM
  - AI Agents
  - Agentic AI
  - Tool Calling
  - RAG
  - Backend Engineering
  - Distributed Systems
  - System Design
  - Senior Engineering
category: "Artificial Intelligence"
---

# CASE STUDY: Why Does Your AI Agent Keep Calling the Same Tool Forever?

> **Senior Backend / AI Engineer Interview Question**
>
> **"You have an AI Agent with tool calling. Sometimes the agent repeatedly calls the same tool forever, even though the tool is returning valid results. Why does this happen, and how would you design the system to prevent it?"**

This is a deceptively difficult question.

A junior implementation might look like:

```text
User
 ↓
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
````

And the developer thinks:

> "The model will eventually know when it is done."

That assumption is dangerous.

An LLM does not inherently own the concept of:

```text
"this execution should terminate"
```

It predicts the next action based on the current context.

If the context keeps making the same tool call appear reasonable, the model can keep calling it.

So the real problem isn't:

> "Why is the LLM stupid?"

The real engineering question is:

> **"Who owns the execution lifecycle of an autonomous agent?"**

And the answer should generally be:

> **The orchestrator—not the LLM.**

---

# 1. The Naive Agent Architecture

A very simple agent looks like:

```text
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     LLM      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Tool      │
└──────┬───────┘
       │
       ▼
    Result
       │
       ▼
┌──────────────┐
│     LLM      │
└──────────────┘
```

Implementation-wise, developers often write something conceptually similar to:

```text
while true:
    response = llm(messages)

    if response contains tool_call:
        result = execute_tool(response.tool_call)
        messages.append(result)
        continue

    return response
```

Looks reasonable.

But notice something important:

```text
while true
```

There is no hard execution boundary.

The system is effectively saying:

> "LLM, tell me when you're done."

That's not an execution policy.

---

# 2. The Infinite Loop

Imagine the agent has this tool:

```text
get_weather(city)
```

The user asks:

```text
"What is the weather in Ho Chi Minh City?"
```

The model calls:

```text
get_weather("Ho Chi Minh City")
```

Tool returns:

```json
{
  "temperature": 31,
  "condition": "cloudy"
}
```

The LLM sees the result.

Then, unexpectedly:

```text
get_weather("Ho Chi Minh City")
```

again.

The tool returns the exact same result.

The LLM calls:

```text
get_weather("Ho Chi Minh City")
```

again.

And again.

And again.

---

# 3. Why Doesn't the Model Just Stop?

Because from the model's perspective, every generation is essentially another decision.

Conceptually:

```text
P(next_action | current_context)
```

The model doesn't have a magical runtime-level variable:

```text
agent.is_done = true
```

unless we explicitly design the system around such a concept.

The model only sees:

```text
messages
tools
tool results
instructions
```

and predicts what should happen next.

---

# 4. The Most Important Architectural Principle

An AI Agent should not be:

```text
LLM = Controller
```

It should be:

```text
LLM = Decision Maker
```

while:

```text
Orchestrator = Controller
```

This distinction is extremely important.

The LLM can decide:

```text
"I need to search the database."
```

But it should not be trusted to decide:

```text
"I am allowed to execute unlimited operations forever."
```

The runtime owns that decision.

---

# 5. Think of the LLM as an Untrusted Component

This is similar to distributed systems.

You wouldn't design:

```text
HTTP server
 ↓
client says:
"keep this connection open forever"
```

and blindly trust the client.

You establish:

```text
timeout
rate limit
maximum payload
connection limit
```

Agent execution should work similarly.

The LLM is powerful.

But it is still an untrusted decision-making component.

---

# 6. Add a Maximum Step Count

The simplest protection:

```text
MAX_STEPS = 20
```

Then:

```text
for step in range(MAX_STEPS):

    response = llm(messages)

    if response.has_final_answer():
        return response

    if response.has_tool_call():
        result = execute_tool(response.tool_call)
        messages.append(result)
```

After 20 steps:

```text
AgentExecutionLimitExceeded
```

This immediately solves infinite execution.

But it isn't enough.

---

# 7. Why a Global Step Limit Isn't Sufficient

Imagine an agent doing:

```text
1. search_user
2. search_orders
3. get_order
4. get_product
5. get_inventory
6. get_shipping
7. ...
```

Twenty steps may be completely legitimate.

Now imagine:

```text
1. get_weather(HCM)
2. get_weather(HCM)
3. get_weather(HCM)
4. get_weather(HCM)
...
```

Both executions consume the same step budget.

But their behavior is completely different.

So we need more than:

```text
total_steps
```

We need to understand:

```text
execution behavior
```

---

# 8. Detect Repeated Tool Calls

We can track tool invocations:

```text
tool_call_history = [
    ("get_weather", "Ho Chi Minh City"),
    ("get_weather", "Ho Chi Minh City"),
    ("get_weather", "Ho Chi Minh City")
]
```

Now we can detect:

```text
same tool
+
same arguments
+
same execution state
```

This is a strong signal of a loop.

For example:

```text
if same_call_repeated >= 3:
    stop_agent()
```

---

# 9. But There Is a Subtle Problem

Suppose the agent calls:

```text
search_orders(user_id=123)
```

three times.

Does that necessarily mean there is a loop?

Not always.

The database could have changed between calls.

For example:

```text
Call #1:
0 orders

Call #2:
1 order

Call #3:
2 orders
```

The repeated call is legitimate.

Therefore:

> **Repeated tool calls alone do not prove an infinite loop.**

We need to reason about state.

---

# 10. Detect Repeated State

A stronger concept is:

```text
same action
+
same relevant state
+
no meaningful progress
```

Suppose:

```text
Agent State A
    ↓
Tool Call X
    ↓
Result A
    ↓
Agent State A
```

The state didn't meaningfully change.

Then:

```text
A → X → A → X → A
```

is a cycle.

This is much closer to how we should think about agent loops.

---

# 11. Agents Are State Machines

A useful mental model is:

```text
                ┌──────────────┐
                │    START     │
                └──────┬───────┘
                       ▼
                ┌──────────────┐
                │   REASON     │
                └──────┬───────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       ┌───────────┐       ┌───────────┐
       │ TOOL CALL │       │   FINAL   │
       └─────┬─────┘       │  ANSWER   │
             │              └───────────┘
             ▼
       ┌───────────┐
       │ EXECUTE   │
       └─────┬─────┘
             │
             ▼
       ┌───────────┐
       │  OBSERVE  │
       └─────┬─────┘
             │
             └──────────► REASON
```

Once you model the agent as a state machine, many problems become much easier to reason about.

---

# 12. Define Explicit Agent States

For example:

```text
INIT
REASONING
WAITING_FOR_TOOL
EXECUTING_TOOL
OBSERVING
FINALIZING
COMPLETED
FAILED
TIMEOUT
```

Now the runtime can enforce legal transitions.

For example:

```text
REASONING
    ↓
WAITING_FOR_TOOL
    ↓
EXECUTING_TOOL
    ↓
OBSERVING
    ↓
REASONING
```

But:

```text
COMPLETED
    ↓
EXECUTING_TOOL
```

should be impossible.

This is much safer than letting the LLM control everything.

---

# 13. Tool Calling Is an External Side Effect

This becomes even more important when tools do things like:

```text
send_email()
create_payment()
delete_file()
create_invoice()
deploy_service()
```

Suppose the LLM repeats:

```text
send_email(user, "Your invoice is ready")
```

three times.

That's not merely an infinite loop.

That's a production incident.

The system might have:

```text
1 user
3 emails
```

because the model repeatedly decided that sending the email was necessary.

---

# 14. Idempotency Becomes Critical

For side-effecting tools, we should design for idempotency.

For example:

```text
create_payment(order_id=123)
```

should not blindly create another payment every time the same request is executed.

Instead:

```text
idempotency_key = hash(
    agent_execution_id,
    tool_name,
    normalized_arguments
)
```

The tool layer can enforce:

```text
same key
→
same operation
→
return previous result
```

rather than executing the side effect again.

---

# 15. Agent-Level Idempotency

Imagine:

```text
Agent Execution:
abc123
```

The model generates:

```text
send_email(
    recipient="user@example.com",
    subject="Invoice"
)
```

We generate:

```text
operation_id =
hash(
    abc123,
    send_email,
    normalized_arguments
)
```

Now the backend can enforce:

```text
operation_id already executed?
        │
    ┌───┴───┐
   YES      NO
    │        │
 return     execute
 result
```

This is classic distributed-systems thinking applied to AI agents.

---

# 16. Tool Calls Need Contracts

A tool should not simply be:

```text
function(anything)
```

It should have a strict contract.

For example:

```json
{
  "name": "create_ticket",
  "description": "Create a support ticket",
  "parameters": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string"
      },
      "priority": {
        "type": "string",
        "enum": [
          "low",
          "medium",
          "high"
        ]
      }
    },
    "required": [
      "title",
      "priority"
    ]
  }
}
```

The stronger the contract, the smaller the action space.

---

# 17. Tool Descriptions Are Part of System Design

This is an underrated point.

Suppose we expose:

```text
search()
```

with a vague description.

The model has to infer:

```text
what it does
when to use it
what it returns
when not to use it
```

A better tool description explicitly says:

```text
Use this tool when:
- the user asks about existing records
- the answer requires database information

Do not use this tool when:
- the question can be answered from the current context
- the user asks for general knowledge
```

Tool design is therefore partly prompt design.

---

# 18. But Prompting Alone Is Not Enough

A common response to agent loops is:

> "I'll tell the LLM not to call the tool twice."

That's useful.

But insufficient.

Because:

```text
Prompt
```

is a probabilistic instruction.

Whereas:

```text
Runtime constraint
```

is deterministic.

You want both.

```text
Prompt:
"Do not repeat a tool call if the result is already available."

Runtime:
"Maximum 3 identical calls."
```

Now you have:

```text
soft policy
+
hard safety boundary
```

---

# 19. Tool Result Caching

Another approach:

```text
tool(arguments)
```

is cached.

For example:

```text
get_weather("HCM")
```

returns:

```text
cache hit
```

on subsequent calls.

This doesn't necessarily solve the logical loop, but it can prevent:

```text
API abuse
cost explosion
latency
rate-limit exhaustion
```

However, caching must respect data freshness.

---

# 20. Cache Is Not a Loop Detector

This distinction matters.

Suppose:

```text
LLM
 ↓
get_weather(HCM)
 ↓
cache
 ↓
same result
 ↓
LLM
 ↓
get_weather(HCM)
 ↓
cache
 ↓
same result
```

The loop still exists.

It's just cheaper.

So:

```text
Caching
```

protects infrastructure.

While:

```text
Loop Detection
```

protects execution logic.

---

# 21. Tool Result Should Contain Execution Metadata

Instead of returning only:

```json
{
  "temperature": 31
}
```

the runtime can maintain internal metadata:

```json
{
  "tool": "get_weather",
  "arguments_hash": "abc123",
  "execution_id": "exec_001",
  "attempt": 2,
  "cached": true,
  "result": {
    "temperature": 31
  }
}
```

The LLM doesn't necessarily need all of this.

But the orchestrator does.

---

# 22. Progress Tracking

One powerful idea is to ask:

> **"Did this tool call move the agent closer to its goal?"**

Suppose the goal is:

```text
"Find all unpaid invoices for customer X."
```

The agent performs:

```text
search_customer
```

Progress:

```text
+1
```

Then:

```text
search_invoices
```

Progress:

```text
+1
```

Then:

```text
search_customer
```

again.

Progress:

```text
0
```

If the agent keeps performing actions with:

```text
progress = 0
```

we can detect stagnation.

---

# 23. Define a Progress Function

Conceptually:

```text
progress =
f(
    previous_state,
    current_state,
    goal
)
```

For example:

```text
previous_state:
customer_found = false

current_state:
customer_found = true
```

Then:

```text
progress = positive
```

But:

```text
previous_state:
customer_found = true

current_state:
customer_found = true
```

gives:

```text
progress = zero
```

Now the orchestrator has a signal.

---

# 24. The Agent's Goal Should Be Explicit

This is another subtle architectural issue.

Bad:

```text
messages only
```

Better:

```text
execution_goal
constraints
current_state
available_tools
```

For example:

```json
{
  "goal": "Find the user's unpaid invoices",
  "constraints": {
    "max_steps": 12,
    "max_cost_usd": 0.05
  }
}
```

Now the runtime knows what successful completion means.

---

# 25. Goal Completion Should Be Deterministic Where Possible

Suppose the goal is:

```text
"Find unpaid invoices."
```

The system shouldn't necessarily rely on the LLM saying:

```text
"I'm done."
```

Instead, the orchestrator can validate:

```text
invoice_results_received = true
```

Then:

```text
Agent → FINALIZING
```

This is much safer.

---

# 26. Separate Planning From Execution

Another strong architecture:

```text
                 LLM
                  │
                  ▼
               Planner
                  │
                  ▼
            Execution Plan
                  │
                  ▼
             Orchestrator
                  │
          ┌───────┼────────┐
          ▼       ▼        ▼
        Tool A  Tool B   Tool C
```

The LLM proposes:

```text
1. Find customer
2. Find invoices
3. Filter unpaid
```

The runtime executes the plan.

Now we can validate:

```text
maximum steps
allowed tools
dependencies
side effects
```

before execution.

---

# 27. But Static Plans Have a Problem

Real environments change.

Suppose:

```text
Plan:
1. Find customer
2. Find invoices
3. Send email
```

Then step 2 returns:

```text
No unpaid invoices.
```

Step 3 is no longer necessary.

Therefore, fully static planning can be brittle.

A better approach is often:

```text
plan
 ↓
execute
 ↓
observe
 ↓
re-plan
```

This is effectively a feedback loop.

---

# 28. Re-Planning Needs Boundaries

The loop becomes:

```text
PLAN
 ↓
ACT
 ↓
OBSERVE
 ↓
PLAN
 ↓
ACT
```

Again, without constraints:

```text
∞
```

So we need:

```text
max_iterations
max_tool_calls
max_cost
max_duration
max_repeated_action
```

---

# 29. Cost Is a First-Class Constraint

Suppose one agent request can call:

```text
GPT-class model
+
web search
+
database
+
embedding API
+
reranker
```

One runaway execution can become expensive.

Therefore:

```text
execution_budget
```

should be explicit.

For example:

```json
{
  "max_steps": 15,
  "max_duration_ms": 30000,
  "max_llm_tokens": 20000,
  "max_tool_calls": 10,
  "max_cost_usd": 0.10
}
```

Now the agent is operating inside a bounded resource envelope.

---

# 30. This Is Similar to Distributed Systems

This is where AI Agent engineering becomes interesting.

An agent execution has:

```text
state
transitions
side effects
timeouts
retries
budgets
failures
idempotency
observability
```

These are classic distributed-system problems.

The LLM is only one component.

The rest is systems engineering.

---

# 31. What Happens If a Tool Times Out?

Suppose:

```text
LLM
 ↓
database_tool
 ↓
timeout
```

What should happen?

Naive implementation:

```text
retry forever
```

Bad.

Better:

```text
retry_count < max_retry
```

For example:

```text
attempt 1 → timeout
attempt 2 → timeout
attempt 3 → timeout
             ↓
        tool failure
```

Then the agent decides whether to:

```text
fallback
continue
ask user
terminate
```

---

# 32. Retries Can Create Duplicate Side Effects

Consider:

```text
charge_card()
```

Request succeeds.

But the response is lost:

```text
Server:
payment succeeded

Network:
response lost
```

The orchestrator sees:

```text
timeout
```

and retries.

Now:

```text
charge_card()
charge_card()
```

Potentially:

```text
double charge
```

This is why:

> **Retries + side effects require idempotency.**

This isn't unique to AI.

AI just makes the decision path more dynamic.

---

# 33. Tool Failure Should Become Structured Data

Don't simply return:

```text
"Error"
```

Prefer:

```json
{
  "success": false,
  "error": {
    "code": "DATABASE_TIMEOUT",
    "retryable": true,
    "message": "Database request timed out."
  }
}
```

Now the LLM can reason:

```text
retryable = true
```

instead of guessing.

---

# 34. Never Let the LLM Guess Infrastructure State

Bad:

```text
Tool failed.
LLM:
"Maybe the database is down."
```

Better:

```json
{
  "success": false,
  "error": {
    "code": "DATABASE_TIMEOUT",
    "retryable": true
  }
}
```

The orchestrator already knows the operational state.

Expose structured facts rather than forcing the model to infer them.

---

# 35. The Tool Layer Should Be Defensive

Never assume:

```text
LLM-generated arguments
```

are safe.

Validate:

```text
schema
permissions
resource ownership
limits
business rules
```

For example:

```text
delete_user(user_id)
```

must verify:

```text
Does this agent have permission?
Does this user exist?
Is deletion allowed?
Does policy permit this operation?
```

The LLM should never be the authorization layer.

---

# 36. Authorization Must Exist Outside the Model

This is a critical Senior-level principle.

Never rely on:

```text
System prompt:
"You are not allowed to delete administrators."
```

as the only protection.

Instead:

```text
LLM
 ↓
Tool Call
 ↓
Authorization Layer
 ↓
Policy Check
 ↓
Tool
```

The model can request an operation.

The backend decides whether it is allowed.

---

# 37. Tool Calling Is Similar to an API Gateway

Think about a normal API:

```text
Client
 ↓
API Gateway
 ↓
Authentication
 ↓
Authorization
 ↓
Rate Limit
 ↓
Service
```

An agent should have something similar:

```text
LLM
 ↓
Agent Gateway
 ↓
Schema Validation
 ↓
Authorization
 ↓
Budget Check
 ↓
Loop Detection
 ↓
Rate Limit
 ↓
Tool
```

This gives us a very useful abstraction:

> **The agent orchestrator is effectively a control plane for model-generated actions.**

---

# 38. A Production Architecture

A stronger design might look like:

```text
                         ┌──────────────┐
                         │     User     │
                         └──────┬───────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Agent Runtime   │
                       └────────┬────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
              ┌──────────┐            ┌──────────┐
              │   LLM    │            │  State   │
              └────┬─────┘            │  Store   │
                   │                  └──────────┘
                   ▼
              Tool Request
                   │
                   ▼
          ┌───────────────────┐
          │ Tool Gateway      │
          │                   │
          │ Schema Validation │
          │ Authorization     │
          │ Rate Limit        │
          │ Budget Check      │
          │ Loop Detection    │
          │ Idempotency       │
          └─────────┬─────────┘
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Database   Search     API
```

This is much closer to something you could actually deploy.

---

# 39. The Agent Runtime Should Own Termination

The runtime can terminate because:

```text
goal_completed
```

or:

```text
max_steps_exceeded
```

or:

```text
timeout
```

or:

```text
budget_exceeded
```

or:

```text
loop_detected
```

or:

```text
policy_violation
```

or:

```text
tool_failure
```

The LLM can recommend:

```text
final answer
```

but the runtime makes the final execution decision.

---

# 40. A Simple Execution State

Conceptually:

```typescript
interface AgentExecution {
  id: string;

  goal: string;

  stepCount: number;

  toolCallCount: number;

  startedAt: number;

  status:
    | "running"
    | "completed"
    | "failed"
    | "timeout"
    | "budget_exceeded"
    | "loop_detected";

  history: AgentEvent[];

  budget: {
    maxSteps: number;
    maxToolCalls: number;
    maxDurationMs: number;
    maxTokens: number;
  };
}
```

The important thing isn't the exact TypeScript.

It's that:

> **Execution state exists independently from the LLM.**

---

# 41. Agent Events

Instead of storing only chat messages:

```text
user
assistant
tool
assistant
```

a production runtime may record:

```text
AgentStarted
LLMRequested
LLMResponded
ToolRequested
ToolStarted
ToolCompleted
ToolFailed
StateUpdated
BudgetExceeded
AgentCompleted
```

Now you have an event stream.

This makes debugging significantly easier.

---

# 42. Event Sourcing Can Be Useful

For complex agents:

```text
AgentStarted
     ↓
ToolRequested
     ↓
ToolCompleted
     ↓
LLMResponded
     ↓
ToolRequested
```

can form an append-only execution log.

Then the state can be reconstructed from events.

This gives you:

```text
replay
debugging
auditing
observability
recovery
```

But don't automatically implement full event sourcing for every tiny agent.

Use it when execution complexity justifies it.

---

# 43. The Important Trade-Off

At Senior level, the answer shouldn't be:

> "Use event sourcing."

The answer should be:

> "The runtime needs durable execution state and observable transitions. Event sourcing is one possible implementation if replay, auditing, or recovery requirements justify the complexity."

That's the difference between:

```text
knowing a technology
```

and:

```text
knowing when to use a technology
```

---

# 44. What If the LLM Keeps Making Bad Decisions?

Suppose the model repeatedly chooses:

```text
search_database()
```

even though the database result isn't helping.

The runtime detects:

```text
stagnation
```

Then instead of simply failing, it can modify the execution strategy.

For example:

```text
Agent:
"Search again."

Runtime:
"You have repeated this action without progress.
You must either use a different tool or finalize."
```

This is a form of runtime feedback.

---

# 45. But Be Careful With Runtime Messages

We don't want to blindly inject:

```text
"STOP!"
```

into the conversation.

A better structured message might be:

```json
{
  "type": "runtime_constraint",
  "code": "REPEATED_ACTION",
  "message": "The previous tool call produced no new information.",
  "allowed_next_actions": [
    "use_different_tool",
    "finalize"
  ]
}
```

Now the model receives a structured constraint.

---

# 46. Dynamic Tool Availability

Another powerful technique:

If the agent has already used:

```text
search_database
```

and got no useful result, the runtime can temporarily remove or deprioritize that tool.

For example:

```text
Available Tools:

search_database
  status: exhausted

search_web
  status: available

ask_user
  status: available
```

This reduces the action space.

---

# 47. Action Space Is a Major Agent Design Problem

Suppose the agent has:

```text
50 tools
```

The model must select among many possibilities.

This increases:

```text
decision complexity
```

Instead of exposing everything:

```text
50 tools
```

you can dynamically expose:

```text
5 relevant tools
```

based on:

```text
intent
permissions
current state
task type
```

This is similar to routing.

---

# 48. Tool Selection Is Retrieval

There's an interesting connection here.

Traditional RAG retrieves:

```text
documents
```

Agent systems can also retrieve:

```text
tools
```

Instead of:

```text
Query
 ↓
Documents
```

you can have:

```text
Task
 ↓
Relevant Tools
 ↓
LLM
```

This becomes increasingly useful as the number of tools grows.

---

# 49. A Tool Router

Conceptually:

```text
User Task
    │
    ▼
Tool Router
    │
    ├── Database tools
    ├── Search tools
    ├── Communication tools
    └── File tools
```

The LLM then sees only what it actually needs.

This can improve:

```text
tool selection
latency
prompt size
safety
```

---

# 50. The Interview Trap

The interviewer may ask:

> **"Would you solve the infinite loop by changing the system prompt?"**

A weak answer:

> "Yes, I'd tell the model not to repeat itself."

A stronger answer:

> "I'd use prompting as a behavioral hint, but I wouldn't rely on it as a safety mechanism. The orchestrator should enforce hard execution limits such as maximum steps, duration, tool calls, repeated-action detection, and budget constraints. For side-effecting tools, I'd also enforce idempotency and authorization outside the model."

That's the answer that demonstrates system-design maturity.

---

# 51. Another Interview Trap

> **"If the model is smart enough, why do we need an orchestrator?"**

Because intelligence doesn't replace deterministic execution guarantees.

The LLM is good at:

```text
ambiguity
language
reasoning
planning
tool selection
```

The runtime is good at:

```text
limits
state
authorization
timeouts
retries
idempotency
resource management
termination
```

These are complementary responsibilities.

---

# 52. Another Hard Question

> **"Should the LLM control retries?"**

Generally:

```text
No.
```

The infrastructure layer should determine:

```text
retryable
retry count
backoff
timeout
```

The LLM may decide:

```text
"Try another strategy."
```

But it shouldn't directly control:

```text
retry 500 times
```

---

# 53. Another Hard Question

> **"Should the agent be allowed to call any tool at any time?"**

Usually:

```text
No.
```

Tool availability should depend on:

```text
authorization
task
current state
risk level
budget
environment
```

For example:

```text
read_database
```

might be available automatically.

But:

```text
delete_database
```

may require:

```text
human approval
```

---

# 54. Human-in-the-Loop

High-risk operations can transition to:

```text
WAITING_FOR_APPROVAL
```

For example:

```text
Agent
 ↓
"I want to refund $5,000"
 ↓
Policy Engine
 ↓
High-risk operation
 ↓
Human Approval
 ↓
Execute
```

The LLM never gets direct authority over the side effect.

---

# 55. Agent Architecture Is Ultimately About Control

The deepest lesson from this case study isn't actually about loops.

It's about:

> **Control boundaries.**

Ask:

```text
Who decides what?
Who validates it?
Who executes it?
Who can stop it?
Who owns state?
Who owns authorization?
Who owns resource limits?
```

If the answer to all of these is:

```text
"The LLM"
```

you probably have an unsafe architecture.

---

# 56. The Senior-Level Design

A good mental model is:

```text
                 ┌─────────────────────┐
                 │       LLM           │
                 │                     │
                 │ Reason              │
                 │ Plan                │
                 │ Select tool         │
                 │ Interpret result    │
                 └──────────┬──────────┘
                            │
                       proposal
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Agent Runtime     │
                 │                     │
                 │ State               │
                 │ Budget              │
                 │ Loop Detection      │
                 │ Authorization       │
                 │ Policy              │
                 │ Timeout             │
                 │ Retry               │
                 │ Idempotency         │
                 │ Termination         │
                 └──────────┬──────────┘
                            │
                         execute
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Tools         │
                 └─────────────────────┘
```

The LLM proposes.

The runtime decides.

The tool executes.

---

# 57. The Interview Answer

If an interviewer asks:

> **"Your AI agent keeps calling the same tool forever. How would you fix it?"**

A strong Senior answer would be:

> "I wouldn't treat it as purely an LLM problem. An agent is an execution system, so the orchestrator should own its lifecycle and termination conditions.
>
> First, I'd add hard execution boundaries: maximum steps, tool calls, duration, token usage, and cost. Then I'd track tool-call history and detect repeated actions, preferably combined with state or progress detection rather than simply counting identical calls.
>
> For side-effecting tools, I'd add idempotency keys because retrying or repeating an operation can create real-world duplicates. Tool execution should also be protected by schema validation, authorization, rate limiting, and policy checks outside the model.
>
> I'd use the system prompt to encourage the model not to repeat actions, but I wouldn't rely on prompting as the safety mechanism. The runtime should be deterministic and capable of terminating the execution even when the model behaves incorrectly.
>
> Finally, I'd make the execution observable through structured events so we can distinguish whether the problem came from model reasoning, tool selection, tool failure, state management, or the orchestration layer."

---

# 58. The Deeper Follow-Up

If the interviewer continues:

> **"What if the agent doesn't repeat the exact same tool call, but keeps making different calls without making progress?"**

Now the problem becomes harder.

For example:

```text
search_customer()
        ↓
search_orders()
        ↓
search_products()
        ↓
search_customer()
        ↓
search_orders()
        ↓
search_products()
```

No exact call repeats consecutively.

A naive loop detector may miss it.

The correct abstraction is:

```text
stagnation
```

rather than:

```text
duplicate call
```

We need to track:

```text
state
goal
observations
progress
```

and ask:

> **"Is the agent's state converging toward the goal?"**

If not:

```text
stagnation detected
```

Then terminate, re-plan, or ask the user.

---

# 59. This Is Where Agent Engineering Gets Interesting

A naive agent is:

```text
LLM
+
Tools
```

A production agent is closer to:

```text
LLM
+
State Machine
+
Policy Engine
+
Tool Gateway
+
Memory
+
Budget Manager
+
Observability
+
Failure Recovery
```

And suddenly:

> **AI Agent Engineering starts looking a lot like distributed systems engineering.**

That's not a coincidence.

The moment an LLM can autonomously interact with external systems, you inherit many of the same problems:

```text
state
failure
retry
timeout
consistency
idempotency
authorization
resource limits
observability
recovery
```

---

# Final Takeaways

```text
1. An LLM should not own the agent's execution lifecycle.

2. The orchestrator should own state and termination.

3. Prompting is a behavioral mechanism, not a safety boundary.

4. Always enforce hard execution limits.

5. Detect repeated actions, but don't confuse repetition with loops.

6. Detect stagnation by evaluating state and progress.

7. Side-effecting tools require idempotency.

8. Tool execution must enforce authorization outside the LLM.

9. Retries should be controlled by infrastructure.

10. Tool failures should be represented as structured data.

11. Agent execution should have explicit budgets.

12. Dynamic tool selection can reduce the agent's action space.

13. High-risk operations may require human approval.

14. Observability should capture the complete execution lifecycle.

15. The LLM proposes actions.

16. The runtime validates and controls them.

17. Tools execute them.

18. The system—not the model—decides when execution ends.
```

---

# One Sentence to Remember

> **An LLM can decide what it wants to do, but a production agent must have a deterministic runtime that decides what it is allowed to do and when it must stop.**