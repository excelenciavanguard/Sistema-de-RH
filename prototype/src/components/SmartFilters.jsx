import {
  Briefcase,
  CaretDown,
  Check,
  DotsSixVertical,
  Funnel,
  GearSix,
  GraduationCap,
  MagnifyingGlass,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from "@phosphor-icons/react";

const chips = ["Ensino médio completo", "Experiência ≥ 1 ano", "Até 2 conduções", "Questionário respondido"];
const visibleFilters = [
  ["Evidências", ShieldCheck, true],
  ["Experiência", Briefcase, true],
  ["Escolaridade", GraduationCap, true],
  ["Mobilidade", MapPin, true],
  ["CNH", Briefcase, false],
  ["Disponibilidade", Check, false],
];

export function SmartFilters({ search, onSearch, open, onToggle }) {
  return (
    <section className="filter-panel" aria-label="Filtros do Kanban">
      <div className="filter-toolbar">
        <div className="view-switcher" role="group" aria-label="Visualização">
          <button type="button">Lista</button>
          <button className="active" type="button">Kanban</button>
          <button type="button">Mobilidade</button>
          <button type="button">Desclassificados <span>12</span></button>
        </div>
        <label className="candidate-search">
          <MagnifyingGlass size={16} />
          <input aria-label="Buscar candidatos" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar candidatos" />
        </label>
        <button className="filter-button" type="button"><Star size={16} weight="fill" /> Triagem inicial <CaretDown size={13} /></button>
        <button className="filter-button" type="button"><ShieldCheck size={17} /> Evidências <CaretDown size={13} /></button>
        <button className="filter-button" type="button"><Briefcase size={17} /> Experiência <CaretDown size={13} /></button>
        <button className="filter-button" type="button"><GraduationCap size={17} /> Escolaridade <CaretDown size={13} /></button>
        <button className="filter-button" type="button"><MapPin size={17} /> Mobilidade <CaretDown size={13} /></button>
        <button className="filter-button emphasized" type="button"><Funnel size={17} /> Mais filtros <span className="count-badge">3</span></button>
        <div className="personalize-wrap">
          <button className="filter-button" type="button" onClick={onToggle} aria-expanded={open}><GearSix size={17} /> Personalizar</button>
          {open && (
            <div className="personalize-popover" role="dialog" aria-label="Filtros visíveis">
              <div className="popover-title"><strong>Filtros visíveis</strong><button onClick={onToggle} aria-label="Fechar" type="button"><X size={15} /></button></div>
              {visibleFilters.map(([label, Icon, checked]) => (
                <label className="visible-filter" key={label}>
                  <DotsSixVertical size={16} />
                  <input defaultChecked={checked} type="checkbox" />
                  <Icon size={16} />
                  <span>{label}</span>
                </label>
              ))}
              <div className="popover-actions"><button type="button">Restaurar padrão</button><button className="primary-small" onClick={onToggle} type="button">Concluir</button></div>
            </div>
          )}
        </div>
      </div>
      <div className="filter-chips">
        {chips.map((chip) => <button key={chip} type="button">{chip}<X size={13} /></button>)}
        <button className="clear-filters" type="button">Limpar todos</button>
      </div>
    </section>
  );
}
