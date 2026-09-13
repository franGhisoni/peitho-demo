import { useState, useMemo } from 'react'
import {
  Banknote,
  Car,
  Check,
  CreditCard,
  Download,
  Eye,
  FileCheck2,
  Landmark,
  PackageCheck,
  Printer,
  Receipt,
  Search,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '../lib/helpers'

export function AutoSaleClosingPanel({
  demo,
  leads,
  items,
  sales,
  initialLeadId,
  onSaveSale,
  onOpenChat,
}) {
  const [activeTab, setActiveTab] = useState('newSale') // 'newSale' or 'savedSales'
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeadId || leads[0]?.id)
  const [selectedItemId, setSelectedItemId] = useState(() => {
    const initLead = leads.find((l) => l.id === (initialLeadId || leads[0]?.id))
    return initLead?.itemId || items[0]?.id
  })

  // Selected lead and car
  const activeLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || leads[0]
  }, [leads, selectedLeadId])

  const activeCar = useMemo(() => {
    return items.find((i) => i.id === selectedItemId) || items[0]
  }, [items, selectedItemId])

  // Parse car base price
  const basePriceNumber = useMemo(() => {
    if (!activeCar?.price) return 35000
    const clean = activeCar.price.replace(/[^\d]/g, '')
    return parseInt(clean, 10) || 35000
  }, [activeCar])

  // Form states
  // 1. Datos Comprador
  const [buyerName, setBuyerName] = useState(activeLead?.name || '')
  const [buyerDni, setBuyerDni] = useState(
    activeLead?.customerProfile?.fiscal?.includes('30-') ? '30-71448821-4' : '20-28491823-3'
  )
  const [buyerFiscal, setBuyerFiscal] = useState(
    activeLead?.customerProfile?.fiscal?.toLowerCase().includes('factura a')
      ? 'Factura A (Responsable Inscripto)'
      : 'Factura B (Consumidor Final)'
  )
  const [buyerPhone, setBuyerPhone] = useState(activeLead?.phone || '+54 9 11 4982-3310')
  const [buyerEmail, setBuyerEmail] = useState(
    `${activeLead?.name?.toLowerCase().replace(/\s+/g, '.') || 'cliente'}@gmail.com`
  )
  const [buyerAddress, setBuyerAddress] = useState('Av. Del Libertador 2450, Piso 8, CABA')
  const [buyerCivilStatus, setBuyerCivilStatus] = useState('Casado/a')
  const [buyerOccupation, setBuyerOccupation] = useState(
    activeLead?.customerProfile?.employment || 'Profesional independiente'
  )

  // 2. Datos Vehículo y Accesorios
  const [carColor, setCarColor] = useState(activeCar?.specs?.color || 'Gris Plata Metalizado')
  const [carVin, setCarVin] = useState(`8AJBA3CD7P0${Math.floor(10000 + Math.random() * 90000)}`)
  const [carEngineNum, setCarEngineNum] = useState(`1GD${Math.floor(100000 + Math.random() * 900000)}`)
  const [carPlate, setCarPlate] = useState('AF 892 PL')
  const [carYear, setCarYear] = useState('2024')
  const [finalAgreedPrice, setFinalAgreedPrice] = useState(basePriceNumber)

  // Accesorios opcionales agregados
  const [extras, setExtras] = useState({
    polarizado: true,
    kitSeguridad: true,
    tuercasSeguridad: true,
    grabadoAutopartes: true,
    garantiaExtendida: false,
  })

  // 3. Estructura de Pago 100% Completa
  // A. Transferencia bancaria
  const [hasBankTransfer, setHasBankTransfer] = useState(true)
  const [bankTransferAmount, setBankTransferAmount] = useState(15000)
  const [bankName, setBankName] = useState('Banco Galicia')
  const [bankOpNumber, setBankOpNumber] = useState(`OP-${Math.floor(100000 + Math.random() * 900000)}-COELSA`)

  // B. Efectivo / Dólares billete
  const [hasCash, setHasCash] = useState(true)
  const [cashAmount, setCashAmount] = useState(10000)

  // C. Usado en permuta
  const [hasTradeIn, setHasTradeIn] = useState(
    Boolean(activeLead?.customerProfile?.tradeInCar && activeLead.customerProfile.tradeInCar.brand !== 'No entrega usado')
  )
  const [tradeInBrand, setTradeInBrand] = useState(activeLead?.customerProfile?.tradeInCar?.brand || 'Ford')
  const [tradeInModel, setTradeInModel] = useState(activeLead?.customerProfile?.tradeInCar?.model || 'Ranger XLT 3.2 4x4')
  const [tradeInYear, setTradeInYear] = useState(activeLead?.customerProfile?.tradeInCar?.year || '2018')
  const [tradeInKm, setTradeInKm] = useState(activeLead?.customerProfile?.tradeInCar?.km || '112.000 km')
  const [tradeInPlate, setTradeInPlate] = useState('AD 421 TY')
  const [tradeInEngine, setTradeInEngine] = useState('P5AT349811')
  const [tradeInValuation, setTradeInValuation] = useState(17500)

  // D. Crédito prendario bancario
  const [hasFinancing, setHasFinancing] = useState(false)
  const [financeBank, setFinanceBank] = useState('Banco Santander')
  const [financeAmount, setFinanceAmount] = useState(0)
  const [financeTerm, setFinanceTerm] = useState(24)
  const [financeTna, setFinanceTna] = useState('44% TNA Fija')

  // E. Gastos administrativos y gestoría
  const [expensesAmount, setExpensesAmount] = useState(650)
  const [expensesResponsibility, setExpensesResponsibility] = useState('comprador') // 'comprador' or 'bonificado'

  // 4. Datos de Gestoría y Entrega
  const [advisorName, setAdvisorName] = useState(
    activeLead?.owner?.includes('Lucas') ? 'Lucas Benítez' : 'Camila Rossi'
  )
  const [gestorName, setGestorName] = useState('Dra. Silvina Morán (Matrícula DNRPA 4892)')
  const [insuranceCompany, setInsuranceCompany] = useState('La Segunda Seguros (Cobertura Todo Riesgo con Franquicia)')
  const [deliveryDate, setDeliveryDate] = useState('Jueves 17 de Septiembre · 16:30 hs')
  const [deliveryLocation, setDeliveryLocation] = useState('Salón Principal · Av. Libertador 4850, CABA')

  // Completed sale dossier modal / view
  const [viewingSaleDossier, setViewingSaleDossier] = useState(null)

  // When changing selected lead, auto-populate details
  function handleSelectLead(leadId) {
    setSelectedLeadId(leadId)
    const targetLead = leads.find((l) => l.id === leadId)
    if (targetLead) {
      setBuyerName(targetLead.name)
      setBuyerPhone(targetLead.phone)
      setBuyerEmail(`${targetLead.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`)
      if (targetLead.itemId) {
        setSelectedItemId(targetLead.itemId)
      }
      if (targetLead.customerProfile?.fiscal?.toLowerCase().includes('factura a')) {
        setBuyerFiscal('Factura A (Responsable Inscripto)')
        setBuyerDni('30-71448821-4')
      } else {
        setBuyerFiscal('Factura B (Consumidor Final)')
        setBuyerDni('20-28491823-3')
      }
      if (targetLead.customerProfile?.tradeInCar && targetLead.customerProfile.tradeInCar.brand !== 'No entrega usado') {
        setHasTradeIn(true)
        setTradeInBrand(targetLead.customerProfile.tradeInCar.brand)
        setTradeInModel(targetLead.customerProfile.tradeInCar.model)
        setTradeInYear(targetLead.customerProfile.tradeInCar.year || '2019')
        setTradeInKm(targetLead.customerProfile.tradeInCar.km || '75.000 km')
      } else {
        setHasTradeIn(false)
      }
    }
  }

  // When changing selected car, update prices and defaults
  function handleSelectCar(carId) {
    setSelectedItemId(carId)
    const car = items.find((i) => i.id === carId)
    if (car) {
      const price = parseInt(car.price.replace(/[^\d]/g, ''), 10) || 35000
      setFinalAgreedPrice(price)
      setCarColor(car.specs?.color || 'Gris Plata Metalizado')
    }
  }

  // Calculation of Total Payments
  const calcTransfer = hasBankTransfer ? Number(bankTransferAmount) || 0 : 0
  const calcCash = hasCash ? Number(cashAmount) || 0 : 0
  const calcTradeIn = hasTradeIn ? Number(tradeInValuation) || 0 : 0
  const calcFinance = hasFinancing ? Number(financeAmount) || 0 : 0
  const totalPaid = calcTransfer + calcCash + calcTradeIn + calcFinance

  const priceDifference = finalAgreedPrice - totalPaid
  const isBalanced = priceDifference === 0

  // Monthly financing quote estimation
  const monthlyInstallment = useMemo(() => {
    if (!hasFinancing || calcFinance <= 0) return 0
    const monthlyRate = 0.44 / 12
    return Math.round(
      (calcFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -financeTerm))
    )
  }, [hasFinancing, calcFinance, financeTerm])

  // Execute Save Sale
  function handleExecuteSaveSale() {
    const saleId = `OP-VTA-${Date.now().toString().slice(-6)}`
    const saleData = {
      id: saleId,
      date: new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      buyer: buyerName,
      item: activeCar?.title || 'Vehículo SI Motors',
      reference: `${carYear} · VIN ${carVin.slice(-6)} · ${carColor}`,
      amount: `USD ${finalAgreedPrice.toLocaleString('es-AR')}`,
      rawAmount: finalAgreedPrice,
      acquisition: activeCar?.acquisition || `USD ${Math.round(finalAgreedPrice * 0.85).toLocaleString('es-AR')}`,
      costs: `USD ${expensesResponsibility === 'bonificado' ? expensesAmount : 150}`,
      net: `USD ${Math.round(finalAgreedPrice * 0.14).toLocaleString('es-AR')}`,
      margin: '14,2%',
      status: 'Acreditado',
      method: [
        calcTransfer > 0 ? `Transferencia ${bankName} (USD ${calcTransfer.toLocaleString('es-AR')})` : null,
        calcCash > 0 ? `Efectivo en Caja (USD ${calcCash.toLocaleString('es-AR')})` : null,
        calcTradeIn > 0 ? `Toma Usado ${tradeInBrand} ${tradeInModel} (USD ${calcTradeIn.toLocaleString('es-AR')})` : null,
        calcFinance > 0 ? `Crédito ${financeBank} (USD ${calcFinance.toLocaleString('es-AR')})` : null,
      ]
        .filter(Boolean)
        .join(' + '),
      agent: advisorName,
      receipt: `Legajo_Oficial_Venta_${saleId}.pdf`,
      details: {
        leadId: activeLead?.id,
        carId: activeCar?.id,
        buyer: {
          name: buyerName,
          dniCuit: buyerDni,
          fiscalType: buyerFiscal,
          phone: buyerPhone,
          email: buyerEmail,
          address: buyerAddress,
          civilStatus: buyerCivilStatus,
          occupation: buyerOccupation,
        },
        vehicle: {
          title: activeCar?.title,
          year: carYear,
          vin: carVin,
          engineNum: carEngineNum,
          plate: carPlate,
          color: carColor,
          specs: activeCar?.specs,
        },
        payment: {
          totalPrice: finalAgreedPrice,
          bankTransfer: hasBankTransfer ? { amount: calcTransfer, bank: bankName, op: bankOpNumber } : null,
          cash: hasCash ? { amount: calcCash } : null,
          tradeIn: hasTradeIn
            ? {
                brand: tradeInBrand,
                model: tradeInModel,
                year: tradeInYear,
                km: tradeInKm,
                plate: tradeInPlate,
                engine: tradeInEngine,
                valuation: calcTradeIn,
              }
            : null,
          financing: hasFinancing
            ? {
                bank: financeBank,
                amount: calcFinance,
                term: financeTerm,
                rate: financeTna,
                monthlyInstallment,
              }
            : null,
          expenses: {
            amount: expensesAmount,
            responsibility: expensesResponsibility,
          },
        },
        delivery: {
          advisor: advisorName,
          gestor: gestorName,
          insurance: insuranceCompany,
          date: deliveryDate,
          location: deliveryLocation,
        },
        extras,
        savedAt: new Date().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    }

    if (onSaveSale) {
      onSaveSale(saleData)
    }

    setViewingSaleDossier(saleData)
  }

  return (
    <section className="mt-7 grid gap-6">
      {/* Modal del Legajo de Venta si está activo */}
      {viewingSaleDossier && (
        <SaleDossierModal
          sale={viewingSaleDossier}
          onClose={() => {
            setViewingSaleDossier(null)
            setActiveTab('savedSales')
          }}
        />
      )}

      {/* Header del Panel */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#10203b] to-[#1e3a8a] p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-200">
                Puesto de Salón & Facturación
              </span>
              <span className="rounded-full bg-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-300">
                Panel Oficial de Vendedora
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
              Cierre Definitivo de Venta & Legajo Registral
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Completá todos los datos registrales del comprador, seleccioná el vehículo del inventario, registrá la
              cancelación total del pago (100% saldado) y guardá la operación en el sistema.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('newSale')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer',
                activeTab === 'newSale'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              )}
            >
              <FileCheck2 size={16} />
              <span>Cerrar Nueva Venta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('savedSales')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer',
                activeTab === 'savedSales'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              )}
            >
              <Receipt size={16} />
              <span>Ventas Guardadas en Sistema ({sales?.length || 0})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'savedSales' ? (
        /* Pestaña: Ventas Guardadas en el Sistema */
        <SavedSalesHistoryView
          sales={sales}
          onViewSale={(s) => setViewingSaleDossier(s)}
          onStartNewSale={() => setActiveTab('newSale')}
        />
      ) : (
        /* Pestaña: Panel de Trabajo de Cierre */
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* BLOQUE 1: Selección de Cliente y Datos Registrales */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm">
                    1
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Comprador & Datos Legales / DNRPA</h3>
                    <p className="text-xs text-slate-500">Datos requeridos para Factura AFIP y Formulario 08 Oficial</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Seleccionar de CRM:</span>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => handleSelectLead(e.target.value)}
                    className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.intent})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500">Nombre Completo o Razón Social</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                    placeholder="Ej: Esteban Morales / AgroSur SRL"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">CUIT / CUIL / DNI</label>
                  <input
                    type="text"
                    value={buyerDni}
                    onChange={(e) => setBuyerDni(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                    placeholder="20-33445566-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">Condición Fiscal AFIP</label>
                  <select
                    value={buyerFiscal}
                    onChange={(e) => setBuyerFiscal(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Factura B (Consumidor Final)">Factura B (Consumidor Final)</option>
                    <option value="Factura A (Responsable Inscripto)">Factura A (Responsable Inscripto)</option>
                    <option value="Monotributo">Monotributo</option>
                    <option value="Exento">Exento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">Teléfono Móvil</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">Correo Electrónico</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500">Domicilio Real / Legal</label>
                  <input
                    type="text"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">Estado Civil</label>
                  <select
                    value={buyerCivilStatus}
                    onChange={(e) => setBuyerCivilStatus(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Casado/a">Casado/a</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Divorciado/a">Divorciado/a</option>
                    <option value="Unión Convivencial">Unión Convivencial</option>
                  </select>
                </div>
              </div>
            </section>

            {/* BLOQUE 2: Selección del Producto (Stock del Salón) */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm">
                    2
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Producto: Vehículo en Salón</h3>
                    <p className="text-xs text-slate-500">Elegí la unidad física asignada del inventario disponible</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  {items.length} vehículos en catálogo
                </span>
              </div>

              {/* Selector Visual de Vehículos */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((car) => {
                  const isSelected = car.id === selectedItemId
                  return (
                    <div
                      key={car.id}
                      onClick={() => handleSelectCar(car.id)}
                      className={cn(
                        'flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-3 transition-all hover:shadow-md',
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600 ring-offset-1'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div>
                        <div className="relative h-28 overflow-hidden rounded-xl">
                          <img src={car.image} alt={car.title} className="h-full w-full object-cover" />
                          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-black shadow-xs">
                            {car.price}
                          </span>
                          {isSelected && (
                            <span className="absolute right-2 top-2 rounded-full bg-blue-600 p-1 text-white shadow-xs">
                              <Check size={13} />
                            </span>
                          )}
                        </div>
                        <h4 className="mt-2 text-xs font-black text-slate-900 line-clamp-1">{car.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{car.ref}</p>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-bold text-slate-600">
                        <span>{car.specs?.transmission}</span>
                        <span className="text-blue-700 font-black">Asignar Unidad</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Ficha Técnica del Auto Seleccionado */}
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                      Unidad Asignada para Cierre
                    </span>
                    <h4 className="text-base font-black text-slate-900">{activeCar?.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Precio Pactado de Venta</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">USD</span>
                      <input
                        type="number"
                        value={finalAgreedPrice}
                        onChange={(e) => setFinalAgreedPrice(Number(e.target.value))}
                        className="h-8 w-32 rounded-lg border border-blue-300 bg-white px-2 text-sm font-black text-blue-900 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">N° Chasis / VIN:</span>
                    <input
                      type="text"
                      value={carVin}
                      onChange={(e) => setCarVin(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-mono text-[11px] font-bold outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">N° de Motor:</span>
                    <input
                      type="text"
                      value={carEngineNum}
                      onChange={(e) => setCarEngineNum(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-mono text-[11px] font-bold outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">Dominio / Patente:</span>
                    <input
                      type="text"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 font-mono text-[11px] font-bold outline-none uppercase"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">Color Carrocería:</span>
                    <input
                      type="text"
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                {/* Accesorios y Equipamiento Adicional */}
                <div className="mt-4 border-t border-blue-200/60 pt-3">
                  <span className="block text-[10px] font-black uppercase text-blue-900 mb-2">
                    Accesorios & Kit de Entrega Bonificados / Incluidos
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      ['polarizado', 'Polarizado Antivandálico 3M'],
                      ['kitSeguridad', 'Kit de Seguridad + Matafuegos'],
                      ['tuercasSeguridad', 'Tuercas de Seguridad Antirrobo'],
                      ['grabadoAutopartes', 'Grabado de Cristales y Autopartes'],
                      ['garantiaExtendida', 'Garantía Extendida Oficial (1 Año Adicional)'],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className={cn(
                          'flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer',
                          extras[key]
                            ? 'border-blue-400 bg-white text-blue-900 shadow-2xs'
                            : 'border-slate-200 bg-white/60 text-slate-500'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={extras[key]}
                          onChange={(e) => setExtras({ ...extras, [key]: e.target.checked })}
                          className="accent-blue-600 size-3.5"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* BLOQUE 3: Liquidación & Pago Completo (100% de la Venta) */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm">
                    3
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      Estructura de Cobro & Cancelación del 100%
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ingresá los medios de pago con los que se salda la totalidad del auto
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total a Saldar:</span>
                  <strong className="block text-base font-black text-slate-900">
                    USD {finalAgreedPrice.toLocaleString('es-AR')}
                  </strong>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {/* 1. Transferencia Bancaria */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasBankTransfer}
                        onChange={(e) => setHasBankTransfer(e.target.checked)}
                        className="accent-blue-600 size-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                        <Landmark size={16} className="text-blue-600" />
                        Transferencia Bancaria
                      </span>
                    </label>

                    {hasBankTransfer && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Importe USD:</span>
                        <input
                          type="number"
                          value={bankTransferAmount}
                          onChange={(e) => setBankTransferAmount(Number(e.target.value))}
                          className="h-8 w-32 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-black text-slate-900 outline-none focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  {hasBankTransfer && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Entidad Bancaria</span>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="mt-0.5 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 font-bold outline-none cursor-pointer"
                        >
                          <option value="Banco Galicia">Banco Galicia (Cta Cte USD)</option>
                          <option value="Banco Santander">Banco Santander (Cta Recaudadora)</option>
                          <option value="BBVA Francés">BBVA Francés</option>
                          <option value="Banco Nación">Banco Nación</option>
                        </select>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">N° de Comprobante / COELSA</span>
                        <input
                          type="text"
                          value={bankOpNumber}
                          onChange={(e) => setBankOpNumber(e.target.value)}
                          className="mt-0.5 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 font-mono font-bold outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Efectivo / Dólares Billete en Caja */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasCash}
                        onChange={(e) => setHasCash(e.target.checked)}
                        className="accent-emerald-600 size-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                        <Banknote size={16} className="text-emerald-600" />
                        Efectivo / Dólares Billete (Tesorería de Salón)
                      </span>
                    </label>

                    {hasCash && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Importe USD:</span>
                        <input
                          type="number"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(Number(e.target.value))}
                          className="h-8 w-32 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-black text-emerald-800 outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Toma de Usado en Permuta */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasTradeIn}
                        onChange={(e) => setHasTradeIn(e.target.checked)}
                        className="accent-amber-600 size-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                        <Car size={16} className="text-amber-600" />
                        Vehículo Usado en Parte de Pago (Permuta)
                      </span>
                    </label>

                    {hasTradeIn && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Valor de Toma Acordado:</span>
                        <input
                          type="number"
                          value={tradeInValuation}
                          onChange={(e) => setTradeInValuation(Number(e.target.value))}
                          className="h-8 w-32 rounded-lg border border-amber-300 bg-white px-2.5 text-xs font-black text-amber-800 outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                  </div>

                  {hasTradeIn && (
                    <div className="mt-3 grid gap-2.5 rounded-xl border border-amber-200 bg-white p-3 text-xs sm:grid-cols-4">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Marca</span>
                        <input
                          type="text"
                          value={tradeInBrand}
                          onChange={(e) => setTradeInBrand(e.target.value)}
                          className="mt-0.5 h-7 w-full rounded border border-slate-200 px-2 font-bold outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Modelo</span>
                        <input
                          type="text"
                          value={tradeInModel}
                          onChange={(e) => setTradeInModel(e.target.value)}
                          className="mt-0.5 h-7 w-full rounded border border-slate-200 px-2 font-bold outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Año / Km</span>
                        <input
                          type="text"
                          value={`${tradeInYear} · ${tradeInKm}`}
                          onChange={(e) => {
                            const p = e.target.value.split('·')
                            setTradeInYear(p[0]?.trim() || '')
                            setTradeInKm(p[1]?.trim() || '')
                          }}
                          className="mt-0.5 h-7 w-full rounded border border-slate-200 px-2 font-bold outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Patente / Dominio</span>
                        <input
                          type="text"
                          value={tradeInPlate}
                          onChange={(e) => setTradeInPlate(e.target.value)}
                          className="mt-0.5 h-7 w-full rounded border border-slate-200 px-2 font-mono font-bold uppercase outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Crédito Prendario Bancario */}
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasFinancing}
                        onChange={(e) => setHasFinancing(e.target.checked)}
                        className="accent-indigo-600 size-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                        <CreditCard size={16} className="text-indigo-600" />
                        Financiación Prendaria Bancaria
                      </span>
                    </label>

                    {hasFinancing && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Monto Financiado USD:</span>
                        <input
                          type="number"
                          value={financeAmount}
                          onChange={(e) => setFinanceAmount(Number(e.target.value))}
                          className="h-8 w-32 rounded-lg border border-indigo-300 bg-white px-2.5 text-xs font-black text-indigo-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  {hasFinancing && (
                    <div className="mt-3 grid gap-3 rounded-xl border border-indigo-200 bg-white p-3 text-xs sm:grid-cols-3">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Entidad Bancaria</span>
                        <select
                          value={financeBank}
                          onChange={(e) => setFinanceBank(e.target.value)}
                          className="mt-0.5 h-8 w-full rounded border border-slate-200 bg-white px-2 font-bold outline-none cursor-pointer"
                        >
                          <option value="Banco Santander">Banco Santander Río</option>
                          <option value="Banco Galicia">Banco Galicia</option>
                          <option value="BBVA Francés">BBVA Francés</option>
                          <option value="Banco Macro">Banco Macro</option>
                        </select>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Plazo en Cuotas</span>
                        <div className="mt-0.5 flex gap-1">
                          {[12, 24, 36, 48].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setFinanceTerm(t)}
                              className={cn(
                                'flex-1 rounded py-1 text-center font-bold text-[11px] transition cursor-pointer',
                                financeTerm === t ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-slate-50'
                              )}
                            >
                              {t}m
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded bg-indigo-50 p-2 border border-indigo-100">
                        <div>
                          <span className="block text-[9px] font-bold uppercase text-indigo-900">Cuota Est.:</span>
                          <strong className="text-indigo-950 font-black">
                            USD {monthlyInstallment.toLocaleString('es-AR')}
                          </strong>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700">{financeTna}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Gastos de Gestoría y Patentamiento */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-slate-500" />
                    <div>
                      <strong className="block text-slate-900">Gastos de Gestoría, Formulario 08 y Sellados</strong>
                      <span className="text-slate-400 text-[11px]">Trámite de transferencia e inscripción inicial</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-slate-700 font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="exp"
                        checked={expensesResponsibility === 'comprador'}
                        onChange={() => setExpensesResponsibility('comprador')}
                        className="accent-blue-600 cursor-pointer"
                      />
                      A cargo del comprador
                    </label>
                    <label className="flex items-center gap-1.5 text-slate-700 font-bold cursor-pointer ml-2">
                      <input
                        type="radio"
                        name="exp"
                        checked={expensesResponsibility === 'bonificado'}
                        onChange={() => setExpensesResponsibility('bonificado')}
                        className="accent-blue-600 cursor-pointer"
                      />
                      Bonificado por SI Motors
                    </label>

                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">USD</span>
                      <input
                        type="number"
                        value={expensesAmount}
                        onChange={(e) => setExpensesAmount(Number(e.target.value))}
                        className="h-8 w-24 rounded-lg border border-slate-200 pl-9 pr-2 text-xs font-black text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOQUE 4: Gestoría, Seguro y Fecha de Entrega */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm">
                  4
                </span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Gestoría, Seguro & Protocolo de Entrega</h3>
                  <p className="text-xs text-slate-500">Coordinación de trámites registrales y entrega formal de llaves</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500">Vendedora / Asesor Responsable</label>
                  <select
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Camila Rossi">Camila Rossi (Especialista SUVs & Sedanes)</option>
                    <option value="Lucas Benítez">Lucas Benítez (Especialista Pickups & Utilitarios)</option>
                    <option value="Martín Ríos">Martín Ríos (Asesor Comercial Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">Gestor Registral Asignado</label>
                  <input
                    type="text"
                    value={gestorName}
                    onChange={(e) => setGestorName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">Compañía de Seguro Asignada</label>
                  <input
                    type="text"
                    value={insuranceCompany}
                    onChange={(e) => setInsuranceCompany(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500">Fecha y Hora Pactada de Entrega</label>
                  <input
                    type="text"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR DERECHO: Resumen de Liquidación & Botón Guardar Venta */}
          <div className="space-y-5">
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Resumen de Liquidación
                </span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[10px] font-black',
                    isBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  )}
                >
                  {isBalanced ? '100% Cuadrado' : 'Falta Cuadrar'}
                </span>
              </div>

              {/* Preview del Vehículo */}
              <div className="mt-4 flex items-center gap-3">
                <img src={activeCar?.image} alt="" className="size-14 rounded-xl object-cover" />
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-black text-slate-900">{activeCar?.title}</h4>
                  <span className="text-xs text-slate-500">{buyerName || 'Comprador'}</span>
                </div>
              </div>

              {/* Detalle de Cuentas */}
              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Precio Convenido:</span>
                  <strong className="text-slate-900 font-black">
                    USD {finalAgreedPrice.toLocaleString('es-AR')}
                  </strong>
                </div>

                {calcTransfer > 0 && (
                  <div className="flex justify-between text-blue-700">
                    <span>Transferencia bancaria:</span>
                    <strong className="font-bold">- USD {calcTransfer.toLocaleString('es-AR')}</strong>
                  </div>
                )}

                {calcCash > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Efectivo en caja:</span>
                    <strong className="font-bold">- USD {calcCash.toLocaleString('es-AR')}</strong>
                  </div>
                )}

                {calcTradeIn > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Toma de usado:</span>
                    <strong className="font-bold">- USD {calcTradeIn.toLocaleString('es-AR')}</strong>
                  </div>
                )}

                {calcFinance > 0 && (
                  <div className="flex justify-between text-indigo-700">
                    <span>Crédito prendario:</span>
                    <strong className="font-bold">- USD {calcFinance.toLocaleString('es-AR')}</strong>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-700">Total Imputado:</span>
                    <strong className="font-black text-slate-900">
                      USD {totalPaid.toLocaleString('es-AR')}
                    </strong>
                  </div>

                  {priceDifference !== 0 && (
                    <div className="mt-1 flex justify-between text-xs font-bold text-rose-600">
                      <span>Diferencia pendiente:</span>
                      <span>USD {priceDifference.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón Principal: Guardar Venta en el Sistema */}
              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={handleExecuteSaveSale}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 cursor-pointer"
                >
                  <PackageCheck size={18} />
                  <span>Guardar Venta en el Sistema</span>
                </button>

                <p className="text-center text-[10px] text-slate-400">
                  Al guardar, se da de baja la unidad del stock, se actualiza el CRM a Venta Cerrada y se emite el
                  legajo oficial.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SavedSalesHistoryView({ sales, onViewSale, onStartNewSale }) {
  const [q, setQ] = useState('')

  const list = sales || []
  const filtered = list.filter((s) => {
    if (!q) return true
    const term = q.toLowerCase()
    return (
      s.buyer?.toLowerCase().includes(term) ||
      s.item?.toLowerCase().includes(term) ||
      s.id?.toLowerCase().includes(term) ||
      s.agent?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Registro Legal de Ventas Cerradas</h3>
          <p className="text-xs text-slate-500">Operaciones guardadas formalmente en el sistema de la concesionaria</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por comprador, vehículo o boleto..."
              className="h-9 w-64 rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={onStartNewSale}
            className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white hover:bg-blue-700 transition cursor-pointer"
          >
            <FileCheck2 size={14} />
            <span>Nueva Venta</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr>
              <th className="p-4">N° Operación / Fecha</th>
              <th className="p-4">Titular Comprador</th>
              <th className="p-4">Vehículo Adquirido</th>
              <th className="p-4">Monto Total</th>
              <th className="p-4">Esquema de Pago Registrado</th>
              <th className="p-4">Vendedora</th>
              <th className="p-4 text-right">Legajo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((sale) => (
              <tr key={sale.id} className="transition hover:bg-slate-50/70">
                <td className="p-4">
                  <strong className="block font-mono text-blue-700">{sale.id}</strong>
                  <span className="text-xs text-slate-400">{sale.date}</span>
                </td>
                <td className="p-4">
                  <strong className="block text-slate-900">{sale.buyer}</strong>
                  <span className="text-xs text-slate-400">Factura Registrada</span>
                </td>
                <td className="p-4">
                  <strong className="block text-slate-900">{sale.item}</strong>
                  <span className="text-xs text-slate-400">{sale.reference}</span>
                </td>
                <td className="p-4">
                  <strong className="text-base font-black text-slate-900">{sale.amount}</strong>
                </td>
                <td className="p-4">
                  <span className="block text-xs font-semibold text-slate-700 max-w-xs truncate">{sale.method}</span>
                  <span className="mt-0.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                    {sale.status || 'Venta Concluida'}
                  </span>
                </td>
                <td className="p-4 font-semibold text-xs text-slate-800">{sale.agent}</td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewSale(sale)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-100 cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Ver Legajo</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SaleDossierModal({ sale, onClose }) {
  const d = sale.details || {}
  const buyer = d.buyer || {}
  const vehicle = d.vehicle || {}
  const payment = d.payment || {}
  const delivery = d.delivery || {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-5 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-900 via-[#102038] to-emerald-950 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-md">
              <PackageCheck size={22} />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                Operación Guardada en Sistema
              </span>
              <h3 className="text-lg font-black tracking-tight text-white">
                Legajo Oficial de Venta & Certificado de Compraventa · {sale.id}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 font-serif text-slate-900">
          <div className="rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-8 shadow-sm">
            {/* Encabezado */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wide text-slate-900">SI MOTORS S.R.L.</h2>
                <p className="font-sans text-xs text-slate-500">
                  Concesionaria Oficial Multimarca · Av. del Libertador 4850, CABA
                </p>
                <p className="font-sans text-[11px] text-slate-500">
                  CUIT: 30-71889922-1 · Inscripción D.N.R.P.A. N° 02931
                </p>
              </div>
              <div className="text-right">
                <span className="font-sans inline-block rounded-md bg-emerald-700 px-3 py-1 text-xs font-black text-white uppercase tracking-wider">
                  Venta Concluida & Guardada
                </span>
                <p className="font-mono text-xs font-bold text-slate-700 mt-1">{sale.id}</p>
                <p className="font-sans text-[11px] text-slate-500">{d.savedAt || sale.date}</p>
              </div>
            </div>

            {/* Cláusula Primera: Partes */}
            <div className="mt-5 space-y-4 font-sans text-xs leading-relaxed text-slate-700">
              <div>
                <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
                  1. Titular Comprador
                </strong>
                <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-slate-50 p-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Nombre / Razón Social</span>
                    <strong className="text-slate-900">{buyer.name || sale.buyer}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">CUIT / DNI</span>
                    <span className="font-mono font-bold text-slate-800">{buyer.dniCuit || '20-28491823-3'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Condición Fiscal</span>
                    <span className="font-bold text-slate-800">{buyer.fiscalType || 'Consumidor Final'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Contacto</span>
                    <span className="font-bold text-slate-800">{buyer.phone || 'Registrado'}</span>
                  </div>
                </div>
              </div>

              {/* Cláusula Segunda: Vehículo */}
              <div>
                <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
                  2. Individualización de la Unidad
                </strong>
                <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-slate-50 p-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Modelo y Versión</span>
                    <strong className="text-slate-900">{vehicle.title || sale.item}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Color</span>
                    <span className="font-bold text-slate-800">{vehicle.color || 'Gris Plata'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Chasis / VIN</span>
                    <span className="font-mono font-bold text-slate-800">{vehicle.vin || '8AJBA3CD7P091823'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Dominio / Patente</span>
                    <span className="font-mono font-bold text-slate-800">{vehicle.plate || 'AF 892 PL'}</span>
                  </div>
                </div>
              </div>

              {/* Cláusula Tercera: Liquidación de Pago */}
              <div>
                <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
                  3. Liquidación Total del Precio
                </strong>
                <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                      <tr>
                        <th className="p-2.5">Medio de Pago</th>
                        <th className="p-2.5">Detalle / Comprobante</th>
                        <th className="p-2.5 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payment.bankTransfer && (
                        <tr>
                          <td className="p-2.5 font-bold">Transferencia Bancaria</td>
                          <td className="p-2.5 text-slate-500">
                            {payment.bankTransfer.bank} · N° {payment.bankTransfer.op}
                          </td>
                          <td className="p-2.5 text-right font-black text-blue-700">
                            USD {payment.bankTransfer.amount.toLocaleString('es-AR')}
                          </td>
                        </tr>
                      )}
                      {payment.cash && (
                        <tr>
                          <td className="p-2.5 font-bold">Efectivo en Caja</td>
                          <td className="p-2.5 text-slate-500">Dólares billete recibidos en salón</td>
                          <td className="p-2.5 text-right font-black text-emerald-700">
                            USD {payment.cash.amount.toLocaleString('es-AR')}
                          </td>
                        </tr>
                      )}
                      {payment.tradeIn && (
                        <tr>
                          <td className="p-2.5 font-bold">Vehículo Usado en Permuta</td>
                          <td className="p-2.5 text-slate-500">
                            {payment.tradeIn.brand} {payment.tradeIn.model} ({payment.tradeIn.year}) · Patente{' '}
                            {payment.tradeIn.plate}
                          </td>
                          <td className="p-2.5 text-right font-black text-amber-700">
                            USD {payment.tradeIn.valuation.toLocaleString('es-AR')}
                          </td>
                        </tr>
                      )}
                      {payment.financing && (
                        <tr>
                          <td className="p-2.5 font-bold">Crédito Prendario Bancario</td>
                          <td className="p-2.5 text-slate-500">
                            {payment.financing.bank} · {payment.financing.term} cuotas fijas ({payment.financing.rate})
                          </td>
                          <td className="p-2.5 text-right font-black text-indigo-700">
                            USD {payment.financing.amount.toLocaleString('es-AR')}
                          </td>
                        </tr>
                      )}
                      <tr className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                        <td className="p-2.5" colSpan={2}>
                          TOTAL PAGADO Y SALDADO (100%)
                        </td>
                        <td className="p-2.5 text-right text-sm">{sale.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cláusula Cuarta: Entrega y Gestoría */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <strong className="text-slate-900 block font-serif uppercase tracking-wider text-[11px]">
                  4. Entrega, Gestoría y Seguro
                </strong>
                <p className="mt-1">
                  Fecha y horario pactado de retiro: <strong>{delivery.date || 'Inmediata'}</strong> en{' '}
                  <strong>{delivery.location || 'Salón Central'}</strong>. Gestor a cargo:{' '}
                  <strong>{delivery.gestor || 'Asignado por SI Motors'}</strong>. Póliza:{' '}
                  <strong>{delivery.insurance || 'Contratada'}</strong>.
                </p>
              </div>

              {/* Firmas */}
              <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-300 pt-6">
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-1">
                    <span className="font-serif italic text-slate-600 text-[11px]">{delivery.advisor || sale.agent}</span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1">Vendedora / SI MOTORS S.R.L.</p>
                  <p className="text-[10px] text-slate-400">{delivery.advisor || sale.agent}</p>
                </div>

                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-1">
                    <span className="font-serif italic text-slate-600 text-[11px]">{buyer.name || sale.buyer}</span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1">Firma del Comprador</p>
                  <p className="text-[10px] text-slate-400">DNI/CUIT: {buyer.dniCuit || 'Validado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <Printer size={14} /> Imprimir Legajo
            </button>
            <button
              type="button"
              onClick={() => alert(`Descargando ${sale.receipt}...`)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-black text-white hover:bg-blue-700 transition cursor-pointer"
            >
              <Download size={14} /> Descargar PDF
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Listo y Volver al Panel
          </button>
        </div>
      </div>
    </div>
  )
}
