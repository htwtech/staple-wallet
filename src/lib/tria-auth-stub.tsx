/**
 * Stub for @tria-sdk/authenticate-react when the package is not installed.
 * Replace with real Tria SDK: remove the alias in vite.config.ts and run pnpm add @tria-sdk/authenticate-react @tria-sdk/connect @tria-sdk/utils (with NPM_TOKEN).
 */
import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'

export const AuthenticationStatus = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
} as const

type Account = {
  triaName: string | null
  evm: { address: string }
}

type AuthStatus = (typeof AuthenticationStatus)[keyof typeof AuthenticationStatus]
type UserState = { authenticationStatus: AuthStatus }

const StubAuthContext = createContext<{
  userState: UserState
  setUserState: (s: UserState) => void
  getAccount: () => Account | null
  setAccount: (a: Account | null) => void
} | null>(null)

const TriaProviderInner: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>({
    authenticationStatus: AuthenticationStatus.UNAUTHENTICATED,
  })
  const [account, setAccount] = useState<Account | null>(null)

  return (
    <StubAuthContext.Provider
      value={{
        userState,
        setUserState,
        getAccount: () => account,
        setAccount,
      }}
    >
      {children}
    </StubAuthContext.Provider>
  )
}

export const TriaProvider: FC<{
  initialConfig?: unknown
  initialUIConfig?: unknown
  initialWalletUIConfig?: unknown
  children: ReactNode
}> = ({ children }) => <TriaProviderInner>{children}</TriaProviderInner>

export const TriaAuthModal: FC = () => null

export function useTriaAuth() {
  const ctx = useContext(StubAuthContext)
  const showAuthModal = useCallback(async () => {
    if (!ctx) return
    ctx.setUserState({ authenticationStatus: AuthenticationStatus.LOADING })
    // Stub: simulate login with a fake address so the app can be used
    setTimeout(() => {
      ctx.setAccount({
        triaName: null,
        evm: { address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72' },
      })
      ctx.setUserState({ authenticationStatus: AuthenticationStatus.AUTHENTICATED })
    }, 500)
  }, [ctx])
  const logout = useCallback(async () => {
    ctx?.setAccount(null)
    ctx?.setUserState({ authenticationStatus: AuthenticationStatus.UNAUTHENTICATED })
  }, [ctx])
  return {
    getAccount: () => ctx?.getAccount() ?? null,
    logout,
    showAuthModal,
    userState: ctx?.userState ?? { authenticationStatus: AuthenticationStatus.UNAUTHENTICATED },
    configure: (_config?: { chain?: string }) => {},
    isReady: true,
  }
}

export function useTriaWallet() {
  const readContract = useCallback(
    async (_params: { contractAddress: string; abi: unknown[]; functionName: string; args: unknown[] }) =>
      0n as unknown,
    [],
  )
  const send = useCallback(
    async (
      _amount: number,
      _recipientAddress: string,
      _tokenAddress?: string,
    ): Promise<{ success: boolean; message?: string }> =>
      ({ success: false, message: 'Tria SDK not installed. Use real SDK for sends.' }),
    [],
  )
  return {
    readContract,
    send,
    isReady: true,
  }
}
