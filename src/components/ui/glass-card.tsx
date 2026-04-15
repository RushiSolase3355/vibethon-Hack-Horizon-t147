import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn("glass rounded-lg shadow-violet transition hover:-translate-y-1", className)}>
      {children}
    </div>
  );
}
