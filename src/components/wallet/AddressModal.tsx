import { Copy } from '../icons/Copy'
import { useCallback, useState } from 'react'
import { useWallet } from '../../hooks/useWallet'
import { truncateAddress } from '../../lib/formatAddress'

type ChainType = 'EVM' | 'SOL' | 'TRON'

const CHAINS: { id: ChainType; label: string; subLabel?: string }[] = [
  { id: 'EVM', label: 'EVM (ETH)', subLabel: 'Ethereum and L2s' },
  { id: 'SOL', label: 'SOL', subLabel: 'Solana' },
  { id: 'TRON', label: 'TRON', subLabel: 'TRC-20' },
]

type AddressModalProps = {
  onClose: () => void
}

export function AddressModal({ onClose }: AddressModalProps) {
  const { address } = useWallet()
  const [copied, setCopied] = useState<ChainType | null>(null)

  const getAddress = useCallback(
    (chain: ChainType): string => {
      if (!address) return ''
      if (chain === 'EVM') return address
      return address
    },
    [address],
  )

  const copy = useCallback((chain: ChainType) => {
    const addr = getAddress(chain)
    if (!addr) return
    void navigator.clipboard.writeText(addr).then(() => {
      setCopied(chain)
      setTimeout(() => setCopied(null), 2000)
    })
  }, [getAddress])

  return (
    <div className="animate-overlay-enter fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm [background:color-mix(in_srgb,var(--color-bg)_60%,transparent)]" onClick={onClose}>
      <div
        className="animate-modal-enter glass-card w-full max-w-md px-5 pb-8 pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-center text-sm font-semibold text-[var(--color-text)]">
          Your addresses
        </div>
        <div className="space-y-3">
          {CHAINS.map((chain) => {
            const addr = getAddress(chain.id)
            return (
              <div
                key={chain.id}
                className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 [background:var(--color-field)]"
              >
                <div>
                  <div className="text-xs font-medium text-[var(--color-text)]">{chain.label}</div>
                  {chain.subLabel ? (
                    <div className="text-[10px] text-[var(--color-text)]/50">{chain.subLabel}</div>
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                  <span className="truncate font-mono text-[11px] text-[var(--color-text)]/90">
                    {addr ? truncateAddress(addr, 6, 4) : '—'}
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(chain.id)}
                    disabled={!addr}
                    className="glass-button flex h-8 w-8 shrink-0 items-center justify-center text-[var(--color-text)]/80"
                    aria-label="Copy"
                  >
                    {copied === chain.id ? (
                      <span className="text-[10px] text-emerald-400">✓</span>
                    ) : (
                      <Copy className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full py-2.5 text-xs font-medium [background:var(--color-button)] [color:var(--color-text)]"
        >
          Close
        </button>
      </div>
    </div>
  )
}
