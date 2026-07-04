import { createFileRoute } from "@tanstack/react-router";
import { ScrollVideoHero } from "../components/ScrollVideoHero";
import { SiteHeader } from "../components/SiteHeader";
import { AlpineDivider } from "../components/AlpineDivider";
import { Reveal } from "../components/Reveal";
import bowlKartoffel from "../assets/bowl-kartoffel.jpg";
import bowlRindfleisch from "../assets/bowl-rindfleisch.jpg";
import bowlWeisskraut from "../assets/bowl-weisskraut.jpg";
import bowlKaeseSpinat from "../assets/bowl-kaese-spinat.jpg";
import bowlGlutenfrei from "../assets/bowl-glutenfrei.jpg";
import picknickBowls from "../assets/picknick-bowls.jpg";
import cafeTisch from "../assets/cafe-tisch.jpg";
import takeawayBags from "../assets/takeaway-bags.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const WOLT_URL = "https://wolt.com/de/deu/munich/restaurant/teigtaschen-bowls-cafe";
const INSTAGRAM_URL = "https://www.instagram.com/teigtaschenbowls.de/";

type Tag = "vegan" | "vegetarisch" | "glutenfrei" | "laktosefrei";

const tagStyles: Record<Tag, string> = {
  vegan: "bg-accent/15 text-accent",
  vegetarisch: "bg-accent/15 text-accent",
  glutenfrei: "bg-primary/15 text-primary",
  laktosefrei: "bg-primary/15 text-primary",
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

const bowlSides =
  "mit Gemüsesoße + Gemüsereis + Krautsalat + Gemüse-Buchweizen + Karottensalat + Zwiebelkonfitüre";

const bowls: {
  name: string;
  desc: string;
  price: string;
  img: string;
  tags: Tag[];
}[] = [
  {
    name: "Kartoffel-Füllung",
    desc: bowlSides,
    price: "12 €",
    img: bowlKartoffel,
    tags: ["vegan"],
  },
  {
    name: "Rindfleisch-Füllung",
    desc: bowlSides,
    price: "12 €",
    img: bowlRindfleisch,
    tags: [],
  },
  {
    name: "Weißkraut-Füllung",
    desc: bowlSides,
    price: "12 €",
    img: bowlWeisskraut,
    tags: ["vegan"],
  },
  {
    name: "Käse + Spinat-Füllung",
    desc: bowlSides,
    price: "12 €",
    img: bowlKaeseSpinat,
    tags: ["vegetarisch"],
  },
  {
    name: "Glutenfrei + Laktosefrei Bowl",
    desc: "mit pochiertem Ei + Gemüsesoße + Karottensalat + Krautsalat + Gemüsereis + Gemüse-Buchweizen + Zwiebelkonfitüre",
    price: "12 €",
    img: bowlGlutenfrei,
    tags: ["vegetarisch", "glutenfrei", "laktosefrei"],
  },
];

const empfehlungen: {
  name: string;
  combo: string;
  vibe: string;
  desc: string;
  price: string;
}[] = [
  {
    name: "Münchener Bowl",
    combo: "Kartoffelfüllung + Fleischküchle",
    vibe: "Bayerische Gemütlichkeit · herzhaft · Tradition",
    desc: "Ein Genuss wie auf dem Viktualienmarkt – deftig, warm und typisch München.",
    price: "16 €",
  },
  {
    name: "Berliner Bowl",
    combo: "Fleischfüllung + pochiertes Ei",
    vibe: "Hauptstadt-Flair · urban · kräftig",
    desc: "Inspiriert vom pulsierenden Leben Berlins – modern, vielseitig und immer überraschend.",
    price: "15 €",
  },
  {
    name: "Hamburger Bowl",
    combo: "Kartoffelfüllung + Zander",
    vibe: "Hanseatisch · fischverliebt · maritim",
    desc: "Norddeutscher Genuss mit einem Hauch von Meer – inspiriert von Hamburgs Hafen und seiner Liebe zu Fischgerichten.",
    price: "19 €",
  },
  {
    name: "Starnberger Bowl",
    combo: "Kohlfüllung + Zander + Garnelen",
    vibe: "Stilvoll · See-Genuss · exklusiv",
    desc: "Inspiriert vom Starnberger See – Synonym für Eleganz und Wohlstand.",
    price: "24 €",
  },
];

type MenuItem = {
  name: string;
  price: string;
  desc?: string;
  tag?: "vegan" | "vegetarisch";
  isNew?: boolean;
};

const menuCategories: { title: string; note?: string; items: MenuItem[] }[] = [
  {
    title: "Toppings",
    items: [
      { name: "Zander Teriyaki", price: "7,00", isNew: true },
      { name: "Limetten-Garnelen", price: "6,00", isNew: true },
      { name: "Fleischküchle mit Feta", price: "4,00", isNew: true },
      { name: "Pochiertes Ei", price: "3,00", tag: "vegetarisch" },
      { name: "Jalapeño", price: "1,00", tag: "vegan" },
    ],
  },
  {
    title: "Beilagen",
    note: "hausgemacht",
    items: [
      { name: "Karottensalat", price: "3,00", tag: "vegan" },
      { name: "Krautsalat", price: "3,00", tag: "vegan" },
      { name: "Gemüsereis", price: "3,00", tag: "vegan" },
      { name: "Gemüse-Buchweizen", price: "3,00", tag: "vegan" },
    ],
  },
  {
    title: "Extras",
    note: "hausgemacht",
    items: [
      { name: "Gemüsesoße", price: "2,00", tag: "vegan" },
      { name: "Zwiebelkonfitüre", price: "3,00", tag: "vegan" },
    ],
  },
  {
    title: "Mochi-Eis",
    items: [
      { name: "Schoko-Kirsche", price: "5,00", tag: "vegetarisch" },
      { name: "Mango", price: "5,00", tag: "vegetarisch" },
      { name: "Pistazien", price: "5,00", tag: "vegetarisch" },
      { name: "Kokosnuss", price: "5,00", tag: "vegetarisch" },
      { name: "Matcha", price: "5,00", tag: "vegetarisch" },
    ],
  },
  {
    title: "Dessert",
    items: [
      { name: "Zitroneneis in Zitronenschale", price: "4,00", isNew: true },
      { name: "Apfelkuchen", price: "4,00", tag: "vegan" },
      { name: "Käsekuchen", price: "4,00", tag: "vegetarisch" },
    ],
  },
  {
    title: "Kaffee",
    items: [
      { name: "Espresso", price: "2,50" },
      { name: "Espresso Doppio", price: "3,50" },
      { name: "Espresso Macchiato", price: "2,50" },
      { name: "Americano", price: "2,50" },
      { name: "Flat White", price: "4,00" },
      { name: "Cappuccino", price: "3,50" },
      { name: "Cappuccino groß", price: "4,50" },
      { name: "Latte Macchiato", price: "4,50" },
      { name: "Heiße Schokolade", price: "3,50" },
      { name: "Babyccino", price: "1,00" },
      { name: "+ Hafermilch", price: "0,50", tag: "vegan" },
    ],
  },
  {
    title: "Loser Tee",
    items: [
      { name: "Frischer Apfeltee + Holunderbeeren", price: "4,00" },
      { name: "Frischer Ingwertee", price: "4,00" },
      { name: "Grüner Tee", price: "4,00" },
      { name: "Grüner Tee + Ingwer", price: "4,00" },
      { name: "Minze Tee + Apfel", price: "4,00" },
      { name: "Rooibos Tee", price: "4,00" },
      { name: "Rooibos Tee + Minze", price: "4,00" },
      { name: "Schwarzer Tee", price: "4,00" },
      { name: "Schwarzer Tee + Johannisbeeren", price: "4,00" },
    ],
  },
  {
    title: "Warme Hausgetränke",
    items: [
      { name: "Heißer Holler", price: "4,00", desc: "Holundersirup + Zitrone + Apfel" },
      { name: "Heißer Apfel", price: "4,00", desc: "Apfelsaft + Apfel + Zimt + Zitrone" },
      {
        name: "Heiße Johannisbeere",
        price: "4,00",
        desc: "Johannisbeersirup + Johannisbeeren + Apfel + Zitrone",
      },
      {
        name: "Heiße Apotheke",
        price: "5,00",
        desc: "Blaubeeren + Johannisbeeren + Zitrone + Ingwer + Apfel + Honig",
      },
    ],
  },
  {
    title: "Kalte Hausgetränke",
    items: [
      { name: "Hollerlimo", price: "4,00", desc: "Holundersirup + Zitrone + Apfel + Ingwer" },
      {
        name: "Johannisbeerlimo",
        price: "4,00",
        desc: "Johannisbeeren + Johannisbeersirup + Apfel + Zitrone",
      },
      { name: "Apfelsaftschorle", price: "4,00", desc: "Apfelsaft + Apfel + Zitrone" },
    ],
  },
  {
    title: "Wasser",
    items: [
      { name: "Wasser still/prickelnd 300 ml", price: "3,00" },
      { name: "Wasser still/prickelnd 800 ml", price: "5,00" },
      {
        name: "SuperWasser still/prickelnd 800 ml",
        price: "6,00",
        desc: "Zitrone + Johannisbeeren + Apfel + Heidelbeeren + Ingwer",
      },
    ],
  },
];

function MenuTag({ tag }: { tag: NonNullable<MenuItem["tag"]> }) {
  return (
    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
      {tag === "vegan" ? "vegan" : "veggie"}
    </span>
  );
}

function NewTag() {
  return (
    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
      Neu
    </span>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="py-1.5">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium">{item.name}</span>
        {item.isNew && <NewTag />}
        {item.tag && <MenuTag tag={item.tag} />}
        <span className="flex-1 border-b border-dotted border-border" />
        <span className="whitespace-nowrap font-display text-sm font-semibold text-primary">
          {item.price}
        </span>
      </div>
      {item.desc && (
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
      )}
    </li>
  );
}

const openingHours = [
  { day: "Montag – Freitag", time: "11:00 – 21:00" },
  { day: "Samstag", time: "12:00 – 21:00" },
  { day: "Sonntag", time: "12:00 – 20:00" },
];

function Index() {
  return (
    <main id="top" className="bg-background text-foreground">
      <SiteHeader />
      <ScrollVideoHero />

      {/* Willkommen */}
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-16 text-center">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Hausgemacht in München</p>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Handgemachte Teigtaschen, frisch in die Bowl
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Bei uns dreht sich alles um handgemachte Teigtaschen – saftig gefüllt und kombiniert
            mit frischen Beilagen wie Gemüse-Buchweizen, Karottensalat oder Krautsalat. Ob vegan,
            vegetarisch oder glutenfrei: Jede Bowl ist ein wärmender, ehrlicher Genussmoment.
          </p>
        </Reveal>
      </section>

      {/* Über uns – Aus Liebe zur alpinen Küche */}
      <section id="ueber-uns" className="mx-auto max-w-4xl px-6 pb-24">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card px-6 py-12 shadow-lg shadow-foreground/5 sm:px-14">
            <div className="text-center">
              <p className="font-script text-3xl font-medium text-primary sm:text-4xl">
                Über uns
              </p>
              <h2 className="mt-3 font-fraktur text-5xl font-medium leading-tight sm:text-6xl">
                Aus Liebe zur alpinen Küche
              </h2>
            </div>

            <div className="mx-auto mt-10 w-52 rotate-2 rounded-md bg-white p-2 pb-6 shadow-xl shadow-foreground/15 sm:w-60">
              <img
                src={cafeTisch}
                alt="Zwei Teigtaschen Bowls mit hausgemachten Limonaden im Café"
                loading="lazy"
                width={1122}
                height={1402}
                className="aspect-square w-full rounded-sm object-cover"
              />
            </div>

            <div className="mt-10 space-y-7 text-center font-script text-2xl font-medium leading-relaxed sm:text-3xl sm:leading-relaxed">
              <p>
                Zwischen den Alpen und den sanften Hügeln des Alpenvorlands entstand die Idee von
                Teigtaschen Bowls – <mark>aus Liebe zu echter regionaler Küche</mark> und dem
                Wunsch, sie auf moderne, leichte und gesunde Art neu zu denken.
              </p>
              <p>
                Die alpine Küche war schon immer ehrlich, herzhaft und bodenständig. Hier schätzt
                man, was die Natur gibt – Karotten, Kohl, Kartoffeln, Rote Bete, Äpfel, Kräuter.
                Diese Zutaten sind <mark>tief mit der Region verbunden</mark> und erzählen
                Geschichten von Bergbauernhöfen, Almwiesen und Sonntagsessen mit Familie.
              </p>
              <p>
                In unseren Bowls vereinen wir traditionelle alpine Produkte und Rezepte mit einer
                modernen Präsentation: <mark>leicht, frisch, bunt, gesund</mark> und überraschend
                kombiniert. Jeder Bowl ist wie eine kleine Reise durch die Alpen – mit Zutaten,
                die man kennt, aber in einer Kombination, die man so noch nie gegessen hat.
              </p>
              <p>
                Unsere Teigtaschen stehen im Mittelpunkt. In den Alpen haben Teigtaschen viele
                Namen: Maultaschen in Schwaben, Schlutzkrapfen in Südtirol, Kassnudeln in
                Kärnten. Sie alle erzählen vom gleichen Gedanken – einfache Zutaten, mit Liebe
                zubereitet und in Teig gehüllt. Wir greifen diese Tradition auf und
                interpretieren sie neu: mit saisonalen Füllungen aus regionalem Gemüse,
                Kartoffeln, Käse oder Kräutern –{" "}
                <mark>handgemacht, frisch und voller Geschmack</mark>.
              </p>
              <p>
                So entsteht unser Teigtaschen Bowl – eine Verbindung von Vergangenheit und
                Gegenwart. Er bringt das, <mark>was wir an den Alpen lieben</mark>, auf den
                Tisch: ehrliche Produkte, regionale Qualität, den Mut, Traditionen neu zu
                kombinieren – und das alles auf eine gesunde, natürliche Weise.
              </p>
            </div>

            <p className="mt-12 text-center font-script text-3xl font-bold text-primary sm:text-4xl">
              – Euer Teigtaschen Bowls Team
            </p>
          </div>
        </Reveal>
      </section>

      <AlpineDivider className="-mb-px text-secondary/40" />

      {/* Teigtaschen Bowls */}
      <section id="menue" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Unsere Karte</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Teigtaschen Bowls</h2>
            <p className="mt-4 text-muted-foreground">
              Hausgemachte Teigtaschen mit Füllung deiner Wahl – serviert mit frischen,
              hausgemachten Beilagen.
            </p>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bowls.map((item, i) => (
              <Reveal key={item.name} delay={i * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-lg shadow-foreground/5">
                  <div className="h-56 w-full overflow-hidden">
                    <img
                      src={item.img}
                      alt={`Teigtaschen Bowl mit ${item.name}`}
                      loading="lazy"
                      width={1122}
                      height={1402}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
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

            <Reveal delay={bowls.length * 80}>
              <a
                href="#karte"
                className="flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-primary/40 p-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                <span className="font-display text-2xl font-semibold text-primary">
                  Mach sie zu deiner Bowl
                </span>
                <span className="text-sm text-muted-foreground">
                  Toppings ab 1 € – von Zander Teriyaki bis Jalapeño. Dazu hausgemachte Beilagen
                  &amp; Extras.
                </span>
                <span className="mt-2 text-sm font-medium text-primary">Zur ganzen Karte ↓</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Unsere Empfehlung */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <img
              src={picknickBowls}
              alt="Zwei Teigtaschen Bowls mit Zander im Picknickkorb"
              loading="lazy"
              width={1122}
              height={1402}
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lg shadow-foreground/5"
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="flex items-center gap-3">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Unsere Empfehlung</p>
              <NewTag />
            </div>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
              Bowls, inspiriert von Städten
            </h2>
            <p className="mt-4 text-muted-foreground">
              Unsere besonderen Bowls – einzigartig kombiniert.
            </p>
            <ul className="mt-8 space-y-6">
              {empfehlungen.map((item) => (
                <li key={item.name} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <span className="whitespace-nowrap font-display text-lg font-semibold text-primary">
                      {item.price}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent">{item.combo}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                    {item.vibe}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <AlpineDivider className="-mb-px text-secondary/40" />

      {/* Die ganze Karte */}
      <section id="karte" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Zum Kombinieren</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Die ganze Karte</h2>
            <p className="mt-4 text-muted-foreground">
              Toppings, Beilagen, Desserts und hausgemachte Getränke – alle Preise in Euro.
            </p>
          </Reveal>

          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {menuCategories.map((cat, i) => (
              <Reveal key={cat.title} delay={(i % 3) * 80} className="mb-8 break-inside-avoid">
                <div className="rounded-3xl bg-card p-6 shadow-lg shadow-foreground/5">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display text-lg font-semibold uppercase tracking-wide">
                      {cat.title}
                    </h3>
                    {cat.note && (
                      <span className="text-xs text-muted-foreground">{cat.note}</span>
                    )}
                  </div>
                  <ul className="mt-3">
                    {cat.items.map((item) => (
                      <MenuRow key={item.name} item={item} />
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              <span className="mr-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                veggie
              </span>
              = vegetarisch ·
              <span className="mx-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                vegan
              </span>
              = vegan · Allergen-Informationen? Frag unser Personal.
            </p>
            <p className="mt-2">Wir haben eine freundliche Selbstbedienung ☺</p>
          </Reveal>
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
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <Reveal>
            <img
              src={takeawayBags}
              alt="Teigtaschen Bowls verpackt zum Mitnehmen in Papiertüten"
              loading="lazy"
              width={1122}
              height={1402}
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lg shadow-foreground/20"
            />
          </Reveal>
          <Reveal delay={100} className="text-center md:text-left">
            <h2 className="text-4xl font-semibold sm:text-5xl">Hunger bekommen?</h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Bestell deine Lieblings-Bowl bequem nach Hause oder hol sie frisch verpackt bei uns
              ab – perfekt fürs Büro, den Park oder das Sofa.
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
            <p className="font-fraktur text-2xl font-medium">Teigtaschen Bowls Café</p>
            <p className="mt-1 text-sm text-background/70">
              Winterstraße 15 · 81543 München · Hausgemacht + vegane Optionen
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#menue" className="text-background/80 transition-colors hover:text-background">
              Menü
            </a>
            <a href="#karte" className="text-background/80 transition-colors hover:text-background">
              Karte
            </a>
            <a href="#standort" className="text-background/80 transition-colors hover:text-background">
              Standort
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/80 transition-colors hover:text-background"
            >
              Instagram
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
