---
title: "Why Does Segmentation Need Multiple Scales?"
slug: "why-segmentation-needs-multiple-scales"
series: "Computer Vision Engineering Notes"
date: "2026-08-31"
author: "Quan Van"
excerpt: "I started looking at segmentation architectures from a different angle: the real problem is not simply predicting a class for every pixel, but preserving enough spatial information while building representations with a sufficiently large receptive field."
category: "Artificial Intelligence"
tags:
  - "AI"
  - "Computer Vision"
  - "Image Segmentation"
  - "Deep Learning"
  - "CNN"
  - "Feature Pyramid"
  - "Multi-Scale Learning"
  - "Computer Vision Engineering"
---

# Why Does Segmentation Need Multiple Scales?

## The Spatial Resolution Problem Behind Modern Segmentation

> **Senior Computer Vision Question**
>
> **"Why can't we simply use the deepest feature map to perform segmentation?"**

This is one of those questions where the first answer sounds obvious:

```text
Because deep features lose spatial information.
```

That's correct.

But it isn't the complete answer.

I wanted to understand **why** this happens mathematically, and more importantly:

> **What exactly are we trading away when we repeatedly downsample an image?**

Once I started looking at segmentation through that lens, architectures such as U-Net, FPN, DeepLab, and other multi-scale designs became much easier to reason about.

The core problem is a tension between:

```text
semantic abstraction
```

and:

```text
spatial precision
```

And segmentation needs both.

---

# 1. Start With a Simple Image

![Mathematical Mechanics of Multi-Scale Pooling](/images/blog/pooling_mechanics_academic.png)

Suppose the input is:

$$
X \in \mathbb{R}^{H \times W \times C}
$$

For an RGB image ($C = 3$), let's say $H = W = 1024$. So:

$$
X \in \mathbb{R}^{1024 \times 1024 \times 3}
$$

Now imagine the target contains a very thin structure.

At the original resolution, it might occupy only 2–4 pixels in width.

That detail is small spatially, but it can be semantically important.

This is where the problem begins.

---

# 2. Downsampling Changes the Representation

Suppose a network performs four stages of downsampling:

```text
1024 × 1024
       ↓
512 × 512
       ↓
256 × 256
       ↓
128 × 128
       ↓
64 × 64
```

The deepest feature map now has only:

```text
64 × 64
```

spatial positions.

That doesn't necessarily mean the network has become "blind".

Instead, each position in the deep feature map can represent information from a much larger region of the original image.

This is useful.

But there is a cost.

---

# 3. One Deep Feature Represents a Larger Area

Imagine the simplest possible case.

Suppose every downsampling operation reduces resolution by:

```text
factor = 2
```

After four stages:

```text
2⁴ = 16
```

So one spatial step in the final feature map corresponds roughly to:

```text
16 × 16
```

input pixels in terms of sampling stride.

Conceptually:

```text
Input:

[16 × 16 region]
        ↓
     one cell

Deep feature map:

[1 cell]
```

The network now has a much broader spatial field per feature location.

That is useful for understanding large structures.

But it also means that a thin boundary occupying only a few input pixels becomes difficult to represent precisely.

---

# 4. Semantic Understanding Wants Larger Receptive Fields

Imagine a pixel with intensity:

```text
0.5
```

By itself, that tells us very little.

But its neighborhood might look like:

```text
background
background
edge
object
object
```

A larger receptive field lets the network understand the broader structure.

We can think of a hierarchy:

```text
small receptive field
        ↓
edges
        ↓
textures
        ↓
parts
        ↓
objects
        ↓
global context
```

This is one reason deep CNNs progressively build more abstract features.

---

# 5. But Localization Wants High Resolution

Now consider a segmentation boundary.

Suppose the actual boundary is:

```text
██████████
██████████
██████████
```

and the model predicts:

```text
█████████
█████████
█████████
```

The difference may only be a few pixels.

For segmentation, those pixels matter.

So we have two competing requirements:

