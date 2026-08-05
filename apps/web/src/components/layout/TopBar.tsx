import { Phone, Mail } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#1877F2] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>+91 98765 43210</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>info@logicarts.in</span>
          </div>

        </div>

        <div className="flex items-center gap-5">

          <a
            href="https://www.linkedin.com/company/logicarts/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>

          <a
            href="https://facebook.com/logicarts.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Facebook
          </a>

          <a
            href="https://instagram.com/logicartslogistics"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>

          <a
            href="https://www.youtube.com/@logicarts3988"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            YouTube
          </a>

        </div>

      </div>
    </div>
  );
}
