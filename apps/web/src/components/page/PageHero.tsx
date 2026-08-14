interface PageHeroProps {
  title: string;
  subtitle: string;
}

export default function PageHero({
  title,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0b2340] py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b2340] via-[#0b2340] to-[#173b5e]" />

      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ff7417]/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">

        <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#ff7417]">
          Logicarts
        </p>

        <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
          {title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          {subtitle}
        </p>

      </div>
    </section>
  );
}
