import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bell, Briefcase, Check, CheckCircle, Clock, FileText, Flag, Info, MapPin, Pause, Play, Star, X } from "@phosphor-icons/react";
import { criteria, demoJourneys, getInterviewProfile, interviewSteps, money, ratingSummary, total } from "./interviewData.js";
import { defaultMobility, InterviewMobility } from "./InterviewMobility.jsx";
import "./interview.css";

const durationLabel = (seconds = 0) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
const ratingLabels = ["Não avaliado", "Muito abaixo", "A desenvolver", "Atende", "Acima do esperado", "Destaque"];

function Confirmation({ title, children, confirmLabel, onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.querySelector("button")?.focus();
    return () => previous?.focus();
  }, []);
  function onKeyDown(event) {
    if (event.key === "Escape") onCancel();
    if (event.key !== "Tab") return;
    const buttons = ref.current.querySelectorAll("button");
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  return <div className="iw-dialog-backdrop"><section ref={ref} className="iw-dialog" role="dialog" aria-modal="true" aria-label={title} onKeyDown={onKeyDown}><Info size={26} /><h2>{title}</h2>{children}<div><button className="iw-button secondary" type="button" onClick={onCancel}>Continuar entrevista</button><button className="iw-button" type="button" onClick={onConfirm}>{confirmLabel}</button></div></section></div>;
}

function ProgressRail({ steps }) {
  return <ol className="iw-progress" aria-label="Etapas da entrevista">{steps.map((step) => <li key={step.id} className={step.done ? "done" : ""}><span>{step.done ? <Check size={17} weight="bold" /> : null}</span><div><b>{step.label}</b><small>{step.detail}</small></div></li>)}</ol>;
}

