import { useMemo, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Clock3,
  Cloud,
  Database,
  FileClock,
  Gauge,
  Mail,
  MapPinned,
  MessageCircle,
  Search,
  Server,
  Workflow,
} from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { StatusPill } from "../components/StatusPill.jsx";
import { WorkspaceTabs } from "../components/WorkspaceTabs.jsx";
import { integrationSources } from "../moduleWorkspaceData.js";
import "./integrations.css";

const sections = [
  { id: "overview", label: "Visão geral" },
  { id: "integrations", label: "Integrações" },
  { id: "sources", label: "Fontes de dados" },
  { id: "processing", label: "Processamento" },
  { id: "logs", label: "Logs" },
];

const categories = ["Todas", "Entradas", "IA", "Dados", "Mobilidade", "Comunicação"];
const iconMap = { weboper: Database, quickin: Workflow, gmail: Mail, kinghost: Mail, openai: Bot, gemini: Bot, maps: MapPinned, whatsapp: MessageCircle, indeed: Cloud };

const sourceMetadata = {
  weboper: { frequency: "Diária · 06:00", owner: "Dados e operações" },
  quickin: { frequency: "Sob demanda", owner: "Recrutamento" },
  gmail: { frequency: "A cada 15 min", owner: "Recrutamento" },
  kinghost: { frequency: "A cada 15 min", owner: "Infraestrutura" },
  openai: { frequency: "Sob demanda", owner: "Produto e RH" },
  gemini: { frequency: "Sob demanda", owner: "Produto e RH" },
  maps: { frequency: "Sob demanda", owner: "Mobilidade" },
  whatsapp: { frequency: "Por evento", owner: "Comunicação" },
  indeed: { frequency: "A definir", owner: "Recrutamento" },
};

const processingJobs = [
  { id: 1, title: "Importação de currículos", source: "Quickin API", schedule: "Hoje, 10:30", status: "Em fila", tone: "neutral", progress: 0 },
  { id: 2, title: "Sincronização de postos", source: "Weboper MySQL", schedule: "Aguardando acesso", status: "Preparação", tone: "warning", progress: 35 },
  { id: 3, title: "Atualização de mobilidade", source: "Google Maps Platform", schedule: "Dependência pendente", status: "Bloqueado", tone: "danger", progress: 0 },
];

const processingHistory = [
  { id: 1, title: "Leitura da caixa RioVagas", source: "Gmail RioVagas", time: "Hoje, 08:42", result: "Simulação concluída", tone: "success" },
  { id: 2, title: "Extração estruturada de currículo", source: "OpenAI", time: "Ontem, 16:18", result: "Revisão humana", tone: "info" },
  { id: 3, title: "Comparação de extração", source: "Gemini", time: "Ontem, 15:54", result: "Simulação concluída", tone: "success" },
];

const systemLogs = [
  { id: 1, level: "error", time: "22/04/2025 09:15", source: "Google Maps Platform", message: "Configuração incompleta: conta e chave ainda não foram informadas." },
  { id: 2, level: "warning", time: "22/04/2025 08:48", source: "Weboper MySQL", message: "Acesso somente leitura aguardando validação." },
  { id: 3, level: "info", time: "22/04/2025 08:42", source: "Gmail RioVagas", message: "Mapeamento da caixa de entrada atualizado no ambiente demonstrativo." },
  { id: 4, level: "info", time: "21/04/2025 16:18", source: "OpenAI", message: "Execução de laboratório encaminhada para revisão humana." },
];

const logFilters = [
  { id: "all", label: "Todos" },
  { id: "info", label: "Informação" },
  { id: "warning", label: "Avisos" },
  { id: "error", label: "Erros" },
];

