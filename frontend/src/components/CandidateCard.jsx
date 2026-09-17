import {
  ChatCircle,
  Clock,
  CheckCircle,
  MapPin,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { getEvidenceLabel } from "./evidenceLabels.js";

export function CandidateCard({ candidate, color, onOpen, onDragStart }) {
  const evidenceLabel = getEvidenceLabel(candidate.evidence) || "Pendente";
  const counts = candidate.requirements?.match(/(\d+)\s*\/\s*(\d+)/);
  const incomplete = !counts || Number(counts[1]) < Number(counts[2]) || candidate.evidenceTone === "warning";
  const requirementsLabel = counts
    ? `${counts[1]}/${counts[2]} requisitos · ${evidenceLabel.toLowerCase()}`
    : `Requisitos · ${evidenceLabel.toLowerCase()}`;
  return (
    <article
      className="candidate-card"
      draggable
      onDragStart={(event) => onDragStart?.(event, candidate.id)}
      onClick={() => onOpen(candidate)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(candidate);
        }
      }}
      tabIndex={0}
      style={{ "--stage-color": color }}
      aria-label={`Abrir candidato ${candidate.name}`}
    >
      <div className="candidate-card-top">
        {candidate.photo ? <img src={candidate.photo} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span className="avatar-fallback">{candidate.initials}</span>}
        <div className="candidate-identity"><strong>{candidate.name}</strong><small>{candidate.source}</small></div>
      </div>
      <div className="candidate-card-facts">
        <span className={`candidate-card-requirements${incomplete ? " is-pending" : ""}`} title="Origem das informações; não significa validação pelo RH.">{incomplete ? <WarningCircle size={14} /> : <CheckCircle size={14} />}<span>{requirementsLabel}</span></span>
        <span title={candidate.fare || undefined}><MapPin size={14} /><span>{candidate.route || "Deslocamento a confirmar"}</span></span>
      </div>
      {candidate.duplicate && <button className="candidate-pending-alert" type="button" onClick={(event) => { event.stopPropagation(); onOpen(candidate); }} aria-label={`Ver alerta de ${candidate.name}: ${candidate.duplicate}`}><WarningCircle size={14} weight="fill" /><span>{candidate.duplicate}</span></button>}
      <div className="card-footer"><span title="Tempo na etapa" aria-label={`Tempo na etapa: ${candidate.stageTime}`}><Clock size={14} />{candidate.stageTime || "Tempo não informado"}</span><span title="Responsável"><UserCircle size={14} />{candidate.owner || "Sem responsável"}</span><span aria-label={`${candidate.messages || 0} comentários`}><ChatCircle size={14} />{candidate.messages || 0}</span></div>
    </article>
  );
}
