import { Button } from '../common/Button'
import { useWallet } from '../../hooks/useWallet'

export function TokenList() {
  const { usdtBalance, isLoadingBalance, refreshBalance } = useWallet()
  const hasFunds = Number.parseFloat(usdtBalance) > 0

  return (
    <div className="rounded-2xl border border-white/[0.06] p-4 [background:var(--color-field)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Stablecoin balance</h2>
          <p className="text-xs text-[var(--color-text)]/50">USDT on TRON mainnet</p>
        </div>
        <Button
          variant="secondary"
          loading={isLoadingBalance}
          onClick={() => {
            void refreshBalance()
          }}
          className="h-8 px-3 text-xs"
        >
          Refresh
        </Button>
      </div>

      {!hasFunds && !isLoadingBalance ? (
        <p className="text-xs text-[var(--color-text)]/50">
          Balance not loaded yet or wallet has no USDT.
        </p>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] px-3 py-2 [background:var(--color-bg)]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold [background:var(--color-button)] [color:var(--color-text)]">
              USDT
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--color-text)]">USDT</div>
              <div className="text-[11px] text-[var(--color-text)]/50">TRON mainnet</div>
            </div>
          </div>
          <div className="text-right text-sm font-medium text-[var(--color-text)]">
            {usdtBalance}
          </div>
        </div>
      </div>
    </div>
  )
}

