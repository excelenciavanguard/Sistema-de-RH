import { ArrowRight, Check, FileText, FunnelSimple, MagnifyingGlass, PencilSimple, Plus, UserCircle } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { requisitions as defaultRequisitions } from "../mockWorkspaceData.js";
import { ROUTES } from "../navigation.js";

export function RequisitionsScreen({ onNavigate, onCreate, onEdit, requisitions = defaultRequisitions }) {
  return (
    <main className="screen-workspace">
      <ScreenHeader title="Requisições de vaga" description="Operações solicita a necessidade; a Diretoria decide; o RH transforma a aprovação em vaga." actions={<button className="primary-action" type="button" onClick={() => onCreate ? onCreate() : onNavigate(ROUTES.requisitionCreate)}><Plus size={18} /> Nova requisição</button>} />
      <section className="responsibility-flow" aria-label="Fluxo de responsabilidade">
        <div className="flow-step"><span>1</span><div><strong>Operações</strong><small>Cria a requisição</small></div></div>
        <span className="flow-connector" aria-hidden="true" />
        <div className="flow-step"><span>2</span><div><strong>Diretoria</strong><small>Analisa o pedido</small></div></div>
        <span className="flow-connector" aria-hidden="true" />
        <div className="flow-step"><span>3</span><div><strong>RH</strong><small>Publica a vaga</small></div></div>
      </section>
      <section className="surface-panel data-panel">
        <div className="data-toolbar"><label><MagnifyingGlass size={18} /><input placeholder="Buscar por código, função ou posto" aria-label="Buscar requisições" /></label><button type="button"><FunnelSimple size={18} /> Status</button><button type="button"><UserCircle size={18} /> Solicitante</button><button className="toolbar-link" type="button" onClick={() => onNavigate(ROUTES.approvals)}>Abrir aprovações <ArrowRight size={16} /></button></div>
        <div className="request-table" role="table" aria-label="Lista de requisições">
          <div className="request-row request-head" role="row"><span>Código / criação</span><span>Função e posto</span><span>Solicitante</span><span>Vagas</span><span>Situação</span><span>Ação</span></div>
          {requisitions.map((item) => <div className="request-row" role="row" key={item.code}>
            <span><strong>{item.code}</strong><small>{item.created}</small></span>
            <span><strong>{item.role}</strong><small>{item.post}</small></span>
            <span><strong>{item.requester}</strong><small>Operações</small></span>
            <span className="number-cell">{item.openings}</span>
            <span><b className={`status-badge ${item.tone}`}>{item.status}</b></span>
            <span className="request-actions">{item.tone !== "success" && <button className="table-action request-edit-action" type="button" onClick={() => onEdit?.(item)}><PencilSimple size={15} />Editar</button>}<button className="table-action" type="button" onClick={() => item.tone === "warning" ? onNavigate(ROUTES.approvals) : undefined}>{item.tone === "warning" ? "Analisar" : "Detalhes"} <ArrowRight size={15} /></button></span>
          </div>)}
        </div>
        <footer className="data-footer"><span><FileText size={16} /> 4 requisições demonstrativas</span><span><Check size={16} /> Nenhuma alteração será salva nesta fase</span></footer>
      </section>
    </main>
  );
}
