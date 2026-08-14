import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../print.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
