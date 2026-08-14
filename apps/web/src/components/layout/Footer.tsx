import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071d36] text-white">

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <div className="rounded-xl bg-white px-5 py-3">
                <img
                  src="/logo/logicarts-logo.png"
                  alt="Logicarts"
                  className="h-auto w-[165px]"
                />
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
              Delivering Trust. Driving Logistics.
            </p>

            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#ff7417]">
              Always On Time
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold">
              Quick Links
            </h3>

            <div className="mt-6 space-y-3">
              <Link
                href="/"
                className="block text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                Home
              </Link>

              <Link
                href="/services"
                className="block text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                Services
              </Link>

              <Link
                href="/tracking"
                className="block text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                Track Shipment
              </Link>

              <Link
                href="/about"
                className="block text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                About Us
              </Link>

              <Link
                href="/career"
                className="block text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                Careers
              </Link>

              <Link
                href="/contact"
                className="block text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5">

              <a
                href="tel:+919876543210"
                className="flex items-start gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-[#ff7417]"
                />
                <span>+91 98765 43210</span>
              </a>

              <a
                href="mailto:info@logicarts.in"
                className="flex items-start gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[#ff7417]"
                />
                <span>info@logicarts.in</span>
              </a>

              <div className="flex items-start gap-3 text-sm leading-6 text-slate-400">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#ff7417]"
                />
                <span>Bengaluru, Karnataka, India</span>
              </div>

            </div>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-lg font-bold">
              Follow Us
            </h3>

            <div className="mt-6 space-y-3">

              <a
                href="https://www.linkedin.com/company/logicarts/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-white/10 pb-3 text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                LinkedIn
                <ArrowUpRight size={16} />
              </a>

              <a
                href="https://facebook.com/logicarts.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-white/10 pb-3 text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                Facebook
                <ArrowUpRight size={16} />
              </a>

              <a
                href="https://instagram.com/logicartslogistics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-white/10 pb-3 text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                Instagram
                <ArrowUpRight size={16} />
              </a>

              <a
                href="https://www.youtube.com/@logicarts3988"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-white/10 pb-3 text-sm text-slate-400 transition hover:text-[#ff7417]"
              >
                YouTube
                <ArrowUpRight size={16} />
              </a>

            </div>
          </div>

        </div>

      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500">
          <span>
            © 2026 Logicarts. All Rights Reserved.
          </span>

          <span className="hidden sm:block">
            Delivering Trust. Driving Logistics.
          </span>
        </div>
      </div>

    </footer>
  );
}
