---

title: "CASE STUDY: 110M Clickstream Events — What Actually Happens Between View, Cart, Remove, and Purchase?"
slug: "case-study-ecommerce-behavior-data-from-multi-category-store"
date: "2026-08-30"
author: "Quan Van"
excerpt: "I started with 109.9M e-commerce events and a simple question: can raw clickstream data tell us where customer intent breaks — and can we turn those observations into behavioral personas, Markov journeys, and a CEO-level what-if simulator?"
tags: ["Data Analytics", "Clickstream", "DuckDB", "Markov Chain", "Behavioral Segmentation", "Business Intelligence", "Simulation", "Next.js"]
category: "Data & Business Strategy"
------------------------------------

# CASE STUDY: 110M Clickstream Events — What Actually Happens Between View, Cart, Remove, and Purchase?

> **The question I actually wanted to answer:**
>
> **When millions of customers interact with an e-commerce store, where does purchase intent actually break — and can we model those behavioral transitions well enough to turn the analysis into a decision-support system?**

---

## 1. I Didn't Want Another E-Commerce Dashboard

There is a very easy way to analyze an e-commerce dataset.

Count the views.

Count the carts.

Count the purchases.

Calculate conversion rate.

Make a few charts.

Done.

But that doesn't really answer the interesting question.

A conversion funnel tells me **what happened**.

It doesn't necessarily tell me **how customers moved between states before that happened**.

And once I started looking at the event structure of this dataset, that distinction became important.

The raw data contains events such as:

```text
VIEW
CART
REMOVE_FROM_CART
PURCHASE
```

along with:

```text
event_time
product_id
category_id
category_code
brand
price
user_id
user_session
```

So instead of asking:

> "What is the conversion rate?"

I wanted to ask something more fundamental:

> **"What does a customer journey actually look like as a sequence of state transitions?"**

That question pushed the project beyond a traditional BI dashboard.

---

# 2. The Dataset Is Big Enough to Force an Engineering Decision

The dataset covers **October 1 → November 30, 2019** and contains:

* **109,949,743 clickstream events**
* **5,316,649 unique users**
* **23,016,650 unique sessions**
* **206,876 SKUs**
* **4,303 brands**
* **1,659,788 purchase events**
* approximately **$505.15M in gross purchase value**

The raw CSV footprint is approximately **13.7 GB**.

And this immediately creates a deployment problem.

I wanted the final result to be a real website.

Not a Jupyter notebook.

Not a local Streamlit application.

Not a dashboard that requires the recruiter to download 13 GB of CSV files.

The final application needed to run on **Vercel**.

So the architecture became:

```text
                 RAW CSV
                   │
                   │ 13.7 GB
                   ▼
             DuckDB / Python
                   │
                   │ heavy SQL
                   ▼
            Analytical Layer
                   │
                   │ pre-aggregation
                   ▼
             Static JSON
                   │
                   │ ~35 KB
                   ▼
             Next.js / Vercel
                   │
                   ▼
              Interactive UI
```

That decision is actually one of the most important parts of the project.

The website doesn't need the raw dataset.

It needs the **knowledge extracted from the dataset**.

---

# 3. The First Problem: The Funnel Looks Healthy Until You Change the Granularity

At event level, the dataset is overwhelmingly dominated by browsing behavior.

```text
EVENT VOLUME

VIEW
104,335,509
94.89%

CART
3,955,446
3.60%

PURCHASE
1,659,788
1.51%
```

At first glance, this seems straightforward.

But then I calculated conversion at different granularities.

```text
Event-level conversion       1.59%

Session-level conversion     6.10%

User-level conversion       13.12%
```

And cart abandonment was:

```text
59.41%
```

or:

```text
2,316,433 sessions
with cart additions

        ↓

1,376,213
did not reach purchase
```

This is where the analysis became more interesting.

The number itself is not the insight.

The real question is:

> **What happens between "I added something to my cart" and "I actually purchased it"?**

A single funnel percentage hides that journey.

So I stopped treating the customer as a number and started treating the customer journey as a **state machine**.

---

# 4. From Funnel to State Machine

I defined five behavioral states:

