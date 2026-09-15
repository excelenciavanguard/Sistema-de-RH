import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle, ClipboardText, Eye, ListChecks, Plus, Question, SlidersHorizontal, Sparkle, UsersThree } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ROUTES } from "../navigation.js";

const steps = [
  { label: "Detalhes", icon: ClipboardText },
  { label: "Requisitos", icon: ListChecks },
  { label: "Perguntas", icon: Question },
  { label: "Etapas", icon: SlidersHorizontal },
  { label: "Revisão", icon: Eye },
];

const pipeline = ["Candidatura", "Triagem", "Contato", "Entrevista RH", "Entrevista Gestor", "Pesquisa", "Entrega de documentos", "Treinamento", "Contratação"];

export function VacancyCreateScreen({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [questions, setQuestions] = useState([
    { text: "Possui disponibilidade para trabalhar à noite?", required: true, type: "Sim ou não" },
    { text: "Qual é sua disponibilidade para início?", required: true, type: "Data" },
  ]);

  const StepIcon = steps[step].icon;

  function addQuestion() {
    setQuestions((items) => [...items, { text: "Nova pergunta para o candidato", required: false, type: "Resposta curta" }]);
  }

  return (
    <main className="screen-workspace vacancy-builder-screen">
      <ScreenHeader title="Criar vaga" description="Transforme a requisição aprovada em uma vaga clara, objetiva e pronta para receber candidaturas." />

      <div className="source-approval"><CheckCircle size={19} weight="fill" /><div><strong>REQ-2026-041 aprovada pela Diretoria</strong><span>Auxiliar de Serviços Gerais · Leblon Power · 4 vagas</span></div><button type="button">Ver requisição</button></div>

      {published ? (
        <div className="workflow-success" role="status"><span><Check size={20} weight="bold" /></span><div><strong>Vaga publicada no protótipo</strong><p>O fluxo visual foi concluído. Nenhuma publicação externa ou gravação real foi executada.</p></div><button type="button" onClick={() => onNavigate(ROUTES.kanban)}>Abrir Kanban <ArrowRight size={17} /></button></div>
      ) : null}

      <section className="surface-panel vacancy-builder">
        <nav className="builder-steps" aria-label="Etapas de criação da vaga">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return <button type="button" key={item.label} className={index === step ? "active" : index < step ? "completed" : ""} onClick={() => setStep(index)}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{item.label}</b></button>;
          })}
        </nav>

        <div className="builder-stage-heading"><span><StepIcon size={22} /></span><div><h2>{["Detalhes da vaga", "Requisitos da vaga", "Perguntas da candidatura", "Etapas do processo", "Revisão e publicação"][step]}</h2><p>{["Complete as informações que serão exibidas ao candidato.", "Separe o que é obrigatório do que é desejável.", "Colete somente informações necessárias para esta vaga.", "Confira o pipeline que o RH utilizará no Kanban.", "Revise o conteúdo antes de disponibilizar a vaga."][step]}</p></div></div>

        <div className="builder-stage-content">
          {step === 0 ? <DetailsStep /> : null}
          {step === 1 ? <RequirementsStep /> : null}
          {step === 2 ? <QuestionsStep questions={questions} onAdd={addQuestion} /> : null}
          {step === 3 ? <StagesStep /> : null}
          {step === 4 ? <ReviewStep questions={questions} /> : null}
        </div>

        <footer className="builder-footer sticky-builder-footer">
          <button className="secondary-action" type="button" onClick={() => step === 0 ? onNavigate(ROUTES.vacancies) : setStep(step - 1)}><ArrowLeft size={17} /> {step === 0 ? "Cancelar" : "Voltar"}</button>
          <div>
            <button className="secondary-action" type="button">Salvar rascunho</button>
            {step < 4 ? <button className="primary-action" type="button" onClick={() => setStep(step + 1)}>{["Continuar para requisitos", "Continuar para perguntas", "Continuar para etapas", "Revisar vaga"][step]} <ArrowRight size={17} /></button> : <button className="primary-action" type="button" onClick={() => setPublished(true)}><Sparkle size={17} /> Publicar vaga</button>}
          </div>
        </footer>
      </section>
    </main>
  );
}

