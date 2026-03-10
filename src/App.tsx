import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigationType,
  type Location,
} from 'react-router-dom'
import { Header } from './components/layout/Header'
import { useWallet } from './hooks/useWallet'
import { ContactsPage } from './pages/Contacts'
import { DashboardPage } from './pages/Dashboard'
import { NewContactPage } from './pages/NewContact'
import { OnboardingPage } from './pages/Onboarding'
import { ReceivePage } from './pages/Receive'
import { SendPage } from './pages/Send'
import { SettingsPage } from './pages/Settings'

const ROUTE_TRANSITION_EXIT_MS = 140
const ROUTE_TRANSITION_ENTER_MS = 260

type RouteDirection = 'forward' | 'back'
type RouteStage = 'idle' | 'exit-forward' | 'exit-back' | 'enter-forward' | 'enter-back'

function getRouteRank(pathname: string, isAuthenticated: boolean) {
  if (!isAuthenticated) return 0

  switch (pathname) {
    case '/':
      return 0
    case '/send':
    case '/receive':
    case '/settings':
    case '/contacts':
      return 1
    case '/contacts/new':
      return 2
    default:
      return 1
  }
}

function getRouteDirection(params: {
  currentPathname: string
  nextPathname: string
  navigationType: ReturnType<typeof useNavigationType>
  isAuthenticated: boolean
}): RouteDirection {
  const { currentPathname, nextPathname, navigationType, isAuthenticated } = params

  if (navigationType === 'POP') {
    return 'back'
  }

  return getRouteRank(nextPathname, isAuthenticated) >= getRouteRank(currentPathname, isAuthenticated)
    ? 'forward'
    : 'back'
}

function AppRoutes({ locationOverride }: { locationOverride?: Location }) {
  const { isAuthenticated } = useWallet()

  if (!isAuthenticated) {
    return (
      <Routes location={locationOverride}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <Routes location={locationOverride}>
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
  const location = useLocation()
  const navigationType = useNavigationType()
  const [renderedLocation, setRenderedLocation] = useState(location)
  const [stage, setStage] = useState<RouteStage>('idle')

  useEffect(() => {
    if (location.key === renderedLocation.key) {
      return
    }

    const direction = getRouteDirection({
      currentPathname: renderedLocation.pathname,
      nextPathname: location.pathname,
      navigationType,
      isAuthenticated,
    })

    setStage(direction === 'forward' ? 'exit-forward' : 'exit-back')

    const exitTimer = window.setTimeout(() => {
      setRenderedLocation(location)
      setStage(direction === 'forward' ? 'enter-forward' : 'enter-back')
    }, ROUTE_TRANSITION_EXIT_MS)

    const settleTimer = window.setTimeout(() => {
      setStage('idle')
    }, ROUTE_TRANSITION_EXIT_MS + ROUTE_TRANSITION_ENTER_MS)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(settleTimer)
    }
  }, [isAuthenticated, location, navigationType, renderedLocation])

  useEffect(() => {
    setRenderedLocation(location)
    setStage('idle')
  }, [isAuthenticated])

  const routeStageClass = useMemo(() => {
    switch (stage) {
      case 'exit-forward':
        return 'route-scene-exit-forward'
      case 'exit-back':
        return 'route-scene-exit-back'
      case 'enter-forward':
        return 'route-scene-enter-forward'
      case 'enter-back':
        return 'route-scene-enter-back'
      default:
        return ''
    }
  }, [stage])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="route-shell min-h-screen overflow-x-clip">
          <div className={`route-scene ${routeStageClass}`.trim()}>
            <AppRoutes locationOverride={renderedLocation} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header locationOverride={renderedLocation} />
      <main className="route-shell overflow-x-clip">
        <div className={`route-scene ${routeStageClass}`.trim()}>
          <AppRoutes locationOverride={renderedLocation} />
        </div>
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
