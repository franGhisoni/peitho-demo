import { useState } from 'react'
import {
  CalendarCheck,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
  Wrench,
} from 'lucide-react'
import { cn } from '../lib/helpers'

export function AutoTestDriveView({ demo, leads, onOpenChat }) {
  const [filter, setFilter] = useState('all') // 'all', 'tradeIn', 'today'
  const [testDrives, setTestDrives] = useState(demo.testDrives || [])

  const filteredDrives = testDrives.filter((drive) => {
    if (filter === 'tradeIn') return drive.tradeInScheduled
    if (filter === 'today') return drive.time.toLowerCase().includes('hoy')
    return true
  })

  function toggleStatus(id) {
    setTestDrives((current) =>
      current.map((td) =>
        td.id === id
          ? { ...td, status: td.status === 'Confirmado' ? 'En Curso' : td.status === 'En Curso' ? 'Realizado' : 'Confirmado' }
          : td,
      ),
    )
  }

  return (
    <section className="mt-7 grid gap-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#2563eb] p-6 text-white shadow-md">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-blue-500/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-200">
              Operación de Salón & Pista
            </span>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Agenda de Test Drive & Peritajes Mecánicos
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Coordinación de pruebas de manejo y peritajes de usados en rampa. Los clientes con cita
              presencial y licencia verificada convierten un 78% más a venta en salón.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="block text-2xl font-black text-white">{testDrives.length}</span>
              <span className="text-[11px] font-bold text-slate-300">Citas activas</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="block text-2xl font-black text-emerald-400">84%</span>
              <span className="text-[11px] font-bold text-slate-300">Asistencia salón</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck size={20} />
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">
              Hoy
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Citas coordinadas para hoy</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">1 Cita · 15:30 hs</strong>
          <p className="mt-1 text-[11px] text-slate-400">Esteban Morales · Toyota Hilux SRX</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Wrench size={20} />
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-800">
              Rampa Salón
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Peritajes de usados en parte de pago</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">2 Unidades</strong>
          <p className="mt-1 text-[11px] text-slate-400">Ranger 2018 y Cruze 2019 agendados</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck size={20} />
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-black text-indigo-800">
              Seguridad
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Verificación de Licencia de Conducir</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">3 de 4 Validadas</strong>
          <p className="mt-1 text-[11px] text-slate-400">1 pendiente de foto de DNI y carnet</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
              Cierre
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Conversión Test Drive a Seña</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">42,5%</strong>
          <p className="mt-1 text-[11px] text-slate-400">+14% respecto al mes pasado</p>
        </div>
      </div>

      {/* Filtros de la Tabla */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-black transition',
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            Todas las Citas ({testDrives.length})
          </button>
          <button
            onClick={() => setFilter('today')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-black transition',
              filter === 'today' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            Citas de Hoy
          </button>
          <button
            onClick={() => setFilter('tradeIn')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-black transition',
              filter === 'tradeIn' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            Con Peritaje de Usado
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <MapPin size={14} className="text-blue-600" />
          <span>Sucursal Central: Av. Del Libertador 4850</span>
        </div>
      </div>

      {/* Lista de Citas de Test Drive */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredDrives.map((drive) => {
          const matchingLead = leads.find((l) => l.name === drive.client)

          return (
            <article
              key={drive.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-xl bg-blue-100 font-black text-blue-700">
                      {drive.client.split(' ').map((x) => x[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">{drive.client}</h4>
                      <p className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Clock size={13} className="text-blue-600" />
                        {drive.time} · {drive.showroomBay}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(drive.id)}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-black transition',
                      drive.status === 'Realizado'
                        ? 'bg-slate-100 text-slate-700'
                        : drive.status === 'En Curso'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-700',
                    )}
                  >
                    {drive.status}
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Vehículo a Probar:</span>
                    <strong className="text-blue-700 font-black">{drive.vehicle}</strong>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-200/60 pt-2">
                    <span className="font-bold text-slate-500">Asesor a Cargo:</span>
                    <strong className="text-slate-800">{drive.advisor}</strong>
                  </div>
                </div>

                {/* Peritaje de Usado */}
                <div className="mt-3 rounded-xl border border-amber-200/60 bg-amber-50/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-900">
                      <Wrench size={13} className="text-amber-600" />
                      Peritaje en Rampa Salón
                    </span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-black',
                        drive.tradeInScheduled
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {drive.tradeInScheduled ? 'Revisión Mecánica Activa' : 'Sin Usado'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-slate-700">
                    {drive.tradeInCar}
                  </p>
                </div>

                {/* Badge de Licencia */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {drive.licenseStatus.includes('validada') ? (
                      <CheckCircle2 size={15} className="text-emerald-600" />
                    ) : (
                      <ShieldAlert size={15} className="text-amber-600" />
                    )}
                    <span className="font-semibold text-slate-600">{drive.licenseStatus}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">DNI + Registro</span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                {matchingLead && onOpenChat ? (
                  <button
                    onClick={() => onOpenChat(matchingLead)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    <MessageCircle size={14} />
                    Abrir Chat
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => toggleStatus(drive.id)}
                  className="rounded-xl bg-blue-600 py-2 text-center text-xs font-black text-white hover:bg-blue-700"
                >
                  {drive.status === 'Confirmado' ? 'Iniciar Prueba' : 'Cambiar Estado'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
