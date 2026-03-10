import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { SecretPhraseModal } from '../components/wallet/SecretPhraseModal'
import { useWallet } from '../hooks/useWallet'
import { useState } from 'react'

function AvatarIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl [background:var(--color-field)]">
      <svg width="28" height="28" viewBox="0 0 80 80" fill="none" className="text-[var(--color-text)]/70">
        <circle cx="40" cy="28" r="12" fill="currentColor" />
        <circle cx="40" cy="52" r="12" fill="currentColor" />
        <circle cx="28" cy="40" r="12" fill="currentColor" />
        <circle cx="52" cy="40" r="12" fill="currentColor" />
      </svg>
    </div>
  )
}

export function SettingsPage() {
  const { secretPhrase, usdtBalance } = useWallet()
  const [showSecretPhrase, setShowSecretPhrase] = useState(false)

  return (
    <PageTransition variant="menu" className="relative z-10">
    <div className="mx-auto max-w-md bg-[var(--color-bg)] px-4 pb-10 pt-4">
      <div className="glass-card mb-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarIcon />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Leo HighTower</p>
              <p className="text-xs text-[var(--color-text)]/50">leonid@htw.tech</p>
            </div>
          </div>
          <button
            type="button"
            className="glass-button flex h-8 w-8 items-center justify-center text-[var(--color-text)]/70"
            aria-label="Edit profile"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide [background:var(--color-field)] text-[var(--color-text)]/70"
        >
          <span>Enter your referral code</span>
          <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="glass-card mb-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl [background:var(--color-field)] text-[var(--color-text)]/70">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text)]">Main Wallet</p>
              <p className="text-[11px] text-[var(--color-text)]/50">Primary account</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text)]">
            ${Number.parseFloat(usdtBalance || '0').toFixed(2).replace('.', ',')}
            <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]/50">
        Referral program
      </p>
      <div className="glass-card mb-6 overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl [background:var(--color-field)] text-[var(--color-text)]/70">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2m0 13V8a2 2 0 002 2h2a2 2 0 002-2m0 13V8a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm text-[var(--color-text)]">Invite & earn</span>
          </div>
          <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl [background:var(--color-field)] text-[var(--color-text)]/70">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm text-[var(--color-text)]">Referral statistics</span>
          </div>
          <span className="text-[11px] text-[var(--color-text)]/50">Soon</span>
        </div>
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]/50">
        Security
      </p>
      <div className="glass-card mb-6 overflow-hidden">
        <button type="button" className="flex w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text)]">Language</span>
          </div>
          <span className="text-[11px] text-[var(--color-text)]/50">EN</span>
          <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button type="button" className="flex w-full items-center justify-between border-t border-white/[0.06] px-4 py-3">
          <span className="text-sm text-[var(--color-text)]">Change your pin</span>
          <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setShowSecretPhrase(true)}
          className="flex w-full items-center justify-between border-t border-white/[0.06] px-4 py-3"
        >
          <span className="text-sm text-[var(--color-text)]">Secret phrase</span>
          <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]/50">
        About Vault
      </p>
      <div className="glass-card overflow-hidden">
        <Link
          to="/terms"
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="text-sm text-[var(--color-text)]">Terms of use</span>
          <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          to="/privacy"
          className="flex w-full items-center justify-between border-t border-white/[0.06] px-4 py-3"
        >
          <span className="text-sm text-[var(--color-text)]">Privacy policy</span>
          <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {showSecretPhrase && secretPhrase ? (
        <SecretPhraseModal phrase={secretPhrase} onClose={() => setShowSecretPhrase(false)} />
      ) : null}
    </div>
    </PageTransition>
  )
}