```text
Large receptive field
        ↓
better context
```

versus:

```text
High spatial resolution
        ↓
better localization
```

This is the central architectural tension.

---

# 6. Why Classification Can Get Away With More Downsampling

Consider image classification.

The final question is:

```text
"What is in this image?"
```

If the object is shifted slightly:

```text
+2 pixels
```

the classification may remain unchanged.

The exact boundary is usually irrelevant.

So a classifier can aggressively compress spatial information.

Eventually it can reach something like:

```text
global feature vector
```

and predict:

```text
cat = 0.97
dog = 0.02
other = 0.01
```

Segmentation cannot do that.

It needs:

```text
class
+
location
```

for every pixel.

---

# 7. The Output Has the Same Spatial Problem

Suppose the deepest representation is:

$$
F \in \mathbb{R}^{64 \times 64 \times D}
$$

but our desired output mask is:

$$
Y \in \mathbb{R}^{1024 \times 1024 \times K}
$$

We need to reconstruct spatial resolution.

That means the decoder has to transform:

```text
64 × 64
```

into:

```text
1024 × 1024
```

But there is an important question:

> **Can we reconstruct information that was never preserved?**

Generally, no.

Interpolation can create new samples.

It cannot magically recover exact details that were discarded during earlier transformations.

---

# 8. Interpolation Is Not Information Recovery

Suppose we have:

```text
A = [1 3]
```

and upsample it.

We can interpolate:

```text
1 → 2 → 3
```

But the value:

```text
2
```

was not actually observed in the original representation.

It was constructed from neighboring values.

The same principle applies to feature maps.

If a thin structure disappeared from a representation, ordinary upsampling cannot know its exact original geometry unless that information survived somewhere else.

This is one reason skip connections are useful.

---

# 9. Skip Connections Preserve Earlier Information

A U-Net-like architecture can be visualized as:

```text
Input
  │
  ▼
Encoder ───────────────┐
  │                    │
  ▼                    │
Encoder ───────────┐   │
  │                │   │
  ▼                │   │
Bottleneck         │   │
  │                │   │
  ▼                │   │
Decoder ◄──────────┘   │
  │                    │
  ▼                    │
Decoder ◄──────────────┘
  │
  ▼
Mask
```

The important part isn't the exact diagram.

It's the information flow.

The decoder doesn't have to reconstruct everything from the deepest representation.

It can reuse earlier features.

---

# 10. Two Types of Information

This gives us a useful abstraction.

Early features tend to preserve more:

```text
spatial detail
edges
local structure
```

while deeper features tend to represent more:

```text
semantic abstraction
context
larger structures
```

So we can think of:

```text
Early feature:
"Where exactly is the structure?"

Deep feature:
"What kind of structure is this?"
```

Segmentation needs both.

---

# 11. Feature Fusion

Suppose:

```text
F_high
```

is a deep feature map after upsampling.

And:

```text
F_low
```

is an earlier high-resolution feature map.

A common operation is:

```text
F =
Concat(
    F_low,
    Upsample(F_high)
)
```

The resulting representation contains information from two different scales.

Conceptually:

```text
F_low
   +
semantic context
   =
multi-scale representation
```

This is the fundamental idea behind many encoder-decoder and pyramid architectures.

---

# 12. Why Call It Multi-Scale?

Because the same object can appear at different spatial scales.

Imagine:

```text
small object
medium object
large object
```

A single feature scale may not represent them equally well.

Suppose:

```text
small object → 5 × 5 pixels
large object → 300 × 300 pixels
```

These are fundamentally different spatial patterns.

A multi-scale representation lets the model process information at multiple resolutions.

---

# 13. Feature Pyramid Networks

A Feature Pyramid Network introduces a hierarchy such as:

```text
P2
P3
P4
P5
```

where each level represents a different spatial scale.

Conceptually:

```text
High resolution
      │
      ├── fine details
      │
      ▼
Lower resolution
      │
      ├── larger structures
      │
      ▼
Deep semantic representation
```

