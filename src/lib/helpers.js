export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function loadJson(key, fallback) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function scoreTone(score) {
  if (score >= 88) return 'bg-rose-50 text-rose-700 ring-rose-100'
  if (score >= 75) return 'bg-amber-50 text-amber-700 ring-amber-100'
  return 'bg-sky-50 text-sky-700 ring-sky-100'
}

export function isStaleLead(lead) {
  return /dias/i.test(lead.lastContact)
}

export function buildLeadReply(lead) {
  if (!lead) return ''
  return `Hola ${lead.name.split(' ')[0]}, tengo opciones que encajan con ${lead.intent.toLowerCase()} en ${lead.area}. Te paso las mejores alternativas y, si te sirve, coordinamos visita esta semana.`
}
