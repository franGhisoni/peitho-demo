import { useState, useMemo } from 'react'
import { Calendar, CalendarDays, CheckCircle2, Clock3, FileSpreadsheet, Sparkles, UserRoundCheck } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { MetricCard } from '../components/ui/MetricCard'
import { Score } from '../components/ui/Score'
import { exportToExcel } from '../lib/excelExport'
import { cn } from '../lib/helpers'

const months = [
  { id: '2026-09', label: 'Septiembre 2026', shortLabel: 'Septiembre', isCurrent: true },
  { id: '2026-08', label: 'Agosto 2026', shortLabel: 'Agosto' },
  { id: '2026-07', label: 'Julio 2026', shortLabel: 'Julio' },
  { id: 'all', label: 'Todo Q3 2026', shortLabel: 'Todo Q3' },
]

export function DashboardView({ leads, metrics, onOpenPipeline }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-09')

  const cards = useMemo(() => {
    const multipliers = {
      '2026-09': { hot: metrics.hot, stale: metrics.stale, handoff: metrics.handoff, visits: 7 },
      '2026-08': { hot: Math.round(metrics.hot * 1.8), stale: 8, handoff: Math.round(metrics.handoff * 1.5), visits: 18 },
      '2026-07': { hot: Math.round(metrics.hot * 1.4), stale: 11, handoff: Math.round(metrics.handoff * 1.3), visits: 14 },
      'all': { hot: Math.round(metrics.hot * 4.2), stale: 21, handoff: Math.round(metrics.handoff * 3.8), visits: 39 },
    }[selectedMonth] || { hot: metrics.hot, stale: metrics.stale, handoff: metrics.handoff, visits: 7 }

    return [
      { label: 'Leads calientes', value: multipliers.hot, icon: Sparkles, detail: 'Score superior a 88' },
      { label: 'Sin contacto 48 h', value: multipliers.stale, icon: Clock3, detail: 'Riesgo de enfriarse' },
      { label: 'Handoff humano', value: multipliers.handoff, icon: UserRoundCheck, detail: 'Oferta, tasación o negociación' },
      { label: 'Visitas coordinadas', value: multipliers.visits, icon: CalendarDays, detail: 'Detectadas por conversación' },
    ]
  }, [metrics, selectedMonth])

  function exportDashboardExcel() {
    const monthObj = months.find((m) => m.id === selectedMonth)
    const monthLabel = monthObj ? monthObj.label : selectedMonth

    exportToExcel({
      filename: `Peitho_Realty_Dashboard_${selectedMonth}`,
      sheets: [
        {
          name: 'Métricas Período',
          data: cards.map((c) => ({
            'Indicador': c.label,
            'Valor': c.value,
            'Detalle': c.detail,
            'Período': monthLabel,
          })),
        },
        {
          name: 'Leads y Oportunidades',
          data: leads.map((l) => ({
            'Nombre': l.name,
            'Teléfono': l.phone,
            'Score': l.score,
            'Etapa': l.stage,
            'Presupuesto': l.budget,
            'Tipo Propiedad': l.propertyType,
            'Asesor': l.advisor,
            'Handoff Humano': l.needHuman ? 'Sí' : 'No',
            'Último Contacto': l.lastContact,
            'Próxima Acción': l.nextAction,
          })),
        },
      ],
    })
  }

  return (
    <section className="mt-6 grid gap-5">
      {/* Barra de Filtro de Mes y Exportación a Excel */}
      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-500">
            <Calendar size={14} className="text-blue-600" />
            Período:
          </span>
          <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {months.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMonth(m.id)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-black transition cursor-pointer',
                  selectedMonth === m.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                )}
              >
                {m.shortLabel || m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={exportDashboardExcel}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-xs transition hover:bg-emerald-700 cursor-pointer"
          title="Descargar métricas de pipeline y leads en Excel"
        >
          <FileSpreadsheet size={15} />
          <span>Exportar Dashboard a Excel</span>
        </button>
      </div>
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
