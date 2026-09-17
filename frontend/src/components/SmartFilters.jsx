import { useState } from "react";
import { Briefcase, CaretDown, Check, DotsSixVertical, Funnel, GearSix, GraduationCap, MagnifyingGlass, MapPin, ShieldCheck, Star, X } from "@phosphor-icons/react";

const filterDefinitions = {
  triage: { label: "Triagem inicial", icon: Star, options: [["all", "Todas as etapas"], ["initial", "Somente candidaturas"], ["pending", "Com pendências"]] },
  evidence: { label: "Evidências", icon: ShieldCheck, options: [["all", "Todas as evidências"], ["confirmed", "Somente comprovados"], ["declared", "Dados declarados"]] },
  experience: { label: "Experiência", icon: Briefcase, options: [["all", "Qualquer experiência"], ["one_year", "1 ano ou mais"], ["leadership", "Com liderança"]] },
  education: { label: "Escolaridade", icon: GraduationCap, options: [["all", "Todos os níveis"], ["high_school", "Ensino médio completo"], ["incomplete", "Escolaridade pendente"]] },
  mobility: { label: "Mobilidade", icon: MapPin, options: [["all", "Todas as rotas"], ["available", "Rota disponível"], ["pending", "Mobilidade pendente"]] },
};

const visibleFilters = [["Evidências", ShieldCheck, true], ["Experiência", Briefcase, true], ["Escolaridade", GraduationCap, true], ["Mobilidade", MapPin, true], ["CNH", Briefcase, false], ["Disponibilidade", Check, false]];
const viewOptions = [["list", "Lista"], ["kanban", "Kanban"], ["rejected", "Desclassificados"]];

export function CandidateWorkspaceControls({ activeFilters, candidateView, onFiltersChange, onViewChange, open, onToggle }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const currentChips = Object.entries(activeFilters).filter(([, value]) => value !== "all");
  function chooseFilter(key, value) { onFiltersChange({ ...activeFilters, [key]: value }); setMoreOpen(false); }
  return <div className="candidate-workspace-controls" aria-label="Modos e filtros rápidos">
    <div className="view-switcher" role="tablist" aria-label="Visualização">
      {viewOptions.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={candidateView === id} className={candidateView === id ? "active" : ""} onClick={() => onViewChange(id)}>{label}{id === "rejected" ? <span>12</span> : null}</button>)}
    </div>
    <div className="quick-filter-wrap"><button className="filter-button emphasized" type="button" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}><Funnel size={17} /> Mais filtros <span className="count-badge">{currentChips.length}</span></button>{moreOpen ? <div className="filter-menu more-filter-menu" role="dialog" aria-label="Mais filtros"><button type="button" onClick={() => { onFiltersChange({ triage: "all", evidence: "all", experience: "all", education: "all", mobility: "all" }); setMoreOpen(false); }}>Limpar filtros ativos</button><button type="button" onClick={() => chooseFilter("mobility", "pending")}>Mobilidade pendente</button><button type="button" onClick={() => chooseFilter("triage", "pending")}>Dados pendentes</button></div> : null}</div>
    <div className="personalize-wrap"><button className="filter-button" type="button" onClick={onToggle} aria-expanded={open}><GearSix size={17} /> Personalizar</button>{open ? <div className="personalize-popover" role="dialog" aria-label="Filtros visíveis"><div className="popover-title"><strong>Filtros visíveis</strong><button onClick={onToggle} aria-label="Fechar" type="button"><X size={15} /></button></div>{visibleFilters.map(([label, Icon, checked]) => <label className="visible-filter" key={label}><DotsSixVertical size={16} /><input defaultChecked={checked} type="checkbox" /><Icon size={16} /><span>{label}</span></label>)}<div className="popover-actions"><button type="button">Restaurar padrão</button><button className="primary-small" onClick={onToggle} type="button">Concluir</button></div></div> : null}</div>
  </div>;
}

export function SmartFilters({ activeFilters, onFiltersChange, onSearch, search }) {
  const [openFilter, setOpenFilter] = useState(null);
  const currentChips = Object.entries(activeFilters).filter(([, value]) => value !== "all");
  function chooseFilter(key, value) { onFiltersChange({ ...activeFilters, [key]: value }); setOpenFilter(null); }

  return <section className="filter-panel" aria-label="Filtros do Kanban">
    <div className="filter-toolbar">
      <label className="candidate-search"><MagnifyingGlass size={16} /><input aria-label="Buscar candidatos" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar candidatos" /></label>
      {Object.entries(filterDefinitions).map(([key, definition]) => <FilterControl active={activeFilters[key] !== "all"} definition={definition} filterKey={key} key={key} open={openFilter === key} onChoose={chooseFilter} onToggle={() => setOpenFilter((current) => current === key ? null : key)} />)}
    </div>
    <div className="filter-chips">{currentChips.map(([key, value]) => <button key={key} type="button" onClick={() => chooseFilter(key, "all")}>{filterDefinitions[key].options.find(([id]) => id === value)?.[1]}<X size={13} /></button>)}{currentChips.length ? <button className="clear-filters" type="button" onClick={() => onFiltersChange({ triage: "all", evidence: "all", experience: "all", education: "all", mobility: "all" })}>Limpar todos</button> : <small>Selecione filtros para refinar os candidatos.</small>}</div>
  </section>;
}

function FilterControl({ active, definition, filterKey, open, onChoose, onToggle }) {
  const Icon = definition.icon;
  return <div className="filter-control-wrap"><button className={`filter-button ${active ? "is-active" : ""}`} type="button" aria-expanded={open} onClick={onToggle}><Icon size={17} /> {definition.label} <CaretDown size={13} /></button>{open ? <div className="filter-menu" role="dialog" aria-label={`Opções de ${definition.label}`}>{definition.options.map(([value, label]) => <button key={value} type="button" onClick={() => onChoose(filterKey, value)}>{label}</button>)}</div> : null}</div>;
}
