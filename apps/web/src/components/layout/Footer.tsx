import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">

        <div>
          <h2 className="text-6xl font-extrabold leading-tight text-white">
            LOGICARTS
          </h2>

          <p className="mt-4 text-slate-300">
            ALWAYS ON TIME
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Quick Links
          </h3>

          <div className="space-y-2 text-slate-300">
            <Link href="/" className="block hover:text-white">Home</Link>
            <Link href="/services" className="block hover:text-white">Services</Link>
            <Link href="/career" className="block hover:text-white">Career</Link>
            <Link href="/about" className="block hover:text-white">About</Link>
            <Link href="/contact" className="block hover:text-white">Contact Us</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">
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
          <h3 className="mb-4 text-lg font-semibold">
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

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
        © 2026 Logicarts. All Rights Reserved.
      </div>
    </footer>
  );
}
