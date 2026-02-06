import Link from "next/link";
import styles from "./Button.module.css";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  href,
  variant = "primary",
  children,
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${className ?? ""}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
