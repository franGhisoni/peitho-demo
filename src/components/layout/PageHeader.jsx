const titles = {
  advisors: 'Equipo de asesores',
  brand: 'Configuracion de marca',
  chats: 'Conversaciones',
  pipeline: 'Tablero de leads',
  properties: 'Propiedades',
}

export function PageHeader({ section }) {
  const title = titles[section] || 'Operacion comercial inmobiliaria'

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-black uppercase text-blue-600">CRM + agente conversacional</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      </div>
    </header>
  )
}
