---

title: "CASE STUDY: Exploring Global E-Commerce Sales (2021–2024) — Revenue Skew, Category Dynamics, and Data Limitations"

slug: "case-study-global-ecommerce-sales-dataset-analysis"

date: "2026-08-30"

author: "Quan Van"

excerpt: "A personal analytical exploration of 10,000 global e-commerce orders ($5.28M revenue), looking at revenue distribution, category and regional patterns, fulfillment behavior, and what the dataset can — and cannot — tell me."

tags: ["Data Analytics", "E-Commerce", "Revenue Analysis", "Python", "Recharts", "Next.js"]

category: "Data & Business Strategy"

---

# CASE STUDY: Exploring Global E-Commerce Sales (2021–2024) — Revenue Skew, Category Dynamics, and Data Limitations

> **A personal exploration of a global e-commerce transaction dataset.**

> **"What can I actually learn from 10,000 e-commerce orders when I look beyond the basic sales numbers?"**

---

## 1. Why I Started This Project

I wanted to practice working with a relatively large transactional dataset and see how far I could go from raw order records to something that could actually help me understand a business.

The dataset contains 10,000 e-commerce transactions across multiple countries, product categories, order statuses, and payment methods.

Rather than trying to build a complicated predictive model, I decided to focus on something more fundamental:

**What does the data actually show?**

I wanted to explore several areas:

1. Revenue and profit distribution
2. Product category performance
3. Geographic purchasing patterns
4. Order and fulfillment behavior
5. Price and quantity relationships
6. The limitations hidden inside the dataset itself

The last part became particularly interesting to me.

A dataset can produce very convincing charts while still having characteristics that make some business interpretations unreliable.

---

## 2. The Dataset & My Analysis Pipeline

The dataset contains **10,000 transaction records** covering the period from **January 5, 2021 to December 24, 2024**.

I processed the raw transaction data with Python and generated aggregated analytical data for the dashboard.

```text
Raw CSV Dataset
10,000 transaction records
        ↓
Python Analysis & Aggregation
        ↓
Summary / Time Series / Category / Country / Fulfillment Data
        ↓
Next.js + Recharts
        ↓
Interactive Analytics Dashboard
```

The dashboard is deployed as a static/web application, while the heavier aggregation work is performed before the data reaches the frontend.

### Dataset Snapshot

* **10,000 orders**
* **27,313 units sold**
* **$5,284,387.70 total revenue**
* **$1,437,638.31 total profit**
* **27.21% overall profit margin**
* **$528.44 average order value**
* **$236.31 average unit price**
* **18 countries**
* **4 regions**
* **5 product categories**
* **14 subcategories**
* **70 unique products**

These numbers gave me a useful starting point for exploring the structure of the dataset.

---

## 3. What I Found: Revenue Is Extremely Concentrated

The first thing that caught my attention was how differently revenue was distributed compared with order volume.

The number of orders across the five product categories is surprisingly similar.

However, the revenue contribution is not.

| Product Category    | Order Count |       Revenue ($) | Share of Revenue | Profit Margin | Avg Unit Price |   Avg AOV |
| :------------------ | ----------: | ----------------: | ---------------: | ------------: | -------------: | --------: |
| **Electronics**     |       1,977 | **$3,382,028.46** |       **64.00%** |        27.36% |        $770.04 | $1,710.69 |
| **Home & Kitchen**  |       2,008 |   **$892,842.02** |           16.90% |        26.03% |        $198.16 |   $444.64 |
| **Clothing**        |       1,977 |   **$407,471.79** |            7.71% |        28.40% |         $91.29 |   $206.11 |
| **Books & Media**   |       2,043 |   **$386,644.46** |            7.32% |        27.17% |         $81.36 |   $189.25 |
| **Beauty & Health** |       1,995 |   **$215,400.97** |            4.08% |        27.40% |         $48.17 |   $107.97 |

The order counts are all around 2,000.

But Electronics alone accounts for **64% of total revenue**.

That made me look deeper into the individual subcategories.

### Laptops and Smartphones

Laptops generated:

* **$1,641,700.18 revenue**
* **486 orders**
* **$1,511.53 average unit price**
* **31.07% of total dataset revenue**

Smartphones generated:

* **$843,506.83 revenue**
* **514 orders**
* **$738.16 average unit price**

Together, Laptops and Smartphones account for approximately:

**$2.485M, or 47.03% of total revenue.**

