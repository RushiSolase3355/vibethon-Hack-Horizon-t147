"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAimlverseState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await registerUser(name, email, password);

    if (!result.success) {
      setError(result.message ?? "Unable to create account.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <AuthShell
      eyebrow="Start free"
      title="Create your AIMLverse profile"
      description="A lightweight local-auth screen for the hackathon prototype. No backend needed for Commit 1."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          type="text"
          value={name}
        />
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
          placeholder="Create password"
          type="password"
          value={password}
        />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button className="w-full" type="submit">
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
