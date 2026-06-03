import { useState } from 'react'
import {
  AlertCircle,
  Award,
  CalendarDays,
  ChevronRight,
  Clock3,
  DollarSign,
  Mail,
  PhoneCall,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { MetricCard } from '../components/ui/MetricCard'
import { cn } from '../lib/helpers'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

function money(value) {
  return currencyFormatter.format(value)
}

export function AdvisorsView({ advisors, leads, selectedAdvisorId, onSelectAdvisor }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const selectedAdvisor = advisors.find((advisor) => advisor.id === selectedAdvisorId) || advisors[0]
  const selectedClients = leads.filter((lead) => selectedAdvisor.leadIds.includes(lead.id))
  const teamMetrics = buildTeamMetrics(advisors)
  const salesLeaders = advisors.slice().sort((a, b) => b.metrics.monthRevenue - a.metrics.monthRevenue)
  const ticketLeaders = advisors.slice().sort((a, b) => b.metrics.avgTicket - a.metrics.avgTicket)

  function openProfile(advisorId) {
    onSelectAdvisor(advisorId)
    setProfileOpen(true)
  }

  return (
    <section className="mt-6 grid gap-5">
      <TeamMetrics metrics={teamMetrics} />

      <LeadershipPanel salesLeaders={salesLeaders} ticketLeaders={ticketLeaders} />

      <AdvisorsTable advisors={advisors} selectedAdvisor={selectedAdvisor} onOpenProfile={openProfile} />

      {profileOpen && (
        <AdvisorProfileModal advisor={selectedAdvisor} clients={selectedClients} onClose={() => setProfileOpen(false)} />
      )}
    </section>
  )
}

function buildTeamMetrics(advisors) {
  const totals = advisors.reduce(
    (acc, advisor) => ({
      activeDeals: acc.activeDeals + advisor.metrics.activeDeals,
      avgResponseMinutes: acc.avgResponseMinutes + advisor.metrics.avgResponseMinutes,
      closeRate: acc.closeRate + advisor.metrics.closeRate,
      forecastValue: acc.forecastValue + advisor.metrics.forecastValue,
      monthRevenue: acc.monthRevenue + advisor.metrics.monthRevenue,
      monthSales: acc.monthSales + advisor.metrics.monthSales,
      openChats: acc.openChats + advisor.metrics.openChats,
      overdueTasks: acc.overdueTasks + advisor.metrics.overdueTasks,
      pipelineValue: acc.pipelineValue + advisor.metrics.pipelineValue,
      unansweredChats: acc.unansweredChats + advisor.metrics.unansweredChats,
    }),
    {
      activeDeals: 0,
      avgResponseMinutes: 0,
      closeRate: 0,
      forecastValue: 0,
      monthRevenue: 0,
      monthSales: 0,
      openChats: 0,
      overdueTasks: 0,
      pipelineValue: 0,
      unansweredChats: 0,
    },
  )

  return {
    ...totals,
    averageCloseRate: Math.round(totals.closeRate / advisors.length),
    averageResponseMinutes: Math.round(totals.avgResponseMinutes / advisors.length),
  }
}

function TeamMetrics({ metrics }) {
  const cards = [
    { label: 'Pipeline total', value: money(metrics.pipelineValue), icon: DollarSign, detail: `${metrics.activeDeals} negocios activos` },
    { label: 'Forecast 30 dias', value: money(metrics.forecastValue), icon: TrendingUp, detail: 'Valor ponderado esperado' },
    { label: 'Ventas del mes', value: metrics.monthSales, icon: Award, detail: `${money(metrics.monthRevenue)} cerrado o reservado` },
    { label: 'Conversion equipo', value: `${metrics.averageCloseRate}%`, icon: Target, detail: `${metrics.overdueTasks} tareas vencidas` },
    { label: 'Respuesta media', value: `${metrics.averageResponseMinutes} min`, icon: Clock3, detail: `${metrics.openChats} chats abiertos` },
    { label: 'Sin respuesta', value: metrics.unansweredChats, icon: AlertCircle, detail: 'Chats pendientes del equipo' },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  )
}

function LeadershipPanel({ salesLeaders, ticketLeaders }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <RankingCard
        description="Quienes mas valor cerraron este mes."
        items={salesLeaders.map((advisor) => ({
          id: advisor.id,
          label: advisor.name,
          meta: `${advisor.metrics.monthSales} operaciones`,
          value: money(advisor.metrics.monthRevenue),
        }))}
        title="Lideres de ventas"
      />
      <RankingCard
        description="Quienes manejan los negocios mas caros."
        items={ticketLeaders.map((advisor) => ({
          id: advisor.id,
          label: advisor.name,
          meta: advisor.specialty,
          value: money(advisor.metrics.avgTicket),
        }))}
        title="Tickets mas altos"
      />
    </div>
  )
}