The exact architecture varies, but the underlying motivation is consistent:

> **Combine semantic information across spatial scales.**

---

# 14. Why Can't We Just Use P5?

Suppose:

```text
P5
```

contains strong semantic information.

But its spatial resolution is low.

Now imagine a tiny object.

At `P5`, it might occupy:

```text
1 × 1
```

or a similarly tiny region.

There is very little room to describe its geometry.

At:

```text
P2
```

the same object may occupy:

```text
16 × 16
```

or more.

Now there is much more spatial structure available.

So different pyramid levels provide different useful views of the same image.

---

# 15. This Is More Than an Architecture Trick

The deeper idea is:

```text
Representation should match the spatial scale of the problem.
```

A thin filament, a human body, and an entire road scene exist at very different scales.

Trying to force all of them into one spatial representation can be inefficient.

Multi-scale architectures instead maintain several representations.

---

# 16. But Multi-Scale Features Create Another Problem

If we have:

```text
P2
P3
P4
P5
```

we now need to combine them.

They don't necessarily have the same:

```text
height
width
channel count
semantic level
```

So feature fusion becomes an engineering problem.

For example:

```text
P2 ∈ R^(256 × 256 × C2)

P3 ∈ R^(128 × 128 × C3)

P4 ∈ R^(64 × 64 × C4)

P5 ∈ R^(32 × 32 × C5)
```

We cannot directly concatenate them.

We need transformations.

---

# 17. Aligning Spatial Dimensions

Suppose:

```text
P5 = 32 × 32
```

and we want to combine it with:

```text
P4 = 64 × 64
```

We can upsample:

```text
Upsample(P5)
```

so:

```text
32 × 32
      ↓
64 × 64
```

Now spatial dimensions match.

Then we can combine:

```text
P4 + Upsample(P5)
```

or concatenate them.

This creates a top-down information path.

---

# 18. Aligning Channel Dimensions

Suppose:

```text
P4 ∈ R^(64 × 64 × 512)
```

while:

```text
P5 ∈ R^(32 × 32 × 1024)
```

Even after upsampling:

```text
Upsample(P5)
```

we still have:

```text
64 × 64 × 1024
```

while `P4` has:

```text
64 × 64 × 512
```

A `1 × 1` convolution can project channels:

```text
1024 → 512
```

Then:

```text
P4 + Project(Upsample(P5))
```

becomes possible.

This is an important pattern:

```text
spatial alignment
+
channel alignment
=
feature fusion
```

---

# 19. Why a 1×1 Convolution Is Useful

A `1 × 1` convolution sounds trivial.

But mathematically it performs a learned linear transformation across channels.

Suppose a pixel has:

```text
x ∈ R^C
```

A `1 × 1` convolution can perform:

```text
y = Wx + b
```

where:

```text
W ∈ R^(C_out × C_in)
```

So it can change:

```text
C_in → C_out
```

without changing spatial dimensions.

That makes it useful for feature projection and fusion.

---

# 20. Multi-Scale Representation Is a Form of Information Routing

At this point I started thinking about pyramids less as:

```text
"four feature maps"
```

and more as:

```text
different information pathways
```

For example:

```text
High-resolution path
    ↓
local geometry

Mid-resolution path
    ↓
parts / structures

Low-resolution path
    ↓
global semantic context
```

The architecture decides how information flows between these scales.

That is a much more useful way to read an architecture diagram.

---

# 21. Why Thin Objects Are Especially Difficult

Consider an object whose width is only:

```text
2 pixels
```

At input resolution:

```text
████████████
██
████████████
```

Now suppose we downsample by:

```text
2×
```

The structure becomes much smaller relative to the feature grid.

After repeated downsampling, the model may no longer have enough spatial samples to represent the exact geometry.

This isn't necessarily a failure of "AI intelligence."

It's partly a representation problem.

The information has been compressed.

---

# 22. This Is an Information Bottleneck

We can think of the encoder as:

