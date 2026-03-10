import { type ReactNode, useEffect, useRef, useState } from 'react'

type PageTransitionProps = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'menu'
}

/**
 * Wrapper for page content that plays entrance animation on mount.
 * Класс анимации вешаем после первого кадра, чтобы браузер успел отрисовать from-состояние.
 */
export function PageTransition({ children, className = '', variant = 'default' }: PageTransitionProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true))
    })
    return () => cancelAnimationFrame(t)
  }, [])

  const isMenuVariant = variant === 'menu'
  const animationClass = ready
    ? isMenuVariant
      ? 'page-enter-animation-menu'
      : 'page-enter-animation'
    : ''

  const initialStyle = ready
    ? {}
    : isMenuVariant
      ? {
          opacity: 0,
          transform: 'translate(-24px, 48px) scale(0.9)',
          transformOrigin: 'left bottom',
        }
      : {
          opacity: 0,
          transform: 'translateY(10px)',
        }

  return (
    <div
      ref={elRef}
      className={`${animationClass} ${className}`.trim()}
      data-page-transition
      style={{
        minHeight: 'inherit',
        ...initialStyle,
      }}
    >
      {children}
    </div>
  )
}
