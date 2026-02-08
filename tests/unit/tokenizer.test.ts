import { describe, expect, it } from "vitest";
import { tokenize } from "@/lib/playground/tokenizer";

describe("tokenize", () => {
  it("is deterministic for same input", () => {
    const text = "PomaiDB deterministic tokens: vector search!";
    expect(tokenize(text)).toEqual(tokenize(text));
  });
});
