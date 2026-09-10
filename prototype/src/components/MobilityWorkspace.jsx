import { useState } from "react";
import {
  ArrowRight,
  Bus,
  CalendarBlank,
  CaretDown,
  CheckCircle,
  Clock,
  Info,
  MapPin,
  PersonSimpleWalk,
  Train,
  UserCircle,
} from "@phosphor-icons/react";

const routeSteps = [
  { label: "Caminhada", detail: "6 min · 450 m", icon: PersonSimpleWalk },
  { label: "Transporte", detail: "20 min", icon: Train },
  { label: "Integração", detail: "8 min", icon: Bus },
  { label: "Caminhada", detail: "4 min · 350 m", icon: PersonSimpleWalk },
];

function MobilityFooter() {
  return (
    <footer className="mobility-footer">
      <button type="button">Voltar ao Kanban</button>
      <button type="button"><UserCircle size={17} /> Abrir perfil completo</button>
      <div><button type="button"><CalendarBlank size={17} /> Agendar entrevista</button><button className="move-stage" type="button">Mover de etapa <ArrowRight size={17} /></button></div>
    </footer>
  );
}

function PendingMobility({ candidate }) {
  return (
    <div className="mobility-workspace mobility-pending">
      <div className="mobility-signals pending" aria-label="Indicadores da mobilidade pendente">
        <span><MapPin size={17} /> Origem: {candidate.location}</span>
        <span><Info size={17} /> Endereço completo necessário</span>
        <span><Clock size={17} /> Rota ainda não consultada</span>
      </div>
      <div className="pending-mobility-layout">
        <section className="pending-mobility-main">
          <span className="pending-mobility-icon"><MapPin size={30} weight="fill" /></span>
          <h3>Mobilidade pendente</h3>
          <p>O currículo informa apenas <strong>{candidate.location}</strong>. Isso não é suficiente para calcular um trajeto confiável até o posto.</p>
          <div className="pending-mobility-steps">
            <span><b>1</b><small>Confirmar bairro ou endereço de origem com o candidato</small></span>
            <span><b>2</b><small>Configurar a integração do Google Maps</small></span>
            <span><b>3</b><small>Calcular ida e volta nos horários reais da vaga</small></span>
          </div>
        </section>
        <aside className="pending-mobility-summary">
          <h3>Dados disponíveis</h3>
          <dl>
            <div><dt>Posto de trabalho</dt><dd>{candidate.postName || "Posto não informado"}</dd></div>
            <div><dt>Vaga</dt><dd>{candidate.role}</dd></div>
            <div><dt>Origem declarada</dt><dd>{candidate.location}</dd></div>
            <div><dt>Rota de ida</dt><dd>Pendente</dd></div>
            <div><dt>Rota de volta</dt><dd>Pendente</dd></div>
            <div><dt>Conduções</dt><dd>Pendente</dd></div>
            <div><dt>Custo estimado</dt><dd>Custo pendente de validação</dd></div>
          </dl>
          <div className="pending-mobility-note"><Info size={18} /><span>Nenhum tempo, linha, tarifa ou compatibilidade de horário foi presumido.</span></div>
        </aside>
      </div>
      <MobilityFooter />
    </div>
  );
}

export function MobilityWorkspace({ candidate }) {
  const [direction, setDirection] = useState("ida");

  if (!candidate.isDemo || candidate.mobilityStatus === "pending") {
    return <PendingMobility candidate={candidate} />;
  }

  return (
    <div className="mobility-workspace">
      <div className="mobility-signals" aria-label="Indicadores da análise">
        <span><CheckCircle size={17} weight="fill" /> 3 requisitos atendidos</span>
        <span><Info size={17} /> 1 item declarado</span>
        <span><Clock size={17} /> Rota atualizada hoje</span>
      </div>

      <div className="mobility-layout">
        <section className="mobility-route-panel" aria-label="Mapa e percurso">
          <div className="mobility-map">
            <img src="/assets/mobility-map-leblon.png" alt="Mapa demonstrativo entre a origem aproximada e o posto Leblon Power" />
            <span className="map-demo-badge"><Info size={13} /> Mapa demonstrativo</span>
            <div className="map-controls">
              <div className="direction-switch" role="group" aria-label="Sentido da rota">
                <button className={direction === "ida" ? "active" : ""} onClick={() => setDirection("ida")} type="button">Ida</button>
                <button className={direction === "volta" ? "active" : ""} onClick={() => setDirection("volta")} type="button">Volta</button>
              </div>
              <label><span>Chegar às</span><Clock size={16} /><select aria-label="Horário de chegada" defaultValue="06:00"><option>06:00</option><option>07:00</option></select></label>
              <label><span>Sair às</span><Clock size={16} /><select aria-label="Horário de saída" defaultValue="18:00"><option>18:00</option><option>19:00</option></select></label>
            </div>
          </div>

          <div className="journey-card">
            <div className="journey-heading"><strong>Percurso de {direction} até o posto</strong><span>Total <b>{direction === "ida" ? "38 min" : "42 min"}</b></span></div>
            <div className="journey-steps">
              {routeSteps.map(({ label, detail, icon: Icon }, index) => (
                <div className="journey-step" key={`${label}-${index}`}>
                  <span className="journey-icon"><Icon size={18} weight="fill" /></span>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                  {index < routeSteps.length - 1 && <ArrowRight className="journey-arrow" size={17} />}
                </div>
              ))}
            </div>
          </div>

          <button className="alternative-route" type="button">
            <span><strong>Alternativa de {direction}</strong><small>Mesmo limite de até 2 conduções</small></span>
            <b>{direction === "ida" ? "46 min" : "49 min"}</b><CaretDown size={16} />
          </button>
        </section>

        <aside className="mobility-detail-panel">
          <section className="mobility-detail-card">
            <h3>Detalhes da mobilidade</h3>
            <dl>
              <div><dt>Posto de trabalho</dt><dd><strong>Leblon Power</strong><small>Leblon, Rio de Janeiro · endereço sincronizado</small></dd></div>
              <div><dt>Origem declarada</dt><dd>{candidate.location}</dd></div>
              <div><dt>Escala</dt><dd>6×1 · 06h às 18h</dd></div>
              <div><dt>Rota de ida</dt><dd><span className="status-dot success" />38 min</dd></div>
              <div><dt>Rota de volta</dt><dd><span className="status-dot warning" />42 min</dd></div>
              <div><dt>Serviço no horário</dt><dd><span className="available-tag">Disponível</span></dd></div>
              <div><dt>Conduções</dt><dd>2 na ida · 2 na volta</dd></div>
              <div><dt>Caminhada total</dt><dd>10 min · 800 m</dd></div>
            </dl>
            <div className="mobility-costs">
              <span><small>Custo por trecho</small><strong>R$ 10,70</strong></span>
              <span><small>Custo diário</small><strong>R$ 21,40</strong></span>
              <span><small>Estimativa mensal</small><strong>R$ 556,40</strong><em>26 dias presenciais</em></span>
            </div>
          </section>

          <section className="confirmation-card">
            <h3>Pontos para confirmar</h3>
            <ul><li>Integração tarifária aplicável ao trajeto.</li><li>Disponibilidade do serviço em feriados.</li></ul>
          </section>

          <section className="route-source">
            <span><strong>Fonte demonstrativa</strong><small>Integração Google Maps ainda não configurada</small></span>
            <Info size={17} />
          </section>

          <div className="mobility-review-note"><Info size={18} weight="fill" /><span>A mobilidade apoia a análise e não reprova automaticamente o candidato.</span></div>
        </aside>
      </div>

      <MobilityFooter />
    </div>
  );
}
