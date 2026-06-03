import { CalendarDays, CheckCircle2, Clock3, Sparkles, UserRoundCheck } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { MetricCard } from '../components/ui/MetricCard'
import { Score } from '../components/ui/Score'

export function DashboardView({ leads, metrics, onOpenPipeline }) {
  const cards = [
    { label: 'Leads calientes', value: metrics.hot, icon: Sparkles, detail: 'Score superior a 88' },
    { label: 'Sin contacto 48 h', value: metrics.stale, icon: Clock3, detail: 'Riesgo de enfriarse' },
    { label: 'Handoff humano', value: metrics.handoff, icon: UserRoundCheck, detail: 'Oferta, tasación o negociación' },
    { label: 'Visitas sugeridas', value: 7, icon: CalendarDays, detail: 'Detectadas por conversación' },
  ]

  return (
    <section className="mt-6 grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-blue-600">Radar IA</p>
              <h3 className="text-2xl font-black">Oportunidades de hoy</h3>
            </div>
            <button className="h-10 rounded-lg bg-blue-600 px-3 text-sm font-bold text-white hover:bg-blue-700" type="button" onClick={onOpenPipeline}>
              Ver pipeline
            </button>
          </div>
          <div className="mt-5 grid gap-3">
            {leads
              .slice()
              .sort((a, b) => b.score - a.score)
              .slice(0, 4)
              .map((lead) => (
                <div className="grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 md:grid-cols-[1fr_auto]" key={lead.id}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <strong>{lead.name}</strong>
                      <Score score={lead.score} />
                      {lead.needHuman && <Badge>Handoff</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{lead.nextAction}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-500">{lead.lastContact}</span>
                </div>
              ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
          <p className="text-xs font-black uppercase text-blue-600">Feature demo</p>
          <h3 className="mt-1 text-2xl font-black">Semáforo de conversación</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            La IA detecta intención, presupuesto, urgencia y cuándo debe pasar el caso a un asesor humano.
          </p>
          <div className="mt-5 grid gap-2 text-sm">
            {['Respuesta sugerida con contexto del lead', 'Próxima mejor acción por etapa', 'Handoff cuando hay tasación, reserva u oferta'].map((text) => (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2 text-slate-700" key={text}>
                <CheckCircle2 size={16} className="text-blue-600" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
