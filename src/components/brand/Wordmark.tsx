import styles from "./brand.module.css";

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`${styles.wordmark} ${className}`}>Hackistan</span>;
}
