import { Link, useLocation, useNavigate, type Location } from 'react-router-dom'

const routes: Record<string, string> = {
  '/': '',
  '/receive': 'Deposit your wallet',
  '/send': '',
  '/settings': 'Settings',
  '/contacts': 'Contacts',
  '/contacts/new': 'New contact',
}

export function Header({ locationOverride }: { locationOverride?: Location }) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = locationOverride?.pathname ?? location.pathname
  const isHome = pathname === '/'
  const title = routes[pathname] ?? ''

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl transition-[background] duration-200 [background:color-mix(in_srgb,var(--color-bg)_80%,transparent)]">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div className="flex w-24 items-center justify-start">
          {isHome ? (
            <Link
              to="/settings"
              className="glass-button flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--color-text)]"
              aria-label="Settings"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="glass-button flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--color-text)]"
              aria-label="Back"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {title ? (
          <h1 className="text-base font-semibold text-[var(--color-text)]">{title}</h1>
        ) : (
          <div />
        )}

        <div className="flex w-24 items-center justify-end gap-2">
          {pathname === '/settings' && (
            <button
              type="button"
              className="glass-button flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--color-text)]"
              aria-label="Theme"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          )}
          {(isHome || pathname === '/send' || pathname === '/settings') && (
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/12 text-sky-300 shadow-[0_10px_30px_rgba(56,189,248,0.18)] transition-colors hover:bg-sky-400/18"
              aria-label="Scan"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
