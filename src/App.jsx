import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  MessageCircle,
  PhoneCall,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Upload,
  UserRoundCheck,
} from 'lucide-react'

const columns = [
  { id: 'nuevo', label: 'Nuevo', tone: 'bg-blue-50 text-blue-700' },
  { id: 'calificado', label: 'Calificado', tone: 'bg-green-50 text-green-700' },
  { id: 'visita', label: 'Visita agendada', tone: 'bg-sky-50 text-sky-700' },
  { id: 'oferta', label: 'Oferta', tone: 'bg-amber-50 text-amber-700' },
  { id: 'cierre', label: 'Cierre', tone: 'bg-emerald-50 text-emerald-700' },
]

const initialLeads = [
  {
    id: 'lead-sofia',
    name: 'Sofía Alvarez',
    phone: '+54 9 11 5842-0911',
    source: 'Instagram Ads',
    stage: 'nuevo',
    intent: 'Compra 3 ambientes',
    area: 'Belgrano / Núñez',
    budget: 'USD 180k - 220k',
    score: 94,
    lastContact: 'Hace 3 h',
    owner: 'IA',
    needHuman: false,
    nextAction: 'Enviar dos opciones con balcón y proponer visita para viernes.',
    notes:
      'Quiere mudarse antes de agosto. Prioriza cochera, balcón, luminosidad y cercanía a colegios.',
    messages: [
      {
        from: 'client',
        text: 'Hola, vi el departamento de Belgrano. Busco algo de 3 ambientes con cochera.',
        time: '10:12',
      },
      {
        from: 'agent',
        text: 'Hola Sofía, perfecto. Te puedo pasar opciones similares y coordinar una visita.',
        time: '10:14',
      },
      {
        from: 'client',
        text: 'Ideal si tiene balcón y está cerca de colegios. Presupuesto hasta 220 mil.',
        time: '10:18',
      },
    ],
  },
  {
    id: 'lead-martin',
    name: 'Martín Costa',
    phone: '+56 9 6312 8401',
    source: 'Web',
    stage: 'nuevo',
    intent: 'Alquiler temporario',
    area: 'Palermo',
    budget: 'USD 900 / mes',
    score: 67,
    lastContact: 'Hace 2 días',
    owner: 'IA',
    needHuman: false,
    nextAction: 'Responder disponibilidad y pedir fecha exacta de ingreso.',
    notes:
      'Viene por seis meses desde Chile. Necesita amoblado, expensas incluidas y check-in flexible.',
    messages: [
      { from: 'client', text: 'Necesito un amoblado en Palermo por seis meses.', time: 'Ayer' },
      { from: 'client', text: 'Puede ser con ingreso la primera semana de junio?', time: 'Ayer' },
    ],
  },
  {
    id: 'lead-carolina',
    name: 'Carolina Ruiz',
    phone: '+54 9 11 3014-1182',
    source: 'Referido',
    stage: 'calificado',
    intent: 'Venta + recompra',
    area: 'Vicente López',
    budget: 'Tasación pendiente',
    score: 82,
    lastContact: 'Hace 6 h',
    owner: 'Asesor',
    needHuman: true,
    nextAction: 'Agendar tasación y mostrar plan de comercialización.',
    notes:
      'Quiere vender una casa familiar y comprar un departamento más chico en zona norte.',
    messages: [
      {
        from: 'client',
        text: 'Me interesa tasar mi casa y entender cuánto podría tardar la venta.',
        time: '09:30',
      },
      { from: 'agent', text: 'Podemos coordinar una tasación esta semana.', time: '09:46' },
    ],
  },
  {
    id: 'lead-diego',
    name: 'Diego Fernández',
    phone: '+54 9 11 6422-7812',
    source: 'Landing inversión',
    stage: 'calificado',
    intent: 'Inversión en pozo',
    area: 'Colegiales / Chacarita',
    budget: 'USD 120k',
    score: 76,
    lastContact: 'Hace 1 h',
    owner: 'IA',
    needHuman: false,
    nextAction: 'Enviar comparativa de renta por barrio y plan de cuotas.',
    notes:
      'Busca rentabilidad y financiación. Prefiere unidades chicas con alta demanda de alquiler.',
    messages: [
      {
        from: 'client',
        text: 'Estoy mirando oportunidades en pozo. Me importa más renta que uso propio.',
        time: '12:05',
      },
    ],
  },
  {
    id: 'lead-valentina',
    name: 'Valentina Pereyra',
    phone: '+54 9 11 5547-7788',
    source: 'Tokko',
    stage: 'visita',
    intent: 'Compra primer hogar',
    area: 'Núñez',
    budget: 'USD 145k',
    score: 89,
    lastContact: 'Hace 30 min',
    owner: 'Asesor',
    needHuman: false,
    nextAction: 'Enviar recordatorio con dirección, expensas y alternativas cercanas.',
    notes: 'Visita confirmada para sábado. Quiere luminosidad, bajas expensas y cocina separada.',
    messages: [
      { from: 'agent', text: 'Valentina, te confirmo la visita del sábado a las 11:00.', time: '11:20' },
      { from: 'client', text: 'Genial. Me pasás también expensas y orientación?', time: '11:24' },
    ],
  },
  {
    id: 'lead-hernan',
    name: 'Hernán Sosa',
    phone: '+54 9 11 6741-8900',
    source: 'Cartel',
    stage: 'oferta',
    intent: 'Oferta por PH',
    area: 'Villa Urquiza',
    budget: 'USD 165k',
    score: 96,
    lastContact: 'Hace 5 h',
    owner: 'Asesor',
    needHuman: true,
    nextAction: 'Preparar resumen de oferta y pedir datos para reserva.',
    notes:
      'Quiere presentar oferta con parte financiada. Falta confirmar reserva y escribanía.',
    messages: [
      { from: 'client', text: 'Quiero avanzar con el PH. Podemos ofertar 160?', time: '08:44' },
      { from: 'agent', text: 'Lo converso con el propietario y te preparo el paso a paso.', time: '08:52' },
    ],
  },
  {
    id: 'lead-julieta',
    name: 'Julieta Molina',
    phone: '+54 9 11 4471-2039',
    source: 'Portal inmobiliario',
    stage: 'nuevo',
    intent: 'Alquiler 2 ambientes',
    area: 'Caballito',
    budget: 'ARS 620k / mes',
    score: 58,
    lastContact: 'Hace 9 días',
    owner: 'IA',
    needHuman: false,
    nextAction: 'Reactivar con dos opciones nuevas y preguntar si cambió la fecha de mudanza.',
    notes:
      'Consultó por alquiler, respondió una vez y después quedó en silencio. Puede estar comparando opciones.',
    messages: [
      { from: 'client', text: 'Hola, quería consultar por un 2 ambientes en Caballito.', time: '9 días' },
      { from: 'agent', text: 'Hola Julieta, tengo dos opciones dentro de ese rango. Te las paso?', time: '9 días' },
    ],
  },
  {
    id: 'lead-ricardo',
    name: 'Ricardo Mansilla',
    phone: '+54 9 11 3328-9014',
    source: 'Base histórica',
    stage: 'calificado',
    intent: 'Compra para inversión',
    area: 'Villa Crespo',
    budget: 'USD 95k - 115k',
    score: 63,
    lastContact: 'Hace 21 días',
    owner: 'IA',
    needHuman: false,
    nextAction: 'Enviar novedad de precio y una oportunidad con renta estimada.',
    notes:
      'Lead viejo con intención inversora. No respondió al último follow-up, pero pidió avisos si bajaban precios.',
    messages: [
      { from: 'client', text: 'Si aparece algo con buena renta en Villa Crespo, avisame.', time: '21 días' },
      { from: 'agent', text: 'Perfecto Ricardo, te aviso cuando entre algo con números interesantes.', time: '21 días' },
    ],
  },
]

