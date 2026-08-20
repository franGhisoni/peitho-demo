import { useMemo, useState } from 'react'
import {
  BarChart3, Check, ChevronRight, CircleDollarSign, Download,
  FileImage, FileText, MapPin, Search, Ticket, Users, X,
} from 'lucide-react'
import { cn } from '../lib/helpers'
import { GUARD_ATTENDANCE_STORAGE_KEY } from '../data/guardAppData'

const eventOperations = {
  aurora: {
    venue: 'Hipódromo de Palermo', date: '15 ago 2026', total: 1400,
    sectors: [
      { name: 'Campo general', capacity: 900, available: 240, sold: 660, price: '$48.000', tone: 'bg-violet-500' },
      { name: 'Campo VIP', capacity: 350, available: 18, sold: 332, price: '$96.000', tone: 'bg-fuchsia-500' },
      { name: 'Backstage', capacity: 150, available: 0, sold: 150, price: '$180.000', tone: 'bg-amber-500' },
    ],
    sales: [
      { id: 'EV-2981', date: '14 ago · 18:42', buyer: 'Bruno Méndez', sector: 'Campo general', quantity: 1, total: '$48.000', method: 'Visa ••42', status: 'Aprobado', proof: null },
      { id: 'EV-2978', date: '14 ago · 17:15', buyer: 'Lucía Romano', sector: 'Campo VIP', quantity: 2, total: '$192.000', method: 'Transferencia', status: 'Acreditado', proof: 'transferencia-lucia-romano.png' },
      { id: 'EV-2964', date: '13 ago · 11:08', buyer: 'Nicolás Ferrer', sector: 'Campo general', quantity: 4, total: '$192.000', method: 'Transferencia', status: 'A verificar', proof: 'comprobante-nicolas-ferrer.pdf' },
      { id: 'EV-2952', date: '12 ago · 20:31', buyer: 'Carolina Suárez', sector: 'Campo VIP', quantity: 2, total: '$192.000', method: 'Mastercard ••08', status: 'Aprobado', proof: null },
    ],
  },
  tech: {
    venue: 'Centro de Convenciones', date: '22 ago 2026', total: 500,
    sectors: [
      { name: 'Pase general', capacity: 300, available: 82, sold: 218, price: '$75.000', tone: 'bg-sky-500' },
      { name: 'Business', capacity: 140, available: 32, sold: 108, price: '$120.000', tone: 'bg-indigo-500' },
      { name: 'Full access', capacity: 60, available: 0, sold: 60, price: '$180.000', tone: 'bg-emerald-500' },
    ],
    sales: [
      { id: 'EV-2931', date: '14 ago · 16:22', buyer: 'Empresa Delta SA', sector: 'Business', quantity: 8, total: '$960.000', method: 'Transferencia', status: 'Acreditado', proof: 'transferencia-delta-sa.pdf' },
      { id: 'EV-2924', date: '14 ago · 13:06', buyer: 'Mateo Rodríguez', sector: 'Pase general', quantity: 3, total: '$225.000', method: 'Visa ••19', status: 'Aprobado', proof: null },
      { id: 'EV-2908', date: '13 ago · 09:42', buyer: 'Grupo Marea', sector: 'Business', quantity: 5, total: '$600.000', method: 'Transferencia', status: 'A verificar', proof: 'comprobante-grupo-marea.jpg' },
    ],
  },
  malbec: {
    venue: 'Puerto Madero', date: '30 ago 2026', total: 100,
    sectors: [
      { name: 'Mesa para 2', capacity: 40, available: 2, sold: 38, price: '$120.000', tone: 'bg-rose-500' },
      { name: 'Mesa para 4', capacity: 40, available: 4, sold: 36, price: '$120.000', tone: 'bg-orange-500' },
      { name: 'Barra', capacity: 20, available: 2, sold: 18, price: '$85.000', tone: 'bg-pink-500' },
    ],
    sales: [
      { id: 'EV-2871', date: '13 ago · 15:12', buyer: 'Sofía Acosta', sector: 'Mesa para 4', quantity: 4, total: '$480.000', method: 'Link de pago', status: 'Pendiente', proof: null },
      { id: 'EV-2868', date: '12 ago · 12:45', buyer: 'Federico Klein', sector: 'Mesa para 2', quantity: 2, total: '$240.000', method: 'Transferencia', status: 'Acreditado', proof: 'transferencia-federico-klein.pdf' },
    ],
  },
  jazz: {
    venue: 'Bebop Club', date: '06 sep 2026', total: 120,
    sectors: [
      { name: 'Mesa central', capacity: 40, available: 12, sold: 28, price: '$62.000', tone: 'bg-violet-500' },
      { name: 'Mesa lateral', capacity: 50, available: 26, sold: 24, price: '$62.000', tone: 'bg-blue-500' },
      { name: 'Barra', capacity: 30, available: 8, sold: 22, price: '$48.000', tone: 'bg-cyan-500' },
    ],
    sales: [
      { id: 'EV-2815', date: '12 ago · 19:03', buyer: 'Valentina Paz', sector: 'Mesa lateral', quantity: 2, total: '$124.000', method: 'Transferencia', status: 'A verificar', proof: 'comprobante-valentina-paz.jpg' },
      { id: 'EV-2809', date: '11 ago · 18:17', buyer: 'Martín Calvo', sector: 'Mesa central', quantity: 2, total: '$124.000', method: 'Visa ••71', status: 'Aprobado', proof: null },
    ],
  },
}

