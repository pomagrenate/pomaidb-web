import React from 'react';

export function DocHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 pb-4 border-b border-emerald-900/30">
      {children}
    </h1>
  );
}

export function DocSubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-white/90 mt-12 mb-4">
      {children}
    </h2>
  );
}

export function DocParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-7 text-zinc-400 mb-6 max-w-none">
      {children}
    </p>
  );
}

export function DocCode({ children, language = "cpp" }: { children: React.ReactNode; language?: string }) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border border-emerald-900/30 bg-[#0a140a]">
      <div className="px-4 py-2 border-b border-emerald-900/30 bg-emerald-900/10 flex justify-between items-center">
        <span className="text-xs font-mono text-emerald-700 uppercase tracking-widest">{language}</span>
      </div>
      <pre className="p-6 overflow-x-auto">
        <code className={`language-${language} text-sm font-mono leading-relaxed text-[#c3e6cb]`}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function DocNote({ children, title = "Note" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="my-6 p-5 border-l-4 border-emerald-700/50 bg-emerald-900/15 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">{title}</span>
      </div>
      <div className="text-sm leading-6 text-zinc-400 italic">
        {children}
      </div>
    </div>
  );
}

export function DocList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside space-y-3 mb-8 text-zinc-400 text-base leading-7 marker:text-emerald-600">
      {children}
    </ul>
  );
}

export function DocHighlight({ children, title = "Technical Alert" }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="my-8 p-6 rounded-lg border border-emerald-900/40 bg-emerald-900/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-1 bg-emerald-600" />
        <span className="text-xs font-bold uppercase tracking-widest text-white/80">{title}</span>
      </div>
      <div className="text-sm leading-7 text-zinc-400">
        {children}
      </div>
    </div>
  );
}

export function DocTable({ headers, rows }: { headers: string[], rows: React.ReactNode[][] }) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-emerald-900/30">
      <table className="w-full text-left text-sm leading-6 border-collapse">
        <thead className="bg-emerald-900/20 border-b border-emerald-900/30">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4 font-bold text-white/80 first:pl-6">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-900/20">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-emerald-900/10 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4 text-zinc-400 align-top first:pl-6">{cell}</td>
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
    <div className="my-8 rounded-lg border border-emerald-900/30 bg-emerald-900/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-emerald-900/30 font-bold text-white/80 text-sm">
        {title}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-emerald-900/20">
        {specs.map((spec, i) => (
          <div key={i} className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">{spec.label}</span>
            <span className="font-mono text-sm text-zinc-300">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
