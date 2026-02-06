"use client";

import { useState } from "react";
import styles from "./CodeBlock.module.css";

type CodeBlockProps = {
  language?: string;
  code: string;
  caption?: string;
};

export default function CodeBlock({ language, code, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.language}>{language ?? "text"}</span>
        {caption && <span className={styles.caption}>{caption}</span>}
        <button
          className={styles.copy}
          onClick={handleCopy}
          aria-live="polite"
          aria-label="Copy code to clipboard"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
