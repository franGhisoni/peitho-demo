import { useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowRight, BarChart3, Bot, Boxes, Check, ChevronRight, CircleDollarSign,
  Clock3, CreditCard, Gauge, LayoutDashboard, Menu, MessageCircle, Search,
  Send, Sparkles, Ticket, TrendingUp, Users, Watch, X,
} from 'lucide-react'
import { verticalDemos } from './data/verticalDemoData'
import { cn } from './lib/helpers'

const iconMap = { users: Users, stock: Boxes, trend: TrendingUp, alert: AlertTriangle }

export function VerticalDemo({ type }) {
  const demo = verticalDemos[type]
  const [section, setSection] = useState('dashboard')
  const [leads, setLeads] = useState(demo.leads)
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

  const nav = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['pipeline', demo.pipelineLabel, Users],
    ['chats', 'Conversaciones', MessageCircle],
    ['inventory', demo.itemLabel, type === 'relojes' ? Watch : Ticket],
    ['market', demo.marketLabel, type === 'relojes' ? BarChart3 : CreditCard],
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
              <span className="accent-soft grid size-8 place-items-center rounded-full font-black">P</span>
              <div className="text-xs"><strong className="block">Demo activa</strong><span className="text-slate-500">Datos simulados</span></div>
            </div>
          </header>

          {section === 'dashboard' && <Dashboard demo={demo} leads={leads} onNavigate={navigate} onOpenChat={openChat} />}
          {section === 'pipeline' && <Pipeline demo={demo} leads={leads} selectedId={selectedId} onAdvance={advance} onOpenChat={openChat} onSelect={setSelectedId} />}
          {section === 'chats' && <Chats demo={demo} draft={draft} leads={leads} selectedLead={selectedLead} onDraft={setDraft} onSelect={setSelectedId} onSend={sendMessage} />}
          {section === 'inventory' && <Inventory demo={demo} items={filteredItems} query={query} onQuery={setQuery} />}
          {section === 'market' && (type === 'relojes' ? <WatchMarket demo={demo} /> : <Payments demo={demo} leads={leads} />)}
        </main>
      </div>
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
          <div className="accent-bg grid size-11 place-items-center rounded-xl text-white shadow-lg">{demo.key === 'relojes' ? <Watch /> : <Ticket />}</div>
          <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400">Demo vertical</p><h2 className="font-black">{demo.brand}</h2></div>
        </div>
        <nav className="mt-8 grid gap-1.5">
          {nav.map(([id, label, Icon]) => <button key={id} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition', section === id ? 'accent-nav' : 'text-slate-400 hover:bg-white/5 hover:text-white')} onClick={() => onNavigate(id)}><Icon size={18} />{label}</button>)}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.06] p-4">
          <div className="accent-text flex items-center gap-2 text-xs font-black uppercase"><Sparkles size={15} />Agente IA</div>
          <p className="mt-2 text-sm font-bold leading-5">Responde consultas, califica intención y mantiene cada oportunidad en movimiento.</p>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Estado</span><span className="flex items-center gap-1 font-bold text-emerald-400"><i className="size-2 rounded-full bg-emerald-400" />Activo</span></div>
        </div>
        <a href="/" className="mt-4 text-center text-xs font-bold text-slate-500 hover:text-white">← Volver a demo inmobiliaria</a>
      </aside>
    </>
  )
}

function Dashboard({ demo, leads, onNavigate, onOpenChat }) {
  return <section className="mt-7 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{demo.dashboardCards.map((card) => { const Icon = iconMap[card.kind]; return <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-500">{card.label}</p><strong className="mt-2 block text-3xl font-black tracking-tight">{card.value}</strong></div><span className="accent-soft grid size-10 place-items-center rounded-xl"><Icon size={19} /></span></div><p className="mt-4 text-xs font-semibold text-slate-500">{card.detail}</p></article> })}</div>
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(330px,.6fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="accent-text text-xs font-black uppercase">Prioridad IA</p><h2 className="mt-1 text-xl font-black">Oportunidades que requieren acción</h2></div><button className="accent-button hidden rounded-xl px-3 py-2 text-xs font-black sm:block" onClick={() => onNavigate('pipeline')}>Ver pipeline</button></div><div className="mt-5 grid gap-2">{leads.slice().sort((a,b)=>b.score-a.score).slice(0,4).map(lead=><button key={lead.id} onClick={()=>onOpenChat(lead)} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-slate-300 hover:bg-slate-50"><span className="accent-soft grid size-10 shrink-0 place-items-center rounded-full text-xs font-black">{lead.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{lead.name}</strong><span className="block truncate text-xs text-slate-500">{lead.nextAction}</span></span><span className="text-sm font-black text-emerald-600">{lead.score}</span><ChevronRight size={16} className="text-slate-300 group-hover:text-slate-700" /></button>)}</div></section>
      <section className="overflow-hidden rounded-2xl bg-[#101828] p-5 text-white shadow-sm"><span className="accent-bg grid size-11 place-items-center rounded-xl"><Bot /></span><h2 className="mt-5 text-2xl font-black">La IA ya hizo el primer trabajo.</h2><p className="mt-2 text-sm leading-6 text-slate-400">Entendió qué busca cada persona, detectó urgencia y preparó la siguiente acción comercial.</p><div className="mt-5 grid gap-3 text-sm">{(demo.key==='relojes' ? ['Consulta stock en tiempo real','Sugiere precio según mercado','Detecta permutas y ofertas'] : ['Confirma cupos disponibles','Recupera pagos incompletos','Envía entrada y recordatorios']).map(text=><div className="flex items-center gap-2" key={text}><Check size={16} className="accent-text" /><span>{text}</span></div>)}</div></section>
    </div>
  </section>
}

function Pipeline({ demo, leads, selectedId, onAdvance, onOpenChat, onSelect }) {
  const selected = leads.find(l=>l.id===selectedId)
  return <section className="mt-7 grid gap-5"><div className="flex gap-3 overflow-x-auto pb-2">{demo.stages.map(stage=><div key={stage.id} className="w-[270px] shrink-0 rounded-2xl border border-slate-200 bg-slate-100/60 p-3"><div className="flex items-center justify-between px-1 py-2"><strong className="text-sm">{stage.label}</strong><span className={cn('rounded-full px-2 py-0.5 text-xs font-black',stage.tone)}>{leads.filter(l=>l.stage===stage.id).length}</span></div><div className="mt-2 grid gap-3">{leads.filter(l=>l.stage===stage.id).map(lead=><article key={lead.id} onClick={()=>onSelect(lead.id)} className={cn('cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',selectedId===lead.id?'accent-border ring-2 ring-offset-1':'border-slate-200')}><div className="flex items-start justify-between gap-2"><strong className="text-sm">{lead.name}</strong><span className="text-xs font-black text-emerald-600">{lead.score}</span></div><p className="mt-2 text-sm font-semibold text-slate-700">{lead.intent}</p><p className="mt-1 text-xs text-slate-500">{lead.budget}</p><div className="mt-3 flex flex-wrap gap-1">{lead.tags.slice(0,2).map(tag=><span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{tag}</span>)}</div><div className="mt-4 grid grid-cols-2 gap-2"><button className="accent-button rounded-lg py-2 text-xs font-black" onClick={e=>{e.stopPropagation();onOpenChat(lead)}}>Abrir chat</button><button className="rounded-lg border border-slate-200 py-2 text-xs font-black hover:bg-slate-50" onClick={e=>{e.stopPropagation();onAdvance(lead)}}><ArrowRight size={13} className="inline" /> Avanzar</button></div></article>)}</div></div>)}</div>{selected&&<div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto]"><div><p className="accent-text text-xs font-black uppercase">Siguiente mejor acción</p><h3 className="mt-1 text-xl font-black">{selected.name}</h3><p className="mt-2 text-sm text-slate-600">{selected.nextAction}</p></div><button className="accent-button self-center rounded-xl px-4 py-3 text-sm font-black" onClick={()=>onOpenChat(selected)}><MessageCircle size={16} className="mr-2 inline" />Continuar conversación</button></div>}</section>
}

function Chats({ demo, draft, leads, selectedLead, onDraft, onSelect, onSend }) {
  const related = demo.items.find(item=>item.id===selectedLead.itemId)
  return <section className="mt-7 grid min-h-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[270px_minmax(0,1fr)_300px]">
    <aside className="border-b border-slate-200 p-3 lg:border-b-0 lg:border-r"><div className="relative mb-3"><Search size={15} className="absolute left-3 top-3 text-slate-400"/><input className="h-10 w-full rounded-xl bg-slate-100 pl-9 pr-3 text-sm outline-none" placeholder="Buscar conversación"/></div><div className="flex gap-2 overflow-x-auto lg:grid">{leads.map(lead=><button key={lead.id} onClick={()=>onSelect(lead.id)} className={cn('min-w-[220px] rounded-xl border p-3 text-left lg:min-w-0',lead.id===selectedLead.id?'accent-soft accent-border':'border-transparent hover:bg-slate-50')}><div className="flex justify-between gap-2"><strong className="truncate text-sm">{lead.name}</strong><span className="shrink-0 text-[10px] text-slate-400">{lead.lastContact}</span></div><p className="mt-1 truncate text-xs text-slate-500">{lead.messages.at(-1)?.text}</p></button>)}</div></aside>
    <div className="grid min-w-0 grid-rows-[auto_1fr_auto] bg-[#f8fafc]"><header className="border-b border-slate-200 bg-white p-4"><div className="flex items-center gap-3"><span className="accent-soft grid size-10 place-items-center rounded-full text-xs font-black">{selectedLead.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><div><strong className="block">{selectedLead.name}</strong><span className="text-xs text-slate-500">{selectedLead.source} · {selectedLead.phone}</span></div></div></header><div className="flex flex-col gap-3 overflow-y-auto p-4">{selectedLead.messages.map((m,i)=><div key={i} className={cn('max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm',m.from==='agent'?'accent-chat ml-auto':'mr-auto bg-white')}><p>{m.text}</p><span className="block text-right text-[10px] opacity-50">{m.time}</span></div>)}</div><footer className="border-t border-slate-200 bg-white p-3"><button onClick={()=>onDraft(demo.key==='relojes'?`Hola ${selectedLead.name.split(' ')[0]}, confirmé disponibilidad y preparé la mejor opción según el precio actual de mercado.`:`Hola ${selectedLead.name.split(' ')[0]}, confirmé que todavía hay lugar. Puedo reservarte el cupo y enviarte el link de pago.`)} className="mb-2 text-xs font-black accent-text"><Sparkles size={13} className="mr-1 inline"/>Sugerir respuesta</button><div className="flex gap-2"><input value={draft} onChange={e=>onDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onSend()} className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Escribí una respuesta..."/><button onClick={onSend} className="accent-button grid size-11 shrink-0 place-items-center rounded-xl"><Send size={17}/></button></div></footer></div>
    <aside className="border-t border-slate-200 p-5 lg:border-l lg:border-t-0"><p className="accent-text text-xs font-black uppercase">Contexto comercial</p><h3 className="mt-1 text-lg font-black">{related?.title}</h3>{related&&<><img src={related.image} alt="" className="mt-4 h-36 w-full rounded-xl object-cover"/><div className="mt-4 grid gap-3 text-sm"><Info label={demo.key==='relojes'?'Precio publicado':'Precio'} value={related.price}/><Info label={demo.key==='relojes'?'Precio ideal':'Disponibilidad'} value={demo.key==='relojes'?related.ideal:related.stock}/><Info label="Estado del pago" value={selectedLead.payment}/><Info label="Próxima acción" value={selectedLead.nextAction}/></div></>}</aside>
  </section>
}

function Inventory({ demo, items, query, onQuery }) {
  return <section className="mt-7 grid gap-5"><div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"><div><p className="accent-text text-xs font-black uppercase">Inventario conectado</p><h2 className="mt-1 text-xl font-black">{demo.key==='relojes'?'Stock, precio y posición de mercado':'Disponibilidad en tiempo real'}</h2></div><div className="relative md:w-80"><Search className="absolute left-3 top-3.5 text-slate-400" size={16}/><input value={query} onChange={e=>onQuery(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-slate-400" placeholder={demo.key==='relojes'?'Marca, referencia, estado...':'Evento, fecha, estado...'}/></div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{items.map(item=><article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="relative h-48"><img src={item.image} alt={item.title} className="h-full w-full object-cover"/><span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-xs font-black shadow">{item.status}</span></div><div className="p-4"><p className="text-xs font-bold text-slate-500">{item.ref}</p><h3 className="mt-1 font-black">{item.title}</h3><p className="mt-3 text-lg font-black">{item.price}</p><div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3"><Info label={demo.key==='relojes'?'Stock':'Disponibles'} value={item.stock}/><Info label={demo.key==='relojes'?'Mercado':'Ocupación'} value={demo.key==='relojes'?item.market:item.change}/></div></div></article>)}</div></section>
}

function WatchMarket({ demo }) {
  return <section className="mt-7 grid gap-5"><div className="rounded-2xl bg-[#101828] p-6 text-white"><p className="accent-text text-xs font-black uppercase">Pricing intelligence</p><h2 className="mt-2 text-2xl font-black">Precio ideal de venta, con evidencia de mercado</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Compará publicaciones, evolución estimada y tu margen antes de responder una oferta.</p></div><div className="grid gap-4 xl:grid-cols-2">{demo.items.map((item,index)=><article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-slate-500">{item.ref}</p><h3 className="mt-1 text-lg font-black">{item.title}</h3></div><span className={cn('rounded-full px-2.5 py-1 text-xs font-black',item.change.startsWith('-')?'bg-rose-50 text-rose-700':'bg-emerald-50 text-emerald-700')}>{item.change} 90d</span></div><div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3"><Info label="Publicado" value={item.price}/><Info label="Precio ideal" value={item.ideal}/><Info label="Rango mercado" value={item.market}/></div><div className="mt-5"><div className="flex h-24 items-end gap-2">{[38,52,47,63,58,72,68,81,76,88,84,92].map((height,i)=><span key={i} style={{height:`${height-index*2}%`}} className="accent-chart flex-1 rounded-t-sm opacity-80"/>)}</div><div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400"><span>SEP</span><span>HOY</span></div></div><div className="mt-5 grid gap-2">{item.channels.map(([channel,price])=><div key={channel} className="flex justify-between border-t border-slate-100 pt-2 text-sm"><span className="text-slate-500">{channel}</span><strong>{price}</strong></div>)}</div></article>)}</div></section>
}

function Payments({ demo, leads }) {
  const rows=leads.filter(l=>l.stage==='checkout'||l.stage==='pagado')
  return <section className="mt-7 grid gap-5"><div className="grid gap-3 md:grid-cols-3"><PaymentMetric icon={CircleDollarSign} label="Pagos aprobados" value="$38,6M" detail="1.284 operaciones"/><PaymentMetric icon={Clock3} label="Pendientes" value="$1,42M" detail="27 checkouts abiertos"/><PaymentMetric icon={AlertTriangle} label="Rechazados" value="$248k" detail="9 para recuperar"/></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><p className="accent-text text-xs font-black uppercase">Operaciones recientes</p><h2 className="mt-1 text-xl font-black">Estado de pagos y entradas</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="p-4">Comprador</th><th className="p-4">Evento</th><th className="p-4">Pago</th><th className="p-4">Estado CRM</th><th className="p-4">Acción</th></tr></thead><tbody>{rows.map(lead=>{const item=demo.items.find(i=>i.id===lead.itemId);const paid=lead.stage==='pagado';return <tr key={lead.id} className="border-t border-slate-100"><td className="p-4"><strong>{lead.name}</strong><span className="block text-xs text-slate-400">{lead.phone}</span></td><td className="p-4 font-semibold">{item?.title}</td><td className="p-4"><span className={cn('rounded-full px-2 py-1 text-xs font-black',paid?'bg-emerald-50 text-emerald-700':lead.payment==='Rechazado'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700')}>{lead.payment}</span></td><td className="p-4">{demo.stages.find(s=>s.id===lead.stage)?.label}</td><td className="p-4"><button className="accent-text font-black">{paid?'Ver entrada':'Recuperar pago'} <ChevronRight size={14} className="inline"/></button></td></tr>})}</tbody></table></div></div></section>
}

function PaymentMetric({ icon:Icon,label,value,detail }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="accent-soft grid size-10 place-items-center rounded-xl"><Icon size={19}/></span><Gauge size={18} className="text-slate-300"/></div><p className="mt-4 text-sm font-bold text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black">{value}</strong><p className="mt-1 text-xs text-slate-400">{detail}</p></article> }
function Info({ label, value }) { return <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-0.5 break-words text-xs font-bold text-slate-700">{value}</p></div> }
