import Header from "./components/Header";
import Hero from "./components/Hero";
import VisionSection from "./components/VisionSection";
import ThesisSection from "./components/ThesisSection";
import ResearchSection from "./components/ResearchSection";
import PersonasSection from "./components/PersonasSection";
import ConceptSection from "./components/ConceptSection";
import TrustSection from "./components/TrustSection";
import SystemSection from "./components/SystemSection";
import MoodboardSection from "./components/MoodboardSection";
import DemoSection from "./components/DemoSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090f]">
      <Header />
      <main>
        <Hero />
        <VisionSection />
        <ThesisSection />
        <ResearchSection />
        <PersonasSection />
        <ConceptSection />
        <TrustSection />
        <SystemSection />
        <MoodboardSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}
