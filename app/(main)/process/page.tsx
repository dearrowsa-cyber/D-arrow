"use client";

import ProcessHero from "@/components/process/ProcessHero";
import ProcessSteps from "@/components/process/ProcessSteps";
import ProcessFlow from "@/components/process/ProcessFlow";
import ProcessWhy from "@/components/process/ProcessWhy";
import ProcessCTA from "@/components/process/ProcessCTA";

export default function ProcessPage() {
  return (
    <main className="min-h-screen text-white">
      <ProcessHero />
      <ProcessSteps />
      <ProcessFlow />
      <ProcessWhy />
      <ProcessCTA />
    </main>
  );
}