import { useState } from "react";
import { CalendarDays, Check, ChevronDown, FileCheck2, Filter, GraduationCap, Info, LockKeyhole, MoreVertical, Search, Send, UserRound } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { StatusPill } from "../components/StatusPill.jsx";
import { WorkspaceTabs } from "../components/WorkspaceTabs.jsx";
import { admissionCandidates, documentChecklist, trainingClasses } from "../moduleWorkspaceData.js";
import { AdmissionDocuments } from "./AdmissionDocuments.jsx";

const moduleTabs = [
  { id: "documents", label: "Documentos" },
  { id: "training", label: "Treinamentos" },
  { id: "hiring", label: "Contratação" },
];

export function AdmissionScreen() {
  const [active, setActive] = useState("documents");
  const [candidateId, setCandidateId] = useState(1);
  const selected = admissionCandidates.find((item) => item.id === candidateId) ?? admissionCandidates[0];
  return (
    <main className="screen-workspace miro-screen admission-reference-screen">
      <WorkspaceTabs items={moduleTabs} active={active} onChange={setActive} ariaLabel="Áreas de admissão" />
      {active === "documents" && <AdmissionDocuments onSelect={setCandidateId} />}
      {active === "training" && <TrainingView />}
      {active === "hiring" && <HiringView selected={selected} onSelect={setCandidateId} />}
    </main>
  );
}

