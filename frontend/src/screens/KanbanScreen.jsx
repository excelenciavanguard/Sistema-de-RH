import { useEffect, useMemo, useState } from "react";
import { Briefcase, PencilSimple, UserCircle, UsersThree } from "@phosphor-icons/react";
import { CandidateModal } from "../components/CandidateModal.jsx";
import { KanbanBoard } from "../components/KanbanBoard.jsx";
import { CandidateWorkspaceControls, SmartFilters } from "../components/SmartFilters.jsx";
import { InterviewLoading, InterviewsWorkspace, PromotionWorkspace, ReplacementConfirmation, CandidateList, RejectedCandidates, VacancySummary } from "../components/VacancyWorkspaceViews.jsx";
import { InterviewMode, InterviewSummary, InterviewCompletion } from "../components/interview/InterviewWorkspace.jsx";
import { initialCandidates, stages } from "../data.js";
import { listCandidates, moveCandidateStage } from "../services/candidates.js";
import { vacancies } from "../mockWorkspaceData.js";
import "./KanbanScreen.css";

const vacancyDetails = {
  "2026-0157": {
    requester: "Marcos Lima · Operações",
    location: "Leblon, Rio de Janeiro · RJ · Presencial",
    compensation: "R$ 1.610,00 por mês · CLT",
    schedule: "Escala 6×1 · 06h às 18h",
    description: "Executar limpeza e conservação das áreas internas e externas, organizar materiais, apoiar a rotina operacional do posto e cumprir os procedimentos de segurança.",
    requirements: ["Ensino médio completo", "Experiência em limpeza ou serviços gerais", "Disponibilidade para escala 6×1"],
    benefits: ["Vale-alimentação de R$ 27,00 por dia", "Vale-transporte", "Seguro de vida"],
  },
  "2026-0156": {
    requester: "Ana Souza · Operações",
    location: "Botafogo, Rio de Janeiro · RJ · Presencial",
    compensation: "R$ 1.850,00 por mês · CLT",
    schedule: "Escala 12×36 · turno diurno",
    description: "Controlar o acesso de pessoas e veículos, orientar visitantes, registrar ocorrências e apoiar a segurança do posto.",
    requirements: ["Ensino médio completo", "Experiência como porteiro ou controlador de acesso", "Boa comunicação"],
    benefits: ["Vale-alimentação", "Vale-transporte", "Seguro de vida"],
  },
};

