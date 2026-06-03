import { Search } from 'lucide-react'
import { PropertyCard } from '../components/PropertyCard'

export function PropertiesView({ properties, query, selectedLead, onQueryChange }) {
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
            onChange={(event) => onQueryChange(event.target.value)}
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
