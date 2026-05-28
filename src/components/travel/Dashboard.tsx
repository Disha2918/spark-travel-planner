import { useState } from "react";
import {
  Clock,
  GripVertical,
  Plus,
  Hotel,
  Train,
  Tag,
  Utensils,
  Leaf,
  Sparkles,
  AlertTriangle,
  Users2,
  Map as MapIcon,
  Pill,
  ShoppingBasket,
  ChevronRight,
} from "lucide-react";

interface Block {
  id: string;
  time: string;
  title: string;
  meta?: string;
  flex?: boolean;
  crowd?: "low" | "med" | "high";
  warn?: string;
}

const initialBlocks: Block[] = [
  { id: "b1", time: "07:30", title: "Matcha breakfast at % Arabica", meta: "Higashiyama · 45m" },
  { id: "b2", time: "08:30", title: "Fushimi Inari shrine", meta: "Vermilion gates hike · 2h", crowd: "low", warn: "Photographer scams near gate 4" },
  { id: "b3", time: "11:00", title: "Flexible buffer", flex: true },
  { id: "b4", time: "12:00", title: "Vegetarian shōjin ryōri lunch", meta: "Shigetsu · 90m" },
  { id: "b5", time: "14:00", title: "Arashiyama bamboo grove", meta: "Walk + boat · 2h", crowd: "high" },
  { id: "b6", time: "17:00", title: "Flexible buffer", flex: true },
  { id: "b7", time: "19:00", title: "Pontocho alley dinner crawl", meta: "Reservation held · 2h" },
];

