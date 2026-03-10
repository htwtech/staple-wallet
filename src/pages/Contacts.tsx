import { ClipboardPaste } from '../components/icons/ClipboardPaste'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'

type Contact = {
  id: string
  name: string
  address: string
}

export function ContactsPage() {
  const [contacts] = useState<Contact[]>([])
  const [collapsed, setCollapsed] = useState(false)

  return (
    <PageTransition>
    <div className="mx-auto max-w-md px-4 pb-10 pt-4">
      <div className="glass-card mb-4 p-4">
        <input
          type="text"
          placeholder="..."
          className="glass-input w-full px-4 py-4 text-sm [color:var(--color-text)]"
          readOnly
        />
        <p className="mt-2 text-[11px] text-[var(--color-text)]/50">
          Enter address or choose a contact
        </p>
      </div>

      <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
        <button type="button" className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
          <ClipboardPaste className="h-4 w-4" strokeWidth={2} />
          Paste
        </button>
        <button type="button" className="text-sm font-medium text-[var(--color-text)]">
          Next
        </button>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text)]">Contacts</span>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text)]/70"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        {!collapsed && (
          <div className="space-y-2">
            <Link
              to="/contacts/new"
              className="glass-card flex items-center gap-3 rounded-2xl p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[var(--color-text)]">New address</span>
            </Link>
            {contacts.map((c) => (
              <div
                key={c.id}
                className="glass-card flex items-center gap-3 rounded-2xl p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl [background:var(--color-field)] text-[var(--color-text)]/70">
                  <span className="text-sm font-semibold">{c.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text)]">{c.name}</p>
                  <p className="truncate font-mono text-[11px] text-[var(--color-text)]/50">{c.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  )
}
