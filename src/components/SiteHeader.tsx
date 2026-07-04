import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const WOLT_URL = "https://wolt.com/de/deu/munich/restaurant/teigtaschen-bowls-cafe";

const links = [
  { href: "#ueber-uns", label: "Über uns" },
  { href: "#menue", label: "Bowls" },
  { href: "#karte", label: "Karte" },
  { href: "#standort", label: "Standort" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-border/60 bg-background/85 text-foreground shadow-sm shadow-foreground/5 backdrop-blur-md"
          : "bg-transparent text-primary-foreground"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <a href="#top" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo className="h-12 w-auto sm:h-14" />
          <span className="sr-only">Café Teigtaschen Bowls – nach oben</span>
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

        <div className="flex items-center gap-2">
          <a
            href={WOLT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              solid
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-primary-foreground/15 backdrop-blur-sm hover:bg-primary-foreground/25"
            }`}
          >
            Bestellen
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-0.5 w-6 rounded bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-6 rounded bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-6 rounded bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="border-t border-border/60 bg-background/95 text-foreground backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-base font-medium last:border-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
