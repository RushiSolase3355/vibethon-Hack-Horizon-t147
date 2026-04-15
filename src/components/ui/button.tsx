import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
};

export function Button({
  children,
  href,
  className,
  variant = "primary",
  size = "md"
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyanGlow focus:ring-offset-2 focus:ring-offset-midnight",
    size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base",
    variant === "primary"
      ? "bg-cyanGlow text-midnight shadow-glow hover:-translate-y-1 hover:bg-white hover:shadow-[0_0_48px_rgba(45,212,255,0.30)]"
      : "border border-white/15 bg-white/10 text-white hover:-translate-y-1 hover:border-cyanGlow/50 hover:bg-white/15 hover:shadow-glow",
    className
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