### What I Took From This

One thing I learned from this analysis is that **order volume alone can be misleading when looking at a retail business**.

Two categories can generate a similar number of orders while contributing dramatically different amounts of revenue.

If I were only looking at order counts, Electronics would not initially appear to be dramatically different from the other categories.

Looking at revenue changes the picture completely.

---

## 4. Geographic Patterns

The dataset contains 18 countries grouped into four regions.

Interestingly, the regional distribution is relatively balanced.

| Region            | Order Count |       Revenue ($) | Share of Revenue | Profit Margin |     Avg AOV |
| :---------------- | ----------: | ----------------: | ---------------: | ------------: | ----------: |
| **Middle East**   |       2,458 | **$1,348,593.22** |           25.52% |    **28.52%** | **$548.65** |
| **North America** |       2,602 | **$1,331,129.75** |           25.19% |        27.55% |     $511.58 |
| **Asia**          |       2,494 | **$1,330,007.18** |           25.17% |        26.35% |     $533.28 |
| **Europe**        |       2,446 | **$1,274,657.55** |           24.12% |        26.36% |     $521.12 |

There is no single region overwhelmingly dominating the dataset.

The differences become more interesting when looking at individual countries.

### Egypt

Egypt has the highest average order value in the dataset:

**$715.80 AOV**

It contains:

* 481 orders
* $344.3K revenue
* 30.19% profit margin

A large part of this appears to come from its relatively high Electronics revenue contribution.

### North America

Among individual countries, Mexico, Canada, and the USA have some of the highest order volumes:

* Mexico: 897 orders
* Canada: 876 orders
* USA: 829 orders

I found this useful because it reminded me that regional and country-level analysis can tell different stories.

A region may look relatively balanced overall while individual countries inside that region can behave quite differently.

---

## 5. Looking at Order & Fulfillment Behavior

I also wanted to understand what happened to the orders after they were placed.

The order status distribution was:

```text
ORDER STATUS

Delivered    62.73%   6,273 orders
Returned     18.57%   1,857 orders
Processing    9.62%     962 orders
Cancelled     9.08%     908 orders
```

The return rate stood out to me:

**18.57% of orders were marked as returned.**

These returned orders represented approximately:

**$939,644.40 in revenue.**

This made returns one of the areas I would want to investigate further if I had access to more detailed operational data.

For example, I would be curious to know:

* Which products are returned most frequently?
* Are returns concentrated in specific countries?
* Are expensive products returned more often?
* Are certain categories responsible for most of the return value?

The current dataset allows me to explore some of these questions, but not necessarily explain **why** the returns happen.

---

## 6. Payment Methods

The payment method distribution is also interesting.

The seven payment methods are relatively evenly represented:

* PayPal: 14.70%
* Debit Card: 14.86%
* Credit Card: 14.30%
* Google Pay: 14.22%
* Bank Transfer: 14.26%
* Cash on Delivery: 14.14%
* Apple Pay: 13.52%

There is no obvious dominant payment method.

I initially expected there might be a stronger difference between payment channels, but the distribution is remarkably balanced.

This is also one of the points where I started becoming more cautious about interpreting the dataset.

A perfectly balanced distribution can be a legitimate observation, but it can also reflect how a dataset was generated.

---

## 7. The Price vs. Quantity Question

One of the questions I wanted to investigate was whether customers appear to purchase fewer units when the unit price becomes higher.

A simple assumption would be:

> Higher prices → fewer units per order.

So I calculated the correlation between `Unit_Price` and `Quantity`.

The result was:

**r = -0.0021**

That is effectively zero linear correlation.

I also grouped orders into price bands:

| Price Band  | Average Quantity |
| :---------- | ---------------: |
| $0–$50      |         **2.73** |
| $50–$150    |         **2.72** |
| $150–$300   |         **2.81** |
| $300–$600   |         **2.69** |
| $600–$1,000 |         **2.68** |
| $1,000+     |         **2.70** |

The average basket size remains remarkably stable.

There is no obvious decline in quantity as unit price increases.

### What I Found Interesting

This was probably one of the most useful analytical exercises in the project because it challenged a simple assumption.

The data does **not** show a meaningful relationship between unit price and quantity.

But I also do not want to jump from that observation to:

> "Price has no effect on demand."

That would be much stronger than what the dataset can support.

The dataset is observational and does not provide the controlled price variation required to estimate true price elasticity.

