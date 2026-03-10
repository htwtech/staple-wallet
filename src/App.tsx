import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { useWallet } from './hooks/useWallet'
import { ContactsPage } from './pages/Contacts'
import { DashboardPage } from './pages/Dashboard'
import { NewContactPage } from './pages/NewContact'
import { OnboardingPage } from './pages/Onboarding'
import { ReceivePage } from './pages/Receive'
import { SendPage } from './pages/Send'
import { SettingsPage } from './pages/Settings'

function AppRoutes() {
  const { isAuthenticated } = useWallet()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/send" element={<SendPage />} />
      <Route path="/receive" element={<ReceivePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/contacts/new" element={<NewContactPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AppLayout() {
  const { isAuthenticated } = useWallet()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="min-h-screen">
          <AppRoutes />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <main className="overflow-x-hidden">
        <AppRoutes />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
