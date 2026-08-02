import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function FooterCTA() {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-5xl text-center">

        <h2 className="text-5xl font-bold">
          Ready to Ship With Logicarts?
        </h2>

        <p className="mt-6 text-lg text-gray-400">
          Let's build your logistics network together.
        </p>

        <Link href="/contact">
          <Button
            className="mt-10 bg-[#1877F2] px-10 py-6 text-lg"
          >
            Contact Us
          </Button>
        </Link>

      </div>
    </section>
  );
}
