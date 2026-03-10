export const TRON_MAINNET = {
  id: 'TRON',
  name: 'TRON Mainnet',
  chainId: Number('0x2b6653dc'),
  rpcUrl: 'https://api.trongrid.io',
  explorerAddressUrl: 'https://tronscan.org/#/address',
  explorerTxUrl: 'https://tronscan.org/#/transaction',
} as const

export const USDT_TRON = {
  symbol: 'USDT',
  address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  decimals: 6,
  displayName: 'Tether USD',
} as const

export const GASFREE_CHAIN_ID = TRON_MAINNET.chainId

export const GASFREE_SERVICE_PROVIDER =
  import.meta.env.VITE_GASFREE_SERVICE_PROVIDER?.trim() || null

export const GASFREE_SUBMIT_URL =
  import.meta.env.VITE_GASFREE_SUBMIT_URL?.trim() || null

export const GASFREE_NONCE_URL =
  import.meta.env.VITE_GASFREE_NONCE_URL?.trim() || null

export const GASFREE_SUBMIT_TOKEN =
  import.meta.env.VITE_GASFREE_SUBMIT_TOKEN?.trim() || null

export const GASFREE_DEFAULT_MAX_FEE =
  import.meta.env.VITE_GASFREE_DEFAULT_MAX_FEE?.trim() || '250000'
