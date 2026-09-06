import {
  AlertCircle,
  Briefcase,
  Building,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  HelpCircle,
  ShieldCheck,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import { cn } from '../lib/helpers'

export function AutoCustomerProfile({ lead, item, onInsertBrief }) {
  const profile = lead?.customerProfile
  if (!profile) return null

  const isUrgent = profile.urgency?.toLowerCase().includes('inmediata')
  const requiresFacturaA = profile.fiscal?.toLowerCase().includes('factura a')

  return (
    <div className="flex flex-col gap-4">
      {/* Header del Perfil */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-black text-blue-800">
            <ShieldCheck size={13} />
            Perfil 360° del Cliente
          </span>
          <span className="text-xs font-black text-slate-400">Score: {lead.score}/100</span>
        </div>

        <div className="mt-3 flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-md shadow-blue-500/20">
            {lead.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="min-w-0">
            <h4 className="truncate font-black text-slate-900">{lead.name}</h4>
            <p className="truncate text-xs font-semibold text-slate-500">{profile.employment}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] font-black',
                  requiresFacturaA ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600',
                )}
              >
                {requiresFacturaA ? 'Requiere Factura A' : 'Consumidor Final'}
              </span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] font-black',
                  isUrgent ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
                )}
              >
                {profile.urgency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Crediticio & Situación Fiscal */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Solvencia & Crédito Prendario
        </p>
        <div className="mt-2.5 space-y-2.5 text-xs">
          <div className="flex items-start gap-2">
            <CreditCard size={15} className="mt-0.5 shrink-0 text-blue-600" />
            <div>
              <span className="font-bold text-slate-500">Aptitud crediticia:</span>
              <p className="font-semibold text-slate-800">{profile.creditScore}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText size={15} className="mt-0.5 shrink-0 text-blue-600" />
            <div>
              <span className="font-bold text-slate-500">Condición impositiva:</span>
              <p className="font-semibold text-slate-800">{profile.fiscal}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users size={15} className="mt-0.5 shrink-0 text-blue-600" />
            <div>
              <span className="font-bold text-slate-500">Toma de decisión:</span>
              <p className="font-semibold text-slate-800">{profile.decisionMakers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uso previsto del vehículo */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Uso Previsto del Vehículo
        </p>
        <div className="mt-2.5 flex items-start gap-2 text-xs">
          <Car size={15} className="mt-0.5 shrink-0 text-blue-600" />
          <div>
            <p className="font-semibold text-slate-800 leading-relaxed">{profile.intendedUse}</p>
          </div>
        </div>
      </div>

      {/* Auto actual / Ficha de Peritaje en Salón */}
      <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-900">
            Vehículo a Entregar · Peritaje
          </p>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-800">
            En Salón
          </span>
        </div>

        {profile.tradeInCar?.brand !== 'No entrega usado' ? (
          <div className="mt-2.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-black">
                {profile.tradeInCar.brand} {profile.tradeInCar.model}
              </strong>
              <span className="font-bold text-slate-500">Año {profile.tradeInCar.year}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Kilometraje:</span>
              <strong className="text-slate-800">{profile.tradeInCar.km}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              <span className="font-bold text-slate-500">Estado: </span>
              {profile.tradeInCar.condition}
            </p>
            <div className="rounded-lg border border-amber-200 bg-white p-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                <Wrench size={13} className="text-amber-600" />
                <span>{profile.tradeInCar.peritajeStatus}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">No entrega vehículo en permuta (compra directa).</p>
        )}
      </div>

      {/* Resumen Ejecutivo para el Asesor de Salón */}
      <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
            Ficha Ejecutiva · Handoff
          </span>
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-black text-blue-300">
            Para el Asesor
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-200 font-medium">
          {profile.executiveBrief}
        </p>

        {onInsertBrief && (
          <button
            onClick={() => onInsertBrief(profile.executiveBrief)}
            className="mt-3 w-full rounded-lg bg-white/10 py-1.5 text-center text-xs font-bold text-white transition hover:bg-white/20"
          >
            Copiar resumen al chat
          </button>
        )}
      </div>
    </div>
  )
}
