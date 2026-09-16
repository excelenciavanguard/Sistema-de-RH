import { useEffect, useRef, useState } from "react";
import { ArrowRight, Briefcase, CalendarBlank, Clock, DotsThreeVertical, FileText, MapPin, X } from "@phosphor-icons/react";
import { vacancies, recentActivity } from "../mockWorkspaceData.js";
import { ROUTES } from "../navigation.js";
import "./HomeScreen.css";

const agenda = [
  { time: "09:00", title: "Alinhamento com Operações", detail: "Leblon Power · Sala 2" },
  { time: "10:30", title: "Entrevista RH · Mariana Lima", detail: "Videochamada · 45 min" },
  { time: "14:00", title: "Entrevista RH · André Cardoso", detail: "Presencial · Sede" },
];
const stages = ["Triagem", "Entrevista", "Testes", "Contratação"];
const pipelineStages = ["Triagem", "Entrevista", "Testes", "Proposta", "Contratação", "Desistentes", "Outros"];
const vacancyMetrics = {
  "2026-0157": { days: 29, pipeline: [15, 2, 0, 0, 0, 0, 0, 0], newCandidates: 11 },
  "2026-0156": { days: 28, pipeline: [48, 11, 1, 0, 0, 1, 0, 0], newCandidates: 40 },
  "2026-0154": { days: 14, pipeline: [108, 72, 17, 5, 1, 6, 1, 5], newCandidates: 99 },
};

function stageIndex(stage) {
  if (stage === "Triagem" || stage === "Contato") return 0;
  if (stage.includes("Entrevista")) return 1;
  if (stage === "Treinamento") return 2;
  return 3;
}

export function HomeScreen({ onNavigate }) {
  const [agendaOpen, setAgendaOpen] = useState(false);
  const agendaDialog = useRef(null);
  useEffect(() => { if (agendaOpen) agendaDialog.current?.showModal(); }, [agendaOpen]);
  const openKanban = (vacancy) => onNavigate(`/recrutamento/vagas/${vacancy.code}/kanban`);

  return <main className="screen-workspace home-screen process-home">
    <span className="sr-only">Dados demonstrativos</span>
    <section className="processes-card" aria-labelledby="processes-title">
      <header className="processes-card-header">
        <span className="section-symbol"><Briefcase size={22} weight="duotone" /></span>
        <div><h1 id="processes-title">Processos em andamento</h1><p>Acompanhe o andamento das vagas e o status de cada etapa.</p></div>
        <button className="calendar-launcher" type="button" onClick={() => setAgendaOpen(true)} aria-label="Abrir agenda"><CalendarBlank size={21} weight="bold" /></button>
        <button className="text-action" type="button" onClick={() => onNavigate(ROUTES.vacancies)}>Ver todas as vagas <ArrowRight size={17} /></button>
      </header>
      <div className="processes-table" role="table" aria-label="Processos em andamento">
        <div className="processes-table-head" role="row"><span>Vaga</span><span>Etapas do processo</span><span>Candidatos por etapa</span><span>Novos</span><span aria-hidden="true" /></div>
        <div role="rowgroup">{vacancies.filter((vacancy) => vacancy.status === "Ativa").map((vacancy) => {
          const currentStage = stageIndex(vacancy.stage);
          const metrics = vacancyMetrics[vacancy.code] ?? { days: 14, pipeline: [vacancy.candidates, 0, 0, 0, 0, 0, 0, 0], newCandidates: vacancy.candidates };
          return <button className="process-row" key={vacancy.code} type="button" onClick={() => openKanban(vacancy)} aria-label={`Abrir processo da vaga ${vacancy.role}`}>
            <span className="process-vacancy">
              <span className={`process-deadline ${vacancy.slaTone}`} style={{ "--deadline-fill": vacancy.slaTone === "warning" ? "70%" : "100%" }}>{metrics.days}d</span>
              <span className="process-vacancy-copy">
                <strong>{vacancy.role}</strong>
                <small>{vacancy.post}</small>
                <small className="process-location"><MapPin size={12} weight="fill" />{vacancy.city}</small>
              </span>
            </span>
            <span className="stage-progress" aria-label={`Etapa atual: ${vacancy.stage}`}>{stages.map((stage, index) => <span key={stage}><i className={index <= currentStage ? "done" : ""} /><small>{stage}</small></span>)}</span>
            <span className="candidate-stage-grid" aria-label={`Candidatos por etapa: ${metrics.pipeline.slice(0, 7).join(", ")}`}>
              {metrics.pipeline.slice(0, 7).map((count, index) => {
                const tooltip = `${pipelineStages[index]} — ${count} ${count === 1 ? "pessoa" : "pessoas"}`;
                return <span className="candidate-stage" title={tooltip} aria-label={tooltip} key={`${vacancy.code}-${index}`}><b>{count}</b><small>{pipelineStages[index]}</small></span>;
              })}
            </span>
            <span className="process-new-badge">+{metrics.newCandidates} novos</span>
            <span className="process-row-menu" aria-hidden="true"><DotsThreeVertical size={20} weight="bold" /></span>
          </button>;
        })}</div>
      </div>
      <p className="processes-hint">Clique em uma vaga para abrir seu processo.</p>
    </section>
    <section className="activities-card" aria-labelledby="activities-title">
      <header className="activities-card-header"><span className="section-symbol"><Clock size={22} weight="duotone" /></span><div><h2 id="activities-title">Atividades recentes</h2><p>Últimas atualizações do sistema relacionadas ao recrutamento.</p></div><button className="text-action" type="button">Ver histórico completo <ArrowRight size={17} /></button></header>
      <div className="activities-grid">{recentActivity.map((activity) => <article key={activity.title}><span className={`activity-icon ${activity.tone}`}><FileText size={19} /></span><div><strong>{activity.title}</strong><small>{activity.detail}</small></div><time>{activity.time}</time></article>)}</div>
    </section>
    <dialog className="agenda-dialog" ref={agendaDialog} aria-labelledby="agenda-title" onClose={() => setAgendaOpen(false)}>
      <header><div><span className="section-symbol"><CalendarBlank size={21} weight="duotone" /></span><div><h2 id="agenda-title">Agenda de hoje</h2><p>Entrevistas e compromissos do dia.</p></div></div><button type="button" aria-label="Fechar agenda" onClick={() => agendaDialog.current.close()}><X size={20} /></button></header>
      <div className="agenda-dialog-list">{agenda.map((item) => <article key={`${item.time}-${item.title}`}><time>{item.time}</time><span><strong>{item.title}</strong><small>{item.detail}</small></span></article>)}</div>
      <footer><button className="primary-action" type="button" onClick={() => { agendaDialog.current.close(); onNavigate(ROUTES.agenda); }}>Ver agenda completa <ArrowRight size={17} /></button></footer>
    </dialog>
  </main>;
}
