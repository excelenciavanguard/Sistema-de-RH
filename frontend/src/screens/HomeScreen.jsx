import { useEffect, useRef, useState } from "react";
import { ArrowRight, Briefcase, CalendarBlank, Clock, DotsThreeVertical, FileText, MapPin, X } from "@phosphor-icons/react";
import { vacancies, recentActivity } from "../mockWorkspaceData.js";
import { ROUTES } from "../navigation.js";
import WelcomeBanner from "../components/ui/welcome-banner";
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

export function findNextAppointment(appointments, currentTime) {
  return [...appointments].filter((item) => item.time >= currentTime).sort((a, b) => a.time.localeCompare(b.time))[0] ?? null;
}

function stageIndex(stage) {
  if (stage === "Triagem" || stage === "Contato") return 0;
  if (stage.includes("Entrevista")) return 1;
  if (stage === "Treinamento") return 2;
  return 3;
}

export function HomeScreen({ onNavigate, appointments = agenda, currentTime = "10:00", currentDate }) {
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    if (currentDate) return;
    const timer = window.setInterval(() => setToday(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, [currentDate]);
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const agendaDialog = useRef(null);
  useEffect(() => { if (agendaOpen) agendaDialog.current?.showModal(); }, [agendaOpen]);
  const nextAppointment = findNextAppointment(appointments, currentTime);
  const openAgenda = (appointment = null) => { setSelectedAppointment(appointment); setAgendaOpen(true); };
  const openKanban = (vacancy) => onNavigate(`/recrutamento/vagas/${vacancy.code}/kanban`);
  const displayDate = currentDate ?? today;
  const dateLabel = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(displayDate);
  const dateValue = `${displayDate.getFullYear()}-${String(displayDate.getMonth() + 1).padStart(2, "0")}-${String(displayDate.getDate()).padStart(2, "0")}`;

  return <main className="screen-workspace home-screen process-home">
    <header className="restored-home-heading">
      <div><h1>Hoje no RH</h1><p>Visão geral do que importa para você e para o time de RH.</p></div>
      <div className="restored-home-date"><time dateTime={dateValue}>{dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}</time><span>Bom trabalho, Simão Pedro!</span></div>
    </header>
    <WelcomeBanner description="Acompanhe seus compromissos e o andamento dos processos de hoje." />
    <section className="next-appointment" aria-labelledby="next-appointment-title">
      <div className="next-appointment-time"><CalendarBlank size={18} weight="duotone" /><span>Hoje</span>{nextAppointment && <time dateTime={nextAppointment.time}>{nextAppointment.time}</time>}</div>
      <div className="next-appointment-copy">
        <div className="next-appointment-heading"><h2 id="next-appointment-title">{nextAppointment ? "Próximo compromisso" : appointments.length ? "Todos os compromissos de hoje já passaram" : "Nenhum compromisso agendado para hoje"}</h2><small>Dados demonstrativos</small></div>
        {nextAppointment && <p><strong>{nextAppointment.title}</strong> · {nextAppointment.detail}</p>}
      </div>
      <div className="next-appointment-actions">
        {nextAppointment && <button className="text-action" type="button" onClick={() => openAgenda(nextAppointment)}>Ver detalhes <ArrowRight size={16} /></button>}
        <button className="next-agenda-button" type="button" onClick={() => openAgenda()}><CalendarBlank size={17} />Agenda de hoje <span className="next-agenda-count">{appointments.length}</span></button>
      </div>
    </section>
    <section className="processes-card" aria-labelledby="processes-title">
      <header className="processes-card-header">
        <span className="section-symbol"><Briefcase size={22} weight="duotone" /></span>
        <div><h2 id="processes-title">Processos em andamento</h2><p>Acompanhe o andamento das vagas e o status de cada etapa.</p></div>
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
      <header><div><span className="section-symbol"><CalendarBlank size={21} weight="duotone" /></span><div><h2 id="agenda-title">{selectedAppointment ? "Detalhes do compromisso" : "Agenda de hoje"}</h2><p>Hoje · Dados demonstrativos</p></div></div><button type="button" aria-label="Fechar agenda" onClick={() => agendaDialog.current.close()}><X size={20} /></button></header>
      <div className="agenda-dialog-list">{(selectedAppointment ? [selectedAppointment] : [...appointments].sort((a, b) => a.time.localeCompare(b.time))).map((item) => <article key={`${item.time}-${item.title}`}><time>{item.time}</time><span><strong>{item.title}</strong><small>{item.detail}</small></span></article>)}{appointments.length === 0 && <p>Nenhum compromisso agendado para hoje.</p>}</div>
      <footer><button className="primary-action" type="button" onClick={() => { agendaDialog.current.close(); onNavigate(ROUTES.agenda); }}>Ver agenda completa <ArrowRight size={17} /></button></footer>
    </dialog>
  </main>;
}
