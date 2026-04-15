import { LeaderboardExperience } from "@/components/platform/leaderboard-experience";
import { PlatformShell } from "@/components/platform/platform-shell";

export const metadata = {
  title: "Leaderboard | AIMLverse"
};

export default function LeaderboardPage() {
  return (
    <PlatformShell>
      <LeaderboardExperience />
    </PlatformShell>
  );
}
