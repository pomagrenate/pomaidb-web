import React from "react";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <div className="bg-[#FAFAF8] text-[#171717] min-h-screen">
      {/* Editorial Page Header */}
      <header className="border-b border-[#EAEAEA] bg-white py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6D5DFB] text-xs font-semibold tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-[#6D5DFB]" />
              <span>{eyebrow}</span>
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#171717] leading-tight max-w-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base sm:text-lg text-[#525252] max-w-2xl font-normal leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </header>

      {/* Main Page Content Body */}
      <div>{children}</div>
    </div>
  );
}
