import { useState } from "react";
import {
  Clock,
  GripVertical,
  Plus,
  Hotel,
  Train,
  Plane,
  Bus,
  Tag,
  Utensils,
  Leaf,
  Sparkles,
  AlertTriangle,
  Users2,
  Map as MapIcon,
  Pill,
  ShoppingBasket,
  ExternalLink,
  Landmark,
  Coffee,
  TreePine,
  Building2,
} from "lucide-react";

/* ─── Brand/venue chip system ──────────────────────────
   Each venue gets a stable color + monogram so it's
   scannable across the timeline, dining list and map.   */
type VenueKind = "shrine" | "cafe" | "restaurant" | "nature" | "station" | "hotel" | "museum";

const kindStyle: Record<VenueKind, { bg: string; ring: string; fg: string; Icon: React.ComponentType<{ className?: string }>; label: string }> = {
  shrine:     { bg: "bg-rose-100",    ring: "ring-rose-200",    fg: "text-rose-700",    Icon: Landmark, label: "Shrine" },
  cafe:       { bg: "bg-amber-100",   ring: "ring-amber-200",   fg: "text-amber-800",   Icon: Coffee,   label: "Café" },
  restaurant: { bg: "bg-orange-100",  ring: "ring-orange-200",  fg: "text-orange-800",  Icon: Utensils, label: "Restaurant" },
  nature:     { bg: "bg-emerald-100", ring: "ring-emerald-200", fg: "text-emerald-800", Icon: TreePine, label: "Nature" },
  station:    { bg: "bg-sky-100",     ring: "ring-sky-200",     fg: "text-sky-800",     Icon: Train,    label: "Station" },
  hotel:      { bg: "bg-violet-100",  ring: "ring-violet-200",  fg: "text-violet-800",  Icon: Hotel,    label: "Stay" },
  museum:     { bg: "bg-indigo-100",  ring: "ring-indigo-200",  fg: "text-indigo-800",  Icon: Building2, label: "Museum" },
};

function VenueLogo({ name, kind, size = "md" }: { name: string; kind: VenueKind; size?: "sm" | "md" }) {
  const s = kindStyle[kind];
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const dim = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <span
      title={`${s.label}: ${name}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-semibold ring-1 ${s.bg} ${s.fg} ${s.ring} ${dim}`}
    >
      {initials}
    </span>
  );
}

