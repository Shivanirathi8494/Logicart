import "./globals.css";

import type { Metadata } from "next";

import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Logicarts",
  description: "Delivering Trust. Driving Logistics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">

        <TopBar />

        <Header />

        {children}

        <Footer />

      </body>
    </html>
  );
}
