# Kanban e Laboratório de Extração — Design aprovado

## Objetivo

Criar a primeira aplicação executável do RH para validar o Kanban aprovado e preparar o teste comparativo de extração de currículos com OpenAI e Gemini. A entrega atual é um protótipo frontend funcional, com dados ilustrativos e contrato de integração; não contém chaves, chamadas reais aos fornecedores, autenticação ou persistência.

## Referência visual

- Fonte de verdade: `.impeccable/mocks/approved/kanban-filtros-aprovado.png`.
- Navegação superior em dois níveis, superfícies claras elevadas, topbar azul-marinho, botões sólidos, sombras discretas e cartões compactos.
- Filtros no padrão aprovado “Faixa Inteligente”.
- Colunas: Novos, Triagem, Contato, Entrevista, Proposta e Contratação.

## Fluxo funcional

1. O RH abre a vaga “Auxiliar de Serviços Gerais · Leblon Power”.
2. Pesquisa e filtra candidatos; pode personalizar filtros visíveis.
3. Arrasta candidatos entre etapas e vê os contadores atualizados.
4. Abre o candidato em um modal 360 com Resumo, Currículo, Evidências, Respostas, Mobilidade e Histórico.
5. Visualiza uma prévia ilustrativa do currículo e o atalho de download permanece desabilitado quando não existe arquivo real.
6. Abre “Testar extração”, escolhe PDF, DOC, DOCX ou TXT e seleciona OpenAI, Gemini ou Comparar ambos.
7. Em modo demonstração, a interface apresenta resultados estruturados dos dois provedores e deixa explícito que nenhuma API real foi chamada.

## Componentes e estado

- `AppShell`: cabeçalho, navegação principal e contextual.
- `VacancyHeader`: vaga, situação, quantidade e responsável.
- `SmartFilters`: busca, filtros favoritos, chips ativos e personalização.
- `KanbanBoard`, `KanbanColumn`, `CandidateCard`: quadro, drag-and-drop e cartões.
- `CandidateModal`: visão 360 com documento e evidências.
- `ExtractionLab`: upload, escolha de provedor, estado de processamento, comparação e erro.
- Dados e tipos ficam isolados para substituição posterior por API.

## Estados obrigatórios

- Padrão, hover, foco por teclado, filtro ativo, popover aberto, arraste, modal aberto e carregamento da extração.
- Upload sem arquivo, formato inválido, arquivo selecionado e resultado demonstrativo.
- Candidato com foto, sem foto, currículo reenviado e informação pendente.
- Layout responsivo: o quadro mantém rolagem horizontal; navegações e filtros permanecem utilizáveis em telas menores.

## Contrato futuro da extração

- O frontend enviará `multipart/form-data` para `POST /api/extractions/compare` com `file` e `providers`.
- A resposta conterá `request_id`, metadados do arquivo e um resultado por provedor com estado, duração, campos extraídos, evidências e erros.
- Chaves e chamadas de OpenAI/Gemini existirão somente no backend FastAPI e serão configuradas por variáveis de ambiente.

## Fora do escopo desta entrega

- Integração real com OpenAI ou Gemini.
- Backend FastAPI, banco, upload persistente, login, Weboper, Gmail, Google Maps ou download real.
- Decisões automáticas sobre contratação.

## Critérios de aceite

- Reprodução visual próxima ao mock aprovado em desktop.
- Interações principais funcionam sem console errors.
- Build e testes passam.
- A interface nunca afirma que uma extração demonstrativa veio de uma API real.
