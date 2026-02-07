import styles from "./Badge.module.css";

type BadgeProps = {
  label: string;
  tone?: "red" | "green" | "neutral" | "purple";
};

export default function Badge({ label, tone = "neutral" }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{label}</span>;
}
