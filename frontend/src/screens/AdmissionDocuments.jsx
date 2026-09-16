import { useEffect, useRef, useState } from "react";
import { FileCheck2, Search, X, LockKeyhole } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { WorkspaceTabs } from "../components/WorkspaceTabs.jsx";
import { StatusPill } from "../components/StatusPill.jsx";
import { admissionCandidates } from "../moduleWorkspaceData.js";
import "../admission-documents.css";

const names = ["Documento de identificação", "CPF", "Comprovante de residência", "Carteira de trabalho", "Dados bancários", "Exame admissional", "Comprovante de escolaridade", "Certificado de curso exigido", "Foto para cadastro"];
const initials = (name) => name.split(" ").slice(0, 2).map((part) => part[0]).join("");
const fold = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function seed() {
  return admissionCandidates.map((candidate) => ({ ...candidate, complete: candidate.documents === 9, checklist: names.map((name, index) => ({ name, status: candidate.id === 1 ? ["Validado", "Validado", "Pendente", "Recebido", "Pendente", "Agendado", "Validado", "Validado", "Recebido"][index] : index < candidate.documents ? (candidate.documents === 9 || index < candidate.documents - 2 ? "Validado" : "Recebido") : "Pendente", reason: "" })) }));
}
const counts = (candidate) => ({ received: candidate.checklist.filter((doc) => ["Validado", "Recebido", "Correção solicitada"].includes(doc.status)).length, validated: candidate.checklist.filter((doc) => doc.status === "Validado").length, missing: candidate.checklist.filter((doc) => ["Pendente", "Correção solicitada"].includes(doc.status)).length });
const tone = (status) => status === "Validado" ? "success" : ["Pendente", "Correção solicitada", "Agendado"].includes(status) ? "warning" : "neutral";

