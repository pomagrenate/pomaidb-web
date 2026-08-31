---
title: "The City Is a Machine — Processing 37 Million NYC Taxi Trips with Medallion Architecture"
slug: "case-study-the-city-is-a-machine"
date: "2026-08-31"
author: "Quan Van"
excerpt: "I wanted to understand where an urban transportation network makes money, and more importantly: at what data scale does distributed PySpark actually become necessary compared to single-node DuckDB?"
category: "Data Engineering & Analytics"
tags:
  - "DuckDB"
  - "PySpark"
  - "Python"
  - "Medallion Architecture"
  - "Data Engineering"
  - "Streamlit"
  - "Benchmarking"
---

# The City Is a Machine — Processing 37 Million NYC Taxi Trips

> **Two questions I set out to answer:**
> 1. **Business story:** Where does NYC make money? Where is driver demand concentrated, and how efficient are airport trips versus short local hops?
> 2. **Technical story:** When engineers claim "I used Spark because Big Data", is that genuinely warranted for tens of millions of records—or is single-node DuckDB dramatically faster?

---

## 1. Why I Started This Project

I wanted to work with a real-world, high-volume public dataset that wasn't synthetic or artificially cleaned. 

The **NYC Taxi & Limousine Commission (TLC) Yellow Taxi dataset for 2023** contains approximately **37 million trip records** across 12 monthly Parquet files (~3.5 GB compressed, over 15 GB uncompressed).

Instead of dumping everything into a single script, I wanted to build a production-grade data pipeline following the **Medallion Architecture (Bronze → Silver → Gold)** and benchmark different query execution engines (Pandas, DuckDB, and PySpark).

---

## 2. Medallion Architecture & Data Pipeline Design

I structured the data pipeline into three distinct, reproducible stages:

```text
NYC TLC S3 Bucket (Raw Parquet Files)
          │
          ▼
   [Bronze Layer]  ──► Ingestion & Schema Validation (Raw storage)
          │
          ▼
   [Silver Layer]  ──► Cleaning, Invalid Range Removal, Derived Metrics (Trip duration, speed, tip %)
          │
          ▼
   [Gold Layer]    ──► Pre-aggregated Analytical Tables (Zone Hourly Revenue, Pickup-Dropoff Matrices)
          │
          ▼
  [Streamlit & Web Platform] ──► Interactive Analytics & Executive Command Dashboard
```

### Bronze Stage (`pipeline/01_bronze.py`)
- Ingests raw monthly `.parquet` files from public AWS S3 buckets.
- Enforces explicit column data types (`pickup_datetime`, `dropoff_datetime`, `PULocationID`, `DOLocationID`, `fare_amount`, `tip_amount`, `total_amount`).
- Preserves raw input state with zero destructive transformations.

### Silver Stage (`pipeline/02_silver.py`)
- Filters out non-sensical outliers: trips with duration $\le 0$, negative distance, extreme fare anomalies ($>\$1,000$ or $< \$0$).
- Enriches data with temporal attributes (`hour`, `day_of_week`, `is_weekend`) and spatial lookup mappings (LocationID to NYC Boroughs & Taxi Zones).
- Calculates derived metrics such as tip percentage and average trip speed ($\text{mph}$).

### Gold Stage (`pipeline/03_gold.py`)
- Aggregates cleaned Silver tables into OLAP-optimized summary files.
- Generates zone-level revenue matrices, hourly peak demand patterns, and airport trip efficiency metrics.

---

## 3. Benchmarking Execution Engines: Pandas vs. DuckDB vs. PySpark

A central technical question I investigated was: **At what data scale does distributed PySpark actually outperform single-machine engines?**

I ran identical analytical aggregation queries (`Revenue & Trip Count per Zone per Hour`) across 37+ million rows on a single development workstation:

| Engine | Execution Time | Memory Footprint | Relative Speedup |
| :--- | :--- | :--- | :--- |
| **Pandas** | ~42.8s | ~6.2 GB RAM (High peak memory) | 1x (Baseline) |
| **PySpark (Local Cluster)** | ~18.4s | ~4.8 GB RAM (JVM overhead) | 2.3x faster |
| **DuckDB (Vectorized SQL)** | **~1.3s** | **~0.9 GB RAM (Streaming execution)** | **32.9x faster than Pandas / 14.1x faster than PySpark** |

### What I Learned From the Benchmark:
1. **DuckDB's Vectorized Query Engine is Astonishingly Fast**: For single-node analytical processing on datasets under 100 million rows (or fits inside disk/RAM), DuckDB's in-memory columnar execution avoids PySpark's JVM serialization overhead.
2. **PySpark's Overhead on Moderate Datasets**: Starting a local PySpark context, partitioning RDDs, and serializing Python tuples across JVM processes incurs noticeable latency for sub-50GB datasets.
3. **When PySpark Is Still Mandatory**: If the dataset expands to 500GB+ across distributed cluster nodes where data exceeds any single machine's RAM, PySpark's distributed shuffle and fault-tolerant architecture become essential.

---

## 4. Key Business Insights Discovered

From analyzing the aggregated Gold dataset across 37 million trips:

1. **JFK / LaGuardia Airport Hops vs. Manhattan Short Trips**:
   - Airport pickups represent less than **7.2% of total volume** but contribute **over 21.4% of total driver revenue**, driven by flat-rate fares and higher average tip percentages ($18.5\%$ vs $12.2\%$).
2. **Peak Demand Bottlenecks**:
   - Midtown Manhattan experiences severe supply shortages between **5:00 PM and 7:30 PM on Fridays**, where average trip speed drops below $5.4\text{ mph}$ while surge fares reach daily peaks.
3. **Payment Preference Skew**:
   - Credit card payments account for **$82.4\%$ of recorded transactions**, with cash transactions clustering heavily in outer boroughs (Queens and Brooklyn perimeter zones).

---

## 5. Live Interactive Dashboard & Code Architecture

I deployed the live interactive platform using Streamlit & Next.js:

- **Live Application**: [the-city-is-a-machine.vercel.app](https://the-city-is-a-machine.vercel.app/)
- **GitHub Repository**: [github.com/pomagrenate/The-City-Is-a-Machine](https://github.com/pomagrenate/The-City-Is-a-Machine)

---

## 6. Reflections & Honest Limitations

- **Missing Uber/Lyft High-Volume For-Hire Data**: This study focused exclusively on Yellow Taxi TLC data. Adding FHV (Uber/Lyft) data would expand the scale to ~150M+ annual trips and test DuckDB's multi-file Parquet streaming limits further.
- **Single-Node Benchmark Limitation**: The PySpark benchmarks were run in `local[*]` mode on a single 8-core CPU machine rather than a multi-node AWS EMR cluster.
