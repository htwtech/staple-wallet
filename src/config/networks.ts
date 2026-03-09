export type NetworkId = 'starknet-sepolia' | 'starknet-mainnet'

export type TokenSymbol = 'USDC' | 'USDT'

export type TokenConfig = {
  symbol: TokenSymbol
  address: string
  decimals: number
}

export type NetworkConfig = {
  id: NetworkId
  name: string
  tokens: TokenConfig[]
}

export const NETWORKS: NetworkConfig[] = [
  {
    id: 'starknet-sepolia',
    name: 'StarkNet Sepolia',
    tokens: [
      { symbol: 'USDC', address: '0xUSDC_PLACEHOLDER', decimals: 6 },
      { symbol: 'USDT', address: '0xUSDT_PLACEHOLDER', decimals: 6 },
    ],
  },
  {
    id: 'starknet-mainnet',
    name: 'StarkNet Mainnet',
    tokens: [
      { symbol: 'USDC', address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', decimals: 6 },
      { symbol: 'USDT', address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', decimals: 6 },
    ],
  },
]

