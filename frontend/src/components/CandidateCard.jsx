import {
  CalendarBlank,
  ChatCircle,
  Clock,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react";

export function CandidateCard({ candidate, color, onOpen, onDragStart }) {
  const stageTime = candidate.stageTime?.replace(/\s+na etapa$/i, "");
  const pendingItems = [
    candidate.duplicate && candidate.duplicate,
    candidate.evidenceTone === "warning" && "Informações ausentes",
    candidate.requirements && !candidate.requirements.startsWith("3/3") && candidate.requirements.replace(/\s+comprovados?$/i, " requisitos"),
    /pendente|conferir/i.test(candidate.route || "") && candidate.route,
  ].filter(Boolean);
  const pendingLabel = pendingItems.length > 1 ? `${pendingItems[0]} · +${pendingItems.length - 1}` : pendingItems[0];
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
      {pendingLabel && <button className="candidate-pending-alert" type="button" onClick={(event) => { event.stopPropagation(); onOpen(candidate); }} aria-label={`Ver pendências de ${candidate.name}: ${pendingItems.join(", ")}`}><WarningCircle size={14} weight="fill" /><span>{pendingLabel}</span></button>}
      <div className="card-footer"><span title="Tempo na etapa" aria-label={`Tempo na etapa: ${candidate.stageTime}`}><Clock size={14} />{stageTime}</span><span><UserCircle size={14} />{candidate.owner}</span><span><ChatCircle size={14} />{candidate.messages}</span><CalendarBlank size={14} /></div>
    </article>
  );
}
