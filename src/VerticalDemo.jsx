import { useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowRight, BarChart3, Boxes, Calendar, CalendarCheck, Car, ChevronRight, CircleDollarSign,
  ClipboardList, Clock3, CreditCard, Download, FileSpreadsheet, Gauge, KeyRound, LayoutDashboard, Menu, MessageCircle,
  Receipt, Search, Send, ShieldCheck, Sparkles, Ticket, TrendingUp, Users, Watch, X, WalletCards,
  Calculator, Wrench,
} from 'lucide-react'
import { verticalDemos } from './data/verticalDemoData'
import { cn } from './lib/helpers'
import { exportToExcel } from './lib/excelExport'
import { EventsOperations } from './components/EventsOperations'
import { AutoCustomerProfile } from './components/AutoCustomerProfile'
import { AutoFinanceSimulator } from './components/AutoFinanceSimulator'
import { AutoTestDriveView } from './components/AutoTestDriveView'
import { AutoTransfersView } from './components/AutoTransfersView'
import { AutoTransferReceiptModal } from './components/AutoTransferReceiptModal'

const iconMap = { users: Users, stock: Boxes, trend: TrendingUp, alert: AlertTriangle, car: Car }

export function VerticalDemo({ type }) {
  const demo = verticalDemos[type]
  const [section, setSection] = useState('dashboard')
  const [leads, setLeads] = useState(demo.leads)
  const [transfers, setTransfers] = useState(demo.transfers || [])
  const [activeReceipt, setActiveReceipt] = useState(null)
  const [selectedId, setSelectedId] = useState(demo.leads[0].id)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const selectedLead = leads.find((lead) => lead.id === selectedId) || leads[0]

  const filteredItems = useMemo(() => {
    const value = query.trim().toLowerCase()
    return value ? demo.items.filter((item) => `${item.title} ${item.ref} ${item.status}`.toLowerCase().includes(value)) : demo.items
  }, [demo.items, query])

  function navigate(next) {
    setSection(next)
    setMobileMenu(false)
  }

  function openChat(lead) {
    setSelectedId(lead.id)
    navigate('chats')
  }

  function advance(lead) {
    const index = demo.stages.findIndex((stage) => stage.id === lead.stage)
    const stage = demo.stages[Math.min(index + 1, demo.stages.length - 1)]
    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, stage: stage.id } : item))
  }

  function sendMessage() {
    if (!draft.trim()) return
    const message = { from: 'agent', text: draft.trim(), time: 'Ahora' }
    setLeads((current) => current.map((lead) => lead.id === selectedLead.id ? { ...lead, messages: [...lead.messages, message], lastContact: 'Ahora' } : lead))
    setDraft('')
  }

  function confirmTransfer(transferId) {
    setTransfers((current) =>
      current.map((t) => (t.id === transferId ? { ...t, status: 'Acreditado' } : t))
    )
    setLeads((current) =>
      current.map((lead) => ({
        ...lead,
        messages: lead.messages.map((m) => {
          if (m.transferReceipt && m.transferReceipt.id === transferId) {
            return {
              ...m,
              transferReceipt: { ...m.transferReceipt, status: 'Acreditado' },
            }
          }
          return m
        }),
      }))
    )
    if (activeReceipt && activeReceipt.id === transferId) {
      setActiveReceipt((prev) => (prev ? { ...prev, status: 'Acreditado' } : null))
    }
  }

  function simulateClientTransfer() {
    if (!selectedLead) return
    const newReceiptId = `tr-${Date.now()}`
    const relatedItem = demo.items?.find((i) => i.id === selectedLead.itemId)
    const newReceipt = {
      id: newReceiptId,
      client: selectedLead.name,
      vehicle: relatedItem ? relatedItem.title : selectedLead.intent,
      amount: 'USD 1.500',
      concept: `Seña y reserva de unidad · ${relatedItem ? relatedItem.title : selectedLead.intent}`,
      bank: 'Banco Galicia',
      opNumber: `OP-${Math.floor(100000 + Math.random() * 900000)}-COELSA`,
      date: 'Hoy · Recién',
      status: 'Pendiente',
      cbuOrigin: '0070123400000088991122',
      cbuTarget: '0170099900000099887766 (SI Motors SRL)',
      cuitOrigin: '20-33445566-9',
    }
    const newMessage = {
      from: 'client',
      text: `Te adjunto el comprobante oficial de la transferencia bancaria por ${newReceipt.amount} para confirmar la seña de la unidad.`,
      time: 'Ahora',
      transferReceipt: newReceipt,
    }
    setTransfers((prev) => [newReceipt, ...prev])
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? {
              ...l,
              stage: 'reserva',
              messages: [...l.messages, newMessage],
              lastContact: 'Ahora',
            }
          : l
      )
    )
  }

  const nav = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['pipeline', demo.pipelineLabel, Users],
    ['chats', 'Conversaciones', MessageCircle],
    ['inventory', demo.itemLabel, type === 'relojes' ? Watch : type === 'autos' ? Car : Ticket],
    ...(type === 'eventos' ? [
      ['market', demo.marketLabel, CreditCard],
      ['operations', 'Operación por evento', ClipboardList],
    ] : []),
    ...(type === 'relojes' ? [
      ['market', demo.marketLabel, BarChart3],
      ['finance', 'Finanzas', WalletCards],
    ] : []),
    ...(type === 'autos' ? [
      ['testdrive', 'Test Drive & Peritaje', CalendarCheck],
      ['transfers', 'Control de Transferencias', Receipt],
      ['finance', 'Finanzas & Ventas', WalletCards],
    ] : []),
  ]

  return (
    <div className={cn('vertical-demo min-h-screen bg-[#f6f7fb] text-slate-950', `theme-${demo.accent}`)}>
      <div className="grid min-h-screen grid-cols-[minmax(0,1fr)] lg:grid-cols-[258px_minmax(0,1fr)]">
        <Sidebar demo={demo} mobileMenu={mobileMenu} nav={nav} section={section} onClose={() => setMobileMenu(false)} onNavigate={navigate} />
        <main className="min-w-0 p-4 md:p-7 xl:p-9">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white lg:hidden" onClick={() => setMobileMenu(true)}><Menu size={19} /></button>
              <div>
                <p className="accent-text text-xs font-black uppercase tracking-[.16em]">{demo.eyebrow}</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight md:text-4xl">{nav.find(([id]) => id === section)?.[1]}</h1>
              </div>
            </div>
            <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white py-2 pl-2 pr-4 shadow-sm sm:flex">
              <span className="accent-soft grid size-8 place-items-center rounded-full font-black text-xs">{demo.brand.startsWith('SI') ? 'SI' : demo.brand[0]}</span>
              <div className="text-xs"><strong className="block">Demo activa</strong><span className="text-slate-500">Datos simulados</span></div>
            </div>
          </header>

          {section === 'dashboard' && <Dashboard demo={demo} leads={leads} onNavigate={navigate} onOpenChat={openChat} />}
          {section === 'pipeline' && <Pipeline demo={demo} leads={leads} selectedId={selectedId} onAdvance={advance} onOpenChat={openChat} onSelect={setSelectedId} />}
          {section === 'chats' && (
            <Chats
              demo={demo}
              draft={draft}
              leads={leads}
              selectedLead={selectedLead}
              onDraft={setDraft}
              onSelect={setSelectedId}
              onSend={sendMessage}
              onViewReceipt={setActiveReceipt}
              onConfirmTransfer={confirmTransfer}
              onSimulateTransfer={simulateClientTransfer}
            />
          )}
          {section === 'inventory' && <Inventory demo={demo} items={filteredItems} query={query} onQuery={setQuery} />}
          {section === 'market' && (type === 'relojes' ? <WatchMarket demo={demo} /> : <Payments demo={demo} leads={leads} />)}
          {section === 'operations' && type === 'eventos' && <EventsOperations demo={demo} leads={leads} />}
          {section === 'finance' && <BusinessFinance demo={demo} />}
          {section === 'testdrive' && type === 'autos' && <AutoTestDriveView demo={demo} leads={leads} onOpenChat={openChat} />}
          {section === 'transfers' && type === 'autos' && (
            <AutoTransfersView
              demo={demo}
              leads={leads}
              transfers={transfers}
              onConfirmTransfer={confirmTransfer}
              onOpenChat={openChat}
            />
          )}
        </main>
      </div>
      {activeReceipt && (
        <AutoTransferReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
          onConfirm={confirmTransfer}
        />
      )}
    </div>
  )
}

