import { Card, CardContent } from '@/components/ui/card';

export const WhyFactraSection = () => {
  const features = [
    {
      title: "Bitcoin-native",
      description: "Powered by Citrea zkEVM",
      icon: "₿"
    },
    {
      title: "Secure Escrow",
      description: "Via Smart Contracts", 
      icon: "🔒"
    },
    {
      title: "Optional Privacy",
      description: "With zkProofs",
      icon: "🔐"
    },
    {
      title: "No Intermediaries",
      description: "Or custodians",
      icon: "🤝"
    }
  ];
  
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Factra?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on the most secure and decentralized infrastructure for Bitcoin DeFi
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="gradient-card text-center hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Partner badges */}
        <div className="flex justify-center items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
            <span className="text-sm font-medium">Secured by Bitcoin</span>
          </div>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="text-sm font-medium">Powered by Citrea</span>
          </div>
        </div>
      </div>
    </section>
  );
};
