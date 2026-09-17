import { Plus } from "@phosphor-icons/react";
import { CandidateCard } from "./CandidateCard.jsx";

export function KanbanBoard({ stages, candidates, onMove, onOpen }) {
  function handleDrop(event, stageId) {
    event.preventDefault();
    const rawId = event.dataTransfer.getData("candidateId");
    const candidate = candidates.find((item) => String(item.id) === rawId);
    if (candidate) onMove(candidate.id, stageId);
    event.currentTarget.classList.remove("drag-over");
  }

  function handleDragStart(event, id) {
    event.dataTransfer.setData("candidateId", String(id));
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <section className="kanban-board" aria-label="Quadro de candidatos">
      {stages.map((stage, index) => {
        const items = candidates.filter((candidate) => candidate.stage === stage.id);
        return (
          <div
            className="kanban-column"
            key={stage.id}
            onDragOver={(event) => { event.preventDefault(); event.currentTarget.classList.add("drag-over"); }}
            onDragLeave={(event) => event.currentTarget.classList.remove("drag-over")}
            onDrop={(event) => handleDrop(event, stage.id)}
            style={{ "--stage-color": stage.color }}
          >
            <header className="column-header"><div><small className="stage-sequence">Etapa {index + 1} de {stages.length}</small><strong>{stage.label}</strong><small>SLA: {stage.sla}</small></div><span>{items.length}</span></header>
            <div className="column-cards">
              {items.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} color={stage.color} onOpen={onOpen} onDragStart={handleDragStart} />)}
              {items.length === 0 && <div className="empty-stage"><Plus size={18} /> Arraste um candidato para esta etapa</div>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
