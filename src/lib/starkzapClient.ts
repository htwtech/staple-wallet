import { StarkZap } from 'starkzap'

type SupportedNetworkId = 'starknet-sepolia' | 'starknet-mainnet'

const STARKNET_NETWORK: Record<SupportedNetworkId, 'sepolia' | 'mainnet'> = {
  'starknet-sepolia': 'sepolia',
  'starknet-mainnet': 'mainnet',
}

export type StarkzapClientOptions = {
  networkId?: SupportedNetworkId
}

export function getStarkzapClient(options: StarkzapClientOptions = {}): StarkZap {
  const networkId: SupportedNetworkId = options.networkId ?? 'starknet-mainnet'
  const network = STARKNET_NETWORK[networkId]
  return new StarkZap({ network })
}

