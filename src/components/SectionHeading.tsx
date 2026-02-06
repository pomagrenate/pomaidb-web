import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${styles[align]}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
