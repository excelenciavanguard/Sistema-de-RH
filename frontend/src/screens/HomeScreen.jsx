import { useEffect, useRef, useState } from "react";
import { ArrowRight, Briefcase, CalendarBlank, Clock, FileText, MapPin, X } from "@phosphor-icons/react";
import { vacancies, recentActivity } from "../mockWorkspaceData.js";
import { ROUTES } from "../navigation.js";
import "./HomeScreen.css";

const agenda = [
  { time: "09:00", title: "Alinhamento com Operações", detail: "Leblon Power · Sala 2" },
  { time: "10:30", title: "Entrevista RH · Mariana Lima", detail: "Videochamada · 45 min" },
  { time: "14:00", title: "Entrevista RH · André Cardoso", detail: "Presencial · Sede" },
];
const pipelineStages = ["Candidatura", "Triagem", "Contato", "Entrevista RH", "Entrevista Gestor", "Pesquisa", "Entrega de documentos", "Treinamento", "Contratação"];
const vacancyMetrics = {
  "2026-0157": { pipeline: [15, 8, 2, 2, 0, 0, 0, 0, 0], newCandidates: 11 },
  "2026-0156": { pipeline: [48, 22, 11, 5, 1, 0, 0, 1, 0], newCandidates: 40 },
  "2026-0154": { pipeline: [108, 72, 34, 17, 9, 5, 1, 6, 1], newCandidates: 99 },
};

function stageIndex(stage) {
  const index = pipelineStages.indexOf(stage);
  return index >= 0 ? index : 0;
}

