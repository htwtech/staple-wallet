import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { TokenList } from '../components/wallet/TokenList'
import { useWallet } from '../hooks/useWallet'

export function DashboardPage() {
  const { address } = useWallet()

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-between px-4 pb-6 pt-4">
      <div className="flex flex-1 flex-col items-center justify-start pt-6">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Total Balance
        </div>
        <div className="mt-2 text-4xl font-semibold tracking-tight text-slate-50">$0,00</div>
        {address ? (
          <div className="mt-3 inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          </div>
        ) : null}

        <div className="mt-10 flex w-full items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 shadow-sm shadow-black/40">
              <span className="text-lg text-slate-100">＋</span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-slate-400">
              ADD MONEY
            </span>
          </div>
          <Link to="/receive" className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 shadow-sm shadow-black/40">
              <span className="text-lg text-slate-100">↓</span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-slate-200">
              RECEIVE
            </span>
          </Link>
          <Link to="/send" className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 shadow-sm shadow-black/40">
              <span className="text-lg text-slate-100">↑</span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-slate-200">SEND</span>
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <TokenList />

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Welcome to your vault
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Ты можешь пропустить онбординг и импортировать существующий кошелек, когда будешь
            готов.
          </p>
          <div className="mt-3">
            <Button variant="secondary" className="w-full">
              Import wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

