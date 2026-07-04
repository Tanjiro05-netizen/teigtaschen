/**
 * Decorative alpine mountain silhouette used to blend a section into the one
 * below it. Color the peaks via `text-*` (should match the next section's
 * background) and place it directly above that section.
 */
export function AlpineDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-14 w-full sm:h-20"
      >
        <path
          d="M0 120 L180 62 L300 92 L470 38 L620 96 L790 52 L960 100 L1120 60 L1280 92 L1440 48 L1440 120 Z"
          fill="currentColor"
          opacity="0.35"
        />
        <path
          d="M0 120 L240 70 L380 98 L540 48 L700 104 L880 60 L1060 106 L1230 72 L1440 100 L1440 120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
