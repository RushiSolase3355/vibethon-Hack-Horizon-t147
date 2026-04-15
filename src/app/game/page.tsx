import { GameExperience } from "@/components/platform/game-experience";
import { PlatformShell } from "@/components/platform/platform-shell";

export const metadata = {
  title: "Classification Game | AIMLverse"
};

export default function GamePage() {
  return (
    <PlatformShell>
      <GameExperience />
    </PlatformShell>
  );
}
