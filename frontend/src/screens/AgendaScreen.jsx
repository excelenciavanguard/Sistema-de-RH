import { useMemo, useState } from "react";
import { AlertTriangle, BriefcaseBusiness, CalendarDays, CalendarPlus, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, List, MapPin, Pencil, Plus, UserRound, UsersRound, Video, X } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { StatusPill } from "../components/StatusPill.jsx";

const weekDays = ["Seg 21/04", "Ter 22/04", "Qua 23/04", "Qui 24/04", "Sex 25/04", "Sáb 26/04", "Dom 27/04"];
const calendarOptions = ["Minha agenda", "Equipe RH", "Gestores"];
const typeOptions = [["interview", "Entrevistas"], ["task", "Tarefas e prazos"], ["training", "Treinamentos"]];

const monthEvents = [
  { id: 1, date: 1, start: 9, duration: 1, type: "interview", title: "Entrevista RH", person: "Beatriz Nunes", vacancy: "Recepcionista", responsible: "Letícia Silva (RH)", location: "Sala 3 · RH", status: "Confirmada", calendar: "Minha agenda" },
  { id: 2, date: 1, start: 14, duration: 1, type: "training", title: "Treinamento", person: "Integração", vacancy: "Admissão e integração", responsible: "Equipe RH", location: "Sala 1 · RH", status: "Pendente", calendar: "Equipe RH" },
  { id: 3, date: 2, start: 10.5, duration: 1, type: "interview", title: "Entrevista Gestor", person: "André Cardoso", vacancy: "Porteiro", responsible: "Carlos Almeida (Gestor)", location: "Teams", status: "Confirmada", calendar: "Gestores" },
  { id: 4, date: 3, start: 11, duration: 1, type: "task", title: "Prazo da vaga", person: "Leblon Power", vacancy: "Auxiliar de Serviços Gerais", responsible: "Lucas", location: "Entrega", status: "Pendente", calendar: "Minha agenda" },
  { id: 5, date: 7, start: 9, duration: 1, type: "interview", title: "Entrevista RH", person: "Eduardo Silva", vacancy: "Auxiliar Operacional", responsible: "Letícia Silva (RH)", location: "Sala 2 · RH", status: "Confirmada", calendar: "Minha agenda" },
  { id: 6, date: 7, start: 15, duration: 1, type: "training", title: "Integração", person: "Novos colaboradores", vacancy: "Admissão e integração", responsible: "Equipe RH", location: "Sala 1 · RH", status: "Pendente", calendar: "Equipe RH" },
  { id: 7, date: 9, start: 10, duration: 1, type: "training", title: "Treinamento", person: "Segurança operacional", vacancy: "Turma de abril", responsible: "Equipe RH", location: "Auditório", status: "Confirmada", calendar: "Equipe RH" },
  { id: 8, date: 9, start: 16, duration: 1, type: "interview", title: "Entrevista RH", person: "Fernanda Rocha", vacancy: "Supervisora de Limpeza", responsible: "Letícia Silva (RH)", location: "Teams", status: "Confirmada", calendar: "Minha agenda" },
  { id: 9, date: 11, start: 14, duration: 1, type: "interview", title: "Entrevista Gestor", person: "Rafael Costa", vacancy: "Vigia", responsible: "Carlos Almeida (Gestor)", location: "Teams", status: "Pendente", calendar: "Gestores" },
  { id: 10, date: 15, start: 9, duration: 1, type: "interview", title: "Entrevista RH", person: "Juliana Alves", vacancy: "Recepcionista", responsible: "Letícia Silva (RH)", location: "Sala 3 · RH", status: "Confirmada", calendar: "Minha agenda" },
  { id: 11, date: 16, start: 10, duration: 1, type: "training", title: "Integração", person: "Novos colaboradores", vacancy: "Admissão e integração", responsible: "Equipe RH", location: "Sala 1 · RH", status: "Pendente", calendar: "Equipe RH" },
  { id: 12, date: 16, start: 14, duration: 1, type: "interview", title: "Entrevista Gestor", person: "Mariana Lima", vacancy: "Auxiliar de Limpeza", responsible: "Carlos Almeida (Gestor)", location: "Teams", status: "Confirmada", calendar: "Gestores" },
  { id: 13, date: 18, start: 9, duration: 1, type: "task", title: "Prazo da vaga", person: "Bay View Botafogo", vacancy: "Porteiro", responsible: "Ana Marques", location: "Entrega", status: "Pendente", calendar: "Equipe RH" },
  { id: 14, date: 22, start: 9, duration: 1, type: "interview", title: "Entrevista RH", person: "Rafael Santos", vacancy: "Auxiliar de Serviços Gerais", responsible: "Letícia Silva (RH)", location: "Sala 3 · RH", status: "Confirmada", calendar: "Minha agenda" },
  { id: 15, date: 22, start: 11, duration: 1, type: "interview", title: "Entrevista Gestor", person: "Mariana Lima", vacancy: "Auxiliar de Serviços Gerais", responsible: "Carlos Almeida (Gestor)", location: "Teams", status: "Conflito de horário", conflict: true, calendar: "Gestores" },
  { id: 16, date: 22, start: 14, duration: 2, type: "training", title: "Treinamento — Integração", person: "Equipe de novos colaboradores", vacancy: "Admissão e integração", responsible: "Letícia Silva (RH)", location: "Sala 1 · RH", status: "Pendente", calendar: "Equipe RH" },
  { id: 17, date: 24, start: 10, duration: 1, type: "interview", title: "Entrevista RH", person: "Paulo Henrique", vacancy: "Auxiliar de Serviços Gerais", responsible: "Letícia Silva (RH)", location: "Sala 2 · RH", status: "Confirmada", calendar: "Minha agenda" },
  { id: 18, date: 24, start: 13, duration: 1, type: "task", title: "Retorno ao candidato", person: "Beatriz Nunes", vacancy: "Recepcionista", responsible: "Equipe RH", location: "WhatsApp", status: "Pendente", calendar: "Equipe RH" },
  { id: 19, date: 24, start: 15, duration: 1, type: "interview", title: "Entrevista Gestor", person: "André Cardoso", vacancy: "Porteiro", responsible: "Carlos Almeida (Gestor)", location: "Teams", status: "Pendente", calendar: "Gestores" },
  { id: 20, date: 28, start: 9, duration: 1, type: "training", title: "Integração", person: "Novos colaboradores", vacancy: "Admissão e integração", responsible: "Equipe RH", location: "Sala 1 · RH", status: "Confirmada", calendar: "Equipe RH" },
  { id: 21, date: 30, start: 14, duration: 1, type: "task", title: "Prazo da vaga", person: "Comrio Ilha", vacancy: "Encarregado Operacional", responsible: "Lucas", location: "Entrega", status: "Pendente", calendar: "Minha agenda" },
];

