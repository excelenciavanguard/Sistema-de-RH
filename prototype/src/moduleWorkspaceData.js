export const talentCandidates = [
  { id: 1, name: "Rafael Santos", initials: "RS", role: "Auxiliar de Serviços Gerais", experience: "4 anos de experiência", education: "Ensino médio completo", tags: ["Comprovado", "Limpeza"], location: "Leblon · RJ", availability: "Disponível agora", availabilityTone: "success", lastContact: "Hoje", opportunities: "2 vagas compatíveis", mobility: "Rota disponível", source: "RioVagas" },
  { id: 2, name: "Mariana Lima", initials: "ML", role: "Auxiliar de Limpeza", experience: "3 anos de experiência", education: "NR-35", tags: ["Comprovado", "Limpeza"], location: "Botafogo · RJ", availability: "Confirmar interesse", availabilityTone: "warning", lastContact: "Há 3 dias", opportunities: "1 vaga compatível", mobility: "Mobilidade pendente", source: "Quickin" },
  { id: 3, name: "André Cardoso", initials: "AC", role: "Porteiro", experience: "5 anos de experiência", education: "CNH B", tags: ["Comprovado", "Porteiro", "CNH B"], location: "Santa Cruz · RJ", availability: "Disponível em 15 dias", availabilityTone: "warning", lastContact: "Há 8 dias", opportunities: "Ver oportunidades", mobility: "Rota disponível", source: "Indeed" },
  { id: 4, name: "Beatriz Nunes", initials: "BN", role: "Recepcionista", experience: "2 anos de experiência", education: "Informática intermediária", tags: ["Declarado", "Atendimento"], location: "Tijuca · RJ", availability: "Disponível agora", availabilityTone: "success", lastContact: "Ontem", opportunities: "3 vagas compatíveis", mobility: "Rota disponível", source: "WhatsApp" },
  { id: 5, name: "Eduardo Silva", initials: "ES", role: "Auxiliar Operacional", experience: "1 ano de experiência", education: "Ensino médio completo", tags: ["Revisar", "Operacional"], location: "Duque de Caxias · RJ", availability: "Interesse a confirmar", availabilityTone: "warning", lastContact: "Há 12 dias", opportunities: "1 vaga compatível", mobility: "Mobilidade pendente", source: "Gmail" },
  { id: 6, name: "Fernanda Rocha", initials: "FR", role: "Supervisora de Limpeza", experience: "6 anos de experiência", education: "Liderança de equipe", tags: ["Comprovado", "Limpeza"], location: "Centro · RJ", availability: "Disponível agora", availabilityTone: "success", lastContact: "Hoje", opportunities: "2 vagas compatíveis", mobility: "Rota disponível", source: "Banco de talentos" },
];

export const agendaEvents = [
  { id: 1, day: 1, start: 9, duration: 1, type: "interview", title: "Entrevista RH", person: "Rafael Santos", location: "Sala 3 · RH", status: "Confirmada" },
  { id: 2, day: 2, start: 10, duration: 1, type: "interview", title: "Entrevista Gestor", person: "Mariana Lima", location: "Teams", status: "Confirmada" },
  { id: 3, day: 3, start: 14, duration: 2, type: "training", title: "Treinamento", person: "Integração", location: "Sala 1 · RH", status: "Pendente" },
  { id: 4, day: 4, start: 11, duration: 1, type: "task", title: "Prazo vaga", person: "Leblon Power", location: "Entrega", status: "Pendente" },
];

export const admissionCandidates = [
  { id: 1, name: "Mariana Lima", vacancy: "Auxiliar de Serviços Gerais", post: "Leblon Power", documents: 6, total: 9, pending: 3, deadline: "22/04/2025", owner: "Ana Marques", status: "Em andamento", tone: "info" },
  { id: 2, name: "Rafael Costa", vacancy: "Vigia", post: "Leblon Power", documents: 8, total: 9, pending: 1, deadline: "25/04/2025", owner: "Carlos Mendes", status: "Em andamento", tone: "info" },
  { id: 3, name: "Juliana Alves", vacancy: "Recepcionista", post: "Centro", documents: 3, total: 9, pending: 6, deadline: "23/04/2025", owner: "Fernanda Souza", status: "Pendente", tone: "warning" },
  { id: 4, name: "Bruno Martins", vacancy: "Auxiliar Administrativo", post: "Centro", documents: 9, total: 9, pending: 0, deadline: "20/04/2025", owner: "Ricardo Dias", status: "Concluído", tone: "success" },
  { id: 5, name: "Camila Rocha", vacancy: "Copeira", post: "Zona Sul", documents: 5, total: 9, pending: 4, deadline: "24/04/2025", owner: "Ana Marques", status: "Em andamento", tone: "info" },
  { id: 6, name: "Lucas Pereira", vacancy: "Zelador", post: "Barra Tower", documents: 2, total: 9, pending: 7, deadline: "28/04/2025", owner: "Daniela Ribeiro", status: "Pendente", tone: "warning" },
  { id: 7, name: "Beatriz Nunes", vacancy: "Auxiliar de Serviços Gerais", post: "Barra Tower", documents: 7, total: 9, pending: 2, deadline: "26/04/2025", owner: "Carlos Mendes", status: "Em andamento", tone: "info" },
  { id: 8, name: "Aline Vieira", vacancy: "Auxiliar Administrativo", post: "Leblon Power", documents: 9, total: 9, pending: 0, deadline: "18/04/2025", owner: "Ricardo Dias", status: "Concluído", tone: "success" },
];

