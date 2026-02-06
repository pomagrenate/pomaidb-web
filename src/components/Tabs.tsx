"use client";

import { useState } from "react";
import styles from "./Tabs.module.css";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.tabs}>
      <div role="tablist" className={styles.tabList} aria-label="Quickstart tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={active === index}
            className={`${styles.tab} ${active === index ? styles.active : ""}`}
            onClick={() => setActive(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
