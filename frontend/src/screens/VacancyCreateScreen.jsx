import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle, ClipboardText, Eye, ListChecks, Plus, Question } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ROUTES } from "../navigation.js";

const steps = [
  { label: "Detalhes", icon: ClipboardText },
  { label: "Requisitos", icon: ListChecks },
  { label: "Perguntas", icon: Question },
  { label: "Revisão", icon: Eye },
];

const pipeline = ["Candidatura", "Triagem", "Contato", "Entrevista RH", "Entrevista Gestor", "Pesquisa", "Entrega de documentos", "Treinamento", "Contratação"];
const benefitOptions = [
  { id: "transport", label: "Vale-transporte" }, { id: "food", label: "Vale-refeição / alimentação" },
  { id: "health", label: "Plano de saúde" }, { id: "life", label: "Seguro de vida" }, { id: "other", label: "Outro benefício" },
];
const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatSalary(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? currencyFormatter.format(numericValue).replace(/\u00a0/g, " ") : "Não informado";
}

function formatSalaryInput(value) { return value ? formatSalary(value) : ""; }

function parseSalaryInput(value) {
  const input = String(value).trim();
  if (!input) return "";
  if (input.includes("R$")) return String(Number(input.replace(/\D/g, "")) / 100);
  return input.replace(/[^\d,.-]/g, "").replace(",", ".");
}

function formatBenefits(benefits) {
  return benefitOptions.filter((option) => benefits[option.id]?.selected).map((option) => `${option.label} · ${formatSalary(benefits[option.id].value)}`).join(" · ") || "Não informado";
}

const initialVacancy = {
  title: "Auxiliar de Serviços Gerais", department: "Serviços operacionais", post: "Leblon Power", responsible: "Lucas · Equipe RH", vacancyType: "Reposição",
  regime: "CLT", quantity: "4", workModel: "Presencial", city: "Rio de Janeiro - RJ", startDate: "2026-09-28", scale: "6×1", shift: "Diurno", schedule: "06h às 18h",
  salaryMin: "1720", salaryMax: "1980", salaryIsSingle: false, benefits: {
    transport: { selected: true, value: "220" }, food: { selected: true, value: "660" }, health: { selected: false, value: "" }, life: { selected: true, value: "18" }, other: { selected: false, value: "" },
  }, experienceLevel: "Experiência prévia desejável",
  description: "Executar limpeza e conservação das áreas do posto, seguindo os procedimentos operacionais e de segurança.",
};

