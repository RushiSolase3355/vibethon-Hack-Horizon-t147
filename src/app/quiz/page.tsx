import { PlatformShell } from "@/components/platform/platform-shell";
import { QuizExperience } from "@/components/platform/quiz-experience";

export const metadata = {
  title: "Quiz Arena | AIMLverse"
};

export default function QuizPage() {
  return (
    <PlatformShell>
      <QuizExperience />
    </PlatformShell>
  );
}
