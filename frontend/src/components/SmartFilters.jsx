import { useState } from "react";
import {
  Briefcase,
  CaretDown,
  Funnel,
  GraduationCap,
  MagnifyingGlass,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from "@phosphor-icons/react";

const filterDefinitions = {
  triage: {
    label: "Triagem",
    icon: Star,
    options: [["all", "Todas as etapas"], ["initial", "Somente candidaturas"], ["pending", "Com pendências"]],
  },
  evidence: {
    label: "Evidências",
    icon: ShieldCheck,
    options: [["all", "Todas as evidências"], ["confirmed", "Somente comprovados"], ["declared", "Dados declarados"]],
  },
  experience: {
    label: "Experiência",
    icon: Briefcase,
    options: [["all", "Qualquer experiência"], ["one_year", "1 ano ou mais"], ["leadership", "Com liderança"]],
  },
  education: {
    label: "Escolaridade",
    icon: GraduationCap,
    options: [["all", "Todos os níveis"], ["high_school", "Ensino médio completo"], ["incomplete", "Escolaridade pendente"]],
  },
  mobility: {
    label: "Mobilidade",
    icon: MapPin,
    options: [["all", "Todas as rotas"], ["available", "Rota disponível"], ["pending", "Mobilidade pendente"]],
  },
};

const viewOptions = [["list", "Lista"], ["kanban", "Kanban"], ["rejected", "Desclassificados"]];

export function CandidateWorkspaceControls({ candidateView, onViewChange }) {
  return (
    <div className="candidate-workspace-controls" aria-label="Visualização dos candidatos">
      <div className="view-switcher" role="tablist" aria-label="Visualização">
        {viewOptions.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={candidateView === id} className={candidateView === id ? "active" : ""} onClick={() => onViewChange(id)}>
            {label}{id === "rejected" ? <span>12</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SmartFilters({ activeFilters, onFiltersChange, onSearch, search }) {
  const [open, setOpen] = useState(false);
  const activeCount = Object.values(activeFilters).filter((value) => value !== "all").length;

  function clearFilters() {
    onFiltersChange({ triage: "all", evidence: "all", experience: "all", education: "all", mobility: "all" });
  }

  return (
    <section className="filter-panel compact-candidate-filters" aria-label="Filtros do Kanban">
      <div className="filter-toolbar kanban-filter-toolbar">
        <label className="candidate-search">
          <MagnifyingGlass size={16} />
          <input aria-label="Buscar candidatos" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar candidatos" />
        </label>
        <div className="kanban-filters-wrap">
          <button className={`filter-button kanban-filters-trigger ${activeCount ? "is-active" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="kanban-filters-popover">
            <Funnel size={17} /> Filtros
            {activeCount > 0 && <span className="count-badge">{activeCount}</span>}
            <CaretDown size={13} />
          </button>
          {open && (
            <div className="kanban-filters-popover" id="kanban-filters-popover" role="dialog" aria-label="Opções de filtros">
              <header>
                <div><strong>Filtrar candidatos</strong><small>Todas as opções em um só lugar</small></div>
                <button onClick={() => setOpen(false)} aria-label="Fechar filtros" type="button"><X size={16} /></button>
              </header>
              <div className="kanban-filter-options">
                {Object.entries(filterDefinitions).map(([key, definition]) => {
                  const Icon = definition.icon;
                  return (
                    <label key={key}>
                      <span><Icon size={15} />{definition.label}</span>
                      <select value={activeFilters[key]} onChange={(event) => onFiltersChange({ ...activeFilters, [key]: event.target.value })}>
                        {definition.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                  );
                })}
              </div>
              <footer>
                <button type="button" onClick={clearFilters}>Limpar filtros</button>
                <button className="primary-small" onClick={() => setOpen(false)} type="button">Aplicar</button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
