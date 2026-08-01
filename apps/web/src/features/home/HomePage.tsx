import Hero from "./components/Hero";
import TrackingWidget from "./components/TrackingWidget";
import Stats from "./components/Stats";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import AirPresence from "./components/AirPresence";
import FooterCTA from "./components/FooterCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />

      <TrackingWidget />

      <Stats />

      <Services />

      <WhyChooseUs />

      <AirPresence />

      <FooterCTA />
    </main>
  );
}
