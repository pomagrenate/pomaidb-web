---

title: "CASE STUDY: Exploring E-Commerce Customer Behavior & Churn (50,000 Records) — Friction Signals, Spending Paradoxes, and Retention Realities"
slug: "case-study-ecommerce-customer-behavior-analytics"
date: "2026-08-30"
author: "Quan Van"
excerpt: "A personal exploration of a 50,000-customer e-commerce dataset, analyzing support friction signals, cart abandonment churn thresholds, spending paradoxes, and behavioral customer segmentation."
tags: ["Data Analytics", "Customer Churn", "Behavioral Segmentation", "Python", "Recharts", "Next.js"]
category: "Data & Business Strategy"
------------------------------------

# CASE STUDY: Exploring E-Commerce Customer Behavior & Churn (50,000 Records) — Friction Signals, Spending Paradoxes, and Retention Realities

> **A personal exploration of platform engagement, post-purchase friction, and retention dynamics.**
>
> *"What can 50,000 customer records tell me about why users churn, why customer tenure does not guarantee loyalty, and why churned customers actually spend more per order?"*

---

## 1. Why I Started This Project

When exploring customer churn datasets, it is common to jump directly into machine learning classification models to predict binary churn status.

For this project, I wanted to take a step back and focus on **exploratory data analysis and behavioral interpretation**:

> **How do platform touchpoints — support calls, logins, session lengths, and cart abandonment — relate to customer retention, and what patterns exist beyond surface-level summary metrics?**

I decided to work with an e-commerce customer behavior dataset containing 50,000 customer records across 25 attributes to explore platform engagement, post-purchase friction, and customer lifetime value.

---

## 2. The Dataset & My Analysis Pipeline

The dataset consists of **50,000 customer records** covering demographic, platform engagement, transactional, and customer service metrics.

```text
Raw CSV Dataset
50,000 Customer Records, 25 Attributes
        ↓
Python Data Pipeline
scripts/preprocess.py
        ↓
Pre-Computed Analytical JSONs
summary / demographics / engagement / purchasing / churn / segmentation
        ↓
Next.js 14 + Recharts Interactive Dashboard
Deployed on Vercel
```

### Overall Dataset Baseline

* **Total Customers:** 50,000 records
* **Active Customers:** 35,550 (71.10%)
* **Churned Customers:** 14,450 (28.90% overall churn rate)
* **Average Lifetime Value (LTV):** $1,440.63
* **Average Order Value (AOV):** $123.12
* **Average Total Purchases:** 13.11 purchases
* **Average Membership Duration:** 2.98 years
* **Average Monthly Logins:** 11.62 logins
* **Average Customer Service Calls:** 5.68 calls

---

## 3. What I Found: Support Contact Is the Dominant Churn Signal

The strongest positive correlation with customer churn in the dataset is **Customer Service Calls**, with a correlation coefficient of **r = +0.2911**.

Active customers averaged **5.19 support contacts**, whereas churned customers averaged **6.90 support contacts**, or approximately **33.15% higher**.

```text
CHURN RATE BY CUSTOMER SERVICE CONTACTS (N = 50,000)

0–2 Calls     [12.03%]   5,455 Customers (656 Churned)

3–5 Calls     [15.93%]   19,597 Customers (3,121 Churned)

6–8 Calls     [40.58%]   17,449 Customers (7,080 Churned)

9–12 Calls    [47.23%]   6,782 Customers (3,203 Churned)

13+ Calls     [60.11%]     549 Customers (330 Churned)
```

### What I Took From This

In customer success discussions, support contacts are sometimes viewed as a form of brand engagement.

In this dataset, the pattern suggests the opposite.

> **High customer service call volume appears to be associated with greater customer friction and higher churn.**

Once a customer reaches **6 or more support contacts**, the churn rate increases from **15.93%** to **40.58%**, eventually reaching **60.11%** for customers with 13+ calls.

I see this as a useful behavioral signal, but not as proof that support calls themselves cause churn.

---

## 4. Cart Abandonment & The 70% Threshold

Cart abandonment rate emerged as the second strongest positive indicator of churn, with **r = +0.2780**.

Active customers averaged a **54.19% cart abandonment rate**, while churned customers averaged **64.18%**.

| Cart Abandonment Tier | Customer Count | Churned Count | Churn Rate (%) |
| :-------------------- | -------------: | ------------: | -------------: |
| **0–30%**             |          2,887 |           449 |     **15.55%** |
| **30–50%**            |         13,107 |         2,581 |     **19.69%** |
| **50–70%**            |         22,937 |         5,351 |     **23.33%** |
| **70–100%**           |         11,039 |         6,061 |     **54.91%** |

### What I Noticed

The most noticeable change appears once cart abandonment reaches the **70%+** range.

Customers in this group have a **54.91% churn rate**, compared with **15.55%** among customers in the 0–30% range.

