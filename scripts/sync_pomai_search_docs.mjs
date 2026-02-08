import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const sourceRoot = path.join(root, "third_party", "pomaisearch");
const configPath = path.join(root, "scripts", "pomai_search_docs.config.json");
const outputPath = path.join(root, "src", "lib", "pomaiSearchDocs.generated.ts");

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const HTML_ESCAPE = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(input) {
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPE[char] ?? char);
}

function renderInline(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderParagraph(lines) {
  if (!lines.length) return "";
  return `<p>${renderInline(lines.join(" "))}</p>`;
}

function renderList(items, ordered) {
  const tag = ordered ? "ol" : "ul";
  const body = items.map((item) => `<li>${renderInline(item)}</li>`).join("");
  return `<${tag}>${body}</${tag}>`;
}

function renderTable(rows, header) {
  const headerHtml = `<thead><tr>${header.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>`;
  const bodyHtml = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<table>${headerHtml}<tbody>${bodyHtml}</tbody></table>`;
}

function parseTableLine(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;
  let paragraphBuffer = [];
  let listBuffer = [];
  let listOrdered = false;
  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      html.push(renderParagraph(paragraphBuffer));
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length) {
      html.push(renderList(listBuffer, listOrdered));
      listBuffer = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        flushParagraph();
        flushList();
        inCodeBlock = true;
        codeLang = trimmed.replace(/```/, "").trim();
        codeBuffer = [];
      } else {
        const code = escapeHtml(codeBuffer.join("\n"));
        const langClass = codeLang ? ` class=\"language-${escapeHtml(codeLang)}\"` : "";
        html.push(`<pre><code${langClass}>${code}</code></pre>`);
        inCodeBlock = false;
        codeLang = "";
        codeBuffer = [];
      }
      i += 1;
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      i += 1;
      continue;
    }

    if (trimmed === "") {
      flushParagraph();
      flushList();
      i += 1;
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      const level = trimmed.match(/^#{1,6}/)?.[0].length ?? 2;
      const content = trimmed.replace(/^#{1,6}\s+/, "");
      html.push(`<h${level}>${renderInline(content)}</h${level}>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      flushList();
      const blockLines = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        blockLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      html.push(`<blockquote>${blockLines.map((text) => renderParagraph([text])).join("")}</blockquote>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      if (!listBuffer.length || !listOrdered) {
        flushList();
        listOrdered = true;
      }
      listBuffer.push(trimmed.replace(/^\d+\.\s+/, ""));
      i += 1;
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph();
      if (!listBuffer.length || listOrdered) {
        flushList();
        listOrdered = false;
      }
      listBuffer.push(trimmed.replace(/^-\s+/, ""));
      i += 1;
      continue;
    }

    if (trimmed.includes("|") && i + 1 < lines.length && /\|?\s*[-:]+/.test(lines[i + 1])) {
      flushParagraph();
      flushList();
      const header = parseTableLine(trimmed);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(parseTableLine(lines[i]));
        i += 1;
      }
      html.push(renderTable(rows, header));
      continue;
    }

    paragraphBuffer.push(trimmed);
    i += 1;
  }

  flushParagraph();
  flushList();

  return html.join("");
}

function readSource(relativePath) {
  const filePath = path.join(sourceRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing source file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function getSourceSha() {
  try {
    return execSync("git rev-parse HEAD", { cwd: sourceRoot }).toString().trim();
  } catch (error) {
    return "unknown";
  }
}

function buildDocs() {
  const pages = {};
  for (const [key, relativePath] of Object.entries(config)) {
    const markdown = readSource(relativePath);
    pages[key] = markdownToHtml(markdown);
  }
  return pages;
}

function buildOutput({ pages, sha, lastUpdated }) {
  const pageEntries = Object.entries(pages)
    .map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`)
    .join("\n");
  return `/*\n * GENERATED FILE — DO NOT EDIT.\n *\n * Source of truth: third_party/pomaisearch (docs + README).\n * Run: node scripts/sync_pomai_search_docs.mjs\n */\n\nexport const pomaiSearchDocs = {\n  source: {\n    repo: \"third_party/pomaisearch\",\n    sha: \"${sha}\",\n    lastUpdated: \"${lastUpdated}\",\n  },\n  pages: {\n${pageEntries}\n  },\n} as const;\n\nexport type PomaiSearchDocKey = keyof typeof pomaiSearchDocs.pages;\n`;
}

function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error("Pomai Search submodule not found. Run: git submodule update --init --recursive");
  }

  const pages = buildDocs();
  const sha = getSourceSha();
  const lastUpdated = new Date().toISOString().split("T")[0];
  const output = buildOutput({ pages, sha, lastUpdated });

  if (process.argv.includes("--check")) {
    if (!fs.existsSync(outputPath)) {
      throw new Error("Generated docs file missing. Run sync first.");
    }
    const existing = fs.readFileSync(outputPath, "utf8");
    if (existing !== output) {
      throw new Error("Pomai Search docs are out of date. Run: node scripts/sync_pomai_search_docs.mjs");
    }
    return;
  }

  fs.writeFileSync(outputPath, output);
}

main();