export function VacancyCreateScreen({ onNavigate, sourceRequisition = null }) {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [vacancy, setVacancy] = useState(() => sourceRequisition ? { ...initialVacancy, title: sourceRequisition.role, post: sourceRequisition.post, quantity: String(sourceRequisition.openings), vacancyType: sourceRequisition.needType || initialVacancy.vacancyType, startDate: sourceRequisition.startDate || "", description: sourceRequisition.reason || "" } : initialVacancy);
  const [questions, setQuestions] = useState([
    { text: "Possui disponibilidade para trabalhar à noite?", required: true, type: "Sim ou não" },
    { text: "Qual é sua disponibilidade para início?", required: true, type: "Data" },
  ]);

  const StepIcon = steps[step].icon;

  function addQuestion() {
    setQuestions((items) => [...items, { text: "Nova pergunta para o candidato", required: false, type: "Resposta curta" }]);
  }

  function updateVacancy(field, value) { setVacancy((current) => ({ ...current, [field]: value })); }
  function updateBenefit(id, field, value) { setVacancy((current) => ({ ...current, benefits: { ...current.benefits, [id]: { ...current.benefits[id], [field]: value } } })); }

  return (
    <main className="screen-workspace vacancy-builder-screen">
      <ScreenHeader title="Criar vaga" description="Prepare os detalhes da vaga e publique quando estiver pronta para receber candidaturas." />

      {sourceRequisition && <div className="source-approval"><ClipboardText size={19} /><div><strong>Origem: {sourceRequisition.code}</strong><span>{sourceRequisition.role} · {sourceRequisition.post} · {sourceRequisition.openings} vagas</span></div><button type="button" onClick={() => onNavigate(ROUTES.requisitions)}>Ver requisições</button></div>}

      {published ? (
        <div className="workflow-success" role="status"><span><Check size={20} weight="bold" /></span><div><strong>Vaga publicada no protótipo</strong><p>O fluxo visual foi concluído. Nenhuma publicação externa ou gravação real foi executada.</p></div><button type="button" onClick={() => onNavigate(ROUTES.kanban)}>Visualizar vaga <ArrowRight size={17} /></button></div>
      ) : null}

      <section className="surface-panel vacancy-builder">
        <nav className="builder-steps" aria-label="Etapas de criação da vaga">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return <button type="button" key={item.label} className={index === step ? "active" : index < step ? "completed" : ""} onClick={() => setStep(index)}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{item.label}</b></button>;
          })}
        </nav>

        <div className="builder-stage-heading"><span><StepIcon size={22} /></span><div><h2>{["Detalhes da vaga", "Requisitos da vaga", "Perguntas da candidatura", "Revisão e publicação"][step]}</h2><p>{["Complete as informações que serão exibidas ao candidato.", "Separe o que é obrigatório do que é desejável.", "Colete somente informações necessárias para esta vaga.", "Revise o conteúdo antes de disponibilizar a vaga."][step]}</p></div></div>

        <div className="builder-stage-content">
          {step === 0 ? <DetailsStep vacancy={vacancy} onChange={updateVacancy} onBenefitChange={updateBenefit} /> : null}
          {step === 1 ? <RequirementsStep /> : null}
          {step === 2 ? <QuestionsStep questions={questions} onAdd={addQuestion} /> : null}
          {step === 3 ? <ReviewStep questions={questions} vacancy={vacancy} /> : null}
        </div>

        <footer className="builder-footer sticky-builder-footer">
          <button className="secondary-action" type="button" onClick={() => step === 0 ? onNavigate(ROUTES.vacancies) : setStep(step - 1)}><ArrowLeft size={17} /> {step === 0 ? "Cancelar" : "Voltar"}</button>
          <div>
            <button className="secondary-action" type="button">Salvar rascunho</button>
            {step < 3 ? <button className="primary-action" type="button" onClick={() => setStep(step + 1)}>{["Continuar para requisitos", "Continuar para perguntas", "Revisar vaga"][step]} <ArrowRight size={17} /></button> : <button className="primary-action" type="button" onClick={() => setPublished(true)}>Criar vaga</button>}
          </div>
        </footer>
      </section>
    </main>
  );
}