export function IntegrationsScreen() {
  const [section, setSection] = useState("integrations");
  const [selectedId, setSelectedId] = useState("maps");
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [logFilter, setLogFilter] = useState("all");

  const selected = integrationSources.find((item) => item.id === selectedId) ?? integrationSources[0];
  const visible = useMemo(() => integrationSources.filter((item) => (
    (category === "Todas" || item.category === category)
    && `${item.name} ${item.purpose}`.toLowerCase().includes(search.toLowerCase())
  )), [category, search]);
  const visibleLogs = useMemo(() => systemLogs.filter((item) => logFilter === "all" || item.level === logFilter), [logFilter]);

  return (
    <main className="screen-workspace miro-screen integrations-reference-screen">
      <WorkspaceTabs items={sections} active={section} onChange={setSection} ariaLabel="Áreas de integrações" />
      {section === "overview" ? <IntegrationOverview onOpenCatalog={() => setSection("integrations")} /> : null}
      {section === "integrations" ? (
        <IntegrationCatalog
          category={category}
          onCategoryChange={setCategory}
          onSearchChange={setSearch}
          onSelect={setSelectedId}
          search={search}
          selected={selected}
          visible={visible}
        />
      ) : null}
      {section === "sources" ? <DataSources /> : null}
      {section === "processing" ? <ProcessingWorkspace /> : null}
      {section === "logs" ? <LogsWorkspace activeFilter={logFilter} logs={visibleLogs} onFilterChange={setLogFilter} /> : null}
    </main>
  );
}

function IntegrationOverview({ onOpenCatalog }) {
  return (
    <section className="integration-workspace-view">
      <ScreenHeader title="Visão geral das integrações" description="Acompanhe conexões, atividades e dependências do ambiente demonstrativo." />
      <div className="integration-overview-summary">
        <span><Server /><b>9</b><small>fontes mapeadas</small></span>
        <span><Activity /><b>3</b><small>canais de entrada</small></span>
        <span><Gauge /><b>0</b><small>rotinas em produção</small></span>
        <button type="button" onClick={onOpenCatalog}>Abrir integrações</button>
      </div>
      <div className="integration-overview-grid">
        <section className="surface-panel integration-overview-panel">
          <header><div><h2>Conexões prioritárias</h2><p>Fontes que sustentam os principais fluxos do RH.</p></div><span>3 fontes</span></header>
          <div className="integration-priority-list">
            {integrationSources.slice(0, 3).map((item) => <article key={item.id}><IntegrationIcon id={item.id} /><span><strong>{item.name}</strong><small>{item.purpose}</small></span><StatusPill tone={item.tone}>{item.status}</StatusPill></article>)}
          </div>
        </section>
        <section className="surface-panel integration-overview-panel">
          <header><div><h2>Atividade recente</h2><p>Últimos movimentos registrados no protótipo.</p></div><FileClock /></header>
          <ol className="integration-activity-list">
            {systemLogs.slice(1).map((item) => <li key={item.id}><i className={item.level} /><time>{item.time.split(" ")[1]}</time><span><strong>{item.source}</strong><small>{item.message}</small></span></li>)}
          </ol>
        </section>
      </div>
    </section>
  );
}

function IntegrationCatalog({ category, onCategoryChange, onSearchChange, onSelect, search, selected, visible }) {
  return (
    <section className="integration-workspace-view">
      <ScreenHeader title="Integrações" description="Consulte os serviços previstos e o que falta para cada conexão." />
      <section className="integration-reference-layout">
        <div className="integration-browser">
          <div className="integration-browser-toolbar"><WorkspaceTabs items={categories.map((label) => ({ id: label, label }))} active={category} onChange={onCategoryChange} ariaLabel="Categorias de integrações" /><label><Search size={16} /><input aria-label="Buscar integrações" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar integrações..." /></label></div>
          <div className="integration-card-grid">{visible.map((item) => <IntegrationCard item={item} key={item.id} onSelect={onSelect} selected={selected.id === item.id} />)}</div>
        </div>
        <IntegrationDetail selected={selected} />
      </section>
    </section>
  );
}

function IntegrationCard({ item, onSelect, selected }) {
  return (
    <button type="button" aria-label={`Abrir ${item.name}`} className={`integration-card ${selected ? "selected" : ""}`} onClick={() => onSelect(item.id)}>
      <IntegrationIcon id={item.id} />
      <span className="integration-card-title"><strong>{item.name}</strong><small>{item.purpose}</small></span>
      <p>{item.description}</p>
      <footer><StatusPill tone={item.tone}>{item.status}</StatusPill><span><Clock3 size={13} />{item.lastSync}</span></footer>
    </button>
  );
}

