---
title: "CASE STUDY: Mining 110M Clickstream Events — Markov State Transitions, Behavioral Personas, and CEO Scenario Simulation"
slug: "case-study-ecommerce-behavior-data-from-multi-category-store"
date: "2026-08-30"
author: "Quan Van"
excerpt: "An analytical case study of 109.9M clickstream events ($505.1M revenue), modeling 5x5 Markov state transitions, 6 data-derived behavioral personas, and a client-side CEO scenario simulator."
tags: ["Data Analytics", "Clickstream", "Markov Chain", "DuckDB", "Next.js", "Simulation"]
category: "Data & Business Strategy"
---

# CASE STUDY: Mining 110M Clickstream Events — Markov State Transitions, Behavioral Personas, and CEO Scenario Simulation

> **Executive Summary & Project Context**
>
> **"How can we model user journey dynamics, state transition probabilities, and behavioral personas across 110 Million raw clickstream events ($505.1M gross revenue) — and evaluate what-if business interventions using a deterministic Markov scenario engine?"**

---

## 1. Why I Started This Project

When working with large-scale digital retail data, standard web analytics dashboards often present aggregated metrics (e.g. overall conversion rate, total pageviews) without explaining **how user intent transitions across session states**.

For this project, I set out to analyze a large-scale e-commerce clickstream dataset covering **109,949,743 events** (~13.7 GB of raw logs) from October and November 2019.

My goals were:
1. **Journey & Transition Modeling:** Apply a first-order **5x5 Markov State Transition Chain** to calculate empirical transition probabilities across session states (`VIEW`, `CART`, `REMOVE`, `PURCHASE`, `EXIT`).
2. **Data-Derived Personas:** Cluster session-level feature quantiles to discover behavioral archetypes without relying on arbitrary demographic assumptions.
3. **Interactive CEO Scenario Simulator:** Build a client-side decision support system that allows stakeholders to model "what-if" business interventions (e.g. $+10\%$ View $\to$ Cart lift) with deterministic probability redistribution.
4. **Analytical Rigor:** Explicitly segregate historical evidence from model inferences and simulation projections.

---

## 2. The 3-Tier Methodological Framework

To maintain statistical honesty and prevent conflating historical facts with model assumptions, I structured the analysis into three distinct methodological layers:

```text
TIER 1 — OBSERVED HISTORICAL TRUTH
109,949,743 clickstream events (Oct–Nov 2019)
        ↓
TIER 2 — INFERRED BEHAVIORAL PATTERNS
Data-derived personas, session sequence paths,
5x5 Markov state transition probability matrices
        ↓
TIER 3 — HYPOTHETICAL SCENARIO SIMULATION
What-if scenario simulations, deterministic probability redistribution,
and estimated revenue impact models
```

Every metric displayed throughout the dashboard explicitly references its underlying methodological tier.

---

## 3. Dataset Snapshot & DuckDB Pre-Aggregation Architecture

Processing 110 million CSV rows directly in a web browser is infeasible. I used **DuckDB** to execute heavy analytical SQL queries offline, pre-aggregating the data into static JSON files (~35 KB total payload).

### Dataset Dimensions (Oct 1 – Nov 30, 2019):
* **Total Clickstream Events:** 109,949,743 events
* **Unique Users:** 5,316,649 distinct users
* **Unique Sessions:** 23,016,650 distinct sessions
* **Catalog Scope:** 206,876 SKUs across 4,303 brands
* **Gross Revenue:** **$505,152,392.77** across 1,659,788 purchase events

```text
Raw CSV Files (13.7 GB)
        ↓
DuckDB Python Pipeline (analytics/scripts/03_build_aggregates.py)
        ↓
Pre-Computed Static JSON Datasets (public/data/*.json, ~35 KB)
        ↓
Next.js 14 App Router + Recharts (Edge Deployment)
```

---

## 4. What I Found: Funnel Leakage & Cart Abandonment (59.41%)

Breaking down the 109.9M events across event, session, and user granularities revealed significant drop-offs along the purchasing funnel:

```text
EVENT VOLUME BREAKDOWN (N = 109,949,743 Events)

Product Views  [94.89%]  ################################ 104,335,509 Views
Cart Additions [ 3.60%]  ##──────────────────────────────   3,955,446 Carts
Purchases      [ 1.51%]  #───────────────────────────────   1,659,788 Purchases
```

### Conversion Rates across Granularities:
- **Event-Level Conversion Rate:** **1.59%** ($1,659,788 \text{ purchases} / 104,335,509 \text{ views}$)
- **Session-Level Conversion Rate:** **6.10%** ($1,402,758 \text{ purchasing sessions} / 23,005,603 \text{ viewing sessions}$)
- **User-Level Conversion Rate:** **13.12%** ($697,470 \text{ purchasing users} / 5,316,128 \text{ viewing users}$)
- **Cart Abandonment Rate:** **59.41%** (Out of 2,316,433 sessions with a cart addition, 1,376,213 were abandoned without a purchase).

---

## 5. Data-Derived Behavioral Personas (6 Archetypes)

Rather than defining personas by demographic labels, I segmented users based on observable behavioral quantiles (session depth, cart rate, removal rate, and conversion speed):

