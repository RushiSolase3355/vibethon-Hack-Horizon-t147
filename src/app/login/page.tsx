import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Login | AIMLverse"
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Enter your learning command center"
      description="Continue your AIML streak, unlock lessons, and prepare for the next challenge."
    >
      <form className="space-y-4">
        <Input label="Email" name="email" placeholder="you@aimlverse.dev" type="email" />
        <Input label="Password" name="password" placeholder="Enter password" type="password" />
        <Button className="w-full" href="/#features">
          Login locally
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-300">
        New explorer?{" "}
        <Link className="font-semibold text-cyanGlow hover:text-white" href="/register">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