export const documentChecklist = [
  { name: "Documento de identificação", status: "Recebido", tone: "success", date: "15/04/2025", action: "Visualizar" },
  { name: "CPF", status: "Validado", tone: "success", date: "16/04/2025", action: "Visualizar" },
  { name: "Comprovante de residência", status: "Pendente", tone: "danger", date: "—", action: "Solicitar" },
  { name: "Carteira de trabalho", status: "Recebido", tone: "success", date: "14/04/2025", action: "Visualizar" },
  { name: "Dados bancários", status: "Pendente", tone: "danger", date: "—", action: "Solicitar" },
  { name: "Exame admissional", status: "Agendado", tone: "warning", date: "18/04/2025", action: "Ver detalhes" },
];

export const trainingClasses = [
  { id: 1, name: "Integração de novos colaboradores", type: "Integração", unit: "Matriz", date: "24/04/2025", location: "Sala 1 RH", participants: 12, confirmed: 9, status: "Em andamento", tone: "info" },
  { id: 2, name: "Segurança e procedimentos", type: "Obrigatório", unit: "Leblon Power", date: "25/04/2025", location: "Auditório", participants: 18, confirmed: 14, status: "Em andamento", tone: "info" },
  { id: 3, name: "Atendimento ao cliente", type: "Desenvolvimento", unit: "Centro", date: "28/04/2025", location: "Sala 3", participants: 15, confirmed: 10, status: "Programada", tone: "neutral" },
  { id: 4, name: "Conduta e ética", type: "Obrigatório", unit: "Zona Sul", date: "29/04/2025", location: "Sala 2", participants: 20, confirmed: 12, status: "Programada", tone: "neutral" },
  { id: 5, name: "Qualidade nos serviços", type: "Desenvolvimento", unit: "Barra Tower", date: "30/04/2025", location: "Sala 1", participants: 16, confirmed: 11, status: "Programada", tone: "neutral" },
];

export const integrationSources = [
  { id: "weboper", name: "Weboper MySQL", category: "Dados", purpose: "Banco de dados interno", status: "Somente leitura pendente", tone: "warning", lastSync: "Não realizada", description: "Consulta dos postos ativos no Weboper sem alterar os dados de origem.", requirements: ["Usuário MySQL somente leitura", "Acesso restrito à tabela CAD_CLIENTE", "Teste de sincronização controlado"] },
  { id: "quickin", name: "Quickin API", category: "Entradas", purpose: "Importação de currículos", status: "Teste pendente", tone: "warning", lastSync: "Não realizada", description: "Migração assistida de vagas, candidatos e históricos disponíveis na API.", requirements: ["Validar token em ambiente de teste", "Mapear paginação e limites", "Conferir cobertura dos currículos"] },
  { id: "gmail", name: "Gmail RioVagas", category: "Entradas", purpose: "Caixa de e-mails", status: "Configuração pendente", tone: "warning", lastSync: "Não realizada", description: "Importação da caixa de recrutamento usada pelo canal RioVagas.", requirements: ["Confirmar conta e pasta", "Definir período histórico", "Testar leitura sem mover mensagens"] },
  { id: "kinghost", name: "KingHost IMAP", category: "Entradas", purpose: "E-mails de candidatos", status: "Não testada", tone: "warning", lastSync: "Não realizada", description: "Leitura controlada de anexos recebidos na caixa corporativa.", requirements: ["Confirmar hospedagem ou revenda", "Validar pasta de recrutamento", "Testar SSL/TLS na porta 993"] },
  { id: "openai", name: "OpenAI", category: "IA", purpose: "Extração e descrição de vagas", status: "Ambiente de teste", tone: "info", lastSync: "Não se aplica", description: "Extração estruturada e geração assistida, sempre sujeitas à revisão humana.", requirements: ["Definir modelo aprovado", "Aplicar schema estruturado", "Configurar limites de custo"] },
  { id: "gemini", name: "Gemini", category: "IA", purpose: "Comparação em laboratório", status: "Ambiente de teste", tone: "info", lastSync: "Não se aplica", description: "Segundo provedor usado apenas para comparação controlada de extrações.", requirements: ["Validar timeout", "Registrar custos", "Não promover resultado sem revisão"] },
  { id: "maps", name: "Google Maps Platform", category: "Mobilidade", purpose: "Geocodificação e rotas", status: "Conta e chave pendentes", tone: "danger", lastSync: "Não realizada", description: "Geocodificação, rotas de transporte público, conduções, duração e estimativas de custo.", requirements: ["Conta Google Cloud", "Chave de API restrita", "APIs de rotas e geocodificação", "Quotas e alertas de custo"] },
  { id: "whatsapp", name: "WhatsApp", category: "Comunicação", purpose: "Questionários com candidatos", status: "Provedor pendente", tone: "warning", lastSync: "Não realizada", description: "Envio oficial e controlado de questionários e lembretes.", requirements: ["Conta WhatsApp Business Platform", "Provedor oficial", "Templates aprovados", "Opt-in e controle de frequência"] },
  { id: "indeed", name: "Indeed", category: "Entradas", purpose: "Publicação e candidaturas", status: "Capacidade desconhecida", tone: "warning", lastSync: "Não realizada", description: "Integração a validar conforme recursos disponíveis para a conta da empresa.", requirements: ["Confirmar acesso de parceiro", "Validar API ou exportação", "Mapear limites da conta gratuita"] },
];

