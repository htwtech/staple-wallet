import { Copy } from '../icons/Copy'

type SecretPhraseModalProps = {
  phrase: string
  onClose: () => void
}

export function SecretPhraseModal({ phrase, onClose }: SecretPhraseModalProps) {
  const words = phrase.trim().split(/\s+/)

  const handleCopy = () => {
    void navigator.clipboard.writeText(phrase)
  }

  return (
    <div
      className="animate-overlay-enter fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Secret phrase"
    >
      <div
        className="animate-modal-enter glass-card w-full max-w-md rounded-t-3xl px-5 pb-8 pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text)]/45">
              Security
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--color-text)]">Secret phrase</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="glass-button flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)]/80"
            aria-label="Close secret phrase"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="rounded-3xl border border-amber-400/15 px-4 py-4 [background:color-mix(in_srgb,#f59e0b_10%,transparent)]">
          <p className="text-xs leading-relaxed text-amber-100/80">
            Keep these words offline and private. Anyone with this phrase can control your wallet.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {words.map((word, index) => (
            <div
              key={`${index + 1}-${word}`}
              className="rounded-2xl border border-white/[0.06] px-3 py-2.5 [background:var(--color-field)]"
            >
              <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-text)]/40">
                {index + 1}
              </div>
              <div className="mt-1 text-sm font-medium text-[var(--color-text)]">{word}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium [background:var(--color-button)] [color:var(--color-text)]"
        >
          <Copy className="h-4 w-4" strokeWidth={2} />
          Copy phrase
        </button>
      </div>
    </div>
  )
}