This made me curious about what might be happening during the final stages of the purchase journey.

However, the dataset does not contain enough information for me to determine whether the underlying reason is payment friction, pricing, product availability, delivery expectations, or something else.

---

## 5. The Tenure Illusion: Longevity Does Not Appear to Protect Against Churn

One of the more surprising findings was the almost complete absence of correlation between membership duration and churn.

**Correlation coefficient:**

`r(Membership_Years, Churned) = -0.0006`

Active customers averaged **2.98 membership years**, while churned customers also averaged **2.98 membership years**.

| Tenure Group  | Total Customers | Churned Count | Churn Rate (%) |
| :------------ | --------------: | ------------: | -------------: |
| **0–1 Year**  |          11,542 |         3,338 |     **28.92%** |
| **1–2 Years** |           8,970 |         2,601 |     **29.00%** |
| **2–3 Years** |           8,829 |         2,544 |     **28.81%** |
| **3–5 Years** |          14,402 |         4,167 |     **28.93%** |
| **5+ Years**  |           6,257 |         1,800 |     **28.77%** |

### My Interpretation

I initially expected longer-tenured customers to show lower churn rates.

That pattern does not appear in this dataset.

Customers who have been members for **5+ years churn at 28.77%**, which is almost identical to the **28.92%** churn rate among customers with less than one year of membership.

For me, this was a useful reminder that **tenure by itself does not necessarily tell me whether a customer is engaged or loyal**.

---

## 6. The High-AOV Paradox: Churned Customers Spend More Per Order

When comparing numerical features between active and churned customers, I found another interesting pattern.

| Metric                        | Active Customers | Churned Customers |  Difference |
| :---------------------------- | ---------------: | ----------------: | ----------: |
| **Average Order Value (AOV)** |      **$118.38** |       **$134.76** | **+13.84%** |
| **Total Completed Purchases** |        **13.83** |         **11.35** | **-17.92%** |
| **Lifetime Value (LTV)**      |    **$1,446.81** |     **$1,425.42** |  **-1.48%** |

### What I Found Interesting

Churned customers actually spent **$16.38 more per transaction** than active customers:

**$134.76 vs. $118.38**

At the same time, churned customers completed **17.92% fewer purchases**:

**11.35 vs. 13.83 purchases**

As a result, their average Lifetime Value is relatively close to that of active customers:

**$1,425.42 vs. $1,446.81**

This created an interesting distinction for me:

> **A higher average order value does not necessarily mean a customer is more engaged or less likely to churn.**

Purchase frequency appears to matter as well.

---

## 7. Behavioral Customer Segmentation

To explore the customer base from a behavioral perspective, I partitioned the 50,000 customers into five rule-based segments using friction signals, login frequency, and LTV.

| Segment Name                     | Customer Share | Base Count | Churn Rate |       Avg LTV | Avg CS Calls | Avg Cart Abandon | Key Profile Characteristics                                                     |
| :------------------------------- | -------------: | ---------: | ---------: | ------------: | -----------: | ---------------: | :------------------------------------------------------------------------------ |
| **High Friction / Support Risk** |     **56.93%** |     28,466 | **42.56%** |     $1,191.95 |     **7.35** |       **64.07%** | CS calls ≥ 6 or cart abandonment ≥ 70%. Account for **83.8% of all churn**.     |
| **Loyal Champions**              |     **18.50%** |      9,251 |  **9.16%** | **$2,503.28** |         3.16 |           40.66% | Logins ≥ 12 and LTV ≥ $1,500. Highest purchase frequency (20.09 orders).        |
| **Engaged Mid-Tier**             |     **10.16%** |      5,078 | **10.30%** |     $1,081.48 |         3.57 |           49.15% | Logins ≥ 12 and LTV < $1,500. Active platform usage with moderate basket sizes. |
| **Low-Engagement Casuals**       |      **9.79%** |      4,895 | **14.83%** |       $917.48 |         3.85 |           57.66% | Logins < 12 and LTV < $1,500. Low monthly logins (6.32 average).                |
| **At-Risk High-Spenders**        |      **4.62%** |      2,310 | **10.30%** | **$2,147.44** |         3.70 |           52.91% | Logins < 12 and LTV ≥ $1,500. High historic spend with lower visit frequency.   |

### How I Look at These Segments

The segmentation helped me move from individual variables toward broader customer profiles.

The **High Friction / Support Risk** group is particularly interesting because it represents more than half of the dataset while accounting for a very large share of churn.

At the other end, the **Loyal Champions** group combines relatively high engagement with high LTV and a much lower churn rate.

The **At-Risk High-Spenders** segment was also interesting to me.

These customers have relatively high historical value but lower login frequency. Their behavior suggests that **high historical spending alone may not be enough to indicate continued engagement**.

