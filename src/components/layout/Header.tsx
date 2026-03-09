import { Link } from 'react-router-dom'
import { NETWORKS } from '../../config/networks'
import { useWallet } from '../../hooks/useWallet'

export function Header() {
  const { currentNetwork, switchNetwork, isAuthenticated, address, logout } = useWallet()

  return (
    <header className="bg-gradient-to-b from-slate-950 to-slate-950/95">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 pt-4">
        <Link
          to="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-300 shadow-sm shadow-black/40"
        >
          <span className="text-lg">⚙️</span>
        </Link>

        <select
          value={currentNetwork}
          onChange={(e) => switchNetwork(e.target.value as (typeof NETWORKS)[number]['id'])}
          className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-100 shadow-sm outline-none focus:border-indigo-500"
        >
          {NETWORKS.map((net) => (
            <option key={net.id} value={net.id}>
              {net.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-300 shadow-sm shadow-black/40"
        >
          <span className="text-lg">⌾</span>
        </button>
      </div>

      {isAuthenticated && address ? (
        <div className="mx-auto max-w-md px-4 pb-2 pt-3">
          <button
            type="button"
            onClick={() => {
              void logout()
            }}
            className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200"
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px]">
              ₮
            </span>
            <span className="font-mono">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          </button>
        </div>
      ) : null}
    </header>
  )
}