const statusStyles = {
  Aprobado: 'bg-emerald-50 text-emerald-700',
  Acreditado: 'bg-emerald-50 text-emerald-700',
  'A verificar': 'bg-amber-50 text-amber-700',
  Pendiente: 'bg-slate-100 text-slate-600',
}

const mockAttendees = {
  aurora: [
    { id: 'a-1', name: 'Lucía Romano', email: 'lucia.romano@mail.com', sector: 'Campo VIP', status: 'Pagado', ticket: 'PT-AURORA-0184', quantity: 2 },
    { id: 'a-2', name: 'Nicolás Ferrer', email: 'nicolas.ferrer@mail.com', sector: 'Campo general', status: 'Pagado', ticket: 'PT-AURORA-0185', quantity: 4 },
    { id: 'a-3', name: 'Carolina Suárez', email: 'carolina.suarez@mail.com', sector: 'Campo VIP', status: 'Pagado', ticket: 'PT-AURORA-0186', quantity: 2 },
  ],
  tech: [
    { id: 't-1', name: 'Empresa Delta SA', email: 'eventos@delta.com', sector: 'Business', status: 'Pagado', ticket: 'PT-TECH-0411', quantity: 8 },
    { id: 't-2', name: 'Grupo Marea', email: 'compras@grupomarea.com', sector: 'Business', status: 'Pagado', ticket: 'PT-TECH-0412', quantity: 5 },
    { id: 't-3', name: 'Ana Belén Torres', email: 'ana.torres@mail.com', sector: 'Pase general', status: 'Pagado', ticket: 'PT-TECH-0413', quantity: 1 },
  ],
  malbec: [
    { id: 'm-1', name: 'Federico Klein', email: 'federico.klein@mail.com', sector: 'Mesa para 2', status: 'Pagado', ticket: 'PT-MALBEC-0071', quantity: 2 },
    { id: 'm-2', name: 'Julieta Acuña', email: 'julieta.acuna@mail.com', sector: 'Mesa para 4', status: 'Pagado', ticket: 'PT-MALBEC-0072', quantity: 4 },
    { id: 'm-3', name: 'Ramiro Benítez', email: 'ramiro.benitez@mail.com', sector: 'Barra', status: 'Pagado', ticket: 'PT-MALBEC-0073', quantity: 1 },
  ],
  jazz: [
    { id: 'j-1', name: 'Martín Calvo', email: 'martin.calvo@mail.com', sector: 'Mesa central', status: 'Pagado', ticket: 'PT-JAZZ-0032', quantity: 2 },
    { id: 'j-2', name: 'Paula Giménez', email: 'paula.gimenez@mail.com', sector: 'Mesa lateral', status: 'Pagado', ticket: 'PT-JAZZ-0033', quantity: 2 },
    { id: 'j-3', name: 'Emilia Sosa', email: 'emilia.sosa@mail.com', sector: 'Barra', status: 'Pagado', ticket: 'PT-JAZZ-0034', quantity: 1 },
  ],
}

