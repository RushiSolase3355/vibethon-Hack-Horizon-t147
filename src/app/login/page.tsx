"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAimlverseState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await loginUser(email, password);

    if (!result.success) {
      setError(result.message ?? "Unable to login.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Enter your learning command center"
      description="Continue your AIML streak, unlock lessons, and prepare for the next challenge."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@aimlverse.dev"
          type="email"
          value={email}
        />
        <Input
          label="Password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          type="password"
          value={password}
        />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button className="w-full" type="submit">
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