const monthCells = [
  { date: 31, month: "Mar", muted: true },
  ...Array.from({ length: 30 }, (_, index) => ({ date: index + 1, month: "Abr", muted: false })),
  ...Array.from({ length: 4 }, (_, index) => ({ date: index + 1, month: "Mai", muted: true })),
];

export function AgendaScreen() {
  const [mode, setMode] = useState("month");
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedCalendars, setSelectedCalendars] = useState(() => new Set(calendarOptions));
  const [selectedTypes, setSelectedTypes] = useState(() => new Set(typeOptions.map(([value]) => value)));
  const [drawer, setDrawer] = useState(null);
  const filteredEvents = useMemo(() => monthEvents.filter((event) => selectedCalendars.has(event.calendar) && selectedTypes.has(event.type)), [selectedCalendars, selectedTypes]);

  function toggleSet(setter, value) {
    setter((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <main className="screen-workspace agenda-command-screen">
      <ScreenHeader title="Agenda" description="Entrevistas, tarefas e compromissos da equipe." actions={<><button className="secondary-action"><Plus size={17} />Novo compromisso</button><button className="primary-action"><CalendarPlus size={17} />Agendar entrevista</button></>} />
      <section className="surface-panel agenda-command-surface">
        <header className="agenda-command-toolbar">
          <div className="agenda-date-navigation"><button type="button" aria-label="Período anterior"><ChevronLeft /></button><button type="button">Hoje</button><button type="button" aria-label="Próximo período"><ChevronRight /></button><strong>{mode === "day" ? "22 de abril de 2025" : "Abril de 2025"}</strong></div>
          <div className="agenda-toolbar-actions">
            <FilterMenu label="Calendários" open={openFilter === "calendars"} onToggle={() => setOpenFilter((current) => current === "calendars" ? null : "calendars")}>
              {calendarOptions.map((label) => <label key={label}><input type="checkbox" checked={selectedCalendars.has(label)} onChange={() => toggleSet(setSelectedCalendars, label)} />{label}</label>)}
            </FilterMenu>
            <FilterMenu label="Tipos" open={openFilter === "types"} onToggle={() => setOpenFilter((current) => current === "types" ? null : "types")}>
              {typeOptions.map(([value, label]) => <label key={value}><input type="checkbox" checked={selectedTypes.has(value)} onChange={() => toggleSet(setSelectedTypes, value)} />{label}</label>)}
            </FilterMenu>
            <button type="button" className="agenda-list-button" onClick={() => setDrawer({ kind: "list" })}><List />Lista de compromissos</button>
            <div className="agenda-view-switch" role="group" aria-label="Visualização da agenda">
              {[["month", "Mês"], ["week", "Semana"], ["day", "Dia"]].map(([id, label]) => <button key={id} type="button" className={mode === id ? "active" : ""} aria-pressed={mode === id} onClick={() => setMode(id)}>{label}</button>)}
            </div>
          </div>
        </header>
        {mode === "month" && <MonthView events={filteredEvents} onSelectDay={(date) => setDrawer({ kind: "day", date })} />}
        {mode === "week" && <WeekView events={filteredEvents.filter((event) => event.date >= 21 && event.date <= 27)} onSelectDay={(date) => setDrawer({ kind: "day", date })} />}
        {mode === "day" && <DayView events={filteredEvents.filter((event) => event.date === 22)} />}
      </section>
      {drawer && <AgendaDrawer drawer={drawer} events={filteredEvents} onClose={() => setDrawer(null)} />}
    </main>
  );
}

function FilterMenu({ label, open, onToggle, children }) {
  return <div className="agenda-filter-menu"><button type="button" aria-expanded={open} onClick={onToggle}>{label}<ChevronDown /></button>{open && <div className="agenda-filter-popover" role="menu" aria-label={`Filtrar ${label.toLowerCase()}`}>{children}</div>}</div>;
}

function MonthView({ events, onSelectDay }) {
  return <div className="agenda-month-view" data-testid="agenda-month-view"><div className="agenda-month-weekdays" aria-hidden="true">{["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day) => <span key={day}>{day}</span>)}</div><div className="agenda-month-grid">{monthCells.map((cell) => {
    const dayEvents = cell.muted ? [] : events.filter((event) => event.date === cell.date);
    return <button type="button" key={`${cell.month}-${cell.date}`} className={`agenda-month-day${cell.muted ? " muted" : ""}${cell.date === 22 && !cell.muted ? " selected" : ""}`} aria-label={cell.muted ? `${cell.date} de ${cell.month}` : `Abrir ${dayTitle(cell.date).toLowerCase()}`} onClick={() => !cell.muted && onSelectDay(cell.date)}><strong>{cell.date}</strong><span className="agenda-month-events">{dayEvents.slice(0, 3).map((event) => <span key={event.id} className={`agenda-month-event ${event.type}`}><time>{formatTime(event.start)}</time>{event.title}</span>)}{dayEvents.length > 3 && <small>+{dayEvents.length - 3} compromissos</small>}</span></button>;
  })}</div></div>;
}

