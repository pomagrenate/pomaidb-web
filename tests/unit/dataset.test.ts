import { describe, expect, it } from "vitest";
import { generateNormalDataset } from "@/lib/playground/datasets";
import { DEFAULT_NORMAL_CONFIG } from "@/lib/playground/config";

describe("generateNormalDataset", () => {
  it("is deterministic for same seed", () => {
    const config = { ...DEFAULT_NORMAL_CONFIG, size: 100, dim: 32, seed: 42 };
    const first = generateNormalDataset(config);
    const second = generateNormalDataset(config);
    expect(Array.from(first.ids.slice(0, 10))).toEqual(Array.from(second.ids.slice(0, 10)));
    expect(Array.from(first.labels.slice(0, 10))).toEqual(Array.from(second.labels.slice(0, 10)));
    expect(Array.from(first.vectors.slice(0, 32))).toEqual(Array.from(second.vectors.slice(0, 32)));
  });
});