function ResumePanel({ profile, reviewed, onReview }) {
  return <section className="iw-resume" aria-label={`Currículo de ${profile.name}`}>
    <header><span className="iw-avatar">{profile.initials || profile.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}</span><div><h2>{profile.name}</h2><p>{profile.role}</p><span className="iw-demo-label">Currículo demonstrativo</span></div></header>
    <div className="iw-person-meta"><span><MapPin size={16} />{profile.location}</span><span><Briefcase size={16} />{profile.experience}</span></div>
    <section><h3>Resumo profissional</h3><p>{profile.summary || "Informações profissionais a confirmar durante a conversa."}</p></section>
    <section><h3>Experiências profissionais</h3><ol className="iw-experience">{profile.jobs?.map((job) => <li key={job.company}><span>{job.period}</span><h4>{job.role}</h4><b>{job.company}</b><p>{job.detail}</p></li>)}</ol></section>
    <section><h3>Formação e disponibilidade</h3><dl className="iw-profile-facts"><div><dt>Escolaridade</dt><dd>{profile.education || "A confirmar"}</dd></div><div><dt>Disponibilidade</dt><dd>{profile.availability || "A confirmar"}</dd></div><div><dt>Origem do currículo</dt><dd>{profile.source || "Não informada"}</dd></div><div><dt>Idioma declarado</dt><dd>Português · demonstrativo</dd></div></dl></section>
    <section><h3>Competências</h3><div className="iw-skills">{profile.skills?.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
    <details className="iw-method"><summary>Roteiro de apoio à conversa</summary><ul><li>Conte sobre uma situação de trabalho semelhante às atividades desta vaga.</li><li>Como você organiza sua rotina e lida com imprevistos?</li><li>Quais orientações ou treinamentos ajudariam no início?</li></ul></details>
    <button type="button" className="iw-review-button" aria-pressed={reviewed} onClick={onReview}><CheckCircle size={18} weight={reviewed ? "fill" : "regular"} />{reviewed ? "Currículo revisado" : "Marcar currículo como revisado"}</button>
    <p className="iw-fine-print">Exemplo para navegação. O documento original será exibido quando a integração com currículos estiver disponível.</p>
  </section>;
}

function ConsiderationsPanel({ notes, recommendation, onNotes, onRecommendation }) {
  return <section className="iw-considerations iw-considerations-tab" aria-label="Considerações da entrevista">
    <header><div><h2>Considerações da entrevista</h2><p>Registre seu parecer antes de concluir para não perder os pontos importantes da conversa.</p></div><FileText size={22} /></header>
    <div className="iw-considerations-reminder"><Flag size={18} /><div><b>Etapa decisiva da entrevista</b><p>As considerações aparecem no resumo final e ajudam a orientar o próximo passo.</p></div></div>
    <label>Anotações da entrevista<textarea aria-label="Anotações da entrevista" value={notes} onChange={(e) => onNotes(e.target.value)} placeholder="Registre os principais pontos da conversa e exemplos relatados…" /></label>
    <label>Parecer do entrevistador<select aria-label="Parecer do entrevistador" value={recommendation} onChange={(e) => onRecommendation(e.target.value)}><option value="">Selecione um parecer</option><option>Avançar para a próxima etapa</option><option>Aprofundar em nova entrevista</option><option>Manter em avaliação</option><option>Não avançar nesta vaga</option></select></label>
    <p className="iw-fine-print">O parecer não move o candidato de etapa automaticamente. Registre somente informações pertinentes à função.</p>
  </section>;
}

export function InterviewMode({ interview, initialResult, onFinish, onExit, vacancy }) {
  const profile = getInterviewProfile(interview.name);
  const [ratings, setRatings] = useState(initialResult?.ratings ?? {});
  const [evidence, setEvidence] = useState(initialResult?.evidence ?? {});
  const [notes, setNotes] = useState(initialResult?.notes ?? "");
  const [recommendation, setRecommendation] = useState(initialResult?.recommendation ?? "");
  const [reviewed, setReviewed] = useState(initialResult?.reviewed ?? { resume: false, mobility: false });
  const [mobility, setMobility] = useState(initialResult?.mobility ?? { ...defaultMobility });
  const [tab, setTab] = useState("resume");
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [confirmation, setConfirmation] = useState(null);
  const startedAt = useRef(new Date().toISOString());
  const leftPanel = useRef(null), assessmentPanel = useRef(null);
  const score = ratingSummary(ratings);
  const state = { ratings, notes, recommendation, reviewed };
  const steps = interviewSteps(state);
  const completed = steps.filter((step) => step.done).length;
  const reminders = steps.filter((step) => !step.done);

  useEffect(() => {
    if (paused || confirmation) return undefined;
    let previous = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - previous) / 1000);
      previous += seconds * 1000;
      setElapsed((current) => current + seconds);
    }, 1000);
    return () => clearInterval(timer);
  }, [paused, confirmation]);
  useEffect(() => {
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  function finish() {
    onFinish({ ...interview, ratings, evidence, notes, recommendation, reviewed, mobility,
      startedAt: startedAt.current, completedAt: new Date().toLocaleString("pt-BR"), elapsed,
      post: vacancy?.post || "Leblon Power", vacancyCode: vacancy?.code || "2026-0157", demoRouteAvailable: !vacancy || vacancy.code === "2026-0157" });
  }

  return <main className="iw-shell" aria-label="Modo de entrevista">
    <div className="iw-container">
      <header className="iw-header"><div><span className="iw-kicker">Modo de entrevista</span><h1>Entrevista em andamento</h1><p><b>{interview.name}</b><span>·</span>{interview.stage}<span>·</span>{interview.owner}</p></div><div className="iw-header-actions"><div className="iw-timer"><Clock size={18} /><time aria-label="Tempo da entrevista">{durationLabel(elapsed)}</time><button type="button" aria-label={paused ? "Retomar cronômetro" : "Pausar cronômetro"} onClick={() => setPaused((v) => !v)}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>{paused && <small>Pausado</small>}</div><button className="iw-button secondary" type="button" onClick={() => setConfirmation("exit")}><X size={17} />Sair sem concluir</button></div></header>
      <ProgressRail steps={steps} />
      <div className="iw-layout">
        <section className="iw-reference" ref={leftPanel} tabIndex={-1} aria-label="Informações do candidato"><div className="iw-tabs" role="tablist" aria-label="Informações da entrevista"><button type="button" role="tab" id="iw-resume-tab" aria-selected={tab === "resume"} aria-controls="iw-reference-panel" onClick={() => setTab("resume")}><FileText size={18} />Currículo</button><button type="button" role="tab" id="iw-mobility-tab" aria-selected={tab === "mobility"} aria-controls="iw-reference-panel" onClick={() => setTab("mobility")}><MapPin size={18} />Mobilidade</button><button type="button" role="tab" id="iw-considerations-tab" aria-selected={tab === "considerations"} aria-controls="iw-reference-panel" onClick={() => setTab("considerations")}><Flag size={18} />Considerações</button><span>Dados demonstrativos</span></div><div id="iw-reference-panel" role="tabpanel" aria-labelledby={tab === "resume" ? "iw-resume-tab" : tab === "mobility" ? "iw-mobility-tab" : "iw-considerations-tab"}>{tab === "resume" ? <ResumePanel profile={profile} reviewed={reviewed.resume} onReview={() => setReviewed((v) => ({ ...v, resume: !v.resume }))} /> : tab === "mobility" ? <InterviewMobility profile={profile} post={vacancy?.post} demoAvailable={!vacancy || vacancy.code === "2026-0157"} value={mobility} onChange={(next) => { setMobility(next); setReviewed((v) => ({ ...v, mobility: false })); }} reviewed={reviewed.mobility} onReview={() => setReviewed((v) => ({ ...v, mobility: !v.mobility }))} /> : <ConsiderationsPanel notes={notes} recommendation={recommendation} onNotes={setNotes} onRecommendation={setRecommendation} />}</div></section>
        <div className="iw-workbench">
          <section className="iw-panel iw-assessment" ref={assessmentPanel} tabIndex={-1}><header><div><h2>Avaliação de competências</h2><p>Avalie com base em exemplos, não em impressões.</p></div><div className="iw-average" aria-label="Média da avaliação"><Star size={18} weight="fill" /><b>{score.average || "—"}</b><small>/ 5</small></div></header><p className="iw-rating-legend">1 Muito abaixo · 2 A desenvolver · 3 Atende · 4 Acima do esperado · 5 Destaque</p><div className="iw-assessment-progress"><span>{score.count} de {criteria.length} critérios avaliados</span><span>Média dos critérios preenchidos</span><progress aria-label="Critérios avaliados" value={score.count} max={criteria.length} /></div>
            <div className="iw-ratings">{criteria.map(({ name, hint }, index) => <div className="iw-rating" key={name}><div className="iw-rating-line"><span className="iw-criterion-number">{String(index + 1).padStart(2, "0")}</span><div className="iw-criterion"><h3>{name}</h3><p>{hint}</p></div><div className="iw-stars"><div role="group" aria-label={`Nota de ${name}`}>{[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} aria-label={`Avaliar ${name} com ${star} estrelas`} aria-pressed={ratings[name] === star} onClick={() => setRatings((current) => ({ ...current, [name]: current[name] === star ? 0 : star }))}><Star size={22} weight={star <= (ratings[name] || 0) ? "fill" : "regular"} /></button>)}</div><small>{ratings[name] ? `${ratings[name]}/5 · ${ratingLabels[ratings[name]]}` : "Não avaliado"}</small></div></div><details className="iw-evidence" open={Boolean(ratings[name])}><summary>{evidence[name] ? "Comentário registrado" : "Adicionar comentário da avaliação"}</summary><textarea aria-label={`Evidência de ${name}`} value={evidence[name] || ""} onChange={(event) => setEvidence((v) => ({ ...v, [name]: event.target.value }))} placeholder="Qual situação relatada sustenta essa avaliação?" /></details></div>)}</div>
          </section>
        </div>
      </div>
    </div>
    <footer className="iw-dock"><div className="iw-interviewer-identity"><img src="/assets/Logo%20Rh.png" alt="Alpha RH" /><span><small>Entrevista conduzida por</small><b>Ramon · RH Global</b></span></div><div className="iw-dock-progress"><span>{completed} de 4 etapas preenchidas</span><progress value={completed} max={4} aria-label="Progresso da entrevista" /></div><button className="iw-button" type="button" onClick={() => completed === 4 ? finish() : setConfirmation("finish")}><CheckCircle size={19} />Concluir entrevista<ArrowRight size={17} /></button></footer>
    {confirmation === "exit" && <Confirmation title="Sair sem concluir?" confirmLabel="Sair e descartar esta entrevista" onCancel={() => setConfirmation(null)} onConfirm={onExit}><p>As alterações desta sessão serão descartadas. Se houver uma avaliação anterior concluída, ela será preservada.</p></Confirmation>}
    {confirmation === "finish" && <Confirmation title="Concluir com etapas pendentes?" confirmLabel="Concluir com pendências" onCancel={() => setConfirmation(null)} onConfirm={finish}><p>O resumo mostrará as etapas não preenchidas, sem inventar notas ou confirmações.</p><ul>{reminders.map((step) => <li key={step.id}>{step.label}: {step.detail.toLocaleLowerCase("pt-BR")}</li>)}</ul></Confirmation>}
  </main>;
}

