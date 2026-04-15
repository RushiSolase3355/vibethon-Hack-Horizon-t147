import { PlatformShell } from "@/components/platform/platform-shell";
import { SimulationExperience } from "@/components/platform/simulation-experience";

export const metadata = {
  title: "Simulation Lab | AIMLverse"
};

export default function SimulationPage() {
  return (
    <PlatformShell>
      <SimulationExperience />
    </PlatformShell>
  );
}
