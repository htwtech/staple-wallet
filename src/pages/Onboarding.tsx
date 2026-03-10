import { useWallet } from '../hooks/useWallet'

function VaultLogo() {
  return (
    <img
      src="/logoLether_wallet.svg"
      alt="Lether Wallet"
      className="mx-auto h-auto w-full max-w-[260px] invert"
    />
  )
}

const btn =
  'flex w-full max-w-[min(100%,20rem)] mx-auto items-center justify-center gap-3 rounded-full border-0 py-3.5 px-5 text-sm font-medium transition active:opacity-80 disabled:opacity-50 [background:var(--color-button)] [color:var(--color-text)]'

export function OnboardingPage() {
  const { status, login, error } = useWallet()
  const isLoading = status === 'connecting'

  return (
    <div className="flex min-h-screen flex-col [background:var(--color-bg)] [color:var(--color-text)]">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-12">
        <div className="mb-10 flex flex-col items-center">
          <VaultLogo />
        </div>

        <div className="flex w-full max-w-[min(100%,20rem)] flex-col gap-3">
          <button
            type="button"
            className={btn}
            disabled={isLoading}
            onClick={() => void login()}
          >
            {isLoading ? 'Logging in…' : 'Log In'}
          </button>
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        ) : null}
      </div>

      <footer className="flex flex-col items-center gap-1 px-6 pb-10 pt-4 text-center text-xs text-[#8e8e93]">
        <p>
          By entering you agree to{' '}
          <a
            href="/terms"
            className="underline hover:opacity-90"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms and conditions
          </a>
        </p>
        <a
          href="/privacy"
          className="underline hover:opacity-90"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  )
}
