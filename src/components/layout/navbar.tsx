"use client";

import Link from "next/link";
import { BrainCircuit, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Modules" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#features", label: "Features" },
  { href: "/login", label: "Login" }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-midnight/70 backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-cyanGlow/30 bg-cyanGlow/10 shadow-glow">
            <BrainCircuit className="h-5 w-5 text-cyanGlow" />
          </span>
          <span className="text-lg font-black tracking-wide text-white">AIMLverse</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              className="group relative py-2 text-sm font-medium text-slate-300 transition hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cyanGlow transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button href="/register" size="sm">
            Enter AIMLverse
          </Button>
        </div>

        <button
          aria-label="Toggle navigation"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/10 bg-midnight/95 px-4 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button href="/register" size="sm">
              Enter AIMLverse
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
