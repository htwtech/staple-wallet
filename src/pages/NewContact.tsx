import { Button } from '../components/common/Button'

export function NewContactPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-end px-4 pb-4">
      <div className="mb-2 text-center text-sm font-semibold text-slate-100">New contact</div>
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-xs text-slate-50">
            +
          </div>
          <div className="flex-1 space-y-2">
            <div className="rounded-2xl bg-slate-950 px-3 py-2 text-xs text-slate-500">
              Put name here
            </div>
            <div className="rounded-2xl bg-slate-950 px-3 py-2 text-xs text-slate-500">
              Put address here
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="w-1/2">
            Cancel
          </Button>
          <Button className="w-1/2" disabled>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

