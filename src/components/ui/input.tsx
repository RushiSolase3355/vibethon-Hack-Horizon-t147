import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ className, id, label, name, ...props }: InputProps) {
  const inputId = id ?? name;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      <input
        className={cn(
          "w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyanGlow focus:ring-2 focus:ring-cyanGlow/20",
          className
        )}
        id={inputId}
        name={name}
        {...props}
      />
    </label>
  );
}