export function EventsOperations({ demo, leads }) {
  const [eventId, setEventId] = useState('aurora')
  const [view, setView] = useState('overview')
  const [query, setQuery] = useState('')
  const [proof, setProof] = useState(null)
  const [ticket, setTicket] = useState(null)
  const [attended, setAttended] = useState([])
  const event = eventOperations[eventId]
  const item = demo.items.find((candidate) => candidate.id === eventId)
  const eventLeads = useMemo(() => leads.filter((lead) => lead.itemId === eventId), [eventId, leads])
  const attendeeRows = useMemo(() => {
    const sharedAttended = readGuardAttendees(eventId)
    const fromLeads = eventLeads.map((lead, index) => ({
      id: lead.id, name: lead.name, email: `${lead.name.toLowerCase().replaceAll(' ', '.')}@mail.com`,
      sector: lead.tags?.find((tag) => tag.toLowerCase().includes('vip')) ? 'Campo VIP' : event.sectors[index % event.sectors.length].name,
      status: lead.stage === 'pagado' ? 'Pagado' : lead.stage === 'checkout' ? 'Pago pendiente' : lead.stage === 'descartado' ? 'No asiste' : 'Interesado',
      ticket: lead.stage === 'pagado' ? `PT-${eventId.toUpperCase()}-${String(index + 184).padStart(4, '0')}` : 'Sin emitir',
      quantity: lead.intent.match(/\d+/)?.[0] || '1',
      sharedAttended: sharedAttended.has(lead.name),
    }))
    return [...fromLeads, ...mockAttendees[eventId].map((row) => ({ ...row, sharedAttended: sharedAttended.has(row.name) }))].filter((row) => `${row.name} ${row.email} ${row.sector} ${row.status}`.toLowerCase().includes(query.toLowerCase()))
  }, [eventId, event, eventLeads, query])
  const sold = event.sectors.reduce((sum, sector) => sum + sector.sold, 0)
  const available = event.total - sold
  const revenue = item?.revenue || '$0'

  function switchEvent(nextId) {
    setEventId(nextId)
    setView('overview')
    setQuery('')
  }

  return <section className="mt-7 grid gap-5">
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between">
      <div><p className="accent-text text-xs font-black uppercase">Operación por evento</p><h2 className="mt-1 text-2xl font-black">Ventas, asistentes y accesos</h2><p className="mt-1 text-sm text-slate-500">Elegí un evento para ver cada estado y operación en detalle.</p></div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">{demo.items.map((candidate) => <button key={candidate.id} onClick={() => switchEvent(candidate.id)} className={cn('min-w-[180px] rounded-xl border px-3 py-2 text-left transition', eventId === candidate.id ? 'accent-border accent-soft' : 'border-slate-200 hover:bg-slate-50')}><strong className="block truncate text-xs">{candidate.title}</strong><span className="mt-1 block text-[10px] font-bold text-slate-500">{candidate.change} · {candidate.stock}</span></button>)}</div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><OperationMetric icon={Ticket} label="Entradas vendidas" value={sold.toLocaleString('es-AR')} detail={`${Math.round((sold / event.total) * 100)}% del cupo total`} /><OperationMetric icon={CircleDollarSign} label="Total facturado" value={revenue} detail={`${event.sales.length} operaciones en historial`} /><OperationMetric icon={Users} label="Espacio disponible" value={available.toLocaleString('es-AR')} detail={`de ${event.total.toLocaleString('es-AR')} lugares`} /><OperationMetric icon={MapPin} label="Venue y fecha" value={event.date} detail={event.venue} /></div>

    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-1"><ViewButton active={view === 'overview'} onClick={() => setView('overview')}>Resumen del evento</ViewButton><ViewButton active={view === 'attendees'} onClick={() => setView('attendees')}>Asistentes y sectores</ViewButton><ViewButton active={view === 'sales'} onClick={() => setView('sales')}>Historial de ventas</ViewButton></div>
    {view === 'overview' && <Overview event={event} item={item} eventLeads={eventLeads} onView={setView} />}
    {view === 'attendees' && <Attendees event={event} rows={attendeeRows} query={query} onQuery={setQuery} attended={attended} onOpenTicket={setTicket} onToggleAttendance={(id) => setAttended((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id])} />}
    {view === 'sales' && <SalesHistory sales={event.sales} onProof={setProof} onOpenTicket={setTicket} />}
    {proof && <ProofModal sale={proof} onClose={() => setProof(null)} />}
    {ticket && <TicketModal ticket={ticket} event={item} onClose={() => setTicket(null)} />}
  </section>
}

