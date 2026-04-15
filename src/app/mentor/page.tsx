import { MentorExperience } from "@/components/platform/mentor-experience";
import { PlatformShell } from "@/components/platform/platform-shell";

export const metadata = {
  title: "AI Mentor | AIMLverse"
};

export default function MentorPage() {
  return (
    <PlatformShell>
      <MentorExperience />
    </PlatformShell>
  );
}
