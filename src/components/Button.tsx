import Link from "next/link";
import styles from "./Button.module.css";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean; // <-- THÊM DÒNG NÀY
};

export default function Button({
  href,
  variant = "primary",
  children,
  className,
  onClick,
  type = "button",
  disabled = false, // <-- THÊM MẶC ĐỊNH
}: ButtonProps) {
  // Thêm class disabled nếu prop disabled = true
  const classes = `${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ""} ${className ?? ""}`;

  if (href) {
    // Nếu là Link mà bị disabled thì chặn click
    if (disabled) {
      return <span className={classes}>{children}</span>;
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      className={classes} 
      onClick={onClick}
      disabled={disabled} // <-- TRUYỀN XUỐNG DOM
    >
      {children}
    </button>
  );
}