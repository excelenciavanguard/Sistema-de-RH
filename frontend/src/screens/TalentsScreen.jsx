import { useMemo, useState } from "react";
import {
  Archive,
  BriefcaseBusiness,
  BusFront,
  ChevronDown,
  Filter,
  Link2,
  MapPin,
  MoreVertical,
  Search,
  Send,
  Settings2,
  Tag,
  Target,
  Upload,
  UserPlus,
} from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { StatusPill } from "../components/StatusPill.jsx";
import { WorkspaceTabs } from "../components/WorkspaceTabs.jsx";
import { talentCandidates } from "../moduleWorkspaceData.js";

const sectionTabs = [
  { id: "overview", label: "Visão geral" },
  { id: "bank", label: "Banco de talentos" },
  { id: "segments", label: "Segmentos" },
  { id: "history", label: "Histórico de contatos" },
];

const opportunityDetails = {
  1: { title: "Auxiliar de Limpeza", evidence: "4 de 5 requisitos · rota disponível" },
  2: { title: "Auxiliar de Limpeza", evidence: "3 de 5 requisitos · mobilidade pendente" },
  3: { title: "Porteiro", evidence: "5 de 5 requisitos · rota disponível" },
  4: { title: "Recepcionista", evidence: "4 de 5 requisitos · rota disponível" },
  5: { title: "Auxiliar Operacional", evidence: "3 de 5 requisitos · mobilidade pendente" },
  6: { title: "Supervisora de Limpeza", evidence: "4 de 5 requisitos · rota disponível" },
};

const filterLabels = ["Experiência", "Escolaridade", "Localidade", "Disponibilidade"];

