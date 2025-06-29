import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UseCasesSection = () => {
  const businessBenefits = [
    "Improve cash flow",
    "Avoid reliance on OTC credit",
    "Use BTC natively",
    "Reduce payment delays"
  ];
  
  const investorBenefits = [
    "Earn yield on low-risk, short-term BTC invoices", 
    "Access a new asset class",
    "Transparent and verifiable on-chain",
    "Diversify Bitcoin holdings"
  ];
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Use Cases</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Factra serves both businesses seeking liquidity and investors looking for yield
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                For Businesses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                For Investors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {investorBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
