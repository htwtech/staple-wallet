import { useState } from 'react'
import { Button } from '../components/common/Button'

type Contact = {
  id: string
  name: string
  address: string
}

export function ContactsPage() {
  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'New address', address: '0x...' },
  ])

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      <h1 className="text-base font-semibold text-slate-50">Contacts</h1>

      <div className="mt-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-2xl bg-slate-950 px-3 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800 text-xs font-semibold text-slate-50">
                +
              </div>
              <div>
                <div className="text-sm font-medium text-slate-50">{c.name}</div>
                <div className="font-mono text-[11px] text-slate-500">{c.address}</div>
              </div>
            </div>
          </div>
        ))}

        <Button variant="secondary" className="mt-2 w-full text-xs">
          New contact
        </Button>
      </div>
    </div>
  )
}

