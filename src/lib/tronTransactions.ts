import { TRON_MAINNET, USDT_TRON } from '../config/networks'

export type WalletTransaction = {
  id: string
  type: 'receive' | 'send'
  amount: string
  dateLabel: string
  from: string
  to: string
}

type TronGridTrc20Transaction = {
  transaction_id?: string
  block_timestamp?: number
  from?: string
  to?: string
  value?: string
  token_info?: {
    symbol?: string
    decimals?: number | string
  }
}

function formatAmount(value: string | undefined, decimals: number) {
  const raw = BigInt(value ?? '0')
  const divisor = 10n ** BigInt(decimals)
  const whole = raw / divisor
  const fraction = raw % divisor

  if (fraction === 0n) return whole.toString()

  return `${whole}.${fraction.toString().padStart(decimals, '0').slice(0, 2).replace(/0+$/, '') || '0'}`
}

function formatTransactionDate(timestamp?: number) {
  if (!timestamp) return 'Pending'

  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export async function fetchUsdtTransactions(address: string): Promise<WalletTransaction[]> {
  const endpoint = new URL(
    `${TRON_MAINNET.rpcUrl}/v1/accounts/${address}/transactions/trc20`,
  )
  endpoint.searchParams.set('limit', '10')
  endpoint.searchParams.set('only_confirmed', 'true')
  endpoint.searchParams.set('contract_address', USDT_TRON.address)
  endpoint.searchParams.set('order_by', 'block_timestamp,desc')

  const response = await fetch(endpoint.toString(), {
    headers: {
      ...(import.meta.env.VITE_TRON_PRO_API_KEY
        ? { 'TRON-PRO-API-KEY': import.meta.env.VITE_TRON_PRO_API_KEY }
        : {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load transactions: ${response.status}`)
  }

  const payload = (await response.json()) as { data?: TronGridTrc20Transaction[] }
  const normalizedAddress = address.toLowerCase()

  return (payload.data ?? []).map((tx) => {
    const from = tx.from ?? ''
    const to = tx.to ?? ''
    const decimals = Number(tx.token_info?.decimals ?? USDT_TRON.decimals)
    const amount = formatAmount(tx.value, decimals)
    const isReceive = to.toLowerCase() === normalizedAddress

    return {
      id: tx.transaction_id ?? `${from}-${to}-${tx.block_timestamp ?? 0}`,
      type: isReceive ? 'receive' : 'send',
      amount: `${amount} ${tx.token_info?.symbol ?? USDT_TRON.symbol}`,
      dateLabel: formatTransactionDate(tx.block_timestamp),
      from,
      to,
    }
  })
}
