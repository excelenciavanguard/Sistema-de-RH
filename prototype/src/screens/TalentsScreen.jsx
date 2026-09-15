import { useMemo, useState } from "react";
import { Archive, BriefcaseBusiness, ChevronDown, Filter, Link2, MoreVertical, Search, Send, Settings2, Tag, Upload, UserPlus } from "lucide-react";
import { OperationalFilters } from "../components/OperationalFilters.jsx";
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

export function TalentsScreen() {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("bank");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState([1]);
  const [filters, setFilters] = useState(["Experiência em limpeza", "Ensino médio completo", "Disponível agora"]);
  const visible = useMemo(() => talentCandidates.filter((item) => `${item.name} ${item.role} ${item.location} ${item.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())), [search]);

  function toggleCandidate(id) {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  return (
    <main className="screen-workspace miro-screen talent-workspace">
      <WorkspaceTabs items={sectionTabs} active={section} onChange={setSection} ariaLabel="Áreas de talentos" />
      <ScreenHeader
        title="Banco de talentos"
        description="Candidatos preservados para futuras oportunidades"
        actions={<><button className="primary-action"><UserPlus size={17} /> Adicionar candidato</button><button className="secondary-action"><Upload size={17} /> Importar currículos</button></>}
      />
      <div className="info-strip"><span>i</span><strong>Somente candidatos adicionados pelo RH aparecem aqui.</strong> Desclassificados permanecem no histórico da vaga.</div>

      <OperationalFilters activeFilters={filters} onClear={() => setFilters([])}>
        <label className="filter-search"><Search size={17} /><input aria-label="Buscar talentos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, função ou competência" /></label>
        {[
          [BriefcaseBusiness, "Todos os talentos"], [BriefcaseBusiness, "Experiência"], [BriefcaseBusiness, "Escolaridade"], [BriefcaseBusiness, "Localidade"], [BriefcaseBusiness, "Disponibilidade"],
        ].map(([Icon, label]) => <button type="button" className="filter-select" key={label}><Icon size={15} />{label}<ChevronDown size={14} /></button>)}
        <button className="filter-more"><Filter size={15} />Mais filtros <b>2</b></button>
        <button className="filter-select"><Settings2 size={15} />Personalizar</button>
      </OperationalFilters>

      <div className="view-control-row">
        <WorkspaceTabs items={[{ id: "list", label: "Lista" }, { id: "cards", label: "Cards" }]} active={view} onChange={setView} ariaLabel="Visualização dos talentos" />
        <button className="filter-select">Atualizados recentemente <ChevronDown size={14} /></button>
        <span>Dados demonstrativos</span>
      </div>

      <section className="surface-panel talent-results">
        <div className="bulk-action-row">
          <strong>{selected.length} selecionado{selected.length === 1 ? "" : "s"}</strong>
          <button disabled={!selected.length}><Link2 size={15} />Associar à vaga</button>
          <button disabled={!selected.length}><Send size={15} />Enviar questionário</button>
          <button disabled={!selected.length}><Tag size={15} />Adicionar tag</button>
          <button disabled={!selected.length}><Archive size={15} />Arquivar</button>
        </div>

        {view === "cards" ? (
          <div className="talent-card-grid" data-testid="talent-card-grid">
            {visible.map((item) => <article key={item.id}><div className="avatar-token">{item.initials}</div><div><strong>{item.name}</strong><span>{item.role}</span><small>{item.location}</small></div><StatusPill tone={item.availabilityTone}>{item.availability}</StatusPill></article>)}
          </div>
        ) : (
          <div className="operational-table talent-reference-table">
            <div className="op-table-head"><span /><span>Candidato</span><span>Perfil profissional</span><span>Localidade</span><span>Disponibilidade</span><span>Último contato</span><span>Oportunidades</span><span /></div>
            {visible.map((item) => (
              <div className={`op-table-row ${selected.includes(item.id) ? "selected" : ""}`} key={item.id}>
                <span><input type="checkbox" aria-label={`Selecionar ${item.name}`} checked={selected.includes(item.id)} onChange={() => toggleCandidate(item.id)} /></span>
                <span className="person-cell"><i>{item.initials}</i><b>{item.name}<small>{item.source}</small></b></span>
                <span className="profile-cell"><b>{item.role}</b><small>{item.experience} · {item.education}</small><em>{item.tags.map((tag) => <i key={tag}>{tag}</i>)}</em></span>
                <span>{item.location}</span>
                <span className={`availability ${item.availabilityTone}`}><i />{item.availability}</span>
                <span>{item.lastContact}</span>
                <span className="opportunity-cell"><b>{item.opportunities}</b><small>{item.mobility}</small></span>
                <span><button aria-label={`Mais ações para ${item.name}`} className="icon-action"><MoreVertical size={16} /></button></span>
              </div>
            ))}
          </div>
        )}
        <footer className="table-pagination"><strong>Exibindo 1–{visible.length} de 1.248 candidatos</strong><span>Dados demonstrativos</span><div><button>50 por página <ChevronDown size={14} /></button><button disabled>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div></footer>
      </section>
    </main>
  );
}
