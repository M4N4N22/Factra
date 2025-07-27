import { WalletConnection } from './WalletConnection';
import { ModeToggle } from './ThemeToggle';
import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50  bg-card shadow">
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