function Overview({ event, item, eventLeads, onView }) {
  return <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="accent-text text-xs font-black uppercase">Ficha del evento</p><h3 className="mt-1 text-xl font-black">{item?.title}</h3><p className="mt-1 text-sm text-slate-500">{event.venue} · {event.date}</p></div><button className="accent-button rounded-xl px-3 py-2 text-xs font-black" onClick={() => onView('attendees')}>Ver asistentes <ChevronRight size={14} className="inline" /></button></div><div className="mt-5 grid gap-3 md:grid-cols-3">{event.sectors.map((sector) => <div key={sector.name} className="rounded-xl border border-slate-100 p-3"><div className="flex items-center justify-between gap-2"><strong className="text-sm">{sector.name}</strong><span className="text-xs font-black text-slate-500">{sector.available} libres</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={cn('h-full rounded-full', sector.tone)} style={{ width: `${(sector.sold / sector.capacity) * 100}%` }} /></div><div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400"><span>{sector.sold} vendidos</span><span>{sector.capacity} cupos</span></div><p className="mt-3 text-xs font-black">{sector.price} <span className="font-normal text-slate-400">por entrada</span></p></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-[#101828] p-5 text-white shadow-sm"><div className="flex items-center gap-2"><BarChart3 size={17} className="text-violet-300" /><p className="text-xs font-black uppercase tracking-wide text-violet-300">Estado de clientes</p></div><div className="mt-5 grid gap-3">{['Pagados', 'Checkout abierto', 'Interesados', 'No asisten'].map((label, index) => { const count = [eventLeads.filter((lead) => lead.stage === 'pagado').length, eventLeads.filter((lead) => lead.stage === 'checkout').length, eventLeads.filter((lead) => lead.stage === 'interesado' || lead.stage === 'consulta').length, eventLeads.filter((lead) => lead.stage === 'descartado').length][index]; return <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.05] p-3"><span className="text-sm text-slate-300">{label}</span><strong className="text-xl">{count}</strong></div> })}</div><button onClick={() => onView('sales')} className="mt-5 text-xs font-black text-violet-300">Abrir historial de ventas <ChevronRight size={14} className="inline" /></button></section></div>
}

function Attendees({ event, rows, query, onQuery, attended, onOpenTicket, onToggleAttendance }) {
  return <div className="grid gap-5"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="accent-text text-xs font-black uppercase">Operativo del evento</p><h3 className="mt-1 text-xl font-black">Lista de asistentes y sectores</h3></div><div className="relative md:w-80"><Search size={15} className="absolute left-3 top-3 text-slate-400" /><input value={query} onChange={(eventValue) => onQuery(eventValue.target.value)} className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none" placeholder="Buscar asistente, sector..." /></div></div><div className="mt-5 grid gap-3 md:grid-cols-3">{event.sectors.map((sector) => <div key={sector.name} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">{sector.name}</span><strong className="text-sm">{sector.available} libres</strong></div><p className="mt-2 text-xs text-slate-400">{sector.sold} vendidos · capacidad {sector.capacity}</p></div>)}</div></section><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[830px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400"><tr><th className="p-4">Asistente</th><th className="p-4">Sector</th><th className="p-4">Entradas</th><th className="p-4">Estado</th><th className="p-4">Ticket</th><th className="p-4">Acceso</th></tr></thead><tbody>{rows.map((row) => { const present = attended.includes(row.id) || row.sharedAttended; return <tr key={row.id} className="border-t border-slate-100"><td className="p-4"><strong>{row.name}</strong><span className="block text-xs text-slate-400">{row.email}</span></td><td className="p-4 font-semibold">{row.sector}</td><td className="p-4">{row.quantity}</td><td className="p-4"><span className={cn('rounded-full px-2 py-1 text-xs font-black', row.status === 'Pagado' ? 'bg-emerald-50 text-emerald-700' : row.status === 'No asiste' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700')}>{row.status}</span></td><td className="p-4">{row.ticket !== 'Sin emitir' ? <button className="accent-text text-xs font-black" onClick={() => onOpenTicket(row)}>Ver ticket <ChevronRight size={13} className="inline" /></button> : <span className="text-xs text-slate-400">Sin emitir</span>}</td><td className="p-4">{row.status === 'Pagado' ? <button className={cn('rounded-lg px-2.5 py-1.5 text-xs font-black', present ? 'bg-emerald-100 text-emerald-700' : 'border border-slate-200 hover:bg-slate-50')} onClick={() => onToggleAttendance(row.id)}>{present ? <><Check size={13} className="mr-1 inline" />Ingresó</> : 'Marcar ingreso'}</button> : <span className="text-xs text-slate-400">—</span>}</td></tr> })}</tbody></table></div></section></div>
}

function SalesHistory({ sales, onProof, onOpenTicket }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><p className="accent-text text-xs font-black uppercase">Trazabilidad financiera</p><h3 className="mt-1 text-xl font-black">Historial de ventas y pagos</h3></div><span className="accent-soft grid size-10 place-items-center rounded-xl"><CircleDollarSign size={18} /></span></div><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400"><tr><th className="p-4">Operación</th><th className="p-4">Comprador</th><th className="p-4">Sector</th><th className="p-4">Pago</th><th className="p-4">Total</th><th className="p-4">Comprobante</th><th className="p-4">Ticket</th></tr></thead><tbody>{sales.map((sale) => <tr key={sale.id} className="border-t border-slate-100"><td className="p-4"><strong>{sale.id}</strong><span className="block text-xs text-slate-400">{sale.date}</span></td><td className="p-4 font-semibold">{sale.buyer}<span className="block text-xs font-normal text-slate-400">{sale.quantity} entradas</span></td><td className="p-4">{sale.sector}</td><td className="p-4"><span className={cn('rounded-full px-2 py-1 text-xs font-black', statusStyles[sale.status])}>{sale.status}</span><span className="mt-1 block text-xs text-slate-400">{sale.method}</span></td><td className="p-4 font-black">{sale.total}</td><td className="p-4">{sale.proof ? <button className="accent-text inline-flex items-center gap-1 text-xs font-black" onClick={() => onProof(sale)}>{sale.proof.endsWith('.pdf') ? <FileText size={14} /> : <FileImage size={14} />} Ver comprobante</button> : <span className="text-xs text-slate-400">Pago online</span>}</td><td className="p-4"><button onClick={() => onOpenTicket({ id: sale.id, name: sale.buyer, sector: sale.sector, ticket: `PT-${sale.id}`, quantity: sale.quantity })} className="accent-text text-xs font-black">Abrir ticket <ChevronRight size={13} className="inline" /></button></td></tr>)}</tbody></table></div></section>
}

function ProofModal({ sale, onClose }) {
  return <Modal title="Comprobante de transferencia" onClose={onClose}><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-3"><span className="accent-soft grid size-11 place-items-center rounded-xl">{sale.proof.endsWith('.pdf') ? <FileText size={20} /> : <FileImage size={20} />}</span><div><strong className="block text-sm">{sale.proof}</strong><span className="text-xs text-slate-500">Archivo simulado · cargado por el comprador</span></div></div><div className="mt-4 grid gap-2 rounded-xl bg-white p-4 text-sm"><InfoRow label="Orden" value={sale.id} /><InfoRow label="Titular" value={sale.buyer} /><InfoRow label="Importe" value={sale.total} /><InfoRow label="Estado" value={sale.status} /></div><div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center text-xs text-slate-400"><FileText size={20} className="mr-2" />Vista previa del comprobante</div></div><button className="accent-button mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black"><Download size={14} /> Descargar comprobante</button></Modal>
}

function TicketModal({ ticket, event, onClose }) {
  return <Modal title="Ticket digital" onClose={onClose}><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="bg-[#101828] p-5 text-white"><div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[.16em] text-violet-300">Peitho Tickets</span><Ticket size={20} className="text-violet-300" /></div><h3 className="mt-4 text-xl font-black">{event?.title || 'Entrada digital'}</h3><p className="mt-1 text-sm text-slate-300">{event?.ref || 'Acceso válido para el evento'}</p></div><div className="p-5"><div className="grid grid-cols-2 gap-4"><InfoRow label="Titular" value={ticket.name} /><InfoRow label="Sector" value={ticket.sector} /><InfoRow label="Cantidad" value={ticket.quantity || 1} /><InfoRow label="Código" value={ticket.ticket} /></div><div className="mt-5 rounded-xl border border-slate-100 p-4"><Barcode code={ticket.ticket} /><p className="mt-2 text-center font-mono text-xs tracking-[.25em] text-slate-500">{ticket.ticket}</p></div><p className="mt-4 flex items-center gap-2 text-xs text-emerald-600"><Check size={15} /> Código válido · listo para escanear</p></div></div><button className="accent-button mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black"><Download size={14} /> Descargar PDF del ticket</button></Modal>
}

function Barcode({ code }) {
  const bars = Array.from(code || 'PEITHO', (character, index) => ({ width: (character.charCodeAt(0) + index) % 3 + 1, gap: index % 2 ? 2 : 1 }))
  let x = 2
  return <svg className="h-16 w-full" viewBox="0 0 320 64" role="img" aria-label="Código de barras del ticket" preserveAspectRatio="none">{bars.map((bar, index) => { const currentX = x; x += bar.width + bar.gap; return <rect key={`${bar.width}-${index}`} x={currentX} y="3" width={bar.width} height="58" fill="#0f172a" /> })}</svg>
}

function Modal({ title, onClose, children }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" onMouseDown={onClose}><div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">{title}</h2><button aria-label="Cerrar" onClick={onClose} className="grid size-8 place-items-center rounded-lg hover:bg-slate-100"><X size={17} /></button></div>{children}</div></div> }
function readGuardAttendees(eventId) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(GUARD_ATTENDANCE_STORAGE_KEY) || '{}')
    return new Set(Object.values(stored[eventId] || {}).filter((attendee) => attendee.attended).map((attendee) => attendee.name).filter(Boolean))
  } catch {
    return new Set()
  }
}
function OperationMetric({ icon: Icon, label, value, detail }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="accent-soft grid size-10 place-items-center rounded-xl"><Icon size={18} /></span><p className="mt-4 text-sm font-bold text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black tracking-tight">{value}</strong><p className="mt-1 text-xs text-slate-400">{detail}</p></article> }
function ViewButton({ active, onClick, children }) { return <button onClick={onClick} className={cn('whitespace-nowrap rounded-lg px-3 py-2 text-xs font-black', active ? 'accent-soft accent-text' : 'text-slate-500 hover:bg-slate-100')}>{children}</button> }
function InfoRow({ label, value }) { return <div><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-0.5 text-sm font-bold text-slate-700">{value}</p></div> }
