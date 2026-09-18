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
  Tag,
  Target,
  Upload,
  UserPlus,
  X,
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

const talentFilterDefinitions = {
  experience: { label: "Experiência", options: [["all", "Qualquer experiência"], ["cleaning", "Experiência em limpeza"], ["three_years", "3 anos ou mais"]] },
  education: { label: "Escolaridade", options: [["all", "Qualquer escolaridade"], ["high_school", "Ensino médio completo"], ["qualification", "Curso ou qualificação"]] },
  location: { label: "Localidade", options: [["all", "Todas as localidades"], ["rio", "Rio de Janeiro"], ["capital", "Capital"], ["baixada", "Baixada Fluminense"]] },
  availability: { label: "Disponibilidade", options: [["all", "Qualquer disponibilidade"], ["now", "Disponível agora"], ["confirm", "Interesse a confirmar"]] },
  mobility: { label: "Mobilidade", options: [["all", "Todas as situações"], ["available", "Rota disponível"], ["pending", "Mobilidade pendente"]] },
};

const initialTalentFilters = { experience: "cleaning", education: "high_school", location: "all", availability: "now", mobility: "all" };

const talentWorkspaceViews = {
  overview: {
    title: "Visão geral de talentos",
    description: "Acompanhe a base consolidada e os principais recortes disponíveis para o RH.",
    eyebrow: "Panorama da base",
    heading: "Talentos em destaque",
    items: [["1.248", "talentos cadastrados", "Base consolidada do RH"], ["486", "disponíveis agora", "39% da base de talentos"], ["904", "perfis completos", "Dados prontos para busca"]],
  },
  segments: {
    title: "Segmentos de talentos",
    description: "Organize grupos de pessoas para buscas, campanhas e oportunidades recorrentes.",
    eyebrow: "Segmentos salvos",
    heading: "Grupos prontos para consultar",
    items: [["486", "Disponíveis agora", "Contato recente e disponibilidade confirmada"], ["312", "Mobilidade validada", "Rota compatível com postos ativos"], ["186", "Recomendados para vagas", "Perfis com aderência às oportunidades abertas"]],
  },
  history: {
    title: "Histórico de contatos",
    description: "Consulte os últimos contatos realizados com os talentos da base.",
    eyebrow: "Atividade recente",
    heading: "Interações registradas",
    items: [["Hoje, 10:42", "Currículo enviado para revisão", "Rafael Santos · Auxiliar de Serviços Gerais"], ["Hoje, 09:18", "Convite para entrevista enviado", "Mariana Lima · Auxiliar de Limpeza"], ["Ontem, 16:25", "Interesse confirmado", "André Cardoso · Porteiro"]],
  },
};

function TalentWorkspacePreview({ section }) {
  const view = talentWorkspaceViews[section];
  return <>
    <ScreenHeader title={view.title} description={view.description} />
    <section className="surface-panel talent-section-preview" aria-label={view.title}>
      <header><span>{view.eyebrow}</span><h2>{view.heading}</h2><p>Dados demonstrativos organizados para facilitar a consulta da equipe.</p></header>
      <div className="talent-section-preview-grid">{view.items.map(([value, label, note]) => <article key={label}><strong>{value}</strong><b>{label}</b><small>{note}</small></article>)}</div>
    </section>
  </>;
}

export function TalentsScreen() {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("bank");
  const [mode, setMode] = useState("all");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(initialTalentFilters);
  const visible = useMemo(
    () => talentCandidates.filter((item) => {
      const searchMatch = `${item.name} ${item.role} ${item.location} ${item.source} ${item.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase());
      const experienceYears = Number.parseInt(item.experience, 10) || 0;
      const experienceMatch = filters.experience === "all" || (filters.experience === "cleaning" && item.tags.includes("Limpeza")) || (filters.experience === "three_years" && experienceYears >= 3);
      const educationMatch = filters.education === "all" || (filters.education === "high_school" && item.education === "Ensino médio completo") || (filters.education === "qualification" && item.education !== "Ensino médio completo");
      const locationMatch = filters.location === "all" || (filters.location === "rio" && item.location.includes("RJ")) || (filters.location === "capital" && !item.location.includes("Duque de Caxias")) || (filters.location === "baixada" && item.location.includes("Duque de Caxias"));
      const availabilityMatch = filters.availability === "all" || (filters.availability === "now" && item.availability === "Disponível agora") || (filters.availability === "confirm" && item.availability.toLowerCase().includes("confirm"));
      const mobilityMatch = filters.mobility === "all" || (filters.mobility === "available" && item.mobility === "Rota disponível") || (filters.mobility === "pending" && item.mobility === "Mobilidade pendente");
      return searchMatch && experienceMatch && educationMatch && locationMatch && availabilityMatch && mobilityMatch;
    }),
    [filters, search],
  );

  const activeFilterEntries = Object.entries(filters).filter(([, value]) => value !== "all");

  function toggleCandidate(id) {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  const vacancyMode = mode === "vacancy";
  const resultLabel = search ? `${visible.length} resultado${visible.length === 1 ? "" : "s"}` : "1.248 talentos";

  if (section !== "bank") {
    return <main className="screen-workspace miro-screen talent-workspace">
      <WorkspaceTabs items={sectionTabs} active={section} onChange={setSection} ariaLabel="Áreas de talentos" />
      <TalentWorkspacePreview section={section} />
    </main>;
  }

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
          <div className="talent-filters-wrap">
            <button type="button" className={`filter-more talent-filters-trigger ${activeFilterEntries.length ? "is-active" : ""}`} onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen} aria-controls="talent-filters-popover">
              <Filter size={16} />Filtros{activeFilterEntries.length > 0 && <b>{activeFilterEntries.length}</b>}<ChevronDown size={14} />
            </button>
            {filtersOpen && <div className="talent-filters-popover" id="talent-filters-popover" role="dialog" aria-label="Opções de filtros do banco de talentos">
              <header><div><strong>Filtrar talentos</strong><small>Todas as opções em um só lugar</small></div><button type="button" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)}><X size={16} /></button></header>
              <div className="talent-filter-options">
                {Object.entries(talentFilterDefinitions).map(([key, definition]) => <label key={key}><span>{definition.label}</span><select value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}>{definition.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>)}
              </div>
              <footer><button type="button" onClick={() => setFilters(Object.fromEntries(Object.keys(talentFilterDefinitions).map((key) => [key, "all"])))}>Limpar filtros</button><button type="button" className="primary-small" onClick={() => setFiltersOpen(false)}>Aplicar</button></footer>
            </div>}
          </div>
        </div>

        {activeFilterEntries.length > 0 ? (
          <div className="active-filter-row">
            {activeFilterEntries.map(([key, value]) => <button type="button" key={key} onClick={() => setFilters((current) => ({ ...current, [key]: "all" }))}>{talentFilterDefinitions[key].options.find(([option]) => option === value)?.[1]}<span aria-hidden="true">×</span></button>)}
            <button type="button" className="clear-filter-action" onClick={() => setFilters(Object.fromEntries(Object.keys(talentFilterDefinitions).map((key) => [key, "all"])))}>Limpar filtros</button>
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
