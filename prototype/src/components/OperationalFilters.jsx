import { X } from "lucide-react";

export function OperationalFilters({ children, activeFilters = [], onClear }) {
  return (
    <section className="operational-filters" aria-label="Filtros">
      <div className="operational-filter-fields">{children}</div>
      {activeFilters.length > 0 && (
        <div className="active-filter-row">
          {activeFilters.map((filter) => <button type="button" key={filter}>{filter}<X size={13} /></button>)}
          <button type="button" className="clear-filter-action" onClick={onClear}>Limpar todos</button>
        </div>
      )}
    </section>
  );
}
