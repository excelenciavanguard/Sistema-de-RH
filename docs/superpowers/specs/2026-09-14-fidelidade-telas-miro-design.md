# Fidelidade das telas do Alpha RH às referências do Miro

**Data:** 14 de setembro de 2026  
**Status:** aprovado em conversa; aguardando revisão do documento  
**Escopo:** frontend demonstrativo, sem autenticação, backend ou integrações reais

## Objetivo

Reconstruir os seis módulos adicionados ao protótipo para que o conteúdo abaixo do cabeçalho corresponda às imagens aprovadas e armazenadas em `docs/visuals/system-screen-pack`. O cabeçalho azul moderno já aprovado permanece como elemento global do sistema.

As imagens do pacote visual passam a ser a fonte de verdade para hierarquia, densidade, composição, filtros, tabelas, painéis laterais, estados e ações. Os dados continuam demonstrativos e devem ser identificados como tal.

## Princípios compartilhados

- Preservar o cabeçalho global atual e seus menus suspensos.
- Usar largura operacional ampla, adequada a monitores de escritório.
- Reproduzir a densidade informacional das referências sem esconder ações essenciais.
- Usar cartões brancos, bordas azuis suaves, sombras discretas e estados semânticos.
- Tornar filtros, abas, seleção de registros e abertura de detalhes interativos no frontend.
- Exibir painéis de detalhe na própria tela quando a referência usar a composição mestre-detalhe.
- Manter textos e dados como demonstração; não afirmar que serviços externos estão conectados.
- Não criar telas de login, privacidade/LGPD, templates ou compliance removidas anteriormente.
- Preservar revisão humana e não implementar decisões automáticas de contratação ou rejeição.

## Banco de talentos

**Referência:** `09-banco-de-talentos.png`

A tela terá navegação interna, título, ações “Adicionar candidato” e “Importar currículos”, aviso operacional, filtros expansivos, filtros ativos, alternância lista/cards, seleção em lote, tabela completa e paginação.

A tabela exibirá candidato, perfil profissional, localidade, disponibilidade, último contato e oportunidades. Selecionar uma pessoa habilita ações em lote como associar à vaga, enviar questionário, adicionar tag e arquivar.

## Agenda

**Referência:** `12-agenda.png`

A tela terá calendário semanal como área principal, filtros de calendários e tipos de compromisso à esquerda e próximos compromissos à direita. Controles de período, visualização e criação de compromisso devem responder visualmente.

Os eventos usarão cores por tipo e manterão horário, título, candidato ou assunto e local/meio da reunião.

## Admissão

**Referências:** `16-documentos-admissao.png`, `16a-treinamentos.png` e `16b-contratacoes-encerramentos.png`

O módulo terá abas para documentos, treinamentos e contratação. Na visão de documentos, a lista de candidatos ficará à esquerda e o checklist da pessoa selecionada à direita. Filtros, seleção de candidato e ações do checklist serão interativos no frontend.

As demais abas seguirão as respectivas referências, preservando o mesmo padrão mestre-detalhe e a continuidade do processo admissional.

## Relatórios

**Referência:** `18-relatorios.png`

A tela terá filtros por período, posto, vaga, responsável e fonte; quatro indicadores principais; gráfico de conversão por etapa; gráfico de tempo médio por etapa; somente um gráfico de pizza para origem dos candidatos; e tabela de vagas com atenção.

Os gráficos serão construídos com elementos acessíveis do frontend e terão rótulos legíveis. O relatório permanecerá demonstrativo e não dependerá de backend.

## Integrações

**Referência:** `19-integracoes.png`

A tela terá filtros por categoria, busca, contadores de situação, grade de integrações e painel lateral do item selecionado. Clicar em um card atualizará o painel de detalhes.

Estados permitidos no protótipo: proposta, não configurada, configuração pendente, ambiente de teste e teste pendente. Nenhuma integração será rotulada como operacional sem validação real. Credenciais nunca serão exibidas ou persistidas no frontend.

## Administração

**Referências:** `20-usuarios-permissoes.png`, `21-postos-estrutura.png` e `22-etapas-fontes-tags-motivos.png`

Uma única rota de Administração terá abas internas:

- **Usuários:** tabela e painel lateral de permissões, com a Diretoria exibindo acesso total.
- **Estrutura:** postos ativos consultados do Weboper em modo demonstrativo, com referência à tabela `CAD_CLIENTE` e sem credenciais.
- **Configurações:** etapas, fontes, tags e motivos profissionais de desclassificação/encerramento.

Selecionar registros e alternar abas deverá atualizar o painel correspondente sem criar novas rotas desnecessárias.

## Componentes e organização

Cada módulo terá um componente de tela dedicado. Elementos repetidos serão extraídos somente quando houver reutilização real: barra de filtros, navegação interna, tabela operacional, estados, painel lateral e controles de seleção.

Os dados demonstrativos ficarão separados dos componentes. A navegação continuará centralizada em `navigation.js` e o shell global continuará em `AppShell.jsx`.

## Responsividade

O alvo principal é desktop amplo. Em telas menores, filtros poderão quebrar linha, tabelas terão rolagem horizontal e painéis laterais passarão para baixo do conteúdo principal. Nenhum conteúdo crítico ficará inacessível.

## Verificação

- Testes de renderização para as seis rotas.
- Testes das principais abas, seleção de registros e atualização de painéis.
- TypeScript sem erros.
- Build de produção concluído.
- Comparação visual, no mesmo viewport, entre cada referência e o protótipo.
- Correção de diferenças graves de estrutura, densidade e hierarquia antes da entrega.

## Fora do escopo

- Login e controle de sessão real.
- Persistência em banco próprio.
- Escrita no Weboper.
- Comunicação real por Gmail, WhatsApp ou plataformas de emprego.
- Chamadas reais para OpenAI, Gemini ou Google Maps.
- Upload e processamento real de documentos nestes seis módulos.