export function Dashboard() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [drag, setDrag] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(2);

  const handleDrop = (targetId: string) => {
    if (!drag || drag === targetId) return;
    const next = [...blocks];
    const from = next.findIndex((b) => b.id === drag);
    const to = next.findIndex((b) => b.id === targetId);
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setBlocks(next);
    setDrag(null);
  };

  return (
    <div>
      {/* Day pills */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tuesday · April 9
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Arashiyama & bamboo</h1>
        </div>
        <div className="flex gap-1.5 rounded-full border border-border bg-card p-1 shadow-[var(--shadow-soft)]">
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                activeDay === d
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Timeline */}
        <Card className="col-span-12 lg:col-span-5 lg:row-span-2">
          <CardHeader icon={Clock} title="Hourly timeline" subtitle="Drag to reorder" />
          <ol className="mt-4 space-y-2">
            {blocks.map((b) => (
              <li
                key={b.id}
                draggable
                onDragStart={() => setDrag(b.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(b.id)}
                className={`group relative flex cursor-grab gap-3 rounded-2xl border p-3 transition-all active:cursor-grabbing ${
                  b.flex
                    ? "border-dashed border-border bg-background/50"
                    : "border-border/70 bg-background hover:border-foreground/30"
                } ${drag === b.id ? "opacity-40" : ""}`}
              >
                <div className="w-12 shrink-0">
                  <p className="font-mono text-xs text-muted-foreground">{b.time}</p>
                </div>
                <div className="min-w-0 flex-1">
                  {b.flex ? (
                    <button className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      <Plus className="h-3.5 w-3.5" />
                      Open slot — add or breathe
                    </button>
                  ) : (
                    <>
                      <p className="text-sm font-medium leading-snug">{b.title}</p>
                      {b.meta && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{b.meta}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {b.crowd && <CrowdMeter level={b.crowd} />}
                        {b.warn && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            {b.warn}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {!b.flex && (
                  <GripVertical className="h-4 w-4 self-center text-foreground/30 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </li>
            ))}
          </ol>
        </Card>

        {/* Map */}
        <Card className="col-span-12 lg:col-span-7">
          <div className="flex items-start justify-between">
            <CardHeader icon={MapIcon} title="Route map" subtitle="Today's footprint · 8.2 km" />
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-foreground" />
              En-route utilities
            </label>
          </div>
          <div className="relative mt-4 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50">
            <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full">
              <defs>
                <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
                </pattern>
              </defs>
              <rect width="400" height="240" fill="url(#g)" />
              <path
                d="M 40 200 Q 120 80 200 140 T 360 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="text-foreground/70"
              />
            </svg>
            {/* Pins */}
            <Pin x="10%" y="80%" label="Start" tone="dark" />
            <Pin x="35%" y="50%" label="Bamboo" tone="primary" />
            <Pin x="62%" y="58%" label="Lunch" tone="primary" />
            <Pin x="88%" y="20%" label="Dinner" tone="dark" />
            {/* Utilities */}
            <Util x="25%" y="68%" icon={ShoppingBasket} />
            <Util x="50%" y="38%" icon={Pill} />
            <Util x="76%" y="42%" icon={ShoppingBasket} />
          </div>
        </Card>

        {/* Stay & transit */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-7">
          <CardHeader icon={Hotel} title="Stay & transit" subtitle="Smart-sorted for today" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StayCard tag="Closest to JR" name="Ryokan Yachiyo" price="¥24,800" sub="3 min walk to Saga-Arashiyama" />
            <StayCard tag="Best price" name="Mosaic Kyoto" price="¥14,200" sub="Quiet, recently renovated" highlighted />
            <TransitCard title="Hankyu Day Pass" sub="Unlimited rides" badge="20% off · ends today" />
            <TransitCard title="JR Sagano line" sub="Round trip · reserved seats" badge="Deal · ¥1,180" />
          </div>
        </Card>

        {/* Dining */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-5">
          <CardHeader icon={Utensils} title="Dining for you" subtitle="Vegetarian · No nuts" />
          <ul className="mt-4 space-y-3">
            <DineRow name="Shigetsu" cuisine="Shōjin ryōri · temple cuisine" tags={["Vegetarian", "Reservation"]} />
            <DineRow name="Mumokuteki Café" cuisine="Modern washoku" tags={["Vegan options"]} />
            <DineRow name="Ain Soph. Journey" cuisine="Plant-based pancakes" tags={["Vegan", "Nut-free"]} />
          </ul>
        </Card>

        {/* Hidden gems */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-5 bg-gradient-to-br from-card to-accent/40">
          <CardHeader icon={Leaf} title="Off the beaten path" subtitle="Scraped from local blogs" />
          <ul className="mt-4 space-y-3">
            <GemRow title="Yase llama meadow" detail="30-min detour · ¥600 entry · open Wed–Sun" />
            <GemRow title="Hidden moss garden at Gio-ji" detail="No queues · best at 8 AM" />
            <GemRow title="Indigo dyeing workshop" detail="Two artisans · 90 min hands-on" />
          </ul>
        </Card>

        {/* Alerts */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-7">
          <CardHeader icon={AlertTriangle} title="Live intel" subtitle="Updated 4 minutes ago" />
          <div className="mt-4 space-y-2.5">
            <Alert tone="warn" title="Crowds at Tenryū-ji" body="Tour buses arrive 10–11 AM. Visit before 9 or after 4." />
            <Alert tone="danger" title="Overcharge reports near Dōtonbori" body="3 menus flagged this week. Confirm prices before ordering." />
            <Alert tone="info" title="Festival on Sat" body="Kyoto Costume Parade — Shijō street closes 13–17h." />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─── primitives ─── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] ${className}`}>
      {children}
    </section>
  );
}

function CardHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function CrowdMeter({ level }: { level: "low" | "med" | "high" }) {
  const map = {
    low: { label: "Quiet now", bars: 1, tone: "text-emerald-600 bg-emerald-50" },
    med: { label: "Filling up", bars: 2, tone: "text-amber-600 bg-amber-50" },
    high: { label: "Busy · go 7 AM", bars: 3, tone: "text-rose-600 bg-rose-50" },
  }[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${map.tone}`}>
      <Users2 className="h-2.5 w-2.5" />
      {map.label}
    </span>
  );
}

function StayCard({ tag, name, price, sub, highlighted }: { tag: string; name: string; price: string; sub: string; highlighted?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 transition-colors ${highlighted ? "border-foreground/40 bg-background" : "border-border bg-background hover:border-foreground/30"}`}>
      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
        <Sparkles className="h-2.5 w-2.5" />
        {tag}
      </span>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-sm font-mono">{price}</p>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function TransitCard({ title, sub, badge }: { title: string; sub: string; badge: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-foreground">
        <Train className="h-4 w-4" />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
        <Tag className="h-2.5 w-2.5" />
        {badge}
      </span>
    </div>
  );
}

function DineRow({ name, cuisine, tags }: { name: string; cuisine: string; tags: string[] }) {
  return (
    <li className="group flex items-center justify-between rounded-2xl border border-border/60 bg-background px-4 py-3 transition-colors hover:border-foreground/30">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{cuisine}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </li>
  );
}

function GemRow({ title, detail }: { title: string; detail: string }) {
  return (
    <li className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3 backdrop-blur">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
    </li>
  );
}

function Alert({ tone, title, body }: { tone: "warn" | "danger" | "info"; title: string; body: string }) {
  const map = {
    warn: "border-amber-200 bg-amber-50/70 text-amber-900",
    danger: "border-rose-200 bg-rose-50/70 text-rose-900",
    info: "border-sky-200 bg-sky-50/70 text-sky-900",
  };
  return (
    <div className={`rounded-2xl border p-3 ${map[tone]}`}>
      <p className="text-xs font-semibold">{title}</p>
      <p className="mt-0.5 text-xs opacity-80">{body}</p>
    </div>
  );
}

function Pin({ x, y, label, tone }: { x: string; y: string; label: string; tone: "dark" | "primary" }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-full" style={{ left: x, top: y }}>
      <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium shadow-sm ${tone === "dark" ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
        <MapIcon className="h-2.5 w-2.5" />
        {label}
      </div>
    </div>
  );
}

function Util({ x, y, icon: Icon }: { x: string; y: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm">
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  );
}
