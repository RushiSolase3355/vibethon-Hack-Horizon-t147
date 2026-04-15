import { DashboardExperience } from "@/components/platform/dashboard-experience";
import { PlatformShell } from "@/components/platform/platform-shell";

export const metadata = {
  title: "Dashboard | AIMLverse"
};

export default function DashboardPage() {
  return (
    <PlatformShell>
      <DashboardExperience />
    </PlatformShell>
  );
}