function VacancyAbout({ vacancy }) {
  const details = vacancyDetails[vacancy.code] ?? {
    requester: `${vacancy.owner} · RH`,
    location: `${vacancy.city} · Presencial`,
    compensation: "A definir · CLT",
    schedule: "Escala a definir",
    description: `Atuação como ${vacancy.role} no posto ${vacancy.post}.`,
    requirements: ["Requisitos conforme a função", "Disponibilidade para atuação presencial"],
    benefits: ["Vale-transporte"],
  };

  return (
    <section className="vacancy-about" aria-labelledby="vacancy-about-title">
      <header><div><span>Sobre a vaga</span><h2 id="vacancy-about-title">Informações completas</h2></div><small>Dados demonstrativos</small></header>
      <div className="vacancy-about-grid">
        <article className="vacancy-about-general"><h3>Informações gerais</h3><dl><div><dt>Requisitante</dt><dd>{details.requester}</dd></div><div><dt>Local</dt><dd>{details.location}</dd></div><div><dt>Remuneração</dt><dd>{details.compensation}</dd></div><div><dt>Jornada</dt><dd>{details.schedule}</dd></div><div><dt>Posições</dt><dd>{vacancy.openings}</dd></div></dl></article>
        <article><h3>Descrição</h3><p>{details.description}</p></article>
        <article><h3>Requisitos</h3><ul>{details.requirements.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><h3>Benefícios</h3><ul>{details.benefits.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>
  );
}

export function KanbanScreen({ vacancyCode = "2026-0157", onInterviewModeChange }) {
  const vacancy = vacancies.find((item) => item.code === vacancyCode);
  const demoCandidates = vacancyCode === "2026-0157" ? initialCandidates : [];
  const previewParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [candidates, setCandidates] = useState(demoCandidates);
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("candidates");
  const [candidateView, setCandidateView] = useState("kanban");
  const [activeFilters, setActiveFilters] = useState({ triage: "all", evidence: "all", experience: "all", education: "all", mobility: "all" });
  const [interviewSession, setInterviewSession] = useState(null);
  const [interviewResults, setInterviewResults] = useState({});
  const [summaryInterview, setSummaryInterview] = useState(null);
  const [replacementInterview, setReplacementInterview] = useState(null);
  const [publishedChannels, setPublishedChannels] = useState({ rioVagas: false, site: false, indeed: false, linkedin: false, whatsapp: false });
  const [selectedCandidate, setSelectedCandidate] = useState(() => {
    const previewCandidateId = Number(previewParams.get("candidate"));
    return previewCandidateId ? demoCandidates.find((candidate) => candidate.id === previewCandidateId) ?? null : null;
  });

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
          <div className="vacancy-actions"><button className="primary-action" type="button"><PencilSimple size={18} /> Editar vaga</button></div>
        </section>
        <div className="vacancy-navigation-row">
          <nav className="vacancy-tabs" role="tablist" aria-label="Seções da vaga">{[["summary", "Resumo"], ["candidates", "Candidatos"], ["interviews", "Entrevistas"], ["promotion", "Divulgação"], ["about", "Sobre"]].map(([id, label]) => <button className={section === id ? "active" : ""} key={id} type="button" role="tab" aria-selected={section === id} onClick={() => { setSection(id); if (id !== "interviews") setSummaryInterview(null); }}>{label}</button>)}</nav>
          {section === "candidates" ? <div className="candidate-navigation-tools"><CandidateWorkspaceControls candidateView={candidateView} onViewChange={setCandidateView} /><SmartFilters activeFilters={activeFilters} onFiltersChange={setActiveFilters} onSearch={setSearch} search={search} /></div> : null}
        </div>
        {section === "summary" ? <VacancySummary candidates={candidates} stages={stages} vacancy={vacancy} /> : null}
        {section === "interviews" ? (summaryInterview ? <InterviewSummary result={interviewResults[summaryInterview.name]} onBack={() => setSummaryInterview(null)} onStartReplacement={() => setReplacementInterview(summaryInterview)} /> : <InterviewsWorkspace results={interviewResults} onOpenSummary={setSummaryInterview} onRequestReplacement={setReplacementInterview} onStartInterview={startInterview} />) : null}
        {section === "promotion" ? <PromotionWorkspace publishedChannels={publishedChannels} onPublish={(channel) => setPublishedChannels((current) => ({ ...current, [channel]: true }))} onUnpublish={(channel) => setPublishedChannels((current) => ({ ...current, [channel]: false }))} /> : null}
        {section === "about" ? <VacancyAbout vacancy={vacancy} /> : null}
        {section === "candidates" ? <section className="board-surface">
          {vacancyCode !== "2026-0157" && <p className="vacancies-demo-note">Dados demonstrativos: esta vaga ainda não tem candidatos de exemplo vinculados. A contagem da lista de vagas é ilustrativa.</p>}
          {candidateView === "kanban" ? <div className="kanban-scroll" role="region" aria-label="Etapas do Kanban"><KanbanBoard stages={stages} candidates={visibleCandidates} onMove={moveCandidate} onOpen={setSelectedCandidate} /></div> : null}
          {candidateView === "list" ? <CandidateList candidates={visibleCandidates} onOpen={setSelectedCandidate} /> : null}
          {candidateView === "rejected" ? <RejectedCandidates /> : null}
        </section> : null}
      </main>
      {replacementInterview ? <ReplacementConfirmation interview={replacementInterview} onCancel={() => setReplacementInterview(null)} onConfirm={() => { const interview = replacementInterview; setReplacementInterview(null); startInterview(interview, true); }} /> : null}
      <CandidateModal candidate={selectedCandidate} initialTab={previewParams.get("tab") === "mobility" ? "Mobilidade" : "Resumo"} onClose={() => setSelectedCandidate(null)} />
    </>
  );
}