These segments are rule-based and should therefore be treated as an analytical framework rather than definitive customer personas.

---

## 8. What the Data Cannot Tell Me

There are several limitations I need to keep in mind when interpreting these results.

### Correlation vs. Causation

The dataset is cross-sectional.

For example, the **r = +0.2911** relationship between customer service calls and churn tells me that the variables are associated.

It does not prove that increasing support calls causes customers to churn.

It is also possible that an underlying issue causes both higher support contact and higher churn.

### Missing Data

Some engagement fields contain missing values.

Examples include:

* `Social_Media_Engagement_Score`: 6,000 nulls
* `Credit_Balance`: 5,500 nulls
* `Mobile_App_Usage`: 5,000 nulls

These missing values can affect analyses involving those variables.

### Outliers and Invalid-Looking Values

I found several values that require caution:

* 20 records with `Age > 100`
* 30 records with `Cart_Abandonment_Rate > 100%`
* 207 records with `Discount_Usage_Rate > 100%`

Rather than silently treating these values as normal observations, I flagged them as data-quality issues.

### Limited Time Information

Customer recency is represented through `Days_Since_Last_Purchase`.

However, the dataset does not provide detailed event-level timestamps for the individual customer interactions.

This limits how deeply I can perform longitudinal or cohort analysis.

---

## 9. What I Learned

### Support Activity Can Be a Friction Signal

Customer service calls showed one of the strongest relationships with churn in this dataset.

The pattern made me think about support activity differently: it can represent not only engagement, but also unresolved friction.

### Tenure Is Not the Same as Loyalty

The almost identical churn rates across membership-duration groups were unexpected.

It reminded me that a customer's age in the system does not necessarily tell me how engaged that customer currently is.

### High Spending Does Not Automatically Mean High Retention

Churned customers had a higher average order value but fewer completed purchases.

This made me look at customer value as a combination of different behavioral dimensions rather than relying on a single metric.

### Data Quality Changes the Analysis

The more I explored the dataset, the more I realized that analysis does not stop after calculating a correlation.

I also need to ask:

* Are the values plausible?
* Are there missing observations?
* How were the variables defined?
* Is the dataset cross-sectional or longitudinal?
* What conclusions can the available data actually support?

### Pre-Computation Makes the Dashboard Simpler

I used Python to pre-aggregate the 50,000 customer records into structured analytical JSON files.

This allowed the Next.js frontend to focus on visualization and interaction instead of repeatedly processing the full dataset in the browser.

---

## 10. How I Built the Dashboard

The project uses:

* **Python** for data preprocessing and analysis
* **Next.js 14** for the web application
* **TypeScript** for application logic
* **Recharts** for data visualization
* **Vercel** for deployment

The general flow is:

```text
Raw CSV
   ↓
Python preprocessing
   ↓
Analytical aggregations
   ↓
Structured JSON
   ↓
Next.js
   ↓
Interactive dashboard
```

The dashboard focuses on:

* Customer overview
* Demographics
* Engagement
* Purchasing behavior
* Churn analysis
* Behavioral segmentation
* Interactive filtering

The goal was to make the analytical results easier to explore without requiring the viewer to inspect the raw CSV.

---

## 11. What I Would Explore Next

If I continued this analysis, I would be interested in exploring:

* Product-level churn behavior
* Country × churn relationships
* Customer service calls by product/category
* Cart abandonment across different customer groups
* Purchase recency and churn together
* Discount usage and customer value
* Whether the behavioral segments remain stable across countries
* More detailed cohort analysis if better timestamp data were available

I would also be interested in testing whether the same patterns appear in another customer dataset.

---

## 12. Final Thoughts

This project started as an exercise in exploring customer churn data.

What I ended up finding more interesting was the relationship between **customer behavior, business interpretation, and data quality**.

Several patterns stood out:

* Higher customer service contact is associated with higher churn.
* Very high cart abandonment is associated with substantially higher churn.
* Membership duration shows almost no relationship with churn in this dataset.
* Churned customers have a higher average order value but fewer purchases.
* A large behavioral segment shows both high friction signals and elevated churn.

At the same time, these findings have clear boundaries.

The dataset allows me to identify **associations and patterns**, but it does not allow me to confidently explain the underlying causes.

That distinction is something I wanted this project to teach me.

For me, the most useful part of the analysis was not finding a single "answer" to why customers churn.

It was learning to move from:

**"I found a pattern."**

to:

**"I found a pattern — now how much can I actually conclude from it?"**

---

## 13. Live Application & Repository Links

* **Live Analytics App:** [ecommerce-customer-behavior-analyti.vercel.app](https://ecommerce-customer-behavior-analyti.vercel.app/)
* **GitHub Repository:** [github.com/pomagrenate/ecommerce-customer-behavior-analytics](https://github.com/pomagrenate/ecommerce-customer-behavior-analytics)
