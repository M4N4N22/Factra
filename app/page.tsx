import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { WhyFactraSection } from "@/components/WhyFactraSection";
import { FinalCtaSection } from "@/components/FinalCtaSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 mt-4 flex justify-center ">
        <nav className="hidden md:flex items-center gap-6 z-10">
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#use-cases"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Use Cases
          </a>
          <a
            href="#why-factra"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Why Factra
          </a>
        </nav>
      </div>
      <main>
        <HeroSection />
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="use-cases">
          <UseCasesSection />
        </div>
        <div id="why-factra">
          <WhyFactraSection />
        </div>
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
