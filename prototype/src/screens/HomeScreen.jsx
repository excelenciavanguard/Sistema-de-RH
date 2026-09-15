import {
  ArrowRight,
  Briefcase,
  CalendarBlank,
  ChartBar,
  CheckSquare,
  Clock,
  FileText,
  Handshake,
  Users,
} from "@phosphor-icons/react";
import { ROUTES } from "../navigation.js";
import WelcomeBanner from "../components/ui/welcome-banner";

const priorityActions = [
  { title: "Revisar currículos importados", detail: "27 currículos aguardam validação do RH", priority: "Alta", tone: "danger", due: "Hoje", route: ROUTES.kanban },
  { title: "Analisar requisição pendente", detail: "Auxiliar de Serviços Gerais · Leblon Power", priority: "Alta", tone: "danger", due: "Hoje", route: ROUTES.approvals },
  { title: "Confirmar endereço para mobilidade", detail: "3 candidatos possuem localização incompleta", priority: "Média", tone: "warning", due: "Hoje", route: ROUTES.kanban },
  { title: "Preparar entrevistas do turno da tarde", detail: "2 entrevistas aguardam roteiro e confirmação", priority: "Média", tone: "warning", due: "Hoje", route: ROUTES.agenda },
  { title: "Conferir documentos de admissão", detail: "1 contratação está com documentação pendente", priority: "Baixa", tone: "success", due: "Hoje", route: ROUTES.admission },
];

const agenda = [
  { time: "09:00", title: "Alinhamento com Operações", detail: "Leblon Power · Sala 2", tone: "blue" },
  { time: "10:30", title: "Entrevista RH · Mariana Lima", detail: "Videochamada · 45 min", tone: "green" },
  { time: "14:00", title: "Entrevista RH · André Cardoso", detail: "Presencial · Sede", tone: "blue" },
  { time: "15:30", title: "Retorno para candidatos", detail: "Processo 2026-0157", tone: "green" },
  { time: "17:00", title: "Fechamento diário da triagem", detail: "Equipe de RH", tone: "blue" },
];

const processMetrics = [
  { value: "12", label: "Vagas abertas", change: "+3", detail: "Em andamento", icon: Briefcase, tone: "success" },
  { value: "486", label: "Candidaturas", change: "+18", detail: "Em análise", icon: FileText, tone: "success" },
  { value: "18", label: "Entrevistas", change: "+5", detail: "Nesta semana", icon: Users, tone: "danger" },
  { value: "6", label: "Contratações", change: "= 0", detail: "Neste mês", icon: Handshake, tone: "neutral" },
];

const activities = [
  ["Extração de currículo concluída", "há 12 minutos", "blue"],
  ["Requisição enviada para aprovação", "há 1 hora", "green"],
  ["Entrevista confirmada pelo candidato", "há 2 horas", "green"],
  ["Candidato avançou para Entrevista RH", "há 3 horas", "green"],
  ["Pendência de mobilidade registrada", "há 5 horas", "warning"],
];

export function HomeScreen({ onNavigate }) {
  return (
    <main className="screen-workspace home-screen executive-home">
      <span className="sr-only">Dados demonstrativos</span>
      <header className="home-page-heading">
        <div><h1>Hoje no RH</h1><p>Visão geral do que importa para você e para o time de RH.</p></div>
        <div><strong>Segunda-feira, 14 de setembro de 2026</strong><small>Bom trabalho, Lucas!</small></div>
      </header>

      <WelcomeBanner onShowActions={() => document.getElementById("proximas-acoes")?.scrollIntoView({ behavior: "smooth", block: "start" })} />

      <div className="executive-grid">
        <section className="executive-panel priority-panel" id="proximas-acoes">
          <PanelHeader icon={CheckSquare} title="Próximas ações" description="Suas principais pendências e recomendações para hoje." action="Ver todas (5)" onClick={() => onNavigate(ROUTES.requisitions)} />
          <div className="executive-action-list">
            {priorityActions.map((action) => (
              <button className="executive-action-row" key={action.title} onClick={() => onNavigate(action.route)} type="button">
                <span className="action-checkbox" aria-hidden="true" />
                <span className="executive-action-copy"><strong>{action.title}</strong><small>{action.detail}</small></span>
                <span className={`priority-tag ${action.tone}`}>{action.priority}</span>
                <time>{action.due}</time>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <aside className="executive-panel agenda-panel">
          <PanelHeader icon={CalendarBlank} title="Agenda de hoje" description="Seus compromissos e reuniões do dia." action="Ver agenda" onClick={() => onNavigate(ROUTES.agenda)} />
          <div className="executive-agenda-list">
            {agenda.map((item) => (
              <button type="button" key={`${item.time}-${item.title}`} onClick={() => onNavigate(ROUTES.agenda)}>
                <i className={item.tone} aria-hidden="true" />
                <time>{item.time}</time>
                <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </aside>

        <section className="executive-panel process-panel">
          <PanelHeader icon={ChartBar} title="Processos em andamento" description="Acompanhe o status dos principais processos." action="Ver todos" onClick={() => onNavigate(ROUTES.vacancies)} />
          <div className="process-metric-grid">
            {processMetrics.map(({ icon: Icon, ...metric }) => (
              <button type="button" key={metric.label} onClick={() => onNavigate(ROUTES.vacancies)}>
                <Icon size={25} aria-hidden="true" />
                <span><strong>{metric.value}</strong><b>{metric.label}</b><em className={metric.tone}>{metric.change}</em><small>{metric.detail}</small></span>
              </button>
            ))}
          </div>
        </section>

        <section className="executive-panel activity-panel">
          <PanelHeader icon={Clock} title="Atividades recentes" description="Últimas atualizações nos processos de RH." action="Ver todas" />
          <div className="executive-activity-list">
            {activities.map(([title, time, tone]) => <article key={title}><i className={tone} /><strong>{title}</strong><time>{time}</time></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}

function PanelHeader({ icon: Icon, title, description, action, onClick }) {
  return (
    <header className="executive-panel-heading">
      <span><Icon size={23} aria-hidden="true" /></span>
      <div><h2>{title}</h2><p>{description}</p></div>
      <button type="button" onClick={onClick}>{action} <ArrowRight size={17} /></button>
    </header>
  );
}