function WeekView({ events, onSelectDay }) {
  return <div className="agenda-week-board" data-testid="agenda-week-view">
    <div className="agenda-week-days">{weekDays.map((day, index) => {
      const date = index + 21;
      const dayEvents = events.filter((event) => event.date === date).sort((a, b) => a.start - b.start);
      return <section className={`agenda-week-day${date === 22 ? " selected" : ""}`} key={day}>
        <button type="button" className="agenda-week-day-heading" aria-label={`Abrir ${dayTitle(date).toLowerCase()}`} onClick={() => onSelectDay(date)}>
          <span>{day.split(" ")[0]}</span><strong>{date}</strong><small>{dayEvents.length ? `${dayEvents.length} compromissos` : "Dia livre"}</small>
        </button>
        <div className="agenda-week-appointments">{dayEvents.length ? dayEvents.map((event) => <AgendaEvent key={event.id} event={event} onClick={() => onSelectDay(date)} />) : <p className="agenda-week-empty">Sem compromissos</p>}</div>
      </section>;
    })}</div>
  </div>;
}

function DayView({ events }) {
  const orderedEvents = [...events].sort((a, b) => a.start - b.start || a.id - b.id);
  return <div className="agenda-day-view agenda-focused-day" data-testid="agenda-day-view">
    <header><div><span aria-hidden="true"><CalendarDays /></span><div><h2>Terça-feira, 22 de abril</h2><p aria-live="polite">{events.length} {events.length === 1 ? "compromisso programado" : "compromissos programados"}</p></div></div></header>
    {orderedEvents.length ? <ol className="agenda-day-timeline" aria-label="Compromissos do dia em ordem de horário">
      {orderedEvents.map((event) => <li key={event.id} className={`agenda-day-slot ${event.type}${event.conflict ? " has-conflict" : ""}`}>
        <div className="agenda-day-time" aria-label={`Das ${formatTime(event.start)} às ${formatTime(event.start + event.duration)}`}>
          <time dateTime={`2025-04-22T${formatTime(event.start)}`}>{formatTime(event.start)}</time>
          <time dateTime={`2025-04-22T${formatTime(event.start + event.duration)}`}>{formatTime(event.start + event.duration)}</time>
        </div>
        <DayEvent event={event} />
      </li>)}
    </ol> : <div className="agenda-empty-day"><CalendarDays aria-hidden="true" /><strong>Nenhum compromisso com os filtros atuais</strong><p>Revise os filtros Calendários e Tipos para exibir outros compromissos.</p></div>}
  </div>;
}

