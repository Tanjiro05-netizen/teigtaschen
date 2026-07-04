/**
 * Hand-drawn style recreation of the Café Teigtaschen Bowls logo: a circle
 * crossed by a rolling pin carrying the wordmark. Draws with currentColor so
 * it adapts to any background (white over the hero video, ink on paper).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 310"
      className={className}
      role="img"
      aria-label="Café Teigtaschen Bowls"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Circle, interrupted by the rolling pin */}
        <path d="M 116 112 A 131 131 0 0 1 364 112" />
        <path d="M 113 190 A 131 131 0 0 0 367 190" />
        {/* Rolling pin body */}
        <rect x="70" y="110" width="340" height="80" rx="13" />
        {/* Handles */}
        <path d="M 70 138 L 44 136 Q 18 132 16 150 Q 18 168 44 164 L 70 162" />
        <path d="M 410 138 L 436 136 Q 462 132 464 150 Q 462 168 436 164 L 410 162" />
      </g>
      <g
        fill="currentColor"
        textAnchor="middle"
        style={{ fontFamily: "'Permanent Marker', 'Figtree', sans-serif" }}
      >
        <text x="240" y="92" fontSize="34" letterSpacing="8">
          CAFÉ
        </text>
        <text x="240" y="166" fontSize="46" letterSpacing="3">
          TEIGTASCHEN
        </text>
        <text x="240" y="242" fontSize="40" letterSpacing="10">
          BOWLS
        </text>
      </g>
    </svg>
  );
}
