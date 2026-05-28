import { useState } from "react";
import { GripVertical, ArrowRight, Sparkles, MapPin } from "lucide-react";

interface DayCard {
  id: string;
  day: number;
  city: string;
  theme: string;
  highlights: string[];
  accent: string;
}

const initial: DayCard[] = [
  { id: "d1", day: 1, city: "Kyoto", theme: "Arrival & shrines", highlights: ["Fushimi Inari", "Gion stroll", "Ryokan check-in"], accent: "from-orange-50 to-amber-50" },
  { id: "d2", day: 2, city: "Arashiyama", theme: "Bamboo & temples", highlights: ["Bamboo grove", "Tenryū-ji", "Boat ride"], accent: "from-emerald-50 to-teal-50" },
  { id: "d3", day: 3, city: "Nara", theme: "Day trip", highlights: ["Tōdai-ji", "Deer park", "Mochi-making"], accent: "from-rose-50 to-pink-50" },
  { id: "d4", day: 4, city: "Kyoto", theme: "Tea & textiles", highlights: ["Uji matcha", "Nishijin weaving", "Pontocho dinner"], accent: "from-violet-50 to-indigo-50" },
  { id: "d5", day: 5, city: "Osaka", theme: "Street food", highlights: ["Dōtonbori", "Umeda Sky", "Takoyaki crawl"], accent: "from-sky-50 to-blue-50" },
  { id: "d6", day: 6, city: "Kyoto", theme: "Hidden corners", highlights: ["Philosopher's path", "Kurama onsen", "Farewell kaiseki"], accent: "from-yellow-50 to-orange-50" },
];

interface Props {
  onComplete: () => void;
}

export function Blueprint({ onComplete }: Props) {
  const [cards, setCards] = useState(initial);
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const handleDrop = (targetId: string) => {
    if (!drag || drag === targetId) return;
    const next = [...cards];
    const fromIdx = next.findIndex((c) => c.id === drag);
    const toIdx = next.findIndex((c) => c.id === targetId);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setCards(next.map((c, i) => ({ ...c, day: i + 1 })));
    setDrag(null);
    setOver(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="h-3 w-3" />
            Draft blueprint
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            6 days, Kansai region
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Drag any day to reorder. We'll lock the schedule once you're happy.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Lock in & build itinerary
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="-mx-6 overflow-x-auto px-6 pb-6">
        <div className="flex gap-4">
          {cards.map((c) => (
            <article
              key={c.id}
              draggable
              onDragStart={() => setDrag(c.id)}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(c.id);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={() => handleDrop(c.id)}
              className={`group relative w-72 shrink-0 cursor-grab rounded-3xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all active:cursor-grabbing ${
                over === c.id ? "border-foreground -translate-y-1" : "border-border/70"
              } ${drag === c.id ? "opacity-40" : "hover:-translate-y-0.5"}`}
            >
              <div className={`absolute inset-x-5 top-5 h-24 rounded-2xl bg-gradient-to-br ${c.accent}`} />
              <div className="relative pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                      Day {c.day.toString().padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight">{c.city}</h3>
                  </div>
                  <GripVertical className="h-4 w-4 text-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-12 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {c.theme}
                </p>
                <ul className="mt-4 space-y-2 border-t border-border/60 pt-3">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="h-1 w-1 rounded-full bg-foreground/40" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
