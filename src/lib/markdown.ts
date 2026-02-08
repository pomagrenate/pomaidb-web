const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPE[char] ?? char);
}

function renderInline(text: string) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderParagraph(lines: string[]) {
  if (lines.length === 0) return "";
  return `<p>${renderInline(lines.join(" "))}</p>`;
}

function renderList(items: string[], ordered: boolean) {
  const tag = ordered ? "ol" : "ul";
  const body = items.map((item) => `<li>${renderInline(item)}</li>`).join("");
  return `<${tag}>${body}</${tag}>`;
}

function renderTable(rows: string[][], header: string[]) {
  const headerHtml = `<thead><tr>${header.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>`;
  const bodyHtml = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<table>${headerHtml}<tbody>${bodyHtml}</tbody></table>`;
}

function parseTableLine(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let listOrdered = false;
  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer: string[] = [];

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
        const langClass = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : "";
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
      const blockLines: string[] = [];
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
      const rows: string[][] = [];
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
