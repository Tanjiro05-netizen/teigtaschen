import { useEffect, useState } from "react";

const WOLT_URL = "https://wolt.com/de/deu/munich/restaurant/teigtaschen-bowls-cafe";

const links = [
  { href: "#ueber-uns", label: "Über uns" },
  { href: "#menue", label: "Bowls" },
  { href: "#karte", label: "Karte" },
  { href: "#standort", label: "Standort" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 text-foreground shadow-sm shadow-foreground/5 backdrop-blur-md"
          : "bg-transparent text-primary-foreground"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="#top" className="font-fraktur text-2xl font-medium leading-none">
          Teigtaschen Bowls
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={WOLT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            scrolled
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary-foreground/15 backdrop-blur-sm hover:bg-primary-foreground/25"
          }`}
        >
          Bestellen
        </a>
      </div>
    </header>
  );
}
