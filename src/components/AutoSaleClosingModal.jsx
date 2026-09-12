import { useState, useMemo } from 'react'
import {
  Car,
  CheckCircle2,
  Download,
  FileCheck2,
  Landmark,
  Printer,
  Receipt,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '../lib/helpers'

export function AutoSaleClosingModal({ lead, demo, onClose, onConfirmSale }) {
  if (!lead) return null

  const profile = lead.customerProfile
  const relatedItem = demo.items?.find((i) => i.id === lead.itemId)

  // Parse numeric price from lead/vehicle (e.g., "USD 42.500" -> 42500)
  const initialPrice = useMemo(() => {
    const raw = relatedItem?.price || lead.budget || 'USD 35.000'
    const clean = raw.replace(/[^\d]/g, '')
    return parseInt(clean, 10) || 35000
  }, [relatedItem, lead])

  // Acquisition cost for margin calculation
  const acquisitionCost = useMemo(() => {
    if (!relatedItem?.acquisition) return Math.round(initialPrice * 0.85)
    const clean = relatedItem.acquisition.replace(/[^\d]/g, '')
    return parseInt(clean, 10) || Math.round(initialPrice * 0.85)
  }, [relatedItem, initialPrice])

  // Look for existing transfer receipt in lead messages
  const existingReceipt = useMemo(() => {
    const m = lead.messages?.find((msg) => msg.transferReceipt)
    return m?.transferReceipt || null
  }, [lead])

  // Initial form states
  const [totalPrice, setTotalPrice] = useState(initialPrice)
  const [clientName, setClientName] = useState(lead.name)
  const [cuitDni, setCuitDni] = useState(
    existingReceipt?.cuitOrigin || (profile?.fiscal?.includes('30-') ? '30-71448821-4' : '20-28491823-3')
  )
  const [fiscalType, setFiscalType] = useState(
    profile?.fiscal?.toLowerCase().includes('factura a') ? 'Factura A (Responsable Inscripto)' : 'Consumidor Final'
  )
  const [phone, setPhone] = useState(lead.phone || '+54 9 11 4982-3310')
  const [vehicleTitle, setVehicleTitle] = useState(relatedItem?.title || lead.intent || 'Vehículo de salón')
  const [vehicleVin, setVehicleVin] = useState(`8AJBA3CD7P0${Math.floor(10000 + Math.random() * 90000)}`)
  const [vehiclePlate, setVehiclePlate] = useState('AF 892 PL')
  const [vehicleColor, setVehicleColor] = useState('Gris Indium Metalizado')

  // Payment Breakdown
  // 1. Seña
  const [includeDeposit, setIncludeDeposit] = useState(Boolean(existingReceipt || lead.stage === 'reserva'))
  const [depositAmount, setDepositAmount] = useState(existingReceipt ? 2000 : 1500)

  // 2. Permuta / Auto Usado
  const hasProfileTradeIn = profile?.tradeInCar && profile.tradeInCar.brand !== 'No entrega usado'
  const [includeTradeIn, setIncludeTradeIn] = useState(Boolean(hasProfileTradeIn))
  const [tradeInBrand, setTradeInBrand] = useState(profile?.tradeInCar?.brand || 'Ford')
  const [tradeInModel, setTradeInModel] = useState(profile?.tradeInCar?.model || 'Ranger XLT 3.2 4x4')
  const [tradeInYear, setTradeInYear] = useState(profile?.tradeInCar?.year || '2018')
  const [tradeInKm, setTradeInKm] = useState(profile?.tradeInCar?.km || '112.000 km')
  const [tradeInPlate, setTradeInPlate] = useState('AD 421 TY')
  const [tradeInValuation, setTradeInValuation] = useState(hasProfileTradeIn ? 16500 : 0)

  // 3. Crédito Prendario
  const [includeFinancing, setIncludeFinancing] = useState(
    Boolean(profile?.creditScore?.includes('pre-aprobado') || lead.payment?.toLowerCase().includes('prendario'))
  )
  const [financeBank, setFinanceBank] = useState('Banco Santander')
  const [financeAmount, setFinanceAmount] = useState(includeFinancing ? 12000 : 0)
  const [financeTerm, setFinanceTerm] = useState(24)
  const [financeRate, setFinanceRate] = useState('Tasa Fija 44% TNA')

  // 4. Saldo Contado al retiro
  const [balanceMethod, setBalanceMethod] = useState('Transferencia bancaria USD')

  // 5. Gastos de Gestoría & Transferencia
  const [expensesAmount, setExpensesAmount] = useState(650)
  const [expensesType, setExpensesType] = useState('comprador') // 'comprador' or 'bonificado'

  // Asesor y Entrega
  const [advisor, setAdvisor] = useState(lead.owner?.includes('Lucas') ? 'Lucas Benítez' : 'Camila Rossi')
  const [deliveryDate, setDeliveryDate] = useState('Jueves 17 de Septiembre · 16:00 hs')

  // Document view (after confirmation)
  const [completedBoleto, setCompletedBoleto] = useState(null)

  // Dynamic calculations
  const effectiveDeposit = includeDeposit ? Number(depositAmount) || 0 : 0
  const effectiveTradeIn = includeTradeIn ? Number(tradeInValuation) || 0 : 0
  const effectiveFinancing = includeFinancing ? Number(financeAmount) || 0 : 0
  const totalCoveredWithoutBalance = effectiveDeposit + effectiveTradeIn + effectiveFinancing
  const remainingBalance = Math.max(0, totalPrice - totalCoveredWithoutBalance)

  // Margins
  const grossMargin = totalPrice - acquisitionCost
  const netMargin = grossMargin - (expensesType === 'bonificado' ? expensesAmount : 0)
  const marginPercentage = ((netMargin / totalPrice) * 100).toFixed(1)

  // Monthly financing quote estimation
  const monthlyInstallment = useMemo(() => {
    if (!effectiveFinancing || effectiveFinancing <= 0) return 0
    const monthlyRate = 0.44 / 12
    return Math.round(
      (effectiveFinancing * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -financeTerm))
    )
  }, [effectiveFinancing, financeTerm])

  function handleFinalize() {
    const opId = `BCV-${Date.now().toString().slice(-6)}`
    const saleRecord = {
      id: opId,
      monthKey: '2026-09',
      date: 'Hoy · Recién',
      buyer: clientName,
      item: vehicleTitle,
      reference: `${vehicleColor} · VIN ${vehicleVin.slice(-6)}`,
      amount: `USD ${totalPrice.toLocaleString('es-AR')}`,
      rawAmount: totalPrice,
      acquisition: `USD ${acquisitionCost.toLocaleString('es-AR')}`,
      costs: `USD ${expensesType === 'bonificado' ? expensesAmount : 180}`,
      net: `USD ${netMargin.toLocaleString('es-AR')}`,
      margin: `${marginPercentage}%`,
      status: 'Acreditado',
      method: [
        includeDeposit ? `Seña USD ${effectiveDeposit}` : null,
        includeTradeIn ? `Permuta ${tradeInBrand} ${tradeInModel}` : null,
        includeFinancing ? `Crédito ${financeBank}` : null,
        remainingBalance > 0 ? `${balanceMethod}` : null,
      ]
        .filter(Boolean)
        .join(' + ') || 'Transferencia USD Contado',
      agent: advisor,
      receipt: `Boleto de compraventa · ${clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      details: {
        leadId: lead.id,
        cuitDni,
        fiscalType,
        phone,
        vin: vehicleVin,
        plate: vehiclePlate,
        color: vehicleColor,
        deposit: effectiveDeposit,
        tradeIn: includeTradeIn
          ? {
              description: `${tradeInBrand} ${tradeInModel} (${tradeInYear})`,
              km: tradeInKm,
              plate: tradeInPlate,
              valuation: effectiveTradeIn,
            }
          : null,
        financing: includeFinancing
          ? {
              bank: financeBank,
              amount: effectiveFinancing,
              term: financeTerm,
              monthly: monthlyInstallment,
              rate: financeRate,
            }
          : null,
        remainingBalance,
        balanceMethod,
        expensesAmount,
        expensesType,
        deliveryDate,
        createdAt: new Date().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    }

    setCompletedBoleto(saleRecord)
    if (onConfirmSale) {
      onConfirmSale(saleRecord)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-5 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-900 via-[#102038] to-blue-950 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <FileCheck2 size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">
                  SI Motors · Operación de Salón
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                  Cierre de Venta
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white">
                {completedBoleto ? 'Boleto Oficial de Compraventa Emitido' : `Cerrar Venta con ${clientName}`}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {completedBoleto ? (
            /* Vista del Boleto Emitido */
            <OfficialBoletoView boleto={completedBoleto} onClose={onClose} />
          ) : (
            /* Formulario de Cierre */
            <div className="space-y-6">
              {/* Paso 1: Datos del Comprador & Facturación */}
              <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-blue-600 text-xs font-black text-white">
                      1
                    </span>
                    <h4 className="font-black text-slate-900">Titular Comprador & Facturación</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Lead CRM: {lead.id}</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Nombre o Razón Social</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">CUIT / CUIL / DNI</label>
                    <input
                      type="text"
                      value={cuitDni}
                      onChange={(e) => setCuitDni(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Condición Fiscal</label>
                    <select
                      value={fiscalType}
                      onChange={(e) => setFiscalType(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Consumidor Final">Consumidor Final</option>
                      <option value="Factura A (Responsable Inscripto)">Factura A (Resp. Inscripto)</option>
                      <option value="Monotributo">Monotributo</option>
                      <option value="Exento">Exento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Teléfono de Contacto</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Paso 2: Vehículo & Precio Acordado */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-blue-600 text-xs font-black text-white">
                      2
                    </span>
                    <h4 className="font-black text-slate-900">Unidad & Valor Convenido de Venta</h4>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-black text-blue-800">
                    En Salón SI Motors
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500">Modelo y Versión</label>
                    <input
                      type="text"
                      value={vehicleTitle}
                      onChange={(e) => setVehicleTitle(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Color de Carrocería</label>
                    <input
                      type="text"
                      value={vehicleColor}
                      onChange={(e) => setVehicleColor(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Precio Final Convenido (USD)</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">USD</span>
                      <input
                        type="number"
                        value={totalPrice}
                        onChange={(e) => setTotalPrice(Number(e.target.value))}
                        className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-3 text-sm font-black text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 pt-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Chasis / VIN Preliminar:</span>
                    <input
                      type="text"
                      value={vehicleVin}
                      onChange={(e) => setVehicleVin(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded-lg border border-slate-200 px-2 font-mono text-[11px] text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Dominio / Patente asignada:</span>
                    <input
                      type="text"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded-lg border border-slate-200 px-2 font-mono text-[11px] text-slate-700 outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-between rounded-xl bg-slate-50 p-2 border border-slate-100">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400">Costo Concesionaria:</span>
                      <strong className="text-slate-700">USD {acquisitionCost.toLocaleString('es-AR')}</strong>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-emerald-600">Margen Bruto:</span>
                      <strong className="text-emerald-700 font-black">
                        USD {grossMargin.toLocaleString('es-AR')} ({marginPercentage}%)
                      </strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Paso 3: Estructura y Esquema de Pagos (Payment Breakdown) */}
              <section className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/40 via-white to-white p-4 sm:p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-blue-600 text-xs font-black text-white">
                      3
                    </span>
                    <h4 className="font-black text-slate-900">Estructura y Esquema de Pagos</h4>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Precio total: <strong className="text-slate-900">USD {totalPrice.toLocaleString('es-AR')}</strong>
                  </span>
                </div>

                <div className="mt-4 space-y-3.5">
                  {/* Item 1: Seña previa */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeDeposit}
                          onChange={(e) => setIncludeDeposit(e.target.checked)}
                          className="size-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                          <Receipt size={15} className="text-blue-600" />
                          Descontar Seña / Anticipo Previo ya Registrado
                        </span>
                      </label>

                      {includeDeposit && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">Monto señado:</span>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">USD</span>
                            <input
                              type="number"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(Number(e.target.value))}
                              className="h-8 w-32 rounded-lg border border-slate-200 pl-10 pr-2 text-xs font-black text-slate-900 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {includeDeposit && existingReceipt && (
                      <p className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Comprobante bancario vinculado: {existingReceipt.opNumber} (
                        {existingReceipt.bank})
                      </p>
                    )}
                  </div>

                  {/* Item 2: Usado en Permuta */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeTradeIn}
                          onChange={(e) => setIncludeTradeIn(e.target.checked)}
                          className="size-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                          <Car size={15} className="text-amber-600" />
                          Toma de Vehículo Usado en Permuta
                        </span>
                      </label>

                      {includeTradeIn && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">Tasación acordada:</span>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">USD</span>
                            <input
                              type="number"
                              value={tradeInValuation}
                              onChange={(e) => setTradeInValuation(Number(e.target.value))}
                              className="h-8 w-32 rounded-lg border border-slate-200 pl-10 pr-2 text-xs font-black text-amber-700 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {includeTradeIn && (
                      <div className="mt-3 grid gap-2.5 rounded-lg bg-amber-50/50 p-2.5 sm:grid-cols-4 text-xs border border-amber-100">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400">Marca</span>
                          <input
                            type="text"
                            value={tradeInBrand}
                            onChange={(e) => setTradeInBrand(e.target.value)}
                            className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-bold outline-none"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400">Modelo</span>
                          <input
                            type="text"
                            value={tradeInModel}
                            onChange={(e) => setTradeInModel(e.target.value)}
                            className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-bold outline-none"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400">Año / Kilometraje</span>
                          <input
                            type="text"
                            value={`${tradeInYear} · ${tradeInKm}`}
                            onChange={(e) => {
                              const parts = e.target.value.split('·')
                              setTradeInYear(parts[0]?.trim() || '')
                              setTradeInKm(parts[1]?.trim() || '')
                            }}
                            className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-bold outline-none"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400">Dominio / Patente</span>
                          <input
                            type="text"
                            value={tradeInPlate}
                            onChange={(e) => setTradeInPlate(e.target.value)}
                            className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-mono font-bold outline-none uppercase"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item 3: Crédito Prendario */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeFinancing}
                          onChange={(e) => setIncludeFinancing(e.target.checked)}
                          className="size-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                          <Landmark size={15} className="text-indigo-600" />
                          Financiación / Crédito Prendario Bancario
                        </span>
                      </label>

                      {includeFinancing && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">Monto prendario:</span>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">USD</span>
                            <input
                              type="number"
                              value={financeAmount}
                              onChange={(e) => setFinanceAmount(Number(e.target.value))}
                              className="h-8 w-32 rounded-lg border border-slate-200 pl-10 pr-2 text-xs font-black text-indigo-700 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {includeFinancing && (
                      <div className="mt-3 grid gap-2.5 rounded-lg bg-indigo-50/50 p-2.5 sm:grid-cols-3 text-xs border border-indigo-100">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400">Entidad Bancaria</span>
                          <select
                            value={financeBank}
                            onChange={(e) => setFinanceBank(e.target.value)}
                            className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-bold outline-none cursor-pointer"
                          >
                            <option value="Banco Santander">Banco Santander</option>
                            <option value="Banco Galicia">Banco Galicia</option>
                            <option value="BBVA Francés">BBVA Francés</option>
                            <option value="Banco Nación">Banco Nación</option>
                          </select>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400">Plazo en Cuotas</span>
                          <div className="mt-0.5 flex gap-1">
                            {[12, 24, 36, 48].map((term) => (
                              <button
                                key={term}
                                type="button"
                                onClick={() => setFinanceTerm(term)}
                                className={cn(
                                  'flex-1 rounded py-1 text-center font-bold text-[11px] transition cursor-pointer',
                                  financeTerm === term
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'border border-slate-200 bg-white text-slate-700'
                                )}
                              >
                                {term}m
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded bg-white p-2 border border-indigo-100">
                          <div>
                            <span className="block text-[9px] font-bold uppercase text-slate-400">
                              Cuota mensual est.:
                            </span>
                            <strong className="text-indigo-900 font-black">
                              USD {monthlyInstallment.toLocaleString('es-AR')}
                            </strong>
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold">{financeRate}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item 4: Saldo a Cancelar al Retiro */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-800">
                          Saldo Restante a Abonar en Entrega
                        </span>
                        <div className="mt-0.5 flex items-baseline gap-2">
                          <strong className="text-xl font-black text-slate-900">
                            USD {remainingBalance.toLocaleString('es-AR')}
                          </strong>
                          <span className="text-xs text-slate-500 font-medium">
                            (~${Math.round(remainingBalance * 1250).toLocaleString('es-AR')} ARS)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">Medio de pago pactado:</span>
                        <select
                          value={balanceMethod}
                          onChange={(e) => setBalanceMethod(e.target.value)}
                          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="Transferencia bancaria USD">Transferencia bancaria USD</option>
                          <option value="Transferencia bancaria ARS (Dólar MEP)">Transferencia ARS (Dólar MEP)</option>
                          <option value="Efectivo billete USD en salón">Efectivo billete USD en salón</option>
                          <option value="Cheque de pago diferido">Cheque de pago diferido</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Item 5: Gastos de Gestoría y Transferencia */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Wrench size={15} className="text-slate-500" />
                      <span className="font-bold text-slate-700">Gastos de Gestoría & Transferencia registral:</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <label className="flex items-center gap-1 text-slate-600 font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="expenses"
                            checked={expensesType === 'comprador'}
                            onChange={() => setExpensesType('comprador')}
                            className="accent-blue-600 cursor-pointer"
                          />
                          A cargo del comprador
                        </label>
                        <label className="flex items-center gap-1 text-slate-600 font-semibold cursor-pointer ml-2">
                          <input
                            type="radio"
                            name="expenses"
                            checked={expensesType === 'bonificado'}
                            onChange={() => setExpensesType('bonificado')}
                            className="accent-blue-600 cursor-pointer"
                          />
                          Bonificado por SI Motors
                        </label>
                      </div>

                      <div className="relative">
                        <span className="absolute left-2 top-1 text-[11px] font-bold text-slate-400">USD</span>
                        <input
                          type="number"
                          value={expensesAmount}
                          onChange={(e) => setExpensesAmount(Number(e.target.value))}
                          className="h-7 w-20 rounded border border-slate-200 pl-8 pr-1 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Barra de Balance Dinámico en Vivo */}
                  <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Liquidación y Cobertura Total</span>
                      <span className="text-emerald-400 font-black">
                        {totalCoveredWithoutBalance + remainingBalance === totalPrice
                          ? '100% Cubierto y Cuadrado'
                          : 'Revisar montos'}
                      </span>
                    </div>

                    <div className="mt-2.5 flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
                      {includeDeposit && effectiveDeposit > 0 && (
                        <div
                          className="bg-blue-500 transition-all"
                          style={{ width: `${(effectiveDeposit / totalPrice) * 100}%` }}
                          title={`Seña: USD ${effectiveDeposit}`}
                        />
                      )}
                      {includeTradeIn && effectiveTradeIn > 0 && (
                        <div
                          className="bg-amber-500 transition-all"
                          style={{ width: `${(effectiveTradeIn / totalPrice) * 100}%` }}
                          title={`Permuta: USD ${effectiveTradeIn}`}
                        />
                      )}
                      {includeFinancing && effectiveFinancing > 0 && (
                        <div
                          className="bg-indigo-500 transition-all"
                          style={{ width: `${(effectiveFinancing / totalPrice) * 100}%` }}
                          title={`Crédito: USD ${effectiveFinancing}`}
                        />
                      )}
                      {remainingBalance > 0 && (
                        <div
                          className="bg-emerald-500 transition-all"
                          style={{ width: `${(remainingBalance / totalPrice) * 100}%` }}
                          title={`Saldo a la entrega: USD ${remainingBalance}`}
                        />
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                      <div className="flex flex-wrap items-center gap-3">
                        {includeDeposit && (
                          <span className="flex items-center gap-1">
                            <span className="size-2 rounded-full bg-blue-500" />
                            Seña: USD {effectiveDeposit.toLocaleString('es-AR')}
                          </span>
                        )}
                        {includeTradeIn && (
                          <span className="flex items-center gap-1">
                            <span className="size-2 rounded-full bg-amber-500" />
                            Permuta: USD {effectiveTradeIn.toLocaleString('es-AR')}
                          </span>
                        )}
                        {includeFinancing && (
                          <span className="flex items-center gap-1">
                            <span className="size-2 rounded-full bg-indigo-500" />
                            Prendario: USD {effectiveFinancing.toLocaleString('es-AR')}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-bold text-white">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          Saldo retiro: USD {remainingBalance.toLocaleString('es-AR')}
                        </span>
                      </div>

                      <strong className="text-white">Total: USD {totalPrice.toLocaleString('es-AR')}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Paso 4: Asesor Comercial & Entrega */}
              <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-blue-600 text-xs font-black text-white">
                      4
                    </span>
                    <h4 className="font-black text-slate-900">Asignación & Coordinación de Entrega</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Salón Libertador</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Asesor de Salón Responsable</label>
                    <select
                      value={advisor}
                      onChange={(e) => setAdvisor(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="Lucas Benítez">Lucas Benítez (Especialista Pickups & Utilitarios)</option>
                      <option value="Camila Rossi">Camila Rossi (Especialista SUVs & Sedanes)</option>
                      <option value="Martín Ríos">Martín Ríos (Asesor Comercial Senior)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">
                      Fecha y Horario Pactado de Retiro / Entrega
                    </label>
                    <input
                      type="text"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {!completedBoleto && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:px-6">
            <div className="text-xs text-slate-500">
              Al confirmar, se emitirá el <strong>Boleto Oficial de Compraventa</strong>, se actualizará el estado del
              lead y se impactará en Finanzas.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleFinalize}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Confirmar Cierre y Emitir Boleto</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function OfficialBoletoView({ boleto, onClose }) {
  const d = boleto.details || {}

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white">
            <CheckCircle2 size={22} />
          </span>
          <div>
            <h4 className="font-black text-base">¡Operación Cerrada y Registrada con Éxito!</h4>
            <p className="text-xs text-emerald-800">
              Se generó el Boleto de Compraventa <strong>{boleto.id}</strong> y se actualizó la etapa del cliente a
              &quot;Entregado / Vendido&quot;.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
          >
            <Printer size={14} /> Imprimir
          </button>
          <button
            onClick={() => alert(`Descargando ${boleto.receipt || 'boleto.pdf'}...`)}
            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white transition hover:bg-emerald-700 cursor-pointer"
          >
            <Download size={14} /> Descargar PDF
          </button>
        </div>
      </div>

      {/* Contenedor con aspecto de Documento Oficial */}
      <div className="rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-8 font-serif shadow-sm text-slate-900">
        {/* Encabezado del Contrato */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wide text-slate-900">
              SI MOTORS S.R.L.
            </h2>
            <p className="font-sans text-xs text-slate-500">
              Concesionaria Oficial Multimarca · Av. del Libertador 4850, CABA
            </p>
            <p className="font-sans text-[11px] text-slate-500">
              CUIT: 30-71889922-1 · Inscripción D.N.R.P.A. N° 02931
            </p>
          </div>
          <div className="text-right">
            <span className="font-sans inline-block rounded-md bg-slate-900 px-3 py-1 text-xs font-black text-white uppercase tracking-wider">
              Boleto de Compraventa
            </span>
            <p className="font-mono text-xs font-bold text-slate-700 mt-1">{boleto.id}</p>
            <p className="font-sans text-[11px] text-slate-500">{d.createdAt || boleto.date}</p>
          </div>
        </div>

        {/* Cláusula Primera: Partes */}
        <div className="mt-5 space-y-4 font-sans text-xs leading-relaxed text-slate-700">
          <div>
            <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
              PRIMERA: De las Partes Contratantes
            </strong>
            <p className="mt-1">
              Entre <strong>SI MOTORS S.R.L.</strong>, en adelante &quot;La Vendedora&quot;, y por la otra parte don/doña{' '}
              <strong className="text-slate-900">{boleto.buyer}</strong>, CUIT/DNI N° <strong>{d.cuitDni || '20-28491823-3'}</strong>,
              condición fiscal <strong>{d.fiscalType || 'Consumidor Final'}</strong>, con domicilio en República Argentina y teléfono{' '}
              <strong>{d.phone || 'Registrado'}</strong>, en adelante &quot;La Parte Compradora&quot;, se conviene celebrar el presente
              Boleto de Compraventa Automotor.
            </p>
          </div>

          {/* Cláusula Segunda: Vehículo */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
              SEGUNDA: Individualización de la Unidad
            </strong>
            <div className="mt-2 grid grid-cols-2 gap-2 font-sans text-xs sm:grid-cols-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Vehículo</span>
                <strong className="text-slate-900">{boleto.item}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Color</span>
                <span className="font-bold text-slate-800">{d.color || boleto.reference || 'Gris Indium'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Chasis / VIN</span>
                <span className="font-mono font-bold text-slate-800">{d.vin || '8AJBA3CD7P091823'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Dominio Asignado</span>
                <span className="font-mono font-bold text-slate-800">{d.plate || 'AF 892 PL'}</span>
              </div>
            </div>
          </div>

          {/* Cláusula Tercera: Precio y Estructura de Pagos */}
          <div>
            <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
              TERCERA: Precio Acordado y Forma de Pago
            </strong>
            <p className="mt-1">
              El precio total y definitivo de la compraventa se fija en la suma de{' '}
              <strong className="text-slate-900 text-sm font-serif">{boleto.amount}</strong>, los cuales son y serán
              saldados según el siguiente esquema validado:
            </p>

            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-2.5">Concepto / Medio de Pago</th>
                    <th className="p-2.5">Detalle & Comprobante</th>
                    <th className="p-2.5 text-right">Monto Imputado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {d.deposit > 0 && (
                    <tr>
                      <td className="p-2.5 font-bold">Seña previa de reserva</td>
                      <td className="p-2.5 text-slate-500">Acreditada en cuenta recaudadora oficial</td>
                      <td className="p-2.5 text-right font-black text-blue-700">
                        USD {d.deposit.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  )}
                  {d.tradeIn && (
                    <tr>
                      <td className="p-2.5 font-bold">Vehículo usado en permuta</td>
                      <td className="p-2.5 text-slate-500">
                        {d.tradeIn.description} · Patente {d.tradeIn.plate} ({d.tradeIn.km})
                      </td>
                      <td className="p-2.5 text-right font-black text-amber-700">
                        USD {d.tradeIn.valuation.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  )}
                  {d.financing && (
                    <tr>
                      <td className="p-2.5 font-bold">Crédito prendario bancario</td>
                      <td className="p-2.5 text-slate-500">
                        {d.financing.bank} · {d.financing.term} cuotas fijas ({d.financing.rate})
                      </td>
                      <td className="p-2.5 text-right font-black text-indigo-700">
                        USD {d.financing.amount.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  )}
                  {d.remainingBalance > 0 && (
                    <tr>
                      <td className="p-2.5 font-bold">Saldo a cancelar en entrega</td>
                      <td className="p-2.5 text-slate-500">{d.balanceMethod || 'Transferencia bancaria USD'}</td>
                      <td className="p-2.5 text-right font-black text-emerald-700">
                        USD {d.remainingBalance.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                    <td className="p-2.5" colSpan={2}>
                      TOTAL DE LA OPERACIÓN
                    </td>
                    <td className="p-2.5 text-right text-sm">{boleto.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cláusula Cuarta: Entrega */}
          <div>
            <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
              CUARTA: De la Entrega y Transferencia
            </strong>
            <p className="mt-1">
              La unidad se entregará en las instalaciones de la Vendedora con fecha pactada:{' '}
              <strong>{d.deliveryDate || 'A coordinar en salón'}</strong>, libre de toda inhibición, prenda o gravamen, previa cancelación del
              saldo pactado y conclusión del trámite registral correspondiente.
            </p>
          </div>

          {/* Firmas */}
          <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-300 pt-6">
            <div className="text-center">
              <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-1">
                <span className="font-serif italic text-slate-600 text-[11px]">Lucas Benítez / Camila Rossi</span>
              </div>
              <p className="font-bold text-slate-900 mt-1">Por SI MOTORS S.R.L.</p>
              <p className="text-[10px] text-slate-400">Asesor: {boleto.agent}</p>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-1">
                <span className="font-serif italic text-slate-600 text-[11px]">{boleto.buyer}</span>
              </div>
              <p className="font-bold text-slate-900 mt-1">Firma del Comprador</p>
              <p className="text-[10px] text-slate-400">DNI/CUIT: {d.cuitDni || 'Validado'}</p>
            </div>
          </div>
        </div>
      </div>

      {onClose && (
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Finalizar y Volver
          </button>
        </div>
      )}
    </div>
  )
}
