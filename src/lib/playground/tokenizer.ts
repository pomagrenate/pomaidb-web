import { hashString, mulberry32 } from "./random";

const TOKEN_REGEX = /[a-z0-9]+/gi;

export function tokenize(text: string) {
  const tokens = text.toLowerCase().match(TOKEN_REGEX);
  return tokens ? tokens : [];
}

export function demoEmbed(text: string, dim: number, seed: number) {
  const tokens = tokenize(text);
  return embedTokens(tokens, dim, seed);
}

export function embedTokens(tokens: string[], dim: number, seed: number) {
  const vector = new Float32Array(dim);
  if (tokens.length === 0) {
    return vector;
  }
  for (const token of tokens) {
    const hash = hashString(token);
    const rand = mulberry32(hash ^ seed);
    for (let i = 0; i < dim; i += 1) {
      vector[i] += rand() * 2 - 1;
    }
  }
  const scale = 1 / Math.sqrt(tokens.length);
  for (let i = 0; i < dim; i += 1) {
    vector[i] *= scale;
  }
  return vector;
}