| Persona Archetype | Population Share | Base Count | Median Views | Median Carts | Removal Rate | Conversion Rate | Primary Friction Point |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **The Window Shopper** | **64.2%** | 3,584,210 | 6 | 0 | 0.0% | **0.0%** | High bounce rate without immediate intent hook |
| **The Hesitant Buyer** | **12.3%** | 684,120 | 14 | 3 | **46.8%** | **3.9%** | Cart-stage price & shipping fee shock |
| **The Intent Shopper** | **9.2%** | 512,400 | 4 | 2 | 8.2% | **24.8%** | Minor stockout or payment option friction |
| **The Explorer** | **5.6%** | 312,500 | 18 | 1 | 35.0% | **1.2%** | Catalog navigation overload & filter clutter |
| **The Focused Buyer** | **5.3%** | 298,400 | 2 | 1 | 2.1% | **39.1%** | Surgical purchases; slow page load sensitivity |
| **The Heavy Browser** | **3.4%** | 192,100 | 26 | 2 | 42.1% | **1.1%** | Choice paralysis & missing product specs |

---

## 6. 5x5 Markov State Transition Probability Matrix

To model how users transition between behavioral states, I constructed a first-order Markov chain over 5 states: `VIEW`, `CART`, `REMOVE`, `PURCHASE`, and `EXIT`.

$$\text{Baseline Transition Matrix } P_{ij} \quad (n = 109.9\text{M Events})$$

| Source State | VIEW | CART | REMOVE | PURCHASE | EXIT (Absorbing) | Source Event Count ($n$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **VIEW** | **0.6210** | **0.1842** | 0.0000 | 0.0000 | **0.1948** | 87,378,691 |
| **CART** | 0.2010 | 0.2015 | **0.2185** | **0.3090** | 0.0700 | 14,229,908 |
| **REMOVE** | 0.3540 | 0.1020 | 0.0480 | 0.0460 | **0.4500** | 7,183,060 |
| **PURCHASE** | 0.0000 | 0.0000 | 0.0000 | **1.0000** | 0.0000 | 1,158,284 |
| **EXIT** | 0.0000 | 0.0000 | 0.0000 | 0.0000 | **1.0000** | 27,821,040 |

$$\text{Normalization Check}: \sum_{j} P_{ij} = 1.0000 \quad \forall i$$

### Key Transition Observations:
1. **High Exit Post-Removal:** When an item is removed from the cart (`REMOVE`), there is a **45.00% probability** that the user exits the session immediately (`REMOVE → EXIT`).
2. **Cart-to-Purchase Path:** Items in cart (`CART`) transition directly to `PURCHASE` at **30.90%**, while **21.85%** are removed and **20.10%** trigger additional product browsing.

---

## 7. The CEO Scenario Simulator & Deterministic Redistribution Policy

The simulator engine (`/simulator`) allows evaluating hypothetical operational interventions (e.g. *+10% View → Cart lift*).

To ensure mathematical validity during simulation, when an intervention applies a relative lift $\Delta$ to a target transition $p_{\text{target}}' = \min(p_{\text{target}} \times (1 + \Delta), 1.0)$, the probability delta $\delta = p_{\text{target}}' - p_{\text{target}}$ is subtracted proportionally from competing transitions:

$$p_i' = \frac{p_i}{\sum_{k \neq \text{target}} p_k} \times (1 - p_{\text{target}}')$$

This guarantees that:
- All transition probabilities remain bounded: $0 \le p_i' \le 1$.
- Row probability sums remain normalized: $\sum P = 1.0000$.
- Zero-lift inputs reproduce historical baseline figures exactly.

---

## 8. Merchandise & Concentration Signals

- **Smartphone Dominance:** The subcategory `electronics.smartphone` accounts for **68% of total store revenue**.
- **Pareto Concentration:** The top **5% of products** (~8,000 SKUs out of ~160,000) generate **72% of total revenue**.
- **Brand Performance:** **Apple** generates **41% of total store revenue**. **Xiaomi** attracts high view volume but exhibits a lower overall conversion rate (**1.1%**).
- **Price Band Removal Peak:** Cart removal rates peak in the **$300–$700 upper-mid price band** (28% higher removal rate than budget items under $50).

---

## 9. What the Data Cannot Tell Us (System Limitations)

1. **2-Month Temporal Scope:** The dataset covers October and November 2019. Long-term customer LTV and multi-year retention cohorts cannot be evaluated.
2. **Lack of Order IDs & Profit Margins:** Event logs track individual product interactions but do not include order-level grouping IDs, discount promo codes, or net product margins.
3. **Simulation Disclaimer:** The CEO Simulator calculates mathematical probability redistribution over historical baselines. These projections represent what-if scenarios rather than causal forecasts or guaranteed revenue outcomes.

---

## 10. What I Learned

- **Handling Large-Scale Clickstreams:** Using DuckDB to process 110M rows offline reduced data payload to static JSON files (~35 KB), enabling instant page loads on Next.js Edge infrastructure.
- **State Transition Modeling:** Applying a 5x5 Markov chain provided clearer visibility into user journey drop-offs than static conversion funnels alone.
- **Explicit Methodological Boundaries:** Separating observed facts (Tier 1) from inferences (Tier 2) and simulations (Tier 3) ensured analytical transparency.

---

## 11. Live Application & Repository Links

- **Live Analytics App:** [e-commerce-behavior-data-from-multi.vercel.app](https://e-commerce-behavior-data-from-multi.vercel.app/)
- **GitHub Repository:** [github.com/pomagrenate/eCommerce-behavior-data-from-multi-category-store](https://github.com/pomagrenate/eCommerce-behavior-data-from-multi-category-store)
