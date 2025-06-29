import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FinalCtaSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Start factoring with Factra today
          </h2>
          <p className="text-2xl text-muted-foreground mb-8">
            Turn waiting into earning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
              >
                Launch App
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg ">
              View Docs
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
    </section>
  );
};