function IntegrationDetail({ selected }) {
  const metadata = sourceMetadata[selected.id];
  return (
    <aside className="surface-panel integration-detail-panel" aria-label="Painel de detalhe da integração">
      <header><div className="integration-detail-icon"><IntegrationIcon id={selected.id} /></div><div><h2>{selected.name}</h2><p>{selected.purpose}</p></div><StatusPill tone={selected.tone}>{selected.status}</StatusPill></header>
      <p className="integration-detail-summary">{selected.description}</p>
      <dl className="integration-detail-meta"><div><dt>Categoria</dt><dd>{selected.category}</dd></div><div><dt>Frequência</dt><dd>{metadata.frequency}</dd></div><div><dt>Responsável</dt><dd>{metadata.owner}</dd></div><div><dt>Última sincronização</dt><dd>{selected.lastSync}</dd></div></dl>
      <section className="integration-requirements"><h3>Para disponibilizar</h3><ul className="requirement-list">{selected.requirements.map((requirement) => <li key={requirement}><i />{requirement}</li>)}</ul></section>
      <div className="integration-next-step"><CheckCircle2 /><span><strong>Próximo passo</strong><small>{selected.requirements[0]}</small></span></div>
    </aside>
  );
}

function DataSources() {
  return (
    <section className="integration-workspace-view">
      <ScreenHeader title="Fontes de dados" description="Veja a origem, o uso previsto e a responsabilidade por cada dado do sistema." />
      <section className="surface-panel integration-data-table" aria-label="Inventário de fontes de dados">
        <header><span>Fonte</span><span>Categoria</span><span>Uso no Alpha RH</span><span>Frequência</span><span>Responsável</span><span>Status</span></header>
        {integrationSources.map((item) => <article key={item.id}><span className="integration-source-name"><IntegrationIcon id={item.id} /><b>{item.name}</b></span><span>{item.category}</span><span>{item.purpose}</span><span>{sourceMetadata[item.id].frequency}</span><span>{sourceMetadata[item.id].owner}</span><StatusPill tone={item.tone}>{item.status}</StatusPill></article>)}
      </section>
    </section>
  );
}

function ProcessingWorkspace() {
  return (
    <section className="integration-workspace-view">
      <ScreenHeader title="Processamento de dados" description="Acompanhe a fila demonstrativa e o histórico das rotinas de integração." />
      <div className="integration-processing-grid">
        <section className="surface-panel integration-processing-panel">
          <header><div><h2>Fila atual</h2><p>Rotinas preparadas para validação.</p></div><span>{processingJobs.length} itens</span></header>
          <div className="integration-job-list">{processingJobs.map((job) => <article key={job.id}><span className="integration-job-icon"><Workflow /></span><span><strong>{job.title}</strong><small>{job.source} · {job.schedule}</small></span><div className="integration-job-progress" aria-label={`${job.progress}% concluído`}><i><em style={{ width: `${job.progress}%` }} /></i><small>{job.progress}%</small></div><StatusPill tone={job.tone}>{job.status}</StatusPill></article>)}</div>
        </section>
        <section className="surface-panel integration-processing-panel">
          <header><div><h2>Últimas execuções</h2><p>Resultados recentes no ambiente demonstrativo.</p></div><FileClock /></header>
          <div className="integration-run-list">{processingHistory.map((run) => <article key={run.id}><span><strong>{run.title}</strong><small>{run.source}</small></span><time>{run.time}</time><StatusPill tone={run.tone}>{run.result}</StatusPill></article>)}</div>
        </section>
      </div>
    </section>
  );
}

function LogsWorkspace({ activeFilter, logs, onFilterChange }) {
  return (
    <section className="integration-workspace-view">
      <ScreenHeader title="Logs do sistema" description="Consulte eventos técnicos demonstrativos por nível e origem." />
      <section className="surface-panel integration-logs-panel">
        <header><div className="integration-log-filters" role="group" aria-label="Filtrar logs">{logFilters.map((filter) => <button type="button" className={activeFilter === filter.id ? "active" : ""} aria-pressed={activeFilter === filter.id} key={filter.id} onClick={() => onFilterChange(filter.id)}>{filter.label}</button>)}</div><span>{logs.length} eventos</span></header>
        <ol className="integration-log-list">{logs.map((item) => <li key={item.id} className={item.level}><span className="integration-log-icon">{item.level === "error" ? <CircleX /> : item.level === "warning" ? <CircleAlert /> : <CheckCircle2 />}</span><time>{item.time}</time><span><strong>{item.source}</strong><small>{item.message}</small></span></li>)}</ol>
      </section>
    </section>
  );
}

function IntegrationIcon({ id }) {
  const Icon = iconMap[id] ?? Database;
  return <Icon aria-hidden="true" />;
}
