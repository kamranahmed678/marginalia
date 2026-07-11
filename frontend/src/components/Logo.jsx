/**
 * Marginalia logo — a champagne-gold "spark" (a four-point star) set on a subtle
 * glass tile. Modern, premium, intelligence-coded. Distinct from the sibling
 * apps' satellite / radar marks.
 */
export function LogoMark({ size = 28, id = "mg" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECD6A4" />
          <stop offset="1" stopColor="#B0904C" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="31" height="31" rx="9" fill="rgba(255,255,255,0.05)" stroke="rgba(216,185,120,0.35)" />
      <path d="M16 5c1.1 7.6 2.4 8.9 10 10-7.6 1.1-8.9 2.4-10 10-1.1-7.6-2.4-8.9-10-10 7.6-1.1 8.9-2.4 10-10Z"
        fill={`url(#${id}-g)`} />
      <circle cx="24.5" cy="8" r="1.4" fill="#ECD6A4" opacity="0.9" />
    </svg>
  );
}

export default function Logo({ size = 28 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size} />
      <span className="font-display" style={{ fontSize: size * 0.82, letterSpacing: "-0.01em", lineHeight: 1 }}>
        Marginalia
      </span>
    </span>
  );
}
