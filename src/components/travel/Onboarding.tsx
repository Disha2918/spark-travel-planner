import { useState } from "react";
import {
  MapPin,
  CalendarDays,
  Users,
  Utensils,
  Link2,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

interface Props {
  onComplete: () => void;
}

const dietOpts = ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Nut allergy", "Pescatarian"];

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("Kyoto, Japan");
  const [start, setStart] = useState("2026-04-08");
  const [end, setEnd] = useState("2026-04-14");
  const [ages, setAges] = useState("32, 30, 6");
  const [diets, setDiets] = useState<string[]>(["Vegetarian"]);
  const [inspiration, setInspiration] = useState("");
  const [budget, setBudget] = useState({ food: 40, sights: 35, stay: 25 });

  const steps = [
    { title: "Where & when", icon: MapPin },
    { title: "Who's going", icon: Users },
    { title: "Inspiration", icon: Sparkles },
    { title: "Budget mix", icon: Utensils },
  ];

  const toggleDiet = (d: string) =>
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const setBudgetKey = (k: keyof typeof budget, v: number) => {
    // normalize to 100
    const others = (Object.keys(budget) as (keyof typeof budget)[]).filter((x) => x !== k);
    const remaining = 100 - v;
    const otherSum = others.reduce((s, o) => s + budget[o], 0) || 1;
    const next = { ...budget, [k]: v } as typeof budget;
    others.forEach((o) => {
      next[o] = Math.max(0, Math.round((budget[o] / otherSum) * remaining));
    });
    setBudget(next);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      {/* Stepper */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          New trip
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Tell us how you travel.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Wayfare blends your taste, pace, and inspiration into a private itinerary.
        </p>
        <ol className="mt-8 space-y-1">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <li key={s.title}>
                <button
                  onClick={() => setStep(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    active ? "bg-card shadow-[var(--shadow-soft)]" : "hover:bg-card/60"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : active
                        ? "bg-foreground text-background"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className={active ? "font-medium" : "text-muted-foreground"}>
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Panel */}
      <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-[var(--shadow-soft)]">
        {step === 0 && (
          <div className="space-y-6">
            <Field label="Destination" icon={MapPin}>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-lg font-medium outline-none"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Departure" icon={CalendarDays}>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full bg-transparent text-base outline-none"
                />
              </Field>
              <Field label="Return" icon={CalendarDays}>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full bg-transparent text-base outline-none"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <Field label="Traveler ages (comma separated)" icon={Users}>
              <input
                value={ages}
                onChange={(e) => setAges(e.target.value)}
                className="w-full bg-transparent text-lg outline-none"
              />
            </Field>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Dietary considerations
              </p>
              <div className="flex flex-wrap gap-2">
                {dietOpts.map((d) => {
                  const on = diets.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => toggleDiet(d)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                        on
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:border-foreground/40"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Paste links you love" icon={Link2}>
              <textarea
                rows={6}
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                placeholder={`https://instagram.com/reel/...\nhttps://youtube.com/shorts/...\nhttps://tiktok.com/@...`}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </Field>
            <p className="text-xs text-muted-foreground">
              We'll scrape locations, dishes, and vibes from your inspiration and weave them in.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Balance your budget
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Move sliders to tell us what matters. Totals always sum to 100%.
              </p>
            </div>
            <BudgetSlider label="Local food" emoji="🍜" value={budget.food} onChange={(v) => setBudgetKey("food", v)} />
            <BudgetSlider label="Sights & tours" emoji="🗺️" value={budget.sights} onChange={(v) => setBudgetKey("sights", v)} />
            <BudgetSlider label="Stays & comfort" emoji="🛏️" value={budget.stay} onChange={(v) => setBudgetKey("stay", v)} />
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            Back
          </button>
          <button
            onClick={() => (step === 3 ? onComplete() : setStep((s) => s + 1))}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            {step === 3 ? "Generate blueprint" : "Continue"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-border bg-background px-4 py-3 transition-colors focus-within:border-foreground/40">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      {children}
    </label>
  );
}

function BudgetSlider({
  label,
  emoji,
  value,
  onChange,
}: {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-medium">{label}</span>
        </span>
        <span className="font-mono text-xs text-muted-foreground">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-accent accent-foreground"
      />
    </div>
  );
}
