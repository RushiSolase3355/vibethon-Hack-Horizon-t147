import { RoutePlaceholder } from "@/components/sections/route-placeholder";

export const metadata = {
  title: "Dashboard | AIMLverse"
};

export default function DashboardPage() {
  return (
    <RoutePlaceholder
      description="Progress tracking, XP, streaks, badges, and learning momentum will arrive in Phase 2."
      eyebrow="Commit 2 route ready"
      title="Your AI learning dashboard is queued for the next checkpoint."
    />
  );
}
