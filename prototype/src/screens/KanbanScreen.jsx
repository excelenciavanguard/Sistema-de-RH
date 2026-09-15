import { useEffect, useMemo, useState } from "react";
import { Briefcase, CaretDown, Flask, Info, PencilSimple, UserCircle, UsersThree } from "@phosphor-icons/react";
import { CandidateModal } from "../components/CandidateModal.jsx";
import { ExtractionLab } from "../components/ExtractionLab.jsx";
import { KanbanBoard } from "../components/KanbanBoard.jsx";
import { SmartFilters } from "../components/SmartFilters.jsx";
import { initialCandidates, stages } from "../data.js";
import { listCandidates, moveCandidateStage } from "../services/candidates.js";

const vacancyCode = "2026-0157";

export function KanbanScreen() {
  const previewParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(() => {
    const previewCandidateId = Number(previewParams.get("candidate"));
    return previewCandidateId ? initialCandidates.find((candidate) => candidate.id === previewCandidateId) ?? null : null;
  });
  const [labOpen, setLabOpen] = useState(false);

  useEffect(() => {
    let active = true;
    listCandidates(vacancyCode).then((persisted) => {
      if (!active) return;
      setCandidates((current) => [...persisted, ...current.filter((item) => !persisted.some((saved) => saved.id === item.id))]);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const visibleCandidates = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return candidates;
    return candidates.filter((candidate) => [candidate.name, candidate.role, candidate.source, candidate.location].some((value) => value.toLocaleLowerCase("pt-BR").includes(query)));
  }, [candidates, search]);

  async function moveCandidate(id, stage) {
    const previous = candidates.find((candidate) => candidate.id === id);
    if (!previous || previous.stage === stage) return;
    setCandidates((current) => current.map((candidate) => candidate.id === id ? { ...candidate, stage, stageTime: "Agora" } : candidate));
    if (previous.isDemo) return;
    try {
      const saved = await moveCandidateStage(id, stage);
      setCandidates((current) => current.map((candidate) => candidate.id === id ? saved : candidate));
    } catch {
      setCandidates((current) => current.map((candidate) => candidate.id === id ? previous : candidate));
    }
  }

  function addCandidate(candidate) {
    setCandidates((current) => current.some((item) => item.id === candidate.id)
      ? current.map((item) => item.id === candidate.id ? candidate : item)
      : [candidate, ...current]);
  }

  return (
    <>
      <main className="workspace">
        <div className="breadcrumbs">Recrutamento <span>/</span> Vagas <span>/</span> 2026-0157</div>
        <section className="vacancy-header">
          <div><div className="title-line"><h1>Auxiliar de Serviços Gerais · Leblon Power</h1><span className="vacancy-status">Ativa</span></div><div className="vacancy-meta"><span><UsersThree size={17} /> 27 candidatos</span><span><UserCircle size={17} /> Responsável: Lucas</span><span><Briefcase size={17} /> Escala 6×1 · 06h às 18h</span></div></div>
          <div className="vacancy-actions"><button className="secondary-action" onClick={() => setLabOpen(true)} type="button"><Flask size={18} /> Testar extração</button><button className="primary-action" type="button"><PencilSimple size={18} /> Editar vaga</button><button className="more-action" type="button">Mais <CaretDown size={14} /></button></div>
        </section>
        <nav className="vacancy-tabs" aria-label="Seções da vaga"><button type="button">Resumo</button><button className="active" type="button">Candidatos</button><button type="button">Entrevistas</button><button type="button">Divulgação</button><button type="button">Histórico</button></nav>
        <section className="board-surface">
          <SmartFilters search={search} onSearch={setSearch} open={filtersOpen} onToggle={() => setFiltersOpen((value) => !value)} />
          <div className="mobility-notice"><Info size={17} weight="fill" /><span>A entrada considera até duas conduções na ida e duas na volta, nos horários reais da vaga. Casos sem rota confiável ficam em Mobilidade pendente.</span></div>
          <KanbanBoard stages={stages} candidates={visibleCandidates} onMove={moveCandidate} onOpen={setSelectedCandidate} />
        </section>
      </main>
      <CandidateModal candidate={selectedCandidate} initialTab={previewParams.get("tab") === "mobility" ? "Mobilidade" : "Resumo"} onClose={() => setSelectedCandidate(null)} />
      <ExtractionLab open={labOpen} onClose={() => setLabOpen(false)} vacancyCode={vacancyCode} onCandidateAdded={addCandidate} />
    </>
  );
}
