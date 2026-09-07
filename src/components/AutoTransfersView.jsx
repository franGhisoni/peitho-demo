import { useState, useMemo } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  Building,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  Filter,
  Landmark,
  MessageCircle,
  Receipt,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  WalletCards,
} from 'lucide-react'
import { cn } from '../lib/helpers'
import { exportToExcel } from '../lib/excelExport'
import { AutoTransferReceiptModal } from './AutoTransferReceiptModal'

export function AutoTransfersView({ demo, leads, transfers, onConfirmTransfer, onOpenChat }) {
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'confirmed'
  const [query, setQuery] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const transferList = transfers || demo.transfers || []

  const pendingCount = useMemo(() => {
    return transferList.filter((t) => t.status === 'Pendiente').length
  }, [transferList])

  const confirmedCount = useMemo(() => {
    return transferList.filter((t) => t.status === 'Acreditado').length
  }, [transferList])

  const filteredTransfers = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transferList.filter((t) => {
      if (filter === 'pending' && t.status !== 'Pendiente') return false
      if (filter === 'confirmed' && t.status !== 'Acreditado') return false
      if (!q) return true
      return `${t.client} ${t.vehicle} ${t.amount} ${t.bank} ${t.opNumber}`.toLowerCase().includes(q)
    })
  }, [transferList, filter, query])

  function exportTransfersExcel() {
    exportToExcel({
      filename: `SI_Motors_Conciliacion_Transferencias_${new Date().toISOString().slice(0, 10)}`,
      sheets: [
        {
          name: 'Transferencias y Señas',
          data: filteredTransfers.map((t) => ({
            'ID Transferencia': t.id,
            'N° Comprobante / COELSA': t.opNumber,
            'Fecha / Hora': t.date || t.time,
            'Cliente Emisor': t.client,
            'Vehículo Señado': t.vehicle,
            'Monto Transferido': t.amount,
            'Banco Origen': t.bank,
            'CBU / CVU Origen': t.cbuOrigin,
            'CUIT / CUIL': t.cuitOrigin || '—',
            'Concepto': t.concept,
            'Estado': t.status,
            'Cuenta Destino': t.cbuTarget || 'SI Motors SRL (Banco Galicia)',
            'Asesor Comercial': t.advisor || 'Lucas Benítez',
          })),
        },
        {
          name: 'Resumen Tesorería',
          data: [
            { 'Indicador': 'Transferencias pendientes de confirmación', 'Valor': pendingCount },
            { 'Indicador': 'Transferencias acreditadas', 'Valor': confirmedCount },
            { 'Indicador': 'Total transferencias auditadas', 'Valor': transferList.length },
          ],
        },
      ],
    })
  }

  return (
    <section className="mt-7 grid gap-6">
      {/* Modal de Comprobante si está activo */}
      {selectedReceipt && (
        <AutoTransferReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onConfirm={(id) => {
            onConfirmTransfer(id)
            setSelectedReceipt((prev) => (prev ? { ...prev, status: 'Acreditado' } : null))
          }}
        />
      )}

      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d1b2a] via-[#102a43] to-[#1e3a8a] p-6 text-white shadow-md">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-blue-500/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-200">
              Tesorería & Administración
            </span>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Control de Transferencias & Conciliación de Señas
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Verificá los comprobantes bancarios de adelantos y señas enviados por los clientes en los
              chats. Al confirmar la acreditación, el vehículo se bloquea automáticamente en inventario.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="block text-2xl font-black text-amber-400">{pendingCount}</span>
              <span className="text-[11px] font-bold text-slate-300">Por confirmar</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="block text-2xl font-black text-emerald-400">{confirmedCount}</span>
              <span className="text-[11px] font-bold text-slate-300">Acreditadas</span>
            </div>
            <button
              type="button"
              onClick={exportTransfersExcel}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-700 cursor-pointer"
              title="Descargar planilla Excel con la conciliación bancaria"
            >
              <FileSpreadsheet size={16} />
              <span>Exportar a Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={20} />
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-800">
              Urgente
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Pendientes de Confirmación</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">
            {pendingCount} transferencias
          </strong>
          <p className="mt-1 text-[11px] text-slate-400">Fondos retenidos en cuenta bancaria</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
              Efectivo
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Señas Acreditadas este Mes</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">
            USD 7.000 + $1.5M
          </strong>
          <p className="mt-1 text-[11px] text-slate-400">Total conciliado y acreditado</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Landmark size={20} />
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-black text-blue-800">
              Bancos
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Canales Recaudadores</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">Galicia · Santander</strong>
          <p className="mt-1 text-[11px] text-slate-400">+ Mercado Pago para señas inmediatas</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck size={20} />
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-black text-purple-800">
              Seguridad
            </span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Tiempo de Conciliación</p>
          <strong className="mt-1 block text-2xl font-black text-slate-900">&lt; 15 minutos</strong>
          <p className="mt-1 text-[11px] text-slate-400">Notificación automática al vendedor</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-black transition',
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            Todas ({transferList.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-black transition flex items-center gap-1.5',
              filter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100',
            )}
          >
            <Clock3 size={13} />
            Pendientes de Confirmación ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-black transition flex items-center gap-1.5',
              filter === 'confirmed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
            )}
          >
            <CheckCircle2 size={13} />
            Acreditadas ({confirmedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-slate-400"
            placeholder="Buscar por cliente, monto o banco..."
          />
        </div>
      </div>

      {/* Tabla de Transferencias */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4">Fecha / Hora</th>
                <th className="p-4">Cliente / Razón Social</th>
                <th className="p-4">Vehículo</th>
                <th className="p-4">Monto Seña</th>
                <th className="p-4">Banco & Operación</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((item) => {
                const isPending = item.status === 'Pendiente'
                const matchingLead = leads.find((l) => l.id === item.leadId || l.name === item.client)

                return (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="p-4">
                      <strong className="block text-slate-900">{item.date}</strong>
                      <span className="text-[11px] text-slate-400">{item.time}</span>
                    </td>

                    <td className="p-4">
                      <strong className="block text-slate-900">{item.client}</strong>
                      <span className="text-xs text-slate-500 font-medium">
                        Asesor: {item.advisor}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-800">{item.vehicle}</span>
                      <span className="block text-[11px] text-slate-400 truncate max-w-[200px]">
                        {item.concept}
                      </span>
                    </td>

                    <td className="p-4">
                      <strong className="text-base font-black text-slate-900">
                        {item.amount}
                      </strong>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Landmark size={14} className="text-blue-600" />
                        <span>{item.bank}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                        {item.opNumber}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black shadow-xs',
                          isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
                        )}
                      >
                        {isPending ? <Clock3 size={12} /> : <CheckCircle2 size={12} />}
                        {isPending ? 'Pendiente' : 'Acreditado'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón Ver Comprobante */}
                        <button
                          onClick={() => setSelectedReceipt(item)}
                          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                          title="Ver comprobante bancario"
                        >
                          <Eye size={13} />
                          Comprobante
                        </button>

                        {/* Botón Confirmar Acreditación si está pendiente */}
                        {isPending && onConfirmTransfer && (
                          <button
                            onClick={() => onConfirmTransfer(item.id)}
                            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white shadow-xs transition hover:bg-emerald-700"
                            title="Confirmar acreditación bancaria"
                          >
                            <CheckCircle2 size={13} />
                            Confirmar
                          </button>
                        )}

                        {/* Botón Abrir Chat */}
                        {matchingLead && onOpenChat && (
                          <button
                            onClick={() => onOpenChat(matchingLead)}
                            className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                            title="Ver conversación con el cliente"
                          >
                            <MessageCircle size={13} />
                            Chat
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