function DetailsStep() {
  return <div className="form-grid two-columns"><label className="field-control"><span>Título da vaga</span><input defaultValue="Auxiliar de Serviços Gerais" /></label><label className="field-control"><span>Posto</span><select defaultValue="Leblon Power"><option>Leblon Power</option></select></label><label className="field-control"><span>Regime de contratação</span><select defaultValue="CLT"><option>CLT</option><option>PJ</option><option>Temporário</option></select></label><label className="field-control"><span>Quantidade</span><input type="number" defaultValue="4" /></label><label className="field-control"><span>Escala</span><input defaultValue="6×1" /></label><label className="field-control"><span>Horário</span><input defaultValue="06h às 18h" /></label><label className="field-control full-width"><span>Descrição das atividades</span><textarea defaultValue="Executar limpeza e conservação das áreas do posto, seguindo os procedimentos operacionais e de segurança." /></label></div>;
}

function RequirementsStep() {
  return <div className="requirements-layout"><div className="requirement-column"><h3>Obrigatórios</h3><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Ensino médio completo</strong><small>Comprovação conferida pelo RH.</small></span></label><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Disponibilidade para escala 6×1</strong><small>Horários confirmados na entrevista.</small></span></label><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Rota compatível com o turno</strong><small>A mobilidade apoia a análise e exige revisão humana.</small></span></label></div><div className="requirement-column"><h3>Desejáveis</h3><label className="check-line"><input type="checkbox" defaultChecked /><span><strong>Experiência em limpeza</strong><small>Ausência no currículo será marcada como “não informado”.</small></span></label><label className="check-line"><input type="checkbox" /><span><strong>Curso de atendimento</strong><small>Não elimina automaticamente.</small></span></label><button className="inline-add" type="button"><Plus size={16} /> Adicionar requisito</button></div></div>;
}

function QuestionsStep({ questions, onAdd }) {
  return <div className="questions-editor"><div className="editor-guidance"><Question size={19} /><p>Perguntas obrigatórias impedem o envio incompleto. Respostas de atenção são destacadas para o RH, nunca eliminadas silenciosamente.</p></div>{questions.map((question, index) => <article className="question-row" key={`${question.text}-${index}`}><span className="drag-handle">{index + 1}</span><label className="field-control"><span>Pergunta</span><input value={question.text} readOnly /></label><label className="field-control compact-field"><span>Tipo de resposta</span><select value={question.type} readOnly><option>{question.type}</option></select></label><label className="toggle-line"><input type="checkbox" defaultChecked={question.required} /><span>Obrigatória</span></label></article>)}<button className="inline-add" type="button" onClick={onAdd}><Plus size={16} /> Adicionar pergunta</button></div>;
}

function StagesStep() {
  return <div className="pipeline-editor"><div className="pipeline-guidance"><UsersThree size={19} /><p>As nove etapas aprovadas serão exibidas como colunas do Kanban. O candidato mantém um histórico único de movimentações.</p></div><ol>{pipeline.map((stage, index) => <li key={stage}><span>{index + 1}</span><strong>{stage}</strong><small>{index === 0 ? "Entrada das candidaturas" : index === 8 ? "Conclusão do processo" : "Etapa operacional do RH"}</small></li>)}</ol></div>;
}

function ReviewStep({ questions }) {
  return <div className="review-layout"><section><h3>Vaga</h3><dl><div><dt>Função</dt><dd>Auxiliar de Serviços Gerais</dd></div><div><dt>Posto</dt><dd>Leblon Power</dd></div><div><dt>Contratação</dt><dd>CLT · 4 vagas</dd></div><div><dt>Escala</dt><dd>6×1 · 06h às 18h</dd></div></dl></section><section><h3>Seleção</h3><dl><div><dt>Requisitos</dt><dd>3 obrigatórios · 2 desejáveis</dd></div><div><dt>Perguntas</dt><dd>{questions.length} configuradas</dd></div><div><dt>Pipeline</dt><dd>9 etapas</dd></div><div><dt>Responsável</dt><dd>Lucas · Equipe RH</dd></div></dl></section><aside><CheckCircle size={22} /><strong>Pronta para revisão final</strong><p>A publicação deste protótipo é apenas demonstrativa e não envia a vaga para sites externos.</p></aside></div>;
}
