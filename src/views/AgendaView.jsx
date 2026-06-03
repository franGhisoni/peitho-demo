import { PhoneCall, Plus } from 'lucide-react'
import { appointments } from '../data/demoData'
import { Badge } from '../components/ui/Badge'

export function AgendaView({ leads }) {
  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase text-blue-600">Agenda comercial</p>
            <h3 className="text-2xl font-black">Hoy</h3>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-bold text-white hover:bg-blue-700" type="button">
            <Plus size={16} />
            Nueva tarea
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {appointments.map((item) => (
            <div className="grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 md:grid-cols-[80px_1fr_auto]" key={item.time}>
              <strong className="text-blue-600">{item.time}</strong>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-slate-500">{item.owner}</p>
              </div>
              <Badge>IA recordó</Badge>
            </div>
          ))}
        </div>
      </div>
      <aside className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase text-blue-600">Tareas automáticas</p>
        <h3 className="text-2xl font-black">Seguimientos</h3>
        <div className="mt-4 grid gap-3">
          {leads.slice(0, 4).map((lead) => (
            <div className="rounded-lg border border-stone-200 p-3" key={lead.id}>
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm">{lead.name}</strong>
                <PhoneCall size={15} className="text-blue-600" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{lead.nextAction}</p>
            </div>
          ))}
        </div>
      </aside>
    </section>
  )
}
