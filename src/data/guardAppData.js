// Compact data used by the door-control view. Keep this payload separate from
// the component so it can be shared by the route and the event operations view.
export const GUARD_ATTENDANCE_STORAGE_KEY = 'si:guard-attendance'

export const guardEvents = [
  {
    id: 'aurora',
    title: 'Aurora Festival',
    venue: 'Hipódromo de Palermo',
    date: 'Hoy · 15 ago 2026',
    accent: 'violet',
    attendees: [
      { id: 'ga-1', name: 'Bruno Méndez', email: 'bruno.mendez@mail.com', sector: 'Campo general', quantity: 1, status: 'Pagado', ticket: 'PT-AUR-2981-01', attended: false },
      { id: 'ga-2', name: 'Lucía Romano', email: 'lucia.romano@mail.com', sector: 'Campo VIP', quantity: 2, status: 'Pagado', ticket: 'PT-AUR-2978-01', attended: true, attendedAt: '20:14' },
      { id: 'ga-3', name: 'Nicolás Ferrer', email: 'nicolas.ferrer@mail.com', sector: 'Campo general', quantity: 4, status: 'Pago a verificar', ticket: 'PT-AUR-2964-01', attended: false },
      { id: 'ga-4', name: 'Carolina Suárez', email: 'carolina.suarez@mail.com', sector: 'Campo VIP', quantity: 2, status: 'Pagado', ticket: 'PT-AUR-2952-01', attended: false },
      { id: 'ga-5', name: 'Agustina Paz', email: 'agustina.paz@mail.com', sector: 'Backstage', quantity: 1, status: 'Pagado', ticket: 'PT-AUR-2944-01', attended: false },
      { id: 'ga-6', name: 'Martín Calvo', email: 'martin.calvo@mail.com', sector: 'Campo general', quantity: 2, status: 'No asiste', ticket: 'PT-AUR-2938-01', attended: false },
    ],
  },
  {
    id: 'tech',
    title: 'Tech Future Summit',
    venue: 'Centro de Convenciones',
    date: '22 ago 2026',
    accent: 'sky',
    attendees: [
      { id: 'gt-1', name: 'Empresa Delta SA', email: 'eventos@delta.com', sector: 'Business', quantity: 8, status: 'Pagado', ticket: 'PT-TEC-2931-01', attended: false },
      { id: 'gt-2', name: 'Mateo Rodríguez', email: 'mateo.rodriguez@mail.com', sector: 'Pase general', quantity: 3, status: 'Pagado', ticket: 'PT-TEC-2924-01', attended: false },
      { id: 'gt-3', name: 'Grupo Marea', email: 'compras@grupomarea.com', sector: 'Business', quantity: 5, status: 'Pago a verificar', ticket: 'PT-TEC-2908-01', attended: false },
      { id: 'gt-4', name: 'Paula Sosa', email: 'paula.sosa@mail.com', sector: 'Full access', quantity: 1, status: 'Pagado', ticket: 'PT-TEC-2899-01', attended: true, attendedAt: '08:51' },
    ],
  },
  {
    id: 'malbec',
    title: 'Experiencia Malbec',
    venue: 'Bodega Catena Zapata',
    date: '29 ago 2026',
    accent: 'rose',
    attendees: [
      { id: 'gm-1', name: 'Sofía Acosta', email: 'sofia.acosta@mail.com', sector: 'Cata premium', quantity: 2, status: 'Pagado', ticket: 'PT-MAL-2862-01', attended: false },
      { id: 'gm-2', name: 'Valentina Cruz', email: 'valentina.cruz@mail.com', sector: 'Cata premium', quantity: 2, status: 'Pagado', ticket: 'PT-MAL-2851-01', attended: false },
      { id: 'gm-3', name: 'Diego Molina', email: 'diego.molina@mail.com', sector: 'Experiencia general', quantity: 4, status: 'Pagado', ticket: 'PT-MAL-2838-01', attended: true, attendedAt: '19:42' },
      { id: 'gm-4', name: 'Marina Torres', email: 'marina.torres@mail.com', sector: 'Experiencia general', quantity: 2, status: 'Pago a verificar', ticket: 'PT-MAL-2821-01', attended: false },
    ],
  },
  {
    id: 'jazz',
    title: 'Noche de Jazz & Cena',
    venue: 'The Jazz Club Buenos Aires',
    date: '5 sep 2026',
    accent: 'amber',
    attendees: [
      { id: 'gj-1', name: 'Renata Bianchi', email: 'renata.bianchi@mail.com', sector: 'Cena + show', quantity: 2, status: 'Pagado', ticket: 'PT-JAZ-2741-01', attended: false },
      { id: 'gj-2', name: 'Martín Calvo', email: 'martin.calvo@mail.com', sector: 'Show', quantity: 1, status: 'Pagado', ticket: 'PT-JAZ-2733-01', attended: false },
      { id: 'gj-3', name: 'Paula Sosa', email: 'paula.sosa@mail.com', sector: 'Cena + show', quantity: 4, status: 'Pago a verificar', ticket: 'PT-JAZ-2719-01', attended: false },
    ],
  },
]
