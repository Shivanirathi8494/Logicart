import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">

        <div>
          <h2 className="text-3xl font-extrabold tracking-wide text-white sm:text-4xl lg:text-5xl">
            LOGICARTS
          </h2>

          <p className="mt-3 text-sm uppercase tracking-[0.25em] text-slate-400">
            ALWAYS ON TIME
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <div className="space-y-4 text-slate-300">
            <Link href="/" className="block hover:text-white">Home</Link>
            <Link href="/services" className="block hover:text-white">Services</Link>
            <Link href="/career" className="block hover:text-white">Career</Link>
            <Link href="/about" className="block hover:text-white">About</Link>
            <Link href="/contact" className="block hover:text-white">Contact Us</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Contact
          </h3>

          <div className="space-y-3 text-slate-300">

            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>info@logicarts.in</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Bengaluru, Karnataka, India</span>
            </div>

          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Follow Us
          </h3>

          <div className="flex flex-wrap gap-3">

            <a
              href="#"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-[#0077B5] hover:text-white"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-[#1877F2] hover:text-white"
            >
              Facebook
            </a>

            <a
              href="#"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-[#E1306C] hover:text-white"
            >
              Instagram
            </a>

            <a
              href="#"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-[#FF0000] hover:text-white"
            >
              YouTube
            </a>

          </div>
        </div>

        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
        © 2026 Logicarts. All Rights Reserved.
      </div>
    </footer>
  );
}
