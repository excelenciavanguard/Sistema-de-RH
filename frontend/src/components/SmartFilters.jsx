import { useState } from "react";
import {
  Briefcase,
  Check,
  Funnel,
  GraduationCap,
  MagnifyingGlass,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from "@phosphor-icons/react";

const filterOptions = [
  { id: "initial-screening", label: "Triagem inicial", icon: Star },
  { id: "evidence", label: "Evidências comprovadas", icon: ShieldCheck },
  { id: "experience", label: "Experiência ≥ 1 ano", icon: Briefcase },
  { id: "education", label: "Ensino médio completo", icon: GraduationCap },
  { id: "mobility", label: "Até 2 conduções", icon: MapPin },
  { id: "questionnaire", label: "Questionário respondido", icon: Check },
];

const initialFilters = ["experience", "education", "mobility", "questionnaire"];

export function SmartFilters({ search, onSearch, open, onToggle }) {
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  function toggleFilter(filterId) {
    setActiveFilters((current) => current.includes(filterId)
      ? current.filter((id) => id !== filterId)
      : [...current, filterId]);
  }

  return (
    <section className="filter-panel" aria-label="Filtros do Kanban">
      <div className="filter-toolbar kanban-filter-toolbar">
        <label className="candidate-search">
          <MagnifyingGlass size={16} />
          <input aria-label="Buscar candidatos" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar candidatos" />
        </label>
        <div className="kanban-filters-wrap">
          <button className="filter-button emphasized kanban-filters-trigger" type="button" onClick={onToggle} aria-expanded={open} aria-controls="kanban-filters-popover">
            <Funnel size={17} /> Filtros
            {activeFilters.length > 0 && <span className="count-badge">{activeFilters.length}</span>}
          </button>
          {open && (
            <div className="kanban-filters-popover" id="kanban-filters-popover" role="dialog" aria-label="Opções de filtros">
              <header>
                <div><strong>Filtrar candidatos</strong><small>Selecione uma ou mais opções</small></div>
                <button onClick={onToggle} aria-label="Fechar filtros" type="button"><X size={16} /></button>
              </header>
              <div className="kanban-filter-options">
                {filterOptions.map(({ id, label, icon: Icon }) => (
                  <label key={id}>
                    <input checked={activeFilters.includes(id)} onChange={() => toggleFilter(id)} type="checkbox" />
                    <Icon size={16} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <footer>
                <button type="button" onClick={() => setActiveFilters([])}>Limpar filtros</button>
                <button className="primary-small" onClick={onToggle} type="button">Aplicar</button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
