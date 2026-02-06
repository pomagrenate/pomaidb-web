import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pomai: {
          red: "var(--pomai-red)",
          green: "var(--pomai-green)",
          slate: "var(--pomai-slate)",
          bg: "var(--pomai-bg)",
          surface: "var(--pomai-surface)",
        },
      },
      borderRadius: {
        pomai: "var(--radius-xl)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(195, 40, 61, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
