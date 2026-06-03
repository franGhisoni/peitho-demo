import { ArrowRight, Bot, MessageCircle, Send } from 'lucide-react'
import { pipelineColumns } from '../data/demoData'
import { cn } from '../lib/helpers'
import { Badge } from '../components/ui/Badge'
import { Score } from '../components/ui/Score'

export function PipelineView({
  leads,
  selectedLead,
  staleLeads,
  onAdvanceLead,
  onOpenChat,
  onSelectLead,
  onSetDraft,
  onToggleHandoff,
  replyForLead,
}) {
  return (
    <section className="mt-6 grid gap-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-blue-600">Pipeline board</p>
            <h3 className="text-2xl font-semibold tracking-tight">Leads por etapa</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-600">Vista tablero</span>
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 font-semibold text-blue-700">IA activa</span>
          </div>
        </div>

        <div className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-3 overflow-x-auto rounded-lg bg-[#f8fafd] p-3 xl:grid-flow-row xl:grid-cols-5">
          {pipelineColumns.map((column) => (
            <PipelineColumn
              column={column}
              key={column.id}
              leads={leads.filter((lead) => lead.stage === column.id)}
              selectedLead={selectedLead}
              onAdvanceLead={onAdvanceLead}
              onOpenChat={onOpenChat}
              onSelectLead={onSelectLead}
              onSetDraft={onSetDraft}
              replyForLead={replyForLead}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        {selectedLead && (
          <LeadDetail lead={selectedLead} onOpenChat={onOpenChat} onSetDraft={onSetDraft} onToggleHandoff={onToggleHandoff} replyForLead={replyForLead} />
        )}
        <StaleLeadsPanel leads={staleLeads} onOpenChat={onOpenChat} onSetDraft={onSetDraft} />
      </div>
    </section>
  )
}

function PipelineColumn({ column, leads, selectedLead, onAdvanceLead, onOpenChat, onSelectLead, onSetDraft, replyForLead }) {
  return (
    <div className="min-h-[610px] rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{column.label}</h3>
        <span className={cn('rounded-full px-2 py-1 text-xs font-black', column.tone)}>{leads.length}</span>
      </div>
      <div className="grid gap-3">
        {leads.map((lead) => (
          <LeadPipelineCard
            key={lead.id}
            lead={lead}
            selected={selectedLead?.id === lead.id}
            onAdvanceLead={onAdvanceLead}
            onOpenChat={onOpenChat}
            onSelectLead={onSelectLead}
            onSetDraft={onSetDraft}
            replyForLead={replyForLead}
          />
        ))}
      </div>
    </div>
  )
}

function LeadPipelineCard({ lead, selected, onAdvanceLead, onOpenChat, onSelectLead, onSetDraft, replyForLead }) {
  return (
    <article
      className={cn('cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md', selected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200')}
      role="button"
      tabIndex={0}
      onClick={() => onOpenChat(lead)}
      onKeyDown={(event) => event.key === 'Enter' && onOpenChat(lead)}
    >
      <div className="w-full text-left" onClick={(event) => event.stopPropagation()}>
        <button className="w-full text-left" type="button" onClick={() => onSelectLead(lead.id)}>
          <div className="flex items-start justify-between gap-2">
            <strong className="text-sm">{lead.name}</strong>
            <Score score={lead.score} />
          </div>
          <p className="mt-2 text-sm text-slate-600">{lead.intent}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{lead.budget}</p>
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        <Badge>{lead.area}</Badge>
        <Badge>{lead.lastContact}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 text-xs font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onSetDraft(replyForLead(lead))
            onOpenChat(lead)
          }}
        >
          <Bot size={14} />
          IA
        </button>
        <button
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onOpenChat(lead)
          }}
        >
          <MessageCircle size={14} />
          Chat
        </button>
        <button
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold hover:bg-slate-50"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onAdvanceLead(lead)
          }}
        >
          <ArrowRight size={14} />
          Avanzar
        </button>
      </div>
    </article>
  )
}

function LeadDetail({ lead, onOpenChat, onSetDraft, onToggleHandoff, replyForLead }) {
  return (
    <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-blue-600">Ficha del lead seleccionado</p>
      <h3 className="mt-1 text-2xl font-black">{lead.name}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">{lead.phone}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Score score={lead.score} />
        <Badge>{lead.source}</Badge>
        <Badge>{lead.owner}</Badge>
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">{lead.notes}</div>
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs font-black uppercase text-blue-700">Siguiente mejor acción</p>
        <p className="mt-1 text-sm font-semibold text-slate-950">{lead.nextAction}</p>
      </div>
      <div className="mt-4 grid gap-2">
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => {
            onSetDraft(replyForLead(lead))
            onOpenChat(lead)
          }}
        >
          <MessageCircle size={16} />
          Entrar al chat
        </button>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold hover:bg-slate-50" type="button" onClick={() => onToggleHandoff(lead)}>
          Cambiar handoff
        </button>
      </div>
    </aside>
  )
}

function StaleLeadsPanel({ leads, onOpenChat, onSetDraft }) {
  function reactivationMessage(lead) {
    return `Hola ${lead.name.split(' ')[0]}, te escribo porque entraron opciones nuevas en ${lead.area} que pueden encajar con lo que buscabas. Seguis interesado/a o cambio algo de tu busqueda?`
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-blue-600">Reactivación</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">Leads sin respuesta</h3>
        </div>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">{leads.length}</span>
      </div>
      <p className="mt-2 text-sm text-slate-500">Contactos que quedaron fríos y tienen una excusa concreta para volver a escribirles.</p>
      <div className="mt-4 grid gap-3">
        {leads.map((lead) => (
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={lead.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-sm">{lead.name}</strong>
                <p className="mt-1 text-xs font-semibold text-slate-500">{lead.intent}</p>
              </div>
              <Badge>{lead.lastContact}</Badge>
            </div>
            <p className="mt-2 text-sm leading-5 text-slate-600">{lead.nextAction}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 text-xs font-bold text-white hover:bg-blue-700"
                type="button"
                onClick={() => {
                  onSetDraft(reactivationMessage(lead))
                  onOpenChat(lead)
                }}
              >
                <Send size={14} />
                Reactivar
              </button>
              <button className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold hover:bg-slate-50" type="button" onClick={() => onOpenChat(lead)}>
                <MessageCircle size={14} />
                Ver chat
              </button>
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
}
