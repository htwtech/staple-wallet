import { TronWeb } from 'tronweb'
import { TRON_MAINNET, USDT_TRON } from '../config/networks'

export function isValidTronAddress(address: string) {
  return TronWeb.isAddress(address)
}

export function formatTokenAmount(value: bigint, decimals: number) {
  const base = 10n ** BigInt(decimals)
  const whole = value / base
  const fraction = value % base

  if (fraction === 0n) return whole.toString()

  return `${whole}.${fraction.toString().padStart(decimals, '0').replace(/0+$/, '')}`
}

export function formatUsdtAmount(value: bigint) {
  return formatTokenAmount(value, USDT_TRON.decimals)
}

export function parseUsdtToBaseUnits(value: string): bigint | null {
  const normalized = value.trim().replace(',', '.')
  if (!normalized) return null
  if (!/^\d+(\.\d{0,6})?$/.test(normalized)) return null

  const [wholePart, fractionPart = ''] = normalized.split('.')
  const fraction = `${fractionPart}000000`.slice(0, USDT_TRON.decimals)

  return BigInt(wholePart) * 10n ** BigInt(USDT_TRON.decimals) + BigInt(fraction)
}

function encodeTronAddressForAbi(address: string) {
  const hexAddress = TronWeb.address.toHex(address)

  if (!hexAddress?.startsWith('41')) {
    throw new Error('Failed to encode TRON address')
  }

  return hexAddress.slice(2).padStart(64, '0')
}

export async function getUsdtBalance(address: string): Promise<bigint> {
  if (!isValidTronAddress(address)) {
    throw new Error('Invalid TRON address')
  }

  const endpoint = new URL('/wallet/triggerconstantcontract', TRON_MAINNET.rpcUrl)
  const response = await fetch(endpoint.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_TRON_PRO_API_KEY
        ? { 'TRON-PRO-API-KEY': import.meta.env.VITE_TRON_PRO_API_KEY }
        : {}),
    },
    body: JSON.stringify({
      owner_address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
      contract_address: USDT_TRON.address,
      function_selector: 'balanceOf(address)',
      parameter: encodeTronAddressForAbi(address),
      visible: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to load TRON account balance: ${response.status}`)
  }

  const payload = (await response.json()) as {
    constant_result?: string[]
    result?: {
      result?: boolean
      message?: string
    }
  }

  if (!payload.result?.result) {
    throw new Error(payload.result?.message || 'TRON node rejected balance request')
  }

  const rawHex = payload.constant_result?.[0]
  if (!rawHex) {
    return 0n
  }

  return BigInt(`0x${rawHex}`)
}
