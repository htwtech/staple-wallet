import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CloverIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl [background:var(--color-field)]">
      <svg width="20" height="20" viewBox="0 0 80 80" fill="none" className="text-[var(--color-text)]/70">
        <circle cx="40" cy="28" r="10" fill="currentColor" />
        <circle cx="40" cy="52" r="10" fill="currentColor" />
        <circle cx="28" cy="40" r="10" fill="currentColor" />
        <circle cx="52" cy="40" r="10" fill="currentColor" />
      </svg>
    </div>
  )
}

export function NewContactPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  return (
    <div className="animate-overlay-enter fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm [background:color-mix(in_srgb,var(--color-bg)_60%,transparent)]">
      <div
        className="animate-modal-enter glass-card w-full max-w-md px-5 pb-8 pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-5 text-center text-base font-semibold text-[var(--color-text)]">
          New contact
        </p>

        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 px-3 py-1.5 text-[11px] text-slate-300"
          >
            Saving to wallet
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <CloverIcon />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Put name here"
            className="glass-input flex-1 px-3 py-2.5 text-sm [color:var(--color-text)]"
          />
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] [background:var(--color-field)] [color:var(--color-text)]">
            <span className="text-red-400">♥</span> TRON
          </span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Put address here"
            className="glass-input flex-1 px-3 py-2.5 text-sm [color:var(--color-text)]"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 rounded-full py-3 text-sm font-medium [background:var(--color-text)] [color:var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim() || !address.trim()}
            className="flex-1 rounded-full py-3 text-sm font-medium disabled:opacity-50 [background:var(--color-button)] [color:var(--color-text)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