export const adminUsers = [
  { id: 1, name: "Lucas", initials: "L", email: "lucas@alpharh.com.br", area: "Diretoria", profile: "Acesso integral", lastAccess: "22/04/2025 09:15", status: "Ativo", tone: "success" },
  { id: 2, name: "Ana Marques", initials: "A", email: "ana.marques@alpharh.com.br", area: "RH", profile: "Gestora de recrutamento", lastAccess: "22/04/2025 08:42", status: "Ativo", tone: "success" },
  { id: 3, name: "Carlos Souza", initials: "C", email: "carlos.souza@alpharh.com.br", area: "Operações", profile: "Solicitante", lastAccess: "21/04/2025 17:30", status: "Ativo", tone: "success" },
  { id: 4, name: "Jurídico Alpha", initials: "J", email: "juridico@alpharh.com.br", area: "Jurídico", profile: "Acesso restrito", lastAccess: "20/04/2025 14:12", status: "Bloqueado", tone: "danger" },
];

export const adminPosts = [
  { id: "CLI-0001", name: "Leblon Power", legalName: "Leblon Power Energia S.A.", address: "Av. Ataulfo de Paiva, 1350 · Leblon", city: "Rio de Janeiro/RJ", owner: "Ana Souza", status: "Ativo", lastSync: "22/04/2025 08:14" },
  { id: "CLI-0002", name: "Centro Empresarial", legalName: "Centro Empresarial Rio Ltda.", address: "Rua da Candelária, 65 · Centro", city: "Rio de Janeiro/RJ", owner: "Bruno Almeida", status: "Ativo", lastSync: "21/04/2025 17:32" },
  { id: "CLI-0003", name: "Matriz", legalName: "Alpha Serviços S.A.", address: "Av. das Américas, 500 · Barra da Tijuca", city: "Rio de Janeiro/RJ", owner: "Carla Mendes", status: "Ativo", lastSync: "22/04/2025 07:55" },
  { id: "CLI-0004", name: "Barra Tower", legalName: "Barra Tower Empreendimentos Ltda.", address: "Av. Ayrton Senna, 3000 · Barra da Tijuca", city: "Rio de Janeiro/RJ", owner: "Diego Lima", status: "Ativo", lastSync: "21/04/2025 19:28" },
];

export const recruitmentStages = [
  { order: 1, name: "Candidatura", sla: "—", color: "#6b7280", automation: "Enviar e-mail de confirmação" },
  { order: 2, name: "Triagem", sla: "2 dias úteis", color: "#2563eb", automation: "Mover para Contato (se aprovado)" },
  { order: 3, name: "Contato", sla: "2 dias úteis", color: "#10b981", automation: "Enviar e-mail para agendamento" },
  { order: 4, name: "Entrevista RH", sla: "3 dias úteis", color: "#8b5cf6", automation: "Criar tarefa para o recrutador" },
  { order: 5, name: "Entrevista Gestor", sla: "3 dias úteis", color: "#f59e0b", automation: "Notificar gestor da vaga" },
  { order: 6, name: "Pesquisa", sla: "2 dias úteis", color: "#ec4899", automation: "Enviar pesquisa de feedback" },
  { order: 7, name: "Entrega de documentos", sla: "3 dias úteis", color: "#14b8a6", automation: "Solicitar documentos via e-mail" },
  { order: 8, name: "Treinamento", sla: "5 dias úteis", color: "#6366f1", automation: "Criar acesso no LMS" },
  { order: 9, name: "Contratação", sla: "—", color: "#22c55e", automation: "Enviar e-mail de boas-vindas" },
];