function DayEvent({ event }) {
  const tone = event.conflict ? "danger" : event.status === "Confirmada" ? "success" : "warning";
  return <article className="agenda-day-event" aria-labelledby={`agenda-day-event-${event.id}`}>
    <header className="agenda-day-event-heading">
      <div><span>{event.title}</span><h3 id={`agenda-day-event-${event.id}`}>{event.person}</h3></div>
      <StatusPill tone={tone}>{event.status}</StatusPill>
    </header>
    {event.conflict && <p className="agenda-day-conflict"><AlertTriangle aria-hidden="true" />Conflito ilustrativo — verificar antes de agendar.</p>}
    <div className="agenda-day-event-body">
      <dl>
        <div><dt><BriefcaseBusiness aria-hidden="true" /><span className="sr-only">{event.type === "interview" ? "Vaga" : "Assunto"}</span></dt><dd>{event.type === "interview" ? "Vaga" : "Assunto"}: {event.vacancy}</dd></div>
        <div><dt><UserRound aria-hidden="true" /><span className="sr-only">Responsável</span></dt><dd>Responsável: {event.responsible}</dd></div>
        <div><dt>{event.location === "Teams" ? <Video aria-hidden="true" /> : <MapPin aria-hidden="true" />}<span className="sr-only">Local</span></dt><dd>{event.location}</dd></div>
      </dl>
      <footer><button type="button"><Pencil aria-hidden="true" />Editar</button>{event.type === "interview" && <button type="button"><ExternalLink aria-hidden="true" />Abrir candidato</button>}</footer>
    </div>
  </article>;
}