const initialProperties = [
  {
    id: 'prop-belgrano',
    title: 'Belgrano R · 3 amb con cochera',
    area: 'Belgrano',
    price: 'USD 205.000',
    status: 'Disponible',
    match: 96,
    tags: ['Balcón', 'Cochera', 'Colegios'],
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prop-palermo',
    title: 'Palermo Hollywood · Amoblado',
    area: 'Palermo',
    price: 'USD 880 / mes',
    status: 'Disponible',
    match: 91,
    tags: ['Temporal', 'Amenities', 'Expensas incluidas'],
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prop-nunez',
    title: 'Núñez · 2 amb luminoso',
    area: 'Núñez',
    price: 'USD 142.000',
    status: 'Visita sábado',
    match: 88,
    tags: ['Bajas expensas', 'Norte', 'Listo escritura'],
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prop-urquiza',
    title: 'Villa Urquiza · PH reciclado',
    area: 'Villa Urquiza',
    price: 'USD 168.000',
    status: 'Negociación',
    match: 84,
    tags: ['Patio', 'Sin expensas', 'Subte B'],
    image:
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80',
  },
]

const appointments = [
  { time: '10:30', title: 'Tasación casa Vicente López', owner: 'Carolina Ruiz' },
  { time: '13:00', title: 'Llamada inversión en pozo', owner: 'Diego Fernández' },
  { time: '16:30', title: 'Visita Núñez 2 ambientes', owner: 'Valentina Pereyra' },
  { time: '18:00', title: 'Reserva PH Villa Urquiza', owner: 'Hernán Sosa' },
]

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pipeline', label: 'Pipeline', icon: UserRoundCheck },
  { id: 'chats', label: 'Chats', icon: MessageCircle },
  { id: 'properties', label: 'Propiedades', icon: Building2 },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'brand', label: 'Marca', icon: Settings },
]

