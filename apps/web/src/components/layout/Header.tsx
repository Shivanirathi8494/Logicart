import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menu = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Career", href: "/career" },
  { title: "About Us", href: "/about" },
  { title: "Contact Us", href: "/contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-24 max-w-7xl items-center px-6">

        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo/logicarts-logo.png"
            alt="Logicarts"
            width={175}
            height={52}
            priority
            className="h-auto w-[175px]"
          />
        </Link>

        <nav className="ml-auto flex items-center gap-10">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-[17px] font-medium text-slate-800 transition-colors hover:text-[#ff7417]"
            >
              {item.title}
            </Link>
          ))}

          <Link href="/login">
            <Button
              className="rounded-full bg-[#ff7417] px-7 py-5 text-[16px] font-semibold text-white shadow-none hover:bg-[#e9680d]"
            >
              Sign In
            </Button>
          </Link>
        </nav>

      </div>
    </header>
  );
}
