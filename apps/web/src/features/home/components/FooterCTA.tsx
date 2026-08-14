import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function FooterCTA() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#0b2340]">
        <div className="relative px-8 py-14 sm:px-12 lg:px-16 lg:py-16">

          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-transparent via-transparent to-[#ff7417]/20" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.65fr]">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
                Ready to Ship?
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Let&apos;s build your logistics network together.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Get in touch with our logistics experts for a custom
                quote and consultation.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 rounded-full bg-[#ff7417] px-8 py-5 text-lg font-semibold text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#e9680d]"
              >
                Contact Us
                <ArrowRight size={20} />
              </Link>

              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-3 rounded-full border border-white/30 px-8 py-5 text-lg font-medium text-white transition hover:border-[#ff7417] hover:text-[#ff7417]"
              >
                <Phone size={19} />
                Call +91 98765 43210
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
