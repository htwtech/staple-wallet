import { Button } from '../common/Button'
import { useWallet } from '../../hooks/useWallet'

export function TokenList() {
  const { balances, isLoadingBalances, refreshBalances } = useWallet()

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Баланс стейблкойнов</h2>
          <p className="text-xs text-slate-500">USDC, USDT и другие на текущей сети</p>
        </div>
        <Button
          variant="secondary"
          loading={isLoadingBalances}
          onClick={() => {
            void refreshBalances()
          }}
          className="h-8 px-3 text-xs"
        >
          Обновить
        </Button>
      </div>

      {balances.length === 0 && !isLoadingBalances ? (
        <p className="text-xs text-slate-500">
          Балансы ещё не загружены или на кошельке нет средств.
        </p>
      ) : null}

      <div className="space-y-2">
        {balances.map((b) => (
          <div
            key={b.token.symbol}
            className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-xs font-semibold text-slate-100">
                {b.token.symbol}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-50">{b.token.symbol}</div>
                <div className="text-[11px] text-slate-500">{b.token.address}</div>
              </div>
            </div>
            <div className="text-right text-sm font-medium text-slate-50">
              {b.valueFormatted}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

