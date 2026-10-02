import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PomaiKache - In-Memory Vector Cache in Pure C (5.9M ops/sec)",
  description:
    "An ultra-high-throughput, low-latency in-memory vector cache implemented in pure C with lock-free ring buffer ingestion and AVX-512 distance kernels.",
  alternates: {
    canonical: "/projects/pomailkache",
  },
  openGraph: {
    title: "PomaiKache - In-Memory Vector Cache in C | Quan Van",
    description:
      "Ultra-high-throughput vector caching engine written in pure C reaching 5.9M ops/sec peak ingestion.",
    url: "/projects/pomailkache",
    images: [{ url: "/images/pomaikache/chart_throughput.png" }],
  },
};

export { default } from "../pomaikache/page";
