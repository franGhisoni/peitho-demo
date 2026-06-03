import { useMemo, useState } from 'react'
import {
  AtSign,
  Bot,
  Building2,
  CalendarClock,
  CircleDashed,
  Clock,
  CreditCard,
  Filter,
  Flame,
  Inbox,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Send,
  Sparkles,
  Target,
  UserRound,
  UserRoundCheck,
  UserRoundX,
  Wallet,
} from 'lucide-react'
import { cn, scoreTone } from '../lib/helpers'
import { Badge } from '../components/ui/Badge'
import { currentAdvisorId } from '../config/demoConfig'
import { pipelineColumns } from '../data/demoData'

const stageMeta = pipelineColumns.reduce((acc, column) => {
  acc[column.id] = column
  return acc
}, {})

export function ChatsView({
  draft,
  leads,
  onDraftChange,
  onSendMessage,
  onSelectLead,
  onSetDraft,
  onToggleOwner,
  properties,
  replyForLead,
  selectedLead,
}) {
  const [activeFilter, setActiveFilter] = useState('all')

  const counts = useMemo(() => {
    const base = {
      all: leads.length,
      mine: leads.filter((lead) => lead.assignedTo === currentAdvisorId).length,
      unassigned: leads.filter((lead) => !lead.assignedTo).length,
      ai: leads.filter((lead) => lead.owner === 'IA').length,
      handoff: leads.filter((lead) => lead.needHuman).length,
    }
    pipelineColumns.forEach((column) => {
      base[`stage:${column.id}`] = leads.filter((lead) => lead.stage === column.id).length
    })
    return base
  }, [leads])

  const filteredLeads = useMemo(() => {
    switch (activeFilter) {
      case 'mine':
        return leads.filter((lead) => lead.assignedTo === currentAdvisorId)
      case 'unassigned':
        return leads.filter((lead) => !lead.assignedTo)
      case 'ai':
        return leads.filter((lead) => lead.owner === 'IA')
      case 'handoff':
        return leads.filter((lead) => lead.needHuman)
      default:
        if (activeFilter.startsWith('stage:')) {
          const stage = activeFilter.split(':')[1]
          return leads.filter((lead) => lead.stage === stage)
        }
        return leads
    }
  }, [leads, activeFilter])

  if (!selectedLead) return null

  return (
    <section className="mt-6 flex w-full min-w-0 flex-col gap-3 overflow-hidden xl:flex-row">
      <InboxFilters activeFilter={activeFilter} counts={counts} onSelectFilter={setActiveFilter} />
      <LeadList leads={filteredLeads} selectedLead={selectedLead} onSelectLead={onSelectLead} />
      <Conversation
        draft={draft}
        lead={selectedLead}
        onDraftChange={onDraftChange}
        onSendMessage={onSendMessage}
        onSetDraft={onSetDraft}
        onToggleOwner={onToggleOwner}
        replyForLead={replyForLead}
      />
      <PropertyOfferList onSetDraft={onSetDraft} properties={properties} />
    </section>
  )
}

function InboxFilters({ activeFilter, counts, onSelectFilter }) {
  const inboxItems = [
    { id: 'all', label: 'Todos', icon: Inbox },
    { id: 'mine', label: 'Mios', icon: UserRound },
    { id: 'unassigned', label: 'Sin asignar', icon: UserRoundX },
    { id: 'ai', label: 'Agente IA', icon: Bot, accent: 'text-blue-600' },
    { id: 'handoff', label: 'Requiere humano', icon: Flame, accent: 'text-rose-600' },
  ]

  return (
    <aside className="min-h-[calc(100vh-210px)] min-w-0 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 shadow-sm xl:w-52 xl:shrink-0">
      <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-black uppercase tracking-wide text-slate-400">
        <Filter size={12} />
        Inbox
      </div>
      <ul className="grid gap-1">
        {inboxItems.map((item) => (
          <FilterRow
            key={item.id}
            active={activeFilter === item.id}
            accent={item.accent}
            count={counts[item.id]}
            icon={item.icon}
            label={item.label}
            onClick={() => onSelectFilter(item.id)}
          />
        ))}
      </ul>

      <div className="mt-4 mb-2 flex items-center gap-2 px-1 text-[11px] font-black uppercase tracking-wide text-slate-400">
        <Target size={12} />
        Etapa
      </div>
      <ul className="grid gap-1">
        {pipelineColumns.map((column) => (
          <FilterRow
            key={column.id}
            active={activeFilter === `stage:${column.id}`}
            count={counts[`stage:${column.id}`]}
            icon={CircleDashed}
            label={column.label}
            tone={column.tone}
            onClick={() => onSelectFilter(`stage:${column.id}`)}
          />
        ))}
      </ul>
    </aside>
  )
}

