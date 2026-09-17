import {
  CalendarBlank,
  ChatCircle,
  Clock,
  FileText,
  MapPin,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react";

export function CandidateCard({ candidate, color, onOpen, onDragStart }) {
  const requirements = candidate.requirements?.replace(/\s+comprovados?$/i, " requisitos");
  const route = candidate.route?.replace(/conduções|condução/gi, "cond.");
  const stageTime = candidate.stageTime?.replace(/\s+na etapa$/i, "");
  return (
    <article
      className="candidate-card"
      draggable
      onDragStart={(event) => onDragStart(event, candidate.id)}
      onClick={() => onOpen(candidate)}
      onKeyDown={(event) => event.key === "Enter" && onOpen(candidate)}
      tabIndex={0}
      style={{ "--stage-color": color }}
      aria-label={`Abrir candidato ${candidate.name}`}
    >
      <div className="candidate-card-top">
        {candidate.photo ? <img src={candidate.photo} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span className="avatar-fallback">{candidate.initials}</span>}
        <div className="candidate-identity"><strong>{candidate.name}</strong><small>{candidate.source}</small></div>
        <span className={`evidence-badge ${candidate.evidenceTone}`}>{candidate.evidence}</span>
      </div>
      {candidate.duplicate && <div className="duplicate-warning"><WarningCircle size={14} weight="fill" /> {candidate.duplicate}</div>}
      <div className="card-fact card-fact-summary" title={candidate.requirements}><FileText size={14} /><span>{requirements}</span></div>
      <div className="card-fact card-fact-summary" title={candidate.route}><MapPin size={14} /><span>{route}</span><small>{candidate.fare}</small></div>
      <div className="card-footer"><span title="Tempo na etapa" aria-label={`Tempo na etapa: ${candidate.stageTime}`}><Clock size={14} />{stageTime}</span><span><UserCircle size={14} />{candidate.owner}</span><span><ChatCircle size={14} />{candidate.messages}</span><CalendarBlank size={14} /></div>
    </article>
  );
}