export function TalentsScreen() {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("bank");
  const [mode, setMode] = useState("all");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState(["Experiência em limpeza", "Ensino médio completo", "Disponível agora"]);
  const visible = useMemo(
    () => talentCandidates.filter((item) => `${item.name} ${item.role} ${item.location} ${item.source} ${item.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  function toggleCandidate(id) {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  const vacancyMode = mode === "vacancy";
  const resultLabel = search ? `${visible.length} resultado${visible.length === 1 ? "" : "s"}` : "1.248 talentos";

  return (
    <main className="screen-workspace miro-screen talent-workspace">
      <WorkspaceTabs items={sectionTabs} active={section} onChange={setSection} ariaLabel="Áreas de talentos" />
      <ScreenHeader
        title="Banco de talentos"
        description="Encontre pessoas ou descubra talentos para uma vaga."
        actions={<><button className="secondary-action"><Upload size={17} /> Importar currículos</button><button className="primary-action"><UserPlus size={17} /> Adicionar candidato</button></>}
      />

      <section className="talent-discovery-panel" aria-label="Forma de busca no banco de talentos">
        <div className="talent-mode-row">
          <div className="talent-mode-switch" role="tablist" aria-label="Objetivo da busca">
            <button type="button" role="tab" aria-selected={!vacancyMode} className={!vacancyMode ? "active" : ""} onClick={() => setMode("all")}>
              <UserPlus size={17} /> Todos os talentos
            </button>
            <button type="button" role="tab" aria-selected={vacancyMode} className={vacancyMode ? "active" : ""} onClick={() => setMode("vacancy")}>
              <Target size={17} /> Encontrar para uma vaga
            </button>
          </div>
          <div className="talent-mode-context">
            {vacancyMode ? (
              <button type="button" className="talent-vacancy-picker">
                <BriefcaseBusiness size={16} />
                <span><small>Vaga selecionada</small>Auxiliar de Serviços Gerais · Leblon Power</span>
                <ChevronDown size={15} />
              </button>
            ) : <p>Pesquise uma pessoa por nome, contato, função ou histórico.</p>}
          </div>
        </div>

        <div className="talent-filter-row">
          <label className="talent-search">
            <Search size={17} />
            <input
              aria-label="Buscar talentos"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={vacancyMode ? "Buscar nos candidatos compatíveis" : "Buscar por nome, telefone, e-mail ou função"}
            />
          </label>
          {filterLabels.map((label) => (
            <button type="button" className="filter-select" key={label}><BriefcaseBusiness size={15} />{label}<ChevronDown size={14} /></button>
          ))}
          <button type="button" className="filter-more"><Filter size={15} />Mais filtros <b>2</b></button>
          <button type="button" className="filter-select talent-personalize"><Settings2 size={15} />Personalizar</button>
        </div>

        {filters.length > 0 ? (
          <div className="active-filter-row">
            {filters.map((filter) => <button type="button" key={filter} onClick={() => setFilters((current) => current.filter((value) => value !== filter))}>{filter}<span aria-hidden="true">×</span></button>)}
            <button type="button" className="clear-filter-action" onClick={() => setFilters([])}>Limpar filtros</button>
          </div>
        ) : null}
      </section>

      <div className="talent-results-controls">
        <WorkspaceTabs items={[{ id: "list", label: "Lista" }, { id: "cards", label: "Cards" }]} active={view} onChange={setView} ariaLabel="Visualização dos talentos" />
        <button type="button" className="filter-select talent-sort">Atualizados recentemente <ChevronDown size={14} /></button>
      </div>

      <section className="surface-panel talent-results">
        <header className="talent-results-summary">
          <strong>{resultLabel}</strong>
          {vacancyMode ? <span>Ordenados pela compatibilidade com a vaga selecionada</span> : <span>Base consolidada do RH</span>}
        </header>

        {selected.length > 0 ? (
          <div className="bulk-action-row" aria-label="Ações para candidatos selecionados">
            <strong>{selected.length} selecionado{selected.length === 1 ? "" : "s"}</strong>
            <button type="button"><Link2 size={15} />Associar à vaga</button>
            <button type="button"><Send size={15} />Enviar questionário</button>
            <button type="button"><Tag size={15} />Adicionar tag</button>
            <button type="button"><Archive size={15} />Arquivar</button>
          </div>
        ) : null}

        {view === "cards" ? (
          <div className="talent-card-grid" data-testid="talent-card-grid">
            {visible.map((item) => {
              const opportunity = opportunityDetails[item.id];
              return (
                <article key={item.id}>
                  <div className="avatar-token">{item.initials}</div>
                  <div><strong>{item.name}</strong><span>{item.role}</span><small>{item.location}</small></div>
                  <StatusPill tone={item.availabilityTone}>{item.availability}</StatusPill>
                  <footer><span><b>{opportunity.title}</b><small>{opportunity.evidence}</small></span><button type="button">Ver vaga</button></footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="talent-table-scroll">
            <div className="operational-table talent-reference-table">
              <div className="op-table-head"><span /><span>Candidato</span><span>Perfil profissional</span><span>Localidade e mobilidade</span><span>Disponibilidade</span><span>Último contato</span><span>Melhor oportunidade</span><span /></div>
              {visible.map((item) => {
                const opportunity = opportunityDetails[item.id];
                return (
                  <div className={`op-table-row ${selected.includes(item.id) ? "selected" : ""}`} key={item.id}>
                    <span><input type="checkbox" aria-label={`Selecionar ${item.name}`} checked={selected.includes(item.id)} onChange={() => toggleCandidate(item.id)} /></span>
                    <span className="person-cell"><i>{item.initials}</i><b>{item.name}<small>{item.source}</small></b></span>
                    <span className="profile-cell"><b>{item.role}</b><small>{item.experience} · {item.education}</small></span>
                    <span className="talent-location-cell"><b><MapPin size={14} />{item.location}</b><small><BusFront size={14} />{item.mobility}</small></span>
                    <span className={`availability ${item.availabilityTone}`}><i />{item.availability}</span>
                    <span>{item.lastContact}</span>
                    <span className="opportunity-cell"><span><b>{opportunity.title}</b><small>{opportunity.evidence}</small></span><button type="button">Ver vaga</button></span>
                    <span><button type="button" aria-label={`Mais ações para ${item.name}`} className="icon-action"><MoreVertical size={16} /></button></span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <footer className="table-pagination"><strong>Exibindo 1–{visible.length} de 1.248 candidatos</strong><div><button type="button">50 por página <ChevronDown size={14} /></button><button type="button" disabled>‹</button><button type="button" className="active">1</button><button type="button">2</button><button type="button">3</button><button type="button">›</button></div></footer>
      </section>
    </main>
  );
}
