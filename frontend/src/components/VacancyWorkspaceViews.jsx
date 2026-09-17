import { CalendarBlank, CheckCircle, Clock, TrendUp, UserCircle, UsersThree, WhatsappLogo } from "@phosphor-icons/react";
import { WelcomeIntro } from "./WelcomeIntro.jsx";
import { StatusPill } from "./StatusPill.jsx";

const interviewItems = [
  { name: "Rafael Santos", initials: "RS", stage: "Entrevista RH", time: "Hoje, 14:00", owner: "Letícia Silva", tone: "success", status: "Confirmada", color: "plum", role: "Auxiliar de Serviços Gerais", location: "Pavuna · Rio de Janeiro", duration: "45 min previstos", checklist: "Currículo revisado" },
  { name: "Mariana Lima", initials: "ML", stage: "Entrevista Gestor", time: "Amanhã, 10:30", owner: "Carlos Almeida", tone: "info", status: "A confirmar", color: "amber", role: "Auxiliar de Limpeza", location: "Tijuca · Rio de Janeiro", duration: "45 min previstos", checklist: "Mobilidade analisada" },
  { name: "André Cardoso", initials: "AC", stage: "Entrevista RH", time: "25/04, 09:00", owner: "Letícia Silva", tone: "neutral", status: "Agendada", color: "blue", role: "Porteiro", location: "Santa Cruz · Rio de Janeiro", duration: "30 min previstos", checklist: "Confirmação pendente" },
];

const rejectedCandidates = [
  ["Camila Souza", "Sem disponibilidade para escala 6×1", "Hoje, 08:45"],
  ["João Martins", "Mobilidade incompatível com o horário", "Ontem, 15:20"],
  ["Lívia Araújo", "Experiência obrigatória não comprovada", "21/04, 17:05"],
];

function ChannelMark({ brand }) {
  if (brand === "whatsapp") return <span className="channel-mark is-whatsapp" aria-label="WhatsApp"><WhatsappLogo weight="fill" size={22} /></span>;
  const labels = { rio: "RV", alpha: "AR", indeed: "in", linkedin: "in" };
  return <span className={`channel-mark is-${brand}`} aria-label={brand === "rio" ? "RioVagas" : brand === "alpha" ? "Alpha RH" : brand === "indeed" ? "Indeed" : "LinkedIn"}>{labels[brand]}</span>;
}

export function VacancySummary({ candidates, stages, vacancy }) {
  const activeStages = stages.filter((stage) => candidates.some((candidate) => candidate.stage === stage.id));
  return <section className="vacancy-workspace-view">
    <header className="vacancy-view-heading"><div><h2>Resumo da vaga</h2><p>Visão rápida do processo seletivo, do volume e dos próximos movimentos.</p></div></header>
    <div className="vacancy-summary-metrics"><Metric icon={<UsersThree />} value={candidates.length} label="candidatos no processo" /><Metric icon={<TrendUp />} value={`${activeStages.length}/${stages.length}`} label="etapas com movimento" /><Metric icon={<Clock />} value="2" label="entrevistas hoje" /><Metric icon={<CheckCircle />} value="4" label="vagas em aberto" /></div>
    <div className="vacancy-summary-grid"><section className="vacancy-detail-card"><h3>Andamento do processo</h3><p>Distribuição atual entre as etapas do funil.</p><div className="vacancy-stage-summary">{stages.slice(0, 6).map((stage) => { const total = candidates.filter((candidate) => candidate.stage === stage.id).length; return <div key={stage.id}><span><b>{stage.label}</b><small>{total} candidatos</small></span><i><em style={{ width: `${Math.max(6, total * 18)}%`, background: stage.color }} /></i></div>; })}</div></section><section className="vacancy-detail-card"><h3>Dados da vaga</h3><dl className="vacancy-facts"><div><dt>Função</dt><dd>{vacancy?.role || "Não informada"}</dd></div><div><dt>Posto</dt><dd>{vacancy?.post || "Não informado"}</dd></div><div><dt>Responsável</dt><dd>{vacancy?.owner || "RH"}</dd></div><div><dt>Status</dt><dd>{vacancy?.status || "Ativa"}</dd></div></dl><strong>Próxima ação</strong><small>Confirmar entrevistas da semana e registrar os pareceres.</small></section></div>
  </section>;
}

export function CandidateList({ candidates, onOpen }) {
  return <section className="vacancy-workspace-view"><header className="vacancy-view-heading"><div><h2>Candidatos em lista</h2><p>{candidates.length} pessoas encontradas com os filtros atuais.</p></div></header><section className="vacancy-detail-card vacancy-candidate-list"><div className="vacancy-list-head"><span>Candidato</span><span>Etapa atual</span><span>Mobilidade</span><span>Disponibilidade</span><span /></div>{candidates.map((candidate) => <article key={`${candidate.id}-${candidate.stage}`}><span><b>{candidate.name}</b><small>{candidate.role} · {candidate.source}</small></span><span>{candidate.stage.replace("_", " ")}</span><span>{candidate.route}</span><span>{candidate.availability}</span><button className="secondary-action" type="button" onClick={() => onOpen(candidate)}>Ver perfil</button></article>)}</section></section>;
}

