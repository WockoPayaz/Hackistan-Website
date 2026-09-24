export function Arrow({ direction = "down" }: { direction?: "down" | "up" | "right" }) {
  const rotations = { down: "0deg", up: "180deg", right: "-90deg" };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${rotations[direction]})` }}>
      <path d="M12 3V21M4 13L12 21L20 13" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
