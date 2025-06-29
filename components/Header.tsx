import { WalletConnection } from './WalletConnection';
import { ModeToggle } from './ThemeToggle';
import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50  bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-semibold">Factra</span>
          </div>
          </Link>

          {/* Middle: Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">
              Use Cases
            </a>
            <a href="#why-factra" className="text-muted-foreground hover:text-foreground transition-colors">
              Why Factra
            </a>
          </nav>

          {/* Right: ModeToggle + Wallet */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <WalletConnection />
          </div>
        </div>
      </div>
    </header>
  );
};
