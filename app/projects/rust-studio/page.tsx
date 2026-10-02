import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rust Studio - Native Rust IDE & Engineering Studio with Tauri",
  description:
    "A lightweight, native development studio built in Rust and Tauri with instantaneous cold boot times, low memory overhead, and integrated benchmarking.",
  alternates: {
    canonical: "/projects/rust-studio",
  },
  openGraph: {
    title: "Rust Studio - Native Rust IDE with Tauri | Quan Van",
    description:
      "A lightweight, native development studio engineered in Rust and Tauri for ultra-fast startup and responsive editing.",
    url: "/projects/rust-studio",
  },
};

export { default } from "../pomai-studio/page";