function Sidebar({ demo, mobileMenu, nav, section, onClose, onNavigate }) {
  return (
    <>
      {mobileMenu && <button aria-label="Cerrar menú" className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" onClick={onClose} />}
      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col border-r border-slate-200 bg-[#101828] p-5 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0', mobileMenu ? 'translate-x-0' : '-translate-x-full')}>
        <button className="absolute right-3 top-3 text-slate-400 lg:hidden" onClick={onClose}><X /></button>
        <div className="flex items-center gap-3">
          <div className="accent-bg grid size-11 place-items-center rounded-xl text-white shadow-lg">{demo.key === 'relojes' ? <Watch /> : demo.key === 'autos' ? <Car /> : <Ticket />}</div>
          <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400">{demo.key === 'autos' ? 'CRM Automotriz' : demo.key === 'relojes' ? 'CRM Luxury' : demo.key === 'eventos' ? 'Ticketing & CRM' : 'CRM'}</p><h2 className="font-black">{demo.brand}</h2></div>
        </div>
        <nav className="mt-8 grid gap-1.5">
          {nav.map(([id, label, Icon]) => <button key={id} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition', section === id ? 'accent-nav' : 'text-slate-400 hover:bg-white/5 hover:text-white')} onClick={() => onNavigate(id)}><Icon size={18} />{label}</button>)}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.06] p-4">
          <div className="accent-text flex items-center gap-2 text-xs font-black uppercase"><Sparkles size={15} />Agente IA</div>
          <p className="mt-2 text-sm font-bold leading-5">Responde consultas, califica intención y mantiene cada oportunidad en movimiento.</p>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Estado</span><span className="flex items-center gap-1 font-bold text-emerald-400"><i className="size-2 rounded-full bg-emerald-400" />Activo</span></div>
        </div>
        {demo.key === 'eventos' && <a href="/eventos/app" className="mt-4 rounded-xl bg-violet-600 px-3 py-2.5 text-center text-xs font-black text-white hover:bg-violet-700">Abrir app de control de acceso</a>}
        {demo.key === 'autos' && (
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={() => onNavigate('testdrive')} className="rounded-xl bg-blue-600 px-3 py-2.5 text-center text-xs font-black text-white hover:bg-blue-700">Ver agenda de Test Drive</button>
            <button onClick={() => onNavigate('transfers')} className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 px-3 py-2 text-center text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition">
              <Receipt size={14} /> Control de Transferencias
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

function MonthFilterSelect({ months, selectedMonth, onSelectMonth, label = 'Período' }) {
  if (!months || months.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
        <Calendar size={14} className="text-blue-600" />
        {label}:
      </span>
      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1 shadow-xs">
        {months.map((m) => {
          const active = selectedMonth === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMonth(m.id)}
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer',
                active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              )}
            >
              {m.shortLabel || m.label}
              {m.isCurrent && !active && (
                <span className="size-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Dashboard({ demo, leads, onNavigate, onOpenChat }) {
  const months = demo.months || [
    { id: '2026-09', label: 'Septiembre 2026 (En curso)', shortLabel: 'Septiembre 2026', isCurrent: true },
    { id: '2026-08', label: 'Agosto 2026', shortLabel: 'Agosto 2026' },
    { id: '2026-07', label: 'Julio 2026', shortLabel: 'Julio 2026' },
    { id: 'all', label: 'Todos los meses (Q3 Acumulado)', shortLabel: 'Todo Q3 2026' },
  ]
  const [selectedMonth, setSelectedMonth] = useState('2026-09')

  const currentCards = useMemo(() => {
    if (demo.monthlyDashboardCards && demo.monthlyDashboardCards[selectedMonth]) {
      return demo.monthlyDashboardCards[selectedMonth]
    }
    return demo.dashboardCards
  }, [demo, selectedMonth])

  function exportDashboardExcel() {
    const monthObj = months.find((m) => m.id === selectedMonth)
    const monthLabel = monthObj ? monthObj.label : selectedMonth
    const filename = `${demo.brand.replace(/\s+/g, '_')}_Dashboard_${selectedMonth}`

    const sheets = [
      {
        name: 'Métricas Período',
        data: currentCards.map((c) => ({
          'Indicador': c.label,
          'Valor': c.value,
          'Detalle': c.detail,
          'Período': monthLabel,
        })),
      },
      {
        name: 'Oportunidades Prioritarias',
        data: leads.map((l) => ({
          'Cliente': l.name,
          'Teléfono': l.phone,
          'Intención / Vehículo': l.intent,
          'Presupuesto': l.budget,
          'Score IA': l.score,
          'Etapa CRM': l.stage,
          'Origen': l.source,
          'Asesor': l.owner,
          'Último Contacto': l.lastContact,
          'Próxima Acción': l.nextAction,
        })),
      },
      {
        name: 'Inventario y Aging',
        data: (demo.items || []).map((item) => ({
          'Vehículo / Item': item.title,
          'Referencia': item.ref,
          'Precio Publicado': item.price,
          'Costo Adquisición': item.acquisition,
          'Margen Est.': item.margin,
          'Estado': item.status,
          'Días en Salón (Aging)': item.inventoryDays,
          'Consultas Recibidas': item.inquiries,
          'Alerta Comercial': item.alert,
        })),
      },
    ]

    exportToExcel({ filename, sheets })
  }

  return (
    <section className="mt-7 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      {/* Barra de Filtro de Mes y Exportación a Excel */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <MonthFilterSelect
          months={months}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          label="Período"
        />

        <button
          type="button"
          onClick={exportDashboardExcel}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-xs transition hover:bg-emerald-700 cursor-pointer"
          title="Exportar métricas de salón, oportunidades y stock a planilla Excel"
        >
          <FileSpreadsheet size={16} />
          <span>Exportar Dashboard a Excel</span>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {currentCards.map((card) => {
          const Icon = iconMap[card.kind] || Users
          return (
            <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500">{card.label}</p>
                  <strong className="mt-2 block text-3xl font-black tracking-tight">{card.value}</strong>
                </div>
                <span className="accent-soft grid size-10 place-items-center rounded-xl">
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold text-slate-500">{card.detail}</p>
            </article>
          )
        })}
      </div>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(330px,.6fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="accent-text text-xs font-black uppercase">Prioridad IA</p>
              <h2 className="mt-1 text-xl font-black">Oportunidades que requieren acción</h2>
            </div>
            <button className="accent-button hidden rounded-xl px-3 py-2 text-xs font-black sm:block" onClick={() => onNavigate('pipeline')}>
              Ver pipeline
            </button>
          </div>
          <div className="mt-5 grid gap-2">
            {leads.slice().sort((a,b)=>b.score-a.score).slice(0,4).map(lead=>(
              <button key={lead.id} onClick={()=>onOpenChat(lead)} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-slate-300 hover:bg-slate-50">
                <span className="accent-soft grid size-10 shrink-0 place-items-center rounded-full text-xs font-black">
                  {lead.name.split(' ').map(x=>x[0]).slice(0,2).join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm">{lead.name}</strong>
                  <span className="block truncate text-xs text-slate-500">{lead.nextAction}</span>
                </span>
                <span className="text-sm font-black text-emerald-600">{lead.score}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-700" />
              </button>
            ))}
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="accent-text text-xs font-black uppercase">Actividad en vivo</p>
              <h2 className="mt-1 text-xl font-black">Últimos movimientos</h2>
            </div>
            <span className="accent-soft grid size-10 place-items-center rounded-xl">
              <Clock3 size={18} />
            </span>
          </div>
          <div className="mt-5 grid gap-4">
            {leads.slice(0,3).map((lead,index)=>(
              <div className="relative flex gap-3" key={lead.id}>
                <span className="accent-bg mt-1.5 size-2 shrink-0 rounded-full" />
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {demo.key==='relojes' ? ['Stock confirmado','Precio comparado','Seguimiento programado'][index] : demo.key==='autos' ? ['Test Drive coordinado', 'Ficha 360° completada', 'Seña registrada en salón'][index] : ['Cupo confirmado','Checkout detectado','Recordatorio programado'][index]}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{lead.name} · {lead.intent}</p>
                  <span className="mt-1 block text-[10px] font-bold text-slate-400">{lead.lastContact}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="accent-text mt-5 text-xs font-black" onClick={() => onNavigate('chats')}>
            Ver conversaciones <ChevronRight size={14} className="inline" />
          </button>
        </section>
      </div>
      <SmartAlerts demo={demo} />
    </section>
  )
}

function SmartAlerts({ demo }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="accent-soft grid size-10 place-items-center rounded-xl"><AlertTriangle size={18}/></span><div><p className="accent-text text-xs font-black uppercase">Alertas inteligentes</p><h2 className="text-xl font-black">{demo.key === 'autos' ? 'Decisiones de salón y rotación de stock' : 'Decisiones sugeridas'}</h2></div></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{demo.items.map(item=><article className="rounded-xl border border-slate-100 bg-slate-50 p-3" key={item.id}><div className="flex items-start justify-between gap-2"><strong className="text-sm">{item.title}</strong><span className="accent-bg mt-1 size-2 shrink-0 rounded-full"/></div><p className="mt-2 text-xs leading-5 text-slate-600">{item.alert}</p></article>)}</div></section>
}

function Pipeline({ demo, leads, selectedId, onAdvance, onOpenChat, onSelect }) {
  const selected = leads.find(l=>l.id===selectedId)
  return <section className="mt-7 grid gap-5"><div className="flex gap-3 overflow-x-auto pb-2">{demo.stages.map(stage=><div key={stage.id} className="w-[270px] shrink-0 rounded-2xl border border-slate-200 bg-slate-100/60 p-3"><div className="flex items-center justify-between px-1 py-2"><strong className="text-sm">{stage.label}</strong><span className={cn('rounded-full px-2 py-0.5 text-xs font-black',stage.tone)}>{leads.filter(l=>l.stage===stage.id).length}</span></div><div className="mt-2 grid gap-3">{leads.filter(l=>l.stage===stage.id).map(lead=><article key={lead.id} onClick={()=>onSelect(lead.id)} className={cn('cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',selectedId===lead.id?'accent-border ring-2 ring-offset-1':'border-slate-200')}><div className="flex items-start justify-between gap-2"><strong className="text-sm">{lead.name}</strong><span className="text-xs font-black text-emerald-600">{lead.score}</span></div><p className="mt-2 text-sm font-semibold text-slate-700">{lead.intent}</p><p className="mt-1 text-xs text-slate-500">{lead.budget}</p><div className="mt-3 flex flex-wrap gap-1">{lead.tags.slice(0,2).map(tag=><span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{tag}</span>)}</div><div className="mt-4 grid grid-cols-2 gap-2"><button className="accent-button rounded-lg py-2 text-xs font-black" onClick={e=>{e.stopPropagation();onOpenChat(lead)}}>Abrir chat</button><button className="rounded-lg border border-slate-200 py-2 text-xs font-black hover:bg-slate-50" onClick={e=>{e.stopPropagation();onAdvance(lead)}}><ArrowRight size={13} className="inline" /> Avanzar</button></div></article>)}</div></div>)}</div>{selected&&<div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto]"><div><p className="accent-text text-xs font-black uppercase">Siguiente mejor acción</p><h3 className="mt-1 text-xl font-black">{selected.name}</h3><p className="mt-2 text-sm text-slate-600">{selected.nextAction}</p></div><button className="accent-button self-center rounded-xl px-4 py-3 text-sm font-black" onClick={()=>onOpenChat(selected)}><MessageCircle size={16} className="mr-2 inline" />Continuar conversación</button></div>}</section>
}

function Chats({
  demo,
  draft,
  leads,
  selectedLead,
  onDraft,
  onSelect,
  onSend,
  onViewReceipt,
  onConfirmTransfer,
  onSimulateTransfer,
}) {
  const related = demo.items.find(item=>item.id===selectedLead.itemId)
  const [chatTab, setChatTab] = useState('profile') // 'profile', 'vehicle', 'finance'

  return <section className="mt-7 grid min-h-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[270px_minmax(0,1fr)_340px]">
    <aside className="border-b border-slate-200 p-3 lg:border-b-0 lg:border-r">
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-3 text-slate-400"/>
        <input className="h-10 w-full rounded-xl bg-slate-100 pl-9 pr-3 text-sm outline-none" placeholder="Buscar conversación"/>
      </div>
      <div className="flex gap-2 overflow-x-auto lg:grid">
        {leads.map(lead=>(
          <button key={lead.id} onClick={()=>onSelect(lead.id)} className={cn('min-w-[220px] rounded-xl border p-3 text-left lg:min-w-0',lead.id===selectedLead.id?'accent-soft accent-border':'border-transparent hover:bg-slate-50')}>
            <div className="flex justify-between gap-2">
              <strong className="truncate text-sm">{lead.name}</strong>
              <span className="shrink-0 text-[10px] text-slate-400">{lead.lastContact}</span>
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">{lead.messages.at(-1)?.text}</p>
          </button>
        ))}
      </div>
    </aside>

    <div className="grid min-w-0 grid-rows-[auto_1fr_auto] bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="accent-soft grid size-10 place-items-center rounded-full text-xs font-black">
            {selectedLead.name.split(' ').map(x=>x[0]).slice(0,2).join('')}
          </span>
          <div>
            <strong className="block">{selectedLead.name}</strong>
            <span className="text-xs text-slate-500">{selectedLead.source} · {selectedLead.phone}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-3 overflow-y-auto p-4">
        {selectedLead.messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm',
              m.from === 'agent' ? 'accent-chat ml-auto' : 'mr-auto bg-white'
            )}
          >
            <p>{m.text}</p>

            {m.transferReceipt && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 shadow-xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-lg bg-blue-600 text-white font-black text-xs">
                      <Receipt size={14} />
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {m.transferReceipt.bank || 'Comprobante Bancario'}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-black',
                      m.transferReceipt.status === 'Pendiente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    )}
                  >
                    {m.transferReceipt.status}
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Monto señado</span>
                    <strong className="text-sm font-black text-slate-900">{m.transferReceipt.amount}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Operación</span>
                    <span className="font-mono text-[11px] font-bold text-slate-600 truncate block">{m.transferReceipt.opNumber}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2 text-xs">
                  <span className="text-[11px] text-slate-500">{m.transferReceipt.date}</span>
                  <div className="flex gap-1.5">
                    {onViewReceipt && (
                      <button
                        type="button"
                        onClick={() => onViewReceipt(m.transferReceipt)}
                        className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-black text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                      >
                        Ver comprobante
                      </button>
                    )}
                    {m.transferReceipt.status === 'Pendiente' && onConfirmTransfer && (
                      <button
                        type="button"
                        onClick={() => onConfirmTransfer(m.transferReceipt.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-black text-white transition hover:bg-emerald-700 cursor-pointer"
                      >
                        Confirmar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <span className="block text-right text-[10px] opacity-50 mt-1">{m.time}</span>
          </div>
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-white p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() =>
              onDraft(
                demo.key === 'relojes'
                  ? `Hola ${selectedLead.name.split(' ')[0]}, confirmé disponibilidad y preparé la mejor opción según el precio actual de mercado.`
                  : demo.key === 'autos'
                  ? `Hola ${selectedLead.name.split(' ')[0]}, tenemos la unidad disponible en salón para coordinar un Test Drive y podemos recibir tu auto actual para peritaje mecánico en rampa sin costo.`
                  : `Hola ${selectedLead.name.split(' ')[0]}, confirmé que todavía hay lugar. Puedo reservarte el cupo y enviarte el link de pago.`
              )
            }
            className="text-xs font-black accent-text"
          >
            <Sparkles size={13} className="mr-1 inline" />
            Sugerir respuesta
          </button>

          {demo.key === 'autos' && onSimulateTransfer && (
            <button
              type="button"
              onClick={onSimulateTransfer}
              className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 hover:bg-blue-100 transition cursor-pointer"
              title="Simula que el cliente transfiere un adelanto y envía el comprobante"
            >
              <Receipt size={13} />
              Simular comprobante de adelanto
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            placeholder="Escribí una respuesta..."
          />
          <button onClick={onSend} className="accent-button grid size-11 shrink-0 place-items-center rounded-xl">
            <Send size={17} />
          </button>
        </div>
      </footer>
    </div>
    
    <aside className="border-t border-slate-200 p-4 lg:border-l lg:border-t-0 overflow-y-auto max-h-[760px]">
      {demo.key === 'autos' ? (
        <div>
          <div className="mb-4 flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-black">
            <button
              onClick={() => setChatTab('profile')}
              className={cn(
                'flex-1 rounded-lg py-1.5 transition flex items-center justify-center gap-1',
                chatTab === 'profile' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <ShieldCheck size={13} />
              Perfil 360°
            </button>
            <button
              onClick={() => setChatTab('vehicle')}
              className={cn(
                'flex-1 rounded-lg py-1.5 transition flex items-center justify-center gap-1',
                chatTab === 'vehicle' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Car size={13} />
              Vehículo
            </button>
            <button
              onClick={() => setChatTab('finance')}
              className={cn(
                'flex-1 rounded-lg py-1.5 transition flex items-center justify-center gap-1',
                chatTab === 'finance' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Calculator size={13} />
              Cuotas
            </button>
          </div>

          {chatTab === 'profile' && (
            <AutoCustomerProfile lead={selectedLead} item={related} onInsertBrief={onDraft} />
          )}

          {chatTab === 'finance' && (
            <AutoFinanceSimulator vehicle={related} onApplyDraft={onDraft} />
          )}

          {chatTab === 'vehicle' && related && (
            <div>
              <p className="accent-text text-xs font-black uppercase">Ficha técnica del vehículo</p>
              <h3 className="mt-1 text-lg font-black">{related.title}</h3>
              <img src={related.image} alt="" className="mt-3 h-36 w-full rounded-xl object-cover" />
              <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 p-2.5">
                <span className="text-xs font-black text-blue-900">{related.price}</span>
                <span className="rounded-full bg-blue-200/70 px-2 py-0.5 text-[10px] font-black text-blue-800">
                  {related.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Info label="Combustible" value={related.specs?.fuel} />
                <Info label="Transmisión" value={related.specs?.transmission} />
                <Info label="Tracción" value={related.specs?.traction} />
                <Info label="Garantía" value={related.specs?.warranty} />
                <Info label="Consultas · 7d" value={related.inquiries} />
                <Info label="Días en salón" value={related.inventoryDays} />
              </div>
              <div className="mt-3 rounded-xl border border-amber-200/70 bg-amber-50 p-3">
                <p className="text-[10px] font-black uppercase text-amber-900">Alerta de salón</p>
                <p className="mt-1 text-xs text-slate-700">{related.alert}</p>
              </div>
              <SimilarSuggestions demo={demo} related={related} onDraft={onDraft} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="accent-text text-xs font-black uppercase">Contexto comercial</p>
          <h3 className="mt-1 text-lg font-black">{related?.title}</h3>
          {related && <>
            <img src={related.image} alt="" className="mt-4 h-36 w-full rounded-xl object-cover"/>
            {demo.key==='relojes'&&<div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-black uppercase text-slate-400">Precio · 90 días</span><strong className={cn('text-xs',related.change.startsWith('-')?'text-rose-600':'text-emerald-600')}>{related.change}</strong></div><PriceLineChart compact index={demo.items.findIndex(item=>item.id===related.id)} /></div>}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {demo.key==='relojes'&&<><Info label="Adquisición" value={related.acquisition}/><Info label="Stock" value={related.stock}/><Info label="Consultas · 7 días" value={related.inquiries}/></>}
              <Info label={demo.key==='relojes'?'Precio publicado':'Precio'} value={related.price}/>
              <Info label={demo.key==='relojes'?'Precio ideal':'Disponibilidad'} value={demo.key==='relojes'?related.ideal:related.stock}/>
              {demo.key==='relojes'&&<Info label="Margen ideal" value={related.margin}/>}
              <Info label="Estado del pago" value={selectedLead.payment}/>
              <div className="col-span-2"><Info label="Próxima acción" value={selectedLead.nextAction}/></div>
            </div>
            <SimilarSuggestions demo={demo} related={related} onDraft={onDraft}/>
          </>}
        </div>
      )}
    </aside>
  </section>
}

function SimilarSuggestions({ demo, related, onDraft }) {
  const suggestions = demo.items.filter(item=>item.id!==related.id).slice(0,2)
  return <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{demo.key==='relojes'?'Relojes similares':demo.key==='autos'?'Alternativas de stock':'Eventos similares'}</p><div className="mt-2 grid gap-2">{suggestions.map(item=><button className="flex items-center gap-2 rounded-xl border border-slate-100 p-2 text-left hover:bg-slate-50" key={item.id} onClick={()=>onDraft(demo.key==='relojes'?`También puedo ofrecerte ${item.title} a ${item.price}; es una alternativa similar que tenemos disponible.`:demo.key==='autos'?`También tenemos disponible ${item.title} a ${item.price} en salón con entrega inmediata.`:`También puede interesarte ${item.title}, con entradas ${item.price} y ${item.stock} disponibles.`)}><img src={item.image} alt="" className="size-10 shrink-0 rounded-lg object-cover"/><span className="min-w-0 flex-1"><strong className="block truncate text-xs">{item.title}</strong><span className="block truncate text-[10px] text-slate-500">{item.price} · {item.stock}</span></span><ChevronRight size={14} className="shrink-0 text-slate-300"/></button>)}</div></div>
}

function Inventory({ demo, items, query, onQuery }) {
  return <section className="mt-7 grid gap-5">
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="accent-text text-xs font-black uppercase">Inventario conectado</p>
        <h2 className="mt-1 text-xl font-black">{demo.key==='relojes'?'Stock, costo y posición de mercado':demo.key==='autos'?'Salón, stock aging y fichas técnicas':'Ventas y disponibilidad por evento'}</h2>
      </div>
      <div className="relative md:w-80">
        <Search className="absolute left-3 top-3.5 text-slate-400" size={16}/>
        <input value={query} onChange={e=>onQuery(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-slate-400" placeholder={demo.key==='relojes'?'Marca, referencia, estado...':demo.key==='autos'?'Modelo, año, motor, caja...':'Evento, fecha, estado...'}/>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map(item=><article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="relative h-48">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover"/>
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-black shadow">{item.status}</span>
            {demo.key==='autos' && (
              <span className={cn('absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-black shadow', parseInt(item.inventoryDays)>45||item.status.includes('Aging')?'bg-rose-600 text-white':'bg-emerald-600 text-white')}>
                Aging: {item.inventoryDays}
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs font-bold text-slate-500">{item.ref}</p>
            <h3 className="mt-1 font-black text-lg">{item.title}</h3>
            <p className="mt-2 text-xl font-black text-slate-900">{item.price}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              {demo.key==='relojes' ? (
                <>
                  <Info label="Adquisición" value={item.acquisition}/>
                  <Info label="Precio mínimo" value={item.minPrice}/>
                  <Info label="Stock" value={item.stock}/>
                  <Info label="Días en inventario" value={item.inventoryDays}/>
                  <Info label="Consultas · 7 días" value={item.inquiries}/>
                  <Info label="Margen ideal" value={item.margin}/>
                </>
              ) : demo.key==='autos' ? (
                <>
                  <Info label="Combustible" value={item.specs?.fuel}/>
                  <Info label="Transmisión" value={item.specs?.transmission}/>
                  <Info label="Tracción" value={item.specs?.traction}/>
                  <Info label="Garantía" value={item.specs?.warranty}/>
                  <Info label="Consultas · 7d" value={item.inquiries}/>
                  <Info label="Margen est." value={item.margin}/>
                </>
              ) : (
                <>
                  <Info label="Total vendido" value={item.sold}/>
                  <Info label="Total facturado" value={item.revenue}/>
                  <Info label="Espacio disponible" value={item.stock}/>
                  <Info label="Ocupación" value={item.change}/>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 pt-0">
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-[10px] font-black uppercase text-amber-700">Alerta inteligente</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{item.alert}</p>
          </div>
        </div>
      </article>)}
    </div>
  </section>
}

function WatchMarket({ demo }) {
  return <section className="mt-7 grid gap-5"><div className="rounded-2xl bg-[#101828] p-6 text-white"><p className="accent-text text-xs font-black uppercase">Pricing intelligence</p><h2 className="mt-2 text-2xl font-black">Precio ideal de venta, con evidencia de mercado</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Compará costo, precio mínimo, tiempo en inventario y demanda antes de responder una oferta.</p></div><div className="grid gap-4 xl:grid-cols-2">{demo.items.map((item,index)=><article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-slate-500">{item.ref}</p><h3 className="mt-1 text-lg font-black">{item.title}</h3></div><span className={cn('rounded-full px-2.5 py-1 text-xs font-black',item.change.startsWith('-')?'bg-rose-50 text-rose-700':'bg-emerald-50 text-emerald-700')}>{item.change} 90d</span></div><div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-3"><Info label="Adquisición" value={item.acquisition}/><Info label="Precio mínimo" value={item.minPrice}/><Info label="Publicado" value={item.price}/><Info label="Precio ideal" value={item.ideal}/><Info label="Stock" value={item.stock}/><Info label="Días en inventario" value={item.inventoryDays}/><Info label="Consultas · 7 días" value={item.inquiries}/><Info label="Margen ideal" value={item.margin}/><Info label="Rango mercado" value={item.market}/></div><div className="mt-5"><PriceLineChart index={index} /><div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400"><span>90 DÍAS</span><span>60 DÍAS</span><span>30 DÍAS</span><span>HOY</span></div></div><div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3"><p className="text-[10px] font-black uppercase text-amber-700">Alerta inteligente</p><p className="mt-1 text-xs text-slate-600">{item.alert}</p></div><div className="mt-5 grid gap-2">{item.channels.map(([channel,price])=><div key={channel} className="flex justify-between border-t border-slate-100 pt-2 text-sm"><span className="text-slate-500">{channel}</span><strong>{price}</strong></div>)}</div></article>)}</div></section>
}

function PriceLineChart({ compact = false, index = 0 }) {
  const series = [
    [72,68,70,66,74,78,76,82,80,86,84,91],
    [64,66,63,69,67,72,75,73,79,77,83,85],
    [82,79,81,76,74,77,72,70,73,68,69,66],
    [58,61,60,65,63,69,68,74,72,78,80,84],
  ][index % 4]
  const width = 320
  const height = compact ? 62 : 118
  const min = Math.min(...series) - 4
  const max = Math.max(...series) + 4
  const points = series.map((value, pointIndex) => `${(pointIndex / (series.length - 1)) * width},${height - ((value - min) / (max - min)) * (height - 12) - 6}`).join(' ')
  const areaPoints = `0,${height} ${points} ${width},${height}`

  return <svg className="block w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolución estimada del precio en los últimos 90 días">
    <defs><linearGradient id={`price-fill-${index}-${compact}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".22"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
    {!compact&&[.25,.5,.75].map(position=><line key={position} x1="0" x2={width} y1={height*position} y2={height*position} stroke="#e2e8f0" strokeDasharray="4 5" />)}
    <polygon points={areaPoints} fill={`url(#price-fill-${index}-${compact})`} />
    <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth={compact?3:3.5} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={width} cy={points.split(' ').at(-1).split(',')[1]} r={compact?4:5} fill="white" stroke="var(--accent)" strokeWidth="3" />
  </svg>
}

function BusinessFinance({ demo }) {
  const [selectedSale, setSelectedSale] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('2026-09')
  const finance = demo.finance
  if (!finance) return null

  const months = demo.months || [
    { id: '2026-09', label: 'Septiembre 2026 (En curso)', shortLabel: 'Septiembre 2026', isCurrent: true },
    { id: '2026-08', label: 'Agosto 2026', shortLabel: 'Agosto 2026' },
    { id: '2026-07', label: 'Julio 2026', shortLabel: 'Julio 2026' },
    { id: 'all', label: 'Todos los meses (Q3 Acumulado)', shortLabel: 'Todo Q3 2026' },
  ]

  const currentSummary = useMemo(() => {
    if (finance.monthlySummaries && finance.monthlySummaries[selectedMonth]) {
      return finance.monthlySummaries[selectedMonth]
    }
    return finance.summary
  }, [finance, selectedMonth])

  const filteredSales = useMemo(() => {
    if (selectedMonth === 'all') return finance.sales
    return finance.sales.filter(
      (s) => s.monthKey === selectedMonth || (!s.monthKey && selectedMonth === '2026-08')
    )
  }, [finance.sales, selectedMonth])

  const currentAgents = useMemo(() => {
    if (finance.monthlyAgents && finance.monthlyAgents[selectedMonth]) {
      return finance.monthlyAgents[selectedMonth]
    }
    return finance.agents
  }, [finance, selectedMonth])

  function exportFinanceExcel() {
    const monthObj = months.find((m) => m.id === selectedMonth)
    const monthLabel = monthObj ? monthObj.label : selectedMonth
    const filename = `${demo.brand.replace(/\s+/g, '_')}_Reporte_Financiero_${selectedMonth}`

    const sheets = [
      {
        name: 'Ventas y Boletos',
        data: filteredSales.map((s) => ({
          'N° Operación': s.id,
          'Fecha': s.date,
          'Comprador': s.buyer,
          'Vehículo / Item': s.item,
          'Versión / Ref': s.reference,
          'Importe Total': s.amount,
          'Costo Adquisición': s.acquisition,
          'Gastos Directos': s.costs,
          'Margen Neto': s.net,
          '% Margen': s.margin,
          'Estado Pago': s.status,
          'Medio de Pago': s.method,
          'Asesor Comercial': s.agent,
        })),
      },
      {
        name: 'Resumen Ejecutivo',
        data: currentSummary.map((card) => ({
          'Indicador': card.label,
          'Valor': card.value,
          'Detalle': card.detail,
          'Período': monthLabel,
        })),
      },
      {
        name: 'Equipo Comercial',
        data: currentAgents.map((ag) => ({
          'Asesor': ag.name,
          'Especialidad': ag.role,
          'Ventas Cerradas': ag.sales,
          'Facturado': ag.revenue,
          'Tasa Conversión': ag.conversion,
          'Comisión': ag.commission,
          'Avance de Meta': `${ag.progress}%`,
        })),
      },
      ...(finance.credits
        ? [
            {
              name: 'Créditos Prendarios',
              data: finance.credits.map((cr) => ({
                'N° Solicitud': cr.id,
                'Banco Entidad': cr.bank,
                'Comprador': cr.client,
                'Vehículo': cr.item,
                'Monto Solicitado': cr.amount,
                'Plan Cuotas': cr.plan,
                'Tasa Pactada': cr.rate,
                'Estado Scoring': cr.status,
              })),
            },
          ]
        : []),
    ]

    exportToExcel({ filename, sheets })
  }

  return (
    <section className="mt-7 grid gap-5">
      <div className="rounded-2xl bg-[#101828] p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="accent-text text-xs font-black uppercase">Gestión financiera & Tesorería</p>
            <h2 className="mt-2 text-2xl font-black">
              {demo.key === 'autos' ? 'Ventas de salón, créditos prendarios y rentabilidad' : 'Ventas, pagos y rentabilidad del negocio'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {demo.key === 'autos'
                ? 'Seguí cada boleto de compraventa, estado de scoring bancario prendario y rendimiento de los asesores de salón.'
                : 'Seguí cada operación desde la reserva hasta el cobro, con margen real por unidad y rendimiento de cada agente.'}
            </p>
          </div>

          <button
            type="button"
            onClick={exportFinanceExcel}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 cursor-pointer shrink-0 self-start md:self-center"
            title="Descargar libro contable y financiero en formato Excel (.xlsx)"
          >
            <FileSpreadsheet size={16} />
            <span>Exportar Reporte a Excel</span>
          </button>
        </div>
      </div>

      {/* Selector de Mes */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <MonthFilterSelect
          months={months}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          label="Período contable"
        />

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Mostrando:</span>
          <strong className="text-slate-900">{filteredSales.length} operaciones</strong>
          <span>en {months.find(m => m.id === selectedMonth)?.shortLabel || selectedMonth}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {currentSummary.map((card) => (
          <FinanceMetric
            key={card.label}
            icon={card.icon === 'sales' ? TrendingUp : card.icon === 'pending' ? Clock3 : card.icon === 'cost' ? CreditCard : CircleDollarSign}
            label={card.label}
            value={card.value}
            detail={card.detail}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,.6fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
            <div>
              <p className="accent-text text-xs font-black uppercase">Historial de ventas</p>
              <h3 className="mt-1 text-xl font-black">
                {demo.key === 'autos' ? 'Boletos y operaciones de salón' : 'Operaciones recientes'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                {filteredSales.length} operaciones
              </span>
              <button
                type="button"
                onClick={exportFinanceExcel}
                className="hidden sm:flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-800 cursor-pointer"
                title="Exportar esta tabla a Excel"
              >
                <Download size={13} />
                Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="p-4">Fecha / comprador</th>
                  <th className="p-4">{demo.key === 'autos' ? 'Vehículo' : demo.key === 'relojes' ? 'Reloj' : 'Item'}</th>
                  <th className="p-4">Importe</th>
                  <th className="p-4">Pago</th>
                  <th className="p-4">Asesor</th>
                  <th className="p-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-t border-slate-100">
                    <td className="p-4">
                      <strong>{sale.date}</strong>
                      <span className="block text-xs text-slate-400">{sale.buyer}</span>
                    </td>
                    <td className="p-4">
                      <strong className="block">{sale.item}</strong>
                      <span className="text-xs text-slate-400">{sale.reference}</span>
                    </td>
                    <td className="p-4">
                      <strong>{sale.amount}</strong>
                      <span className="block text-xs text-emerald-600">Neto {sale.net}</span>
                    </td>
                    <td className="p-4">
                      <span className={cn('rounded-full px-2 py-1 text-[11px] font-black', sale.status === 'Acreditado' ? 'bg-emerald-50 text-emerald-700' : sale.status === 'Pendiente' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600')}>
                        {sale.status}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">{sale.method}</span>
                    </td>
                    <td className="p-4 font-semibold">{sale.agent}</td>
                    <td className="p-4">
                      <button className="accent-text whitespace-nowrap text-xs font-black cursor-pointer" onClick={() => setSelectedSale(sale)}>
                        {selectedSale?.id === sale.id ? 'Seleccionado' : 'Ver detalle'} <ChevronRight size={14} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedSale && (
            <div className="border-t border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="accent-text text-[10px] font-black uppercase">Detalle de operación · {selectedSale.id}</p>
                  <h4 className="mt-1 text-lg font-black">{selectedSale.item} para {selectedSale.buyer}</h4>
                </div>
                <button className="text-xs font-black text-slate-400 cursor-pointer" onClick={() => setSelectedSale(null)}>
                  Cerrar
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <Info label="Adquisición" value={selectedSale.acquisition}/>
                <Info label="Precio de venta" value={selectedSale.amount}/>
                <Info label="Costos" value={selectedSale.costs}/>
                <Info label="Margen neto" value={selectedSale.margin}/>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div>
                  <p className="text-xs font-black">Comprobante y liquidación</p>
                  <p className="mt-1 text-xs text-slate-500">{selectedSale.receipt}</p>
                </div>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50 cursor-pointer">
                  Ver comprobante
                </button>
              </div>
            </div>
          )}
        </section>

        {demo.key === 'autos' && finance.credits ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="accent-text text-xs font-black uppercase">Créditos Prendarios</p>
                <h3 className="mt-1 text-xl font-black">Scoring bancario en vivo</h3>
              </div>
              <CreditCard className="text-slate-300" size={19} />
            </div>
            <div className="mt-5 grid gap-3">
              {finance.credits.map((cred) => (
                <div key={cred.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-black">{cred.bank}</strong>
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-black', cred.status === 'Pre-aprobado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                      {cred.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-700">{cred.client} · {cred.item}</p>
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>{cred.plan} ({cred.rate})</span>
                    <strong className="text-slate-900 font-bold">{cred.amount}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="accent-text text-xs font-black uppercase">Pagos</p>
                <h3 className="mt-1 text-xl font-black">Últimos movimientos</h3>
              </div>
              <WalletCards className="text-slate-300" size={19} />
            </div>
            <div className="mt-5 grid gap-3">
              {finance.payments?.map((payment) => (
                <div key={payment.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm">{payment.label}</strong>
                    <span className={cn('text-xs font-black', payment.status === 'Acreditado' ? 'text-emerald-600' : 'text-amber-600')}>
                      {payment.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{payment.detail}</p>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-slate-400">{payment.date}</span>
                    <strong>{payment.amount}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="accent-text text-xs font-black uppercase">Equipo comercial</p>
            <h3 className="mt-1 text-xl font-black">Agentes de ventas</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {months.find((m) => m.id === selectedMonth)?.shortLabel || 'Período'}
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {currentAgents.map((agent) => (
            <article key={agent.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="accent-soft grid size-10 place-items-center rounded-full text-xs font-black">
                  {agent.initials}
                </span>
                <div>
                  <strong className="block text-sm">{agent.name}</strong>
                  <span className="text-xs text-slate-500">{agent.role}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Info label="Ventas cerradas" value={agent.sales} />
                <Info label="Facturado" value={agent.revenue} />
                <Info label="Conversión" value={agent.conversion} />
                <Info label="Comisión" value={agent.commission} />
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="accent-bg h-full rounded-full" style={{ width: `${agent.progress}%` }} />
              </div>
              <p className="mt-2 text-[10px] font-bold text-slate-400">{agent.progress}% del objetivo del período</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

function FinanceMetric({ icon: Icon, label, value, detail }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="accent-soft grid size-10 place-items-center rounded-xl"><Icon size={19}/></span><TrendingUp size={16} className="text-emerald-500"/></div><p className="mt-4 text-sm font-bold text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black">{value}</strong><p className="mt-1 text-xs text-slate-400">{detail}</p></article>
}

function Payments({ demo, leads }) {
  const rows=leads.filter(l=>l.stage==='checkout'||l.stage==='pagado')
  return <section className="mt-7 grid gap-5"><div className="grid gap-3 md:grid-cols-3"><PaymentMetric icon={CircleDollarSign} label="Pagos aprobados" value="$38,6M" detail="1.284 operaciones"/><PaymentMetric icon={Clock3} label="Pendientes" value="$1,42M" detail="27 checkouts abiertos"/><PaymentMetric icon={AlertTriangle} label="Rechazados" value="$248k" detail="9 para recuperar"/></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><p className="accent-text text-xs font-black uppercase">Operaciones recientes</p><h2 className="mt-1 text-xl font-black">Estado de pagos y entradas</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="p-4">Comprador</th><th className="p-4">Evento</th><th className="p-4">Pago</th><th className="p-4">Estado CRM</th><th className="p-4">Acción</th></tr></thead><tbody>{rows.map(lead=>{const item=demo.items.find(i=>i.id===lead.itemId);const paid=lead.stage==='pagado';return <tr key={lead.id} className="border-t border-slate-100"><td className="p-4"><strong>{lead.name}</strong><span className="block text-xs text-slate-400">{lead.phone}</span></td><td className="p-4 font-semibold">{item?.title}</td><td className="p-4"><span className={cn('rounded-full px-2 py-1 text-xs font-black',paid?'bg-emerald-50 text-emerald-700':lead.payment==='Rechazado'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700')}>{lead.payment}</span></td><td className="p-4">{demo.stages.find(s=>s.id===lead.stage)?.label}</td><td className="p-4"><button className="accent-text font-black">{paid?'Ver entrada':'Recuperar pago'} <ChevronRight size={14} className="inline"/></button></td></tr>})}</tbody></table></div></div></section>
}

function PaymentMetric({ icon:Icon,label,value,detail }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="accent-soft grid size-10 place-items-center rounded-xl"><Icon size={19}/></span><Gauge size={18} className="text-slate-300"/></div><p className="mt-4 text-sm font-bold text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black">{value}</strong><p className="mt-1 text-xs text-slate-400">{detail}</p></article> }
function Info({ label, value }) { return <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-0.5 break-words text-xs font-bold text-slate-700">{value}</p></div> }
