import { ClipboardPaste } from '../components/icons/ClipboardPaste'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { PageTransition } from '../components/layout/PageTransition'
import { useWallet } from '../hooks/useWallet'
import { truncateAddress } from '../lib/formatAddress'
import { isValidTronAddress } from '../lib/tronWallet'

export function SendPage() {
  const {
    address,
    gasFreeAddress,
    gasFreeDiagnostics,
    quoteUsdtTransfer,
    sendTransaction,
  } = useWallet()
  const [step, setStep] = useState<1 | 2>(1)
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [amountFocused, setAmountFocused] = useState(false)
  const [activeScrollWordIndex, setActiveScrollWordIndex] = useState(0)
  const [transferQuote, setTransferQuote] = useState<{
    amountBaseUnits: string
    gasFreeAddress: string
    submitReady: boolean
    message?: string
  } | null>(null)

  const scrollWords = useMemo(
    () =>
      [
        'TRON wallets',
        'USDT transfers',
        'GasFree route',
        'Mainnet payouts',
        'Creator economy',
        'Freelance payments',
        'Treasury ops',
        'Global settlements',
        'Remote teams',
        'Instant rails',
        'OTC desks',
        'Web3 payroll',
        'Borderless cash',
        'Fast remittance',
        'Stablecoin flows',
        'Merchant payouts',
        'Global commerce',
        'Creator payouts',
      ].sort(() => Math.random() - 0.5),
    [],
  )

  const lineHeightRem = 1.375 * 1.875
  const visibleLines = 4.8 * 0.8 * 0.8
  const sloganDurationMs = 5200
  const parsedAmount = parseFloat(amount)
  const formattedAmount = Number.isFinite(parsedAmount)
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(parsedAmount)
    : amount

  useEffect(() => {
    if (step !== 1 || scrollWords.length === 0) return

    const intervalId = window.setInterval(() => {
      setActiveScrollWordIndex((currentIndex) => (currentIndex + 1) % scrollWords.length)
    }, sloganDurationMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [scrollWords, sloganDurationMs, step])

  const handlePaste = () => {
    void navigator.clipboard.readText().then((text) => setTo(text))
  }

  const handleNext = () => {
    setError(null)
    const candidate = to.trim()
    if (!candidate) {
      setError('Enter a TRON address or choose a contact')
      return
    }
    if (!isValidTronAddress(candidate)) {
      setError('Enter a valid TRON address')
      return
    }
    setStep(2)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!address) {
      setError('Connect wallet first')
      return
    }

    const recipient = to.trim()
    if (!isValidTronAddress(recipient)) {
      setError('Enter a valid TRON address')
      return
    }

    const numAmount = parseFloat(amount)
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setError('Enter a valid USDT amount')
      return
    }

    const quoteResult = await quoteUsdtTransfer({
      amount: numAmount,
      recipientAddress: recipient,
    })

    if (!quoteResult.success || !quoteResult.quote) {
      setError(quoteResult.message ?? 'Failed to prepare gas-free transfer')
      return
    }

    setTransferQuote(quoteResult.quote)
    setShowConfirmModal(true)
  }

  function handleConfirmSend() {
    if (!transferQuote?.submitReady) return

    setIsSubmitting(true)
    sendTransaction({
      amount: Number.parseFloat(amount),
      recipientAddress: to.trim(),
    })
      .then((res) => {
        if (res.success) {
          setShowConfirmModal(false)
          setTransferQuote(null)
          setAmount('')
          setTo('')
          setStep(1)
        } else {
          setError(res.message ?? 'Failed to submit gas-free transfer')
        }
      })
      .catch((e) => {
        console.error(e)
        setError('Failed to submit gas-free transfer')
      })
      .finally(() => setIsSubmitting(false))
  }

  if (step === 1) {
    return (
      <PageTransition>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col px-4 pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-1 flex-col justify-evenly">
          <h1 className="text-[var(--color-text)] font-bold tracking-tight text-3xl leading-snug sm:text-4xl">
            <span className="block">Send</span>
            <span className="block">stablecoins</span>
            <span className="block">to any destination</span>
          </h1>

          <div
            className="glass-card relative flex items-center overflow-hidden rounded-2xl border border-white/[0.06] px-4 py-4"
            style={{
              height: `calc(${visibleLines} * ${lineHeightRem}rem)`,
            }}
          >
            <span
              key={`${activeScrollWordIndex}-${scrollWords[activeScrollWordIndex]}`}
              className="block whitespace-nowrap font-bold tracking-tight text-3xl text-[color:color-mix(in_srgb,var(--color-text)_92%,var(--color-bg))] leading-snug sm:text-4xl"
              style={{
                animation: `sloganSlideAcross ${sloganDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
              }}
            >
              {scrollWords[activeScrollWordIndex]}
            </span>
          </div>

          <div className="glass-card p-4">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="T..."
              className="glass-input w-full px-4 py-4 text-sm [color:var(--color-text)]"
            />
            <p className="mt-2 text-[11px] text-[var(--color-text)]/50">
              Enter a TRON recipient address
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text)]">Contacts</span>
            <button
              type="button"
              className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text)]/70"
              aria-label="Collapse"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          <Link
            to="/contacts/new"
            className="glass-card flex items-center gap-3 rounded-2xl p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[var(--color-text)]">New TRON address</span>
          </Link>
        </div>

        <div className="glass flex items-center justify-between gap-2 rounded-2xl px-4 py-3">
          <button
            type="button"
            className="glass-button flex h-11 w-11 items-center justify-center rounded-2xl text-sky-300"
            aria-label="QR"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-2 rounded-2xl border border-sky-400/25 bg-sky-400/12 px-4 py-3 text-sm font-medium text-[var(--color-text)] shadow-[0_10px_30px_rgba(56,189,248,0.18)] transition-colors hover:bg-sky-400/18"
            aria-label="Paste"
          >
            <ClipboardPaste className="h-5 w-5 text-sky-300" strokeWidth={2} />
            Paste
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Next
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="glass-button flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] [background:var(--color-button)]"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
      </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
    <div className="relative mx-auto min-h-[calc(100vh-4rem)] max-w-md px-4">
      <div
        className={`absolute left-4 right-4 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] bottom-[max(2.5rem,env(safe-area-inset-bottom))] ${
          amountFocused ? 'translate-y-[calc(-100vh+28rem)]' : 'translate-y-0'
        }`}
      >
      <form onSubmit={handleSubmit} className="space-y-4 pb-2">
        <div className="glass-card space-y-4 p-4">
          <div className="rounded-2xl border border-white/[0.06] px-4 py-3 [background:var(--color-field)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text)]/45">Asset</div>
                <div className="mt-2 text-sm font-medium text-[var(--color-text)]">USDT</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text)]/45">Network</div>
                <div className="mt-2 text-sm font-medium text-emerald-400">TRON mainnet</div>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-text)]/70">Amount</label>
            <input
              type="number"
              min="0"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              placeholder="0.0"
              className="glass-input mt-1 w-full px-3 py-2.5 text-sm [color:var(--color-text)]"
            />
          </div>
          <p className="truncate text-[11px] text-[var(--color-text)]/50">
            To: {to.length > 18 ? truncateAddress(to, 10, 8) : to}
          </p>
          {gasFreeAddress ? (
            <p className="truncate text-[11px] text-sky-300/80">
              GasFree route: {truncateAddress(gasFreeAddress, 8, 6)}
            </p>
          ) : null}
        </div>

        {error ? <p className="text-xs text-red-400">{error}</p> : null}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setShowConfirmModal(false)
              setTransferQuote(null)
              setStep(1)
            }}
          >
            Back
          </Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            Send
          </Button>
        </div>
      </form>
      </div>

      {showConfirmModal ? (
        <div
          className="animate-overlay-enter fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !isSubmitting && setShowConfirmModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm transaction"
        >
          <div
            className="animate-modal-enter glass-card w-full max-w-md rounded-t-3xl px-5 pb-8 pt-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text)]/45">
                  Confirmation
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--color-text)]">Review gas-free transfer</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="glass-button flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)]/80 disabled:opacity-50"
                aria-label="Close confirmation"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="rounded-3xl border border-white/[0.08] px-4 py-5 text-center [background:linear-gradient(180deg,color-mix(in_srgb,var(--color-button)_18%,transparent),transparent)]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text)]/45">You send</div>
              <div className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
                {formattedAmount || '0'} USDT
              </div>
              <div className="mt-2 text-xs text-[var(--color-text)]/55">on TRON mainnet</div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/[0.06] px-4 py-3 [background:var(--color-field)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text)]/45">Recipient</span>
                  <span className="max-w-[68%] truncate text-sm font-medium text-[var(--color-text)]">
                    {to.length > 24 ? truncateAddress(to, 8, 6) : to}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[0.06] px-4 py-3 [background:var(--color-field)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text)]/45">From</div>
                  <div className="mt-2 text-sm font-medium text-[var(--color-text)]">
                    {address ? truncateAddress(address, 7, 5) : 'Wallet'}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.06] px-4 py-3 [background:var(--color-field)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text)]/45">Route</div>
                  <div className="mt-2 text-sm font-medium text-[var(--color-text)]">
                    {transferQuote?.gasFreeAddress
                      ? truncateAddress(transferQuote.gasFreeAddress, 7, 5)
                      : 'GasFree'}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] px-4 py-3 [background:var(--color-field)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text)]/45">Routing</span>
                  <span
                    className={`text-sm font-medium ${
                      transferQuote?.submitReady ? 'text-emerald-400' : 'text-amber-300'
                    }`}
                  >
                    {transferQuote?.submitReady ? 'Ready to relay' : 'Awaiting relay setup'}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text)]/55">
                  {transferQuote?.message ??
                    'The transfer will be signed from your local TRON wallet and sent through the GasFree relay.'}
                </p>
              </div>

              {!transferQuote?.submitReady ? (
                <div className="rounded-2xl border border-amber-400/15 px-4 py-3 [background:color-mix(in_srgb,#f59e0b_12%,transparent)]">
                  <p className="text-xs leading-relaxed text-amber-100/85">
                    Live relay submit is disabled until the missing GasFree config is provided: {gasFreeDiagnostics.missing.join(', ')}.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Edit
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleConfirmSend}
                loading={isSubmitting}
                disabled={!transferQuote?.submitReady}
              >
                {transferQuote?.submitReady ? 'Confirm send' : 'Relay setup required'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    </PageTransition>
  )
}
