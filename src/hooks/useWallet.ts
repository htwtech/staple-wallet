import { useMemo } from 'react'
import { useWalletContext } from '../context/WalletContext'

export function useWallet() {
  const ctx = useWalletContext()

  const isAuthenticated = useMemo(
    () => ctx.status === 'connected' && !!ctx.address,
    [ctx.status, ctx.address],
  )

  return {
    ...ctx,
    isAuthenticated,
  }
}

