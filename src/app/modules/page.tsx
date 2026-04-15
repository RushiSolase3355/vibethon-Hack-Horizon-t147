import { ModulesExperience } from "@/components/platform/modules-experience";
import { PlatformShell } from "@/components/platform/platform-shell";

export const metadata = {
  title: "Modules | AIMLverse"
};

export default function ModulesPage() {
  return (
    <PlatformShell>
      <ModulesExperience />
    </PlatformShell>
  );
}
