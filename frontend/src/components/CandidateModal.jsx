import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Clock,
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

function EvidenceList({ candidate }) {
  const evidences = candidate.evidences?.length ? candidate.evidences : candidate.isDemo ? [
    candidate.education && { valor: candidate.education, trecho: "Dado demonstrativo de escolaridade" },
    candidate.experience && { valor: candidate.experience, trecho: "Dado demonstrativo de experiência" },
    candidate.availability && { valor: candidate.availability, trecho: "Disponibilidade informada · confirmar em contato" },
  ].filter(Boolean) : [];
  if (!evidences.length) {
    return <div className="evidence-empty"><Info size={19} /><span><strong>Nenhuma evidência estruturada</strong><small>Revise o currículo original antes de avançar.</small></span></div>;
  }
  return <ul className="evidence-list">{evidences.map((evidence, index) => <li key={`${evidence.campo || "evidencia"}-${index}`}><CheckCircle size={18} /><span><strong>{evidence.valor}</strong><small>{evidence.trecho}{evidence.pagina ? ` · página ${evidence.pagina}` : ""}</small></span></li>)}</ul>;
}
export function CandidateModal({ candidate, history = [], initialTab = "Resumo", onClose }) {
  const [activeTab, setActiveTab] = useState(tabs.includes(initialTab) ? initialTab : "Resumo");

  useEffect(() => {
    if (candidate) setActiveTab(tabs.includes(initialTab) ? initialTab : "Resumo");
  }, [candidate?.id, initialTab]);

  useEffect(() => {
    function onKey(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!candidate) return null;
  const pendingItems = [
    candidate.duplicate && candidate.duplicate,
    candidate.evidenceTone === "warning" && "Informações obrigatórias não encontradas",
    candidate.requirements && !candidate.requirements.startsWith("3/3") && `Requisitos: ${candidate.requirements}`,
    /pendente|conferir/i.test(candidate.route || "") && `Mobilidade: ${candidate.route}${candidate.fare ? ` · ${candidate.fare}` : ""}`,
    ...(candidate.missingInfo || []),
  ].filter(Boolean);

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
        <div className={`modal-body ${activeTab === "Histórico" ? "candidate-tab-historico" : "candidate-profile-split"}`}>
          {activeTab !== "Histórico" && <aside className="resume-preview candidate-resume-panel">
            <div className="resume-toolbar"><span><FileText size={17} /> {candidate.resumeFileName || "Currículo do candidato"}</span><small>{candidate.isDemo ? "Dados demonstrativos" : "Resumo do perfil"}</small></div>
            <div className="paper-preview">
              <h3>{candidate.name}</h3><p>{candidate.location}</p>
              <h4>Vaga aplicada</h4><p>{candidate.role}</p>
              <h4>Experiência extraída</h4><p>{candidate.experience}</p>
              <h4>Escolaridade</h4><p>{candidate.education}</p>
              <h4>Disponibilidade</h4><p>{candidate.availability}</p>
            </div>
          </aside>}
          {(activeTab === "Resumo" || activeTab === "Currículo") && <main className="candidate-details candidate-professional-summary">
            <div className="detail-heading"><div><Briefcase size={19} /><span><strong>Resumo profissional</strong><small>Dados extraídos para revisão do RH</small></span></div><span className={`review-state ${candidate.reviewStatus === "pending" || pendingItems.length > 0 ? "pending" : ""}`}>{candidate.reviewStatus === "pending" || pendingItems.length > 0 ? "Revisão pendente" : "Revisado"}</span></div>
            {pendingItems.length > 0 && <div className="candidate-pending-details"><WarningCircle size={18} weight="fill" /><span><strong>Pendências do candidato</strong><ul>{pendingItems.map((item) => <li key={item}>{item}</li>)}</ul></span></div>}
            <dl className="detail-list"><div><dt>Vaga aplicada</dt><dd>{candidate.role}</dd></div><div><dt>Experiência</dt><dd>{candidate.experience || "Não informada"}</dd></div><div><dt>Escolaridade</dt><dd>{candidate.education || "Não informada"}</dd></div><div><dt>Disponibilidade</dt><dd>{candidate.availability || "A confirmar"}</dd></div></dl>
            <h3 className="section-title">Evidências extraídas</h3>
            <EvidenceList candidate={candidate} />
          </main>}
          {activeTab === "Evidências" && <main className="candidate-details candidate-evidence-details">
            <div className="detail-heading"><div><FileText size={19} /><span><strong>Evidências extraídas</strong><small>Confira a origem das informações antes de avançar</small></span></div></div>
            <EvidenceList candidate={candidate} />
          </main>}
          {activeTab === "Histórico" && <main className="candidate-details candidate-history">
            <div className="detail-heading"><div><Clock size={19} /><span><strong>Histórico do processo</strong><small>Movimentações e interações deste candidato</small></span></div></div>
            <p className="candidate-history-note">Movimentações registradas nesta visita à vaga. O histórico permanente ainda não está disponível.</p>
            {history.length ? <ol className="candidate-history-list">
              {history.map((event) => <li key={event.id}><span><Clock size={16} /></span><div><strong>{stageLabels[event.from] || event.from} → {stageLabels[event.to] || event.to}</strong><small>{event.actor} · <time dateTime={event.at}>{new Date(event.at).toLocaleString("pt-BR")}</time></small></div></li>)}
            </ol> : <p className="candidate-history-empty">Nenhuma movimentação registrada nesta visita.</p>}
          </main>}
        </div>
        )}
      </section>
    </div>
  );
}