function DetailsStep({ vacancy, onChange, onBenefitChange }) {
  const field = (name) => ({ value: vacancy[name], onChange: (event) => onChange(name, event.target.value) });
  const salaryField = (name) => ({ value: formatSalaryInput(vacancy[name]), onChange: (event) => onChange(name, parseSalaryInput(event.target.value)) });

  return <div className="vacancy-details-form">
    <section className="vacancy-details-section">
      <div><h3>Identificação da oportunidade</h3><p>Dados internos que organizam a vaga para o RH.</p></div>
      <div className="form-grid two-columns">
        <label className="field-control"><span>Título da vaga</span><input {...field("title")} /></label>
        <label className="field-control"><span>Área / departamento</span><input {...field("department")} /></label>
        <label className="field-control"><span>Posto</span><select {...field("post")}><option>Leblon Power</option><option>Bay View Botafogo</option><option>Comrio Ilha</option></select></label>
        <label className="field-control"><span>Responsável pela vaga</span><select {...field("responsible")}><option>Lucas · Equipe RH</option><option>Ana Marques · Equipe RH</option><option>Carlos Mendes · Operações</option></select></label>
        <label className="field-control"><span>Tipo da vaga</span><select {...field("vacancyType")}><option>Reposição</option><option>Nova posição</option><option>Temporária</option></select></label>
        <label className="field-control"><span>Quantidade de vagas</span><input type="number" min="1" {...field("quantity")} /></label>
      </div>
    </section>
    <section className="vacancy-details-section">
      <div><h3>Contratação, local e jornada</h3><p>Informações práticas que ajudam a pessoa a decidir se a oportunidade faz sentido.</p></div>
      <div className="form-grid two-columns">
        <label className="field-control"><span>Regime de contratação</span><select {...field("regime")}><option>CLT</option><option>PJ</option><option>Temporário</option></select></label>
        <label className="field-control"><span>Modalidade de trabalho</span><select {...field("workModel")}><option>Presencial</option><option>Híbrido</option><option>Remoto</option></select></label>
        <label className="field-control"><span>Cidade / UF</span><input {...field("city")} /></label>
        <label className="field-control"><span>Previsão de início</span><input type="date" {...field("startDate")} /></label>
        <label className="field-control"><span>Escala</span><input {...field("scale")} /></label>
        <label className="field-control"><span>Turno</span><select {...field("shift")}><option>Diurno</option><option>Noturno</option><option>Variável</option></select></label>
        <label className="field-control"><span>Horário</span><input {...field("schedule")} /></label>
        <label className="field-control"><span>Nível de experiência</span><select {...field("experienceLevel")}><option>Experiência prévia desejável</option><option>Primeira oportunidade</option><option>Experiência obrigatória</option></select></label>
      </div>
    </section>
    <section className="vacancy-details-section">
      <div><h3>Informações para divulgação</h3><p>Estes dados aparecem para a pessoa candidata na publicação da vaga.</p></div>
      <div className="form-grid two-columns">
        <div className="salary-fields full-width">
          <div className="field-control"><label htmlFor="salary-min">{vacancy.salaryIsSingle ? "Valor do salário" : "Valor mínimo"}</label><span className="currency-input"><input id="salary-min" type="text" inputMode="decimal" placeholder="R$ 0,00" {...salaryField("salaryMin")} /></span></div>
          {!vacancy.salaryIsSingle ? <div className="field-control"><label htmlFor="salary-max">Valor máximo</label><span className="currency-input"><input id="salary-max" type="text" inputMode="decimal" placeholder="R$ 0,00" {...salaryField("salaryMax")} /></span></div> : null}
          <label className="salary-single-toggle"><input type="checkbox" checked={vacancy.salaryIsSingle} onChange={(event) => onChange("salaryIsSingle", event.target.checked)} /><span>Salário com valor único</span></label>
        </div>
        <BenefitsEditor benefits={vacancy.benefits} onChange={onBenefitChange} />
        <div className="field-control full-width"><div className="field-label-with-action"><label htmlFor="vacancy-description">Descrição da vaga</label><button className="generate-description-action" type="button" disabled title="Disponível quando a integração de IA for conectada">Gerar com IA</button></div><textarea id="vacancy-description" {...field("description")} /></div>
      </div>
    </section>
  </div>;
}

function BenefitsEditor({ benefits, onChange }) {
  return <fieldset className="benefits-editor full-width"><legend>Benefícios</legend><p>Marque os benefícios oferecidos e informe o valor mensal de cada um.</p><div>{benefitOptions.map((option) => {
    const benefit = benefits[option.id];
    const inputId = `benefit-${option.id}`;
    return <article className="benefit-option" key={option.id}><label htmlFor={inputId}><input id={inputId} type="checkbox" checked={benefit.selected} onChange={(event) => onChange(option.id, "selected", event.target.checked)} /><span>{option.label}</span></label>{benefit.selected ? <div className="benefit-value"><label htmlFor={`${inputId}-value`}>Valor de {option.label}</label><span className="currency-input"><input id={`${inputId}-value`} type="text" inputMode="decimal" placeholder="R$ 0,00" value={formatSalaryInput(benefit.value)} onChange={(event) => onChange(option.id, "value", parseSalaryInput(event.target.value))} /></span></div> : null}</article>;
  })}</div></fieldset>;
}