function DocumentsView({ selected, onSelect }) {
  return <>
    <ScreenHeader title="Documentos de admissão" description="Acompanhe a entrega e a validação dos documentos dos candidatos." actions={<div className="privacy-callout"><LockKeyhole size={20} /><span><strong>Colete e acesse somente documentos necessários para a admissão.</strong><small>Restringimos a visualização no protótipo.</small></span></div>} />
    <WorkspaceTabs items={[{ id: "current", label: "Em admissão" }, { id: "pending", label: "Pendentes" }, { id: "done", label: "Concluídos" }]} active="current" onChange={() => {}} ariaLabel="Situação dos documentos" />
    <AdmissionFilters />
    <section className="master-detail-layout admission-master-detail">
      <div className="surface-panel operational-table admission-candidates-table">
        <h2>Candidatos (12)</h2>
        <div className="op-table-head"><span /><span>Nome</span><span>Vaga</span><span>Posto</span><span>Progresso</span><span>Pendências</span><span>Prazo</span><span>Responsável</span><span>Situação</span></div>
        {admissionCandidates.map((item) => <button type="button" className={`op-table-row ${selected.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => onSelect(item.id)} aria-label={`Abrir documentos de ${item.name}`}><span><input type="checkbox" checked={selected.id === item.id} readOnly /></span><span><b>{item.name}</b></span><span>{item.vacancy}</span><span>{item.post}</span><span className="mini-progress"><b>{item.documents} de {item.total}</b><i><em style={{ width: `${(item.documents / item.total) * 100}%` }} /></i></span><span><StatusPill tone={item.pending ? "danger" : "neutral"}>{item.pending}</StatusPill></span><span>{item.deadline}</span><span>{item.owner}</span><span><StatusPill tone={item.tone}>{item.status}</StatusPill></span></button>)}
        <footer className="table-pagination"><span>Mostrando 1 a 8 de 12 candidatos</span><div><button>‹</button><button className="active">1</button><button>2</button><button>›</button></div></footer>
      </div>
      <aside className="surface-panel side-detail-panel document-detail-panel">
        <header><div className="avatar-token">{selected.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><h2>{selected.name}</h2><p>{selected.vacancy} · {selected.post}</p></div><StatusPill tone={selected.tone}>{selected.status}</StatusPill></header>
        <div className="detail-notice"><Info size={17} /><span><strong>Colete e acesse somente documentos necessários para a admissão.</strong><small>Evite solicitar dados que não sejam exigidos para a função.</small></span></div>
        <div className="detail-section-title"><h2>Checklist de documentos</h2><strong>{selected.documents} de {selected.total} entregues</strong></div>
        <div className="checklist-table"><header><span>Documento</span><span>Situação</span><span>Data</span><span>Ação</span></header>{documentChecklist.map((item) => <div key={item.name}><span><FileCheck2 size={15} />{item.name}</span><span><StatusPill tone={item.tone}>{item.status}</StatusPill></span><span>{item.date}</span><button>{item.action}</button></div>)}</div>
        <footer><button className="secondary-action">Solicitar pendências</button><button className="primary-action">Concluir conferência</button></footer>
      </aside>
    </section>
  </>;
}

function TrainingView() {
  const [classId, setClassId] = useState(1);
  const selected = trainingClasses.find((item) => item.id === classId) ?? trainingClasses[0];
  return <>
    <ScreenHeader title="Treinamentos de admissão" description="Organize turmas, participantes e conclusões antes da contratação." actions={<button className="primary-action"><GraduationCap size={17} />Nova turma</button>} />
    <WorkspaceTabs items={[{ id: "next", label: "Próximas turmas" }, { id: "running", label: "Em andamento" }, { id: "done", label: "Concluídas" }, { id: "absent", label: "Não compareceram" }]} active="next" onChange={() => {}} ariaLabel="Situação dos treinamentos" />
    <AdmissionFilters />
    <section className="master-detail-layout admission-master-detail"><div className="surface-panel operational-table training-table"><h2>Turmas de treinamento (8)</h2><div className="op-table-head"><span /><span>Nome do treinamento</span><span>Tipo</span><span>Unidade</span><span>Data</span><span>Local</span><span>Participantes</span><span>Confirmados</span><span>Status</span></div>{trainingClasses.map((item) => <button className={`op-table-row ${selected.id === item.id ? "selected" : ""}`} onClick={() => setClassId(item.id)} key={item.id}><span><input type="checkbox" readOnly checked={selected.id === item.id} /></span><span><b>{item.name}</b></span><span>{item.type}</span><span>{item.unit}</span><span>{item.date}</span><span>{item.location}</span><span>{item.participants}</span><span>{item.confirmed}</span><span><StatusPill tone={item.tone}>{item.status}</StatusPill></span></button>)}</div><aside className="surface-panel side-detail-panel training-detail"><header><div className="avatar-token"><GraduationCap size={22} /></div><div><h2>{selected.name}</h2><p>Turma #TR-2025-041 · {selected.type}</p></div><StatusPill tone="info">Em andamento</StatusPill></header><div className="training-facts"><span><CalendarDays /><b>Data e horário</b><small>{selected.date}<br />09:00 às 12:00</small></span><span><UserRound /><b>Instrutor</b><small>Ana Marques<br />RH Corporativo</small></span><span><Info /><b>Local</b><small>{selected.location}<br />{selected.unit}</small></span></div><div className="detail-section-title"><h2>Participantes (12)</h2><button>Ver todos</button></div>{["Rafael Costa", "Juliana Alves", "Bruno Martins", "Camila Rocha", "Lucas Pereira"].map((name, index) => <div className="participant-row" key={name}><span>{name}</span><span>{admissionCandidates[index]?.vacancy}</span><StatusPill tone={index === 3 ? "danger" : index === 1 ? "warning" : "success"}>{index === 3 ? "Não compareceu" : index === 1 ? "Pendente" : "Confirmado"}</StatusPill><MoreVertical size={15} /></div>)}<footer><button className="secondary-action"><Send size={15} />Enviar lembrete</button><button className="secondary-action">Registrar presença</button><button className="primary-action"><Check size={15} />Concluir turma</button></footer></aside></section>
  </>;
}

function HiringView({ selected, onSelect }) {
  return <>
    <ScreenHeader title="Contratações e encerramentos" description="Finalize candidaturas sem perder o histórico do processo." actions={<div className="privacy-callout"><LockKeyhole size={20} /><span><strong>Currículo, avaliações, decisões e movimentações serão preservados.</strong><small>Transparência em todas as etapas.</small></span></div>} />
    <WorkspaceTabs items={[{ id: "ready", label: "Prontos para contratar" }, { id: "hired", label: "Contratados" }, { id: "closed", label: "Outros encerramentos" }]} active="ready" onChange={() => {}} ariaLabel="Situação das contratações" />
    <AdmissionFilters />
    <section className="master-detail-layout hiring-master-detail"><div className="surface-panel operational-table hiring-table"><h2>Candidatos prontos para contratação (8)</h2><div className="op-table-head"><span /><span>Candidato</span><span>Vaga</span><span>Posto</span><span>Documentos</span><span>Treinamento</span><span>Data de início</span><span>Responsável</span><span>Ações</span></div>{admissionCandidates.map((item) => <button className={`op-table-row ${selected.id === item.id ? "selected" : ""}`} onClick={() => onSelect(item.id)} key={item.id}><span><input type="checkbox" checked={selected.id === item.id} readOnly /></span><span><b>{item.name}</b></span><span>{item.vacancy}</span><span>{item.post}</span><span className="mini-progress"><b>{item.documents} de {item.total}</b><i><em style={{ width: `${(item.documents / item.total) * 100}%` }} /></i></span><span><StatusPill tone={item.documents > 7 ? "success" : "info"}>{item.documents > 7 ? "Concluído" : "Em andamento"}</StatusPill></span><span>{item.deadline}</span><span>{item.owner}</span><span><em className="table-action">Finalizar</em></span></button>)}</div><aside className="surface-panel side-detail-panel hiring-detail"><h2>Concluir processo</h2><p>Finalize a candidatura selecionada.</p><div className="detail-notice"><Info size={17} /><span><strong>O histórico completo será preservado.</strong><small>O candidato continuará disponível para consultas e auditoria.</small></span></div><header><div className="avatar-token">{selected.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><h2>{selected.name}</h2><p>{selected.vacancy} · {selected.post}</p></div></header><fieldset><legend>Resultado do processo</legend>{["Contratado", "Finalista não contratado", "Desistiu", "Não compareceu"].map((label, index) => <label key={label}><input type="radio" name="result" defaultChecked={index === 0} />{label}</label>)}</fieldset><div className="hiring-fields"><label>Data de início<input value="02/05/2025" readOnly /></label><label>Posto<select defaultValue={selected.post}><option>{selected.post}</option></select></label><label>Função<select defaultValue={selected.vacancy}><option>{selected.vacancy}</option></select></label><label>Observações<textarea placeholder="Adicione informações relevantes sobre a contratação." /></label></div><label className="confirmation-check"><input type="checkbox" defaultChecked />Confirmo que os dados estão corretos e desejo concluir a contratação.</label><footer><button className="secondary-action">Cancelar</button><button className="primary-action">Confirmar contratação</button></footer></aside></section>
  </>;
}

function AdmissionFilters() {
  return <div className="admission-filter-row"><label><Search size={16} /><input placeholder="Buscar por nome, vaga ou candidato..." /></label>{["Todos os postos", "Todos os responsáveis", "Todos os prazos"].map((value) => <button key={value}>{value}<ChevronDown size={14} /></button>)}<button><Filter size={15} />Mais filtros</button></div>;
}
