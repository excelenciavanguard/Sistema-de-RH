import { useMemo, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, Clock3, Cloud, Database, Info, Mail, MapPinned, MessageCircle, MoreHorizontal, Search, ShieldCheck, Workflow } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { StatusPill } from "../components/StatusPill.jsx";
import { WorkspaceTabs } from "../components/WorkspaceTabs.jsx";
import { integrationSources } from "../moduleWorkspaceData.js";

const iconMap = { weboper: Database, quickin: Workflow, gmail: Mail, kinghost: Mail, openai: Bot, gemini: Bot, maps: MapPinned, whatsapp: MessageCircle, indeed: Cloud };
const categories = ["Todas", "Entradas", "IA", "Dados", "Mobilidade", "Comunicação"];

export function IntegrationsScreen() {
  const [selectedId, setSelectedId] = useState("maps");
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const selected = integrationSources.find((item) => item.id === selectedId) ?? integrationSources[0];
  const visible = useMemo(() => integrationSources.filter((item) => (category === "Todas" || item.category === category) && `${item.name} ${item.purpose}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
  return <main className="screen-workspace miro-screen integrations-reference-screen">
    <WorkspaceTabs items={[{ id: "overview", label: "Visão geral" }, { id: "integrations", label: "Integrações" }, { id: "sources", label: "Fontes de dados" }, { id: "processing", label: "Processamento" }, { id: "logs", label: "Logs" }]} active="integrations" onChange={() => {}} ariaLabel="Áreas de integrações" />
    <section className="integration-heading-row"><ScreenHeader title="Integrações" description="Configure fontes de dados e acompanhe o processamento." /><div className="integration-counters"><article className="success"><CheckCircle2 /><strong>2<small>Em teste</small></strong></article><article className="warning"><AlertTriangle /><strong>3<small>Atenção</small></strong></article><article><Info /><strong>4<small>Não configuradas</small></strong></article></div></section>
    <section className="integration-reference-layout">
      <div className="integration-browser">
        <div className="integration-browser-toolbar"><WorkspaceTabs items={categories.map((label) => ({ id: label, label }))} active={category} onChange={setCategory} ariaLabel="Categorias de integrações" /><label><Search size={16} /><input aria-label="Buscar integrações" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar integrações..." /></label></div>
        <div className="integration-card-grid">{visible.map((item) => { const Icon = iconMap[item.id]; return <button type="button" aria-label={`Abrir ${item.name}`} className={`integration-card ${selected.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setSelectedId(item.id)}><Icon /><span><strong>{item.name}</strong><small>{item.purpose}</small></span><MoreHorizontal className="card-menu" /><StatusPill tone={item.tone}>{item.status}</StatusPill><p>{item.description}</p><footer><Clock3 size={14} /><span>Última sincronização<br /><b>{item.lastSync}</b></span></footer></button>; })}</div>
      </div>
      <aside className="surface-panel integration-detail-panel" aria-label="Painel de detalhe da integração">
        <header><div className="integration-detail-icon">{(() => { const Icon = iconMap[selected.id]; return <Icon />; })()}</div><div><h2>Detalhe da integração</h2><strong>{selected.name}</strong></div><StatusPill tone={selected.tone}>{selected.status}</StatusPill></header>
        <section><h3>Sobre esta integração</h3><p>{selected.description}</p></section>
        <section><h3>Configurações necessárias</h3><ul className="requirement-list">{selected.requirements.map((requirement) => <li key={requirement}><i />{requirement}</li>)}</ul></section>
        <div className="integration-facts"><span><Clock3 /><b>Última tentativa</b><strong>{selected.lastSync}</strong><small>Ainda não validada em produção.</small></span><span><Cloud /><b>Custos e cotas</b><strong>—</strong><small>Pendente de configuração.</small></span></div>
        <section><h3>Log de erros e eventos</h3><ol className="event-timeline"><li className="danger"><time>22/04/2025 09:15</time><span><b>Configuração incompleta</b><small>Parâmetros técnicos ainda não validados.</small></span></li><li><time>22/04/2025 08:42</time><span><b>Configuração iniciada</b><small>Integração criada no protótipo.</small></span></li></ol></section>
        <div className="security-note"><ShieldCheck /><span><strong>Credenciais ficam somente no servidor.</strong><small>Chaves e tokens não aparecem nesta interface.</small></span></div>
        <footer><button className="primary-action">Configurar</button><button className="secondary-action" disabled>Testar conexão</button></footer>
      </aside>
    </section>
  </main>;
}