export function RejectedCandidates() {
  return <section className="vacancy-workspace-view"><header className="vacancy-view-heading"><div><h2>Candidatos desclassificados</h2><p>Registros demonstrativos mantidos para rastreabilidade do processo.</p></div><span className="count-badge">12 no total</span></header><section className="vacancy-detail-card vacancy-rejected-list">{rejectedCandidates.map(([name, reason, date]) => <article key={name}><span><b>{name}</b><small>{date}</small></span><p>{reason}</p><StatusPill tone="neutral">Registrado</StatusPill></article>)}</section></section>;
}

export function InterviewsWorkspace({ onStartInterview, onOpenSummary, onRequestReplacement, results }) {
  const groupedInterviews = [["Entrevistas com RH", interviewItems.filter((item) => item.stage === "Entrevista RH")], ["Entrevistas com gestor", interviewItems.filter((item) => item.stage === "Entrevista Gestor")]];
  return <section className="vacancy-workspace-view interview-list-view"><header className="vacancy-view-heading"><div><h2>Entrevistas da vaga</h2><p>Escolha uma pessoa para revisar o contexto e iniciar uma avaliação focada.</p></div><span className="interview-list-count"><CalendarBlank size={17} />3 entrevistas programadas</span></header><div className="interview-list-guide"><span>1. Revise o currículo</span><span>2. Registre a avaliação</span><span>3. Salve o parecer</span></div><div className="vacancy-interview-groups">{groupedInterviews.map(([title, items]) => <section key={title}><h3>{title}</h3><div className="vacancy-interview-list">{items.map((item) => { const completed = results[item.name]; return <article className="vacancy-detail-card vacancy-interview-card" key={item.name + item.time}><span className="interview-candidate"><span className={`candidate-initials candidate-tone-${item.color}`}>{item.initials}</span><span><strong>{item.name}</strong><small>{item.role}</small><small>{item.location}</small></span></span><span className="interview-schedule"><b><CalendarBlank size={16} />{item.time}</b><small><Clock size={15} />{item.duration}</small><small><UserCircle size={15} />{item.owner}</small></span><span className="interview-readiness"><small>{item.checklist}</small><span><i />{completed ? "Avaliação salva" : item.status}</span></span><div>{completed ? <><StatusPill tone="success">Concluída</StatusPill><button className="secondary-action" type="button" aria-label={`Ver resumo de ${item.name}`} onClick={() => onOpenSummary(item)}>Ver resumo</button><button className="text-action compact" type="button" aria-label={`Iniciar nova entrevista de ${item.name}`} onClick={() => onRequestReplacement(item)}>Iniciar nova</button></> : <><StatusPill tone={item.tone}>{item.status}</StatusPill><button className="primary-action" type="button" aria-label={`Iniciar entrevista de ${item.name}`} onClick={() => onStartInterview(item)}>Iniciar entrevista</button></>}</div></article>; })}</div></section>)}</div></section>;
}

export function InterviewLoading({ interview, onComplete }) {
  return <main className="interview-loading" aria-label={`Iniciando entrevista com ${interview.name}`}>
    <WelcomeIntro message="Iniciando a entrevista" subtitle={`${interview.name} · ${interview.stage}`} onComplete={onComplete} />
  </main>;
}

export function ReplacementConfirmation({ interview, onCancel, onConfirm }) { return <div className="interview-confirmation-backdrop"><section role="dialog" aria-modal="true" aria-label="Substituir avaliação anterior" className="interview-confirmation"><h2>Substituir avaliação anterior?</h2><p>Ao concluir e salvar uma nova entrevista de {interview.name}, a avaliação anterior e suas anotações serão substituídas. Se sair sem concluir, a avaliação anterior será preservada.</p><div><button className="secondary-action" type="button" aria-label="Cancelar nova entrevista" onClick={onCancel}>Cancelar</button><button className="primary-action" type="button" onClick={onConfirm}>Iniciar nova entrevista</button></div></section></div>; }

export function PromotionWorkspace({ publishedChannels, onPublish, onUnpublish }) {
  const channels = [["rioVagas", "RioVagas", "Portal de vagas", "Alcance regional para operações."], ["site", "Site da empresa", "Carreiras Alpha RH", "Publique na página institucional."], ["indeed", "Indeed", "Agregador de vagas", "Amplie a busca por candidatos."], ["linkedin", "LinkedIn", "Rede profissional", "Divulgação para perfis profissionais."], ["whatsapp", "WhatsApp", "Comunidades e indicações", "Envio para a rede de contatos autorizada."]];
  return <section className="vacancy-workspace-view"><header className="vacancy-view-heading"><div><h2>Divulgação da vaga</h2><p>Escolha os canais em que esta vaga deve ser publicada.</p></div></header><section className="vacancy-channel-list">{channels.map(([id, channel, category, detail]) => { const published = publishedChannels[id]; const brand = id === "rioVagas" ? "rio" : id === "site" ? "alpha" : id; return <article className="vacancy-detail-card" key={id}><span><ChannelMark brand={brand} /><span><b>{channel}</b><small>{category}</small></span></span><p>{detail}</p><div><StatusPill tone={published ? "success" : "neutral"}>{published ? "Divulgada" : "Pronta para publicar"}</StatusPill><button className={published ? "secondary-action" : "primary-action"} type="button" aria-label={published ? `Despublicar vaga no ${channel}` : `Divulgar vaga no ${channel}`} onClick={() => published ? onUnpublish(id) : onPublish(id)}>{published ? "Despublicar" : "Divulgar vaga"}</button></div></article>; })}</section></section>;
}

function Metric({ icon, value, label }) { return <article><span>{icon}</span><strong>{value}</strong><small>{label}</small></article>; }
