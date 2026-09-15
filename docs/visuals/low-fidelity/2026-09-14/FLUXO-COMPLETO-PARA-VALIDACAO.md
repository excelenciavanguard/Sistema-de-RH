# Alpha RH — fluxo completo para validação

Data de organização: 14/09/2026.

Este documento coloca os protótipos na ordem em que o trabalho acontece. As imagens são propostas de baixa fidelidade, não telas implementadas. Use as versões `v2` quando indicadas.

## Fluxo principal

### 1. Solicitar e aprovar a necessidade

| Ordem | Responsável | Ação | Protótipo |
|---:|---|---|---|
| 1 | Operações | Criar e enviar a requisição | [01 — Requisição](01-requisicao-operacoes.png) |
| 2 | Diretoria | Aprovar, devolver para ajuste ou rejeitar | [02 — Aprovação](02-aprovacao-diretoria.png) |

Regra confirmada: **Operações solicita → Diretoria decide → RH cria a vaga**. A aprovação não publica a vaga automaticamente.

### 2. Preparar e publicar a vaga

Todas as imagens abaixo representam abas do mesmo formulário, não módulos diferentes.

| Ordem | Aba | Protótipo |
|---:|---|---|
| 3 | Detalhes | [03 — Criar vaga, versão com navegação](03-criacao-vaga-rh-v2-navegacao.png) |
| 4 | Descrição e apoio da IA | [04 — Descrição](04-descricao-vaga.png) |
| 5 | Requisitos profissionais | [05 — Requisitos](05-requisitos-vaga.png) |
| 6 | Perguntas da candidatura | [06 — Perguntas](06-perguntas-vaga.png) |
| 7 | Etapas do processo | [07 — Etapas](07-etapas-vaga.png) |
| 8 | Conferência e publicação | [08 — Revisão/Publicação](08-revisao-publicacao-vaga.png) |

### 3. Abrir a vaga e receber candidatos

| Ordem | Ação | Protótipo |
|---:|---|---|
| 9 | Localizar a vaga | [09 — Lista de vagas](09-lista-vagas.png) |
| 10 | Abrir o processo seletivo | [10 — Kanban, versão com navegação](10-kanban-vaga-v2-navegacao.png) |
| 11 | Adicionar currículo manualmente | [21 — Importar candidato](21-modal-importar-candidato.png) |

O fluxo de importação é: **Arquivo → Extração → Revisão → Adicionar ao Kanban**. A extração não adiciona automaticamente o candidato.

### 4. Analisar a candidatura

As imagens 11 a 16 são abas do mesmo modal aberto ao clicar no candidato no Kanban.

| Ordem | Conferência | Protótipo |
|---:|---|---|
| 12 | Visão geral e pendências | [11 — Resumo](11-modal-candidato-resumo.png) |
| 13 | Arquivo original | [12 — Currículo](12-modal-candidato-curriculo.png) |
| 14 | Evidências da extração | [15 — Evidências](15-modal-candidato-evidencias.png) |
| 15 | Respostas da candidatura | [14 — Respostas](14-modal-candidato-respostas.png) |
| 16 | Rota, conduções e custos | [13 — Mobilidade](13-modal-candidato-mobilidade.png) |
| 17 | Ações e decisões registradas | [16 — Histórico](16-modal-candidato-historico.png) |

Ordem das abas no sistema: **Resumo → Currículo → Evidências → Respostas → Mobilidade → Histórico**.

### 5. Entrevistar e decidir

| Ordem | Ação | Protótipo |
|---:|---|---|
| 18 | Preparar e registrar entrevista | [19 — Entrevista RH](19-modal-entrevista-rh.png) |
| 19 | Consultar candidaturas encerradas na vaga | [17 — Desclassificados](17-desclassificados-vaga.png) |

Desclassificar encerra somente a candidatura naquela vaga. O perfil permanece no Banco de Talentos e o histórico é preservado.

### 6. Concluir a admissão

As três etapas continuam como colunas do Kanban e abrem o mesmo modal do candidato.

| Ordem | Etapa | Protótipo |
|---:|---|---|
| 20 | Entrega e conferência de documentos | [22 — Documentos](22-modal-entrega-documentos.png) |
| 21 | Treinamentos aplicáveis | [23 — Treinamento](23-modal-treinamento.png) |
| 22 | Conferência final | [24 — Contratação](24-modal-contratacao.png) |

Fluxo: **Entrega de documentos → Treinamento → Contratação**. Nenhuma contratação é concluída automaticamente.

## Telas globais de apoio

Estas telas não pertencem a uma única vaga ou etapa.

| Tela | Finalidade | Protótipo |
|---|---|---|
| Agenda | Reunir entrevistas e compromissos de várias vagas | [18 — Agenda](18-agenda-entrevistas.png) |
| Banco de Talentos | Encontrar perfis e criar candidaturas em outras vagas | [20 — Banco de Talentos](20-banco-de-talentos.png) |

## Fora desta rodada

- Integrações e erros de processamento.
- Usuários, funções e permissões.
- Postos sincronizados do Weboper.
- Interface de alta fidelidade e identidade visual final.
- Implementação em React, FastAPI e MySQL.

Esses itens devem ser detalhados depois que o fluxo principal for validado pela equipe.