export function AdmissionDocuments({ onSelect }) {
  const [candidates, setCandidates] = useState(seed);
  const [tab, setTab] = useState("current");
  const [query, setQuery] = useState("");
  const [post, setPost] = useState("");
  const [owner, setOwner] = useState("");
  const [opened, setOpened] = useState(null);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState(null);
  const [reason, setReason] = useState("");
  const drawer = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    if (review) drawer.current?.querySelector(".doc-review")?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }, [review]);
  const selected = candidates.find((item) => item.id === opened);
  const visible = candidates.filter((item) => (tab === "done" ? item.complete : !item.complete) && (tab !== "pending" || counts(item).missing > 0) && (!post || item.post === post) && (!owner || item.owner === owner) && fold(`${item.name} ${item.vacancy} ${item.post}`).includes(fold(query)));
  const tabs = [{ id: "current", label: `Em admissão (${candidates.filter((item) => !item.complete).length})` }, { id: "pending", label: `Pendentes (${candidates.filter((item) => !item.complete && counts(item).missing > 0).length})` }, { id: "done", label: `Concluídos (${candidates.filter((item) => item.complete).length})` }];
  const close = () => { setOpened(null); setMessage(""); setReview(null); };
  const open = (id) => { opener.current = document.activeElement; setOpened(id); onSelect(id); setMessage(""); setReview(null); };
  const updateDocument = (status) => {
    setCandidates((items) => items.map((item) => item.id === opened ? { ...item, checklist: item.checklist.map((doc) => doc.name === review ? { ...doc, status, reason: status === "Correção solicitada" ? reason.trim() : "" } : doc) } : item));
    setMessage(status === "Validado" ? "Documento validado nesta sessão demonstrativa." : "Correção registrada nesta sessão. Nenhuma mensagem foi enviada.");
    setReview(null); setReason("");
  };
  useEffect(() => {
    if (!opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector("button")?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") { setOpened(null); setReview(null); setMessage(""); }
      if (event.key === "Tab") {
        const targets = [...drawer.current.querySelectorAll('button:not(:disabled),input,textarea,select,[tabindex="0"]')];
        const first = targets[0], last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", handleKey); opener.current?.focus(); };
  }, [opened]);
  return <div className="admission-documents">
    <ScreenHeader title="Documentos de admissão" description="Acompanhe entregas, solicite pendências e confira os documentos." actions={<div className="privacy-callout"><LockKeyhole size={18} /><span><strong>Somente documentos necessários para a admissão.</strong><small>Dados e ações demonstrativos neste protótipo.</small></span></div>} />
    <WorkspaceTabs items={tabs} active={tab} onChange={setTab} ariaLabel="Situação dos documentos" />
    <div className="admission-doc-filters"><label className="doc-search"><Search size={17} /><input aria-label="Buscar candidatos em admissão" placeholder="Buscar por candidato, vaga ou posto" value={query} onChange={(event) => setQuery(event.target.value)} /></label><select aria-label="Filtrar por posto" value={post} onChange={(event) => setPost(event.target.value)}><option value="">Todos os postos</option>{[...new Set(candidates.map((item) => item.post))].map((value) => <option key={value}>{value}</option>)}</select><select aria-label="Filtrar por responsável" value={owner} onChange={(event) => setOwner(event.target.value)}><option value="">Todos os responsáveis</option>{[...new Set(candidates.map((item) => item.owner))].map((value) => <option key={value}>{value}</option>)}</select></div>
    <section className="surface-panel admission-doc-list"><div className="doc-list-title"><h2>Candidatos ({visible.length})</h2><span>Selecione um candidato para conferir</span></div><div className="doc-table-scroll"><table><thead><tr>{["Candidato", "Vaga / Posto", "Recebidos", "Validados", "Pendências", "Prazo", "Responsável", "Ação"].map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{visible.map((item) => { const count = counts(item); return <tr key={item.id} className={opened === item.id ? "is-selected" : ""}><td><button className="doc-candidate" aria-label={`Abrir documentos de ${item.name}`} onClick={() => open(item.id)}><span className="avatar-token">{initials(item.name)}</span><strong>{item.name}</strong></button></td><td><strong>{item.vacancy}</strong><small>{item.post}</small></td><td>{count.received} de 9</td><td><strong>{count.validated} de 9</strong><span className="doc-progress"><i style={{ width: `${count.validated / 9 * 100}%` }} /></span></td><td><StatusPill tone={count.missing ? "warning" : "neutral"}>{count.missing ? `${count.missing} pendentes` : "Sem pendências"}</StatusPill></td><td className="doc-date">{item.deadline}</td><td>{item.owner}</td><td><button className="secondary-action" onClick={() => open(item.id)}>Conferir</button></td></tr>; })}</tbody></table></div>{!visible.length && <p className="doc-empty">Nenhum candidato encontrado. Altere os filtros para tentar novamente.</p>}<footer className="doc-list-footer">Exibindo {visible.length} candidatos · Dados demonstrativos</footer></section>
    {selected && <div className="admission-doc-overlay">
      <button className="admission-doc-mask" aria-label="Fechar documentos" onClick={close} />
      <aside ref={drawer} className="admission-doc-drawer" role="dialog" aria-modal="true" aria-labelledby="doc-drawer-title">
        <header><span className="avatar-token">{initials(selected.name)}</span><div><h2 id="doc-drawer-title">{selected.name}</h2><p>{selected.vacancy} · {selected.post}</p></div><button className="secondary-action" aria-label="Fechar modal de documentos" onClick={close}><X size={18} /></button></header>
        <div className="admission-doc-body">
          <div className="doc-summary"><span><strong>{counts(selected).received} de 9</strong>Recebidos</span><span><strong>{counts(selected).validated} de 9</strong>Validados</span><span><strong>{counts(selected).missing}</strong>A solicitar</span></div>
          <div className="doc-checklist-title"><h3>Checklist de documentos</h3><small>9 obrigatórios · {9 - counts(selected).validated} aguardam validação</small></div>
          <ul className="admission-doc-checklist">{selected.checklist.map((doc) => <li key={doc.name}>
            <FileCheck2 size={18} /><div><strong>{doc.name}</strong><small>{doc.reason || (doc.status === "Pendente" ? "Aguardando envio" : doc.status === "Agendado" ? "Aguardando realização e comprovante" : "Registro demonstrativo")}</small></div>
            <StatusPill tone={tone(doc.status)}>{doc.status}</StatusPill>
            <button aria-label={`${doc.status === "Pendente" ? "Solicitar" : "Conferir"} ${doc.name}`} onClick={() => { setReview(doc.name); setReason(""); }}>{doc.status === "Pendente" ? "Solicitar" : "Conferir"}</button>
          </li>)}</ul>
          {review && <section className="doc-review" aria-label={`Conferência de ${review}`}><h3>{review}</h3><p>Nenhum arquivo real está disponível neste protótipo. As ações abaixo simulam a conferência.</p>
            <label>Motivo da correção<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Ex.: documento ilegível; envie uma nova cópia." /></label>
            <div><button className="secondary-action" onClick={() => setReview(null)}>Cancelar</button><button className="secondary-action" disabled={!reason.trim() || selected.complete} onClick={() => updateDocument("Correção solicitada")}>Pedir correção</button>{["Pendente", "Agendado", "Correção solicitada"].includes(selected.checklist.find((doc) => doc.name === review)?.status) && <button className="secondary-action" onClick={() => updateDocument("Recebido")}>Simular recebimento</button>}<button className="primary-action" disabled={selected.checklist.find((doc) => doc.name === review)?.status !== "Recebido"} onClick={() => updateDocument("Validado")}>Validar documento</button></div>
          </section>}
          {message && <p role="status" className="doc-feedback">{message}</p>}
        </div>
        <footer><small>{selected.complete ? "Conferência concluída." : "Conclua após validar todos os documentos obrigatórios."}</small><div><button className="secondary-action" disabled={!counts(selected).missing} onClick={() => setMessage(`Solicitação demonstrativa: ${selected.checklist.filter((doc) => ["Pendente", "Correção solicitada"].includes(doc.status)).map((doc) => doc.name).join(", ")}. Nada foi enviado.`)}>Solicitar pendências</button><button className="primary-action" disabled={counts(selected).validated !== 9 || selected.complete} onClick={() => { setCandidates((items) => items.map((item) => item.id === selected.id ? { ...item, complete: true } : item)); setMessage("Conferência concluída nesta sessão demonstrativa."); }}>Concluir conferência</button></div></footer>
      </aside>
    </div>}
  </div>;
}