function RequirementsStep() {
  return <div className="requirements-layout"><div className="requirement-column"><h3>Obrigatórios</h3><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Ensino médio completo</strong><small>Comprovação conferida pelo RH.</small></span></label><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Disponibilidade para escala 6×1</strong><small>Horários confirmados na entrevista.</small></span></label><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Rota compatível com o turno</strong><small>A mobilidade apoia a análise e exige revisão humana.</small></span></label></div><div className="requirement-column"><h3>Desejáveis</h3><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Experiência em limpeza</strong><small>Ausência no currículo será marcada como “não informado”.</small></span></label><label className="check-line"><input type="checkbox" /><span><strong>Curso de atendimento</strong><small>Não elimina automaticamente.</small></span></label><button className="inline-add" type="button"><Plus size={16} /> Adicionar requisito</button></div></div>;
}

function QuestionsStep({ questions, onAdd }) {
  return <div className="questions-editor"><div className="editor-guidance"><Question size={19} /><p>Perguntas obrigatórias impedem o envio incompleto. Respostas de atenção são destacadas para o RH, nunca eliminadas silenciosamente.</p></div>{questions.map((question, index) => <article className="question-row" key={`${question.text}-${index}`}><span className="drag-handle">{index + 1}</span><label className="field-control"><span>Pergunta</span><input value={question.text} readOnly /></label><label className="field-control compact-field"><span>Tipo de resposta</span><select value={question.type} readOnly><option>{question.type}</option></select></label><label className="toggle-line"><input type="checkbox" defaultChecked={question.required} /><span>Obrigatória</span></label></article>)}<button className="inline-add" type="button" onClick={onAdd}><Plus size={16} /> Adicionar pergunta</button></div>;
}

function ReviewStep({ questions, vacancy }) {
  const startDate = vacancy.startDate ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${vacancy.startDate}T00:00:00Z`)) : "Não definida";
  const salary = vacancy.salaryIsSingle ? formatSalary(vacancy.salaryMin) : `${formatSalary(vacancy.salaryMin)} a ${formatSalary(vacancy.salaryMax)}`;

  return <div className="review-layout"><section><h3>Vaga</h3><dl><div><dt>Função</dt><dd>{vacancy.title}</dd></div><div><dt>Área</dt><dd>{vacancy.department}</dd></div><div><dt>Posto</dt><dd>{vacancy.post} · {vacancy.city}</dd></div><div><dt>Contratação</dt><dd>{vacancy.regime} · {vacancy.quantity} vagas · {vacancy.vacancyType}</dd></div><div><dt>Jornada</dt><dd>{vacancy.workModel} · {vacancy.scale} · {vacancy.schedule}</dd></div></dl></section><section><h3>Oferta e seleção</h3><dl><div><dt>Faixa salarial</dt><dd>{salary}</dd></div><div><dt>Benefícios</dt><dd>{formatBenefits(vacancy.benefits)}</dd></div><div><dt>Início previsto</dt><dd>{startDate}</dd></div><div><dt>Experiência</dt><dd>{vacancy.experienceLevel}</dd></div><div><dt>Perguntas</dt><dd>{questions.length} configuradas</dd></div><div><dt>Pipeline</dt><dd>{pipeline.length} etapas</dd></div><div><dt>Responsável</dt><dd>{vacancy.responsible}</dd></div></dl></section><section className="review-pipeline"><div className="review-pipeline-heading"><div><h3>Pipeline do processo</h3><p>As etapas aprovadas serão usadas como colunas do Kanban após a publicação.</p></div><span>{pipeline.length} etapas</span></div><ol>{pipeline.map((stage, index) => <li key={stage}><span>{index + 1}</span><div><strong>{stage}</strong><small>{index === 0 ? "Entrada das candidaturas" : index === pipeline.length - 1 ? "Conclusão do processo" : "Etapa operacional do RH"}</small></div></li>)}</ol></section><aside><CheckCircle size={22} /><strong>Pronta para revisão final</strong><p>A publicação deste protótipo é apenas demonstrativa e não envia a vaga para sites externos.</p></aside></div>;
}