function AgendaEvent({ event, onClick }) {
  return <button type="button" className={`agenda-week-appointment ${event.type}`} onClick={onClick} aria-label={`${event.title}, ${event.person}, ${formatTime(event.start)}`}><time>{formatTime(event.start)} – {formatTime(event.start + event.duration)}</time><strong>{event.title}</strong><span>{event.person}</span><small>{event.location === "Teams" ? <Video size={13} /> : <MapPin size={13} />}{event.location}</small>{event.conflict && <em><AlertTriangle size={13} />Conflito de horário</em>}</button>;
}

function AgendaDrawer({ drawer, events, onClose }) {
  const isList = drawer.kind === "list";
  const drawerEvents = [...(isList ? events : events.filter((event) => event.date === drawer.date))].sort((a, b) => a.date - b.date || a.start - b.start);
  const title = isList ? "Lista de compromissos" : dayTitle(drawer.date);
  return <div className="agenda-drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="agenda-day-drawer" role="dialog" aria-modal="true" aria-label={title}><header className="agenda-drawer-header"><div><span>{isList ? <List /> : <CalendarDays />}</span><div><h2>{title}</h2><p>{isList ? `${drawerEvents.length} compromissos programados` : `${drawerEvents.length} compromissos neste dia`}</p></div></div><button type="button" aria-label="Fechar detalhes do dia" onClick={onClose}><X /></button></header><div className="agenda-drawer-scroll">{drawerEvents.length ? drawerEvents.map((event) => <DetailedEvent key={event.id} event={event} showDate={isList} />) : <div className="agenda-empty-day"><CalendarDays /><strong>Nenhum compromisso</strong><p>Este dia está livre para novos agendamentos.</p></div>}</div><footer><button type="button" className="primary-action"><Plus size={16} />Novo compromisso</button></footer></aside></div>;
}

function DetailedEvent({ event, showDate = false, compact = false }) {
  const tone = event.conflict ? "danger" : event.status === "Confirmada" ? "success" : "warning";
  return <article className={`agenda-detail-event ${event.type}${compact ? " compact" : ""}`}><div className="agenda-detail-event-heading"><span><time>{showDate ? `${String(event.date).padStart(2, "0")}/04 · ` : ""}{formatTime(event.start)} – {formatTime(event.start + event.duration)}</time><strong>{event.title}</strong></span><StatusPill tone={tone}>{event.status}</StatusPill></div>{event.conflict && <p className="agenda-conflict"><AlertTriangle />Outro compromisso utiliza este horário.</p>}<dl><div><dt><UserRound /></dt><dd>{event.person}</dd></div><div><dt><BriefcaseBusiness /></dt><dd>Vaga: {event.vacancy}</dd></div><div><dt><UsersRound /></dt><dd>Responsável: {event.responsible}</dd></div><div><dt>{event.location === "Teams" ? <Video /> : <MapPin />}</dt><dd>{event.location}</dd></div></dl><footer><button type="button"><Pencil />Editar</button>{event.type === "interview" && <button type="button"><ExternalLink />Abrir candidato</button>}</footer></article>;
}

function dayTitle(date) {
  const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return `${dayNames[(date + 1) % 7]}, ${date} de abril`;
}

function formatTime(value) {
  const hoursValue = Math.floor(value);
  return `${String(hoursValue).padStart(2, "0")}:${value % 1 ? "30" : "00"}`;
}