function SavedAssessment({ result }) {
  const score = ratingSummary(result.ratings);
  const steps = interviewSteps(result);
  const mobility = result.mobility;
  const route = result.demoRouteAvailable !== false ? demoJourneys[result.name] : null;
  return <div className="iw-saved-assessment">
    <section className="iw-result-overview"><div className="iw-result-score"><span>Nota final</span><b aria-label="Nota final">{score.average || "Sem nota"}{score.average && <small> / 5</small>}</b><span>{score.count} de {criteria.length} critérios avaliados</span></div><div><h2>Progresso da entrevista</h2><p>{steps.filter((s) => s.done).length} de 4 etapas preenchidas</p><ol className="iw-result-steps">{steps.map((step) => <li key={step.id} className={step.done ? "done" : ""}>{step.done ? <CheckCircle size={21} weight="fill" /> : <Clock size={21} />}<div><b>{step.label}</b><small>{step.detail}</small></div></li>)}</ol></div></section>
    <div className="iw-result-columns"><section className="iw-result-section"><h2>Avaliação por competência</h2>{criteria.map(({ name }) => <div className="iw-saved-rating" key={name}><div><b>{name}</b><span>{result.ratings?.[name] ? `${result.ratings[name]} / 5` : "Não avaliado"}</span></div><progress value={result.ratings?.[name] || 0} max={5} aria-label={`Resultado de ${name}`} />{result.evidence?.[name] && <p>{result.evidence[name]}</p>}</div>)}</section><section className="iw-result-section"><h2>Considerações e parecer</h2><div className="iw-saved-recommendation"><Flag size={19} /><b>{result.recommendation || "Parecer não registrado"}</b></div>{[["Anotações", result.notes], ["Pontos fortes", result.strengths], ["Pontos a aprofundar", result.concerns], ["Próximos passos", result.nextSteps]].map(([label, text]) => <div className="iw-saved-note" key={label}><h3>{label}</h3><p>{text || "Não registrado."}</p></div>)}</section></div>
    <section className="iw-result-section iw-saved-mobility"><h2>Mobilidade registrada</h2><p>{getInterviewProfile(result.name).location} → {result.post || "Leblon Power"} · Simulação demonstrativa</p>{mobility && route ? <><div className="iw-saved-route"><span>Ida<b>{total(route.outbound, "minutes")} min · {money(total(route.outbound, "fare"))}</b></span><span>Volta<b>{total(route.inbound, "minutes")} min · {money(total(route.inbound, "fare"))}</b></span><span>Estimativa mensal<b>{money((total(route.outbound, "fare") + total(route.inbound, "fare")) * mobility.days)} · {mobility.days} dias</b></span></div><p>Chegada: {mobility.arrival} · Saída: {mobility.departure} · Folga: {mobility.buffer} min</p></> : <p>Rota não calculada nesta avaliação.</p>}<p>Meios informados: {mobility?.transports?.length ? mobility.transports.join(", ") : "Não registrados"}</p><p>Origem e destino: {mobility?.addressConfirmed ? "discutidos" : "a confirmar"} · Escala e transporte: {mobility?.scheduleConfirmed ? "discutidos" : "a confirmar"}</p><p className="iw-preserve-lines">{mobility?.notes || "Sem observações de mobilidade."}</p></section>
  </div>;
}

