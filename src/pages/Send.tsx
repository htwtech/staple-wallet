import { type FormEvent, useState } from 'react'
import { Button } from '../components/common/Button'
import { NETWORKS } from '../config/networks'
import { useWallet } from '../hooks/useWallet'

export function SendPage() {
  const { currentNetwork, address, getWallet } = useWallet()
  const [tokenSymbol, setTokenSymbol] = useState('USDC')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const network = NETWORKS.find((n) => n.id === currentNetwork)!

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!address) {
      setError('Сначала подключи кошелек')
      return
    }
    setIsSubmitting(true)

    ;(async () => {
      try {
        const wallet = getWallet()
        if (!wallet) {
          setError('Кошелек не подключен')
          setIsSubmitting(false)
          return
        }
        const { getPresets, Amount, fromAddress } = await import('starkzap')
        const presets = getPresets(wallet.getChainId())
        const token = presets[tokenSymbol]

        if (!token) {
          setError('Выбранный токен не поддерживается в этой сети')
          setIsSubmitting(false)
          return
        }

        const parsedAmount = Amount.parse(amount, token)
        const tx = await wallet.transfer(token, [
          { to: fromAddress(to), amount: parsedAmount },
        ])

        // eslint-disable-next-line no-console
        console.log('tx sent', tx.explorerUrl)
      } catch (e) {
        console.error(e)
        setError('Не удалось отправить транзакцию')
      } finally {
        setIsSubmitting(false)
      }
    })()
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="text-xl font-semibold text-slate-50">Отправить стейблкойны</h1>
      <p className="mt-1 text-sm text-slate-400">
        Укажи сеть, токен, адрес получателя и сумму.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Токен</label>
          <select
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          >
            {network.tokens.map((t) => (
              <option key={t.symbol} value={t.symbol}>
                {t.symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Адрес получателя</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Сумма</label>
          <input
            type="number"
            min="0"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>

        {error ? <p className="text-xs text-red-400">{error}</p> : null}

        <div className="pt-2">
          <Button type="submit" loading={isSubmitting} className="w-full">
            Отправить
          </Button>
        </div>
      </form>
    </div>
  )
}

