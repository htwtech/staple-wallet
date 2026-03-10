import {
  GASFREE_CHAIN_ID,
  GASFREE_DEFAULT_MAX_FEE,
  GASFREE_NONCE_URL,
  GASFREE_SERVICE_PROVIDER,
  GASFREE_SUBMIT_TOKEN,
  GASFREE_SUBMIT_URL,
  USDT_TRON,
} from '../config/networks'

export type GasFreeDiagnostics = {
  canAssembleTransfer: boolean
  canSubmitTransfer: boolean
  missing: string[]
  notes: string[]
}

export type GasFreeTransferDraft = {
  gasFreeAddress: string
  typedData: {
    domain: Record<string, unknown>
    types: Record<string, unknown>
    message: Record<string, unknown>
  }
  signature: string
  nonce: string
  deadline: string
  maxFee: string
}

let gasFreeInstancePromise: Promise<{
  generateGasFreeAddress: (userAddress: string) => string
  assembleGasFreeTransactionJson: (params: {
    token: string
    serviceProvider: string
    user: string
    receiver: string
    value: string
    maxFee: string
    deadline: string
    version: string
    nonce: string
  }) => {
    domain: Record<string, unknown>
    types: Record<string, unknown>
    message: Record<string, unknown>
  }
}> | null = null

let tronSignerPromise: Promise<{
  signTypedData: (
    domain: Record<string, unknown>,
    types: Record<string, unknown>,
    message: Record<string, unknown>,
    privateKey: string,
  ) => string
}> | null = null

function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/^0x/, '')
}

async function getGasFreeInstance() {
  if (!gasFreeInstancePromise) {
    gasFreeInstancePromise = import('@gasfree/gasfree-sdk').then(({ TronGasFree }) => {
      const instance = new TronGasFree({ chainId: GASFREE_CHAIN_ID })
      return {
        generateGasFreeAddress: (userAddress: string) => instance.generateGasFreeAddress(userAddress),
        assembleGasFreeTransactionJson: (params: {
          token: string
          serviceProvider: string
          user: string
          receiver: string
          value: string
          maxFee: string
          deadline: string
          version: string
          nonce: string
        }) => instance.assembleGasFreeTransactionJson(params),
      }
    })
  }

  return gasFreeInstancePromise
}

async function getTronSigner() {
  if (!tronSignerPromise) {
    tronSignerPromise = import('tronweb').then(({ Trx }) => ({
      signTypedData: (
        domain: Record<string, unknown>,
        types: Record<string, unknown>,
        message: Record<string, unknown>,
        privateKey: string,
      ) => Trx.signTypedData(domain as never, types as never, message, privateKey),
    }))
  }

  return tronSignerPromise
}

export function getGasFreeDiagnostics(): GasFreeDiagnostics {
  const missing: string[] = []

  if (!GASFREE_SERVICE_PROVIDER) {
    missing.push('VITE_GASFREE_SERVICE_PROVIDER')
  }

  if (!GASFREE_SUBMIT_URL) {
    missing.push('VITE_GASFREE_SUBMIT_URL')
  }

  if (!GASFREE_NONCE_URL) {
    missing.push('VITE_GASFREE_NONCE_URL')
  }

  return {
    canAssembleTransfer: Boolean(GASFREE_SERVICE_PROVIDER),
    canSubmitTransfer: Boolean(GASFREE_SERVICE_PROVIDER && GASFREE_SUBMIT_URL && GASFREE_NONCE_URL),
    missing,
    notes: [
      'GasFree SDK assembles typed data but does not manage wallet storage.',
      'A relay-compatible nonce endpoint and submit endpoint are required for live transfers.',
      'Max fee and deadline are still set locally in this MVP and may need a backend policy later.',
    ],
  }
}

export async function generateGasFreeAddress(userAddress: string) {
  const gasFree = await getGasFreeInstance()
  return gasFree.generateGasFreeAddress(userAddress)
}

