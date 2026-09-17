import { useEffect, useMemo, useState } from "react";
import { Briefcase, CaretDown, Flask, Info, PencilSimple, UserCircle, UsersThree } from "@phosphor-icons/react";
import { CandidateModal } from "../components/CandidateModal.jsx";
import { ExtractionLab } from "../components/ExtractionLab.jsx";
import { KanbanBoard } from "../components/KanbanBoard.jsx";
import { CandidateWorkspaceControls, SmartFilters } from "../components/SmartFilters.jsx";
import { InterviewLoading, InterviewsWorkspace, PromotionWorkspace, ReplacementConfirmation, CandidateList, RejectedCandidates, VacancySummary } from "../components/VacancyWorkspaceViews.jsx";
import { InterviewMode, InterviewSummary, InterviewCompletion } from "../components/interview/InterviewWorkspace.jsx";
import { initialCandidates, stages } from "../data.js";
import { listCandidates, moveCandidateStage } from "../services/candidates.js";
import { vacancies } from "../mockWorkspaceData.js";
import "./KanbanScreen.css";

export function KanbanScreen({ vacancyCode = "2026-0157", onInterviewModeChange }) {
  const vacancy = vacancies.find((item) => item.code === vacancyCode);
  const demoCandidates = vacancyCode === "2026-0157" ? initialCandidates : [];
  const previewParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [candidates, setCandidates] = useState(demoCandidates);
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("candidates");
  const [candidateView, setCandidateView] = useState("kanban");
  const [activeFilters, setActiveFilters] = useState({ triage: "all", evidence: "all", experience: "all", education: "all", mobility: "all" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [interviewSession, setInterviewSession] = useState(null);
  const [interviewResults, setInterviewResults] = useState({});
  const [summaryInterview, setSummaryInterview] = useState(null);
  const [replacementInterview, setReplacementInterview] = useState(null);
  const [publishedChannels, setPublishedChannels] = useState({ rioVagas: false, site: false, indeed: false, linkedin: false, whatsapp: false });
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

  useEffect(() => {
    onInterviewModeChange?.(Boolean(interviewSession));
    return () => onInterviewModeChange?.(false);
  }, [interviewSession, onInterviewModeChange]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [interviewSession?.phase]);

  function startInterview(interview, replacement = false) {
    setSummaryInterview(null);
    setInterviewSession({ phase: "loading", interview, replacement });
  }

  function finishInterview(result) {
    setInterviewResults((current) => ({ ...current, [result.name]: result }));
    setInterviewSession({ phase: "completed", interview: result });
  }

  const visibleCandidates = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return candidates.filter((candidate) => {
      const matchesQuery = !query || [candidate.name, candidate.role, candidate.source, candidate.location].some((value) => value.toLocaleLowerCase("pt-BR").includes(query));
      const matchesTriage = activeFilters.triage === "all" || (activeFilters.triage === "initial" ? candidate.stage === "application" : candidate.requirements !== "3/3 comprovados");
      const matchesEvidence = activeFilters.evidence === "all" || (activeFilters.evidence === "confirmed" ? candidate.evidence === "Comprovado" : candidate.evidence === "Declarado");
      const matchesExperience = activeFilters.experience === "all" || (activeFilters.experience === "leadership" ? candidate.experience.toLocaleLowerCase("pt-BR").includes("lideran") : !candidate.experience.toLocaleLowerCase("pt-BR").includes("confirmar"));
      const matchesEducation = activeFilters.education === "all" || (activeFilters.education === "high_school" ? candidate.education === "Ensino médio completo" : candidate.education !== "Ensino médio completo");
      const matchesMobility = activeFilters.mobility === "all" || (activeFilters.mobility === "pending" ? candidate.route.toLocaleLowerCase("pt-BR").includes("pendente") || candidate.route.toLocaleLowerCase("pt-BR").includes("conferir") : !candidate.route.toLocaleLowerCase("pt-BR").includes("pendente") && !candidate.route.toLocaleLowerCase("pt-BR").includes("conferir"));
      return matchesQuery && matchesTriage && matchesEvidence && matchesExperience && matchesEducation && matchesMobility;
    });
  }, [activeFilters, candidates, search]);

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

  if (interviewSession?.phase === "loading") {
    return <InterviewLoading interview={interviewSession.interview} onComplete={() => setInterviewSession((current) => current ? { ...current, phase: "active" } : null)} />;
  }

  if (interviewSession?.phase === "active") {
    return <InterviewMode interview={interviewSession.interview} vacancy={vacancy} initialResult={interviewSession.replacement ? null : interviewResults[interviewSession.interview.name]} onFinish={finishInterview} onExit={() => setInterviewSession(null)} />;
  }

  if (interviewSession?.phase === "completed") {
    return <InterviewCompletion result={interviewSession.interview} onBack={() => setInterviewSession(null)} />;
  }

  return (
    <>
      <main className="workspace recruitment-workspace">
        <div className="breadcrumbs">Recrutamento <span>/</span> Vagas <span>/</span> {vacancyCode}</div>
        <section className="vacancy-header">
          <div><div className="title-line"><h1>{vacancy.role} · {vacancy.post}</h1><span className="vacancy-status">{vacancy.status}</span></div><div className="vacancy-meta"><span><UsersThree size={17} /> {vacancyCode === "2026-0157" ? "27 candidatos" : `${candidates.length} candidatos no Kanban`}</span><span><UserCircle size={17} /> Responsável: {vacancy.owner}</span><span><Briefcase size={17} /> {vacancyCode === "2026-0157" ? "Escala 6×1 · 06h às 18h" : "Escala não definida no demonstrativo"}</span></div></div>
          <div className="vacancy-command-area"><div className="vacancy-actions"><button className="secondary-action" onClick={() => setLabOpen(true)} type="button"><Flask size={18} /> Testar extração</button><button className="primary-action" type="button"><PencilSimple size={18} /> Editar vaga</button><button className="more-action" type="button">Mais <CaretDown size={14} /></button></div>{section === "candidates" ? <CandidateWorkspaceControls activeFilters={activeFilters} candidateView={candidateView} onFiltersChange={setActiveFilters} onViewChange={setCandidateView} open={filtersOpen} onToggle={() => setFiltersOpen((value) => !value)} /> : null}</div>
        </section>
        <nav className="vacancy-tabs" role="tablist" aria-label="Seções da vaga">{[["summary", "Resumo"], ["candidates", "Candidatos"], ["interviews", "Entrevistas"], ["promotion", "Divulgação"]].map(([id, label]) => <button className={section === id ? "active" : ""} key={id} type="button" role="tab" aria-selected={section === id} onClick={() => { setSection(id); if (id !== "interviews") setSummaryInterview(null); }}>{label}</button>)}</nav>
        {section === "summary" ? <VacancySummary candidates={candidates} stages={stages} vacancy={vacancy} /> : null}
        {section === "interviews" ? (summaryInterview ? <InterviewSummary result={interviewResults[summaryInterview.name]} onBack={() => setSummaryInterview(null)} onStartReplacement={() => setReplacementInterview(summaryInterview)} /> : <InterviewsWorkspace results={interviewResults} onOpenSummary={setSummaryInterview} onRequestReplacement={setReplacementInterview} onStartInterview={startInterview} />) : null}
        {section === "promotion" ? <PromotionWorkspace publishedChannels={publishedChannels} onPublish={(channel) => setPublishedChannels((current) => ({ ...current, [channel]: true }))} onUnpublish={(channel) => setPublishedChannels((current) => ({ ...current, [channel]: false }))} /> : null}
        {section === "candidates" ? <section className="board-surface">
          {vacancyCode !== "2026-0157" && <p className="vacancies-demo-note">Dados demonstrativos: esta vaga ainda não tem candidatos de exemplo vinculados. A contagem da lista de vagas é ilustrativa.</p>}
          <SmartFilters activeFilters={activeFilters} onFiltersChange={setActiveFilters} onSearch={setSearch} search={search} />
          {candidateView !== "rejected" ? <div className="mobility-notice"><Info size={17} weight="fill" /><span>A entrada considera até duas conduções na ida e duas na volta, nos horários reais da vaga. Casos sem rota confiável ficam em Mobilidade pendente.</span></div> : null}
          {candidateView === "kanban" ? <div className="kanban-scroll" tabIndex={0} role="region" aria-label="Navegar pelas etapas do Kanban"><KanbanBoard stages={stages} candidates={visibleCandidates} onMove={moveCandidate} onOpen={setSelectedCandidate} /></div> : null}
          {candidateView === "list" ? <CandidateList candidates={visibleCandidates} onOpen={setSelectedCandidate} /> : null}
          {candidateView === "rejected" ? <RejectedCandidates /> : null}
        </section> : null}
      </main>
      {replacementInterview ? <ReplacementConfirmation interview={replacementInterview} onCancel={() => setReplacementInterview(null)} onConfirm={() => { const interview = replacementInterview; setReplacementInterview(null); startInterview(interview, true); }} /> : null}
      <CandidateModal candidate={selectedCandidate} initialTab={previewParams.get("tab") === "mobility" ? "Mobilidade" : "Resumo"} onClose={() => setSelectedCandidate(null)} />
      <ExtractionLab open={labOpen} onClose={() => setLabOpen(false)} vacancyCode={vacancyCode} onCandidateAdded={addCandidate} />
    </>
  );
}
