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
      <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo/logicarts-logo-v3.png"
            alt="Logicarts"
            width={240}
            height={63}
            priority
            className="w-[240px] h-auto object-contain"
          />
        </Link>

        <nav className="ml-auto flex items-center gap-8">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-[16px] font-medium text-slate-800 transition-colors hover:text-[#ff7417]"
            >
              {item.title}
            </Link>
          ))}

          <Link href="/login">
            <Button
              className="h-11 rounded-full bg-[#ff7417] px-7 text-[16px] font-semibold text-white shadow-none hover:bg-[#e9680d]"
            >
              Sign In
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
