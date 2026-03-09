import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './context/WalletContext.tsx'

const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || ''

if (!privyAppId && import.meta.env.DEV) {
  console.warn(
    'VITE_PRIVY_APP_ID не задан. Добавь его в .env.local (см. .env.example). Без него вход не откроется.',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['email', 'google', 'apple', 'twitter'],
      }}
    >
      <WalletProvider>
        <App />
      </WalletProvider>
    </PrivyProvider>
  </StrictMode>,
)
