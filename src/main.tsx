import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { WalletProvider, NetworkInfo } from "@terra-money/wallet-provider"

const mn: NetworkInfo = {
  name: "mainnet",
  chainID: "columbus-5",
  lcd: "https://lcd.terra.dev",
  api: "https://columbus-api.terra.dev",
  walletconnectID: 2
}

const walletConnectChainIds: Record<number, NetworkInfo> = {
  1: mn
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider 
      defaultNetwork={mn}
      walletConnectChainIds={walletConnectChainIds}
    >
      <App />
    </WalletProvider>
  </React.StrictMode>
)
