import { useState } from "react";
import { ArrowLeft, ArrowRight, Buildings, CalendarBlank, Check } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ROUTES } from "../navigation.js";

export function RequisitionCreateScreen({ onNavigate, initialData = null, onSave }) {
  const [submitted, setSubmitted] = useState(false);
  const editing = Boolean(initialData);

  function submitRequisition(event) {
    event.preventDefault();
    if (initialData) {
      const form = new FormData(event.currentTarget);
      onSave?.({
        ...initialData,
        post: form.get("post"),
        role: form.get("role"),
        openings: Number(form.get("openings")),
      });
    }
    setSubmitted(true);
  }

  return (
    <main className="screen-workspace">
      <ScreenHeader
        title={editing ? `Editar ${initialData.code}` : "Nova requisição"}
        description={editing ? "Corrija os dados informados pela Operação antes da decisão da Diretoria." : "Registre a necessidade operacional para análise da Diretoria. O RH criará a vaga somente após a aprovação."}
      />

      {submitted ? (
        <div className="workflow-success" role="status">
          <span><Check size={20} weight="bold" /></span>
          <div><strong>{editing ? "Alterações salvas" : "Requisição enviada para aprovação"}</strong><p>{editing ? `${initialData.code} foi atualizada e permanece no fluxo de análise.` : "A REQ-2026-042 foi encaminhada à fila da Diretoria. Nenhuma vaga foi publicada ainda."}</p></div>
          <button type="button" onClick={() => onNavigate(editing ? ROUTES.requisitions : ROUTES.approvals)}>{editing ? "Voltar às requisições" : "Ver aprovações"} <ArrowRight size={17} /></button>
        </div>
      ) : null}

      <form className="requisition-builder" onSubmit={submitRequisition}>
        <section className="surface-panel form-surface">
          <header className="form-section-heading"><span><Buildings size={20} /></span><div><h2>Necessidade do posto</h2><p>Dados objetivos para a Diretoria entender o pedido.</p></div></header>
          <div className="form-grid two-columns">
            <label className="field-control"><span>Posto ativo</span><select name="post" aria-label="Posto ativo" defaultValue={initialData?.post ?? "Leblon Power"}><option>Leblon Power</option><option>Bay View Botafogo</option><option>Sede Alpha & Omega</option><option>Comrio Ilha</option></select><small>Lista demonstrativa; futuramente virá do Weboper somente leitura.</small></label>
            <label className="field-control"><span>Função solicitada</span><input name="role" aria-label="Função solicitada" placeholder="Ex.: Auxiliar de Serviços Gerais" defaultValue={initialData?.role ?? ""} required /></label>
            <label className="field-control"><span>Quantidade de vagas</span><input name="openings" aria-label="Quantidade de vagas" type="number" min="1" defaultValue={initialData?.openings ?? "1"} /></label>
            <label className="field-control"><span>Tipo da necessidade</span><select aria-label="Tipo da necessidade" defaultValue="Reposição"><option>Reposição</option><option>Aumento de quadro</option><option>Cobertura temporária</option></select></label>
          </div>

          <div className="section-divider" />
          <header className="form-section-heading"><span><CalendarBlank size={20} /></span><div><h2>Prazo e contexto</h2><p>Informações para priorização e planejamento do RH.</p></div></header>
          <div className="form-grid two-columns">
            <label className="field-control"><span>Data desejada para início</span><input aria-label="Data desejada para início" type="date" defaultValue="2026-09-28" /></label>
            <label className="field-control"><span>Solicitante</span><input aria-label="Solicitante" defaultValue={initialData ? `${initialData.requester} · Operações` : "Marcos Lima · Operações"} readOnly /></label>
            <label className="field-control full-width"><span>Justificativa da requisição</span><textarea aria-label="Justificativa da requisição" placeholder="Explique o motivo, o impacto operacional e a urgência." required /></label>
            <label className="field-control full-width"><span>Observações para o RH</span><textarea aria-label="Observações para o RH" placeholder="Informações de escala, perfil técnico ou condições que precisam ser confirmadas." /></label>
          </div>

          <footer className="builder-footer">
            <button className="secondary-action" type="button" onClick={() => onNavigate(ROUTES.requisitions)}><ArrowLeft size={17} /> Cancelar</button>
            <div><button className="secondary-action" type="button">Salvar rascunho</button><button className="primary-action" type="submit">{editing ? "Salvar alterações" : "Enviar para a Diretoria"} <ArrowRight size={17} /></button></div>
          </footer>
        </section>
      </form>
    </main>
  );
}
