import { Copy } from '../components/icons/Copy'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { SecretPhraseModal } from '../components/wallet/SecretPhraseModal'
import { useWallet } from '../hooks/useWallet'
import { truncateAddress } from '../lib/formatAddress'

export function DashboardPage() {
  const { address, gasFreeAddress, secretPhrase, transactions, isLoadingTransactions, usdtBalance } = useWallet()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showSecretPhrase, setShowSecretPhrase] = useState(false)

  const totalBalance = (() => {
    const numericBalance = Number.parseFloat(usdtBalance)
    if (!Number.isFinite(numericBalance)) return '0,00'
    return numericBalance.toFixed(2).replace('.', ',')
  })()

  const copyValue = (value: string, field: string) => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  return (
    <PageTransition>
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col px-4 pb-8 pt-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-xs font-medium tracking-wide text-[var(--color-text)]/50">
          Total Balance
        </p>
        <p className="mt-2 text-center text-7xl font-bold tracking-tight text-[var(--color-text)] md:text-8xl">
          ${totalBalance}
        </p>

        {address ? (
          <div className="mt-4 w-full max-w-sm space-y-3">
            <div className="rounded-2xl border border-white/[0.08] px-4 py-3 [background:var(--color-field)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-text)]/50">
                    Wallet address
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--color-text)]/90">
                    {truncateAddress(address, 8, 6)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(address, 'wallet')}
                  className="glass-button flex h-8 w-8 items-center justify-center rounded-xl text-[var(--color-text)]/80"
                  aria-label="Copy wallet address"
                >
                  {copiedField === 'wallet' ? (
                    <span className="text-[10px] text-emerald-400">✓</span>
                  ) : (
                    <Copy className="h-4 w-4" strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </div>

            {gasFreeAddress ? (
              <div className="rounded-2xl border border-sky-400/15 px-4 py-3 [background:color-mix(in_srgb,var(--color-button)_12%,transparent)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-sky-300/75">
                      GasFree route
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-[var(--color-text)]/90">
                      {truncateAddress(gasFreeAddress, 8, 6)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyValue(gasFreeAddress, 'gasfree')}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300"
                    aria-label="Copy gas-free route address"
                  >
                    {copiedField === 'gasfree' ? (
                      <span className="text-[10px] text-emerald-400">✓</span>
                    ) : (
                      <Copy className="h-4 w-4" strokeWidth={2.2} />
                    )}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-10 flex w-full max-w-sm items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 [background:var(--color-button)]">
              <svg className="h-7 w-7 text-[var(--color-text)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text)]/70">
              FUND
            </span>
          </div>
          <Link to="/receive" className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 [background:var(--color-button)]">
              <svg className="h-7 w-7 text-[var(--color-text)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text)]">
              RECEIVE
            </span>
          </Link>
          <Link to="/send" className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 [background:var(--color-button)]">
              <svg className="h-7 w-7 text-[var(--color-text)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text)]">
              SEND
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] shadow-xl shadow-black/30 [background:var(--color-field)]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text)]/60">
              Recent transactions
            </p>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex min-h-[4.5rem] items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tx.type === 'receive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {tx.type === 'receive' ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.amount}
                    </p>
                    <p className="text-[11px] text-[var(--color-text)]/50">{tx.dateLabel}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'receive' ? 'text-emerald-400' : 'text-[var(--color-text)]/70'}`}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.amount.split(' ')[0]}
                </span>
              </li>
            ))}
            {!isLoadingTransactions && transactions.length === 0 ? (
              <>
                <li className="flex min-h-[4.5rem] items-center px-4 py-3 text-sm text-[var(--color-text)]/75">
                  Your transactions will appear here
                </li>
                <li className="flex min-h-[4.5rem] items-center px-4 py-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] [background:var(--color-bg)]"
                  >
                    <span>How it works?</span>
                    <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
                <li className="flex min-h-[4.5rem] items-center px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setShowSecretPhrase(true)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] [background:var(--color-bg)]"
                  >
                    <span>Save your secret phrase</span>
                    <svg className="h-4 w-4 text-[var(--color-text)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              </>
            ) : null}
          </ul>
          <div className="border-t border-white/[0.06] px-4 py-3">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text)]/70 [background:var(--color-button)] hover:opacity-90 hover:text-[var(--color-text)]"
            >
              <span>Local wallet stored on this device</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showSecretPhrase && secretPhrase ? (
        <SecretPhraseModal phrase={secretPhrase} onClose={() => setShowSecretPhrase(false)} />
      ) : null}
    </div>
    </PageTransition>
  )
}
