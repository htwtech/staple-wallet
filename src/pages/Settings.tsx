export function SettingsPage() {
  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      <h1 className="text-base font-semibold text-slate-50">Settings</h1>

      <div className="mt-4 space-y-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-slate-50">
                U
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-50">Your name</div>
                <div className="text-xs text-slate-500">you@example.com</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-3 w-full rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-center text-xs text-slate-300"
          >
            ENTER YOUR REFERRAL CODE
          </button>
        </section>

        <section className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-xs text-slate-50">
                ₮
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-50">Main Wallet</div>
                <div className="text-[11px] text-slate-500">Primary account</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-50">$0,00</div>
          </div>
        </section>

        <section className="space-y-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-200">
          <div className="font-semibold text-slate-400">Security</div>
          <button type="button" className="mt-2 flex w-full items-center justify-between py-1.5">
            <span>Language</span>
            <span className="text-slate-500">EN</span>
          </button>
          <button type="button" className="flex w-full items-center justify-between py-1.5">
            <span>Change your pin</span>
          </button>
          <button type="button" className="flex w-full items-center justify-between py-1.5">
            <span>Secret phrase</span>
          </button>
        </section>
      </div>
    </div>
  )
}

