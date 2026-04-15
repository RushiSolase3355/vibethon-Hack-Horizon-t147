type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanGlow">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>
    </div>
  );
}
