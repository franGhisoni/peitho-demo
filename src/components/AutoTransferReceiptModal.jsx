import { useState } from 'react'
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  FileCheck,
  Landmark,
  ShieldCheck,
  X,
} from 'lucide-react'
import { cn } from '../lib/helpers'

export function AutoTransferReceiptModal({ receipt, onClose, onConfirm }) {
  if (!receipt) return null

  const isPending = receipt.status === 'Pendiente'
  const isUSD = receipt.amount?.includes('USD')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header con marca del banco */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-600 font-black text-white shadow-sm">
              <Landmark size={20} />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Comprobante de Transferencia
              </span>
              <h3 className="font-black text-slate-900">{receipt.bank || 'Transferencia Bancaria'}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Voucher Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {/* Badge de Estado y Monto */}
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-5 text-center shadow-xs">
            <div className="flex justify-center">
              <span
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-xs',
                  isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
                )}
              >
                {isPending ? <Clock3 size={14} /> : <CheckCircle2 size={14} />}
                {isPending ? 'Pendiente de Conciliación Bancaria' : 'Acreditación Confirmada'}
              </span>
            </div>

            <p className="mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monto Transferido
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
              {receipt.amount}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {receipt.concept || 'Seña y reserva de unidad'}
            </p>
          </div>

          {/* Ticket Details */}
          <div className="mt-5 space-y-4 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2.5">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-bold text-slate-500">Fecha y Hora:</span>
                <strong className="text-slate-900">{receipt.date || receipt.time}</strong>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-bold text-slate-500">N° de Operación:</span>
                <span className="font-mono font-black text-blue-700">{receipt.opNumber || 'OP-982341-COELSA'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-bold text-slate-500">Vehículo Asociado:</span>
                <strong className="text-slate-900">{receipt.vehicle || 'Unidad de salón'}</strong>
              </div>

              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Tipo de Moneda:</span>
                <strong className="text-slate-900">{isUSD ? 'Dólares Estadounidenses (USD)' : 'Pesos Argentinos (ARS)'}</strong>
              </div>
            </div>

            {/* Datos del Emisor y Destino */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10px] font-black uppercase text-slate-400">Emisor (Cliente)</p>
                <strong className="mt-1 block text-slate-900 truncate">{receipt.client}</strong>
                {receipt.cuitOrigin && (
                  <span className="block text-[11px] text-slate-500 font-semibold">CUIT/CUIL: {receipt.cuitOrigin}</span>
                )}
                <span className="mt-1 block font-mono text-[10px] text-slate-500 truncate">
                  CBU: {receipt.cbuOrigin || '0070123400000012345678'}
                </span>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <p className="text-[10px] font-black uppercase text-blue-800">Destino (Concesionaria)</p>
                <strong className="mt-1 block text-slate-900">SI Motors SRL</strong>
                <span className="block text-[11px] text-slate-500 font-semibold">CUIT: 30-71889922-1</span>
                <span className="mt-1 block font-mono text-[10px] text-slate-600 truncate">
                  CBU: {receipt.cbuTarget || '0170099900000099887766'}
                </span>
              </div>
            </div>

            {/* Verificación de Seguridad Bancaria */}
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-[11px] text-emerald-900">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <strong className="block font-black">Transferencia Inmediata Red Coelsa</strong>
                <span>Comprobante digital firmado electrónicamente. Válido como recibo provisorio de reserva.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 p-4">
          <button
            onClick={() => {
              alert('Descargando comprobante oficial en formato PDF...')
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <Download size={14} />
            Descargar PDF
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
            >
              Cerrar
            </button>
            {isPending && onConfirm && (
              <button
                onClick={() => {
                  onConfirm(receipt.id)
                  onClose()
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={14} />
                Confirmar Acreditación
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
