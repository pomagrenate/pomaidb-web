---
title: "Strategic Informatics: A Formal Investigation into Undersampling Mechanisms for Imbalanced Classification"
slug: "undersampling"
date: "2026-04-09"
author: "Scientific Research Team"
excerpt: "A technical exploration of majority class reduction strategies. This paper formalizes Random Undersampling, the NearMiss heuristic suite, and Tomek Link boundary cleaning for optimizing inference in high-imbalance network traffic datasets."
tags: ["Machine Learning", "Data Science", "Imbalanced Learning", "Mathematics"]
category: "Scientific Research"
---

![Undersampling and Boundary Refinement Visualization](/images/blog/undersampling_mechanics_academic.png)

While oversampling techniques like SMOTE augment the minority class, **Undersampling** serves as an indispensable counter-strategy by strategically reducing the majority class distribution. In large-scale datasets—such as those encountered in **Network Intrusion Detection System (NIDS)** research—undersampling is critical for managing computational complexity and preventing the classifier from being overwhelmed by the majority distribution. This paper formalizes the primary algorithmic approaches to undersampling.

---

## 1. Stochastic Selection: Random Undersampling

The most primitive form of undersampling involves the non-heuristic, stochastic removal of majority samples. To achieve a perfectly balanced distribution, we select a subset of $N_{majority}$ samples equal to $N_{minority}$.

The probability of any given majority sample $x \in X_{maj}$ being included in the final training partition $X'_{tr}$ is:
$$P(x \in X'_{tr}) = \frac{N_{minority}}{N_{majority}}$$

**Risk Analysis**: While computationally efficient, Random Undersampling suffers from **Information Loss**. By discarding potentially informative majority samples, the model may fail to capture the full variance of the "Normal" class, leading to a diminished Decision Boundary.

---

## 2. Proximity-Based Heuristics: The NearMiss Suite

To mitigate the randomness of sample removal, the **NearMiss** family of algorithms utilizes $k$-Nearest Neighbors ($k$-NN) to retain majority samples that are "informative" based on their proximity to the minority class.

### NearMiss-1: Boundary Proximity
Retains majority samples that have the **minimum average distance** to the $k$ nearest minority samples.
$$\text{Score}(M_i) = \frac{1}{k} \sum_{j=1}^{k} \text{dist}(M_i, m_j)$$
Goal: Select majority points that are closest to the minority region (boundary focus).

### NearMiss-2: Global Proximity
Retains majority samples that have the **minimum average distance** to the $k$ *farthest* minority samples.
Goal: Select majority points that are centrally located within the minority manifold's global span.

---

## 3. Boundary Cleaning: Tomek Links

Tomek Links represent a more sophisticated, "cleaning" approach to undersampling. A pair of samples $(M, m)$ from different classes—where $M \in \text{Majority}$ and $m \in \text{Minority}$—is defined as a **Tomek Link** if they are each other's nearest neighbors.

Formally, $(M, m)$ is a Tomek Link if:
$$\forall x \in X, \text{dist}(M, m) < \text{dist}(M, x) \text{ and } \text{dist}(m, M) < \text{dist}(m, x)$$

**Resolution Strategy**: By removing the majority sample $M$ in every Tomek Link pair, we effectively increase the "margin" between classes. This process reduces overlap and clarifies the Decision Boundary for architectures like CNNs or LSTMs, which are sensitive to local noise.

---

## 4. Hybrid Strategies and Case Optimization

In high-stakes domains like the **Moore Network Traffic Dataset**, a singular approach often suffices poorly. Instead, a **Hybrid Pipeline** is recommended:

1.  **Denoising**: Apply Tomek Links to remove contradictory majority samples at the boundary.
2.  **Augmentation**: Apply SMOTE to synthesize high-variance minority samples.
3.  **Balancing**: Apply Random Undersampling to align the final class counts.

| Metric | SMOTE (Oversampling) | Undersampling |
| :--- | :--- | :--- |
| **Data Integrity** | Synthetic generation. | Empirical removal. |
| **Computational Cost** | High (Increased $N$). | **Low (Reduced $N$).** |
| **Principal Risk** | Overfitting (Noise synthesis). | **Underfitting (Information loss).** |
| **Primary Use Case** | Sparse minority distributions. | Massive majority distributions (Big Data). |

---

## 5. Architectural Conclusion

Undersampling is not merely a method of data reduction, but a strategic tool for **Informative Sampling**. By leveraging NearMiss heuristics or Tomek Link cleaning, practitioners can ensure that the model remains computationally efficient while focusing its learning capacity on the most discriminative regions of the feature space.

> [!TIP]
> **Implementation Note**: When using `imbalanced-learn`, versioning is critical. `NearMiss(version=1)` focuses on local boundary points, which is generally superior for complex, non-linear boundaries in network security datasets.