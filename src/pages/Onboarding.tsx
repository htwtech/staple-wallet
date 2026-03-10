import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/common/Button'
import { PageTransition } from '../components/layout/PageTransition'
import { useWallet } from '../hooks/useWallet'

const STORY_DURATION_MS = 5200

type OnboardingSlide = {
  id: string
  eyebrow: string
  title: string
  body: string
  accentClass: string
  glowClass: string
  chips: string[]
}

const slides: OnboardingSlide[] = [
  {
    id: 'instant',
    eyebrow: 'Global payouts',
    title: 'Send stablecoins as fast as a story',
    body: 'Move USDT across TRON with a clean flow that feels instant, lightweight and mobile-first.',
    accentClass: 'from-sky-400/30 via-cyan-300/16 to-transparent',
    glowClass: 'bg-sky-400/16 text-sky-200',
    chips: ['TRON mainnet', 'Fast address flow', 'Mobile-first UX'],
  },
  {
    id: 'wallet',
    eyebrow: 'Private by default',
    title: 'Your wallet is created on device',
    body: 'The app generates your wallet locally and keeps the phrase under your control from the first session.',
    accentClass: 'from-violet-400/26 via-fuchsia-300/14 to-transparent',
    glowClass: 'bg-violet-400/16 text-violet-100',
    chips: ['Local wallet', 'Secret phrase', 'Self-custody'],
  },
  {
    id: 'gasfree',
    eyebrow: 'GasFree route',
    title: 'Pay with USDT, not with spare TRX',
    body: 'The transfer flow is designed around GasFree routing, so the experience stays simple for normal users.',
    accentClass: 'from-emerald-400/28 via-teal-300/16 to-transparent',
    glowClass: 'bg-emerald-400/16 text-emerald-100',
    chips: ['USDT only', 'Guided send flow', 'Route visibility'],
  },
  {
    id: 'ready',
    eyebrow: 'Ready to start',
    title: 'Receive, hold and send from one calm dashboard',
    body: 'Track balance, copy your secret phrase, review transactions and move funds from one beautiful wallet.',
    accentClass: 'from-blue-400/28 via-indigo-300/16 to-transparent',
    glowClass: 'bg-blue-400/16 text-blue-100',
    chips: ['Live balance', 'Transaction list', 'One-tap receive'],
  },
]

function VaultLogo() {
  return (
    <img
      src="/logoLether_wallet.svg"
      alt="Lether Wallet"
      className="mx-auto h-auto w-full max-w-[220px] invert"
    />
  )
}

