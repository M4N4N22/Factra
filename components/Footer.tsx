export const Footer = () => {
    return (
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">F</span>
              </div>
              <span className="text-sm font-medium">Factra</span>
              <span className="text-xs text-muted-foreground">
                Turn Bitcoin invoices into instant liquidity
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Docs</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
            <p>Built on Citrea zkRollup • Secured by Bitcoin</p>
          </div>
        </div>
      </footer>
    );
  };
  