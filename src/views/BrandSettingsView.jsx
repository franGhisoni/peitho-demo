import { Bot, Clock3, Upload } from 'lucide-react'
import { weekDays } from '../config/demoConfig'
import { cn } from '../lib/helpers'

export function BrandSettingsView({ agency, botSchedule, logo, onAgencyChange, onBotScheduleChange, onLogoUpload }) {
  function updateSchedule(patch) {
    onBotScheduleChange({ ...botSchedule, ...patch })
  }

  function toggleDay(day) {
    const days = botSchedule.days.includes(day)
      ? botSchedule.days.filter((item) => item !== day)
      : [...botSchedule.days, day]

    updateSchedule({ days })
  }

  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid gap-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase text-blue-600">Marca de la demo</p>
          <h3 className="mt-1 text-2xl font-black">Identidad comercial</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Nombre de la inmobiliaria
              <input
                className="h-11 rounded-lg border border-stone-300 px-3 text-sm font-semibold outline-none focus:border-blue-500"
                value={agency}
                onChange={(event) => onAgencyChange(event.target.value)}
              />
            </label>

            <label className="grid cursor-pointer place-items-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4 text-center text-sm font-bold text-blue-700 hover:bg-blue-100">
              <Upload size={18} />
              Cargar logo
              <input className="hidden" type="file" accept="image/*" onChange={onLogoUpload} />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-blue-600">Agente fuera de horario</p>
              <h3 className="mt-1 text-2xl font-black">Respuesta automatica</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Configura los dias y la franja en la que el bot queda activo para responder leads, pedir datos clave y derivar cuando detecta urgencia.
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold">
              <input
                checked={botSchedule.enabled}
                className="size-4 accent-blue-600"
                type="checkbox"
                onChange={(event) => updateSchedule({ enabled: event.target.checked })}
              />
              Activo
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Desde
              <input
                className="h-11 rounded-lg border border-stone-300 px-3 text-sm font-semibold outline-none focus:border-blue-500"
                type="time"
                value={botSchedule.start}
                onChange={(event) => updateSchedule({ start: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Hasta
              <input
                className="h-11 rounded-lg border border-stone-300 px-3 text-sm font-semibold outline-none focus:border-blue-500"
                type="time"
                value={botSchedule.end}
                onChange={(event) => updateSchedule({ end: event.target.value })}
              />
            </label>
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-slate-700">Dias activos</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  className={cn(
                    'h-9 rounded-lg border px-3 text-sm font-black transition',
                    botSchedule.days.includes(day)
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                  )}
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase text-blue-600">Preview operativo</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-xl font-black text-blue-600 shadow-sm">
            {logo ? <img src={logo} alt="Logo actual" className="h-full w-full object-contain p-1" /> : 'P'}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xl font-black">{agency}</h3>
            <p className="text-sm font-semibold text-slate-500">Canal comercial WhatsApp</p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Bot size={17} />
            <strong className="text-sm">Bot {botSchedule.enabled ? 'activo' : 'pausado'}</strong>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock3 size={16} className="text-blue-600" />
            {botSchedule.start} a {botSchedule.end}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dias: {botSchedule.days.length ? botSchedule.days.join(', ') : 'sin dias seleccionados'}.
          </p>
        </div>
      </aside>
    </section>
  )
}
