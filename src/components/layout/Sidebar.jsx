import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Sparkles,
  Users,
  UserRoundCheck,
} from 'lucide-react'
import { cn } from '../../lib/helpers'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pipeline', label: 'Pipeline', icon: UserRoundCheck },
  { id: 'chats', label: 'Chats', icon: MessageCircle },
  { id: 'properties', label: 'Propiedades', icon: Building2 },
  { id: 'advisors', label: 'Asesores', icon: Users },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'brand', label: 'Marca', icon: Settings },
]

export function Sidebar({ agency, logo, metrics, section, onLogoClick, onSectionChange }) {
  return (
    <aside className="border-r border-slate-200 bg-white p-4 text-slate-900 lg:p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-lg font-black text-blue-600 shadow-sm">
          {logo ? <img src={logo} alt="Logo de la inmobiliaria" className="h-full w-full object-contain p-1" /> : 'P'}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-slate-500">
            <button className="font-black text-blue-600 underline-offset-4 hover:underline" type="button" onClick={onLogoClick}>
              Demo
            </button>{' '}
            inmobiliaria
          </p>
          <h1 className="truncate text-lg font-black">{agency}</h1>
        </div>
      </div>

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
              onClick={() => onSectionChange(item.id)}
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
        <h2 className="mt-2 text-lg font-black leading-tight">Detecta intención, responde y pide handoff cuando hace falta.</h2>
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
  )
}
