import React from 'react';

export function DocHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-6 pb-4 border-b border-border">
      {children}
    </h1>
  );
}

export function DocSubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-foreground mt-12 mb-4">
      {children}
    </h2>
  );
}

export function DocParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-7 text-muted-foreground mb-6 max-w-none">
      {children}
    </p>
  );
}

export function DocCode({ children, language = "cpp" }: { children: React.ReactNode; language?: string }) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border bg-[#0d1117]">
      <div className="px-4 py-2 border-b border-border bg-muted/30 flex justify-between items-center">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{language}</span>
      </div>
      <pre className="p-6 overflow-x-auto">
        <code className={`language-${language} text-sm font-mono leading-relaxed text-[#e6edf3]`}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function DocNote({ children, title = "Note" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="my-6 p-5 border-l-4 border-primary bg-muted/40 rounded-r-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold uppercase tracking-wider text-primary">{title}</span>
      </div>
      <div className="text-sm leading-6 text-muted-foreground italic">
        {children}
      </div>
    </div>
  );
}

export function DocList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside space-y-3 mb-8 text-muted-foreground text-base leading-7 marker:text-primary">
      {children}
    </ul>
  );
}

export function DocHighlight({ children, title = "Technical Alert" }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="my-8 p-6 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-1 bg-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</span>
      </div>
      <div className="text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function DocTable({ headers, rows }: { headers: string[], rows: React.ReactNode[][] }) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full text-left text-sm leading-6 border-collapse">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4 font-bold text-foreground first:pl-6">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/20 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4 text-muted-foreground align-top first:pl-6">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocTechnicalSpec({ title, specs }: { title: string, specs: { label: string, value: string }[] }) {
  return (
    <div className="my-8 rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted/20 font-bold text-foreground">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-border">
        {specs.map((spec, i) => (
          <div key={i} className="p-4 flex flex-col gap-1">
            <span className="text-[10px] items-center font-bold uppercase tracking-widest text-muted-foreground">{spec.label}</span>
            <span className="font-mono text-sm text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