So my conclusion is much narrower:

> **In this dataset, unit price and order quantity show almost no linear relationship.**

That's what the data tells me.

---

## 8. A Major Limitation I Discovered

The more I explored the dataset, the more important the limitations became.

### Price Elasticity

I cannot calculate reliable price elasticity of demand from this dataset.

There are no controlled price changes for the same products over time that would allow me to separate price effects from other factors.

So:

**Price vs. quantity correlation ≠ price elasticity.**

This distinction was important for me to understand.

---

### The Late-2024 Sales Drop

The time series initially looked like it contained a major decline toward the end of 2024.

Monthly order volume increased over time and peaked around October 2023:

**427 orders / $243.9K revenue**

Then the dataset drops to only 12 orders in December 2024.

It would be tempting to describe this as:

> "The business experienced a major sales decline."

But I don't think the data supports that interpretation.

The most reasonable explanation from the dataset structure is that this is related to the collection/sampling cutoff.

I therefore treat the late-2024 decline as a **dataset limitation**, rather than evidence of a real business downturn.

---

### Fulfillment Data

Shipping times are also extremely similar across the available shipping methods.

Average shipping times are approximately:

**11.3–11.5 days**

across Economy, Express, and Overnight shipping.

That is unusual enough that I would be cautious about interpreting it as real-world logistics performance.

It may instead reflect how the dataset was generated.

---

## 9. What I Learned From the Analysis

This project taught me more than just how to make charts.

### 1. Revenue and volume tell different stories

A category can have roughly the same number of orders as another category while contributing dramatically more revenue.

Looking at only one KPI can hide important differences.

### 2. A correlation is not automatically a business conclusion

The almost-zero relationship between price and quantity was a good reminder that I need to distinguish:

```text
Observation
    ↓
Statistical relationship
    ↓
Interpretation
    ↓
Causal claim
```

These are not the same thing.

### 3. Dataset quality matters as much as analytical technique

A sophisticated analysis cannot compensate for limitations in the underlying data.

Before asking:

> "What does this number mean?"

I should also ask:

> "How was this number produced?"

### 4. Aggregation makes exploration easier

I used Python to pre-compute analytical summaries instead of sending all raw transaction processing to the browser.

This made the dashboard much simpler and allowed the frontend to focus on visualization and interaction.

---

## 10. How I Built the Dashboard

The final result is an interactive analytics dashboard built with:

* **Next.js**
* **TypeScript**
* **Recharts**
* **Python**
* **Vercel**

The Python side handles data processing and aggregation.

The Next.js application focuses on:

* Rendering charts
* Filtering data
* Displaying KPIs
* Comparing categories and regions
* Presenting the analytical findings interactively

The main idea was to keep the frontend relatively lightweight rather than making the browser repeatedly process all 10,000 raw records.

---

## 11. What I Would Explore Next

If I continued working with this dataset, I would probably explore:

* Product-level return patterns
* Country × category relationships
* Profit contribution rather than only revenue
* Whether high-AOV countries have different product mixes
* Return rate by product category
* Revenue concentration at the product level
* More detailed customer/order segmentation if customer identifiers are available

I would also be interested in comparing this dataset with a real-world public e-commerce dataset to see which patterns survive outside a potentially synthetic dataset.

---

## 12. Final Thoughts

The biggest lesson I took from this project is that **data analysis is not just about finding interesting numbers**.

It is also about deciding how much confidence I should have in those numbers.

The dataset shows some very clear patterns:

* Electronics dominate revenue.
* Laptops and smartphones account for a very large share of total revenue.
* Regional revenue is relatively balanced.
* Returns represent a significant portion of orders.
* Unit price and quantity have almost no linear relationship in this dataset.

But the dataset also has limitations that affect how far I can interpret those findings.

For me, that was actually one of the most interesting parts of the project.

I started with the intention of building an e-commerce analytics dashboard.

I ended up learning that **understanding the boundaries of a dataset is just as important as understanding the patterns inside it.**

---

## 13. Live Application & Repository

* **Live Analytics App:** [global-e-commerce-sales-dataset-ana.vercel.app](https://global-e-commerce-sales-dataset-ana.vercel.app/)

* **GitHub Repository:** [github.com/pomagrenate/Global-E-Commerce-Sales-Dataset-Analysis](https://github.com/pomagrenate/Global-E-Commerce-Sales-Dataset-Analysis)
