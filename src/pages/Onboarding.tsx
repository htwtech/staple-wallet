import { usePrivy } from '@privy-io/react-auth'
import { Button } from '../components/common/Button'
import { useWallet } from '../hooks/useWallet'

export function OnboardingPage() {
  const { ready: privyReady } = usePrivy()
  const { status, login, error } = useWallet()

  const isLoading = status === 'connecting'
  const isDisabled = !privyReady

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/60">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl font-semibold text-indigo-400">
            ₮
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">
            Твой стейблкойн-кошелек
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Подключи кошелек через starkzap и начни отправлять и получать стейблкойны на StarkNet.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            loading={isLoading}
            disabled={isDisabled}
            onClick={() => {
              void login()
            }}
            className="w-full"
          >
            {!privyReady
              ? 'Загрузка…'
              : isLoading
                ? 'Подключаем кошелек…'
                : 'Создать / подключить кошелек'}
          </Button>

          <p className="text-xs text-slate-500">
            Кошелек создается с помощью account abstraction. Seed-фразы и приватные ключи скрыты за
            удобным UX.
          </p>

          {error ? <p className="text-xs text-red-400">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

