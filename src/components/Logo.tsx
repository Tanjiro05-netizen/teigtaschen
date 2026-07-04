import logoInk from "../assets/logo-ink.png";
import logoCream from "../assets/logo-cream.png";

/**
 * The original Café Teigtaschen Bowls logo (rolling pin wordmark), prepared
 * in two tints: "ink" for light backgrounds, "cream" for the hero video and
 * dark surfaces.
 */
export function Logo({
  className = "",
  variant = "ink",
}: {
  className?: string;
  variant?: "ink" | "cream";
}) {
  return (
    <img
      src={variant === "ink" ? logoInk : logoCream}
      alt="Café Teigtaschen Bowls"
      width={1200}
      height={682}
      className={className}
    />
  );
}
