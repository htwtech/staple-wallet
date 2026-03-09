import { useMemo, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '../components/common/Button'
import { NETWORKS } from '../config/networks'
import { useWallet } from '../hooks/useWallet'

export function ReceivePage() {
  const { address, currentNetwork } = useWallet()
  const [selectedNetworkId, setSelectedNetworkId] = useState(currentNetwork)

  const selectedNetwork = useMemo(
    () => NETWORKS.find((n) => n.id === selectedNetworkId)!,
    [selectedNetworkId],
  )

  const qrValue = useMemo(() => {
    if (!address) return ''
    return `starknet:${address}`
  }, [address])

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      <h1 className="text-base font-semibold text-slate-50">Deposit your wallet</h1>

      <div className="mt-4 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 pb-6 pt-4">
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-xs font-semibold text-slate-100">
              ₮
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-50">Main wallet</div>
              <div className="text-[11px] text-slate-500">{selectedNetwork.name}</div>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-100">$0,00</div>
        </div>

        <div className="flex justify-center">
          <div className="rounded-3xl bg-slate-950 p-4 shadow-lg shadow-black/50">
            {address ? (
              <QRCodeCanvas
                value={qrValue}
                size={200}
                bgColor="#020617"
                fgColor="#ffffff"
                level="M"
                includeMargin={false}
              />
            ) : (
              <div className="flex h-[200px] w-[200px] items-center justify-center text-xs text-slate-500">
                Подключи кошелек, чтобы сгенерировать QR
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-full bg-slate-950/80 px-3 py-1.5">
            <div className="truncate font-mono text-[11px] text-slate-100">
              {address ?? 'Кошелек ещё не подключен'}
            </div>
            {address ? (
              <button
                type="button"
                className="ml-2 text-xs text-slate-300"
                onClick={() => {
                  void navigator.clipboard.writeText(address)
                }}
              >
                Copy
              </button>
            ) : null}
          </div>
          <p className="text-center text-[11px] text-slate-500">
            Scan this QR or copy address for simple transfer of your assets.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <div className="text-center text-[11px] text-slate-400">Choose only this network</div>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1">
              <select
                value={selectedNetworkId}
                onChange={(e) =>
                  setSelectedNetworkId(e.target.value as (typeof NETWORKS)[number]['id'])
                }
                className="bg-transparent text-[11px] text-slate-100 outline-none"
              >
                {NETWORKS.map((net) => (
                  <option key={net.id} value={net.id}>
                    {net.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="ghost" className="mx-auto block text-xs text-slate-400">
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  )
}

