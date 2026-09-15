import { Bookmark, BriefcaseBusiness, CalendarDays, Clock3, Download, FileText, Info, RefreshCw, TrendingDown, TrendingUp, UsersRound } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { StatusPill } from "../components/StatusPill.jsx";

const funnel = [
  ["Candidatura", 486, "100%"], ["Triagem", 342, "70%"], ["Contato", 248, "51%"], ["Entrevista RH", 128, "26%"], ["Entrevista Gestor", 64, "13%"], ["Documentos", 32, "7%"], ["Contratação", 18, "4%"],
];
const waiting = [
  ["Auxiliar de Serviços Gerais", "Leblon Power", "Entrevista Gestor (12 dias)", "Atrasado", "Ana Marques", "danger"],
  ["Recepcionista", "Matriz", "Triagem (8 dias)", "Atrasado", "Bruno Alves", "danger"],
  ["Técnico de Manutenção", "Barra da Tijuca", "Documentos (6 dias)", "No limite", "Carla Mendes", "warning"],
  ["Jardineiro", "Botafogo", "Contato (5 dias)", "No limite", "Rafael Lima", "warning"],
  ["Auxiliar Administrativo", "Matriz", "Triagem (4 dias)", "Dentro do prazo", "Juliana Souza", "success"],
];

export function ReportsScreen() {
  return <main className="screen-workspace miro-screen reports-reference-screen">
    <ScreenHeader title="Relatórios de recrutamento" description="Acompanhe resultados, prazos e gargalos do processo." actions={<><button className="secondary-action"><Bookmark size={16} />Salvar visão</button><button className="primary-action"><Download size={16} />Exportar relatório</button></>} />
    <section className="report-reference-filters">{[[CalendarDays, "01/04/2025 – 30/04/2025"], [BriefcaseBusiness, "Todos os postos"], [BriefcaseBusiness, "Todas as vagas"], [UsersRound, "Todos os responsáveis"], [FileText, "Todas as fontes"]].map(([Icon, value], index) => <label key={value}><span>{["Período", "Posto", "Vaga", "Responsável", "Fonte"][index]}</span><button><Icon size={15} />{value}</button></label>)}<button className="clear-report"><RefreshCw size={15} />Limpar filtros</button></section>
    <section className="report-kpi-grid">{[
      [BriefcaseBusiness, "Vagas abertas", "12", "3 em relação ao período anterior", "up"],
      [UsersRound, "Candidaturas", "486", "+18% em relação ao período anterior", "up"],
      [FileText, "Contratações", "18", "+29% em relação ao período anterior", "up"],
      [Clock3, "Tempo médio de fechamento", "16 dias", "-4 dias em relação ao período anterior", "down"],
    ].map(([Icon, label, value, note, trend]) => <article key={label}><span><Icon /></span><div><b>{label}<Info size={13} /></b><strong>{value}</strong><small className="positive">{trend === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{note}</small></div></article>)}</section>
    <section className="report-reference-grid">
      <article className="surface-panel report-figure" aria-label="Conversão por etapa"><header><TrendingUp /><span><h2>Conversão por etapa</h2><p>Veja o volume e a taxa de conversão entre as etapas.</p></span></header><div className="conversion-chart"><div className="chart-y"><span>600</span><span>400</span><span>200</span><span>0</span></div><div className="conversion-bars">{funnel.map(([label, value, rate]) => <div key={label}><b>{value}</b><i style={{ height: `${Math.max(10, value / 4.2)}px` }} /><span>{label}</span><strong>{rate}</strong></div>)}</div></div></article>
      <article className="surface-panel report-figure time-figure"><header><Clock3 /><span><h2>Tempo médio por etapa</h2><p>Quantidade de dias, do início ao avanço de etapa.</p></span></header><div className="time-stage-chart">{[2, 3, 4, 5, 8, 10, 16].map((value, index) => <div key={value}><b>{value}</b><i style={{ height: `${value * 6}px` }}><em /></i><span>{funnel[index][0]}</span></div>)}</div></article>
      <article className="surface-panel report-figure origin-figure"><header><Info /><span><h2>Origem dos candidatos</h2><p>Canais que mais geraram candidaturas no período.</p></span></header><div className="origin-content"><div className="donut-chart" aria-label="Origem dos candidatos: RioVagas 38%, Gmail 27%, Indeed 20%, WhatsApp e Banco de talentos 15%"><span><strong>486</strong><small>candidaturas</small></span></div><ul>{[["RioVagas", "185", "c1"], ["Gmail", "131", "c2"], ["Indeed", "97", "c3"], ["WhatsApp", "73", "c4"], ["Banco de talentos", "73", "c5"]].map(([label, value, color]) => <li key={label}><i className={color} />{label}<b>{value}</b></li>)}</ul></div></article>
    </section>
    <section className="surface-panel attention-table"><header><span>△</span><div><h2>Vagas com atenção</h2><p>Vagas que podem exigir ação para evitar atrasos.</p></div><button>Ver todas as vagas →</button></header><div className="op-table-head"><span>Vaga</span><span>Posto</span><span>Etapa com maior espera</span><span>SLA</span><span>Responsável</span><span>Ações</span></div>{waiting.map(([vacancy, post, stage, sla, owner, tone]) => <div className="op-table-row" key={vacancy}><span><b>{vacancy}</b></span><span>{post}</span><span>{stage}</span><span><StatusPill tone={tone}>{sla}</StatusPill></span><span>{owner}</span><span><button>Ver detalhes →</button></span></div>)}</section>
  </main>;
}
