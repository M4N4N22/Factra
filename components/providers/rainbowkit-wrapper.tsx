// components/providers/rainbowkit-wrapper.tsx
"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function RainbowKitWrapper({ children }: Props) {
  return (
    <RainbowKitProvider theme={darkTheme({
      accentColor: '#A5F4A6',         // your primary color
      accentColorForeground: '#000000', // optional contrast text color
    })}
  >
      {children}
    </RainbowKitProvider>
  );
}
