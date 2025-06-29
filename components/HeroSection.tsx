import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-card/50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl tracking-tighter py-4  md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Turn Bitcoin invoices into instant liquidity
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A decentralized factoring protocol powered by <span className="text-foreground font-semibold">Citrea&apos;s zkRollup</span>. Get
            paid early, invest in yield-bearing invoices, and build trustless
            cash flow — all on <span className="text-foreground font-semibold">Bitcoin</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center z-10">
          <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
              >
                Launch App
               
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg "
            >
              View Marketplace
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
   
    </section>
  );
};