```text
VIEW
CART
REMOVE
PURCHASE
EXIT
```

The first four come from observed event behavior.

`EXIT` is a derived terminal state representing the end of a session.

This distinction matters.

There is no literal:

```text
event_type = "exit"
```

in the dataset.

So EXIT is an analytical construct, not an observed event.

That state definition is documented explicitly in the methodology rather than silently pretending that the raw data contained an exit event.

---

# 5. The Markov Question

Once the journey is represented as states, a different question becomes possible:

> **Given that a customer is currently in state X, what is the probability that the next meaningful state is Y?**

That gives us a transition matrix:

$$
P_{ij}=P(S_{t+1}=j\mid S_t=i)
$$

For this analysis:

```text
S = {
    VIEW,
    CART,
    REMOVE,
    PURCHASE,
    EXIT
}
```

The resulting baseline matrix was:

| Source   |   VIEW |       CART |     REMOVE |    PURCHASE |        EXIT |
| -------- | -----: | ---------: | ---------: | ----------: | ----------: |
| VIEW     | 62.10% | **18.42%** |      0.00% |       0.00% |  **19.48%** |
| CART     | 20.10% |     20.15% | **21.85%** |  **30.90%** |       7.00% |
| REMOVE   | 35.40% |     10.20% |      4.80% |       4.60% |  **45.00%** |
| PURCHASE |  0.00% |      0.00% |      0.00% | **100.00%** |       0.00% |
| EXIT     |  0.00% |      0.00% |      0.00% |       0.00% | **100.00%** |

Every row is normalized:

$$
\sum_j P_{ij}=1
$$

And suddenly the funnel started telling a much more interesting story.

---

# 6. The Interesting Part Isn't "30.9% Purchase"

The obvious number is:

```text
CART → PURCHASE = 30.90%
```

But the more interesting number to me was:

```text
CART → REMOVE = 21.85%
```

and then:

```text
REMOVE → EXIT = 45.00%
```

That means cart abandonment isn't necessarily one giant jump from:

```text
CART → EXIT
```

There is an intermediate behavioral state:

```text
CART
 ↓
REMOVE
 ↓
EXIT
```

That is a different business problem.

The user didn't simply disappear.

They interacted with the cart.

They removed something.

And then a large fraction of those sessions terminated.

That doesn't prove **why** they left.

There is no field saying:

```text
reason = "shipping too expensive"
```

or:

```text
reason = "price shock"
```

But it gives us a measurable **behavioral friction signal**.

That's the distinction I wanted this project to preserve.

---

# 7. I Didn't Want to Invent Customer Personas

This was another place where I deliberately avoided a common BI shortcut.

I could have written:

```text
Sarah
27 years old
Female
Lives in New York
Price-sensitive
```

But none of those attributes exist in the dataset.

So why pretend they do?

Instead, I defined personas from observable behavior.

The persona is not:

> "Who is this person?"

It is:

> **"How does this user behave?"**

That led to behavioral archetypes such as:

### The Window Shopper

High browsing volume with little or no purchase intent.

### The Hesitant Buyer

High cart activity combined with elevated removal behavior.

### The Intent Shopper

Shorter browsing path and substantially stronger conversion behavior.

### The Explorer

Deep browsing across the catalog without proportional purchase conversion.

### The Focused Buyer

Low browsing depth but high purchase efficiency.

### The Heavy Browser

Very high session depth with weak conversion.

These labels are not demographic identities.

They are business-friendly names attached to measurable behavioral signatures.

The current segmentation produced six major archetypes:

| Persona        | Share | Median Views | Median Carts | Removal Rate | Conversion |
| -------------- | ----: | -----------: | -----------: | -----------: | ---------: |
| Window Shopper | 64.2% |            6 |            0 |         0.0% |       0.0% |
| Hesitant Buyer | 12.3% |           14 |            3 |        46.8% |       3.9% |
| Intent Shopper |  9.2% |            4 |            2 |         8.2% |      24.8% |
| Explorer       |  5.6% |           18 |            1 |        35.0% |       1.2% |
| Focused Buyer  |  5.3% |            2 |            1 |         2.1% |      39.1% |
| Heavy Browser  |  3.4% |           26 |            2 |        42.1% |       1.1% |