```text
X
 ↓
F₁
 ↓
F₂
 ↓
F₃
 ↓
F₄
```

where:

```text
dim(F₄) << dim(X)
```

The representation is compressed.

Compression is useful because it forces the model to retain useful structure rather than every raw input value.

But segmentation asks for something unusual:

> **Compress the image enough to understand it, but preserve enough information to reconstruct precise boundaries.**

That's why segmentation architectures are fundamentally concerned with information flow.

---

# 23. This Explains the Encoder-Decoder Design

The encoder does:

```text
resolution ↓
semantic abstraction ↑
receptive field ↑
```

The decoder does:

```text
resolution ↑
spatial reconstruction
feature fusion
```

So the architecture is not arbitrary.

It reflects the underlying mathematical requirements.

---

# 24. Why Transformer-Based Segmentation Changes the Details

Modern architectures may replace standard CNN processing with attention-based mechanisms.

Instead of only computing local convolutional neighborhoods, self-attention can model relationships between tokens.

A simplified attention formulation is:

```text
Attention(Q,K,V)
=
Softmax(
    QKᵀ / √d
) V
```

where:

```text
Q = queries
K = keys
V = values
d = feature dimension
```

Now a token can interact with other tokens.

That changes how the model builds context.

But the segmentation problem doesn't disappear.

We still need:

```text
semantic representation
+
spatial localization
```

So the representation-resolution trade-off remains relevant.

---

# 25. Attention Does Not Magically Solve Resolution

This is an important distinction.

Changing:

```text
CNN
```

to:

```text
Transformer
```

does not remove the need to reason about spatial representation.

If the input is aggressively reduced into tokens, spatial detail can still be lost.

If the model maintains high-resolution representations everywhere, computation can become expensive.

So the engineering problem remains:

```text
How much spatial information should we preserve,
and at what computational cost?
```

---

# 26. The Computational Cost Is Also Part of the Problem

Suppose spatial resolution is:

```text
H × W
```

A feature map with:

```text
1024 × 1024
```

contains:

```text
1,048,576
```

spatial positions.

Now compare:

```text
512 × 512 = 262,144
```

and:

```text
256 × 256 = 65,536
```

Every reduction changes the computational and memory requirements.

So maintaining high resolution isn't free.

This creates another trade-off:

```text
spatial precision
        ↕
memory / compute
```

---

# 27. This Is Why Input Resolution Is an Architectural Decision

It is tempting to think:

```text
Higher resolution = better segmentation
```

But the complete statement is more complicated.

Higher resolution provides:

```text
more spatial information
```

but also increases:

```text
memory
compute
activation size
training cost
inference cost
```

So the correct engineering question is not:

> "Should I always use the highest resolution?"

It is:

> **"What spatial resolution is necessary for the smallest meaningful structure in my task, and can my architecture afford it?"**

That is a much better question.

---

# 28. Tile-Based Processing Is Another Consequence

Suppose the original image is:

```text
2048 × 2048
```

but the model is designed around:

```text
1024 × 1024
```

One possible strategy is:

```text
2048 × 2048
      ↓
┌──────────┬──────────┐
│  Tile 1  │  Tile 2  │
├──────────┼──────────┤
│  Tile 3  │  Tile 4  │
└──────────┴──────────┘
```

Now the model preserves higher local resolution.

But another problem appears:

```text
What happens at tile boundaries?
```

An object can cross from:

```text
Tile A
```

into:

```text
Tile B
```

Now local processing may not have enough global context.

So tiling introduces another trade-off:

```text
local resolution
        ↕
global context
```

---

# 29. Overlapping Tiles

One possible engineering solution is overlapping tiles:

```text
┌──────────────┐
│     Tile A   │
│       ┌──────────────┐
│       │    Tile B    │
│       └──────────────┘
└──────────────┘
```

The overlap gives objects near boundaries more context.

After inference, predictions can be merged.

This introduces additional questions:

```text
How much overlap?
How are conflicting predictions merged?
How are probabilities weighted?
How are boundaries handled?
```