export function HomeScreen({ onNavigate, appointments = agenda, currentDate }) {
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [today, setToday] = useState(() => currentDate ?? new Date());
  const agendaDialog = useRef(null);
  useEffect(() => { if (agendaOpen) agendaDialog.current?.showModal(); }, [agendaOpen]);
  useEffect(() => {
    if (currentDate) {
      setToday(currentDate);
      return undefined;
    }
    const timer = window.setInterval(() => setToday(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, [currentDate]);
  const openAgenda = () => setAgendaOpen(true);
  const openKanban = (vacancy) => onNavigate(`/recrutamento/vagas/${vacancy.code}/kanban`);
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);
  const accessibleDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const displayDate = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
  const activeVacancies = vacancies.filter((vacancy) => vacancy.status === "Ativa");

  return <main className="screen-workspace home-screen process-home">
    <span className="sr-only">Dados demonstrativos</span>
    <header className="restored-home-heading">
      <div>
        <h1>Hoje no RH</h1>
        <h2 className="home-personal-greeting">Olá, Ramon!</h2>
        <p className="home-greeting-quote">Pessoas bem cuidadas constroem grandes resultados.</p>
      </div>
      <div className="restored-home-date">
        <time dateTime={accessibleDate}>{displayDate}</time>
        <div className="today-agenda-access">
          <button className="today-agenda-button" type="button" onClick={openAgenda} aria-label={`Agenda de hoje ${appointments.length}`} title="Abrir agenda de hoje"><CalendarBlank size={17} /><span>{appointments.length}</span></button>
        </div>
      </div>
    </header>
    <section className="processes-card" aria-labelledby="processes-title">
      <header className="processes-card-header">
        <span className="section-symbol"><Briefcase size={22} weight="duotone" /></span>
        <div className="processes-title-line"><h2 id="processes-title">Processos em andamento</h2><span className="processes-total">{activeVacancies.length} vagas ativas</span></div>
        <button className="text-action" type="button" onClick={() => onNavigate(ROUTES.vacancies)}>Ver todas as vagas <ArrowRight size={17} /></button>
      </header>
      <div className="processes-table" role="table" aria-label="Processos em andamento">
        <div className="processes-table-head" role="row"><span>Vaga</span><span>Candidatos por etapa</span><span>Novos</span></div>
        <div role="rowgroup">{activeVacancies.map((vacancy) => {
          const currentStage = stageIndex(vacancy.stage);
          const metrics = vacancyMetrics[vacancy.code] ?? { pipeline: [vacancy.candidates, 0, 0, 0, 0, 0, 0, 0, 0], newCandidates: vacancy.candidates };
          return <button className="process-row" key={vacancy.code} type="button" onClick={() => openKanban(vacancy)} aria-label={`Abrir processo da vaga ${vacancy.role}`} aria-describedby={`process-summary-${vacancy.code}`}>
            <span className="process-vacancy">
              <span className="process-vacancy-copy">
                <strong>{vacancy.role}</strong>
                <small>{vacancy.post}</small>
                <small className="process-location"><MapPin size={12} weight="fill" />{vacancy.city}</small>
              </span>
            </span>
            <span className="stage-progress" aria-label={`Etapa atual: ${vacancy.stage}. ${pipelineStages.map((stage, index) => `${stage}: ${metrics.pipeline[index] ?? 0} candidatos`).join("; ")}`}>
              {pipelineStages.map((stage, index) => {
                const count = metrics.pipeline[index] ?? 0;
                return <span className="process-stage" aria-label={`${stage}: ${count} ${count === 1 ? "candidato" : "candidatos"}`} key={`${vacancy.code}-${stage}`}><small className="process-stage-name">{stage}</small><i className={count > 0 ? "has-candidates" : ""} /><small className="process-stage-count">{count}</small></span>;
              })}
            </span>
            <span className="process-new-badge">+{metrics.newCandidates} novos</span>
            <span className="sr-only" id={`process-summary-${vacancy.code}`}>Etapa atual: {vacancy.stage}. {pipelineStages.map((stage, index) => `${stage}: ${metrics.pipeline[index] ?? 0} candidatos`).join("; ")}</span>
          </button>;
        })}</div>
      </div>
      <div className="processes-hint"><span>Clique em uma vaga para abrir seu processo.</span><span className="processes-legend"><i aria-hidden="true" />Etapa com candidatos</span></div>
    </section>
    <section className="activities-card" aria-labelledby="activities-title">
      <header className="activities-card-header"><span className="section-symbol"><Clock size={22} weight="duotone" /></span><div><h2 id="activities-title">Atividades recentes</h2><p>Últimas atualizações do sistema relacionadas ao recrutamento.</p></div><button className="text-action" type="button">Ver histórico completo <ArrowRight size={17} /></button></header>
      <div className="activities-grid">{recentActivity.map((activity) => <article key={activity.title}><span className={`activity-icon ${activity.tone}`}><FileText size={19} /></span><div><strong>{activity.title}</strong><small>{activity.detail}</small></div><time>{activity.time}</time></article>)}</div>
    </section>
    <dialog className="agenda-dialog" ref={agendaDialog} aria-labelledby="agenda-title" onClose={() => setAgendaOpen(false)}>
      <header><div><span className="section-symbol"><CalendarBlank size={21} weight="duotone" /></span><div><h2 id="agenda-title">Agenda de hoje</h2><p>Hoje · Dados demonstrativos</p></div></div><button type="button" aria-label="Fechar agenda" onClick={() => agendaDialog.current.close()}><X size={20} /></button></header>
      <div className="agenda-dialog-list">{[...appointments].sort((a, b) => a.time.localeCompare(b.time)).map((item) => <article key={`${item.time}-${item.title}`}><time>{item.time}</time><span><strong>{item.title}</strong><small>{item.detail}</small></span></article>)}{appointments.length === 0 && <p>Nenhum compromisso agendado para hoje.</p>}</div>
      <footer><button className="primary-action" type="button" onClick={() => { agendaDialog.current.close(); onNavigate(ROUTES.agenda); }}>Ver agenda completa <ArrowRight size={17} /></button></footer>
    </dialog>
  </main>;
}