export async function fetchGasFreeNonce(userAddress: string) {
  const diagnostics = getGasFreeDiagnostics()
  if (!GASFREE_NONCE_URL) {
    throw new Error(`GasFree nonce endpoint is not configured. Missing: ${diagnostics.missing.join(', ')}`)
  }

  const url = new URL(GASFREE_NONCE_URL)
  url.searchParams.set('user', userAddress)
  url.searchParams.set('token', USDT_TRON.address)
  url.searchParams.set('chainId', String(GASFREE_CHAIN_ID))

  const response = await fetch(url.toString(), {
    headers: {
      ...(GASFREE_SUBMIT_TOKEN ? { Authorization: `Bearer ${GASFREE_SUBMIT_TOKEN}` } : {}),
    },
  })

  const payload = (await response.json().catch(() => null)) as
    | { nonce?: string | number; data?: { nonce?: string | number }; message?: string }
    | null

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Failed to load GasFree nonce')
  }

  const nonce = payload?.nonce ?? payload?.data?.nonce
  if (nonce === undefined || nonce === null) {
    throw new Error('GasFree nonce endpoint returned an empty nonce')
  }

  return String(nonce)
}

export async function buildSignedUsdtTransfer(params: {
  privateKey: string
  userAddress: string
  recipientAddress: string
  amountBaseUnits: bigint
  nonce?: string
  deadline?: string
  maxFee?: string
}) {
  const diagnostics = getGasFreeDiagnostics()
  if (!diagnostics.canAssembleTransfer || !GASFREE_SERVICE_PROVIDER) {
    throw new Error(`GasFree transfer is not configured. Missing: ${diagnostics.missing.join(', ')}`)
  }

  const nonce = params.nonce ?? '0'
  const deadline = params.deadline ?? String(Math.floor(Date.now() / 1000) + 15 * 60)
  const maxFee = params.maxFee ?? GASFREE_DEFAULT_MAX_FEE

  const gasFree = await getGasFreeInstance()
  const typedData = gasFree.assembleGasFreeTransactionJson({
    token: USDT_TRON.address,
    serviceProvider: GASFREE_SERVICE_PROVIDER,
    user: params.userAddress,
    receiver: params.recipientAddress,
    value: params.amountBaseUnits.toString(),
    maxFee,
    deadline,
    version: '1',
    nonce,
  })

  const signer = await getTronSigner()
  const signature = signer.signTypedData(
    typedData.domain,
    typedData.types,
    typedData.message,
    normalizePrivateKey(params.privateKey),
  )

  return {
    gasFreeAddress: await generateGasFreeAddress(params.userAddress),
    typedData,
    signature,
    nonce,
    deadline,
    maxFee,
  } satisfies GasFreeTransferDraft
}

export async function submitSignedUsdtTransfer(draft: GasFreeTransferDraft) {
  const diagnostics = getGasFreeDiagnostics()
  if (!diagnostics.canSubmitTransfer || !GASFREE_SUBMIT_URL) {
    return {
      success: false,
      message: `GasFree relay is not configured. Missing: ${diagnostics.missing.join(', ')}`,
    }
  }

  const response = await fetch(GASFREE_SUBMIT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(GASFREE_SUBMIT_TOKEN ? { Authorization: `Bearer ${GASFREE_SUBMIT_TOKEN}` } : {}),
    },
    body: JSON.stringify({
      chainId: GASFREE_CHAIN_ID,
      token: USDT_TRON.address,
      gasFreeAddress: draft.gasFreeAddress,
      signature: draft.signature,
      typedData: draft.typedData,
      nonce: draft.nonce,
      deadline: draft.deadline,
      maxFee: draft.maxFee,
    }),
  })

  const payload = (await response.json().catch(() => null)) as
    | { hash?: string; txid?: string; transactionHash?: string; message?: string }
    | null

  if (!response.ok) {
    return {
      success: false,
      message: payload?.message ?? 'GasFree relay rejected the transfer',
    }
  }

  return {
    success: true,
    txnId: payload?.transactionHash ?? payload?.txid ?? payload?.hash,
  }
}
