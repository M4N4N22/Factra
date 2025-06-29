import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { UseCasesSection } from '@/components/UseCasesSection';
import { WhyFactraSection } from '@/components/WhyFactraSection';
import { FinalCtaSection } from '@/components/FinalCtaSection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
};

