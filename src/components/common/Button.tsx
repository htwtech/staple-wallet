import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  leftIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  loading,
  disabled,
  className = '',
  children,
  leftIcon,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60'

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: '[background:var(--color-button)] [color:var(--color-text)] hover:opacity-90',
    secondary:
      'border border-white/10 [background:var(--color-field)] [color:var(--color-text)] hover:opacity-90',
    ghost: '[color:var(--color-text)]/80 hover:bg-white/5',
  }

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-flex h-3 w-3 animate-spin rounded-full border-2 border-[var(--color-text)]/30 border-t-transparent" />
      )}
      {!loading && leftIcon ? <span className="mr-2 flex items-center">{leftIcon}</span> : null}
      {children}
    </button>
  )
}

