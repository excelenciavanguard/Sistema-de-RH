import { useState } from "react";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, ChartPie, Download, FileText, UsersRound } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import "./reports-theme.css";

const sources = [["RioVagas", 185, 38, "#235347"], ["Gmail", 131, 27, "#3f7567"], ["Indeed", 97, 20, "#73a090"], ["WhatsApp", 73, 15, "#b8d6c6"]];
const stages = [["Candidatura", 486, "#235347"], ["Triagem", 342, "#3f7567"], ["Contato", 248, "#649786"], ["Entrevista RH", 128, "#8bb8a6"], ["Entrevista Gestor", 64, "#b5d4c4"], ["Documentos", 32, "#d1e7db"], ["Contratação", 18, "#e8f3ec"]];
const vacancies = [["Auxiliar de Serviços Gerais", "VGA-2026-0157", "Entrevista RH", 84, 58], ["Recepcionista", "VGA-2026-0162", "Triagem", 62, 32], ["Técnico de Manutenção", "VGA-2026-0164", "Contato", 47, 46], ["Jardineiro", "VGA-2026-0168", "Entrevista Gestor", 31, 68], ["Auxiliar Administrativo", "VGA-2026-0171", "Candidatura", 27, 18], ["Porteiro", "VGA-2026-0174", "Documentos", 19, 82], ["Controlador de acesso", "VGA-2026-0178", "Triagem", 16, 36], ["Encarregado de limpeza", "VGA-2026-0180", "Candidatura", 12, 15]];