export function InterviewCompletion({ result, onBack }) {
  return <main className="iw-completion" aria-label="Encerramento da entrevista"><div className="iw-completion-content"><header className="iw-completion-header"><img src="/assets/alpha-rh-logo.png" alt="Alpha RH" /><span className="iw-completion-check"><CheckCircle size={38} weight="fill" /></span><h1>Entrevista concluída</h1><p>A conversa terminou. Aqui está o registro da sua avaliação.</p><div><b>{result.name}</b><span>{result.stage} · {result.owner}</span><small>{result.completedAt} · Tempo ativo: {durationLabel(result.elapsed)}</small></div></header><SavedAssessment result={result} /><footer className="iw-completion-footer"><p>Resumo demonstrativo disponível na lista enquanto esta página permanecer aberta.</p><button type="button" className="iw-button" onClick={onBack}>Voltar para entrevistas<ArrowRight size={18} /></button></footer></div></main>;
}

export function InterviewSummary({ result, onBack, onStartReplacement }) {
  return <section className="iw-history-summary"><header><div><button className="iw-button secondary" type="button" onClick={onBack}><ArrowLeft size={17} />Voltar para entrevistas</button><h2>Resumo da entrevista</h2><p>{result.name} · {result.stage} · {result.completedAt}</p></div><button className="iw-button" type="button" aria-label={`Iniciar nova entrevista de ${result.name}`} onClick={onStartReplacement}>Iniciar nova entrevista</button></header><SavedAssessment result={result} /></section>;
}
