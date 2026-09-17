import { initialCandidates } from "../../data.js";

export const criteria = [
  { name: "Comunicação", hint: "Clareza ao explicar experiências e escuta durante a conversa." },
  { name: "Experiência prática", hint: "Exemplos concretos das atividades exigidas pela função." },
  { name: "Postura profissional", hint: "Responsabilidade e conduta em situações de trabalho." },
  { name: "Aderência à vaga", hint: "Correspondência entre competências e requisitos do posto." },
  { name: "Organização", hint: "Planejamento de rotinas, prioridades e cuidado com materiais." },
  { name: "Disponibilidade", hint: "Compatibilidade declarada com a escala e o início previsto." },
  { name: "Potencial de desenvolvimento", hint: "Disposição para aprender, receber orientação e se adaptar." },
];

const resumes = {
  "Rafael Santos": {
    summary: "Profissional com experiência em limpeza, conservação e apoio operacional em ambientes corporativos.",
    jobs: [{ role: "Auxiliar de serviços gerais", company: "Grupo Visão", period: "2022–2026", detail: "Limpeza de áreas comuns, organização de materiais e uso de equipamentos de proteção." }, { role: "Ajudante operacional", company: "Limpa Rio", period: "2020–2022", detail: "Apoio à conservação de instalações e às rotinas da equipe operacional." }],
    skills: ["Limpeza técnica", "Organização", "Trabalho em equipe", "Uso de EPIs"],
  },
  "Mariana Lima": {
    summary: "Experiência em limpeza hospitalar e conservação, com atenção a procedimentos e organização das rotinas.",
    jobs: [{ role: "Auxiliar de limpeza", company: "Viva Serviços", period: "2023–2026", detail: "Higienização de ambientes e controle de materiais de limpeza." }, { role: "Auxiliar operacional", company: "Pronto Lar", period: "2021–2023", detail: "Conservação de áreas coletivas e apoio à equipe." }],
    skills: ["Rotinas de limpeza", "Atenção a detalhes", "NR-35", "Comunicação"],
  },
  "André Cardoso": {
    summary: "Porteiro com experiência em controle de acesso, atendimento e registro de ocorrências.",
    jobs: [{ role: "Porteiro", company: "Segurança Sul", period: "2021–2026", detail: "Controle de visitantes, atendimento e registro de ocorrências." }, { role: "Controlador de acesso", company: "Prime Portaria", period: "2019–2021", detail: "Conferência de entradas e saídas e orientação a visitantes." }],
    skills: ["Controle de acesso", "Atendimento", "CNH B", "Registro de ocorrências"],
  },
};

export function getInterviewProfile(name) {
  return { ...initialCandidates.find((candidate) => candidate.name === name), ...resumes[name], name };
}

// Illustrative legs, not a routing service. Outbound totals match the seeded candidate cards.
const walk = (minutes, meters) => ({ label: "Caminhada", minutes, meters, fare: 0, kind: "walk" });
const bus = (minutes, fare, label = "Transporte público") => ({ label, minutes, fare, meters: 0, kind: "bus" });
export const demoJourneys = {
  "Rafael Santos": { outbound: [walk(6, 450), bus(32, 6.2), walk(4, 350)], inbound: [walk(4, 350), bus(36, 6.2), walk(6, 450)] },
  "Mariana Lima": { outbound: [walk(6, 450), bus(20, 6.2), bus(8, 4.5, "Segunda condução"), walk(4, 350)], inbound: [walk(4, 350), bus(24, 6.2), bus(8, 4.5, "Segunda condução"), walk(6, 450)] },
};
export const money = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const total = (legs, field) => legs.reduce((sum, leg) => sum + leg[field], 0);
export function ratingSummary(ratings = {}) {
  const values = criteria.map(({ name }) => ratings[name]).filter((value) => value > 0 && value <= 5);
  return { count: values.length, average: values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : null };
}
export function interviewSteps(result) {
  const score = ratingSummary(result.ratings);
  return [
    { id: "resume", label: "Currículo", done: Boolean(result.reviewed?.resume), detail: result.reviewed?.resume ? "Revisão registrada" : "Revisão não registrada" },
    { id: "mobility", label: "Mobilidade", done: Boolean(result.reviewed?.mobility), detail: result.reviewed?.mobility ? "Análise registrada" : "Análise não registrada" },
    { id: "assessment", label: "Avaliação", done: score.count === criteria.length, detail: `${score.count} de ${criteria.length} critérios avaliados` },
    { id: "notes", label: "Considerações", done: Boolean(result.notes?.trim() && result.recommendation), detail: result.notes?.trim() && result.recommendation ? "Anotações e parecer registrados" : "Anotações ou parecer pendentes" },
  ];
}
export function clockTime(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`;
}
export function timeMinutes(time) { const [hours, minutes] = time.split(":").map(Number); return hours * 60 + minutes; }
