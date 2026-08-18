import { useEffect, useMemo, useRef, useState } from 'react'
import { defaultBotSchedule, storageKeys } from './config/demoConfig'
import { advisors, initialLeads, initialProperties, pipelineColumns } from './data/demoData'
import { buildLeadReply, isStaleLead, loadJson } from './lib/helpers'
import { PageHeader } from './components/layout/PageHeader'
import { Sidebar } from './components/layout/Sidebar'
import { AdvisorsView } from './views/AdvisorsView'
import { AgendaView } from './views/AgendaView'
import { BrandSettingsView } from './views/BrandSettingsView'
import { ChatsView } from './views/ChatsView'
import { DashboardView } from './views/DashboardView'
import { PipelineView } from './views/PipelineView'
import { PropertiesView } from './views/PropertiesView'
import { VerticalDemo } from './VerticalDemo'

const defaultSection = 'pipeline'

function OriginalDemo() {
  const [section, setSection] = useState(defaultSection)
  const [leads, setLeads] = useState(() => loadJson(storageKeys.leads, initialLeads))
  const [selectedLeadId, setSelectedLeadId] = useState(() => initialLeads[0]?.id)
  const [selectedAdvisorId, setSelectedAdvisorId] = useState(() => advisors[0]?.id)
  const [logo, setLogo] = useState(() => localStorage.getItem(storageKeys.logo) || '')
  const [agency, setAgency] = useState(() => localStorage.getItem(storageKeys.agency) || 'Peitho Realty')
  const [botSchedule, setBotSchedule] = useState(() => loadJson(storageKeys.botSchedule, defaultBotSchedule))
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const logoInputRef = useRef(null)

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || leads[0],
    [leads, selectedLeadId],
  )

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return initialProperties

    return initialProperties.filter((property) =>
      [property.title, property.area, property.price, property.status, ...property.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [query])

  const metrics = useMemo(
    () => ({
      aiOwned: leads.filter((lead) => lead.owner === 'IA').length,
      handoff: leads.filter((lead) => lead.needHuman).length,
      hot: leads.filter((lead) => lead.score >= 88).length,
      stale: leads.filter(isStaleLead).length,
    }),
    [leads],
  )

  const staleLeads = useMemo(() => leads.filter(isStaleLead), [leads])

  useEffect(() => {
    localStorage.setItem(storageKeys.leads, JSON.stringify(leads))
  }, [leads])

  useEffect(() => {
    localStorage.setItem(storageKeys.agency, agency)
  }, [agency])

  useEffect(() => {
    localStorage.setItem(storageKeys.botSchedule, JSON.stringify(botSchedule))
  }, [botSchedule])

  function updateLead(leadId, patch) {
    setLeads((currentLeads) =>
      currentLeads.map((lead) => (lead.id === leadId ? { ...lead, ...patch } : lead)),
    )
  }

  function appendMessage(leadId, message) {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId ? { ...lead, messages: [...lead.messages, message], lastContact: 'Ahora' } : lead,
      ),
    )
  }

  function advanceLead(lead) {
    const currentIndex = pipelineColumns.findIndex((column) => column.id === lead.stage)
    const nextColumn = pipelineColumns[Math.min(currentIndex + 1, pipelineColumns.length - 1)]
    updateLead(lead.id, { stage: nextColumn.id })
    setSelectedLeadId(lead.id)
  }

  function openChat(lead) {
    setSelectedLeadId(lead.id)
    setSection('chats')
  }

  function sendMessage() {
    if (!selectedLead || !draft.trim()) return

    appendMessage(selectedLead.id, {
      from: 'agent',
      text: draft.trim(),
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    })
    setDraft('')
  }

  function toggleHandoff(lead) {
    updateLead(lead.id, {
      needHuman: !lead.needHuman,
      owner: lead.needHuman ? 'IA' : 'Asesor',
    })
  }

  function toggleOwner(lead) {
    updateLead(lead.id, {
      owner: lead.owner === 'IA' ? 'Asesor' : 'IA',
      needHuman: lead.owner === 'IA',
    })
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result)
      setLogo(value)
      localStorage.setItem(storageKeys.logo, value)
    }
    reader.readAsDataURL(file)
  }

  function renderSection() {
    const sharedLeadProps = {
      leads,
      selectedLead,
      replyForLead: buildLeadReply,
      onOpenChat: openChat,
      onSelectLead: setSelectedLeadId,
      onSetDraft: setDraft,
    }

    switch (section) {
      case 'dashboard':
        return <DashboardView leads={leads} metrics={metrics} onOpenPipeline={() => setSection('pipeline')} />
      case 'chats':
        return (
          <ChatsView
            {...sharedLeadProps}
            draft={draft}
            properties={filteredProperties}
            onDraftChange={setDraft}
            onSendMessage={sendMessage}
            onToggleOwner={toggleOwner}
          />
        )
      case 'properties':
        return (
          <PropertiesView
            properties={filteredProperties}
            query={query}
            selectedLead={selectedLead}
            onQueryChange={setQuery}
          />
        )
      case 'advisors':
        return (
          <AdvisorsView
            advisors={advisors}
            leads={leads}
            selectedAdvisorId={selectedAdvisorId}
            onSelectAdvisor={setSelectedAdvisorId}
          />
        )
      case 'agenda':
        return <AgendaView leads={leads} />
      case 'brand':
        return (
          <BrandSettingsView
            agency={agency}
            botSchedule={botSchedule}
            logo={logo}
            onAgencyChange={setAgency}
            onBotScheduleChange={setBotSchedule}
            onLogoUpload={handleLogoUpload}
          />
        )
      case 'pipeline':
      default:
        return (
          <PipelineView
            {...sharedLeadProps}
            staleLeads={staleLeads}
            onAdvanceLead={advanceLead}
            onToggleHandoff={toggleHandoff}
          />
        )
    }
  }

  return (
    <div className="grid min-h-screen bg-[#f8fafd] text-slate-950 lg:grid-cols-[274px_minmax(0,1fr)]">
      <input ref={logoInputRef} className="hidden" type="file" accept="image/*" onChange={handleLogoUpload} />
      <Sidebar
        agency={agency}
        logo={logo}
        metrics={metrics}
        section={section}
        onLogoClick={() => logoInputRef.current?.click()}
        onSectionChange={setSection}
      />
      <main className="min-w-0 overflow-x-hidden p-5 md:p-8">
        <PageHeader section={section} />
        {renderSection()}
      </main>
    </div>
  )
}

function App() {
  const vertical = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase()
  return vertical === 'relojes' || vertical === 'eventos'
    ? <VerticalDemo type={vertical} />
    : <OriginalDemo />
}

export default App
