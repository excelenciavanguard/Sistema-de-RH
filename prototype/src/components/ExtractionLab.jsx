import { useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  FileArrowUp,
  Flask,
  SpinnerGap,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { compareExtraction } from "../services/extraction.js";
import { addToKanban } from "../services/candidates.js";

const providerOptions = ["OpenAI", "Gemini", "Comparar ambos"];

export function ExtractionLab({ open, onClose, vacancyCode, onCandidateAdded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [provider, setProvider] = useState("Comparar ambos");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [addingProvider, setAddingProvider] = useState("");
  const [addedProvider, setAddedProvider] = useState("");
  const [kanbanMessage, setKanbanMessage] = useState("");

  if (!open) return null;

  async function run() {
    if (!file) { setError("Selecione um currículo para continuar."); return; }
    setError(""); setStatus("loading"); setResult(null); setAddedProvider(""); setKanbanMessage("");
    try {
      const providers = provider === "Comparar ambos" ? ["OpenAI", "Gemini"] : [provider];
      setResult(await compareExtraction(file, providers));
      setStatus("done");
    } catch (caught) {
      setError(caught.message);
      setStatus("error");
    }
  }

  async function sendToKanban(providerName) {
    setError(""); setKanbanMessage(""); setAddingProvider(providerName);
    try {
      const payload = await addToKanban(result.requestId, providerName, vacancyCode);
      onCandidateAdded(payload.candidate);
      setAddedProvider(providerName);
      setKanbanMessage(payload.duplicate ? "Candidato já estava no Kanban" : "Candidato adicionado em Candidatura");
    } catch (caught) {
      setError(caught.message);
    } finally {
      setAddingProvider("");
    }
  }

  return (
    <div className="modal-backdrop lab-layer" role="presentation">
      <section className="extraction-lab" role="dialog" aria-modal="true" aria-labelledby="lab-title">
        <header className="lab-header"><div><span className="lab-icon"><Flask size={21} weight="fill" /></span><div><h2 id="lab-title">Laboratório de extração</h2><p>Compare a estruturação do mesmo currículo entre provedores.</p></div></div><button className="icon-button" onClick={onClose} aria-label="Fechar" type="button"><X size={20} /></button></header>
        <div className="demo-notice secure"><CheckCircle size={18} weight="fill" /><span><strong>Extração segura ativa</strong>O backend local valida o arquivo e envia o texto somente aos provedores selecionados. Depois da análise, escolha qual resultado adicionar ao Kanban.</span></div>
        <div className="lab-config">
          <button className={`upload-zone ${file ? "has-file" : ""}`} onClick={() => inputRef.current?.click()} type="button">
            <FileArrowUp size={30} />
            <span><strong>{file ? file.name : "Selecionar currículo"}</strong><small>{file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, DOC, DOCX ou TXT · até 12 MB"}</small></span>
          </button>
          <input ref={inputRef} hidden type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          <div className="provider-picker"><label>Provedor para o teste</label><div>{providerOptions.map((item) => <button className={provider === item ? "active" : ""} onClick={() => setProvider(item)} key={item} type="button">{item}</button>)}</div></div>
          <button className="run-extraction" onClick={run} disabled={status === "loading"} type="button">{status === "loading" ? <><SpinnerGap className="spin" size={18} /> Processando</> : <>Executar teste <ArrowRight size={17} /></>}</button>
        </div>
        {error && <div className="lab-error" role="alert"><WarningCircle size={18} />{error}</div>}
        {kanbanMessage && <div className="lab-success" role="status"><CheckCircle size={18} weight="fill" />{kanbanMessage}</div>}
        <div className="comparison-area">
          {!result ? <div className="lab-empty"><Flask size={28} /><strong>O resultado aparecerá aqui</strong><p>Escolha OpenAI, Gemini ou compare os dois. Depois, selecione qual resultado será adicionado ao Kanban.</p></div> : <>
            <article className="local-extraction-result">
              <header><div><CheckCircle size={19} weight="fill" /><span><strong>Texto extraído localmente</strong><small>{result.file.name} · {(result.file.size / 1024).toFixed(1)} KB</small></span></div>{result.file.duplicate && <span className="duplicate-result">Arquivo já processado</span>}</header>
              {result.file.textPreview ? <pre>{result.file.textPreview}</pre> : <div className="local-extraction-warning"><WarningCircle size={18} />{result.file.extractionNote || "O arquivo precisa de revisão manual."}</div>}
            </article>
            {result.results.map((item) => (
              <article className="provider-result" key={item.provider}>
                <header><div><span className={`provider-mark ${item.provider.toLowerCase()}`}>{item.provider.slice(0, 1)}</span><span><strong>{item.provider}</strong><small>{item.status === "completed" ? "Extração validada" : item.status === "not_configured" ? "Aguardando chave da API" : "Processamento não concluído"}</small></span></div><span className={`provider-state ${item.status}`}>{item.status === "completed" ? "Concluído" : item.status === "not_configured" ? "Não configurado" : "Falhou"}</span></header>
                {item.fields ? <><dl><div><dt>Nome</dt><dd>{item.fields.nome || "Não informado"}</dd></div><div><dt>Localidade</dt><dd>{item.fields.localidade || "Não informado"}</dd></div><div><dt>Experiência</dt><dd>{item.fields.experiencia || "Não informado"}</dd></div><div><dt>Escolaridade</dt><dd>{item.fields.escolaridade || "Não informado"}</dd></div><div><dt>Disponibilidade</dt><dd>{item.fields.disponibilidade || "Não informado"}</dd></div></dl><button className="add-kanban-button" aria-label={`Adicionar resultado do ${item.provider} ao Kanban`} onClick={() => sendToKanban(item.provider)} disabled={Boolean(addingProvider) || addedProvider === item.provider} type="button">{addingProvider === item.provider ? <><SpinnerGap className="spin" size={17} /> Adicionando</> : addedProvider === item.provider ? <><CheckCircle size={17} weight="fill" /> Adicionado</> : <><ArrowRight size={17} /> Adicionar ao Kanban</>}</button></> : <div className="provider-pending"><WarningCircle size={20} /><strong>Análise não concluída</strong><p>{item.errorMessage}</p></div>}
              </article>
            ))}
          </>}
        </div>
      </section>
    </div>
  );
}
