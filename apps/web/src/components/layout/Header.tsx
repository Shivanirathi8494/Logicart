import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menu = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Career", href: "/career" },
  { title: "About", href: "/about" },
  { title: "Contact Us", href: "/contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link href="/" className="flex items-center">
          <Image
            src="/logo/logicarts-logo.png"
            alt="Logicarts"
            width={170}
            height={50}
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="font-medium text-gray-700 transition-colors hover:text-[#1877F2]"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <Link href="/portal/login">
          <Button>
            Sign In
          </Button>
        </Link>

      </div>
    </header>
  );
}
