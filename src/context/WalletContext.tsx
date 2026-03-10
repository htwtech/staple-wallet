import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  buildSignedUsdtTransfer,
  fetchGasFreeNonce,
  generateGasFreeAddress,
  getGasFreeDiagnostics,
  submitSignedUsdtTransfer,
  type GasFreeDiagnostics,
} from '../lib/gasfreeAdapter'
import {
  clearWalletSession,
  createOrRestoreStoredTronWallet,
  isValidTronAddress,
  isWalletSessionActive,
  loadStoredTronWallet,
  setWalletSession,
  type StoredTronWallet,
} from '../lib/tronWallet'
import { fetchUsdtTransactions, type WalletTransaction } from '../lib/tronTransactions'
import { formatUsdtAmount, getUsdtBalance, parseUsdtToBaseUnits } from '../lib/tronUsdt'

type WalletStatus = 'idle' | 'connecting' | 'connected' | 'error'

export type TransferQuote = {
  amountBaseUnits: string
  gasFreeAddress: string
  submitReady: boolean
  message?: string
}

type WalletContextValue = {
  status: WalletStatus
  address: string | null
  gasFreeAddress: string | null
  secretPhrase: string | null
  usdtBalance: string
  isLoadingBalance: boolean
  transactions: WalletTransaction[]
  isLoadingTransactions: boolean
  error: string | null
  gasFreeDiagnostics: GasFreeDiagnostics
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshBalance: () => Promise<void>
  refreshTransactions: () => Promise<void>
  quoteUsdtTransfer: (params: { amount: number; recipientAddress: string }) => Promise<{
    success: boolean
    quote?: TransferQuote
    message?: string
  }>
  sendTransaction: (params: {
    amount: number
    recipientAddress: string
    tokenAddress?: string | null
  }) => Promise<{ success: boolean; txnId?: string; message?: string }>
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<StoredTronWallet | null>(null)
  const [gasFreeAddress, setGasFreeAddress] = useState<string | null>(null)
  const [usdtBalance, setUsdtBalance] = useState('0')
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<WalletStatus>('idle')

  const address = wallet?.address ?? null
  const secretPhrase = wallet?.mnemonic ?? null
  const gasFreeDiagnostics = useMemo(() => getGasFreeDiagnostics(), [])
  const missingGasFreeConfigMessage = useMemo(() => {
    if (gasFreeDiagnostics.missing.length === 0) {
      return null
    }

    return `GasFree wallet is not configured yet. Missing: ${gasFreeDiagnostics.missing.join(', ')}`
  }, [gasFreeDiagnostics])

  const refreshBalanceForAddress = useCallback(async (walletAddress: string) => {
    setIsLoadingBalance(true)
    try {
      const balance = await getUsdtBalance(walletAddress)
      setUsdtBalance(formatUsdtAmount(balance))
      setError(null)
    } catch (e) {
      console.error(e)
      setError('Failed to load USDT balance')
    } finally {
      setIsLoadingBalance(false)
    }
  }, [])

  const refreshTransactionsForAddress = useCallback(async (walletAddress: string) => {
    setIsLoadingTransactions(true)
    try {
      const nextTransactions = await fetchUsdtTransactions(walletAddress)
      setTransactions(nextTransactions)
    } catch (e) {
      console.error(e)
      setTransactions([])
    } finally {
      setIsLoadingTransactions(false)
    }
  }, [])

  const bootstrapWallet = useCallback(async () => {
    const nextWallet = createOrRestoreStoredTronWallet()
    setWallet(nextWallet)
    setWalletSession(true)
    await Promise.all([
      refreshBalanceForAddress(nextWallet.address),
      refreshTransactionsForAddress(nextWallet.address),
    ])
    setStatus('connected')
    return nextWallet
  }, [refreshBalanceForAddress, refreshTransactionsForAddress])

  const login = useCallback(async () => {
    setStatus('connecting')
    setError(null)
    try {
      await bootstrapWallet()
    } catch (e) {
      console.error(e)
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Failed to create TRON wallet')
    }
  }, [bootstrapWallet])

  const logout = useCallback(async () => {
    clearWalletSession()
    setWallet(null)
    setGasFreeAddress(null)
    setUsdtBalance('0')
    setTransactions([])
    setError(null)
    setStatus('idle')
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!address) return
    await refreshBalanceForAddress(address)
  }, [address, refreshBalanceForAddress])

  const refreshTransactions = useCallback(async () => {
    if (!address) return
    await refreshTransactionsForAddress(address)
  }, [address, refreshTransactionsForAddress])

  const quoteUsdtTransfer = useCallback(
    async (params: { amount: number; recipientAddress: string }) => {
      if (!wallet) {
        return { success: false, message: 'Wallet not ready' }
      }

      if (!isValidTronAddress(params.recipientAddress.trim())) {
        return { success: false, message: 'Enter a valid TRON address' }
      }

      const amountBaseUnits = parseUsdtToBaseUnits(String(params.amount))
      if (!amountBaseUnits || amountBaseUnits <= 0n) {
        return { success: false, message: 'Enter a valid USDT amount' }
      }

      const submitReady = gasFreeDiagnostics.canSubmitTransfer
      let nextGasFreeAddress = gasFreeAddress

      if (!nextGasFreeAddress) {
        try {
          nextGasFreeAddress = await generateGasFreeAddress(wallet.address)
        } catch (e) {
          console.error(e)
          return {
            success: false,
            message:
              missingGasFreeConfigMessage ??
              (e instanceof Error ? e.message : 'Failed to prepare gas-free route'),
          }
        }
      }

      return {
        success: true,
        quote: {
          amountBaseUnits: amountBaseUnits.toString(),
          gasFreeAddress: nextGasFreeAddress,
          submitReady,
          message: submitReady
            ? undefined
            : missingGasFreeConfigMessage ?? 'GasFree relay not configured yet.',
        },
      }
    },
    [gasFreeDiagnostics, gasFreeAddress, missingGasFreeConfigMessage, wallet],
  )

  const sendTransaction = useCallback(
    async (params: {
      amount: number
      recipientAddress: string
      tokenAddress?: string | null
    }) => {
      if (!wallet) return { success: false, message: 'Wallet not ready' }

      if (!isValidTronAddress(params.recipientAddress.trim())) {
        return { success: false, message: 'Recipient must be a valid TRON address' }
      }

      const amountBaseUnits = parseUsdtToBaseUnits(String(params.amount))
      if (!amountBaseUnits || amountBaseUnits <= 0n) {
        return { success: false, message: 'Enter a valid USDT amount' }
      }

      if (!gasFreeDiagnostics.canAssembleTransfer) {
        return {
          success: false,
          message: missingGasFreeConfigMessage ?? 'GasFree transfer is not configured yet.',
        }
      }

      try {
        const nonce = await fetchGasFreeNonce(wallet.address)
        const draft = await buildSignedUsdtTransfer({
          privateKey: wallet.privateKey,
          userAddress: wallet.address,
          recipientAddress: params.recipientAddress.trim(),
          amountBaseUnits,
          nonce,
        })
        const result = await submitSignedUsdtTransfer(draft)
        if (result.success) {
          void refreshBalance()
          return { success: true, txnId: result.txnId }
        }
        return { success: false, message: result.message }
      } catch (e) {
        console.error(e)
        return {
          success: false,
          message: e instanceof Error ? e.message : 'Failed to submit gas-free transfer',
        }
      }
    },
    [gasFreeDiagnostics, missingGasFreeConfigMessage, refreshBalance, wallet],
  )

  useEffect(() => {
    if (!address) {
      setGasFreeAddress(null)
      return
    }

    let cancelled = false

    void generateGasFreeAddress(address)
      .then((nextGasFreeAddress) => {
        if (!cancelled) {
          setGasFreeAddress(nextGasFreeAddress)
        }
      })
      .catch((e) => {
        console.error(e)
        if (!cancelled) {
          setGasFreeAddress(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [address])

  useEffect(() => {
    if (!isWalletSessionActive()) return

    const storedWallet = loadStoredTronWallet()
    if (!storedWallet) return

    setWallet(storedWallet)
    setStatus('connected')
    void Promise.all([
      refreshBalanceForAddress(storedWallet.address),
      refreshTransactionsForAddress(storedWallet.address),
    ])
  }, [refreshBalanceForAddress, refreshTransactionsForAddress])

  const value: WalletContextValue = {
    status,
    address,
    gasFreeAddress,
    secretPhrase,
    usdtBalance,
    isLoadingBalance,
    transactions,
    isLoadingTransactions,
    error,
    gasFreeDiagnostics,
    login,
    logout,
    refreshBalance,
    refreshTransactions,
    quoteUsdtTransfer,
    sendTransaction,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWalletContext() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWalletContext must be used within WalletProvider')
  return ctx
}
