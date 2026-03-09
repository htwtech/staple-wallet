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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
        <Header />
        <main>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