The important thing isn't the names.

The important thing is that the behavioral distributions are radically different.

A user generating 26 median views and converting at 1.1% is behaving fundamentally differently from someone generating 2 median views and converting at 39.1%.

That difference is actionable.

---

# 8. Persona → Journey

Once personas existed, I could ask another question:

> **Do different behavioral archetypes actually move through the store differently?**

For example, conceptually:

```text
WINDOW SHOPPER

VIEW
 ↓
VIEW
 ↓
VIEW
 ↓
EXIT
```

versus:

```text
INTENT SHOPPER

VIEW
 ↓
VIEW
 ↓
CART
 ↓
PURCHASE
```

versus:

```text
HESITANT BUYER

VIEW
 ↓
VIEW
 ↓
CART
 ↓
REMOVE
 ↓
VIEW
 ↓
EXIT
```

The point is not to create pretty flow diagrams.

The point is to connect:

```text
WHO behaves this way?
        ↓
WHAT do they do?
        ↓
WHERE does the journey break?
```

That creates a much stronger bridge between analytics and business interpretation.

---

# 9. From Analytics to Business Opportunities

At this point I had:

```text
Events
 ↓
Sessions
 ↓
Behavioral features
 ↓
Personas
 ↓
Journeys
 ↓
Transition probabilities
```

But a CEO doesn't ultimately need a Markov matrix.

A CEO needs to know:

> **"What should we test?"**

So I added another layer:

```text
Behavioral Evidence
        ↓
Potential Friction
        ↓
Business Opportunity
        ↓
Possible Intervention
```

For example:

```text
High CART → REMOVE
        +
High REMOVE → EXIT
        ↓
Potential cart-stage friction
        ↓
Test interventions that reduce
cart abandonment
```

Notice the wording.

I call it:

> **Potential friction**

not:

> "We proved users abandon because of price."

Because we didn't.

The dataset can reveal behavior.

It cannot magically reveal causality.

---

# 10. This Is Where the CEO Simulator Came From

I wanted the project to answer one more question.

Suppose the historical model says:

```text
P(CART | VIEW) = 18.42%
```

What happens mathematically if we ask:

> **"What if this transition improved by 10%?"**

That became the `/simulator` page.

The simulator allows a stakeholder to select:

```text
Target Persona
        ↓
Intervention
        ↓
Relative Lift
        ↓
Simulated Outcome
```

For example:

```text
Target:
Hesitant Buyer

Intervention:
Reduce CART → REMOVE

Lift:
10%
```

The application then modifies the transition matrix and recomputes the downstream scenario.

---

# 11. The Probability Problem

There is a subtle mathematical problem here.

Imagine:

```text
VIEW

CART = 0.20
VIEW = 0.50
EXIT = 0.30
```

Now someone says:

> Increase VIEW → CART by 20%.

That produces:

```text
0.20 × 1.20 = 0.24
```

But now the row sums to:

```text
0.24 + 0.50 + 0.30 = 1.04
```

That's not a probability distribution anymore.

So the simulator needs an explicit redistribution policy.

I used proportional redistribution.

If:

$$
p_t' = \min(p_t(1+\Delta),1)
$$

then the remaining probability mass is redistributed across competing transitions:

$$
p_i'=
\frac{p_i}
{\sum_{k\neq t}p_k}
(1-p_t')
$$

This guarantees:

```text
0 ≤ p ≤ 1

and

ΣP = 1
```

This sounds like a small implementation detail.

It isn't.

It is the difference between:

> "I built a slider."

and:

> **"I built a mathematically constrained scenario engine."**

---

# 12. Observed ≠ Inferred ≠ Simulated

This became one of the most important design principles of the project.

I separated the system into three tiers.

```text
┌─────────────────────────────────────┐
│ TIER 1 — OBSERVED                   │
│                                     │
│ Raw historical behavior              │
│ 109.9M events                       │
│ actual purchases                    │
│ actual sessions                     │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│ TIER 2 — INFERRED                   │
│                                     │
│ Personas                            │
│ Behavioral journeys                 │
│ Markov transition probabilities     │
│ Behavioral friction signals         │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│ TIER 3 — SIMULATED                  │
│                                     │
│ What-if interventions               │
│ Probability redistribution          │
│ Scenario outcomes                   │
└─────────────────────────────────────┘
```

This distinction matters because it prevents a very common analytical mistake:

```text
Observed correlation
        ↓
"Cause"
        ↓
Business recommendation
```

I don't want to do that.

Instead:

```text
Observed behavior
        ↓
Inference / hypothesis
        ↓
Scenario
        ↓
Potential experiment
```

That is much more honest.

---

# 13. The Simulator Is Not a Forecasting Model

This also needs to be said very clearly.

If the simulator says:

```text
Baseline purchases:
100,000

Scenario:
+10% transition lift

Simulated purchases:
108,400
```

that does **not** mean:

> "The company will get 8,400 more purchases."

It means:

> **Under the specified transition assumptions, the mathematical model produces 8,400 additional simulated purchases.**

Those are fundamentally different claims.

The simulator is therefore a:

> **Decision-support and scenario-analysis tool**

not a causal inference engine.

Not a production forecasting system.

Not a guarantee of business impact.

---

# 14. There Is Another Interesting Layer: Merchandise Concentration

Customer behavior is only one side of the story.

The other side is what customers are actually buying.

The dataset shows strong concentration:

```text
electronics.smartphone
≈ 68% of store revenue
```

The top ~5% of products account for approximately:

```text
72% of revenue
```

And Apple alone contributes approximately:

```text
41% of store revenue
```

while Xiaomi receives substantial viewing activity but shows a lower overall conversion rate of around:

```text
1.1%
```

This changes the business interpretation.

A product with:

```text
high traffic
+
low conversion
```

is not automatically a bad product.

It may be:

```text
high awareness
+
high consideration
+
high friction
```

The event data cannot tell me the exact reason.

But it tells me where the business should ask the next question.

That is much more useful than simply ranking products by revenue.

---

# 15. Price Is Another Friction Signal

Cart removal is not evenly distributed across price bands.

The analysis found the highest removal concentration in the:

```text
$300–$700
```

upper-mid price range.

The removal rate there was approximately **28% higher** than for items below $50.

Again:

I am not saying:

> "Customers remove $300–$700 products because they are too expensive."

That would be causal overreach.

The correct interpretation is:

> **Higher-priced products in this band exhibit stronger cart-removal behavior, making the segment a candidate for further investigation.**

Potential follow-up questions would require additional data:

```text
Was there a discount?
Was shipping expensive?
Was stock available?
Was there a competitor price?
Was payment financing available?
Was the product returned frequently?
```

The current dataset cannot answer those questions.

---

# 16. What This Dataset Cannot Tell Me

A good analysis should also know when to stop.

This dataset covers only:

```text
October → November 2019
```

So I cannot responsibly claim:

* long-term customer lifetime value
* multi-year retention
* annual churn
* true cohort LTV
* long-term customer loyalty

There are also no reliable order-level identifiers or profit-margin fields for full financial modeling.

So:

```text
Revenue ≠ Profit
Purchase Value ≠ Margin
```

And the simulator does not establish causality.

These are not minor footnotes.

They define the boundary of what the system is allowed to claim.

---

# 17. What I Would Ask the Business to Collect Next

Interestingly, one of the most valuable outputs of this analysis is not another chart.

It is a **data roadmap**.

If I were working with the actual business, I would want:

```text
order_id
quantity
discount
coupon
shipping_fee
payment_method
inventory_status
checkout_events
marketing_source
campaign_id
device
geography
returns
refunds
margin
```

Why?

Because each missing field unlocks another business question.

For example:

```text
Cart Removal
      ↓
Need to know WHY
      ↓
shipping_fee
discount
inventory
payment_method
competitor_price
```

The analytical process therefore becomes:

```text
What do we know?
        ↓
What don't we know?
        ↓
What decision is blocked?
        ↓
What data would unlock it?
```

That is where analytics starts becoming business intelligence.

---

# 18. Engineering the Final Product

The final architecture deliberately separates the heavy analytical workload from the web application.

```text
13.7 GB Raw CSV
       │
       ▼
DuckDB
       │
       ├── Funnel aggregates
       ├── User/session features
       ├── Persona profiles
       ├── Journey sequences
       ├── Markov matrices
       └── Business opportunities
       │
       ▼
Small static JSON artifacts
       │
       ▼
Next.js
       │
       ├── Overview
       ├── Funnel
       ├── Customers
       ├── Brands
       ├── Products
       ├── Journey
       ├── Opportunities
       └── CEO Simulator
       │
       ▼
Vercel
```

The browser never needs to know that the original dataset was 13.7 GB.

It receives the analytical result.

That makes the system:

```text
Heavy offline computation
+
Lightweight production delivery
+
Client-side scenario simulation
```

This is the architecture that makes the project deployable rather than just analytically impressive.

---

# 19. What I Actually Built

At the end, the project is no longer simply:

> **"E-commerce data analysis."**

It becomes:

```text
RAW CLICKSTREAM
       ↓
DATA ENGINEERING
       ↓
BEHAVIORAL ANALYTICS
       ↓
SEGMENT DISCOVERY
       ↓
PERSONAS
       ↓
CUSTOMER JOURNEYS
       ↓
MARKOV STATE MODEL
       ↓
BUSINESS OPPORTUNITIES
       ↓
INTERVENTION SCENARIOS
       ↓
CEO SIMULATOR
```

The interesting part is that every layer answers a different question.

### Layer 1

**What happened?**

### Layer 2

**How do customers behave differently?**

### Layer 3

**Where does the journey break?**

### Layer 4

**How do those states transition?**

### Layer 5

**Where might the business have an opportunity?**

### Layer 6

**What would happen under a hypothetical intervention?**

That's the progression I wanted.

---

# 20. What I Learned

The first lesson was not about DuckDB.

It was about **changing the unit of analysis**.

At first:

```text
event
```

Then:

```text
session
```

Then:

```text
user
```

Then:

```text
behavioral segment
```

And finally:

```text
state transition
```

Every change in granularity revealed something different.

The second lesson was that a dashboard is often only the final presentation layer.

The real work happens before the chart:

```text
definition
→ cleaning
→ aggregation
→ feature engineering
→ modeling
→ validation
→ interpretation
→ deployment
```

The third lesson was probably the most important:

> **A good analytical system should tell you not only what the data says, but also what the data does NOT say.**

That's why I explicitly separated:

```text
OBSERVED
INFERRED
SIMULATED
```

The fourth lesson was architectural.

Processing 110M events and deploying the result are two different problems.

DuckDB solves the first.

Pre-computation solves the second.

Next.js/Vercel solves the delivery layer.

And the simulator sits on top of the resulting behavioral model rather than touching the raw data.

---

# 21. Final Takeaway

The most interesting thing I found in this project was not the **109.9M events**.

It was the realization that an e-commerce event stream can be treated as a behavioral system.

Instead of:

```text
View
Cart
Purchase
```

as three independent counters, we can model:

```text
VIEW
  ↓
CART
  ├── PURCHASE
  ├── REMOVE
  ├── VIEW
  └── EXIT
```

Then ask:

```text
Who behaves like this?
        ↓
How often does it happen?
        ↓
Where does the journey break?
        ↓
Which behavioral segment is affected?
        ↓
What business opportunity might exist?
        ↓
What intervention could be tested?
        ↓
What does the scenario model say?
```

That is the difference between:

> **building a dashboard**

and

> **building a behavioral intelligence system.**

And ultimately, that was the goal of this case study.

---

## Live Application

**Analytics Platform:**
https://e-commerce-behavior-data-from-multi.vercel.app/

**Repository:**
https://github.com/pomagrenate/eCommerce-behavior-data-from-multi-category-store

---

## Methodological Disclaimer

This project is an analytical exploration of historical clickstream behavior.

Behavioral personas and Markov transitions are **inferred from observed event data**.

Scenario results generated by the CEO Simulator are **hypothetical mathematical simulations based on historical transition probabilities and explicit redistribution assumptions**.

## They should not be interpreted as causal estimates, financial forecasts, or guaranteed business outcomes.
