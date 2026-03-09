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
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60'

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-sm shadow-indigo-500/30',
    secondary:
      'border border-slate-700 bg-slate-900 text-slate-50 hover:border-slate-500 hover:bg-slate-800',
    ghost: 'text-slate-300 hover:bg-slate-800/60',
  }

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-flex h-3 w-3 animate-spin rounded-full border-2 border-indigo-200 border-t-transparent" />
      )}
      {!loading && leftIcon ? <span className="mr-2 flex items-center">{leftIcon}</span> : null}
      {children}
    </button>
  )
}

