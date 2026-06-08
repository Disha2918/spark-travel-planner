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
  Wallet,
  Plane,
  Hotel,
} from "lucide-react";

interface Props {
  onComplete: () => void;
}

const dietOpts = ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Nut allergy", "Pescatarian"];
const flightClasses = ["Economy", "Premium", "Business"];
const stayTypes = ["Hotel", "Boutique", "Ryokan / B&B", "Apartment", "Hostel"];
const transitModes = ["Flight", "Train", "Bus", "Car rental"];

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("Kyoto, Japan");
  const [origin, setOrigin] = useState("San Francisco, USA");
  const [start, setStart] = useState("2026-04-08");
  const [end, setEnd] = useState("2026-04-14");
  const [ages, setAges] = useState("32, 30, 6");
  const [diets, setDiets] = useState<string[]>(["Vegetarian"]);
  const [inspiration, setInspiration] = useState("");

  // Budget
  const [currency, setCurrency] = useState("USD");
  const [totalBudget, setTotalBudget] = useState(4800);
  const [split, setSplit] = useState({ stay: 35, transit: 25, food: 25, sights: 15 });

  // Preferences
  const [flightClass, setFlightClass] = useState("Economy");
  const [stayType, setStayType] = useState("Boutique");
  const [transit, setTransit] = useState<string[]>(["Flight", "Train"]);

  const steps = [
    { title: "Where & when", icon: MapPin },
    { title: "Who's going", icon: Users },
    { title: "Budget & bookings", icon: Wallet },
    { title: "Inspiration", icon: Sparkles },
  ];

  const toggleDiet = (d: string) =>
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  const toggleTransit = (t: string) =>
    setTransit((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const setSplitKey = (k: keyof typeof split, v: number) => {
    const others = (Object.keys(split) as (keyof typeof split)[]).filter((x) => x !== k);
    const remaining = 100 - v;
    const otherSum = others.reduce((s, o) => s + split[o], 0) || 1;
    const next = { ...split, [k]: v } as typeof split;
    others.forEach((o) => {
      next[o] = Math.max(0, Math.round((split[o] / otherSum) * remaining));
    });
    setSplit(next);
  };

  const money = (pct: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(
      Math.round((totalBudget * pct) / 100),
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">New trip</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tell us how you travel.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          TripMind blends your taste, pace, and budget into a private itinerary with bookable links.
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
                  <span className={active ? "font-medium" : "text-muted-foreground"}>{s.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-[var(--shadow-soft)]">
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Flying from" icon={Plane}>
                <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-transparent text-base font-medium outline-none" />
              </Field>
              <Field label="Destination" icon={MapPin}>
                <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-transparent text-base font-medium outline-none" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Departure" icon={CalendarDays}>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full bg-transparent text-base outline-none" />
              </Field>
              <Field label="Return" icon={CalendarDays}>
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full bg-transparent text-base outline-none" />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <Field label="Traveler ages (comma separated)" icon={Users}>
              <input value={ages} onChange={(e) => setAges(e.target.value)} className="w-full bg-transparent text-lg outline-none" />
            </Field>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Dietary considerations</p>
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
          <div className="space-y-8">
            {/* Total budget */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total trip budget</p>
              <p className="mt-1 text-sm text-muted-foreground">We'll fit stays, transit, food and sights into this number.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent text-sm font-medium outline-none"
                  >
                    {["USD", "EUR", "GBP", "JPY", "INR", "AUD"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-transparent text-lg font-semibold outline-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">~ {money(100)} all-in</p>
              </div>
            </div>

            {/* Split */}
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">How to split it</p>
              <BudgetSlider label="Stay & accommodation" emoji="🛏️" value={split.stay} amount={money(split.stay)} onChange={(v) => setSplitKey("stay", v)} />
              <BudgetSlider label="Flights & transit" emoji="✈️" value={split.transit} amount={money(split.transit)} onChange={(v) => setSplitKey("transit", v)} />
              <BudgetSlider label="Food & restaurants" emoji="🍜" value={split.food} amount={money(split.food)} onChange={(v) => setSplitKey("food", v)} />
              <BudgetSlider label="Sights & experiences" emoji="🗺️" value={split.sights} amount={money(split.sights)} onChange={(v) => setSplitKey("sights", v)} />
            </div>

            {/* Booking preferences */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Plane className="h-3 w-3" /> Flight class
                </p>
                <div className="flex flex-wrap gap-2">
                  {flightClasses.map((f) => (
                    <Chip key={f} on={flightClass === f} onClick={() => setFlightClass(f)}>{f}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Hotel className="h-3 w-3" /> Stay style
                </p>
                <div className="flex flex-wrap gap-2">
                  {stayTypes.map((s) => (
                    <Chip key={s} on={stayType === s} onClick={() => setStayType(s)}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Utensils className="h-3 w-3" /> Transit modes
                </p>
                <div className="flex flex-wrap gap-2">
                  {transitModes.map((t) => (
                    <Chip key={t} on={transit.includes(t)} onClick={() => toggleTransit(t)}>{t}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
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
  amount,
  onChange,
}: {
  label: string;
  emoji: string;
  value: number;
  amount: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-medium">{label}</span>
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {value}% · <span className="text-foreground">{amount}</span>
        </span>
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

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
        on
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}
