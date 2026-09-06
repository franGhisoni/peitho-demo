import { useState, useMemo } from 'react'
import { Calculator, CheckCircle2, ChevronRight, DollarSign, FileSpreadsheet, Sparkles } from 'lucide-react'

export function AutoFinanceSimulator({ vehicle, onApplyDraft }) {
  // Parse numeric price from "USD 27.800"
  const rawPrice = useMemo(() => {
    if (!vehicle?.price) return 25000
    const clean = vehicle.price.replace(/[^\d]/g, '')
    return parseInt(clean, 10) || 25000
  }, [vehicle])

  const [downPaymentPercent, setDownPaymentPercent] = useState(50)
  const [termMonths, setTermMonths] = useState(24)
  const [rateType, setRateType] = useState('fija') // 'fija' or 'uva'

  const calculation = useMemo(() => {
    const downPaymentAmount = Math.round(rawPrice * (downPaymentPercent / 100))
    const financedAmount = rawPrice - downPaymentAmount

    // Rates
    const annualRate = rateType === 'fija' ? 0.44 : 0.085 // 44% TNA fija o UVA + 8.5%
    const monthlyRate = annualRate / 12

    let monthlyInstallmentUsd = 0
    if (financedAmount > 0) {
      if (rateType === 'fija') {
        // French amortization formula
        monthlyInstallmentUsd = Math.round(
          (financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths)),
        )
      } else {
        // UVA simplified quota in USD
        monthlyInstallmentUsd = Math.round(financedAmount / termMonths + financedAmount * (monthlyRate / 2))
      }
    }

    // ARS estimation (approx 1 USD = 1.250 ARS)
    const monthlyInstallmentArs = Math.round(monthlyInstallmentUsd * 1250)
    const minSalaryArs = Math.round(monthlyInstallmentArs * 3.3) // Cuota máx 30% del ingreso

    return {
      downPaymentAmount,
      financedAmount,
      monthlyInstallmentUsd,
      monthlyInstallmentArs,
      minSalaryArs,
    }
  }, [rawPrice, downPaymentPercent, termMonths, rateType])

  function handleInsertToChat() {
    if (!onApplyDraft) return
    const text = `Te preparé la simulación para el ${vehicle?.title || 'vehículo'}: con un anticipo de USD ${calculation.downPaymentAmount.toLocaleString('es-AR')} (${downPaymentPercent}%), el saldo de USD ${calculation.financedAmount.toLocaleString('es-AR')} te queda en ${termMonths} cuotas ${rateType === 'fija' ? 'fijas' : 'UVA'} de aprox. USD ${calculation.monthlyInstallmentUsd.toLocaleString('es-AR')} ($${calculation.monthlyInstallmentArs.toLocaleString('es-AR')} ARS). Para calificar se requiere un ingreso demostrable familiar desde $${calculation.minSalaryArs.toLocaleString('es-AR')}. ¿Te gustaría que presentemos la solicitud bancaria?`
    onApplyDraft(text)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Calculator size={18} />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
              Herramienta de Salón
            </p>
            <h3 className="text-base font-black text-slate-900">Simulador de Crédito Prendario</h3>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
          {vehicle?.price || 'USD 25.000'}
        </span>
      </div>

      {/* Anticipo Slider */}
      <div className="mt-5">
        <div className="flex justify-between text-xs">
          <span className="font-bold text-slate-600">Anticipo o usado a entregar:</span>
          <strong className="text-blue-700">
            {downPaymentPercent}% · USD {calculation.downPaymentAmount.toLocaleString('es-AR')}
          </strong>
        </div>
        <input
          type="range"
          min="20"
          max="80"
          step="5"
          value={downPaymentPercent}
          onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
          className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
        />
        <div className="mt-1 flex justify-between text-[10px] font-semibold text-slate-400">
          <span>Min 20%</span>
          <span>50%</span>
          <span>Max 80%</span>
        </div>
      </div>

      {/* Tipo de Tasa y Plazo */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-500">Línea de crédito:</label>
          <div className="mt-1 flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
            <button
              onClick={() => setRateType('fija')}
              className={`flex-1 rounded-md py-1.5 transition ${
                rateType === 'fija' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              Tasa Fija
            </button>
            <button
              onClick={() => setRateType('uva')}
              className={`flex-1 rounded-md py-1.5 transition ${
                rateType === 'uva' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              UVA
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500">Plazo en meses:</label>
          <div className="mt-1 grid grid-cols-4 gap-1">
            {[12, 24, 36, 48].map((term) => (
              <button
                key={term}
                onClick={() => setTermMonths(term)}
                className={`rounded-lg py-1.5 text-center text-xs font-black transition ${
                  termMonths === term
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {term}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados de la Simulación */}
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Saldo a financiar</span>
            <p className="mt-0.5 text-sm font-black text-slate-900">
              USD {calculation.financedAmount.toLocaleString('es-AR')}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-600">Cuota mensual est.</span>
            <p className="mt-0.5 text-base font-black text-blue-700">
              USD {calculation.monthlyInstallmentUsd.toLocaleString('es-AR')}
            </p>
            <span className="text-[10px] font-semibold text-slate-500">
              ~${calculation.monthlyInstallmentArs.toLocaleString('es-AR')} ARS
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-blue-100/80 pt-2 text-[11px]">
          <span className="text-slate-600">Ingreso demostrable sugerido:</span>
          <strong className="text-slate-800">
            ${calculation.minSalaryArs.toLocaleString('es-AR')} ARS
          </strong>
        </div>
      </div>

      {onApplyDraft && (
        <button
          onClick={handleInsertToChat}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <Sparkles size={14} />
          Pegar simulación en la conversación
        </button>
      )}
    </div>
  )
}
