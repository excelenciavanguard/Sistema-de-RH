import { useEffect, useMemo, useState } from "react";
import { Briefcase, PencilSimple, UserCircle, UsersThree } from "@phosphor-icons/react";
import { CandidateModal } from "../components/CandidateModal.jsx";
import { KanbanBoard } from "../components/KanbanBoard.jsx";
import { SmartFilters } from "../components/SmartFilters.jsx";
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
    requester: `${vacancy.owner} · RH`, location: `${vacancy.city} · Presencial`, compensation: "A definir · CLT",
    schedule: "Escala a definir", description: `Atuação como ${vacancy.role} no posto ${vacancy.post}.`,
    requirements: ["Requisitos conforme a função", "Disponibilidade para atuação presencial"], benefits: ["Vale-transporte"],
  };
  return <section className="vacancy-about" aria-labelledby="vacancy-about-title">
    <header><div><span>Sobre a vaga</span><h2 id="vacancy-about-title">Informações completas</h2></div><small>Dados demonstrativos</small></header>
    <div className="vacancy-about-grid">
      <article className="vacancy-about-general"><h3>Informações gerais</h3><dl><div><dt>Requisitante</dt><dd>{details.requester}</dd></div><div><dt>Local</dt><dd>{details.location}</dd></div><div><dt>Remuneração</dt><dd>{details.compensation}</dd></div><div><dt>Jornada</dt><dd>{details.schedule}</dd></div><div><dt>Posições</dt><dd>{vacancy.openings}</dd></div></dl></article>
      <article><h3>Descrição</h3><p>{details.description}</p></article>
      <article><h3>Requisitos</h3><ul>{details.requirements.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><h3>Benefícios</h3><ul>{details.benefits.map((item) => <li key={item}>{item}</li>)}</ul></article>
    </div>
  </section>;
}

export function KanbanScreen({ vacancyCode = "2026-0157" }) {
  const vacancy = vacancies.find((item) => item.code === vacancyCode);
  const demoCandidates = vacancyCode === "2026-0157" ? initialCandidates : [];
  const previewParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [candidates, setCandidates] = useState(demoCandidates);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("candidates");
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

  return (
    <>
      <main className="workspace recruitment-workspace">
        <div className="breadcrumbs">Recrutamento <span>/</span> Vagas <span>/</span> {vacancyCode}</div>
        <section className="vacancy-header">
          <div><div className="title-line"><h1>{vacancy.role} · {vacancy.post}</h1><span className="vacancy-status">{vacancy.status}</span></div><div className="vacancy-meta"><span><UsersThree size={17} /> {vacancyCode === "2026-0157" ? "27 candidatos" : `${candidates.length} candidatos no Kanban`}</span><span><UserCircle size={17} /> Responsável: {vacancy.owner}</span><span><Briefcase size={17} /> {vacancyCode === "2026-0157" ? "Escala 6×1 · 06h às 18h" : "Escala não definida no demonstrativo"}</span></div></div>
          <div className="vacancy-actions"><button className="primary-action" type="button"><PencilSimple size={18} /> Editar vaga</button></div>
        </section>
        <div className="vacancy-navigation-row">
          <nav className="vacancy-tabs" aria-label="Seções da vaga"><button type="button">Resumo</button><button className={activeSection === "candidates" ? "active" : ""} type="button" onClick={() => setActiveSection("candidates")}>Candidatos</button><button type="button">Entrevistas</button><button type="button">Divulgação</button><button className={activeSection === "about" ? "active" : ""} type="button" onClick={() => setActiveSection("about")}>Sobre</button></nav>
          {activeSection === "candidates" && <SmartFilters search={search} onSearch={setSearch} open={filtersOpen} onToggle={() => setFiltersOpen((value) => !value)} />}
        </div>
        {activeSection === "candidates" ? <section className="board-surface">
          {vacancyCode !== "2026-0157" && <p className="vacancies-demo-note">Dados demonstrativos: esta vaga ainda não tem candidatos de exemplo vinculados. A contagem da lista de vagas é ilustrativa.</p>}
          <div className="kanban-scroll" role="region" aria-label="Etapas do Kanban">
            <KanbanBoard stages={stages} candidates={visibleCandidates} onMove={moveCandidate} onOpen={setSelectedCandidate} />
          </div>
        </section> : <VacancyAbout vacancy={vacancy} />}
      </main>
      <CandidateModal candidate={selectedCandidate} initialTab={previewParams.get("tab") === "mobility" ? "Mobilidade" : "Resumo"} onClose={() => setSelectedCandidate(null)} />
    </>
  );
}
