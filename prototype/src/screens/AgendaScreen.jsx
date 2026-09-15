import { useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, MapPin, Plus, UsersRound, Video } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { StatusPill } from "../components/StatusPill.jsx";
import { agendaEvents } from "../moduleWorkspaceData.js";

const days = ["Seg 21/04", "Ter 22/04", "Qua 23/04", "Qui 24/04", "Sex 25/04", "Sáb 26/04", "Dom 27/04"];
const hours = Array.from({ length: 11 }, (_, index) => index + 8);

export function AgendaScreen() {
  const [mode, setMode] = useState("week");
  return (
    <main className="screen-workspace miro-screen agenda-reference-screen">
      <ScreenHeader title="Agenda" description="Entrevistas, tarefas e compromissos da equipe." actions={<><button className="secondary-action"><Plus size={17} />Novo compromisso</button><button className="primary-action"><CalendarPlus size={17} />Agendar entrevista</button></>} />
      <section className="agenda-reference-layout">
        <aside className="surface-panel calendar-filters">
          <h2>Calendários</h2>
          {["Minha agenda", "Equipe RH", "Gestores"].map((label, index) => <label key={label}><input type="checkbox" defaultChecked={index === 0} />{label}</label>)}
          <hr />
          <h2>Tipos de compromisso</h2>
          <label><input type="checkbox" defaultChecked />Entrevista</label>
          <label><input type="checkbox" defaultChecked />Tarefa</label>
          <label><input type="checkbox" defaultChecked />Treinamento</label>
        </aside>

        <section className="surface-panel calendar-board">
          <header className="calendar-toolbar"><div><button aria-label="Período anterior"><ChevronLeft /></button><button>Hoje</button><button aria-label="Próximo período"><ChevronRight /></button><strong>Abril de 2025</strong></div><div>{[["month", "Mês"], ["week", "Semana"], ["day", "Dia"]].map(([id, label]) => <button key={id} className={mode === id ? "active" : ""} onClick={() => setMode(id)}>{label}</button>)}</div></header>
          {mode === "day" ? (
            <div className="agenda-day-view" data-testid="agenda-day-view"><h3>Terça-feira, 22 de abril</h3>{agendaEvents.filter((event) => event.day === 1).map((event) => <AgendaEvent key={event.id} event={event} />)}</div>
          ) : (
            <div className={`weekly-calendar ${mode}`} data-testid={`agenda-${mode}-view`}>
              <div className="calendar-corner" />
              {days.map((day, index) => <div className={`calendar-day-head ${index === 1 ? "today" : ""}`} key={day}>{day.split(" ")[0]}<strong>{day.split(" ")[1]}</strong></div>)}
              <div className="calendar-hours">{hours.map((hour) => <span key={hour}>{String(hour).padStart(2, "0")}:00</span>)}</div>
              <div className="calendar-grid-lines">{hours.map((hour) => <i key={hour} />)}</div>
              <div className="calendar-columns">{days.map((day) => <i key={day} />)}</div>
              {agendaEvents.map((event) => <AgendaEvent key={event.id} event={event} positioned />)}
            </div>
          )}
        </section>

        <aside className="surface-panel upcoming-panel">
          <header><h2>Próximos compromissos</h2><button>Ver todos</button></header>
          {agendaEvents.slice(0, 3).map((event, index) => <article key={event.id} className={event.type}><div><time>{22 + index}/04/2025 · {String(event.start).padStart(2, "0")}:00</time><StatusPill tone={event.status === "Confirmada" ? "success" : "warning"}>{event.status}</StatusPill></div><strong>{event.title} — {event.person}</strong><span>Vaga: Auxiliar de Serviços Gerais</span><small>{event.location === "Teams" ? <Video size={14} /> : <MapPin size={14} />}{event.location}</small></article>)}
        </aside>
      </section>
    </main>
  );
}

function AgendaEvent({ event, positioned = false }) {
  const style = positioned ? { "--event-day": event.day, "--event-start": event.start - 8, "--event-duration": event.duration } : undefined;
  return <article className={`calendar-event ${event.type}`} style={style}><time>{String(event.start).padStart(2, "0")}:00 – {String(event.start + event.duration).padStart(2, "0")}:00</time><strong>{event.title}</strong><span>{event.person}</span><small>{event.type === "interview" ? <UsersRound size={12} /> : <MapPin size={12} />}{event.location}</small></article>;
}
