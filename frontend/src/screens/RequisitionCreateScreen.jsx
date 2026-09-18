import { useState } from "react";
import { ArrowLeft, ArrowRight, Buildings, CalendarBlank, Check } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ROUTES } from "../navigation.js";

export function RequisitionCreateScreen({ onNavigate, initialData = null, onSave }) {
  const [submitted, setSubmitted] = useState(false);
  const editing = Boolean(initialData);
  const [savedCode] = useState(() => initialData?.code ?? `REQ-${Date.now()}`);

  function submitRequisition(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const draft = event.nativeEvent.submitter?.value === "draft";
    onSave?.({
      ...initialData,
      code: savedCode,
      created: initialData?.created ?? new Date().toLocaleDateString("pt-BR"),
      requester: initialData?.requester ?? "Marcos Lima",
      post: form.get("post"),
      role: String(form.get("role") || "").trim(),
      openings: Number(form.get("openings")),
      needType: form.get("needType"),
      startDate: form.get("startDate"),
      reason: form.get("reason"),
      notes: form.get("notes"),
      status: draft ? "Rascunho" : "Aberta",
      tone: draft ? "neutral" : "warning",
    });
    setSubmitted(true);
  }

  return (
    <main className="screen-workspace">
      <ScreenHeader
        title={editing ? `Editar ${initialData.code}` : "Nova requisição"}
        description={editing ? "Atualize a necessidade operacional e mantenha os dados disponíveis para o RH." : "Registre a necessidade operacional para o RH preparar a vaga diretamente."}
      />

      {submitted ? (
        <div className="workflow-success" role="status">
          <span><Check size={20} weight="bold" /></span>
          <div><strong>{editing ? "Alterações salvas" : "Requisição registrada"}</strong><p>Dados salvos nesta sessão. Volte à lista para editar ou criar a vaga.</p></div>
          <button type="button" onClick={() => onNavigate(ROUTES.requisitions)}>Voltar às requisições <ArrowRight size={17} /></button>
        </div>
      ) : null}

      <form className="requisition-builder" onSubmit={submitRequisition}>
        <section className="surface-panel form-surface">
          <header className="form-section-heading"><span><Buildings size={20} /></span><div><h2>Necessidade do posto</h2><p>Informe o posto, a função e a quantidade necessária.</p></div></header>
          <div className="form-grid two-columns">
            <label className="field-control"><span>Posto ativo</span><select name="post" aria-label="Posto ativo" defaultValue={initialData?.post ?? "Leblon Power"}><option>Leblon Power</option><option>Bay View Botafogo</option><option>Sede Alpha & Omega</option><option>Comrio Ilha</option></select><small>Lista demonstrativa; futuramente virá do Weboper somente leitura.</small></label>
            <label className="field-control"><span>Função solicitada</span><input name="role" aria-label="Função solicitada" placeholder="Ex.: Auxiliar de Serviços Gerais" defaultValue={initialData?.role ?? ""} required /></label>
            <label className="field-control"><span>Quantidade de vagas</span><input name="openings" aria-label="Quantidade de vagas" type="number" min="1" step="1" required defaultValue={initialData?.openings ?? "1"} /></label>
            <label className="field-control"><span>Tipo da necessidade</span><select name="needType" aria-label="Tipo da necessidade" defaultValue={initialData?.needType ?? "Reposição"}><option>Reposição</option><option>Aumento de quadro</option><option>Cobertura temporária</option></select></label>
          </div>

          <div className="section-divider" />
          <header className="form-section-heading"><span><CalendarBlank size={20} /></span><div><h2>Prazo e contexto</h2><p>Informações para priorização e planejamento do RH.</p></div></header>
          <div className="form-grid two-columns">
            <label className="field-control"><span>Data desejada para início</span><input name="startDate" aria-label="Data desejada para início" type="date" defaultValue={initialData?.startDate ?? ""} /></label>
            <label className="field-control"><span>Solicitante</span><input aria-label="Solicitante" defaultValue={initialData ? `${initialData.requester} · Operações` : "Marcos Lima · Operações"} readOnly /></label>
            <label className="field-control full-width"><span>Justificativa da requisição</span><textarea name="reason" defaultValue={initialData?.reason ?? ""} aria-label="Justificativa da requisição" placeholder="Explique o motivo, o impacto operacional e a urgência." required /></label>
            <label className="field-control full-width"><span>Observações para o RH</span><textarea name="notes" defaultValue={initialData?.notes ?? ""} aria-label="Observações para o RH" placeholder="Informações de escala, perfil técnico ou condições que precisam ser confirmadas." /></label>
          </div>

          <footer className="builder-footer">
            <button className="secondary-action" type="button" onClick={() => onNavigate(ROUTES.requisitions)}><ArrowLeft size={17} /> Cancelar</button>
            <div><button className="secondary-action" type="submit" value="draft" formNoValidate>Salvar rascunho</button><button className="primary-action" type="submit">{editing ? "Salvar alterações" : "Registrar requisição"} <ArrowRight size={17} /></button></div>
          </footer>
        </section>
      </form>
    </main>
  );
}
