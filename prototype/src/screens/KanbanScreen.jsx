import { useEffect, useMemo, useState } from "react";
import { Briefcase, CaretDown, Flask, Info, PencilSimple, UserCircle, UsersThree } from "@phosphor-icons/react";
import { CandidateModal } from "../components/CandidateModal.jsx";
import { ExtractionLab } from "../components/ExtractionLab.jsx";
import { KanbanBoard } from "../components/KanbanBoard.jsx";
import { SmartFilters } from "../components/SmartFilters.jsx";
import { initialCandidates, stages } from "../data.js";
import { listCandidates, moveCandidateStage } from "../services/candidates.js";
import { vacancies } from "../mockWorkspaceData.js";

export function KanbanScreen({ vacancyCode = "2026-0157" }) {
  const vacancy = vacancies.find((item) => item.code === vacancyCode);
  const demoCandidates = vacancyCode === "2026-0157" ? initialCandidates : [];
  const previewParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [candidates, setCandidates] = useState(demoCandidates);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(() => {
    const previewCandidateId = Number(previewParams.get("candidate"));
    return previewCandidateId ? demoCandidates.find((candidate) => candidate.id === previewCandidateId) ?? null : null;
  });
  const [labOpen, setLabOpen] = useState(false);

  useEffect(() => {
    let active = true;
    listCandidates(vacancyCode).then((persisted) => {
      if (!active) return;
      setCandidates((current) => [...persisted, ...current.filter((item) => !persisted.some((saved) => saved.id === item.id))]);
    }).catch(() => {});
    return () => { active = false; };
  }, [vacancyCode]);

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
        <div className="breadcrumbs">Recrutamento <span>/</span> Vagas <span>/</span> {vacancyCode}</div>
        <section className="vacancy-header">
          <div><div className="title-line"><h1>{vacancy.role} · {vacancy.post}</h1><span className="vacancy-status">{vacancy.status}</span></div><div className="vacancy-meta"><span><UsersThree size={17} /> {vacancyCode === "2026-0157" ? "27 candidatos" : `${candidates.length} candidatos no Kanban`}</span><span><UserCircle size={17} /> Responsável: {vacancy.owner}</span><span><Briefcase size={17} /> {vacancyCode === "2026-0157" ? "Escala 6×1 · 06h às 18h" : "Escala não definida no demonstrativo"}</span></div></div>
          <div className="vacancy-actions"><button className="secondary-action" onClick={() => setLabOpen(true)} type="button"><Flask size={18} /> Testar extração</button><button className="primary-action" type="button"><PencilSimple size={18} /> Editar vaga</button><button className="more-action" type="button">Mais <CaretDown size={14} /></button></div>
        </section>
        <nav className="vacancy-tabs" aria-label="Seções da vaga"><button type="button">Resumo</button><button className="active" type="button">Candidatos</button><button type="button">Entrevistas</button><button type="button">Divulgação</button><button type="button">Histórico</button></nav>
        <section className="board-surface">
          {vacancyCode !== "2026-0157" && <p className="vacancies-demo-note">Dados demonstrativos: esta vaga ainda não tem candidatos de exemplo vinculados. A contagem da lista de vagas é ilustrativa.</p>}
          <SmartFilters search={search} onSearch={setSearch} open={filtersOpen} onToggle={() => setFiltersOpen((value) => !value)} />
          <div className="mobility-notice"><Info size={17} weight="fill" /><span>A entrada considera até duas conduções na ida e duas na volta, nos horários reais da vaga. Casos sem rota confiável ficam em Mobilidade pendente.</span></div>
          <div className="kanban-scroll" tabIndex={0} role="region" aria-label="Navegar pelas etapas do Kanban">
            <KanbanBoard stages={stages} candidates={visibleCandidates} onMove={moveCandidate} onOpen={setSelectedCandidate} />
          </div>
        </section>
      </main>
      <CandidateModal candidate={selectedCandidate} initialTab={previewParams.get("tab") === "mobility" ? "Mobilidade" : "Resumo"} onClose={() => setSelectedCandidate(null)} />
      <ExtractionLab open={labOpen} onClose={() => setLabOpen(false)} vacancyCode={vacancyCode} onCandidateAdded={addCandidate} />
    </>
  );
}
