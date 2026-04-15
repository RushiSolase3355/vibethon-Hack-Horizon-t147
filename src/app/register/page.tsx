import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Register | AIMLverse"
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Start free"
      title="Create your AIMLverse profile"
      description="A lightweight local-auth screen for the hackathon prototype. No backend needed for Commit 1."
    >
      <form className="space-y-4">
        <Input label="Name" name="name" placeholder="Your name" type="text" />
        <Input label="Email" name="email" placeholder="you@aimlverse.dev" type="email" />
        <Input label="Password" name="password" placeholder="Create password" type="password" />
        <Button className="w-full" href="/#features">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-300">
        Already registered?{" "}
        <Link className="font-semibold text-cyanGlow hover:text-white" href="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
