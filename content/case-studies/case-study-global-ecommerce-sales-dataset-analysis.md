---
title: "CASE STUDY: Exploring Global E-Commerce Sales (2021-2024) — Revenue Skew, Category Dynamics, and Data Limitations"
slug: "case-study-global-ecommerce-sales-dataset-analysis"
date: "2026-08-30"
author: "Quan Van"
excerpt: "An analytical case study exploring 10,000 global e-commerce order records ($5.28M revenue) across 18 countries, examining revenue distribution skews, fulfillment metrics, cross-sectional price dynamics, and dataset limitations."
tags: ["Data Analytics", "E-Commerce", "Revenue Analysis", "Python", "Recharts", "Next.js"]
category: "Data & Business Strategy"
---

# CASE STUDY: Exploring Global E-Commerce Sales (2021-2024) — Revenue Skew, Category Dynamics, and Data Limitations

> **Executive Summary & Project Context**
>
> **"What does a 10,000-order global e-commerce dataset ($5.28M gross revenue) reveal about product category skews, regional purchasing patterns, and fulfillment performance — and what are the analytical boundaries of synthetic retail data?"**

---

## 1. Why I Started This Project

I wanted to explore a multi-year global retail transaction dataset, clean and aggregate multi-dimensional transaction records, and build a dedicated interactive analytics dashboard to visualize the findings.

Many portfolio data projects focus solely on rendering charts or reporting surface-level metrics without questioning the data generation process. 

For this project, my goal was twofold:
1. **Analytical Exploration:** Calculate exact financial, geographic, category, and fulfillment metrics across 10,000 order records spanning 2021 through 2024.
2. **Methodological Rigor:** Identify what the data genuinely demonstrates while being upfront about its limitations (e.g., cross-sectional price elasticity vs. correlation, dataset sampling cutoffs).

---

## 2. The Dataset & Pipeline Architecture

The dataset consists of **10,000 transaction records** covering global e-commerce activity from **January 5, 2021 to December 24, 2024**.

```text
Raw CSV Dataset (10,000 Records, 26 Attributes)
         ↓
Python Data Pipeline (scripts/analyze_data.py)
         ↓
Pre-Computed Analytical JSONs (summary, time_series, category, country, fulfillment)
         ↓
Next.js 14 & Recharts Interactive Dashboard (Deployed on Vercel)
```

### Dataset Dimensions:
- **Total Revenue:** $5,284,387.70
- **Total Profit:** $1,437,638.31 (Overall Profit Margin: **27.21%**)
- **Total Volume:** 10,000 orders / 27,313 units sold (Average **2.73 units/order**)
- **Average Order Value (AOV):** $528.44
- **Average Unit Price:** $236.31
- **Scope:** 18 countries across 4 regions, 5 product categories, 14 subcategories, 70 unique products.

---

## 3. What I Found: Category Revenue Skew vs. Order Volume Uniformity

One of the most striking patterns in the dataset is the extreme revenue concentration in high-ticket product categories despite uniform order distribution.

| Product Category | Order Count | Revenue ($) | Share of Revenue | Profit Margin | Avg Unit Price | Avg AOV |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Electronics** | 1,977 | **$3,382,028.46** | **64.00%** | 27.36% | $770.04 | $1,710.69 |
| **Home & Kitchen** | 2,008 | **$892,842.02** | 16.90% | 26.03% | $198.16 | $444.64 |
| **Clothing** | 1,977 | **$407,471.79** | 7.71% | 28.40% | $91.29 | $206.11 |
| **Books & Media** | 2,043 | **$386,644.46** | 7.32% | 27.17% | $81.36 | $189.25 |
| **Beauty & Health** | 1,995 | **$215,400.97** | 4.08% | 27.40% | $48.17 | $107.97 |

### Subcategory Observation:
- **Laptops** alone generated **$1,641,700.18** across 486 orders (**31.07% of all dataset revenue**) with an average unit price of $1,511.53.
- **Smartphones** added $843,506.83 (514 orders, $738.16 avg unit price).
- Combined, Laptops and Smartphones accounted for **47.03% ($2.485M)** of total revenue across the entire 10,000-order dataset.

---

## 4. Geographic Observations: Regional Volume & AOV Signals

The dataset spans 18 countries grouped into 4 primary regions:

