import { useState, useMemo } from 'react'
import {
  AlertCircle,
  Award,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck2,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Receipt,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wrench,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { cn } from '../lib/helpers'

export function AutoSalespersonPortal({
  demo,
  leads,
  items,
  sales,
  agenda,
  requests,
  initialTab = 'agenda',
  onAcceptRequest,
  onRejectRequest,
  onUpdateAgendaStatus,
  onAddAgendaItem,
  onOpenChat,
  onOpenClosingPanel,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState(initialTab) // 'agenda', 'requests', 'commissions'
  const [agendaFilter, setAgendaFilter] = useState('today') // 'today', 'tomorrow', 'week'
  const [requestsFilter, setRequestsFilter] = useState('all') // 'all', 'testdrive', 'lead'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)

  // Form states for new appointment
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newVehicle, setNewVehicle] = useState(items[0]?.title || 'Toyota Hilux SRX')
  const [newType, setNewType] = useState('testdrive') // 'testdrive', 'showroom', 'delivery'
  const [newTime, setNewTime] = useState('Hoy · 17:30 hs')
  const [newNote, setNewNote] = useState('')

  // Show transient toast
  function showToast(text, type = 'success') {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 3500)
  }

  // Filtered agenda
  const filteredAgenda = useMemo(() => {
    return (agenda || []).filter((item) => {
      const timeLower = (item.time || '').toLowerCase()
      if (agendaFilter === 'today') return timeLower.includes('hoy')
      if (agendaFilter === 'tomorrow') return timeLower.includes('mañana')
      return true // 'week'
    })
  }, [agenda, agendaFilter])

  // Filtered requests
  const pendingRequests = useMemo(() => {
    return (requests || []).filter((r) => r.status === 'Pendiente')
  }, [requests])

  const filteredRequests = useMemo(() => {
    return pendingRequests.filter((r) => {
      if (requestsFilter === 'testdrive') return r.kind === 'testdrive'
      if (requestsFilter === 'lead') return r.kind === 'lead'
      return true
    })
  }, [pendingRequests, requestsFilter])

  // Seller metrics
  const todayCount = (agenda || []).filter((a) => (a.time || '').toLowerCase().includes('hoy')).length
  const testDriveCount = (agenda || []).filter(
    (a) => a.type === 'testdrive' && (a.time || '').toLowerCase().includes('hoy')
  ).length
  const deliveryCount = (agenda || []).filter((a) => a.type === 'delivery').length
  const pendingReqCount = pendingRequests.length

  // Handle Accept
  function handleAccept(req) {
    if (onAcceptRequest) {
      onAcceptRequest(req.id)
    }
    showToast(
      req.kind === 'testdrive'
        ? `¡Test Drive confirmado con ${req.client}! Turno agendado en tu agenda.`
        : `¡Cliente ${req.client} tomado! Ya está en tus conversaciones activas.`
    )
  }

  // Handle Reject
  function handleReject(req) {
    if (onRejectRequest) {
      onRejectRequest(req.id, 'Reasignado a pool general')
    }
    showToast(`Solicitud de ${req.client} reasignada al salón de guardia.`, 'info')
  }

  // Handle Add Appointment
  function handleCreateAppointment(e) {
    e.preventDefault()
    if (!newClientName.trim()) return

    const newItem = {
      id: `ag-${Date.now()}`,
      client: newClientName,
      phone: newClientPhone || '+54 9 11 4000-0000',
      vehicle: newVehicle,
      time: newTime,
      type: newType,
      status: 'Confirmado',
      bay: newType === 'testdrive' ? 'Pista de Pruebas · Salón' : 'Salón Principal',
      note: newNote || 'Coordinado directamente con asesora',
      licenseValid: true,
      hasTradeIn: false,
    }

    if (onAddAgendaItem) {
      onAddAgendaItem(newItem)
    }

    setIsAddModalOpen(false)
    setNewClientName('')
    setNewClientPhone('')
    setNewNote('')
    showToast(`Cita con ${newItem.client} añadida a tu agenda con éxito.`)
  }

  return (
    <section className="mt-7 grid gap-6">
      {/* Notificación Toast Flotante */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-white shadow-2xl border border-slate-700">
          <div
            className={cn(
              'grid size-8 place-items-center rounded-xl font-bold text-xs',
              notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
            )}
          >
            <Check size={16} />
          </div>
          <div className="text-xs font-semibold">{notification.text}</div>
        </div>
      )}

      {/* Header del Portal de Vendedora */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                Puesto de Salón Oficial
              </span>
              <span className="rounded-full bg-blue-500/30 px-2.5 py-0.5 text-xs font-bold text-blue-200">
                Asesora: Camila Rossi
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
              Portal de Vendedora · Agenda & Salón
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Gestioná tus citas presenciales, confirmá o reasigná turnos de Test Drive, aceptá nuevos clientes
              y llevá el control de tus ventas y comisiones sin saturarte de información contable.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer',
                activeTab === 'agenda'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              )}
            >
              <CalendarCheck size={16} />
              <span>Mi Agenda ({todayCount} hoy)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={cn(
                'relative flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer',
                activeTab === 'requests'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              )}
            >
              <Clock size={16} />
              <span>Solicitudes Entrantes</span>
              {pendingReqCount > 0 && (
                <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-black text-white">
                  {pendingReqCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('commissions')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer',
                activeTab === 'commissions'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              )}
            >
              <Award size={16} />
              <span>Mis Comisiones & Metas</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards de la Asesora */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck size={20} />
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-black text-blue-800">
              Hoy
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Citas agendadas en salón</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">{todayCount} Turnos</strong>
          <p className="mt-1 text-[11px] text-slate-400">Próxima a las 15:30 hs</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Car size={20} />
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-black text-indigo-800">
              Test Drives
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Pruebas de manejo hoy</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">{testDriveCount} Programados</strong>
          <p className="mt-1 text-[11px] text-slate-400">Hilux SRX y Corolla Cross</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Clock size={20} />
            </span>
            {pendingReqCount > 0 ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-black text-rose-700 animate-pulse">
                {pendingReqCount} Pendientes
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                Al día
              </span>
            )}
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Solicitudes por Aceptar</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">{pendingReqCount} Entrantes</strong>
          <p className="mt-1 text-[11px] text-slate-400">Test drives y clientes para tomar</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={20} />
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
              Meta 67%
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Mis Ventas del Mes</p>
          <strong className="mt-1 block text-2xl font-black text-emerald-600">4 de 6 Autos</strong>
          <p className="mt-1 text-[11px] text-slate-400">Faltan 2 para desbloquear bono</p>
        </div>
      </div>

      {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}
      {activeTab === 'agenda' && (
        <section className="space-y-4">
          {/* Barra de Filtro de Agenda y Botón Nueva Cita */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAgendaFilter('today')}
                className={cn(
                  'rounded-xl px-3.5 py-2 text-xs font-black transition cursor-pointer',
                  agendaFilter === 'today'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Hoy ({todayCount})
              </button>
              <button
                onClick={() => setAgendaFilter('tomorrow')}
                className={cn(
                  'rounded-xl px-3.5 py-2 text-xs font-black transition cursor-pointer',
                  agendaFilter === 'tomorrow'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Mañana
              </button>
              <button
                onClick={() => setAgendaFilter('week')}
                className={cn(
                  'rounded-xl px-3.5 py-2 text-xs font-black transition cursor-pointer',
                  agendaFilter === 'week'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Toda la Semana ({agenda?.length || 0})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
              >
                <Plus size={15} />
                <span>Agendar Cita en Salón</span>
              </button>
            </div>
          </div>

          {/* Cronograma Horario de la Agenda */}
          {filteredAgenda.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <CalendarDays className="mx-auto size-12 text-slate-300" />
              <h3 className="mt-3 text-base font-black text-slate-800">No tenés turnos agendados en este período</h3>
              <p className="mt-1 text-xs text-slate-500">
                Podés aceptar solicitudes pendientes o agendar una nueva cita presencial.
              </p>
              <button
                onClick={() => setActiveTab('requests')}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700"
              >
                Ver Solicitudes Entrantes
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAgenda.map((item) => {
                const matchingLead = leads.find((l) => l.name === item.client || l.id === item.leadId)
                const isTestDrive = item.type === 'testdrive'
                const isDelivery = item.type === 'delivery'

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Horario y Cliente */}
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-blue-50 px-3.5 py-3 text-center border border-blue-100 min-w-[85px]">
                          <Clock size={16} className="text-blue-600 mb-1" />
                          <strong className="text-sm font-black text-blue-950">
                            {item.time.includes('·') ? item.time.split('·')[1]?.trim() : item.time}
                          </strong>
                          <span className="text-[10px] font-bold text-blue-700 uppercase">
                            {item.time.includes('·') ? item.time.split('·')[0]?.trim() : 'Turno'}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
                                isTestDrive
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : isDelivery
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              )}
                            >
                              {isTestDrive
                                ? '🚗 Test Drive Salón'
                                : isDelivery
                                ? '🎉 Entrega de 0km'
                                : '📋 Cita & Asesoramiento'}
                            </span>
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-[10px] font-bold',
                                item.status === 'Realizado'
                                  ? 'bg-slate-100 text-slate-700'
                                  : item.status === 'En Curso'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-50 text-emerald-700'
                              )}
                            >
                              {item.status}
                            </span>
                          </div>

                          <h3 className="mt-1 text-base font-black text-slate-900">{item.client}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{item.phone}</p>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-bold text-slate-800">
                              <Car size={14} className="text-blue-600" />
                              {item.vehicle}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin size={13} />
                              {item.bay || 'Salón Principal'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detalles secundarios (peritaje / notas) */}
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs max-w-md">
                        <div className="flex items-center justify-between font-bold text-slate-500 text-[11px]">
                          <span>Observación del turno:</span>
                          {item.licenseValid && (
                            <span className="flex items-center gap-1 text-emerald-700 font-black">
                              <ShieldCheck size={13} /> Licencia Validada
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-slate-700 font-medium leading-relaxed">
                          {item.note || 'Cliente puntual para prueba en pista.'}
                        </p>
                        {item.hasTradeIn && (
                          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-100/70 px-2 py-1 text-[11px] font-bold text-amber-900">
                            <Wrench size={12} />
                            <span>Entrega usado en permuta a peritar en rampa</span>
                          </div>
                        )}
                      </div>

                      {/* Botones de Acción Rápida de la Vendedora */}
                      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                        {isTestDrive && item.status !== 'Realizado' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateAgendaStatus) {
                                onUpdateAgendaStatus(
                                  item.id,
                                  item.status === 'En Curso' ? 'Realizado' : 'En Curso'
                                )
                              }
                              showToast(
                                item.status === 'En Curso'
                                  ? 'Test Drive marcado como Realizado.'
                                  : 'Test Drive en curso.'
                              )
                            }}
                            className={cn(
                              'flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition cursor-pointer',
                              item.status === 'En Curso'
                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                            )}
                          >
                            <Car size={14} />
                            <span>{item.status === 'En Curso' ? 'Finalizar Prueba' : 'Iniciar Test Drive'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (matchingLead && onOpenClosingPanel) {
                              onOpenClosingPanel(matchingLead)
                            } else if (onOpenClosingPanel) {
                              onOpenClosingPanel({ id: item.leadId || 'lead-custom', name: item.client, intent: item.vehicle })
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                        >
                          <FileCheck2 size={14} />
                          <span>Cerrar Venta</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (matchingLead && onOpenChat) {
                              onOpenChat(matchingLead)
                            } else {
                              onNavigate?.('chats')
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* PESTAÑA: SOLICITUDES ENTRANTES (Aceptar / Rechazar) */}
      {activeTab === 'requests' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-base font-black text-slate-900">Bandeja de Solicitudes Entrantes</h3>
              <p className="text-xs text-slate-500">
                Aceptá para sumar a tu agenda personal o derivá al pool de guardia del concesionario
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRequestsFilter('all')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer',
                  requestsFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Todas ({pendingRequests.length})
              </button>
              <button
                onClick={() => setRequestsFilter('testdrive')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer',
                  requestsFilter === 'testdrive'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Test Drives ({pendingRequests.filter((r) => r.kind === 'testdrive').length})
              </button>
              <button
                onClick={() => setRequestsFilter('lead')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer',
                  requestsFilter === 'lead'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Nuevos Clientes ({pendingRequests.filter((r) => r.kind === 'lead').length})
              </button>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
              <h3 className="mt-3 text-base font-black text-slate-800">¡Bandeja al día!</h3>
              <p className="mt-1 text-xs text-slate-500">
                No tenés solicitudes pendientes por aceptar o rechazar en este momento.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredRequests.map((req) => {
                const isTestDrive = req.kind === 'testdrive'

                return (
                  <article
                    key={req.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
                            isTestDrive ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                          )}
                        >
                          {isTestDrive ? '🚗 Pedido de Test Drive' : '👤 Nuevo Cliente Calificado'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{req.receivedAt || 'Recién'}</span>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-base font-black text-slate-900">{req.client}</h4>
                        <p className="text-xs text-slate-500">{req.phone} · Origen: {req.source || 'Web Concesionario'}</p>
                      </div>

                      <div className="mt-3 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">Vehículo de interés:</span>
                          <strong className="text-blue-700 font-black">{req.vehicle}</strong>
                        </div>
                        {isTestDrive && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Horario solicitado:</span>
                            <strong className="text-slate-900 font-bold">{req.requestedTime}</strong>
                          </div>
                        )}
                        {req.tradeInCar && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Entrega en permuta:</span>
                            <span className="text-amber-800 font-bold">{req.tradeInCar}</span>
                          </div>
                        )}
                        {req.budget && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Presupuesto estimado:</span>
                            <strong className="text-emerald-700 font-bold">{req.budget}</strong>
                          </div>
                        )}
                      </div>

                      {req.note && (
                        <p className="mt-3 text-xs leading-relaxed text-slate-600 bg-blue-50/50 rounded-xl p-2.5 border border-blue-100/60">
                          <span className="font-bold text-blue-900">Mensaje del cliente: </span>
                          {req.note}
                        </p>
                      )}
                    </div>

                    {/* Botones ACEPTAR o RECHAZAR */}
                    <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => handleReject(req)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition cursor-pointer"
                      >
                        <XCircle size={15} />
                        <span>Rechazar / Derivar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAccept(req)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 size={15} />
                        <span>{isTestDrive ? 'Aceptar Test Drive' : 'Tomar Cliente'}</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* PESTAÑA: MIS COMISIONES & METAS */}
      {activeTab === 'commissions' && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-amber-100/30 p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase text-amber-900">
                  <Award size={14} />
                  Plan de Comisiones de Salón
                </span>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Progreso Mensual · Camila Rossi
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Objetivo del mes: 6 unidades cerradas. Comisión base: USD 350 por usado / USD 500 por 0km.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300 bg-white p-4 text-right shadow-xs min-w-[180px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Comisiones Acumuladas</span>
                <strong className="block text-2xl font-black text-emerald-600">USD 1.850</strong>
                <span className="text-[11px] font-bold text-slate-500">4 operaciones liquidadas</span>
              </div>
            </div>

            {/* Barra de Progreso de la Meta */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Avance de Meta: 4 de 6 vehículos entregados</span>
                <span className="text-amber-800 font-black">67% alcanzado</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all" style={{ width: '67%' }} />
              </div>
              <p className="mt-2 text-xs font-bold text-slate-600">
                🎯 ¡A sólo <span className="text-amber-800 font-black">2 ventas</span> de desbloquear el bono de acelerador del +20% sobre comisiones del trimestre!
              </p>
            </div>
          </div>

          {/* Historial de Ventas Personales */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h4 className="text-base font-black text-slate-900">Mis Operaciones Liquidadas este Mes</h4>
            <p className="text-xs text-slate-500">Listado de autos cerrados con comisión asignada</p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Comprador</th>
                    <th className="pb-3">Vehículo Entregado</th>
                    <th className="pb-3">Precio Venta</th>
                    <th className="pb-3 text-right">Mi Comisión</th>
                    <th className="pb-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { date: '04 Sep', buyer: 'Martín Duhalde (AgroSur SRL)', car: 'VW Amarok V6 Extreme', price: 'USD 52.000', comm: 'USD 550', status: 'Acreditada' },
                    { date: '28 Ago', buyer: 'Valeria Castro', car: 'Peugeot 208 Feline Tiptronic', price: 'USD 17.500', comm: 'USD 400', status: 'Acreditada' },
                    { date: '19 Ago', buyer: 'Mariana Beltrán', car: 'Volkswagen Taos Highline', price: 'USD 30.900', comm: 'USD 450', status: 'Acreditada' },
                    { date: '11 Ago', buyer: 'Gonzalo Benítez', car: 'Toyota Hilux SRX 4x4', price: 'USD 42.500', comm: 'USD 450', status: 'Acreditada' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-semibold text-slate-500">{row.date}</td>
                      <td className="py-3 font-bold text-slate-900">{row.buyer}</td>
                      <td className="py-3 font-semibold text-blue-700">{row.car}</td>
                      <td className="py-3 font-bold text-slate-800">{row.price}</td>
                      <td className="py-3 text-right font-black text-emerald-600">{row.comm}</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* MODAL PARA AGENDAR NUEVA CITA EN SALÓN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Agendar Cita en Salón</h3>
                <p className="text-xs text-slate-500">Sumá una visita, test drive o peritaje a tu agenda personal</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="Ej: Marcelo Bianchi"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                    placeholder="+54 9 11 5566-7788"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Tipo de Turno</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="testdrive">Test Drive en Pista</option>
                    <option value="showroom">Cita en Salón</option>
                    <option value="delivery">Entrega de Unidad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Vehículo Asignado</label>
                <select
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
                >
                  {items.map((car) => (
                    <option key={car.id} value={car.title}>
                      {car.title} ({car.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Día y Horario</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="Ej: Hoy · 18:00 hs o Mañana · 11:30 hs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Observaciones</label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 resize-none"
                  placeholder="Detalles sobre permuta, acompañantes o requisitos..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Confirmar y Guardar en Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}