These are not model questions alone.

They are pipeline questions.

---

# 30. Segmentation Quality Is Therefore a System Property

This is an important shift in perspective.

It is tempting to compare:

```text
Model A
vs
Model B
```

as if the architecture alone determines the result.

But the actual system may be:

```text
input resolution
+
preprocessing
+
tiling
+
model
+
feature fusion
+
post-processing
+
threshold
+
mask merging
```

The final segmentation depends on the entire pipeline.

---

# 31. The Mask Is the End of an Information Journey

I now find it useful to think about segmentation this way:

```text
Raw Pixels
    ↓
Local Features
    ↓
Intermediate Features
    ↓
Semantic Features
    ↓
Multi-Scale Fusion
    ↓
High-Resolution Reconstruction
    ↓
Pixel Probabilities
    ↓
Discrete Mask
```

At every stage we are deciding:

```text
What information should be preserved?
What information can be compressed?
What information should be combined?
```

That is the deeper architecture problem.

---

# What I Learned

The biggest lesson for me is that segmentation isn't simply:

```text
classification + pixels
```

It is an information-preservation problem.

The model needs to simultaneously maintain:

```text
"What is this?"
```

and:

```text
"Exactly where is it?"
```

Those requirements pull the architecture in different directions.

Deep low-resolution features are useful because they provide:

```text
context
abstraction
large receptive fields
```

while high-resolution features provide:

```text
localization
boundaries
fine structures
```

Multi-scale architectures exist largely because both kinds of information are valuable.

---

# What Surprised Me

What surprised me most is how much of the segmentation problem can be understood before looking at any specific architecture.

Once I reduce the problem to:

```text
receptive field
+
sampling
+
resolution
+
information loss
+
feature fusion
```

many architectural decisions stop looking arbitrary.

U-Net's skip connections make sense.

Feature pyramids make sense.

Decoder stages make sense.

High-resolution branches make sense.

Even tiling becomes understandable as another attempt to control the same trade-off.

---

# What I Would Explore Next

There are several things I would want to test experimentally before making quantitative claims:

```text
1. How much does thin-object IoU change with input resolution?

2. At what downsampling ratio do thin structures become unstable?

3. How much do skip connections improve boundary quality?

4. How does tile overlap affect objects crossing tile boundaries?

5. What is the memory cost of maintaining high-resolution features?

6. Does multi-scale fusion improve small-object recall enough to justify the cost?

7. How does a CNN backbone compare with a hierarchical transformer
   under the same resolution and compute budget?

8. How much segmentation quality is actually recovered by
   post-processing versus the neural model itself?
```

I haven't run those experiments here, so I won't present hypothetical numbers as results.

Those are questions I would benchmark.

---

# The Interview Question

> **"Why do segmentation architectures use multi-scale features instead of relying only on the deepest feature map?"**

A strong answer I'd give is:

> "Because the deepest feature map provides strong semantic context but usually has low spatial resolution due to progressive downsampling. That makes it difficult to precisely localize small structures and boundaries. Earlier feature maps preserve higher-resolution spatial information, while deeper maps provide larger receptive fields and stronger semantic abstraction. Multi-scale architectures therefore fuse representations from different resolutions so the model can use both semantic context and spatial detail. The trade-off is computational and memory cost, so the architecture has to decide where high-resolution representations are worth maintaining."

---

# Final Thought

When I look at a segmentation model now, I don't want to start by asking:

```text
"What architecture is this?"
```

I want to ask:

```text
Where is spatial information lost?

Where is semantic information created?

How large is the receptive field?

At what resolution does each feature live?

How are different scales aligned?

Where are features fused?

How is high-resolution information recovered?

What happens to structures smaller than the model's effective stride?
```

Those questions reveal the architecture's actual design decisions.

The diagram is only the surface.

## The interesting part is the information flow underneath it.

*This post is part of my ongoing exploration of computer vision, AI engineering, and the mathematical reasoning behind the systems I build and study.*
