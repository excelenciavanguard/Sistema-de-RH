import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle,
  DownloadSimple,
  DotsThreeVertical,
  FileText,
  Info,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { MobilityWorkspace } from "./MobilityWorkspace.jsx";

const tabs = ["Resumo", "Currículo", "Evidências", "Mobilidade", "Histórico"];
const stageLabels = {
  application: "Candidatura",
  screening: "Triagem",
  contact: "Contato",
  interview_hr: "Entrevista RH",
  manager_interview: "Entrevista Gestor",
  research: "Pesquisa",
  documents: "Entrega de documentos",
  training: "Treinamento",
  hiring: "Contratação",
};
const demoEvidences = [
  { valor: "Ensino médio completo", trecho: "Comprovado no currículo", pagina: 1 },
  { valor: "Experiência em limpeza", trecho: "4 anos identificados", pagina: 1 },
  { valor: "Disponibilidade de escala", trecho: "Declarado pelo candidato · confirmar em contato", pagina: null },
];

function EvidenceList({ candidate }) {
  const evidences = candidate.isDemo ? demoEvidences : (candidate.evidences || []);
  if (!evidences.length) {
    return <div className="evidence-empty"><Info size={19} /><span><strong>Nenhuma evidência estruturada</strong><small>Revise o currículo original antes de avançar.</small></span></div>;
  }
  return (
    <ul className="evidence-list">
      {evidences.map((evidence, index) => (
        <li key={`${evidence.campo || "evidencia"}-${index}`}>
          <CheckCircle size={18} weight="fill" />
          <span><strong>{evidence.valor}</strong><small>{evidence.trecho}{evidence.pagina ? ` · página ${evidence.pagina}` : ""}</small></span>
        </li>
      ))}
    </ul>
  );
}

export function CandidateModal({ candidate, initialTab = "Resumo", onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (candidate) setActiveTab(initialTab);
  }, [candidate?.id, initialTab]);

  useEffect(() => {
    function onKey(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!candidate) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`candidate-modal ${activeTab === "Mobilidade" ? "mobility-open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="candidate-title">
        <header className="modal-header">
          <div className="modal-person">
            {candidate.photo ? <img src={candidate.photo} alt="" /> : <span className="avatar-fallback large">{candidate.initials}</span>}
            <div><div className="modal-title-line"><h2 id="candidate-title">{candidate.name}</h2><span>{stageLabels[candidate.stage] || "Revisão"}</span></div><p>{candidate.role} · {candidate.postName || "Posto não informado"}</p></div>
          </div>
          <div className="modal-header-actions"><button onClick={() => setActiveTab("Currículo")} type="button"><DownloadSimple size={17} /> Abrir currículo</button><button className="icon-button" aria-label="Mais ações" type="button"><DotsThreeVertical size={19} /></button><button className="icon-button" onClick={onClose} aria-label="Fechar" type="button"><X size={20} /></button></div>
        </header>
        <nav className="modal-tabs" aria-label="Detalhes do candidato">{tabs.map((tab) => <button className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab} type="button">{tab}</button>)}</nav>
        {activeTab === "Mobilidade" ? <MobilityWorkspace candidate={candidate} /> : (
        <div className="modal-body">
          <aside className="resume-preview">
            <div className="resume-toolbar"><span><FileText size={17} /> {candidate.resumeFileName || "Currículo anexado"}</span><small>{candidate.isDemo ? "Dados demonstrativos" : "Arquivo original preservado"}</small></div>
            <div className="paper-preview">
              <h3>{candidate.name}</h3><p>{candidate.location}</p>
              <h4>Vaga aplicada</h4><p>{candidate.role}</p>
              <h4>Experiência extraída</h4><p>{candidate.experience}</p>
              <h4>Escolaridade</h4><p>{candidate.education}</p>
              <h4>Disponibilidade</h4><p>{candidate.availability}</p>
            </div>
          </aside>
          <main className="candidate-details">
              <>
                <div className="detail-heading"><div><Briefcase size={19} /><span><strong>Resumo profissional</strong><small>Dados extraídos para revisão do RH</small></span></div><span className={`review-state ${candidate.reviewStatus === "pending" ? "pending" : ""}`}>{candidate.reviewStatus === "pending" ? "Revisão pendente" : "Revisado"}</span></div>
                <dl className="detail-list"><div><dt>Vaga aplicada</dt><dd>{candidate.role}</dd></div><div><dt>Experiência</dt><dd>{candidate.experience}</dd></div><div><dt>Escolaridade</dt><dd>{candidate.education}</dd></div><div><dt>Disponibilidade</dt><dd>{candidate.availability}</dd></div></dl>
                <h3 className="section-title">Evidências extraídas</h3>
                <EvidenceList candidate={candidate} />
                {!candidate.isDemo && candidate.missingInfo?.length > 0 && <div className="missing-information"><WarningCircle size={18} /><span><strong>Informações não encontradas</strong><small>{candidate.missingInfo.join(" · ")}</small></span></div>}
              </>
          </main>
        </div>
        )}
      </section>
    </div>
  );
}
