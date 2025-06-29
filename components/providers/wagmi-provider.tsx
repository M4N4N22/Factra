'use client'

import { WagmiProvider as BaseWagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi/config'

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <BaseWagmiProvider config={config}>{children}</BaseWagmiProvider>
}