function RankingCard({ description, items, title }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-blue-600">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-4 grid gap-3">
        {items.slice(0, 3).map((item, index) => (
          <div className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3" key={item.id}>
            <span className="grid size-8 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">{index + 1}</span>
            <div className="min-w-0">
              <strong className="block truncate text-sm">{item.label}</strong>
              <p className="truncate text-xs font-semibold text-slate-500">{item.meta}</p>
            </div>
            <strong className="text-sm">{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function AdvisorsTable({ advisors, selectedAdvisor, onOpenProfile }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-black uppercase text-blue-600">Equipo comercial</p>
        <h3 className="mt-1 text-2xl font-black">Performance por asesor</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Asesor</th>
              <th className="px-5 py-3">Especialidad</th>
              <th className="px-5 py-3">Pipeline</th>
              <th className="px-5 py-3">Cierres mes</th>
              <th className="px-5 py-3">Conversion</th>
              <th className="px-5 py-3">Resp. media</th>
              <th className="px-5 py-3">Chats</th>
              <th className="px-5 py-3">Pendientes</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {advisors.map((advisor) => (
              <tr
                className={cn(
                  'cursor-pointer border-t border-slate-100 transition hover:bg-blue-50',
                  selectedAdvisor.id === advisor.id && 'bg-blue-50',
                )}
                key={advisor.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenProfile(advisor.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onOpenProfile(advisor.id)
                  }
                }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={advisor.name} />
                    <div>
                      <strong>{advisor.name}</strong>
                      <p className="text-xs font-semibold text-slate-500">{advisor.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold">{advisor.zone}</p>
                  <p className="text-xs text-slate-500">{advisor.specialty}</p>
                </td>
                <td className="px-5 py-4">
                  <strong>{money(advisor.metrics.pipelineValue)}</strong>
                  <p className="text-xs text-slate-500">{money(advisor.metrics.forecastValue)} forecast</p>
                </td>
                <td className="px-5 py-4">
                  <strong>{advisor.metrics.monthSales}</strong>
                  <p className="text-xs text-slate-500">{money(advisor.metrics.monthRevenue)}</p>
                </td>
                <td className="px-5 py-4 font-black text-blue-700">{advisor.metrics.closeRate}%</td>
                <td className="px-5 py-4 font-semibold">{advisor.metrics.responseTime}</td>
                <td className="px-5 py-4">
                  <strong>{advisor.metrics.openChats}</strong>
                  <p className="text-xs text-slate-500">abiertos</p>
                </td>
                <td className="px-5 py-4">
                  <strong className={advisor.metrics.unansweredChats > 4 ? 'text-rose-700' : 'text-slate-950'}>{advisor.metrics.unansweredChats}</strong>
                  <p className="text-xs text-slate-500">{advisor.metrics.staleChats} frios</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <ChevronRight size={18} className="ml-auto text-slate-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AdvisorProfileModal({ advisor, clients, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="presentation" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar name={advisor.name} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-blue-600">Perfil del asesor</p>
              <h3 className="truncate text-2xl font-black">{advisor.name}</h3>
              <p className="text-sm font-semibold text-slate-500">{advisor.role} - {advisor.specialty}</p>
            </div>
          </div>
          <button className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50" type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[calc(92vh-92px)] overflow-y-auto p-5">
          <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="grid h-fit gap-4">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>{advisor.status}</Badge>
                  <Badge>{advisor.seniority}</Badge>
                  <Badge>{advisor.zone}</Badge>
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <ContactLine icon={PhoneCall} text={advisor.phone} />
                  <ContactLine icon={Mail} text={advisor.email} />
                </div>
              </section>

              <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Users size={17} />
                  <strong className="text-sm">Lectura para jefe comercial</strong>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{advisor.notes}</p>
              </section>
            </aside>

            <div className="grid gap-5">
              <ProfileKpis advisor={advisor} />

              <div className="grid gap-5 xl:grid-cols-2">
                <ProfileSection title="Cartera activa">
                  {clients.map((client) => (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={client.id}>
                      <div className="flex items-start justify-between gap-2">
                        <strong className="text-sm">{client.name}</strong>
                        <Badge>{client.stage}</Badge>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{client.intent} - {client.budget}</p>
                      <p className="mt-2 text-sm text-slate-600">{client.nextAction}</p>
                    </div>
                  ))}
                </ProfileSection>

                <ProfileSection title="Agenda de hoy">
                  {advisor.agenda.map((item) => (
                    <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3" key={`${item.time}-${item.title}`}>
                      <Clock3 size={16} className="mt-0.5 shrink-0 text-blue-700" />
                      <div>
                        <strong className="text-sm">{item.time} - {item.type}</strong>
                        <p className="text-sm text-slate-600">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </ProfileSection>
              </div>

              <ProfileSection title="Historial de ventas">
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Propiedad</th>
                        <th className="px-4 py-3">Valor</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Comision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advisor.salesHistory.map((sale) => (
                        <tr className="border-t border-slate-100" key={`${sale.date}-${sale.client}`}>
                          <td className="px-4 py-3 font-bold text-blue-700">{sale.date}</td>
                          <td className="px-4 py-3 font-semibold">{sale.client}</td>
                          <td className="px-4 py-3 text-slate-600">{sale.property}</td>
                          <td className="px-4 py-3 font-black">{money(sale.value)}</td>
                          <td className="px-4 py-3">{sale.stage}</td>
                          <td className="px-4 py-3 font-semibold">{money(sale.commission)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ProfileSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProfileKpis({ advisor }) {
  const cards = [
    { label: 'Resp. media', value: advisor.metrics.responseTime, tone: advisor.metrics.avgResponseMinutes > 10 ? 'text-amber-700' : 'text-emerald-700' },
    { label: 'Chats abiertos', value: advisor.metrics.openChats },
    { label: 'Sin respuesta', value: advisor.metrics.unansweredChats, tone: advisor.metrics.unansweredChats > 4 ? 'text-rose-700' : 'text-slate-950' },
    { label: 'Chats frios', value: advisor.metrics.staleChats, tone: advisor.metrics.staleChats > 2 ? 'text-rose-700' : 'text-slate-950' },
    { label: 'Ticket prom.', value: money(advisor.metrics.avgTicket) },
    { label: 'CSAT', value: `${advisor.metrics.csat}%`, tone: 'text-blue-700' },
    { label: 'Reuniones', value: advisor.metrics.meetingsWeek },
    { label: 'Vencidas', value: advisor.metrics.overdueTasks, tone: advisor.metrics.overdueTasks > 3 ? 'text-rose-700' : 'text-emerald-700' },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <ProfileKpi key={card.label} {...card} />
      ))}
    </div>
  )
}

function ProfileSection({ children, title }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays size={16} className="text-blue-600" />
        <h4 className="text-sm font-black uppercase text-slate-700">{title}</h4>
      </div>
      <div className="grid gap-2 overflow-x-auto">{children}</div>
    </section>
  )
}

function ProfileKpi({ label, tone = 'text-slate-950', value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <strong className={cn('mt-1 block text-lg', tone)}>{value}</strong>
    </div>
  )
}

function ContactLine({ icon: Icon, text }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-slate-600">
      <Icon size={15} className="shrink-0 text-blue-600" />
      <span className="truncate">{text}</span>
    </div>
  )
}

function Avatar({ name, size = 'md' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded-lg bg-blue-600 font-black text-white shadow-sm',
        size === 'lg' ? 'size-14 text-lg' : 'size-10 text-sm',
      )}
    >
      {initials}
    </div>
  )
}
