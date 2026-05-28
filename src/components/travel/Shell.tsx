import { Compass } from "lucide-react";

interface ShellProps {
  step: "onboarding" | "blueprint" | "dashboard";
  onStepChange: (s: "onboarding" | "blueprint" | "dashboard") => void;
  children: React.ReactNode;
}

const steps = [
  { id: "onboarding", label: "Plan" },
  { id: "blueprint", label: "Blueprint" },
  { id: "dashboard", label: "Itinerary" },
] as const;

export function Shell({ step, onStepChange, children }: ShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Wayfare</span>
            <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
              AI
            </span>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card p-1 text-sm shadow-[var(--shadow-soft)] md:flex">
            {steps.map((s, i) => {
              const active = s.id === step;
              return (
                <button
                  key={s.id}
                  onClick={() => onStepChange(s.id)}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mr-1.5 opacity-60">0{i + 1}</span>
                  {s.label}
                </button>
              );
            })}
          </nav>

          <button className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90">
            Save trip
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
