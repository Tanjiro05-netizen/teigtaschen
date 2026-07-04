import { createFileRoute } from "@tanstack/react-router";
import { ScrollVideoHero } from "../components/ScrollVideoHero";
import { Reveal } from "../components/Reveal";
import bowlBeef from "../assets/bowl-beef.jpg";
import bowlVeggie from "../assets/bowl-veggie.jpg";
import desserts from "../assets/desserts.jpg";
import drinks from "../assets/drinks.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const WOLT_URL = "https://wolt.com/de/deu/munich/restaurant/teigtaschen-bowls-cafe";

type Tag = "vegan" | "vegetarisch" | "glutenfrei";

const tagStyles: Record<Tag, string> = {
  vegan: "bg-accent/15 text-accent",
  vegetarisch: "bg-accent/15 text-accent",
  glutenfrei: "bg-primary/15 text-primary",
};

function Badges({ tags }: { tags: Tag[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className={`rounded-full px-3 py-1 text-xs font-medium ${tagStyles[t]}`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const bowls: {
  name: string;
  desc: string;
  price: string;
  img: string;
  tags: Tag[];
}[] = [
  {
    name: "Teigtaschen mit Rindfleisch",
    desc: "mit Gemüsesoße, Gemüsereis, Krautsalat, Buchweizen-Gemüse, Karottensalat & Zwiebelkonfitüre",
    price: "15,99 €",
    img: bowlBeef,
    tags: [],
  },
  {
    name: "Teigtaschen mit Kartoffel-Pilz",
    desc: "cremige Kartoffel-Pilz-Füllung mit frischen Beilagen deiner Wahl",
    price: "14,99 €",
    img: bowlVeggie,
    tags: ["vegan"],
  },
  {
    name: "Teigtaschen mit Kraut & Paprika",
    desc: "würzige Kraut-Paprika-Füllung, serviert in deiner Wunsch-Bowl",
    price: "14,99 €",
    img: bowlVeggie,
    tags: ["vegan"],
  },
  {
    name: "Teigtaschen mit Spinat & Käse",
    desc: "herzhafte Spinat-Käse-Füllung mit frischen Beilagen",
    price: "14,99 €",
    img: bowlBeef,
    tags: ["vegetarisch"],
  },
];

const openingHours = [
  { day: "Montag – Freitag", time: "11:00 – 21:00" },
  { day: "Samstag", time: "12:00 – 21:00" },
  { day: "Sonntag", time: "12:00 – 20:00" },
];

function Index() {
  return (
    <main className="bg-background text-foreground">
      <ScrollVideoHero />

      {/* Willkommen */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Hausgemacht in München</p>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Handgemachte Teigtaschen, frisch in die Bowl
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Bei uns dreht sich alles um handgemachte Teigtaschen – saftig gefüllt und kombiniert
            mit frischen Beilagen wie Buchweizen-Gemüse, Karottensalat oder Krautsalat. Ob vegan,
            vegetarisch oder glutenfrei: Jede Bowl ist ein wärmender, ehrlicher Genussmoment.
          </p>
        </Reveal>
      </section>

      {/* Menü */}
      <section id="menue" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Unsere Karte</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Bowls & Teigtaschen</h2>
            <p className="mt-4 text-muted-foreground">
              Alle Gerichte in deiner Wunschgröße – mit Zutat deiner Wahl.
            </p>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2">
            {bowls.map((item, i) => (
              <Reveal key={item.name} delay={i * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-lg shadow-foreground/5">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-56 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="whitespace-nowrap font-display text-lg font-semibold text-primary">
                        {item.price}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                    {item.tags.length > 0 && <Badges tags={item.tags} />}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Extra categories */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <Reveal>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-lg shadow-foreground/5">
                <img
                  src={desserts}
                  alt="Mochi-Eis und Nachtische"
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-52 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">Mochi-Eis & Nachtische</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Süßer Abschluss: buntes Mochi-Eis und hausgemachte Desserts.
                  </p>
                </div>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-lg shadow-foreground/5">
                <img
                  src={drinks}
                  alt="Hausgemachte Getränke"
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-52 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">Hausgemachte Getränke</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Erfrischende Limonaden und Eisgetränke – selbstgemacht, mit Kräutern & Früchten.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Standort & Öffnungszeiten */}
      <section id="standort" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Besuch uns</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Standort & Öffnungszeiten</h2>
            <div className="mt-8 space-y-2 text-lg">
              <p className="font-semibold">Teigtaschen Bowls Café</p>
              <p className="text-muted-foreground">Winterstraße 15</p>
              <p className="text-muted-foreground">81543 München (Untergiesing-Giesing)</p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Teigtaschen+Bowls+Cafe+Winterstra%C3%9Fe+15+M%C3%BCnchen"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Auf Google Maps öffnen →
            </a>

            <div className="mt-10 rounded-3xl bg-secondary/50 p-6">
              <h3 className="text-xl font-semibold">Öffnungszeiten</h3>
              <dl className="mt-4 space-y-3">
                {openingHours.map((row) => (
                  <div key={row.day} className="flex justify-between border-b border-border pb-2 text-sm">
                    <dt className="text-muted-foreground">{row.day}</dt>
                    <dd className="font-medium">{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full min-h-[360px] overflow-hidden rounded-3xl shadow-lg shadow-foreground/5">
              <iframe
                title="Karte – Teigtaschen Bowls Café"
                className="h-full min-h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Winterstra%C3%9Fe%2015%2C%2081543%20M%C3%BCnchen&output=embed"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bestellen */}
      <section id="bestellen" className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="text-4xl font-semibold sm:text-5xl">Hunger bekommen?</h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Bestell deine Lieblings-Bowl bequem nach Hause – frisch zubereitet und schnell geliefert.
            </p>
            <a
              href={WOLT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary-foreground px-8 py-4 text-lg font-semibold text-primary transition-transform hover:scale-105"
            >
              Online bestellen (Wolt)
            </a>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12 text-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-semibold">Teigtaschen Bowls Café</p>
            <p className="mt-1 text-sm text-background/70">
              Winterstraße 15 · 81543 München · Hausgemacht + vegane Optionen
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#menue" className="text-background/80 transition-colors hover:text-background">
              Menü
            </a>
            <a href="#standort" className="text-background/80 transition-colors hover:text-background">
              Standort
            </a>
            <a
              href={WOLT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/80 transition-colors hover:text-background"
            >
              Bestellen
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