function KindPill({ kind }: { kind: VenueKind }) {
  const s = kindStyle[kind];
  const Icon = s.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.fg}`}>
      <Icon className="h-2.5 w-2.5" />
      {s.label}
    </span>
  );
}

/* ─── Day-by-day data ────────────────────────────────── */
interface Block {
  id: string;
  time: string;
  title: string;
  meta?: string;
  flex?: boolean;
  crowd?: "low" | "med" | "high";
  warn?: string;
  kind?: VenueKind;
  mapsQuery?: string;
}

interface DayData {
  day: number;
  date: string;
  title: string;
  subtitle: string;
  km: number;
  blocks: Block[];
  dining: { name: string; cuisine: string; tags: string[]; kind: VenueKind; bookUrl: string }[];
  stays: { name: string; tag: string; price: string; sub: string; kind: VenueKind; bookUrl: string; highlighted?: boolean }[];
  transit: { title: string; sub: string; badge: string; mode: "flight" | "train" | "bus"; bookUrl: string }[];
  gems: { title: string; detail: string }[];
}

const days: DayData[] = [
  {
    day: 1,
    date: "Monday · April 8",
    title: "Arrival & Higashiyama",
    subtitle: "Touch down, settle in, sunset stroll",
    km: 4.1,
    blocks: [
      { id: "1a", time: "09:40", title: "ANA NH7 — SFO → KIX", meta: "Arrives 14:20 · Terminal 1", kind: "station" },
      { id: "1b", time: "15:30", title: "Haruka Express to Kyoto", meta: "Reserved car 4 · 75 min", kind: "station" },
      { id: "1c", time: "17:00", title: "Check in — Hotel The Mitsui", meta: "Nijō · Ryokan-style suite", kind: "hotel" },
      { id: "1d", time: "18:30", title: "Flexible buffer", flex: true },
      { id: "1e", time: "19:30", title: "Dinner at Giro Giro Hitoshina", meta: "Modern kaiseki · 90m", kind: "restaurant" },
    ],
    dining: [
      { name: "Giro Giro Hitoshina", cuisine: "Modern kaiseki", tags: ["Veg menu", "Reservation"], kind: "restaurant", bookUrl: "https://www.opentable.com/s?term=Giro+Giro+Hitoshina" },
      { name: "% Arabica Higashiyama", cuisine: "Specialty coffee", tags: ["Walk-in"], kind: "cafe", bookUrl: "https://maps.google.com/?q=%25+Arabica+Higashiyama" },
    ],
    stays: [
      { name: "Hotel The Mitsui Kyoto", tag: "Confirmed", price: "¥58,200", sub: "Nijō · onsen suite", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Hotel+The+Mitsui+Kyoto", highlighted: true },
      { name: "Mosaic Kyoto", tag: "Backup", price: "¥14,200", sub: "Recently renovated", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Mosaic+Kyoto" },
    ],
    transit: [
      { title: "ANA NH7 · SFO → KIX", sub: "Economy · 1 stop · 11h 40m", badge: "$842", mode: "flight", bookUrl: "https://www.google.com/travel/flights?q=SFO+to+KIX" },
      { title: "Haruka Express", sub: "KIX → Kyoto · reserved", badge: "¥3,640", mode: "train", bookUrl: "https://www.westjr.co.jp/global/en/ticket/haruka/" },
    ],
    gems: [
      { title: "Yasaka pagoda at dusk", detail: "Best light 17:45 · 8 min from hotel" },
    ],
  },
  {
    day: 2,
    date: "Tuesday · April 9",
    title: "Arashiyama & bamboo",
    subtitle: "Bamboo grove, boat ride, vegetarian temple lunch",
    km: 8.2,
    blocks: [
      { id: "2a", time: "07:30", title: "Matcha breakfast at % Arabica", meta: "Higashiyama · 45m", kind: "cafe" },
      { id: "2b", time: "08:30", title: "Fushimi Inari shrine", meta: "Vermilion gates hike · 2h", crowd: "low", warn: "Photographer scams near gate 4", kind: "shrine" },
      { id: "2c", time: "11:00", title: "Flexible buffer", flex: true },
      { id: "2d", time: "12:00", title: "Lunch at Shigetsu", meta: "Shōjin ryōri · 90m", kind: "restaurant" },
      { id: "2e", time: "14:00", title: "Arashiyama bamboo grove", meta: "Walk + boat · 2h", crowd: "high", kind: "nature" },
      { id: "2f", time: "17:00", title: "Flexible buffer", flex: true },
      { id: "2g", time: "19:00", title: "Pontocho alley dinner crawl", meta: "Reservation held · 2h", kind: "restaurant" },
    ],
    dining: [
      { name: "Shigetsu", cuisine: "Shōjin ryōri · temple cuisine", tags: ["Vegetarian", "Reservation"], kind: "restaurant", bookUrl: "https://www.tablecheck.com/shops/shigetsu/reserve" },
      { name: "Mumokuteki Café", cuisine: "Modern washoku", tags: ["Vegan options"], kind: "cafe", bookUrl: "https://maps.google.com/?q=Mumokuteki+Cafe+Kyoto" },
      { name: "Ain Soph. Journey", cuisine: "Plant-based pancakes", tags: ["Vegan", "Nut-free"], kind: "restaurant", bookUrl: "https://www.opentable.com/s?term=Ain+Soph+Kyoto" },
    ],
    stays: [
      { name: "Ryokan Yachiyo", tag: "Closest to JR", price: "¥24,800", sub: "3 min walk to Saga-Arashiyama", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Ryokan+Yachiyo+Kyoto" },
      { name: "Hotel The Mitsui Kyoto", tag: "Current stay", price: "¥58,200", sub: "Nijō onsen suite", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Hotel+The+Mitsui+Kyoto", highlighted: true },
    ],
    transit: [
      { title: "JR Sagano line", sub: "Kyoto → Saga-Arashiyama · 16 min", badge: "Deal · ¥240", mode: "train", bookUrl: "https://www.jreast.co.jp/multi/en/" },
      { title: "Kyoto City Bus #28", sub: "Return via Kinkaku-ji loop", badge: "¥230", mode: "bus", bookUrl: "https://www.kyoto.travel/en/getting-around/bus.html" },
    ],
    gems: [
      { title: "Hidden moss garden at Gio-ji", detail: "No queues · best at 8 AM" },
      { title: "Indigo dyeing workshop", detail: "Two artisans · 90 min hands-on" },
    ],
  },
  {
    day: 3,
    date: "Wednesday · April 10",
    title: "Nara day trip",
    subtitle: "Tōdai-ji, deer park, mochi pounding",
    km: 6.4,
    blocks: [
      { id: "3a", time: "08:00", title: "Kintetsu Limited Express to Nara", meta: "Reserved · 35 min", kind: "station" },
      { id: "3b", time: "09:15", title: "Tōdai-ji Great Buddha hall", meta: "World's largest wooden building · 90m", kind: "shrine", crowd: "med" },
      { id: "3c", time: "11:00", title: "Nara Deer Park", meta: "Bring shika senbei · 60m", kind: "nature" },
      { id: "3d", time: "12:30", title: "Lunch at Onwa", meta: "Vegetarian set menu · 75m", kind: "restaurant" },
      { id: "3e", time: "14:00", title: "Mochi-making at Nakatanidou", meta: "Famous high-speed mochi · 30m", kind: "restaurant" },
      { id: "3f", time: "15:00", title: "Flexible buffer", flex: true },
      { id: "3g", time: "18:30", title: "Return to Kyoto, dinner in Gion", meta: "Soba at Honke Owariya · 90m", kind: "restaurant" },
    ],
    dining: [
      { name: "Onwa Nara", cuisine: "Seasonal vegetarian", tags: ["Vegetarian"], kind: "restaurant", bookUrl: "https://www.opentable.com/s?term=Onwa+Nara" },
      { name: "Nakatanidou", cuisine: "Yomogi mochi", tags: ["Walk-in"], kind: "cafe", bookUrl: "https://maps.google.com/?q=Nakatanidou+Nara" },
      { name: "Honke Owariya", cuisine: "500-year-old soba", tags: ["Vegetarian dashi"], kind: "restaurant", bookUrl: "https://maps.google.com/?q=Honke+Owariya+Kyoto" },
    ],
    stays: [
      { name: "Hotel The Mitsui Kyoto", tag: "Current stay", price: "¥58,200", sub: "Return tonight", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Hotel+The+Mitsui+Kyoto", highlighted: true },
    ],
    transit: [
      { title: "Kintetsu Limited Express", sub: "Kyoto → Nara · reserved", badge: "¥1,160", mode: "train", bookUrl: "https://www.kintetsu.co.jp/foreign/english/" },
      { title: "Nara Loop Bus", sub: "Day pass · unlimited", badge: "¥500", mode: "bus", bookUrl: "https://www.narakotsu.co.jp/language/en/" },
    ],
    gems: [
      { title: "Isuien Garden tea house", detail: "Behind Tōdai-ji · few tourists" },
    ],
  },
  {
    day: 4,
    date: "Thursday · April 11",
    title: "Tea & textiles",
    subtitle: "Uji matcha fields, Nishijin weaving, kaiseki dinner",
    km: 9.0,
    blocks: [
      { id: "4a", time: "08:30", title: "JR Nara line to Uji", meta: "30 min", kind: "station" },
      { id: "4b", time: "09:15", title: "Byōdō-in temple", meta: "On the ¥10 coin · 75m", kind: "shrine" },
      { id: "4c", time: "11:00", title: "Matcha tasting at Itohkyuemon", meta: "5 grades flight · 60m", kind: "cafe" },
      { id: "4d", time: "13:00", title: "Lunch at Tatsumiya", meta: "Cha-soba & vegetable tempura", kind: "restaurant" },
      { id: "4e", time: "15:00", title: "Nishijin weaving studio", meta: "Loom demo + craft · 90m", kind: "museum" },
      { id: "4f", time: "17:00", title: "Flexible buffer", flex: true },
      { id: "4g", time: "19:30", title: "Kaiseki at Kikunoi Roan", meta: "Michelin · 2h tasting", kind: "restaurant" },
    ],
    dining: [
      { name: "Itohkyuemon", cuisine: "Matcha flight", tags: ["Walk-in"], kind: "cafe", bookUrl: "https://maps.google.com/?q=Itohkyuemon+Uji" },
      { name: "Tatsumiya", cuisine: "Cha-soba", tags: ["Vegetarian"], kind: "restaurant", bookUrl: "https://maps.google.com/?q=Tatsumiya+Uji" },
      { name: "Kikunoi Roan", cuisine: "Michelin kaiseki", tags: ["Reservation", "Veg menu"], kind: "restaurant", bookUrl: "https://www.tablecheck.com/shops/kikunoi-roan/reserve" },
    ],
    stays: [
      { name: "Hotel The Mitsui Kyoto", tag: "Current stay", price: "¥58,200", sub: "Nijō onsen suite", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Hotel+The+Mitsui+Kyoto", highlighted: true },
    ],
    transit: [
      { title: "JR Nara line", sub: "Kyoto → Uji · IC card", badge: "¥240", mode: "train", bookUrl: "https://www.jreast.co.jp/multi/en/" },
    ],
    gems: [
      { title: "Tea master home visit", detail: "Private 1-hour ceremony · book ahead" },
    ],
  },
  {
    day: 5,
    date: "Friday · April 12",
    title: "Osaka street food",
    subtitle: "Dōtonbori, Umeda sky, takoyaki crawl",
    km: 7.6,
    blocks: [
      { id: "5a", time: "09:00", title: "Shinkansen Nozomi to Osaka", meta: "14 min · reserved", kind: "station" },
      { id: "5b", time: "10:00", title: "Umeda Sky Building", meta: "Floating garden observatory · 90m", kind: "museum" },
      { id: "5c", time: "12:30", title: "Takoyaki crawl in Dōtonbori", meta: "3-stop tasting · 90m", crowd: "high", kind: "restaurant" },
      { id: "5d", time: "15:00", title: "Flexible buffer", flex: true },
      { id: "5e", time: "16:30", title: "Shitennō-ji temple grounds", meta: "Japan's oldest temple · 60m", kind: "shrine" },
      { id: "5f", time: "19:00", title: "Dinner at Mizuno okonomiyaki", meta: "Tablecheck reservation · 90m", kind: "restaurant" },
      { id: "5g", time: "21:00", title: "Return Shinkansen to Kyoto", meta: "Reserved", kind: "station" },
    ],
    dining: [
      { name: "Mizuno", cuisine: "Okonomiyaki (Michelin)", tags: ["Veg option", "Reservation"], kind: "restaurant", bookUrl: "https://www.tablecheck.com/shops/mizuno-osaka/reserve" },
      { name: "Wanaka Sennichimae", cuisine: "Takoyaki", tags: ["Walk-in"], kind: "restaurant", bookUrl: "https://maps.google.com/?q=Wanaka+Takoyaki+Osaka" },
      { name: "Salon de Mon Cher", cuisine: "Dōjima roll", tags: ["Dessert"], kind: "cafe", bookUrl: "https://maps.google.com/?q=Mon+Cher+Dojima+Osaka" },
    ],
    stays: [
      { name: "Hotel The Mitsui Kyoto", tag: "Returning tonight", price: "¥58,200", sub: "Same suite held", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Hotel+The+Mitsui+Kyoto", highlighted: true },
    ],
    transit: [
      { title: "Shinkansen Nozomi", sub: "Kyoto ⇄ Shin-Osaka · reserved", badge: "¥2,860", mode: "train", bookUrl: "https://smart-ex.jp/en/" },
      { title: "Osaka Metro Day Pass", sub: "Unlimited rides", badge: "¥820", mode: "bus", bookUrl: "https://subway.osakametro.co.jp/en/" },
    ],
    gems: [
      { title: "Hozen-ji yokocho", detail: "Lantern-lit alley · skip Dōtonbori crowd" },
    ],
  },
  {
    day: 6,
    date: "Saturday · April 13",
    title: "Hidden corners & farewell",
    subtitle: "Philosopher's path, onsen, farewell kaiseki",
    km: 5.8,
    blocks: [
      { id: "6a", time: "08:00", title: "Philosopher's path walk", meta: "Cherry blossoms · 90m", kind: "nature" },
      { id: "6b", time: "10:00", title: "Nanzen-ji temple & aqueduct", meta: "Zen garden · 75m", kind: "shrine" },
      { id: "6c", time: "12:00", title: "Lunch at Mimikou", meta: "Yudofu set · 75m", kind: "restaurant" },
      { id: "6d", time: "14:00", title: "Kurama onsen day trip", meta: "Outdoor mountain bath · 3h", kind: "nature" },
      { id: "6e", time: "17:30", title: "Flexible buffer", flex: true },
      { id: "6f", time: "19:00", title: "Farewell kaiseki at Kichisen", meta: "3-star · 2.5h", kind: "restaurant" },
    ],
    dining: [
      { name: "Mimikou", cuisine: "Yudofu (tofu hotpot)", tags: ["Vegetarian"], kind: "restaurant", bookUrl: "https://maps.google.com/?q=Mimikou+Kyoto" },
      { name: "Kichisen", cuisine: "3-star kaiseki", tags: ["Reservation", "Veg menu"], kind: "restaurant", bookUrl: "https://www.tablecheck.com/shops/kichisen/reserve" },
    ],
    stays: [
      { name: "Hotel The Mitsui Kyoto", tag: "Final night", price: "¥58,200", sub: "Late checkout 14:00", kind: "hotel", bookUrl: "https://www.booking.com/searchresults.html?ss=Hotel+The+Mitsui+Kyoto", highlighted: true },
    ],
    transit: [
      { title: "Eizan Railway", sub: "Demachiyanagi → Kurama · scenic", badge: "¥430", mode: "train", bookUrl: "https://eizandensha.co.jp/en/" },
      { title: "ANA NH8 · KIX → SFO", sub: "Returns Sun 11:00 · Economy", badge: "$842", mode: "flight", bookUrl: "https://www.google.com/travel/flights?q=KIX+to+SFO" },
    ],
    gems: [
      { title: "Konchi-in dry garden", detail: "Tucked behind Nanzen-ji · usually empty" },
    ],
  },
];

const transitIcon = { flight: Plane, train: Train, bus: Bus } as const;

export function Dashboard() {
  const [activeDay, setActiveDay] = useState(2);
  const [drag, setDrag] = useState<string | null>(null);
  const [dayBlocks, setDayBlocks] = useState<Record<number, Block[]>>(
    Object.fromEntries(days.map((d) => [d.day, d.blocks])),
  );

  const data = days.find((d) => d.day === activeDay)!;
  const blocks = dayBlocks[activeDay];

  const handleDrop = (targetId: string) => {
    if (!drag || drag === targetId) return;
    const next = [...blocks];
    const from = next.findIndex((b) => b.id === drag);
    const to = next.findIndex((b) => b.id === targetId);
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setDayBlocks((prev) => ({ ...prev, [activeDay]: next }));
    setDrag(null);
  };

  return (
    <div>
      {/* Day header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{data.date}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data.subtitle}</p>
        </div>
      </div>

      {/* Day-by-day picker */}
      <div className="mb-6 -mx-1 overflow-x-auto px-1 pb-2">
        <div className="flex gap-2">
          {days.map((d) => {
            const active = d.day === activeDay;
            return (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`group flex min-w-[160px] shrink-0 flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition-all ${
                  active
                    ? "border-foreground bg-foreground text-background shadow-[var(--shadow-soft)]"
                    : "border-border bg-card text-foreground hover:border-foreground/40"
                }`}
              >
                <span className={`font-mono text-[10px] uppercase tracking-wider ${active ? "opacity-70" : "text-muted-foreground"}`}>
                  Day {d.day.toString().padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold leading-tight">{d.title}</span>
                <span className={`text-[11px] ${active ? "opacity-70" : "text-muted-foreground"}`}>{d.date.split(" · ")[1]}</span>
              </button>
            );
          })}
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
                {b.flex ? (
                  <div className="min-w-0 flex-1">
                    <button className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      <Plus className="h-3.5 w-3.5" />
                      Open slot — add or breathe
                    </button>
                  </div>
                ) : (
                  <>
                    {b.kind && <VenueLogo name={b.title.replace(/^[A-Za-z]+ at /, "")} kind={b.kind} size="sm" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">{b.title}</p>
                      {b.meta && <p className="mt-0.5 text-xs text-muted-foreground">{b.meta}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {b.kind && <KindPill kind={b.kind} />}
                        {b.crowd && <CrowdMeter level={b.crowd} />}
                        {b.warn && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            {b.warn}
                          </span>
                        )}
                      </div>
                    </div>
                    <GripVertical className="h-4 w-4 self-center text-foreground/30 opacity-0 transition-opacity group-hover:opacity-100" />
                  </>
                )}
              </li>
            ))}
          </ol>
        </Card>

        {/* Map */}
        <Card className="col-span-12 lg:col-span-7">
          <div className="flex items-start justify-between">
            <CardHeader icon={MapIcon} title="Route map" subtitle={`Today's footprint · ${data.km} km`} />
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
            <Pin x="10%" y="80%" label="Start" tone="dark" />
            <Pin x="35%" y="50%" label={data.blocks.find((b) => b.kind === "nature" || b.kind === "shrine")?.title.split(" ")[0] ?? "Visit"} tone="primary" />
            <Pin x="62%" y="58%" label="Lunch" tone="primary" />
            <Pin x="88%" y="20%" label="Dinner" tone="dark" />
            <Util x="25%" y="68%" icon={ShoppingBasket} />
            <Util x="50%" y="38%" icon={Pill} />
            <Util x="76%" y="42%" icon={ShoppingBasket} />
          </div>
        </Card>

        {/* Stay */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-7">
          <CardHeader icon={Hotel} title="Accommodation" subtitle="Tap to book or compare" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.stays.map((s) => (
              <StayCard key={s.name} {...s} />
            ))}
          </div>
        </Card>

        {/* Dining */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-5">
          <CardHeader icon={Utensils} title="Dining for you" subtitle="Vegetarian · No nuts" />
          <ul className="mt-4 space-y-3">
            {data.dining.map((d) => (
              <DineRow key={d.name} {...d} />
            ))}
          </ul>
        </Card>

        {/* Transit / bookings */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-7">
          <CardHeader icon={Train} title="Flights, trains & transit" subtitle="All bookings in one place" />
          <ul className="mt-4 space-y-2.5">
            {data.transit.map((t) => (
              <TransitRow key={t.title} {...t} />
            ))}
          </ul>
        </Card>

        {/* Hidden gems */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-5 bg-gradient-to-br from-card to-accent/40">
          <CardHeader icon={Leaf} title="Off the beaten path" subtitle="Scraped from local blogs" />
          <ul className="mt-4 space-y-3">
            {data.gems.map((g) => (
              <GemRow key={g.title} {...g} />
            ))}
          </ul>
        </Card>

        {/* Alerts */}
        <Card className="col-span-12">
          <CardHeader icon={AlertTriangle} title="Live intel" subtitle="Updated 4 minutes ago" />
          <div className="mt-4 grid gap-2.5 md:grid-cols-3">
            <Alert tone="warn" title="Crowds at Tenryū-ji" body="Tour buses arrive 10–11 AM. Visit before 9 or after 4." />
            <Alert tone="danger" title="Overcharge near Dōtonbori" body="3 menus flagged this week. Confirm prices before ordering." />
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
    low: { label: "Quiet now", tone: "text-emerald-700 bg-emerald-50" },
    med: { label: "Filling up", tone: "text-amber-700 bg-amber-50" },
    high: { label: "Busy · go 7 AM", tone: "text-rose-700 bg-rose-50" },
  }[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${map.tone}`}>
      <Users2 className="h-2.5 w-2.5" />
      {map.label}
    </span>
  );
}

function StayCard({
  tag,
  name,
  price,
  sub,
  kind,
  bookUrl,
  highlighted,
}: {
  tag: string;
  name: string;
  price: string;
  sub: string;
  kind: VenueKind;
  bookUrl: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border p-4 transition-colors ${highlighted ? "border-foreground/40 bg-background" : "border-border bg-background hover:border-foreground/30"}`}>
      <div className="flex items-start gap-3">
        <VenueLogo name={name} kind={kind} />
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
            <Sparkles className="h-2.5 w-2.5" />
            {tag}
          </span>
          <div className="mt-1.5 flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="shrink-0 font-mono text-sm">{price}</p>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>
      <a
        href={bookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
      >
        Book on Booking.com
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function TransitRow({
  title,
  sub,
  badge,
  mode,
  bookUrl,
}: {
  title: string;
  sub: string;
  badge: string;
  mode: "flight" | "train" | "bus";
  bookUrl: string;
}) {
  const Icon = transitIcon[mode];
  const provider = mode === "flight" ? "Google Flights" : mode === "train" ? "Operator site" : "Operator site";
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800 ring-1 ring-sky-200">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      <span className="hidden items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background sm:inline-flex">
        <Tag className="h-2.5 w-2.5" />
        {badge}
      </span>
      <a
        href={bookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-foreground/40 hover:bg-accent"
      >
        Book
        <ExternalLink className="h-3 w-3" />
      </a>
    </li>
  );
}

function DineRow({
  name,
  cuisine,
  tags,
  kind,
  bookUrl,
}: {
  name: string;
  cuisine: string;
  tags: string[];
  kind: VenueKind;
  bookUrl: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background px-3 py-3 transition-colors hover:border-foreground/30">
      <VenueLogo name={name} kind={kind} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{cuisine}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
      <a
        href={bookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-foreground/40 hover:bg-accent"
      >
        Reserve
        <ExternalLink className="h-3 w-3" />
      </a>
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
