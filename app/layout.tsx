// next-app/app/layout.tsx
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider.tsx";
import { ReactNode } from "react";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { WagmiProvider } from "@/components/providers/wagmi-provider";
import RainbowKitWrapper from "@/components/providers/rainbowkit-wrapper";


export const metadata = {
  title: "Factra",
  description: "Bitcoin Invoice Factoring Protocol on Citrea zkRollup",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <WagmiProvider>
          <QueryProvider>
            <TooltipProvider>
              <Toaster richColors position="top-right" />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <RainbowKitWrapper>{children}</RainbowKitWrapper>
              </ThemeProvider>
            </TooltipProvider>
          </QueryProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
