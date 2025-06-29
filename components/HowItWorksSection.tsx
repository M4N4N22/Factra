import { Card, CardContent } from '@/components/ui/card';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create & Tokenize",
      description: "Seller creates and tokenizes a Bitcoin invoice on Factra's platform",
      icon: "📄"
    },
    {
      number: "02", 
      title: "Investor Buys",
      description: "Investor purchases invoice at a discount with escrowed BTC",
      icon: "💰"
    },
    {
      number: "03",
      title: "Funds Released",
      description: "Upon maturity, funds are released and investor earns yield",
      icon: "🚀"
    }
  ];
  
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and secure Bitcoin invoice factoring in three steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="gradient-card hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-primary text-lg font-bold mb-2">{step.number}</div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