| Region | Order Count | Revenue ($) | Share of Revenue | Profit Margin | Avg AOV |
| :--- | ---: | ---: | ---: | ---: | ---: |
| **Middle East** | 2,458 | **$1,348,593.22** | 25.52% | **28.52%** | **$548.65** |
| **North America** | 2,602 | **$1,331,129.75** | 25.19% | 27.55% | $511.58 |
| **Asia** | 2,494 | **$1,330,007.18** | 25.17% | 26.35% | $533.28 |
| **Europe** | 2,446 | **$1,274,657.55** | 24.12% | 26.36% | $521.12 |

### Key Country Observations:
- **Highest AOV Country:** **Egypt** exhibited the highest AOV in the dataset at **$715.80** (481 orders, $344.3k revenue, 30.19% profit margin) due to a heavy relative mix of Electronics purchases ($250.1k).
- **Highest Volume Countries:** **Mexico** (897 orders, $431.7k revenue), **Canada** (876 orders, $454.9k revenue), and the **USA** (829 orders, $444.5k revenue) led North America as top individual order sources.

---

## 5. Fulfillment & Order Lifecycle Dynamics

Tracking order statuses revealed notable operational insights across the 10,000 transactions:

```text
ORDER STATUS BREAKDOWN (N = 10,000 Orders)

Delivered   [62.73%]  ################───────────────── 6,273 Orders ($3.308M)
Returned    [18.57%]  #####──────────────────────────── 1,857 Orders ($939.6k)
Processing  [9.62%]   ##───────────────────────────────   962 Orders ($537.4k)
Cancelled   [9.08%]   ##───────────────────────────────   908 Orders ($499.1k)
```

- **Return Rate:** **18.57%** ($939,644.40 revenue impact) represents a substantial return volume across all 5 categories.
- **Payment Method Distribution:** Payment channels are almost perfectly evenly distributed across 7 methods: PayPal (14.70%), Debit Card (14.86%), Credit Card (14.30%), Google Pay (14.22%), Bank Transfer (14.26%), Cash on Delivery (14.14%), and Apple Pay (13.52%).

---

## 6. What Surprised Me: Cross-Sectional Price Dynamics & Basket Size

When evaluating price vs. order quantity across all 10,000 orders, I noticed a very clear pattern:

- **Correlation Coefficient:** $r(\text{Unit\_Price}, \text{Quantity}) = \mathbf{-0.0021}$ (essentially zero correlation).
- **Basket Size:** The average order quantity remains nearly identical (~2.68 to 2.81 units) regardless of whether unit price is under $50 or over $1,000:
  - Price Band $0-$50: Avg Quantity = **2.73 units**
  - Price Band $50-$150: Avg Quantity = **2.72 units**
  - Price Band $150-$300: Avg Quantity = **2.81 units**
  - Price Band $300-$600: Avg Quantity = **2.69 units**
  - Price Band $600-$1,000: Avg Quantity = **2.68 units**
  - Price Band $1,000+: Avg Quantity = **2.70 units**

This indicates that order quantity was generated independently of price in this dataset.

---

## 7. What the Data Cannot Tell Us (Methodological Caution & Limitations)

To maintain analytical honesty, several important dataset limitations must be highlighted:

1. **No Causal Price Elasticity of Demand:** Because the dataset lacks controlled temporal price variations for individual SKUs, cross-sectional price-volume patterns cannot be used to estimate true price elasticity of demand.
2. **Late 2024 Sales Drop Is a Sampling Cutoff:** Monthly order volume grew steadily from 2021, peaking in **October 2023 at $243.9k (427 orders)**, before dropping off sharply to 12 orders in December 2024. This represents a dataset collection cutoff date rather than a sudden decline in business performance.
3. **Synthetic Artifacts in Fulfillment Data:** Shipping times average 11.3 to 11.5 days across all shipping methods (Economy, Express, Overnight), reflecting synthetic generation parameters rather than real-world logistics performance.

---

## 8. What I Learned

- **Data Exploration vs. Interpretation:** A clean dataset can show strong numerical patterns (such as Electronics accounting for 64% of revenue), but understanding the underlying sampling characteristics is critical before drawing business conclusions.
- **Frontend Performance for Large Datasets:** Pre-computing summary aggregation files in Python allowed the Next.js frontend to render dynamic charts instantly without re-processing 10,000 raw CSV rows on every filter change.

---

## 9. Live Application & Repository Links

- **Live Analytics App:** [global-e-commerce-sales-dataset-ana.vercel.app](https://global-e-commerce-sales-dataset-ana.vercel.app/)
- **GitHub Repository:** [github.com/pomagrenate/Global-E-Commerce-Sales-Dataset-Analysis](https://github.com/pomagrenate/Global-E-Commerce-Sales-Dataset-Analysis)
