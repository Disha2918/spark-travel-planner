import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/travel/Shell";
import { Onboarding } from "@/components/travel/Onboarding";
import { Blueprint } from "@/components/travel/Blueprint";
import { Dashboard } from "@/components/travel/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripMind — AI travel planning, made personal" },
      { name: "description", content: "Hyper-personalized itineraries that blend your inspiration, pace, and pre-trip intel into one elegant plan." },
      { property: "og:title", content: "Wayfare — AI travel planning, made personal" },
      { property: "og:description", content: "Hyper-personalized itineraries that blend your inspiration, pace, and pre-trip intel into one elegant plan." },
    ],
  }),
  component: Index,
});

type Step = "onboarding" | "blueprint" | "dashboard";

function Index() {
  const [step, setStep] = useState<Step>("onboarding");
  return (
    <Shell step={step} onStepChange={setStep}>
      <div key={step} className="animate-in fade-in duration-500">
        {step === "onboarding" && <Onboarding onComplete={() => setStep("blueprint")} />}
        {step === "blueprint" && <Blueprint onComplete={() => setStep("dashboard")} />}
        {step === "dashboard" && <Dashboard />}
      </div>
    </Shell>
  );
}
