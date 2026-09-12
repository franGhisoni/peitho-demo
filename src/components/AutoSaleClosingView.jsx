import { useState, useMemo } from 'react'
import {
  Car,
  Clock3,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  MessageCircle,
  Receipt,
  Search,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { cn } from '../lib/helpers'
import { exportToExcel } from '../lib/excelExport'

export function AutoSaleClosingView({
  demo,
  leads,
  sales,
  onOpenChat,
  onOpenClosingModal,
  onViewBoleto,
}) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('pending') // 'pending' or 'history'

  const salesList = useMemo(() => sales || demo.finance?.sales || [], [sales, demo.finance?.sales])

  // Leads that are ready for closing (in 'reserva', 'testdrive', or 'calificado')
  const readyLeads = useMemo(() => {
    return leads.filter((l) => l.stage === 'reserva' || l.stage === 'testdrive' || l.stage === 'calificado')
  }, [leads])

  // Filtered sales in history
  const filteredSales = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return salesList
    return salesList.filter(
      (s) =>
        s.buyer?.toLowerCase().includes(q) ||
        s.item?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q) ||
        s.agent?.toLowerCase().includes(q)
    )
  }, [salesList, query])

  function exportClosingExcel() {
    exportToExcel({
      filename: `SI_Motors_Boletos_Cierre_${new Date().toISOString().slice(0, 10)}`,
      sheets: [
        {
          name: 'Boletos de Compraventa',
          data: salesList.map((s) => ({
            'N° Boleto / Operación': s.id,
            'Fecha': s.date,
            'Comprador': s.buyer,
            'Vehículo': s.item,
            'Versión / VIN': s.reference,
            'Monto Total': s.amount,
            'Costo Salón': s.acquisition,
            'Margen Neto': s.net,
            '% Margen': s.margin,
            'Forma de Pago': s.method,
            'Asesor Responsable': s.agent,
            'Estado': s.status,
          })),
        },
        {
          name: 'Oportunidades por Cerrar',
          data: readyLeads.map((l) => ({
            'Cliente': l.name,
            'Teléfono': l.phone,
            'Vehículo': l.intent,
            'Presupuesto': l.budget,
            'Etapa': l.stage,
            'Seña / Adelanto': l.messages?.find((m) => m.transferReceipt)?.transferReceipt?.amount || 'Sin seña',
            'Permuta Declarada': l.customerProfile?.tradeInCar?.brand !== 'No entrega usado'
              ? `${l.customerProfile?.tradeInCar?.brand} ${l.customerProfile?.tradeInCar?.model}`
              : 'Sin permuta',
            'Asesor': l.owner,
          })),
        },
      ],
    })
  }

  return (
    <section className="mt-7 grid gap-6">
      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d1b2a] via-[#10243e] to-[#1e3a8a] p-6 text-white shadow-md">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-200">
                Operaciones Comerciales & Salón
              </span>
              <span className="rounded-full bg-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-300">
                Módulo Oficial
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Cierre de Ventas & Emisión de Boletos
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Estructurá el pago definitivo de cada vehículo en salón: descontá señas acreditadas, imputá usados en
              permuta y créditos prendarios, y emití el <strong>Boleto Oficial de Compraventa</strong> con firma y
              liquidación contable.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={exportClosingExcel}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-700 cursor-pointer"
            >
              <FileSpreadsheet size={16} />
              <span>Exportar Boletos a Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileCheck2 size={20} />
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800">
              Septiembre
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Boletos Emitidos en Salón</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">
            {salesList.length} operaciones
          </strong>
          <p className="mt-1 text-[11px] text-slate-400">Contratos firmados y registrados</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp size={20} />
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-black text-blue-800">
              Facturación
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Volumen Total Operado</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">
            USD 548.000+
          </strong>
          <p className="mt-1 text-[11px] text-slate-400">Promedio USD 34.200 / unidad</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={20} />
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800">
              Por Cerrar
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Listos para Cierre Inmediato</p>
          <strong className="mt-1 block text-2xl font-black text-amber-700">
            {readyLeads.length} clientes calificados
          </strong>
          <p className="mt-1 text-[11px] text-slate-400">Con seña recibida o cita de test drive</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck size={20} />
            </span>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-black text-purple-800">
              Seguridad
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Formatos Oficiales</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">
            DNRPA & COELSA
          </strong>
          <p className="mt-1 text-[11px] text-slate-400">Conciliación con bancos y peritajes</p>
        </div>
      </div>

      {/* Selector de Pestañas: Oportunidades Listas vs. Historial */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer',
              activeTab === 'pending'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            <Clock3 size={14} />
            <span>Oportunidades Listas para Cierre ({readyLeads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer',
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            <FileText size={14} />
            <span>Historial de Boletos Emitidos ({salesList.length})</span>
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-slate-400"
              placeholder="Buscar por comprador, vehículo o boleto..."
            />
          </div>
        )}
      </div>

      {/* Pestaña 1: Oportunidades Listas para Cerrar */}
      {activeTab === 'pending' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Clientes en Etapa de Reserva y Decisión
              </h3>
              <p className="text-xs text-slate-500">
                Seleccioná cualquier cliente para estructurar su pago y emitir el boleto de compraventa formal.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {readyLeads.map((lead) => {
              const related = demo.items?.find((i) => i.id === lead.itemId)
              const depositReceipt = lead.messages?.find((m) => m.transferReceipt)?.transferReceipt
              const hasTradeIn =
                lead.customerProfile?.tradeInCar &&
                lead.customerProfile.tradeInCar.brand !== 'No entrega usado'

              return (
                <article
                  key={lead.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-xs">
                          {lead.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <strong className="block text-slate-900">{lead.name}</strong>
                          <span className="text-xs text-slate-500">{lead.phone}</span>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[11px] font-black',
                          lead.stage === 'reserva'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.stage === 'testdrive'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        )}
                      >
                        {lead.stage === 'reserva'
                          ? 'Seña recibida'
                          : lead.stage === 'testdrive'
                          ? 'Test Drive agendado'
                          : 'Perfil calificado'}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Unidad de interés:</span>
                        <strong className="text-slate-900">{related?.title || lead.intent}</strong>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Presupuesto pactado:</span>
                        <strong className="text-blue-700 font-black">{lead.budget}</strong>
                      </div>
                    </div>

                    {/* Señales de Cierre (Seña y Permuta) */}
                    <div className="mt-3 space-y-1.5 text-xs">
                      {depositReceipt ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold">
                          <Receipt size={13} />
                          <span>Seña {depositReceipt.amount} ({depositReceipt.bank})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Receipt size={13} />
                          <span>Sin comprobante de seña previo</span>
                        </div>
                      )}

                      {hasTradeIn ? (
                        <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg font-bold">
                          <Car size={13} />
                          <span>
                            Entrega {lead.customerProfile.tradeInCar.brand} {lead.customerProfile.tradeInCar.model}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Car size={13} />
                          <span>Compra sin permuta de usado</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => onOpenChat && onOpenChat(lead)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>Ver Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenClosingModal && onOpenClosingModal(lead)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 text-xs font-black text-white shadow-xs transition hover:bg-emerald-700 cursor-pointer"
                    >
                      <FileCheck2 size={14} />
                      <span>Cerrar Venta</span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Pestaña 2: Historial de Boletos Emitidos */}
      {activeTab === 'history' && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h3 className="font-black text-slate-900 text-lg">Boletos de Compraventa y Operaciones Firmadas</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro legal de boletos emitidos en salón con desglose de pagos y conciliación.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4">N° Boleto / Fecha</th>
                  <th className="p-4">Comprador</th>
                  <th className="p-4">Vehículo & Versión</th>
                  <th className="p-4">Monto Pactado</th>
                  <th className="p-4">Esquema de Pagos</th>
                  <th className="p-4">Asesor</th>
                  <th className="p-4 text-right">Boleto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="transition hover:bg-slate-50/70">
                    <td className="p-4">
                      <strong className="block font-mono text-blue-700">{sale.id}</strong>
                      <span className="text-xs text-slate-400">{sale.date}</span>
                    </td>

                    <td className="p-4">
                      <strong className="block text-slate-900">{sale.buyer}</strong>
                      <span className="text-xs text-slate-400">Titular Registral</span>
                    </td>

                    <td className="p-4">
                      <strong className="block text-slate-900">{sale.item}</strong>
                      <span className="text-xs text-slate-400">{sale.reference}</span>
                    </td>

                    <td className="p-4">
                      <strong className="text-base font-black text-slate-900">{sale.amount}</strong>
                      {sale.net && (
                        <span className="block text-[11px] font-bold text-emerald-600">Neto: {sale.net}</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="block text-xs font-semibold text-slate-700 max-w-xs truncate">
                        {sale.method}
                      </span>
                      <span className="mt-0.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                        {sale.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-800 text-xs">{sale.agent}</span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => onViewBoleto && onViewBoleto(sale)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-100 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>Ver Boleto</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  )
}