function getPeriodData(startDate, endDate) {
  const days = Math.max(1, Math.round((new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000) + 1);
  const scale = days <= 7 ? 0.22 : days <= 15 ? 0.51 : 1;
  return { resumes: Math.round(486 * scale), openVacancies: Math.max(2, Math.round(12 * Math.min(scale + 0.12, 1))), topSource: Math.round(185 * scale) };
}

function PieChart({ ariaLabel, total, totalLabel, items }) {
  let cursor = 0;
  const stops = items.map(([, value, , color]) => {
    const start = cursor;
    cursor += value;
    return `${color} ${start}% ${cursor}%`;
  }).join(", ");
  return <div className="report-pie-layout"><div className="report-donut" aria-label={ariaLabel} style={{ background: `conic-gradient(${stops})` }}><div><strong>{total}</strong><small>{totalLabel}</small></div></div><ul className="pie-legend">{items.map(([label, value, percentage, color]) => <li key={label}><i style={{ background: color }} /><span>{label}</span><b>{percentage ?? value}%</b></li>)}</ul></div>;
}

export function ReportsScreen() {
  const [range, setRange] = useState({ start: "2025-04-01", end: "2025-04-30" });
  const [showAllVacancies, setShowAllVacancies] = useState(false);
  const [viewMode, setViewMode] = useState("bars");
  const data = getPeriodData(range.start, range.end);
  const visibleVacancies = showAllVacancies ? vacancies : vacancies.slice(0, 4);
  const setPreset = (days) => setRange(days === 7 ? { start: "2025-04-24", end: "2025-04-30" } : { start: "2025-04-01", end: "2025-04-30" });
  const sourcePieItems = sources.map(([label, volume, percentage, color]) => [label, percentage, percentage, color]);
  const stagePieItems = stages.map(([label, count, color]) => [label, Math.round(count / 486 * 100), Math.round(count / 486 * 100), color]);

  return <main className="screen-workspace miro-screen reports-reference-screen">
    <ScreenHeader title="Relatórios de recrutamento" description="Acompanhe entradas, origens e o andamento das vagas abertas." actions={<button className="primary-action"><Download size={16} />Exportar relatório</button>} />
    <section className="surface-panel report-period-panel" aria-label="Filtro de período"><div><span className="report-panel-kicker"><CalendarDays size={15} />Período de análise</span><p>Escolha exatamente quais datas deseja acompanhar.</p></div><label>Data inicial<input aria-label="Data inicial" type="date" value={range.start} max={range.end} onChange={(event) => setRange({ ...range, start: event.target.value })} /></label><label>Data final<input aria-label="Data final" type="date" value={range.end} min={range.start} onChange={(event) => setRange({ ...range, end: event.target.value })} /></label><div className="report-period-presets" aria-label="Atalhos de período"><button onClick={() => setPreset(7)}>Últimos 7 dias</button><button onClick={() => setPreset(30)}>Abril completo</button></div></section>
    <section className="report-kpi-grid report-primary-kpis">{[[FileText, "Currículos recebidos", data.resumes, "no período selecionado"], [ArrowUpRight, "Maior fonte", "RioVagas", `${data.topSource} currículos · 38% do total`], [BriefcaseBusiness, "Vagas abertas", data.openVacancies, "com processos em andamento"]].map(([Icon, label, value, note]) => <article key={label}><span><Icon /></span><div><b>{label}</b><strong>{value}</strong><small>{note}</small></div></article>)}</section>
    <div className="report-view-switcher" aria-label="Modo de exibição dos dados"><span>Exibir dados como</span><button className={viewMode === "bars" ? "active" : ""} onClick={() => setViewMode("bars")}><ChartNoAxesCombined size={15} />Barras</button><button className={viewMode === "pie" ? "active" : ""} onClick={() => setViewMode("pie")}><ChartPie size={15} />Pizza</button></div>
    <section className="report-insights-grid"><article className="surface-panel report-insight-panel"><header><span><UsersRound /></span><div><h2>Fontes de currículos</h2><p>Veja de onde vieram as candidaturas no período.</p></div></header>{viewMode === "pie" ? <PieChart ariaLabel="Gráfico de pizza das fontes de currículos" total={data.resumes} totalLabel="currículos" items={sourcePieItems} /> : <div className="source-ranking">{sources.map(([source, volume, percentage, color]) => <div className="source-row" key={source}><div><b>{source}</b><span>{Math.round(volume * data.resumes / 486)} currículos</span></div><strong>{percentage}%</strong><i><em style={{ width: `${percentage}%`, background: color }} /></i></div>)}</div>}</article><article className="surface-panel report-insight-panel"><header><span><BarChart3 /></span><div><h2>Processo agregado</h2><p>Candidatos distribuídos entre todas as vagas abertas.</p></div></header>{viewMode === "pie" ? <PieChart ariaLabel="Gráfico de pizza do processo agregado" total={data.resumes} totalLabel="candidatos" items={stagePieItems} /> : <div className="aggregate-stages">{stages.map(([stage, count]) => <div key={stage}><div><span>{stage}</span><b>{Math.round(count * data.resumes / 486)}</b></div><i><em style={{ width: `${Math.round(count / 486 * 100)}%` }} /></i></div>)}</div>}</article></section>
    <section className="surface-panel vacancy-report-table"><header><div><span className="report-panel-kicker"><BriefcaseBusiness size={15} />Vagas abertas</span><h2>Processos em andamento</h2><p>Etapa predominante e candidatos de cada vaga no período selecionado.</p></div><div><span className="vacancy-count">{showAllVacancies ? "8 vagas abertas" : `${data.openVacancies} vagas abertas`}</span><button onClick={() => setShowAllVacancies((current) => !current)}>{showAllVacancies ? "Mostrar menos" : "Ver todas as vagas"}</button></div></header><div className="vacancy-report-head"><span>Vaga</span><span>Etapa atual</span><span>Candidatos</span><span>Avanço</span></div>{visibleVacancies.map(([name, code, stage, candidates, progress]) => <div className="vacancy-report-row" key={code}><span><b>{name}</b><small>{code}</small></span><span><i className="stage-dot" />{stage}</span><span>{Math.round(candidates * data.resumes / 486)}</span><span><strong>{progress}%</strong><i className="progress-track"><em style={{ width: `${progress}%` }} /></i></span></div>)}</section>
  </main>;
}
