import { Copy } from '../components/icons/Copy'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import { PageTransition } from '../components/layout/PageTransition'
import { useWallet } from '../hooks/useWallet'

function QrLogo() {
  return (
    <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl [background:var(--color-text)]">
      <svg width="24" height="24" viewBox="0 0 80 80" fill="none" className="text-black">
        <circle cx="40" cy="28" r="10" fill="currentColor" />
        <circle cx="40" cy="52" r="10" fill="currentColor" />
        <circle cx="26" cy="40" r="10" fill="currentColor" />
        <circle cx="54" cy="40" r="10" fill="currentColor" />
        <circle cx="40" cy="40" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

export function ReceivePage() {
  const navigate = useNavigate()
  const { address, gasFreeAddress } = useWallet()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyAddress = (addr: string, key?: string) => {
    void navigator.clipboard.writeText(addr).then(() => {
      if (key) {
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
      }
    })
  }

  const shareMessage = address
    ? `My Lether Wallet TRON USDT address:\n\n${address}`
    : ''

  const handleShare = () => {
    if (!shareMessage) return
    if (typeof navigator !== 'undefined' && navigator.share) {
      void navigator
        .share({
          title: 'Lether Wallet',
          text: shareMessage,
        })
        .catch(() => {
          void navigator.clipboard.writeText(shareMessage)
        })
    } else {
      void navigator.clipboard.writeText(shareMessage)
    }
  }

  const qrValue = address ?? ''

  return (
    <PageTransition>
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col px-4 pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <h1 className="pt-2 text-[var(--color-text)] font-bold tracking-tight text-3xl sm:text-4xl leading-snug">
        <span className="block">Receive</span>
        <span className="block">stablecoins</span>
        <span className="block">instantly anywhere</span>
      </h1>
      <div className="min-h-0 flex-1" aria-hidden="true" />
      <div className="w-full overflow-hidden px-4 pb-6 pt-4">
        <div className="relative mx-auto flex justify-center">
          <div className="rounded-3xl border border-white/10 p-4 shadow-2xl [background:var(--color-bg)]">
            {address ? (
              <>
                <QRCodeCanvas
                  value={qrValue}
                  size={220}
                  bgColor="#18191b"
                  fgColor="#fcfcfc"
                  level="M"
                  includeMargin={false}
                />
                <QrLogo />
              </>
            ) : (
              <div className="flex h-[220px] w-[220px] items-center justify-center text-xs text-[var(--color-text)]/50">
                Connect wallet to generate QR
              </div>
            )}
          </div>
        </div>

        {address ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/[0.1] px-4 py-3 [background:var(--color-field)]">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text)]/60">
                Your TRON wallet address
              </p>
              <div className="flex items-start justify-between gap-2">
                <span className="min-w-0 flex-1 break-all font-mono text-xs leading-snug text-[var(--color-text)]/95">
                  {address}
                </span>
                <button
                  type="button"
                  onClick={() => copyAddress(address, 'wallet')}
                  className="glass-button flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text)]/80"
                  aria-label="Copy address"
                >
                  {copiedKey === 'wallet' ? (
                    <span className="text-xs text-emerald-400">✓</span>
                  ) : (
                    <Copy className="h-4 w-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
            {gasFreeAddress ? (
              <div className="rounded-2xl border border-sky-400/15 px-4 py-3 [background:color-mix(in_srgb,var(--color-button)_12%,transparent)]">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-sky-300/75">
                  GasFree route address
                </p>
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 break-all font-mono text-xs leading-snug text-[var(--color-text)]/95">
                    {gasFreeAddress}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyAddress(gasFreeAddress, 'gasfree')}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300"
                    aria-label="Copy gas-free route"
                  >
                    {copiedKey === 'gasfree' ? (
                      <span className="text-xs text-emerald-400">✓</span>
                    ) : (
                      <Copy className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleShare}
              className="glass-button flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-[var(--color-text)]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        ) : null}

        <p className="mt-5 text-center text-[11px] text-[var(--color-text)]/50">
          Scan this QR or copy the address to receive USDT on TRON
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="glass-button mx-auto mt-6 flex h-12 w-12 items-center justify-center text-[var(--color-text)]"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    </PageTransition>
  )
}
