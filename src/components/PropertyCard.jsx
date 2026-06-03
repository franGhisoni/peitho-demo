import { CheckCircle2 } from 'lucide-react'
import { cn } from '../lib/helpers'
import { Badge } from './ui/Badge'

export function PropertyCard({ property, compact = false }) {
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
