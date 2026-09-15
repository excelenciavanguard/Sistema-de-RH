import { ArrowRight, Briefcase, Copy, FunnelSimple, MagnifyingGlass, Plus, UsersThree } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { vacancies } from "../mockWorkspaceData.js";
import { ROUTES } from "../navigation.js";

export function VacanciesScreen({ onNavigate }) {
  return (
    <main className="screen-workspace">
      <ScreenHeader title="Vagas" description="Acompanhe vagas aprovadas, responsáveis e o avanço de cada processo seletivo." actions={<button className="primary-action" type="button" onClick={() => onNavigate(ROUTES.vacancyCreate)}><Plus size={18} /> Criar vaga</button>} />
      <section className="vacancy-metrics" aria-label="Resumo das vagas"><div><Briefcase size={21} /><span><strong>4</strong><small>Vagas no painel</small></span></div><div><UsersThree size={21} /><span><strong>103</strong><small>Candidaturas</small></span></div><div><span className="metric-dot success" /><span><strong>3</strong><small>Vagas ativas</small></span></div><div><span className="metric-dot warning" /><span><strong>1</strong><small>Rascunho</small></span></div></section>
      <section className="surface-panel data-panel vacancy-list-panel">
        <div className="data-toolbar"><label><MagnifyingGlass size={18} /><input placeholder="Buscar vaga, posto ou responsável" aria-label="Buscar vagas" /></label><button type="button"><FunnelSimple size={18} /> Situação</button><button type="button"><UsersThree size={18} /> Responsável</button><button type="button"><Briefcase size={18} /> Posto</button></div>
        <div className="vacancy-table" role="table" aria-label="Lista de vagas">
          <div className="vacancy-row vacancy-head" role="row"><span>Vaga / posto</span><span>Candidatos</span><span>Etapa em destaque</span><span>Responsável</span><span>SLA</span><span>Ações</span></div>
          {vacancies.map((vacancy) => <div className="vacancy-row" role="row" key={vacancy.code}>
            <span><strong>{vacancy.role}</strong><small>{vacancy.post} · {vacancy.city} · {vacancy.code}</small></span>
            <span><strong>{vacancy.candidates}</strong><small>{vacancy.openings} posições</small></span>
            <span><strong>{vacancy.stage}</strong><small>{vacancy.status}</small></span>
            <span><strong>{vacancy.owner}</strong><small>Equipe RH</small></span>
            <span><b className={`status-badge sla-badge ${vacancy.slaTone}`}>{vacancy.sla}</b></span>
            <span className="vacancy-row-actions"><button type="button" aria-label={`Duplicar vaga ${vacancy.role}`}><Copy size={16} /></button><button className="table-action" type="button" onClick={() => onNavigate(ROUTES.kanban)}>Abrir Kanban <ArrowRight size={15} /></button></span>
          </div>)}
        </div>
      </section>
    </main>
  );
}