const storageKeys = {
  leads: 'peitho-react-demo-leads-v2',
  logo: 'peitho-react-demo-logo',
  agency: 'peitho-react-demo-agency',
  botSchedule: 'peitho-react-demo-bot-schedule',
}

const defaultBotSchedule = {
  enabled: true,
  start: '18:00',
  end: '09:00',
  days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
}

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function loadJson(key, fallback) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function scoreTone(score) {
  if (score >= 88) return 'bg-rose-50 text-rose-700 ring-rose-100'
  if (score >= 75) return 'bg-amber-50 text-amber-700 ring-amber-100'
  return 'bg-sky-50 text-sky-700 ring-sky-100'
}

function isStaleLead(lead) {
  return /d[ií]as/i.test(lead.lastContact)
}

function App() {
  const [section, setSection] = useState('pipeline')
  const [leads, setLeads] = useState(() => loadJson(storageKeys.leads, initialLeads))
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id)
  const [logo, setLogo] = useState(() => localStorage.getItem(storageKeys.logo) || '')
  const [agency, setAgency] = useState(() => localStorage.getItem(storageKeys.agency) || 'Peitho Realty')
  const [botSchedule, setBotSchedule] = useState(() => loadJson(storageKeys.botSchedule, defaultBotSchedule))
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const sidebarLogoInputRef = useRef(null)

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || leads[0],
    [leads, selectedLeadId],
  )

  const filteredProperties = useMemo(() => {
    const search = query.toLowerCase().trim()
    if (!search) return initialProperties
    return initialProperties.filter((property) =>
      [property.title, property.area, property.price, property.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(search),
    )
  }, [query])

  const metrics = useMemo(
    () => ({
      hot: leads.filter((lead) => lead.score >= 88).length,
      stale: leads.filter(isStaleLead).length,
      aiOwned: leads.filter((lead) => lead.owner === 'IA').length,
      handoff: leads.filter((lead) => lead.needHuman).length,
    }),
    [leads],
  )

  const staleLeads = useMemo(() => leads.filter(isStaleLead), [leads])

  useEffect(() => {
    localStorage.setItem(storageKeys.leads, JSON.stringify(leads))
  }, [leads])

  useEffect(() => {
    localStorage.setItem(storageKeys.agency, agency)
  }, [agency])

  useEffect(() => {
    localStorage.setItem(storageKeys.botSchedule, JSON.stringify(botSchedule))
  }, [botSchedule])

  function updateLead(id, patch) {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)))
  }

  function appendMessage(id, message) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              lastContact: 'Ahora',
              messages: [...lead.messages, message],
            }
          : lead,
      ),
    )
  }

  function generateReply(lead = selectedLead) {
    if (!lead) return ''
    return `Hola ${lead.name.split(' ')[0]}, tengo opciones que encajan con ${lead.intent.toLowerCase()} en ${lead.area}. Te paso las mejores alternativas y, si te sirve, coordinamos visita esta semana.`
  }

  function sendMessage() {
    if (!selectedLead || !draft.trim()) return
    appendMessage(selectedLead.id, { from: 'agent', text: draft.trim(), time: 'Ahora' })
    setDraft('')
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const result = String(reader.result)
      setLogo(result)
      localStorage.setItem(storageKeys.logo, result)
    })
    reader.readAsDataURL(file)
  }

  function advanceLead(lead) {
    const index = columns.findIndex((column) => column.id === lead.stage)
    const next = columns[Math.min(index + 1, columns.length - 1)]
    updateLead(lead.id, { stage: next.id })
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#202124]">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white p-4 text-slate-900 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-lg font-black text-blue-600 shadow-sm">
              {logo ? <img src={logo} alt="Logo de la inmobiliaria" className="h-full w-full object-contain p-1" /> : 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-slate-500">
                <button
                  className="font-black text-blue-600 underline-offset-4 hover:underline"
                  type="button"
                  title="Cargar logo"
                  onClick={() => sidebarLogoInputRef.current?.click()}
                >
                  Demo
                </button>{' '}
                inmobiliaria
              </p>
              <h1 className="truncate text-lg font-black">{agency}</h1>
            </div>
          </div>

          <input
            ref={sidebarLogoInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
          />

          <nav className="mt-7 grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition',
                    section === item.id
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  )}
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-slate-950">
            <div className="flex items-center gap-2 text-blue-700">
              <Sparkles size={17} />
              <p className="text-xs font-black uppercase">Agente IA</p>
            </div>
            <h2 className="mt-2 text-lg font-black leading-tight">
              Detecta intención, responde y pide handoff cuando hace falta.
            </h2>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between border-t border-stone-200 pt-3">
                <span className="text-slate-500">Leads en IA</span>
                <strong>{metrics.aiOwned}</strong>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3">
                <span className="text-slate-500">Requieren asesor</span>
                <strong>{metrics.handoff}</strong>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 p-4 lg:p-6">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-blue-600">CRM + agente conversacional</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">
                {section === 'pipeline'
                  ? 'Tablero de leads'
                  : section === 'chats'
                    ? 'Conversaciones'
                    : 'Operación comercial inmobiliaria'}
              </h2>
            </div>
          </header>

          {section === 'dashboard' && <Dashboard metrics={metrics} leads={leads} setSection={setSection} />}
          {section === 'pipeline' && (
            <Pipeline
              leads={leads}
              selectedLead={selectedLead}
              setSelectedLeadId={setSelectedLeadId}
              setSection={setSection}
              generateReply={generateReply}
              setDraft={setDraft}
              advanceLead={advanceLead}
              updateLead={updateLead}
              staleLeads={staleLeads}
            />
          )}
          {section === 'chats' && (
            <Chats
              leads={leads}
              selectedLead={selectedLead}
              setSelectedLeadId={setSelectedLeadId}
              properties={initialProperties}
              draft={draft}
              setDraft={setDraft}
              sendMessage={sendMessage}
              generateReply={generateReply}
              updateLead={updateLead}
            />
          )}
          {section === 'properties' && (
            <Properties query={query} setQuery={setQuery} properties={filteredProperties} selectedLead={selectedLead} />
          )}
          {section === 'agenda' && <Agenda leads={leads} />}
          {section === 'brand' && (
            <BrandSettings
              agency={agency}
              setAgency={setAgency}
              logo={logo}
              handleLogoUpload={handleLogoUpload}
              botSchedule={botSchedule}
              setBotSchedule={setBotSchedule}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function Dashboard({ metrics, leads, setSection }) {
  const cards = [
    { label: 'Leads calientes', value: metrics.hot, icon: Sparkles, detail: 'Score superior a 88' },
    { label: 'Sin contacto 48 h', value: metrics.stale, icon: Clock3, detail: 'Riesgo de enfriarse' },
    { label: 'Handoff humano', value: metrics.handoff, icon: UserRoundCheck, detail: 'Oferta, tasación o negociación' },
    { label: 'Visitas sugeridas', value: 7, icon: CalendarDays, detail: 'Detectadas por conversación' },
  ]

  return (
    <section className="mt-6 grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm" key={card.label}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <strong className="mt-2 block text-3xl font-black">{card.value}</strong>
                </div>
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{card.detail}</p>
            </article>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-blue-600">Radar IA</p>
              <h3 className="text-2xl font-black">Oportunidades de hoy</h3>
            </div>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-bold text-white hover:bg-blue-700"
              type="button"
              onClick={() => setSection('pipeline')}
            >
              Ver pipeline
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="mt-5 grid gap-3">
            {leads
              .slice()
              .sort((a, b) => b.score - a.score)
              .slice(0, 4)
              .map((lead) => (
                <div
                  className="grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 md:grid-cols-[1fr_auto]"
                  key={lead.id}
                >
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
            La IA no solo responde: detecta intención, presupuesto, urgencia y cuándo debe pasar el caso
            a un asesor humano. Esto ayuda a vender el sistema como operación comercial, no como chatbot.
          </p>
          <div className="mt-5 grid gap-2 text-sm">
            <FeatureLine text="Respuesta sugerida con contexto del lead" />
            <FeatureLine text="Próxima mejor acción por etapa" />
            <FeatureLine text="Handoff cuando hay tasación, reserva u oferta" />
          </div>
        </section>
      </div>
    </section>
  )
}

function Pipeline({
  leads,
  selectedLead,
  setSelectedLeadId,
  setSection,
  generateReply,
  setDraft,
  advanceLead,
  updateLead,
  staleLeads,
}) {
  function openLeadChat(lead) {
    setSelectedLeadId(lead.id)
    setSection('chats')
  }

  return (
    <section className="mt-6 grid gap-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-blue-600">Pipeline board</p>
            <h3 className="text-2xl font-semibold tracking-tight">Leads por etapa</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-600">
              Vista tablero
            </span>
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 font-semibold text-blue-700">
              IA activa
            </span>
          </div>
        </div>

        <div className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-3 overflow-x-auto rounded-lg bg-[#f8fafd] p-3 xl:grid-flow-row xl:grid-cols-5">
          {columns.map((column) => {
            const columnLeads = leads.filter((lead) => lead.stage === column.id)
            return (
              <div className="min-h-[610px] rounded-lg border border-slate-200 bg-white p-3" key={column.id}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{column.label}</h3>
                  <span className={cn('rounded-full px-2 py-1 text-xs font-black', column.tone)}>
                    {columnLeads.length}
                  </span>
                </div>
                <div className="grid gap-3">
                  {columnLeads.map((lead) => (
                    <article
                      className={cn(
                        'cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md',
                        selectedLead?.id === lead.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200',
                      )}
                      key={lead.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openLeadChat(lead)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') openLeadChat(lead)
                      }}
                    >
                      <div className="w-full text-left">
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-sm">{lead.name}</strong>
                          <Score score={lead.score} />
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{lead.intent}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{lead.budget}</p>
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
                            setSelectedLeadId(lead.id)
                            setDraft(generateReply(lead))
                            setSection('chats')
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
                            openLeadChat(lead)
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
                            advanceLead(lead)
                          }}
                        >
                          <ArrowRight size={14} />
                          Avanzar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        {selectedLead && (
          <LeadDetail
            lead={selectedLead}
            updateLead={updateLead}
            openChat={() => setSection('chats')}
            setDraft={setDraft}
            generateReply={generateReply}
          />
        )}
        <StaleLeadsPanel
          leads={staleLeads}
          openLeadChat={openLeadChat}
          generateReply={generateReply}
          setDraft={setDraft}
        />
      </div>
    </section>
  )
}

function LeadDetail({ lead, updateLead, openChat, setDraft, generateReply }) {
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
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
        {lead.notes}
      </div>
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs font-black uppercase text-blue-700">Siguiente mejor acción</p>
        <p className="mt-1 text-sm font-semibold text-slate-950">{lead.nextAction}</p>
      </div>
      <div className="mt-4 grid gap-2">
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => {
            setDraft(generateReply(lead))
            openChat()
          }}
        >
          <MessageCircle size={16} />
          Entrar al chat
        </button>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold hover:bg-slate-50"
          type="button"
          onClick={() => updateLead(lead.id, { owner: lead.owner === 'IA' ? 'Asesor' : 'IA', needHuman: !lead.needHuman })}
        >
          <UserRoundCheck size={16} />
          Cambiar handoff
        </button>
      </div>
    </aside>
  )
}

function StaleLeadsPanel({ leads, openLeadChat, setDraft }) {
  function reactivationMessage(lead) {
    return `Hola ${lead.name.split(' ')[0]}, te escribo porque entraron opciones nuevas en ${lead.area} que pueden encajar con lo que buscabas. ¿Seguís interesado/a o cambió algo de tu búsqueda?`
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-blue-600">Reactivación</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">Leads sin respuesta</h3>
        </div>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">
          {leads.length}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Contactos que quedaron fríos y tienen una excusa concreta para volver a escribirles.
      </p>

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
                  setDraft(reactivationMessage(lead))
                  openLeadChat(lead)
                }}
              >
                <Send size={14} />
                Reactivar
              </button>
              <button
                className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold hover:bg-slate-50"
                type="button"
                onClick={() => openLeadChat(lead)}
              >
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

function Chats({
  leads,
  selectedLead,
  setSelectedLeadId,
  properties,
  draft,
  setDraft,
  sendMessage,
  generateReply,
  updateLead,
}) {
  if (!selectedLead) return null

  return (
    <section className="mt-6 flex w-full min-w-0 flex-col gap-4 overflow-hidden 2xl:flex-row">
      <aside className="grid min-h-[calc(100vh-210px)] min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm 2xl:w-80 2xl:shrink-0">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="h-10 w-full rounded-lg border border-stone-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            placeholder="Buscar lead"
          />
        </div>
        <div className="grid min-w-0 gap-2 overflow-y-auto pr-1">
          {leads.map((lead) => (
            <button
              className={cn(
                'block w-full min-w-0 overflow-hidden rounded-lg border p-3 text-left transition',
                selectedLead.id === lead.id ? 'border-blue-500 bg-blue-50' : 'border-stone-200 bg-white hover:bg-stone-50',
              )}
              key={lead.id}
              type="button"
              onClick={() => setSelectedLeadId(lead.id)}
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <strong className="min-w-0 truncate text-sm">{lead.name}</strong>
                {lead.owner === 'IA' ? <Bot size={15} className="shrink-0 text-blue-600" /> : <UserRoundCheck size={15} className="shrink-0" />}
              </div>
              <p className="mt-1 block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-500">
                {lead.messages.at(-1)?.text}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <section className="grid min-h-[calc(100vh-210px)] min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-slate-200 bg-[#f1eadf] shadow-sm">
        <header className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white p-4">
          <div>
            <p className="text-xs font-black uppercase text-blue-600">WhatsApp comercial</p>
            <h3 className="text-xl font-black">{selectedLead.name}</h3>
          </div>
          <button
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-bold',
              selectedLead.owner === 'IA' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800',
            )}
            type="button"
            onClick={() => updateLead(selectedLead.id, { owner: selectedLead.owner === 'IA' ? 'Asesor' : 'IA' })}
          >
            {selectedLead.owner === 'IA' ? <Bot size={16} /> : <UserRoundCheck size={16} />}
            {selectedLead.owner}
          </button>
        </header>

        <div className="flex w-full min-w-0 flex-col gap-3 overflow-y-auto p-4">
          {selectedLead.messages.map((message, index) => (
            <div
              className={cn(
                'max-w-[min(76%,620px)] rounded-lg px-3 py-2 text-sm leading-6 shadow-sm',
                message.from === 'agent' ? 'ml-auto bg-[#d7f7dc]' : 'mr-auto bg-white',
              )}
              key={`${message.time}-${index}`}
            >
              <p className="break-words">{message.text}</p>
              <span className="mt-1 block text-[11px] font-bold text-slate-400">{message.time}</span>
            </div>
          ))}
        </div>

        <footer className="min-w-0 border-t border-slate-200 bg-white p-3">
          <div className="mb-2 flex w-full flex-wrap gap-2">
            <button
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-xs font-bold"
              type="button"
              onClick={() => setDraft(generateReply(selectedLead))}
            >
              <Sparkles size={15} />
              Sugerir respuesta
            </button>
          </div>
          <div className="flex w-full min-w-0 gap-2">
            <input
              className="h-11 min-w-0 flex-1 rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-blue-500"
              value={draft}
              placeholder="Escribí una respuesta..."
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage()
              }}
            />
            <button
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
              type="button"
              onClick={sendMessage}
            >
              <Send size={16} />
              Enviar
            </button>
          </div>
        </footer>
      </section>

      <aside className="min-h-[calc(100vh-210px)] min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm 2xl:w-80 2xl:shrink-0">
        <p className="text-xs font-black uppercase text-blue-600">Propiedades para ofertar</p>
        <h3 className="mt-1 text-lg font-black">Según este chat</h3>
        <div className="mt-4 grid gap-3 overflow-y-auto pr-1">
          {properties.map((property) => (
            <button
              className="block w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
              key={property.id}
              type="button"
              onClick={() =>
                setDraft(
                  `Te comparto ${property.title}: ${property.price}. Encaja bien con lo que venimos hablando.`,
                )
              }
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <strong className="min-w-0 truncate text-sm">{property.title}</strong>
                <span className="shrink-0 rounded-full bg-blue-100 px-2 py-1 text-[11px] font-black text-blue-700">
                  {property.match}%
                </span>
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

    </section>
  )
}

function Properties({ query, setQuery, properties, selectedLead }) {
  return (
    <section className="mt-6 grid gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-blue-600">Inventario conectado</p>
          <h3 className="text-2xl font-black">Propiedades para recomendar</h3>
          <p className="mt-1 text-sm text-slate-500">Match actual contra {selectedLead?.name || 'el lead seleccionado'}.</p>
        </div>
        <div className="relative md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="h-11 w-full rounded-lg border border-stone-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            value={query}
            placeholder="Barrio, precio, etiqueta..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard property={property} key={property.id} />
        ))}
      </div>
    </section>
  )
}

function Agenda({ leads }) {
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

function BrandSettings({ agency, setAgency, logo, handleLogoUpload, botSchedule, setBotSchedule }) {
  function toggleDay(day) {
    setBotSchedule((current) => {
      const nextDays = current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day]

      return { ...current, days: nextDays }
    })
  }

  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase text-blue-600">Configuración de demo</p>
        <h3 className="text-2xl font-black">Marca de la inmobiliaria</h3>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Nombre comercial</span>
            <input
              className="h-11 rounded-lg border border-stone-300 px-3 outline-none focus:border-blue-500"
              value={agency}
              onChange={(event) => setAgency(event.target.value)}
            />
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white text-blue-600">
              <Upload size={18} />
            </span>
            <span>
              <strong className="block">Subir logo</strong>
              <small className="text-slate-500">Se guarda localmente para mostrar la demo personalizada.</small>
            </span>
            <input className="hidden" type="file" accept="image/*" onChange={handleLogoUpload} />
          </label>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-blue-600">Respuesta automática</p>
              <h3 className="mt-1 text-2xl font-black">Horarios del bot</h3>
              <p className="mt-1 text-sm text-slate-500">
                Define cuándo la IA responde sin esperar a un asesor.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold">
              <input
                checked={botSchedule.enabled}
                className="size-4 accent-blue-600"
                type="checkbox"
                onChange={(event) =>
                  setBotSchedule((current) => ({ ...current, enabled: event.target.checked }))
                }
              />
              Activo
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Desde</span>
              <input
                className="h-11 rounded-lg border border-stone-300 px-3 outline-none focus:border-blue-500"
                type="time"
                value={botSchedule.start}
                onChange={(event) =>
                  setBotSchedule((current) => ({ ...current, start: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">Hasta</span>
              <input
                className="h-11 rounded-lg border border-stone-300 px-3 outline-none focus:border-blue-500"
                type="time"
                value={botSchedule.end}
                onChange={(event) =>
                  setBotSchedule((current) => ({ ...current, end: event.target.value }))
                }
              />
            </label>
          </div>

          <div className="mt-4">
            <p className="text-sm font-bold">Días activos</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const active = botSchedule.days.includes(day)
                return (
                  <button
                    className={cn(
                      'h-9 rounded-lg border px-3 text-sm font-bold transition',
                      active
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50',
                    )}
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <aside className="rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
        <p className="text-xs font-black uppercase text-blue-600">Preview</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-2xl font-black text-blue-600">
            {logo ? <img src={logo} alt="Logo cargado" className="h-full w-full object-contain p-2" /> : 'P'}
          </div>
          <div>
            <h4 className="text-2xl font-black">{agency || 'Peitho Realty'}</h4>
            <p className="text-sm text-slate-500">CRM + agente comercial</p>
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Bot size={17} />
            <p className="text-xs font-black uppercase">Bot automático</p>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-900">
            {botSchedule.enabled ? 'Activo' : 'Pausado'} de {botSchedule.start} a {botSchedule.end}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {botSchedule.days.length ? botSchedule.days.join(', ') : 'Sin días seleccionados'}
          </p>
        </div>
      </aside>
    </section>
  )
}

function PropertyCard({ property, compact = false }) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className={cn('relative bg-stone-200', compact ? 'h-32' : 'h-44')}>
        <img className="h-full w-full object-cover" src={property.image} alt={property.title} />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-xs font-black text-blue-700">
          {property.match}% match
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-black leading-tight">{property.title}</h4>
          <CheckCircle2 className="shrink-0 text-blue-600" size={18} />
        </div>
        <p className="mt-2 text-sm font-black text-slate-900">{property.price}</p>
        <p className="mt-1 text-sm text-slate-500">{property.status}</p>
        {!compact && (
          <div className="mt-3 flex flex-wrap gap-1">
            {property.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function Score({ score }) {
  return (
    <span className={cn('rounded-full px-2 py-1 text-xs font-black ring-1', scoreTone(score))}>
      {score}
    </span>
  )
}

function Badge({ children }) {
  return <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-bold text-slate-600">{children}</span>
}

function FeatureLine({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2 text-slate-700">
      <CheckCircle2 size={16} className="text-blue-600" />
      <span>{text}</span>
    </div>
  )
}

export default App
