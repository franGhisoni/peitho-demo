import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Barcode,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Ticket,
  UserRound,
  X,
} from 'lucide-react'
import { cn } from '../lib/helpers'
import { GUARD_ATTENDANCE_STORAGE_KEY, guardEvents } from '../data/guardAppData'

const filterOptions = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'presentes', label: 'Ingresaron' },
  { id: 'pagados', label: 'Pagados' },
]

export function GuardApp({ events = guardEvents, onExit, onAttendanceChange }) {
  const [eventId, setEventId] = useState(events[0]?.id)
  const [attendeesByEvent, setAttendeesByEvent] = useState(() => loadAttendance(events))
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('todos')
  const [scannerOpen, setScannerOpen] = useState(false)
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState(null)

  const event = events.find((candidate) => candidate.id === eventId) || events[0]
  const attendees = useMemo(() => attendeesByEvent[event?.id] || [], [attendeesByEvent, event?.id])

  const visibleAttendees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return attendees.filter((attendee) => {
      const matchesQuery = !normalizedQuery || [attendee.name, attendee.email, attendee.sector, attendee.ticket].join(' ').toLowerCase().includes(normalizedQuery)
      const matchesFilter = filter === 'todos'
        || (filter === 'pendientes' && !attendee.attended && attendee.status === 'Pagado')
        || (filter === 'presentes' && attendee.attended)
        || (filter === 'pagados' && attendee.status === 'Pagado')
      return matchesQuery && matchesFilter
    })
  }, [attendees, filter, query])

  const counters = useMemo(() => ({
    total: attendees.length,
    paid: attendees.filter((attendee) => attendee.status === 'Pagado').length,
    present: attendees.filter((attendee) => attendee.attended).length,
    pending: attendees.filter((attendee) => !attendee.attended && attendee.status === 'Pagado').length,
  }), [attendees])

  function showNotice(type, message) {
    setNotice({ type, message })
    window.setTimeout(() => setNotice(null), 4200)
  }

  function updateAttendance(attendeeId) {
    const target = attendees.find((attendee) => attendee.id === attendeeId)
    if (!target) return
    if (target.status !== 'Pagado') {
      showNotice('warning', `No se puede validar a ${target.name}: el pago todavía no está acreditado.`)
      return
    }
    const attended = !target.attended
    const nextAttendee = { ...target, attended, attendedAt: attended ? nowTime() : undefined }
    setAttendeesByEvent((current) => persistAttendance({
      ...current,
      [event.id]: current[event.id].map((attendee) => attendee.id === attendeeId ? nextAttendee : attendee),
    }))
    onAttendanceChange?.({ eventId: event.id, attendee: nextAttendee, attended })
    showNotice(target.attended ? 'neutral' : 'success', target.attended ? `Ingreso revertido para ${target.name}.` : `Ingreso confirmado para ${target.name}.`)
  }

  function scanTicket(eventValue) {
    const scannedCode = (eventValue ?? code).trim().toUpperCase()
    if (!scannedCode) return
    const target = attendees.find((attendee) => attendee.ticket.toUpperCase() === scannedCode)
    if (!target) {
      showNotice('warning', 'Código no encontrado en este evento. Revisá el evento seleccionado.')
      return
    }
    if (target.status !== 'Pagado') {
      showNotice('warning', `${target.name}: el ticket está retenido porque el pago figura como “${target.status}”.`)
      return
    }
    if (target.attended) {
      showNotice('neutral', `${target.name} ya ingresó a las ${target.attendedAt}.`)
      setCode('')
      return
    }
    const nextAttendee = { ...target, attended: true, attendedAt: nowTime() }
    setAttendeesByEvent((current) => persistAttendance({
      ...current,
      [event.id]: current[event.id].map((attendee) => attendee.id === target.id ? nextAttendee : attendee),
    }))
    onAttendanceChange?.({ eventId: event.id, attendee: nextAttendee, attended: true })
    setCode('')
    setScannerOpen(false)
    showNotice('success', `Acceso validado · ${target.name} · ${target.sector}`)
  }

  function switchEvent(nextEventId) {
    setEventId(nextEventId)
    setQuery('')
    setFilter('todos')
    setCode('')
    setNotice(null)
  }

  if (!event) return null

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {onExit ? <button onClick={onExit} aria-label="Volver" className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><ArrowLeft size={17} /></button> : null}
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white shadow-sm"><ShieldCheck size={20} /></div>
            <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.16em] text-violet-600">SI Tickets</p><h1 className="truncate text-base font-black">Control de acceso</h1></div>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-700"><i className="size-1.5 rounded-full bg-emerald-500" /> Guardia activo</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-10 pt-5 sm:px-6">
        <section className="rounded-2xl bg-[#111827] p-5 text-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.16em] text-violet-300">Evento seleccionado</p><h2 className="mt-1 truncate text-2xl font-black">{event.title}</h2><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-300"><MapPin size={13} />{event.venue} · {event.date}</p></div>
            <Ticket className="shrink-0 text-violet-300" size={24} />
          </div>
          <label className="relative mt-5 block"><span className="sr-only">Cambiar evento</span><select value={event.id} onChange={(eventValue) => switchEvent(eventValue.target.value)} className="h-11 w-full appearance-none rounded-xl border border-white/15 bg-white/10 px-3 pr-10 text-sm font-bold text-white outline-none">{events.map((candidate) => <option key={candidate.id} className="text-slate-950" value={candidate.id}>{candidate.title}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 text-slate-300" size={16} /></label>
        </section>

        {notice && <div role="status" className={cn('mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm font-bold', notice.type === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-800', notice.type === 'warning' && 'border-amber-200 bg-amber-50 text-amber-800', notice.type === 'neutral' && 'border-slate-200 bg-white text-slate-700')}><span className="mt-0.5 shrink-0">{notice.type === 'success' ? <Check size={16} /> : <CircleAlert size={16} />}</span><span className="min-w-0 flex-1">{notice.message}</span><button aria-label="Cerrar aviso" onClick={() => setNotice(null)}><X size={15} /></button></div>}

        <section className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          <Counter label="Presentes" value={counters.present} tone="emerald" />
          <Counter label="Por ingresar" value={counters.pending} tone="violet" />
          <Counter label="Pagados" value={counters.paid} tone="sky" />
          <Counter label="Tickets" value={counters.total} tone="slate" className="hidden sm:block" />
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button onClick={() => setScannerOpen((current) => !current)} className="flex w-full items-center justify-between gap-3 rounded-xl bg-violet-600 px-4 py-3 text-left text-white transition hover:bg-violet-700"><span className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-white/15"><Barcode size={20} /></span><span><strong className="block text-sm">Escanear código de barras</strong><span className="mt-0.5 block text-[11px] text-violet-100">Validá una entrada desde el celular</span></span></span><span className="text-xs font-black">{scannerOpen ? 'Cerrar' : 'Abrir'}</span></button>
          {scannerOpen && <div className="mt-3 rounded-xl border border-dashed border-violet-200 bg-violet-50 p-3"><div className="relative grid h-28 place-items-center overflow-hidden rounded-lg bg-[#1d2332]"><div className="absolute inset-x-8 top-1/2 h-px bg-violet-300 shadow-[0_0_12px_2px_rgba(196,181,253,.8)]" /><Barcode className="text-violet-200/80" size={42} /><span className="absolute bottom-2 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold text-white">Cámara simulada</span></div><form className="mt-3 flex gap-2" onSubmit={(eventValue) => { eventValue.preventDefault(); scanTicket() }}><input autoFocus value={code} onChange={(eventValue) => setCode(eventValue.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border border-violet-200 bg-white px-3 font-mono text-xs uppercase outline-none" placeholder="Ingresá PT-AUR-2981-01" /><button type="submit" className="rounded-lg bg-violet-600 px-3 text-xs font-black text-white">Validar</button></form><button type="button" onClick={() => setCode(attendees.find((attendee) => !attendee.attended && attendee.status === 'Pagado')?.ticket || '')} className="mt-2 text-[10px] font-bold text-violet-700">Usar un ticket de prueba</button></div>}
        </section>

        <section className="mt-5"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-violet-600">Lista del evento</p><h2 className="mt-1 text-xl font-black">Asistentes</h2></div><span className="text-xs font-bold text-slate-400">{visibleAttendees.length} de {attendees.length}</span></div><div className="relative mt-3"><Search className="absolute left-3 top-3 text-slate-400" size={16} /><input value={query} onChange={(eventValue) => setQuery(eventValue.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-violet-400" placeholder="Buscar por nombre, sector o código" /></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{filterOptions.map((option) => <button key={option.id} onClick={() => setFilter(option.id)} className={cn('whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-black transition', filter === option.id ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300')}>{option.label}{option.id === 'presentes' ? ` · ${counters.present}` : ''}</button>)}</div></section>

        <section className="mt-3 grid gap-2">{visibleAttendees.map((attendee) => <AttendeeCard key={attendee.id} attendee={attendee} onToggle={() => updateAttendance(attendee.id)} />)}{visibleAttendees.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No encontramos asistentes con esos filtros.</div>}</section>
        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[10px] font-bold text-slate-400"><Clock3 size={13} />Los ingresos se actualizan en la vista general en tiempo real.</p>
      </main>
    </div>
  )
}

function AttendeeCard({ attendee, onToggle }) {
  const blocked = attendee.status !== 'Pagado'
  return <article className={cn('rounded-2xl border bg-white p-4 shadow-sm', attendee.attended ? 'border-emerald-200' : 'border-slate-200')}><div className="flex items-start gap-3"><span className={cn('grid size-10 shrink-0 place-items-center rounded-full text-xs font-black', attendee.attended ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')}><UserRound size={17} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><strong className="block truncate text-sm">{attendee.name}</strong><span className="mt-0.5 block truncate text-xs text-slate-500">{attendee.email}</span></div><StatusBadge attendee={attendee} /></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs"><span><small className="block text-[9px] font-black uppercase tracking-wide text-slate-400">Sector</small><strong className="mt-0.5 block">{attendee.sector}</strong></span><span><small className="block text-[9px] font-black uppercase tracking-wide text-slate-400">Entradas</small><strong className="mt-0.5 block">{attendee.quantity}</strong></span></div><div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"><span className="font-mono text-[10px] font-bold text-slate-400">{attendee.ticket}</span><button disabled={blocked} onClick={onToggle} className={cn('rounded-lg px-3 py-2 text-xs font-black transition', attendee.attended ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : blocked ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-700')}>{attendee.attended ? <><Check size={13} className="mr-1 inline" />Ingresó {attendee.attendedAt}</> : blocked ? 'Pago retenido' : 'Marcar ingreso'}</button></div></div></div></article>
}

function StatusBadge({ attendee }) {
  const style = attendee.attended ? 'bg-emerald-50 text-emerald-700' : attendee.status === 'Pagado' ? 'bg-violet-50 text-violet-700' : attendee.status === 'No asiste' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700'
  return <span className={cn('shrink-0 rounded-full px-2 py-1 text-[10px] font-black', style)}>{attendee.attended ? 'Ingresó' : attendee.status}</span>
}

function Counter({ label, value, tone, className = '' }) {
  const tones = { emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700', violet: 'border-violet-200 bg-violet-50 text-violet-700', sky: 'border-sky-200 bg-sky-50 text-sky-700', slate: 'border-slate-200 bg-white text-slate-700' }
  return <article className={cn('rounded-xl border p-3', tones[tone], className)}><strong className="block text-xl font-black">{value}</strong><span className="mt-0.5 block text-[10px] font-black uppercase tracking-wide opacity-70">{label}</span></article>
}

function nowTime() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function loadAttendance(events) {
  let saved = {}
  try {
    saved = JSON.parse(window.localStorage.getItem(GUARD_ATTENDANCE_STORAGE_KEY) || '{}') || {}
  } catch {
    saved = {}
  }
  return Object.fromEntries(events.map((event) => [
    event.id,
    event.attendees.map((attendee) => ({
      ...attendee,
      ...(saved[event.id]?.[attendee.id] || {}),
    })),
  ]))
}

function persistAttendance(next) {
  try {
    const compact = Object.fromEntries(Object.entries(next).map(([eventId, attendees]) => [
      eventId,
      Object.fromEntries(attendees.map((attendee) => [attendee.id, { name: attendee.name, email: attendee.email, attended: attendee.attended, attendedAt: attendee.attendedAt || null }])),
    ]))
    window.localStorage.setItem(GUARD_ATTENDANCE_STORAGE_KEY, JSON.stringify(compact))
  } catch {
    // Storage can be unavailable in a private browser context; the in-memory UI still works.
  }
  return next
}
