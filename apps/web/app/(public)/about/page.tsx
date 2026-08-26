import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";
import {
  Target,
  Eye,
  HeartHandshake,
  BadgeCheck,
  Scale,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

const coreValues = [
  {
    title: "Customer Focus",
    description:
      "We put our customers at the centre of every decision.",
    icon: HeartHandshake,
  },
  {
    title: "Reliability",
    description:
      "We deliver consistent and dependable logistics solutions.",
    icon: BadgeCheck,
  },
  {
    title: "Integrity",
    description:
      "We believe in transparency, accountability and doing the right thing.",
    icon: Scale,
  },
  {
    title: "Innovation",
    description:
      "We continuously use technology and better processes to improve logistics.",
    icon: Lightbulb,
  },
  {
    title: "Operational Excellence",
    description:
      "We focus on efficiency, quality and execution at every stage of the logistics journey.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Logicarts"
        subtitle="Delivering Trust. Driving Logistics."
      />

      <PageContainer>

        {/* WHO WE ARE */}
        <section className="py-16 lg:py-20">

          <div className="mx-auto max-w-5xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff7417]">
              Who We Are
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0b2340] sm:text-5xl">
              Technology-enabled multimodal logistics across India.
            </h2>

            <p className="mx-auto mt-7 max-w-4xl text-lg leading-8 text-slate-600">
              <strong className="font-semibold text-[#0b2340]">
                Logicarts is a technology-enabled multimodal logistics company
                providing reliable cargo movement solutions across India.
              </strong>
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-slate-600">
              We connect businesses and markets through integrated{" "}
              <strong className="font-semibold text-[#0b2340]">
                Air Cargo, PTL, First Mile, Mid Mile, Last Mile and Long-Haul
                logistics solutions
              </strong>
              , supported by technology, operational expertise and a growing
              pan-India network.
            </p>

            <p className="mt-7 text-xl font-bold text-[#ff7417]">
              Move cargo faster, smarter and more reliably.
            </p>

          </div>

        </section>

        {/* MISSION AND VISION */}
        <section className="grid gap-8 pb-16 lg:grid-cols-2">

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff7417]">
              <Target size={28} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
              Our Mission
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              To provide reliable, secure and technology-driven logistics
              solutions that help businesses move faster.
            </p>

          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff7417]">
              <Eye size={28} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
              Our Vision
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              To become one of India's most trusted multimodal logistics
              partners, connecting businesses and markets through seamless
              cargo movement.
            </p>

          </div>

        </section>

        {/* CORE VALUES */}
        <section className="pb-20">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
              Our Core Values
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0b2340] sm:text-5xl">
              The principles behind every movement.
            </h2>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

            {coreValues.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff7417]">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#0b2340]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>

                </div>
              );
            })}

          </div>

        </section>

        {/* PEOPLE SECTION */}
        <section className="pb-20">

          <div className="rounded-[32px] bg-[#0b2340] px-8 py-12 text-center text-white lg:px-14 lg:py-14">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
              People Behind Every Movement
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Operations powered by people, technology and execution.
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Our people and operational network work together to keep cargo
              moving across India.
            </p>

          </div>

        </section>

      </PageContainer>
    </>
  );
}
