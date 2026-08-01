interface PageHeroProps {
  title: string;
  subtitle: string;
}

export default function PageHero({
  title,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="bg-gradient-to-r from-[#1877F2] to-[#0B57D0] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-5xl font-bold">
          {title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg text-blue-100">
          {subtitle}
        </p>

      </div>
    </section>
  );
}
