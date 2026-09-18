export const requisitions = [
  { code: "REQ-2026-041", role: "Auxiliar de Serviços Gerais", post: "Leblon Power", requester: "Marcos Lima", openings: 4, created: "14/09/2026", status: "Aberta", tone: "warning" },
  { code: "REQ-2026-040", role: "Porteiro", post: "Bay View Botafogo", requester: "Ana Souza", openings: 2, created: "13/09/2026", status: "Em ajuste", tone: "danger" },
  { code: "REQ-2026-039", role: "Jovem Aprendiz Administrativo", post: "Sede Alpha & Omega", requester: "Carlos Nunes", openings: 1, created: "12/09/2026", status: "Aberta", tone: "warning" },
  { code: "REQ-2026-038", role: "Encarregado Operacional", post: "Comrio Ilha", requester: "Renata Costa", openings: 1, created: "11/09/2026", status: "Rascunho", tone: "neutral" },
];

export const vacancies = [
  { code: "2026-0157", role: "Auxiliar de Serviços Gerais", post: "Leblon Power", city: "Rio de Janeiro · RJ", owner: "Lucas", candidates: 27, openings: 4, stage: "Triagem", status: "Ativa", sla: "No prazo", slaTone: "success" },
  { code: "2026-0156", role: "Porteiro", post: "Bay View Botafogo", city: "Rio de Janeiro · RJ", owner: "Ana Marques", candidates: 42, openings: 2, stage: "Entrevista RH", status: "Ativa", sla: "Atenção", slaTone: "warning" },
  { code: "2026-0155", role: "Jovem Aprendiz Administrativo", post: "Sede Alpha & Omega", city: "Rio de Janeiro · RJ", owner: "Lucas", candidates: 18, openings: 1, stage: "Contato", status: "Rascunho", sla: "Em preparo", slaTone: "neutral" },
  { code: "2026-0154", role: "Encarregado Operacional", post: "Comrio Ilha", city: "Rio de Janeiro · RJ", owner: "Fernanda Silva", candidates: 16, openings: 1, stage: "Entrevista Gestor", status: "Ativa", sla: "No prazo", slaTone: "success" },
];

export const homeActions = [
  { title: "Revisar currículos importados", detail: "27 currículos aguardam validação do RH", owner: "Ana Marques", due: "Hoje", route: "kanban" },
  { title: "Analisar requisição pendente", detail: "Auxiliar de Serviços Gerais · Leblon Power", owner: "RH", due: "Pendente", route: "requisitions" },
  { title: "Confirmar endereço para mobilidade", detail: "O candidato informou somente o município", owner: "Lucas", due: "Hoje", route: "kanban" },
];

export const recentActivity = [
  { title: "Extração de currículo concluída", detail: "Candidato enviado para revisão", time: "Hoje, 10:42", tone: "success" },
  { title: "Requisição registrada", detail: "REQ-2026-041 · Leblon Power", time: "Hoje, 09:18", tone: "info" },
  { title: "Vaga retornada para ajuste", detail: "Descrição de atividades precisa de revisão", time: "Hoje, 08:27", tone: "warning" },
];
