import { TronWeb } from 'tronweb'

export type StoredTronWallet = {
  mnemonic: string
  privateKey: string
  address: string
  createdAt: number
}

const WALLET_STORAGE_KEY = 'vault.tron.wallet.v1'
const SESSION_STORAGE_KEY = 'vault.tron.session.v1'

function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/^0x/, '')
}

function isBrowserReady() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function toSerializableWallet(wallet: StoredTronWallet): StoredTronWallet {
  return {
    mnemonic: wallet.mnemonic.trim(),
    privateKey: normalizePrivateKey(wallet.privateKey),
    address: wallet.address.trim(),
    createdAt: wallet.createdAt,
  }
}

export function isValidTronAddress(address: string) {
  return TronWeb.isAddress(address)
}

export function createTronWallet(): StoredTronWallet {
  const generated = TronWeb.createRandom()
  const mnemonic = generated.mnemonic?.phrase ?? ''
  const address = typeof generated.address === 'string' ? generated.address : ''

  if (!mnemonic || !address || !TronWeb.isAddress(address)) {
    throw new Error('Failed to generate TRON wallet')
  }

  return toSerializableWallet({
    mnemonic,
    privateKey: generated.privateKey,
    address,
    createdAt: Date.now(),
  })
}

export function restoreTronWallet(mnemonic: string): StoredTronWallet {
  const restored = TronWeb.fromMnemonic(mnemonic)
  const address = typeof restored.address === 'string' ? restored.address : ''

  if (!address || !TronWeb.isAddress(address)) {
    throw new Error('Failed to restore TRON wallet')
  }

  return toSerializableWallet({
    mnemonic,
    privateKey: restored.privateKey,
    address,
    createdAt: Date.now(),
  })
}

export function saveStoredTronWallet(wallet: StoredTronWallet) {
  if (!isBrowserReady()) return
  try {
    window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(toSerializableWallet(wallet)))
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Unable to save wallet in local storage: ${error.message}`
        : 'Unable to save wallet in local storage',
    )
  }
}

export function loadStoredTronWallet(): StoredTronWallet | null {
  if (!isBrowserReady()) return null

  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(WALLET_STORAGE_KEY)
  } catch {
    return null
  }
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<StoredTronWallet>
    if (
      typeof parsed?.mnemonic !== 'string' ||
      typeof parsed?.privateKey !== 'string' ||
      typeof parsed?.address !== 'string'
    ) {
      return null
    }

    const restored = restoreTronWallet(parsed.mnemonic)
    return {
      ...restored,
      createdAt: typeof parsed.createdAt === 'number' ? parsed.createdAt : restored.createdAt,
    }
  } catch {
    return null
  }
}

export function createOrRestoreStoredTronWallet() {
  const existing = loadStoredTronWallet()
  if (existing) return existing

  const created = createTronWallet()
  saveStoredTronWallet(created)
  return created
}

export function setWalletSession(active: boolean) {
  if (!isBrowserReady()) return
  if (active) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, '1')
  } else {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
  }
}

export function isWalletSessionActive() {
  if (!isBrowserReady()) return false
  return window.localStorage.getItem(SESSION_STORAGE_KEY) === '1'
}

export function clearWalletSession() {
  setWalletSession(false)
}