function StoryVisual({ slide, index }: { slide: OnboardingSlide; index: number }) {
  const badgeBase =
    'absolute rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-sm'

  return (
    <div className="relative mx-auto h-[25rem] w-full max-w-[22rem] overflow-hidden rounded-[2rem] border border-white/8 bg-[#202126] shadow-[0_30px_80px_rgba(0,0,0,0.36)]">
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.accentClass}`} />
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_65%)]" />
      <div className="absolute left-1/2 top-14 h-44 w-44 -translate-x-1/2 rounded-full bg-white/8 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <div className={`rounded-full px-3 py-1 text-[11px] font-medium ${slide.glowClass}`}>
            {slide.eyebrow}
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60">
            0{index + 1}
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="onboarding-float-slow absolute left-6 top-10 h-18 w-18 rounded-[1.75rem] border border-white/10 bg-white/6 blur-[1px]" />
          <div className="onboarding-float-fast absolute bottom-10 right-7 h-24 w-24 rounded-full border border-white/10 bg-white/6" />

          <div className="relative w-full max-w-[17rem]">
            <div className="onboarding-card-appear relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111216]/80 px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">Vault</p>
                  <p className="mt-1 text-sm font-medium text-white">USDT Wallet</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
                  Live
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Available</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white">$2.00</p>
                <div className="mt-4 flex gap-2">
                  <div className="rounded-full bg-sky-400/14 px-3 py-1 text-[11px] text-sky-100">USDT</div>
                  <div className="rounded-full bg-white/6 px-3 py-1 text-[11px] text-white/60">TRON</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-[1.2rem] border border-white/8 bg-white/4 px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">Route</div>
                  <div className="mt-2 text-sm font-medium text-white">GasFree</div>
                </div>
                <div className="rounded-[1.2rem] border border-white/8 bg-white/4 px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">Status</div>
                  <div className="mt-2 text-sm font-medium text-emerald-300">Ready</div>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-8 top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            </div>

            <div className={`${badgeBase} onboarding-float-fast left-[-0.6rem] top-[1.5rem] ${slide.glowClass}`}>
              +2.00 USDT
            </div>
            <div className={`${badgeBase} onboarding-float-slow right-[-0.8rem] top-[6rem] bg-white/8 text-white/75`}>
              Secret phrase
            </div>
            <div className={`${badgeBase} onboarding-float-fast bottom-[2.6rem] right-[0.6rem] bg-white/8 text-white/75`}>
              Send in seconds
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {slide.chips.map((chip) => (
            <div
              key={chip}
              className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/74 backdrop-blur-sm"
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function OnboardingPage() {
  const { status, login, error } = useWallet()
  const [currentIndex, setCurrentIndex] = useState(0)
  const isLoading = status === 'connecting'
  const isLastSlide = currentIndex === slides.length - 1
  const currentSlide = slides[currentIndex]

  useEffect(() => {
    if (isLastSlide || isLoading) return

    const timerId = window.setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1))
    }, STORY_DURATION_MS)

    return () => window.clearTimeout(timerId)
  }, [currentIndex, isLastSlide, isLoading])

  const progress = useMemo(
    () =>
      slides.map((slide, index) => ({
        id: slide.id,
        state: index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'idle',
      })),
    [currentIndex],
  )

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    if (isLastSlide) {
      void login()
      return
    }

    setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1))
  }

  const handleSkip = () => {
    setCurrentIndex(slides.length - 1)
  }

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col overflow-hidden [background:var(--color-bg)] [color:var(--color-text)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-[-4rem] h-64 w-64 rounded-full bg-sky-400/8 blur-3xl" />
          <div className="absolute bottom-12 right-[-7rem] h-56 w-56 rounded-full bg-violet-400/8 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-5 sm:px-6">
          <div className="mx-auto flex w-full max-w-md items-center gap-2">
            {progress.map((segment) => (
              <div key={segment.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  key={segment.state === 'active' ? `${segment.id}-${currentIndex}` : segment.id}
                  className={`h-full rounded-full ${
                    segment.state === 'done'
                      ? 'w-full bg-white'
                      : segment.state === 'active'
                        ? 'onboarding-story-progress bg-white'
                        : 'w-0 bg-white/40'
                  }`}
                  style={segment.state === 'active' ? { animationDuration: `${STORY_DURATION_MS}ms` } : undefined}
                />
              </div>
            ))}
          </div>

          <div className="mx-auto mt-5 flex w-full max-w-md items-center justify-between text-sm text-white/62">
            <button
              type="button"
              onClick={handlePrevious}
              className="rounded-full px-3 py-2 transition hover:bg-white/5 disabled:opacity-30"
              disabled={currentIndex === 0}
            >
              Back
            </button>
            {!isLastSlide ? (
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-full px-3 py-2 transition hover:bg-white/5"
              >
                Skip
              </button>
            ) : (
              <span className="rounded-full px-3 py-2 text-white/36">Final story</span>
            )}
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
            <div className="animate-content-enter">
              <StoryVisual slide={currentSlide} index={currentIndex} />
            </div>

            <div key={currentSlide.id} className="animate-content-enter-delay-1 mt-8">
              <div className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/58 w-fit">
                {currentSlide.eyebrow}
              </div>
              <h1 className="mt-4 max-w-[16ch] text-4xl font-bold tracking-tight text-white sm:text-[2.65rem]">
                {currentSlide.title}
              </h1>
              <p className="mt-4 max-w-[32rem] text-[15px] leading-7 text-white/64">
                {currentSlide.body}
              </p>
            </div>

            <div className="animate-content-enter-delay-2 mt-8 space-y-3">
              {isLastSlide ? (
                <>
                  <div className="rounded-[2rem] border border-white/8 bg-white/4 px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-18 shrink-0">
                        <VaultLogo />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Lether Wallet</p>
                        <p className="mt-1 text-sm leading-6 text-white/58">
                          One wallet for receiving, storing and sending USDT on TRON.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="h-14 w-full rounded-full text-base font-medium"
                    loading={isLoading}
                    onClick={() => void login()}
                  >
                    {isLoading ? 'Logging in…' : 'Log In'}
                  </Button>
                </>
              ) : (
                <Button className="h-14 w-full rounded-full text-base font-medium" onClick={handleNext}>
                  Next story
                </Button>
              )}

              {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}
            </div>
          </div>
        </div>

        <footer className="relative z-10 flex flex-col items-center gap-1 px-6 pb-10 pt-3 text-center text-xs text-[#8e8e93]">
          <p>
            By entering you agree to{' '}
            <a
              href="/terms"
              className="underline hover:opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms and conditions
            </a>
          </p>
          <a
            href="/privacy"
            className="underline hover:opacity-90"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </footer>
      </div>
    </PageTransition>
  )
}
