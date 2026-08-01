import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold text-[#1877F2]">
          Welcome to Logicarts
        </h1>
      </main>

      <Footer />
    </>
  );
}
