import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Briefcase, Check, Clock, MapPin, NotePencil, UsersThree, X } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { requisitions } from "../mockWorkspaceData.js";
import { ROUTES } from "../navigation.js";

export function ApprovalsScreen({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  function openDecision(item) {
    setApproved(false);
    setSelected(item);
  }

  return (
    <main className="screen-workspace">
      <ScreenHeader title="Aprovações da diretoria" description="Decida solicitações de abertura de vaga com contexto, justificativa e rastreabilidade." />

      <section className="approval-overview" aria-label="Resumo das aprovações">
        <div><span className="metric-dot warning" /><span><strong>1</strong><small>Aguardando decisão</small></span></div>
        <div><span className="metric-dot danger" /><span><strong>1</strong><small>Ajustes solicitados</small></span></div>
        <div><span className="metric-dot success" /><span><strong>1</strong><small>Aprovada hoje</small></span></div>
      </section>

      <section className="surface-panel approval-list-panel">
        <header className="panel-heading"><div><h2>Fila de decisão</h2><p>Abra uma solicitação para conferir todos os dados antes de decidir.</p></div></header>
        <div className="approval-list" role="table" aria-label="Requisições para aprovação">
          <div className="approval-list-row approval-list-head" role="row"><span>Requisição</span><span>Posto e necessidade</span><span>Solicitante</span><span>Prazo</span><span>Situação</span><span>Ação</span></div>
          {requisitions.slice(0, 3).map((item, index) => <div className="approval-list-row" role="row" key={item.code}>
            <span><span className={`request-mark ${item.tone}`}><Briefcase size={18} /></span><span><strong>{item.code}</strong><small>{item.created}</small></span></span>
            <span><strong>{item.role}</strong><small>{item.post} · {item.openings} vagas</small></span>
            <span><strong>{item.requester}</strong><small>Operações</small></span>
            <span><strong>{index === 0 ? "Hoje" : "Concluído"}</strong><small>{index === 0 ? "prioridade alta" : "histórico"}</small></span>
            <span><b className={`status-badge ${item.tone}`}>{item.status}</b></span>
            <span><button className="table-action" type="button" aria-label={`Analisar ${item.code}`} onClick={() => openDecision(item)}>{item.tone === "warning" ? "Analisar" : "Ver decisão"} <ArrowRight size={15} /></button></span>
          </div>)}
        </div>
      </section>

      <button className="back-link" type="button" onClick={() => onNavigate(ROUTES.requisitions)}><ArrowLeft size={16} /> Voltar para requisições</button>

      {selected ? <div className="drawer-backdrop" onMouseDown={() => setSelected(null)}>
        <aside className="decision-drawer" role="dialog" aria-modal="true" aria-label={`Analisar requisição ${selected.code}`} onMouseDown={(event) => event.stopPropagation()}>
          <header className="drawer-header"><div><span className="detail-code">{selected.code}</span><h2>{selected.role}</h2><p>{selected.post} · solicitada por {selected.requester}</p></div><button type="button" aria-label="Fechar análise" onClick={() => setSelected(null)}><X size={20} /></button></header>

          {approved ? <div className="decision-approved"><Check size={22} weight="bold" /><div><strong>Requisição aprovada</strong><p>O pedido foi liberado para o RH criar e revisar a vaga antes da publicação.</p></div></div> : null}

          <div className="drawer-scroll">
            <div className="approval-summary">
              <div><MapPin size={20} /><span><small>Posto</small><strong>{selected.post}</strong><em>Leblon · Rio de Janeiro, RJ</em></span></div>
              <div><UsersThree size={20} /><span><small>Quantidade</small><strong>{selected.openings} vagas</strong><em>Reposição operacional</em></span></div>
              <div><Clock size={20} /><span><small>Escala prevista</small><strong>6×1 · 06h às 18h</strong><em>Início desejado: 28/09/2026</em></span></div>
            </div>
            <div className="approval-reason"><h3>Justificativa de Operações</h3><p>Necessidade de recomposição da equipe do posto para cobertura da escala e manutenção do nível de atendimento contratado.</p></div>
            <div className="approval-note"><NotePencil size={20} /><span><strong>Observação da Diretoria</strong><textarea aria-label="Observação da diretoria" placeholder="Registre o motivo de um ajuste ou rejeição antes de decidir." /></span></div>
            <div className="decision-history"><h3>Histórico da solicitação</h3><p><Clock size={15} /> Criada por {selected.requester} em {selected.created}, às 09:18.</p></div>
          </div>

          <footer className="drawer-footer">
            {approved ? <><button className="secondary-action" type="button" onClick={() => setSelected(null)}>Fechar</button><button className="primary-action" type="button" onClick={() => onNavigate(ROUTES.vacancyCreate)}>Criar vaga no RH <ArrowRight size={17} /></button></> : <><button className="secondary-action danger-action" type="button"><X size={17} /> Rejeitar</button><button className="secondary-action" type="button"><ArrowLeft size={17} /> Solicitar ajustes</button><button className="primary-action" type="button" onClick={() => setApproved(true)}><Check size={17} /> Aprovar requisição</button></>}
          </footer>
        </aside>
      </div> : null}
    </main>
  );
}
