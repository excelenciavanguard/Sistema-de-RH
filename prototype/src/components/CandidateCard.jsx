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
      <div className="card-fact"><FileText size={14} /><span>{candidate.requirements}</span><button type="button" aria-label="Abrir currículo" onClick={(event) => { event.stopPropagation(); onOpen(candidate); }}><FileText size={15} /> CV</button></div>
      <div className="card-fact"><MapPin size={14} /><span>{candidate.route}</span><small>{candidate.fare}</small></div>
      <div className="card-footer"><span><Clock size={14} />{candidate.stageTime}</span><span><UserCircle size={14} />{candidate.owner}</span><span><ChatCircle size={14} />{candidate.messages}</span><CalendarBlank size={14} /></div>
    </article>
  );
}
