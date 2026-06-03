export function MetricCard({ detail, icon: Icon, label, value }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <strong className="mt-2 block text-3xl font-black">{value}</strong>
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{detail}</p>
    </article>
  )
}
