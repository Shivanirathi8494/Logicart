import Image from "next/image";
import Link from "next/link";
import Container from "../common/Container";
import { NAVIGATION } from "@/config/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">

        <div className="flex items-center gap-12">

          <Link href="/">
            <Image
              src="/logo/logicarts-logo.png"
              alt="Logicarts"
              width={180}
              height={48}
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-[15px] font-medium text-gray-700 transition-colors duration-200 hover:text-[#1877F2]"
              >
                {item.title}
              </Link>
            ))}
          </nav>

        </div>

        <div className="flex items-center gap-5">

          <span className="hidden xl:block text-sm font-semibold text-[#1877F2]">
            📞 +91 XXXXX XXXXX
          </span>

          <button
            className="rounded-lg bg-[#1877F2] px-5 py-2.5 font-medium text-white transition-all duration-200 hover:bg-[#166FE5] hover:shadow-lg"
          >
            Sign In
          </button>

        </div>

      </Container>
    </header>
  );
}