function FilterRow({ accent, active, count, icon: Icon, label, onClick, tone }) {
  return (
    <li>
      <button
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition',
          active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50',
        )}
        type="button"
        onClick={onClick}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icon size={15} className={cn('shrink-0', active ? 'text-blue-600' : accent || 'text-slate-500')} />
          <span className="min-w-0 truncate font-semibold">{label}</span>
        </span>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black',
            active ? 'bg-blue-100 text-blue-700' : tone || 'bg-slate-100 text-slate-600',
          )}
        >
          {count ?? 0}
        </span>
      </button>
    </li>
  )
}

function LeadList({ leads, selectedLead, onSelectLead }) {
  return (
    <aside className="grid min-h-[calc(100vh-210px)] min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm xl:w-72 xl:shrink-0">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input className="h-10 w-full rounded-lg border border-stone-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500" placeholder="Buscar lead" />
      </div>
      <div className="grid min-w-0 content-start gap-2 overflow-y-auto pr-1">
        {leads.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-slate-400">No hay leads en este inbox.</p>
        )}
        {leads.map((lead) => {
          const stage = stageMeta[lead.stage]
          const isSelected = selectedLead.id === lead.id
          return (
            <button
              className={cn(
                'block w-full min-w-0 overflow-hidden rounded-lg border p-3 text-left transition',
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-stone-200 bg-white hover:bg-stone-50',
              )}
              key={lead.id}
              type="button"
              onClick={() => onSelectLead(lead.id)}
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <strong className="min-w-0 truncate text-sm">{lead.name}</strong>
                {lead.owner === 'IA' ? <Bot size={15} className="shrink-0 text-blue-600" /> : <UserRoundCheck size={15} className="shrink-0" />}
              </div>
              <p className="mt-1 block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-500">{lead.messages.at(-1)?.text}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase', stage?.tone || 'bg-slate-100 text-slate-600')}>
                  {stage?.label}
                </span>
                <span className="shrink-0 text-[10px] font-bold text-slate-400">{lead.lastContact}</span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function Conversation({ draft, lead, onDraftChange, onSendMessage, onSetDraft, onToggleOwner, replyForLead }) {
  return (
    <section className="grid min-h-[calc(100vh-210px)] min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-slate-200 bg-[#f1eadf] shadow-sm">
      <ConversationHeader lead={lead} onToggleOwner={onToggleOwner} />
      <div className="flex w-full min-w-0 flex-col gap-3 overflow-y-auto p-4">
        {lead.messages.map((message, index) => (
          <div
            className={cn('max-w-[min(76%,620px)] rounded-lg px-3 py-2 text-sm leading-6 shadow-sm', message.from === 'agent' ? 'ml-auto bg-[#d7f7dc]' : 'mr-auto bg-white')}
            key={`${message.time}-${index}`}
          >
            <p className="break-words">{message.text}</p>
            <span className="mt-1 block text-[11px] font-bold text-slate-400">{message.time}</span>
          </div>
        ))}
      </div>

      <footer className="min-w-0 border-t border-slate-200 bg-white p-3">
        <div className="mb-2 flex w-full flex-wrap gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-xs font-bold" type="button" onClick={() => onSetDraft(replyForLead(lead))}>
            <Sparkles size={15} />
            Sugerir respuesta
          </button>
        </div>
        <div className="flex w-full min-w-0 gap-2">
          <input
            className="h-11 min-w-0 flex-1 rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-blue-500"
            value={draft}
            placeholder="Escribi una respuesta..."
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && onSendMessage()}
          />
          <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700" type="button" onClick={onSendMessage}>
            <Send size={16} />
            Enviar
          </button>
        </div>
      </footer>
    </section>
  )
}

function ConversationHeader({ lead, onToggleOwner }) {
  const stage = stageMeta[lead.stage]
  const initials = lead.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <header className="min-w-0 border-b border-slate-200 bg-white">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-black text-blue-700">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-black leading-tight">{lead.name}</h3>
              <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase', stage?.tone || 'bg-slate-100 text-slate-600')}>
                {stage?.label}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs font-bold text-slate-500">
              {lead.channel || 'WhatsApp'} - {lead.source}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ring-1', scoreTone(lead.score))}>
            <Flame size={12} />
            Score {lead.score}
          </span>
          <button
            className={cn('inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-bold', lead.owner === 'IA' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800')}
            type="button"
            onClick={() => onToggleOwner(lead)}
          >
            {lead.owner === 'IA' ? <Bot size={14} /> : <UserRoundCheck size={14} />}
            {lead.owner}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-xs md:grid-cols-3 xl:grid-cols-4">
        <InfoCell icon={Phone} label="Telefono" value={lead.phone} />
        <InfoCell icon={Mail} label="Email" value={lead.email} />
        <InfoCell icon={AtSign} label="Instagram" value={lead.instagram} />
        <InfoCell icon={MessageSquare} label="Contactos" value={`${lead.contactCount ?? 1} interacciones`} />
        <InfoCell icon={Target} label="Intencion" value={lead.intent} />
        <InfoCell icon={MapPin} label="Zona" value={lead.area} />
        <InfoCell icon={Building2} label="Tipo" value={lead.propertyType} />
        <InfoCell icon={Wallet} label="Presupuesto" value={lead.budget} />
        <InfoCell icon={CreditCard} label="Financiacion" value={lead.financing} />
        <InfoCell icon={CalendarClock} label="Timeline" value={lead.timeline} />
        <InfoCell icon={Clock} label="Ultimo contacto" value={lead.lastContact} />
        <InfoCell icon={UserRoundCheck} label="Primer contacto" value={lead.firstContact} />
      </div>

      {lead.tags?.length ? (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-4 py-2">
          {lead.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ) : null}
    </header>
  )
}

function InfoCell({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon size={13} className="mt-0.5 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate text-xs font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  )
}

function PropertyOfferList({ onSetDraft, properties }) {
  return (
    <aside className="min-h-[calc(100vh-210px)] min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:w-72 xl:shrink-0">
      <p className="text-xs font-black uppercase text-blue-600">Propiedades para ofertar</p>
      <h3 className="mt-1 text-lg font-black">Segun este chat</h3>
      <div className="mt-4 grid gap-3 overflow-y-auto pr-1">
        {properties.map((property) => (
          <button
            className="block w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
            key={property.id}
            type="button"
            onClick={() => onSetDraft(`Te comparto ${property.title}: ${property.price}. Encaja bien con lo que venimos hablando.`)}
          >
            <div className="flex min-w-0 items-center justify-between gap-2">
              <strong className="min-w-0 truncate text-sm">{property.title}</strong>
              <span className="shrink-0 rounded-full bg-blue-100 px-2 py-1 text-[11px] font-black text-blue-700">{property.match}%</span>
            </div>
            <p className="mt-2 truncate text-sm font-black text-slate-900">{property.price}</p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-500">{property.status}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {property.tags.slice(0, 2).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
